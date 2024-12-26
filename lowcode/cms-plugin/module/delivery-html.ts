import { Tool } from '../../modules/tool.js';
import { BgWidget } from '../../backend-manager/bg-widget.js';
import { GVC } from '../../glitterBundle/GVController.js';

const html = String.raw;

interface OrderData {
    distribution_info?: {
        code: string;
        condition: number;
        link: string;
        recommend_medium: any;
        recommend_status: string;
        recommend_user: any;
        redirect: string;
        relative: string;
        relative_data: any;
        share_type: string;
        share_value: number;
        startDate: string;
        startTime: string;
        status: boolean;
        title: string;
        voucher: number;
        voucher_status: string;
    };
    archived: 'true' | 'false';
    customer_info: any;
    editRecord: any;
    method: string;
    shipment_selector: {
        name: string;
        value: string;
        form: any;
    }[];
    orderStatus: string;
    use_wallet: number;
    email: string;
    total: number;
    discount: number;
    expectDate: string;
    shipment_fee: number;
    use_rebate: number;
    lineItems: {
        id: number;
        spec: string[];
        count: string;
        sale_price: number;
        title: string;
    }[];
    user_info: {
        name: string;
        email: string;
        phone: string;
        address: string;
        custom_form_delivery?: any;
        shipment: 'normal' | 'FAMIC2C' | 'UNIMARTC2C' | 'HILIFEC2C' | 'OKMARTC2C' | 'now' | 'shop';
        CVSStoreName: string;
        CVSStoreID: string;
        CVSTelephone: string;
        MerchantTradeNo: string;
        CVSAddress: string;
        note?: string;
        code_note?: string;
    };
    custom_receipt_form?: any;
    custom_form_format?: any;
    custom_form_data?: any;
    proof_purchase: any;
    progress: string;
    // progress: 'finish' | 'wait' | 'shipping' | "returns";
    order_note: string;
    voucherList: [
        {
            title: string;
            method: 'percent' | 'fixed';
            trigger: 'auto' | 'code';
            value: string;
            for: 'collection' | 'product';
            rule: 'min_price' | 'min_count';
            forKey: string[];
            ruleValue: number;
            startDate: string;
            startTime: string;
            endDate?: string;
            endTime?: string;
            status: 0 | 1 | -1;
            type: 'voucher';
            code?: string;
            overlay: boolean;
            bind?: {
                id: string;
                spec: string[];
                count: number;
                sale_price: number;
                collection: string[];
                discount_price: number;
            }[];
            start_ISO_Date: string;
            end_ISO_Date: string;
        }
    ];
    orderSource?: string;
    deliveryData: Record<string, string>;
}

interface CartData {
    id: number;
    cart_token: string;
    status: number;
    email: string;
    orderData: OrderData;
    created_time: string;
}

