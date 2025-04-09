var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BgWidget } from '../backend-manager/bg-widget.js';
import { PaymentConfig } from '../glitter-base/global/payment-config.js';
export class OrderInfo {
    static reconciliationStatus(dd, text_only = false) {
        var _a;
        const received_c = ((_a = dd.total_received) !== null && _a !== void 0 ? _a : 0) + dd.offset_amount;
        const res_ = (() => {
            if (dd.total_received === null) {
                return BgWidget.warningInsignia('待入帳');
            }
            else if (dd.total_received === dd.total) {
                return BgWidget.successInsignia('已入帳');
            }
            else if (dd.total_received > dd.total && received_c === dd.total) {
                return BgWidget.secondaryInsignia('已退款');
            }
            else if (dd.total_received < dd.total && received_c === dd.total) {
                return BgWidget.primaryInsignia('已沖帳');
            }
            else if (received_c < dd.total) {
                return BgWidget.dangerInsignia('待沖帳');
            }
            else if (received_c > dd.total) {
                return BgWidget.dangerInsignia('待退款');
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
    static paymentSelector(gvc, order) {
        const vm = {
            id: gvc.glitter.getUUID(),
            loading: true,
            dataList: [],
        };
        return gvc.bindView({
            bind: vm.id,
            view: () => {
                if (vm.loading)
                    return '載入中';
                const pay = vm.dataList.find((d) => d.key === order.orderData.customer_info.payment_select);
                return (pay === null || pay === void 0 ? void 0 : pay.name) || '線下付款';
            },
            divCreate: {
                style: 'width: 150px',
            },
            onCreate: () => __awaiter(this, void 0, void 0, function* () {
                if (vm.loading) {
                    vm.dataList = yield PaymentConfig.getSupportPayment();
                    vm.loading = false;
                    gvc.notifyDataChange(vm.id);
                }
            }),
        });
    }
}
function stripHtmlTags(input) {
    return input.replace(/<[^>]*>?/gm, '');
}
