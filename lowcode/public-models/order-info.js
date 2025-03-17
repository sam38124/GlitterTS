import { BgWidget } from '../backend-manager/bg-widget.js';
const html = String.raw;
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
}
function stripHtmlTags(input) {
    return input.replace(/<[^>]*>?/gm, '');
}
