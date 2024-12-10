import { UmClass } from './um-class.js';
import { ApiShop } from '../../glitter-base/route/shopping.js';
const html = String.raw;
const css = String.raw;
export class UMOrder {
    static addStyle(gvc) {
        gvc.addStyle(`
            .o-h1 {
                text-align: center;
                font-weight: 700;
                letter-spacing: 4px;
                color: #393939;
                font-size: 36px;
                margin: 20px 0;
            }
            .o-title {
            }
            .o-content {
            }
            .o-card {
                border-radius: 10px;
                border: 1px solid #ddd;
                background: #fff;
                width: 100%;
                max-width: 1100px;
                padding: 20px;
                display: flex;
                flex-direction: column;
                margin: 20px;
            }
            .o-line-item {
                display: flex;
                width: 100%;
                padding: 1.25rem 1rem;
                align-items: center;
                justify-content: space-between;
                border-bottom: 1px solid #dddddd;
            }
            .o-item-title {
                font-size: 16px;
                font-weight: 500;
                color: #fe5541;
                margin-bottom: 0.25rem;
            }
            .o-item-spec {
                font-size: 16px;
                font-weight: 400;
                color: #858585;
                margin-bottom: 0;
            }
            .o-total-container {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                gap: 10px;
                margin-top: 1.25rem;
                margin-right: 1rem;
            }
            .o-total-item {
                display: flex;
                width: 100%;
                max-width: 350px;
                justify-content: space-between;
            }
            .o-subtotal {
                min-width: 80px;
                text-align: end;
            }
            .o-total {
                min-width: 80px;
                text-align: end;
                font-weight: 700;
            }
            .o-total-text {
                font-weight: 700;
            }
            .go-back-text {
                color: #1e1e1e;
                font-family: 'Open Sans', sans-serif;
                cursor: pointer;
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: normal;
                letter-spacing: 1px;
            }
        `);
    }
    static main(gvc, widget, subData) {
        this.addStyle(gvc);
        const glitter = gvc.glitter;
        const ids = {
            view: glitter.getUUID(),
        };
        const loadings = {
            view: true,
        };
        const vm = {
            data: {},
        };
        return gvc.bindView({
            bind: ids.view,
            view: () => {
                if (loadings.view) {
                    return UmClass.spinner({
                        container: {
                            style: 'height: 100%;',
                        },
                    });
                }
                else {
                    console.log(vm.data);
                    if (!vm.data.orderData || !vm.data.cart_token) {
                        return '查無此訂單';
                    }
                    const orderData = vm.data.orderData;
                    return html `<div class="container py-5">
                        <div class="d-flex align-items-center justify-content-center gap-3 flex-column">
                            <section class="o-h1">訂單編號<br />#${vm.data.cart_token}</section>
                            <section class="o-card">
                                <h3 class="mb-3">訂單明細</h3>
                                ${(() => {
                        let h = '';
                        orderData.lineItems.forEach((item) => {
                            h += html `
                                            <div class="o-line-item">
                                                <div class="d-flex gap-3">
                                                    <div>
                                                        ${UmClass.validImageBox({
                                gvc,
                                image: item.preview_image,
                                width: 60,
                                style: 'border-radius: 10px;',
                            })}
                                                    </div>
                                                    <div>
                                                        <p class="o-item-title">${item.title}</p>
                                                        <p class="o-item-spec">${item.spec.length > 0 ? `規格：${item.spec.join(' / ')}` : '單一規格'}</p>
                                                    </div>
                                                </div>
                                                <div class="d-flex">
                                                    <span class="me-3">$ ${item.sale_price.toLocaleString()} × ${item.count}</span>
                                                    <span class="o-subtotal">NT$ ${(item.sale_price * item.count).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        `;
                        });
                        return h;
                    })()}
                                <div class="o-total-container">
                                    <div class="o-total-item">
                                        <span>小計總額(合計)</span>
                                        <span class="o-subtotal">NT$ ${(orderData.total - orderData.shipment_fee + orderData.discount + orderData.use_rebate).toLocaleString()}</span>
                                    </div>
                                    <div class="o-total-item">
                                        <span>回饋金折抵</span>
                                        <span class="o-subtotal">− NT$ ${orderData.use_rebate.toLocaleString()}</span>
                                    </div>
                                    <div class="o-total-item">
                                        <span>優惠折扣</span>
                                        <span class="o-subtotal">− NT$ ${orderData.discount.toLocaleString()}</span>
                                    </div>
                                    <div class="o-total-item">
                                        <span>運費</span>
                                        <span class="o-subtotal">NT$ ${orderData.shipment_fee.toLocaleString()}</span>
                                    </div>
                                    <div class="o-total-item">
                                        <span class="o-total-text">總付款金額</span>
                                        <span class="o-total">NT$ ${orderData.total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </section>
                            <section class="border border-1 w-100">
                                <h3>付款資訊</h3>
                            </section>
                            <section class="border border-1 w-100">
                                <h3>訂單資訊</h3>
                            </section>
                        </div>
                        <div class="m-auto d-flex align-items-center justify-content-center mt-5" style="cursor: pointer;">
                            <img class="me-2" src="https://ui.homee.ai/htmlExtension/shopify/order/img/back.svg" />
                            <span class="go-back-text">返回訂單列表</span>
                        </div>
                    </div>`;
                }
            },
            divCreate: {},
            onCreate: () => {
                if (loadings.view) {
                    ApiShop.getOrder({
                        limit: 1,
                        page: 0,
                        data_from: 'user',
                        search: glitter.getUrlParameter('cart_token'),
                        searchType: 'cart_token',
                    }).then((res) => {
                        if (res.result && res.response.data) {
                            vm.data = res.response.data[0];
                        }
                        else {
                            vm.data = {};
                        }
                        loadings.view = false;
                        gvc.notifyDataChange(ids.view);
                    });
                }
            },
        });
    }
}
window.glitter.setModule(import.meta.url, UMOrder);
