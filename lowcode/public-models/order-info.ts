import { BgWidget } from '../backend-manager/bg-widget.js';
import { GVC } from '../glitterBundle/GVController.js';
import { PaymentConfig } from '../glitter-base/global/payment-config.js';

const html = String.raw;

export class OrderInfo {
  //對帳狀態
  public static reconciliationStatus(dd: any, text_only: boolean = false) {
    const received_c = (dd.total_received ?? 0) + dd.offset_amount;
    const res_ = (() => {
      if (dd.total_received === null) {
        return BgWidget.warningInsignia('待入帳');
      } else if (dd.total_received === dd.total) {
        return BgWidget.successInsignia('已入帳');
      } else if (dd.total_received > dd.total && received_c === dd.total) {
        return BgWidget.secondaryInsignia('已退款');
      } else if (dd.total_received < dd.total && received_c === dd.total) {
        return BgWidget.primaryInsignia('已沖帳');
      } else if (received_c < dd.total) {
        return BgWidget.dangerInsignia('待沖帳');
      } else if (received_c > dd.total) {
        return BgWidget.dangerInsignia('待退款');
      }
    })();
    if (text_only) {
      return stripHtmlTags(res_);
    } else {
      return res_;
    }
  }

  //付款狀態
  public static paymentStatus(dd: any, text_only: boolean = false) {
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
    } else {
      return res_;
    }
  }

  // 運送方式
  public static shipmetSelector(
    order: any,
    shipmentSelector: {
      name: string;
      value: string;
    }[]
  ) {
    const shipment = (order.orderData.shipment_selector || shipmentSelector).find(
      (d: any) => d.value === order.orderData.user_info.shipment
    );
    return shipment?.name || '門市取貨';
  }

  // 付款方式
  public static paymentSelector(gvc: GVC, order: any) {
    const vm = {
      id: gvc.glitter.getUUID(),
      loading: true,
      dataList: [] as any,
    };

    return gvc.bindView({
      bind: vm.id,
      view: () => {
        if (vm.loading) return '載入中';
        const pay = vm.dataList.find((d: any) => d.key === order.orderData.customer_info.payment_select);
        return pay?.name || '線下付款';
      },
      divCreate: {
        style: 'width: 150px',
      },
      onCreate: async () => {
        if (vm.loading) {
          vm.dataList = await PaymentConfig.getSupportPayment();
          vm.loading = false;
          gvc.notifyDataChange(vm.id);
        }
      },
    });
  }
}

function stripHtmlTags(input: any) {
  return input.replace(/<[^>]*>?/gm, ''); // 用正則匹配並替換所有 HTML 標籤為空字串
}
