import { UmClass } from './um-class.js';
import { ApiShop } from '../../glitter-base/route/shopping.js';
const html = String.raw;
const css = String.raw;
export class UMOrder {
    static addStyle(gvc) {
        gvc.addStyle(`
        .o-h1{
            text-align: center;
            font-weight: 700;
            letter-spacing: 4px;
            color: #393939;
            font-size: 40px;
            margin: 20px 0;
        }
        .o-title{

        }
        .o-content{

        }
        .o-card{
            border-radius: 10px;
            border: 1px solid #DDD;
            background: #FFF;
            width: 100%;
            max-width: 1100px;
            padding: 20px;
            display: flex;
            flex-direction: column;
            margin: 20px;
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
                    return UmClass.spinner();
                }
                else {
                    console.log(vm.data.orderData);
                    return html `<div class="container py-5">
                        <div class="d-flex align-items-center justify-content-center gap-3 flex-column">
                            <section class="o-h1">訂單編號<br />#${vm.data.cart_token}</section>
                            <section class="o-card">
                                <h3>訂單明細</h3>
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
