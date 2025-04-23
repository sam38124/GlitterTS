import { BgWidget } from '../backend-manager/bg-widget.js';
export class OrderInfo {
    static reconciliationStatus(dd, text_only = false, size = 'md') {
        var _a;
        const received_c = ((_a = dd.total_received) !== null && _a !== void 0 ? _a : 0) + dd.offset_amount;
        const res_ = (() => {
            if (dd.total_received === null) {
                return BgWidget.warningInsignia('待入帳', { size });
            }
            else if (dd.total_received === dd.total) {
                return BgWidget.successInsignia('已入帳', { size });
            }
            else if (dd.total_received > dd.total && received_c === dd.total) {
                return BgWidget.secondaryInsignia('已退款', { size });
            }
            else if (dd.total_received < dd.total && received_c === dd.total) {
                return BgWidget.primaryInsignia('已沖帳', { size });
            }
            else if (received_c < dd.total) {
                return BgWidget.dangerInsignia('待沖帳', { size });
            }
            else if (received_c > dd.total) {
                return BgWidget.dangerInsignia('待退款', { size });
            }
        })();
        if (text_only) {
            return stripHtmlTags(res_);
        }
        else {
            return res_;
        }
    }
    static paymentStatus(dd, text_only = false) {
        const res_ = (() => {
            switch (dd.status) {
                case 0:
                    if (dd.orderData.proof_purchase) {
                        return BgWidget.warningInsignia('待核款');
                    }
                    if (dd.orderData.customer_info.payment_select == 'cash_on_delivery') {
                        return BgWidget.warningInsignia('貨到付款');
                    }
                    return BgWidget.notifyInsignia('未付款');
                case 3:
                    return BgWidget.warningInsignia('部分付款');
                case 1:
                    return BgWidget.infoInsignia('已付款');
                case -1:
                    return BgWidget.notifyInsignia('付款失敗');
                case -2:
                    return BgWidget.notifyInsignia('已退款');
            }
        })();
        if (text_only) {
            return stripHtmlTags(res_);
        }
        else {
            return res_;
        }
    }
    static shipmetSelector(order, shipmentSelector) {
        const shipment = (order.orderData.shipment_selector || shipmentSelector).find((d) => d.value === order.orderData.user_info.shipment);
        return (shipment === null || shipment === void 0 ? void 0 : shipment.name) || '門市取貨';
    }
    static paymentSelector(gvc, order, payment_support) {
        const vm = {
            id: gvc.glitter.getUUID(),
            loading: true,
            dataList: [],
        };
        return gvc.bindView({
            bind: vm.id,
            view: () => {
                if (vm.loading) {
                    return '載入中';
                }
                const pay = vm.dataList.find((d) => d.key === order.orderData.customer_info.payment_select);
                return (pay === null || pay === void 0 ? void 0 : pay.name) || '線下付款';
            },
            divCreate: {
                style: 'width: 150px',
            },
            onCreate: () => {
                if (vm.loading) {
                    vm.dataList = payment_support;
                    vm.loading = false;
                    setTimeout(() => gvc.notifyDataChange(vm.id), 100);
                }
            },
        });
    }
}
function stripHtmlTags(input) {
    return input.replace(/<[^>]*>?/gm, '');
}