export class DeliveryHTML {
    static print(ogvc: GVC, data: CartData) {
        const prefix = Tool.randomString(5);
        const containerID = Tool.randomString(5);
        const orderData = data.orderData;

        return BgWidget.fullDialog({
            gvc: ogvc,
            title: (gvc) => {
                return '列印出貨單';
            },
            innerHTML: (gvc) => {
                const glitter = gvc.glitter;
                const id = glitter.getUUID();
                let loading = true;
                this.addStyle(gvc, prefix);

                return gvc.bindView({
                    bind: id,
                    view: () => {
                        if (loading) {
                            return '';
                        } else {
                            return html`<div class="container" id="${containerID}">
                                <h1 class="title">出貨明細</h1>
                                <div class="details">
                                    <table>
                                        <tr>
                                            <td>訂單編號：${data.cart_token}</td>
                                            <td>送貨方式：${this.getShippingMethodText(orderData)}</td>
                                        </tr>
                                        <tr>
                                            <td>訂購日期：${glitter.ut.dateFormat(new Date(data.created_time), 'yyyy-MM-dd hh:mm:ss')}</td>
                                            <td>送貨地址：${orderData.user_info.address}</td>
                                        </tr>
                                        <tr>
                                            <td>訂購人帳號：${orderData.email}</td>
                                            <td>收件人姓名：${orderData.user_info.name}</td>
                                        </tr>
                                        <tr>
                                            <td>付款方式：${this.getPaymentMethodText(orderData)}</td>
                                            <td>收件人電話：${orderData.user_info.phone}</td>
                                        </tr>
                                        <tr>
                                            <td>付款狀態：${this.paymentStatus(data)}</td>
                                            <td>收件人信箱：${orderData.user_info.email}</td>
                                        </tr>
                                    </table>
                                </div>
                                <div class="items">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th class="text-left">項次</th>
                                                <th class="text-left">商品名稱</th>
                                                <th class="text-right">單價</th>
                                                <th class="text-right">數量</th>
                                                <th class="text-right">金額</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${orderData.lineItems
                                                .map((item, index) => {
                                                    return html`
                                                        <tr>
                                                            <td class="text-left">${index + 1}</td>
                                                            <td class="text-left">${item.title} (${item.spec.join('/')})</td>
                                                            <td class="text-right">${item.sale_price.toLocaleString()}</td>
                                                            <td class="text-right">${item.count}</td>
                                                            <td class="text-right">$ ${(item.sale_price * parseInt(item.count, 10)).toLocaleString()}</td>
                                                        </tr>
                                                    `;
                                                })
                                                .join('')}
                                        </tbody>
                                    </table>
                                </div>
                                <div class="summary">
                                    <table>
                                        <tr>
                                            <td>小計：</td>
                                            <td>$ ${(orderData.total + orderData.discount - orderData.shipment_fee + orderData.use_rebate).toLocaleString()}</td>
                                        </tr>
                                        <tr>
                                            <td>運費：</td>
                                            <td>${orderData.shipment_fee.toLocaleString()}</td>
                                        </tr>
                                        <tr>
                                            <td>折扣：</td>
                                            <td>-${orderData.discount.toLocaleString()}</td>
                                        </tr>
                                        <tr>
                                            <td>購物金折抵：</td>
                                            <td>-${orderData.use_rebate.toLocaleString()}</td>
                                        </tr>
                                        <tr>
                                            <td>總計：</td>
                                            <td>$ ${orderData.total.toLocaleString()}</td>
                                        </tr>
                                    </table>
                                </div>

                                <p class="note">【備註事項】</p>
                            </div>`;
                        }
                    },
                    divCreate: {
                        style: 'min-height: calc(100vh - 70px); padding: 20px;',
                    },
                    onCreate: () => {
                        if (loading) {
                            setTimeout(() => {
                                loading = false;
                                gvc.notifyDataChange(id);
                            }, 100);
                        } else {
                            // 動態添加前綴到 HTML 中的 class 名稱
                            const container = window.parent.document.getElementById(containerID);
                            if (container) {
                                const elements = container.querySelectorAll('[class]');
                                elements.forEach((el) => {
                                    const classList = Array.from(el.classList);
                                    el.className = classList.map((cls) => `${prefix}-${cls}`).join(' ');
                                });
                                container.className = `${prefix}-container`;
                            }
                        }
                    },
                });
            },
            footer_html: (gvc: GVC) => {
                return [
                    BgWidget.cancel(
                        gvc.event(() => {
                            gvc.closeDialog();
                        })
                    ),
                    BgWidget.save(
                        gvc.event(() => {
                            gvc.closeDialog();
                            console.log('開始列印出貨單');
                        })
                    ),
                ].join('');
            },
            closeCallback: () => {},
        });
    }

    static addStyle(gvc: GVC, prefix: string) {
        gvc.addStyle(`
            .${prefix}-text-left {
                text-align: left;
            }
            .${prefix}-text-right {
                text-align: right;
            }
            .${prefix}-container {
                width: 90%;
                margin: auto;
            }
            .${prefix}-title {
                text-align: center;
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 16px;
            }
            .${prefix}-summary {
                display: flex;
                justify-content: end;
            }
            .${prefix}-details table,
            .${prefix}-items table {
                width: 100%;
                margin-bottom: 20px;
            }
            .${prefix}-summary table {
                width: 50%;
                margin-bottom: 20px;
            }
            .${prefix}-details td {
                padding: 4px;
                text-align: left;
                width: 50%;
            }
            .${prefix}-items th,
            .${prefix}-items td {
                padding: 4px;
            }
            .${prefix}-items th {
                background-color: #f4f4f4;
            }
            .${prefix}-summary td {
                padding: 4px;
                text-align: right;
            }
            .${prefix}-summary tr:last-child td {
                font-weight: bold;
            }
        `);
    }

    static getPaymentMethodText(orderData: OrderData) {
        if (orderData.orderSource === 'POS') {
            return `門市POS付款`;
        }
        switch (orderData.customer_info.payment_select) {
            case 'off_line':
                return '線下付款';
            case 'newWebPay':
                return '藍新金流';
            case 'ecPay':
                return '綠界金流';
            case 'line_pay':
                return 'Line Pay';
            case 'atm':
                return '銀行轉帳';
            case 'line':
                return 'Line 轉帳';
            case 'cash_on_delivery':
                return '貨到付款';
            default:
                return '線下付款';
        }
    }

    static getShippingMethodText(orderData: OrderData) {
        switch (orderData.user_info.shipment) {
            case 'normal':
                return '宅配';
            case 'UNIMARTC2C':
                return '7-11店到店';
            case 'FAMIC2C':
                return '全家店到店';
            case 'OKMARTC2C':
                return 'OK店到店';
            case 'HILIFEC2C':
                return '萊爾富店到店';
            case 'normal':
                return '';
        }
    }

    static paymentStatus(cart: CartData) {
        if (cart.status === 0) {
            if (cart.orderData.proof_purchase) {
                return '待核款';
            }
            return '未付款';
        } else if (cart.status === 1) {
            return '已付款';
        } else if (cart.status === -2) {
            return '已退款';
        } else {
            return '付款失敗';
        }
    }
}
