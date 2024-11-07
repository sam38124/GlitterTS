var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { UmClass } from './um-class.js';
import { ApiWallet } from '../../glitter-base/route/wallet.js';
import { ApiShop } from '../../glitter-base/route/shopping.js';
const html = String.raw;
const css = String.raw;
export class UMInfo {
    static main(gvc, widget, subData) {
        const glitter = gvc.glitter;
        const vm = {
            dataList: [],
            amount: 0,
            oldestText: '',
        };
        const ids = {
            view: glitter.getUUID(),
            amount: glitter.getUUID(),
            oldestText: glitter.getUUID(),
        };
        const loadings = {
            view: true,
        };
        gvc.addStyle(css `
            .um-info-title {
                color: #000000;
                font-size: 28px;
            }
            .um-info-insignia {
                border-radius: 20px;
                height: 32px;
                padding: 8px 16px;
                font-size: 14px;
                display: inline-block;
                font-weight: 500;
                line-height: 1;
                text-align: center;
                white-space: nowrap;
                vertical-align: baseline;
                background: #7e7e7e;
                color: #fff;
            }
            .um-info-note {
                color: #393939;
                font-size: 16px;
            }
            .um-info-event {
                color: #3564c0;
                font-size: 16px;
                cursor: pointer;
            }
            .um-title {
                text-align: start;
                font-size: 16px;
                font-weight: 700;
                line-height: 25.2px;
                word-wrap: break-word;
                color: #292218;
            }
            .um-content {
                text-align: start;
                font-size: 14px;
                font-weight: 400;
                line-height: 25.2px;
                word-wrap: break-word;
                color: #292218;
            }
            .um-linebar-container {
                flex-direction: column;
                justify-content: flex-start;
                align-items: flex-start;
                gap: 8px;
                display: flex;
            }
            .um-text-danger {
                color: #aa4b4b;
            }
            .um-linebar {
                border-radius: 40px;
                flex-direction: column;
                justify-content: flex-start;
                align-items: flex-start;
                display: flex;
                position: relative;
                overflow: hidden;
            }
            .um-linebar-behind {
                position: absolute;
                width: 100%;
                height: 100%;
                opacity: 0.4;
                background: #292218;
            }
            .um-linebar-fill {
                padding: 10px;
                border-radius: 10px;
                height: 100%;
            }

            .bgw-input {
                flex-grow: 1;
                padding: 9px 12px;
                border-radius: 10px;
                border: 1px solid #393939;
                background-color: #ffffff;
                appearance: none;
                width: 100%;
            }

            .bgw-input:focus {
                outline: 0;
            }

            .bgw-input-readonly:focus-visible {
                outline: 0;
            }
        `);
        gvc.addStyle(css `
            .um-rb-bgr {
                background: whitesmoke;
                justify-content: space-between;
                gap: 18px;
            }

            .um-rb-amount {
                display: flex;
                align-items: center;
                font-size: 36px;
                line-height: 36px;
            }

            .um-container {
                display: flex;
                justify-content: center;
                margin: 2rem auto;
                width: 100%;
            }

            .um-th-bar {
                justify-content: space-around;
                align-items: center;
                height: 40px;
            }
            .um-th {
                text-align: start;
                font-size: 18px;
                font-style: normal;
                font-weight: 700;
                color: #292218;
            }

            .um-td-bar {
                justify-content: space-around;
                align-items: center;
                height: 40px;
                border-bottom: 1px solid #e2d6cd;
            }

            .um-td {
                text-align: start;
                font-size: 18px;
                font-style: normal;
                font-weight: 400;
                color: #292218;
            }

            .um-mobile-area {
                padding: 28px;
                margin-top: 12px;
                background: white;
                border-radius: 20px;
                overflow: hidden;
                border: 1px solid;
                justify-content: center;
                align-items: flex-start;
                display: flex;
                flex-direction: column;
                gap: 12px;
                border: 1px solid #292218;
            }

            .um-mobile-text {
                text-align: start;
                font-size: 16px;
                font-weight: 400;
                line-height: 22.4px;
                letter-spacing: 0.64px;
                word-wrap: break-word;
                color: #292218;
            }

            @media (min-width: 576px) {
                .um-container {
                    max-width: 540px;
                }
            }

            @media (min-width: 768px) {
                .um-container {
                    max-width: 720px;
                }
            }

            @media (min-width: 992px) {
                .um-container {
                    max-width: 960px;
                }
            }

            @media (min-width: 1200px) {
                .um-container {
                    max-width: 1140px;
                }
            }

            @media (min-width: 1400px) {
                .um-container {
                    max-width: 1320px;
                }
            }
        `);
        return gvc.bindView({
            bind: ids.view,
            view: () => {
                if (loadings.view) {
                    return UmClass.spinner();
                }
                else {
                    const isWebsite = document.body.clientWidth > 768;
                    return html `
                        <div class="um-container row">
                            <div class="col-12">${UmClass.nav(gvc)}</div>
                            <div class="col-12 mt-3 mt-lg-5 p-4 px-lg-5 mx-auto d-flex um-rb-bgr ${isWebsite ? '' : 'flex-column'}">
                                <div class="d-flex ${isWebsite ? 'gap-4' : 'gap-3'}">
                                    <div class="fa-duotone fa-coins fs-1 d-flex align-items-center justify-content-center"></div>
                                    <div class="${isWebsite ? '' : 'd-flex align-items-center gap-2'}">
                                        <div class="fw-500 fs-6">現有購物金</div>
                                        <div class="fw-bold mt-0 mt-md-1 um-rb-amount">
                                            ${gvc.bindView({
                        bind: ids.amount,
                        view: () => `${vm.amount}`,
                    })}
                                        </div>
                                    </div>
                                </div>
                                <div class="d-flex align-items-center">
                                    <div class="d-flex align-items-center gap-3">
                                        ${gvc.bindView({
                        bind: ids.oldestText,
                        view: () => `${vm.oldestText}`,
                    })}
                                    </div>
                                </div>
                            </div>
                            <div class="col-12 mt-3">
                                <div class="mx-auto orderList pt-3 mb-4 s158323">
                                    ${(() => {
                        if (vm.dataList.length === 0) {
                            return html `<div class="d-flex align-items-center justify-content-center flex-column w-100 mx-auto">
                                                <lottie-player
                                                    style="max-width: 100%;width: 300px;"
                                                    src="https://assets10.lottiefiles.com/packages/lf20_rc6CDU.json"
                                                    speed="1"
                                                    loop="true"
                                                    background="transparent"
                                                ></lottie-player>
                                                <span class="mb-5 fs-5">尚未取得任何購物金。</span>
                                            </div>`;
                        }
                        const header = [
                            {
                                title: '建立日期',
                            },
                            {
                                title: '到期日期',
                            },
                            {
                                title: '購物金項目',
                            },
                            {
                                title: '獲得款項',
                            },
                            {
                                title: '餘額',
                            },
                        ];
                        function threeDayLater(deadlineString) {
                            var now = new Date();
                            var date = new Date();
                            date.setDate(now.getDate() + 3);
                            var deadline = new Date(deadlineString);
                            return deadline <= date && deadline > now;
                        }
                        function formatText(item) {
                            return [
                                glitter.ut.dateFormat(new Date(item.created_time), 'yyyy/MM/dd hh:mm'),
                                (() => {
                                    if (item.money <= 0) {
                                        return `-`;
                                    }
                                    else if (item.deadline.includes('2999')) {
                                        return '無期限';
                                    }
                                    else {
                                        return `${glitter.ut.dateFormat(new Date(item.deadline), 'yyyy/MM/dd hh:mm')}
                                                  ${threeDayLater(item.deadline) && item.remain && item.remain > 0 ? html `<span class="badge bg-faded-danger text-danger ms-1">即將到期</span>` : ''}`;
                                    }
                                })(),
                                (() => {
                                    if (item.orderID) {
                                        if (item.money > 0) {
                                            return `訂單『 ${item.orderID} 』獲得購物金`;
                                        }
                                        else {
                                            return `訂單『 ${item.orderID} 』使用購物金`;
                                        }
                                    }
                                    else {
                                        return item.note || `手動增減購物金`;
                                    }
                                })(),
                                item.money.toLocaleString(),
                                item.money > 0 ? item.remain.toLocaleString() : '-',
                            ];
                        }
                        if (isWebsite) {
                            const flexList = [1.4, 1.4, 1, 0.4, 0.4];
                            return html `
                                                <div class="w-100 d-sm-flex py-4 um-th-bar">
                                                    ${header
                                .map((item, index) => {
                                return html `<div class="um-th" style="flex: ${flexList[index]};">${item.title}</div>`;
                            })
                                .join('')}
                                                </div>
                                                ${vm.dataList
                                .map((item) => {
                                return html `<div class="w-100 d-sm-flex py-5 um-td-bar">
                                                            ${formatText(item)
                                    .map((dd, index) => {
                                    return html `<div class="um-td" style="flex: ${flexList[index]}">${dd}</div>`;
                                })
                                    .join('')}
                                                        </div>`;
                            })
                                .join('')}
                                            `;
                        }
                        return html `<div class="w-100 d-sm-none mb-3 s162413">
                                            ${vm.dataList
                            .map((item) => {
                            return html `<div class="um-mobile-area">
                                                        ${formatText(item)
                                .map((dd, index) => {
                                return html `<div class="um-mobile-text">${header[index].title}: ${dd}</div>`;
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
                    gvc.addMtScript([{ src: `https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js` }], () => {
                        ApiShop.getRebate({}).then((res) => __awaiter(this, void 0, void 0, function* () {
                            if (res.result && res.response.sum) {
                                vm.amount = res.response.sum;
                                gvc.notifyDataChange(ids.amount);
                            }
                        }));
                        ApiWallet.getRebate({
                            type: 'me',
                            limit: 10000,
                            page: 0,
                        }).then((res) => __awaiter(this, void 0, void 0, function* () {
                            if (res.result && res.response.oldest) {
                                const oldest = res.response.oldest;
                                vm.oldestText = html `您尚有 ${oldest.remain} 元購物金<br />將於 ${glitter.ut.dateFormat(new Date(oldest.deadline), 'yyyy/MM/dd hh:mm')} 到期`;
                                gvc.notifyDataChange(ids.oldestText);
                            }
                        }));
                        ApiWallet.getRebate({
                            type: 'me',
                            limit: 10000,
                            page: 0,
                        }).then((res) => __awaiter(this, void 0, void 0, function* () {
                            if (res.result && res.response.data) {
                                vm.dataList = res.response.data;
                                loadings.view = false;
                                gvc.notifyDataChange(ids.view);
                            }
                        }));
                    }, () => { });
                }
            },
        });
    }
}
window.glitter.setModule(import.meta.url, UMInfo);
