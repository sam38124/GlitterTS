import { PosWidget } from "../pos-widget.js";
import { PaymentPage } from "./payment-page.js";
const css = String.raw;
export class TempOrder {
    static getTempOrders() {
        localStorage.getItem('pos_temp_orders');
        return JSON.parse(localStorage.getItem('pos_temp_orders') || '[]');
    }
    static setTempOrders(orders) {
        localStorage.setItem('pos_temp_orders', JSON.stringify(orders));
    }
    static addTempOrders(obj) {
        var _a;
        const orders = TempOrder.getTempOrders().filter((dd) => {
            return dd.orderID !== obj.order.orderID;
        });
        orders.push(obj.order);
        obj.order.reserve_date = (new Date()).toISOString();
        TempOrder.setTempOrders(orders);
        if (obj.with_alert) {
            (_a = obj.gvc) === null || _a === void 0 ? void 0 : _a.glitter.innerDialog((gvc) => {
                return gvc.bindView(() => {
                    const bind = gvc.glitter.getUUID();
                    return {
                        bind: bind,
                        view: () => {
                            return [
                                PosWidget.bigTitle('暫存成功'),
                                `<div style="color: #8D8D8D; text-align: center; font-size: 16px;
                                    font-style: normal;
                                    font-weight: 400;
                                    margin-top: 8px;
                                    margin-bottom: 24px;
                                    line-height: normal;
                                ">暫存訂單將保留 1 天，逾時則需重新建立。</div>`,
                                PosWidget.buttonBlack('確認', gvc.event(() => {
                                    PaymentPage.clearHistory();
                                    gvc.closeDialog();
                                    localStorage.setItem('show_pos_page', `menu`);
                                    gvc.glitter.share.clearOrderData();
                                    gvc.glitter.share.reloadPosPage();
                                }))
                            ].join(``);
                        },
                        divCreate: {
                            class: `p-4`,
                            style: css `border-radius: 10px;
                                background: #FFF;
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                justify-content: center;
                            `
                        }
                    };
                });
            }, 'addTempOrders');
        }
    }
    static removeTempOrders(orderID) {
        const orders = TempOrder.getTempOrders().filter((dd) => {
            return dd.orderID !== orderID;
        });
        TempOrder.setTempOrders(orders);
    }
}
