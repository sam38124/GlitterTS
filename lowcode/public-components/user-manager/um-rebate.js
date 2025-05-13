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
import { UMVoucher } from './um-voucher.js';
import { CheckInput } from '../../modules/checkInput.js';
import { Language } from '../../glitter-base/global/language.js';
const html = String.raw;
export class UMRebate {
    static main(gvc, widget, subData) {
        const glitter = gvc.glitter;
        if (glitter.getUrlParameter('page') === 'voucher-list') {
            return UMVoucher.main(gvc, widget, subData);
        }
        const vm = {
            dataList: [],
            amount: 0,
            oldestText: '',
            rebateConfig: {},
        };
        const ids = {
            view: glitter.getUUID(),
        };
        const loadings = {
            view: true,
        };
        let changePage = (index, type, subData) => { };
        gvc.glitter.getModule(new URL('./official_event/page/change-page.js', gvc.glitter.root_path).href, cl => {
            changePage = cl.changePage;
        });
        return gvc.bindView({
            bind: ids.view,
            view: () => {
                if (loadings.view) {
                    return UmClass.spinner();
                }
                else {
                    const isWebsite = document.body.clientWidth > 768;
                    vm.rebateConfig.title = CheckInput.isEmpty(vm.rebateConfig.title)
                        ? Language.text('shopping_credit')
                        : vm.rebateConfig.title;
                    return html `
            <div class="mx-auto p-0">
              <div class="w-100  align-items-center d-flex py-3 pb-lg-3 pt-lg-0" style="gap:10px;">
                <div
                  class="d-none d-lg-flex"
                  style="background: #FF9705;background: #FF9705;width:4px;height: 20px;"
                  onclick="${gvc.event(() => {
                        gvc.glitter.getModule(new URL(gvc.glitter.root_path + 'official_event/page/change-page.js', import.meta.url).href, cl => {
                            cl.changePage('account_userinfo', 'home', {});
                        });
                    })}"
                ></div>
                <div
                  class="d-flex d-lg-none align-items-center justify-content-center"
                  style="width:20px;height: 20px;"
                  onclick="${gvc.event(() => {
                        gvc.glitter.getModule(new URL(gvc.glitter.root_path + 'official_event/page/change-page.js', import.meta.url).href, cl => {
                            cl.changePage('account_userinfo', 'home', {});
                        });
                    })}"
                >
                  <i class="fa-solid fa-angle-left fs-4"></i>
                </div>
                <div class="um-info-title fw-bold " style="font-size: 24px;">
                  ${`${Language.text('my')}${glitter.share.rebateConfig.title || Language.text('shopping_credit')}`}
                </div>
              </div>
              <div class="col-12  p-4 px-lg-5 mx-auto d-flex um-rb-bgr ${isWebsite ? '' : 'flex-column'}">
                <div class="d-flex ${isWebsite ? 'gap-4' : 'gap-3'}">
                  <div class="fa-duotone fa-coins fs-1 d-flex align-items-center justify-content-center"></div>
                  <div class="${isWebsite ? '' : 'd-flex align-items-center gap-2'}">
                    <div class="fw-500 fs-6">${vm.rebateConfig.title}</div>
                    <div class="fw-bold mt-0 mt-md-1 mb-1 um-rb-amount">${vm.amount.toLocaleString()}</div>
                  </div>
                </div>
                <div class="d-flex align-items-center">
                  <div class="d-flex align-items-center gap-3">
                    ${vm.oldestText.replace(`@{{rebate_title}}`, vm.rebateConfig.title)}
                  </div>
                </div>
              </div>
              <div class="col-12 mt-2" style="min-height: 500px;">
                <div class="mx-auto orderList pt-md-3 mb-4">
                  ${(() => {
                        if (vm.dataList.length === 0) {
                            return html `<div
                        class="d-flex align-items-center justify-content-center flex-column w-100 mx-auto"
                      >
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
                                        return '-';
                                    }
                                    else if (item.deadline.includes('2999')) {
                                        return Language.text('no_expiry');
                                    }
                                    else {
                                        return html `${glitter.ut.dateFormat(new Date(item.deadline), 'yyyy/MM/dd hh:mm')}
                            ${threeDayLater(item.deadline) && item.remain && item.remain > 0
                                            ? html `<span class="badge bg-faded-danger text-danger ms-1"
                                  >${Language.text('about_to_expire')}</span
                                >`
                                            : ''}`;
                                    }
                                })(),
                                (() => {
                                    if (!item.orderID) {
                                        return item.note || `${Language.text('manual_adjustment')} ${vm.rebateConfig.title}`;
                                    }
                                    const orderLink = UmClass.style_components.blueNote(`#${item.orderID}`, gvc.event(() => {
                                        gvc.glitter.setUrlParameter('cart_token', item.orderID);
                                        changePage('order_detail', 'page', {});
                                    }), 'font-size: 16px;');
                                    const moneyText = item.money > 0 ? Language.text('obtain') : Language.text('use');
                                    return `${Language.text('order')}「${orderLink}」${moneyText} ${vm.rebateConfig.title}`;
                                })(),
                                item.money.toLocaleString(),
                                item.money > 0 ? item.remain.toLocaleString() : '-',
                            ];
                        }
                        if (isWebsite) {
                            const flexList = [0.8, 0.8, 1.8, 0.6, 0.4];
                            return html `
                        <div class="w-100 d-sm-flex py-4 um-th-bar">
                          ${header
                                .map((item, index) => {
                                return html `<div class="um-th" style="flex: ${flexList[index]};">${item.title}</div>`;
                            })
                                .join('')}
                        </div>
                        ${vm.dataList
                                .map(item => {
                                return html `<div class="w-100 d-sm-flex py-5 um-td-bar">
                              ${formatText(item)
                                    .map((dd, index) => {
                                    return html `<div
                                    class="um-td"
                                    style="flex: ${flexList[index]};font-size:16px;word-break: break-word;"
                                  >
                                    ${dd}
                                  </div>`;
                                })
                                    .join('')}
                            </div>`;
                            })
                                .join('')}
                      `;
                        }
                        return html `<div class="w-100 d-sm-none mb-3 s162413">
                      ${vm.dataList
                            .map(item => {
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
            onCreate: () => {
                if (loadings.view) {
                    gvc.addMtScript([{ src: `${gvc.glitter.root_path}/jslib/lottie-player.js` }], () => {
                        Promise.all([
                            UmClass.getRebateInfo(),
                            new Promise(resolve => {
                                ApiShop.getRebate({}).then((res) => __awaiter(this, void 0, void 0, function* () {
                                    if (res.result && res.response.sum) {
                                        resolve(res.response.sum);
                                    }
                                    else {
                                        resolve(0);
                                    }
                                }));
                            }),
                            new Promise(resolve => {
                                ApiWallet.getRebate({
                                    type: 'me',
                                    limit: 10000,
                                    page: 0,
                                }).then((res) => __awaiter(this, void 0, void 0, function* () {
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
                                    };
                                    resolve(text[Language.getLanguage()]);
                                }));
                            }),
                            new Promise(resolve => {
                                ApiWallet.getRebate({
                                    type: 'me',
                                    limit: 10000,
                                    page: 0,
                                }).then((res) => __awaiter(this, void 0, void 0, function* () {
                                    if (res.result && res.response.data) {
                                        resolve(res.response.data);
                                    }
                                    else {
                                        resolve([]);
                                    }
                                }));
                            }),
                        ]).then(dataList => {
                            vm.rebateConfig = dataList[0];
                            vm.amount = dataList[1];
                            vm.oldestText = dataList[2];
                            vm.dataList = dataList[3];
                            loadings.view = false;
                            gvc.notifyDataChange(ids.view);
                        });
                    }, () => { });
                }
            },
        });
    }
}
window.glitter.setModule(import.meta.url, UMRebate);
