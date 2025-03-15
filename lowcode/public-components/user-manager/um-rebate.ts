import { GVC } from '../../glitterBundle/GVController.js';
import { UmClass } from './um-class.js';
import { ApiWallet } from '../../glitter-base/route/wallet.js';
import { ApiShop } from '../../glitter-base/route/shopping.js';
import { UMVoucher } from './um-voucher.js';
import { CheckInput } from '../../modules/checkInput.js';
import { Language } from '../../glitter-base/global/language.js';

const html = String.raw;

interface UserData {
    name: string;
    birth: string;
    email: string;
    phone: string;
    repeatPwd: string;
}

interface RebateInfo {
    id: number;
    orderID: string;
    userID: number;
    money: number;
    remain: number;
    status: number;
    note: string;
    created_time: string;
    deadline: string;
    userData: UserData;
}

export class UMRebate {
    static main(gvc: GVC, widget: any, subData: any) {
        const glitter = gvc.glitter;
        if (glitter.getUrlParameter('page') === 'voucher-list') {
            return UMVoucher.main(gvc, widget, subData);
        }
        const vm = {
            dataList: [] as RebateInfo[],
            amount: 0,
            oldestText: '',
            rebateConfig: {} as any,
        };
        const ids = {
            view: glitter.getUUID(),
        };
        const loadings = {
            view: true,
        };

        return gvc.bindView({
            bind: ids.view,
            view: () => {
                if (loadings.view) {
                    return UmClass.spinner();
                } else {
                    const isWebsite = document.body.clientWidth > 768;
                    vm.rebateConfig.title = CheckInput.isEmpty(vm.rebateConfig.title) ? Language.text('shopping_credit') : vm.rebateConfig.title;
                    return html`
                        <div class="um-container row mx-auto">
                            <div class="col-12">${UmClass.nav(gvc)}</div>
                            <div class="col-12 mt-3 mt-lg-5 p-4 px-lg-5 mx-auto d-flex um-rb-bgr ${isWebsite ? '' : 'flex-column'}">
                                <div class="d-flex ${isWebsite ? 'gap-4' : 'gap-3'}">
                                    <div class="fa-duotone fa-coins fs-1 d-flex align-items-center justify-content-center"></div>
                                    <div class="${isWebsite ? '' : 'd-flex align-items-center gap-2'}">
                                        <div class="fw-500 fs-6">${vm.rebateConfig.title}</div>
                                        <div class="fw-bold mt-0 mt-md-1 mb-1 um-rb-amount">${vm.amount.toLocaleString()}</div>
                                    </div>
                                </div>
                                <div class="d-flex align-items-center">
                                    <div class="d-flex align-items-center gap-3">${vm.oldestText.replace(`@{{rebate_title}}`, vm.rebateConfig.title)}</div>
                                </div>
                            </div>
                            <div class="col-12 mt-2" style="min-height: 500px;">
                                <div class="mx-auto orderList pt-md-3 mb-4">
                                    ${(() => {
                                        if (vm.dataList.length === 0) {
                                            return html`<div class="d-flex align-items-center justify-content-center flex-column w-100 mx-auto">
                                                <lottie-player
                                                    style="max-width: 100%;width: 300px;"
                                                    src="https://assets10.lottiefiles.com/packages/lf20_rc6CDU.json"
                                                    speed="1"
                                                    loop="true"
                                                    background="transparent"
                                                ></lottie-player>
                                                <span class="mb-5 fs-5">${Language.text('no_current_obtain')} ${vm.rebateConfig.title}</span>
                                            </div>`;
                                        }

                                        const header = [
                                            {
                                                title: Language.text('creation_date'),
                                            },
                                            {
                                                title: Language.text('expiration_date'),
                                            },
                                            {
                                                title: Language.text('source'),
                                            },
                                            {
                                                title: Language.text('received_amount'),
                                            },
                                            {
                                                title: Language.text('balance'),
                                            },
                                        ];

                                        function threeDayLater(deadlineString: string) {
                                            // 取得當前時間的 Date 物件
                                            var now = new Date();

                                            // 取得距今三天後的日期
                                            var date = new Date();
                                            date.setDate(now.getDate() + 3);

                                            // 將 item.deadline 轉換為 Date 物件
                                            var deadline = new Date(deadlineString);

                                            // 比較 deadline 是否在距今三天後之前
                                            return deadline <= date && deadline > now;
                                        }

                                        function formatText(item: RebateInfo) {
                                            return [
                                                glitter.ut.dateFormat(new Date(item.created_time), 'yyyy/MM/dd hh:mm'),
                                                (() => {
                                                    if (item.money <= 0) {
                                                        return `-`;
                                                    } else if (item.deadline.includes('2999')) {
                                                        return Language.text('no_expiry');
                                                    } else {
                                                        return html`${glitter.ut.dateFormat(new Date(item.deadline), 'yyyy/MM/dd hh:mm')}
                                                        ${threeDayLater(item.deadline) && item.remain && item.remain > 0
                                                            ? html`<span class="badge bg-faded-danger text-danger ms-1">${Language.text('about_to_expire')}</span>`
                                                            : ''}`;
                                                    }
                                                })(),
                                                (() => {
                                                    if (item.orderID) {
                                                        if (item.money > 0) {
                                                            return `${Language.text('order')}『 ${item.orderID} 』${Language.text('obtain')} ${vm.rebateConfig.title}`;
                                                        } else {
                                                            return `${Language.text('order')}『 ${item.orderID} 』${Language.text('use')} ${vm.rebateConfig.title}`;
                                                        }
                                                    } else {
                                                        return item.note || `${Language.text('manual_adjustment')} ${vm.rebateConfig.title}`;
                                                    }
                                                })(),
                                                item.money.toLocaleString(),
                                                item.money > 0 ? item.remain.toLocaleString() : '-',
                                            ];
                                        }

                                        if (isWebsite) {
                                            const flexList = [1.4, 1.4, 1, 0.4, 0.4];
                                            return html`
                                                <div class="w-100 d-sm-flex py-4 um-th-bar">
                                                    ${header
                                                        .map((item, index) => {
                                                            return html`<div class="um-th" style="flex: ${flexList[index]};">${item.title}</div>`;
                                                        })
                                                        .join('')}
                                                </div>
                                                ${vm.dataList
                                                    .map((item) => {
                                                        return html`<div class="w-100 d-sm-flex py-5 um-td-bar">
                                                            ${formatText(item)
                                                                .map((dd, index) => {
                                                                    return html`<div class="um-td" style="flex: ${flexList[index]}">${dd}</div>`;
                                                                })
                                                                .join('')}
                                                        </div>`;
                                                    })
                                                    .join('')}
                                            `;
                                        }

                                        return html`<div class="w-100 d-sm-none mb-3 s162413">
                                            ${vm.dataList
                                                .map((item) => {
                                                    return html`<div class="um-mobile-area">
                                                        ${formatText(item)
                                                            .map((dd, index) => {
                                                                return html`<div class="um-mobile-text">${header[index].title}: ${dd}</div>`;
                                                            })
                                                            .join('')}
                                                    </div>`;
                                                })
                                                .join('')}
                                        </div> `;
                                    })()}
                                </div>
                            </div>
                        </div>
                    `;
                }
            },
            divCreate: {
                class: 'container',
            },
            onCreate: () => {
                if (loadings.view) {
                    gvc.addMtScript(
                        [{ src: `${ gvc.glitter.root_path}/jslib/lottie-player.js` }],
                        () => {
                            Promise.all([
                                UmClass.getRebateInfo(),
                                new Promise<number>((resolve) => {
                                    ApiShop.getRebate({}).then(async (res) => {
                                        if (res.result && res.response.sum) {
                                            resolve(res.response.sum);
                                        } else {
                                            resolve(0);
                                        }
                                    });
                                }),
                                new Promise<string>((resolve) => {
                                    ApiWallet.getRebate({
                                        type: 'me',
                                        limit: 10000,
                                        page: 0,
                                    }).then(async (res) => {
                                        if (!(res.result && res.response.oldest)) {
                                            resolve('');
                                        }
                                        const oldest = res.response.oldest;
                                        if (!(oldest.remain && oldest.deadline)) {
                                            resolve('');
                                        }

                                        const remainStr = oldest.remain.toLocaleString();
                                        const endDate = glitter.ut.dateFormat(new Date(oldest.deadline), 'yyyy/MM/dd hh:mm');
                                        const text = {
                                            'zh-TW': `您尚有 ${remainStr} @{{rebate_title}} <br />將於 ${endDate} 到期`,
                                            'zh-CN': `您还有 ${remainStr} @{{rebate_title}}  <br />将于 ${endDate} 到期`,
                                            'en-US': `You have ${remainStr} @{{rebate_title}} <br />expiring on ${endDate}`,
                                        } as any;

                                        resolve(text[Language.getLanguage()]);
                                    });
                                }),
                                new Promise<RebateInfo[]>((resolve) => {
                                    ApiWallet.getRebate({
                                        type: 'me',
                                        limit: 10000,
                                        page: 0,
                                    }).then(async (res) => {
                                        if (res.result && res.response.data) {
                                            resolve(res.response.data);
                                        } else {
                                            resolve([]);
                                        }
                                    });
                                }),
                            ]).then((dataList) => {
                                vm.rebateConfig = dataList[0];
                                vm.amount = dataList[1];
                                vm.oldestText = dataList[2];
                                vm.dataList = dataList[3];

                                loadings.view = false;
                                gvc.notifyDataChange(ids.view);
                            });
                        },
                        () => {}
                    );
                }
            },
        });
    }
}

(window as any).glitter.setModule(import.meta.url, UMRebate);
