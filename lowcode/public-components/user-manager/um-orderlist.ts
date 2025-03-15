import { GVC } from '../../glitterBundle/GVController.js';
import { UmClass } from './um-class.js';
import { ApiShop } from '../../glitter-base/route/shopping.js';
import { Language } from '../../glitter-base/global/language.js';

const html = String.raw;

interface ShipmentObject {
    type: string;
    value: number;
}

interface LineItem {
    id: number;
    sku: string;
    spec: string[];
    count: number;
    title: string;
    rebate: number;
    collection: any[];
    sale_price: number;
    shipment_obj: ShipmentObject;
    preview_image: string;
    discount_price: number;
}

interface UserInfo {
    name: string;
    email: string;
    phone: string;
    shipment: string;
    send_type: string;
    CVSAddress: string;
    CVSStoreID: string;
    CVSStoreName: string;
    CVSTelephone: string;
    invoice_type: string;
    shipment_info: string;
    invoice_method: string;
    MerchantTradeNo: string;
    LogisticsSubType: string;
}

interface PaymentInfoATM {
    text: string;
    bank_code: string;
    bank_name: string;
    bank_user: string;
    bank_account: string;
}

interface PaymentInfoLinePay {
    text: string;
}

interface PaymentSetting {
    TYPE: string;
}

interface UseRebateInfo {
    point: number;
}

interface OffLineSupport {
    atm: boolean;
    line: boolean;
    cash_on_delivery: boolean;
}

interface CustomerInfo {
    name: string;
    email: string;
    phone: string;
    payment_select: string;
}

interface ShipmentSelector {
    name: string;
    value: string;
}

interface OrderData {
    email: string;
    total: number;
    method: string;
    rebate: number;
    orderID: string;
    discount: number;
    progress: string;
    give_away: any[];
    lineItems: LineItem[];
    user_info: UserInfo;
    code_array: any[];
    use_rebate: number;
    use_wallet: number;
    user_email: string;
    orderSource: string;
    voucherList: any[];
    orderStatus: string;
    shipment_fee: number;
    customer_info: CustomerInfo;
    shipment_info: string;
    useRebateInfo: UseRebateInfo;
    payment_setting: PaymentSetting;
    user_rebate_sum: number;
    custom_form_data: any;
    off_line_support: OffLineSupport;
    payment_info_atm: PaymentInfoATM;
    shipment_support: string[];
    shipment_selector: ShipmentSelector[];
    custom_form_format: any[];
    payment_info_line_pay: PaymentInfoLinePay;
    proof_purchase?: string;
}

interface CartOrder {
    id: number;
    cart_token: string;
    status: number;
    email: string;
    orderData: OrderData;
    created_time: string;
    index: number;
}

export class UMOrderList {
    static main(gvc: GVC, widget: any, subData: any) {

        const glitter = gvc.glitter;
        const vm = {
            dataList: [] as CartOrder[],
            amount: 0,
            oldestText: '',
        };
        const ids = {
            view: glitter.getUUID(),
        };
        const loadings = {
            view: true,
        };

        let changePage = (index: string, type: 'page' | 'home', subData: any) => {};
        gvc.glitter.getModule(new URL('./official_event/page/change-page.js', gvc.glitter.root_path).href, (cl) => {
            changePage = cl.changePage;
        });

        return gvc.bindView({
            bind: ids.view,
            view: () => {
                if (loadings.view) {
                    return UmClass.spinner();
                } else {
                    const isWebsite = document.body.clientWidth > 768;
                    return html`
                        <div class="um-container row mx-auto">
                            <div class="col-12">${UmClass.nav(gvc)}</div>
                            <div class="col-12 mt-2" style="min-height: 500px;">
                                <div class="mx-auto orderList pt-1 pt-md-3 mb-4">
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

                                        function formatText(item: CartOrder) {
                                            return [
                                                item.cart_token ?? Language.text('no_number_order'),
                                                glitter.ut.dateFormat(new Date(item.created_time), 'yyyy/MM/dd'),
                                                (item.orderData.total ?? 0).toLocaleString(),
                                                (() => {
                                                    // 狀態: 已取消, 已完成
                                                    if (item.orderData.orderStatus === '-1') {
                                                        return Language.text('cancelled');
                                                    } else if (item.orderData.orderStatus === '1') {
                                                        return Language.text('completed');
                                                    }

                                                    // 付款: 待核款, 已付款, 已退款
                                                    if (item.status === 0) {
                                                        if (item.orderData.proof_purchase) {
                                                            return Language.text('awaiting_verification');
                                                        }
                                                        return Language.text('unpaid');
                                                    } else if (item.status === -2) {
                                                        return Language.text('refunded');
                                                    }

                                                    // 配送: 揀貨中, 配送中, 配送完成
                                                    switch (item.orderData.progress) {
                                                        case 'shipping':
                                                            return Language.text('shipping');
                                                        case 'finish':
                                                            return Language.text('delivered');
                                                        default:
                                                            return Language.text('preparing');
                                                    }
                                                })(),
                                                html`<div
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
                                                                if (header[index].title === '') {
                                                                    return dd;
                                                                }
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
                            ApiShop.getOrder({
                                limit: 50,
                                page: 0,
                                data_from: 'user',
                            }).then((res: any) => {
                                if (res.result && res.response.data) {
                                    vm.dataList = res.response.data.map((dd: any, index: number) => {
                                        dd.index = index;
                                        return dd;
                                    });
                                } else {
                                    vm.dataList = [];
                                }
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

(window as any).glitter.setModule(import.meta.url, UMOrderList);
