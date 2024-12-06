import { UmClass } from './um-class.js';
import { ApiShop } from '../../glitter-base/route/shopping.js';
import { Language } from '../../glitter-base/global/language.js';
const html = String.raw;
export class UMOrderList {
    static main(gvc, widget, subData) {
        const glitter = gvc.glitter;
        const vm = {
            dataList: [],
            amount: 0,
            oldestText: '',
        };
        const ids = {
            view: glitter.getUUID(),
        };
        const loadings = {
            view: true,
        };
        let changePage = (index, type, subData) => { };
        gvc.glitter.getModule(new URL('./official_event/page/change-page.js', gvc.glitter.root_path).href, (cl) => {
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
                    return html `
                        <div class="um-container row mx-auto">
                            <div class="col-12">${UmClass.nav(gvc)}</div>
                            <div class="col-12 mt-2" style="min-height: 500px;">
                                <div class="mx-auto orderList pt-1 pt-md-3 mb-4">
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
                                                <span class="mb-5 fs-5">${Language.text('no_current_orders')}</span>
                                            </div>`;
                        }
                        const header = [
                            {
                                title: Language.text('order_number'),
                            },
                            {
                                title: Language.text('order_date'),
                            },
                            {
                                title: Language.text('order_amount'),
                            },
                            {
                                title: Language.text('order_status'),
                            },
                            {
                                title: '',
                            },
                        ];
                        function formatText(item) {
                            var _a, _b;
                            return [
                                (_a = item.cart_token) !== null && _a !== void 0 ? _a : Language.text('no_number_order'),
                                glitter.ut.dateFormat(new Date(item.created_time), 'yyyy/MM/dd'),
                                ((_b = item.orderData.total) !== null && _b !== void 0 ? _b : 0).toLocaleString(),
                                (() => {
                                    if (item.status !== 1) {
                                        return Language.text('unpaid');
                                    }
                                    switch (item.orderData.progress) {
                                        case 'shipping':
                                            return Language.text('shipping');
                                        case 'finish':
                                            return Language.text('delivered');
                                        default:
                                            return Language.text('preparing');
                                    }
                                })(),
                                html `<div
                                                    class="option px-4 d-flex justify-content-center um-nav-btn um-nav-btn-active"
                                                    onclick="${gvc.event(() => {
                                    gvc.glitter.setUrlParameter('cart_token', item.cart_token);
                                    changePage('order_detail', 'page', {});
                                })}"
                                                >
                                                    ${Language.text('view')}
                                                </div>`,
                            ];
                        }
                        if (isWebsite) {
                            const flexList = [1, 1, 1, 1, 1];
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
                                if (header[index].title === '') {
                                    return dd;
                                }
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
                        ApiShop.getOrder({
                            limit: 50,
                            page: 0,
                            data_from: 'user',
                        }).then((res) => {
                            if (res.result && res.response.data) {
                                vm.dataList = res.response.data.map((dd, index) => {
                                    dd.index = index;
                                    return dd;
                                });
                            }
                            else {
                                vm.dataList = [];
                            }
                            loadings.view = false;
                            gvc.notifyDataChange(ids.view);
                        });
                    }, () => { });
                }
            },
        });
    }
}
window.glitter.setModule(import.meta.url, UMOrderList);
