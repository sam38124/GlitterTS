import db from '../../modules/database.js';

export class CheckoutService {
  public static async updateAndMigrateToTableColumn(obj: { id?: string; orderData: any; app_name: string }) {
    const update_object: any = {};
    const json = obj.orderData;
    //預設是未出貨
    json.progress = json.progress ?? 'wait';
    update_object.progress = json.progress;
    //預設是處理中
    json.orderStatus = json.orderStatus ?? '0';
    update_object.order_status = json.orderStatus;
    //付款方式
    if (json.customer_info && json.customer_info.payment_select) {
      update_object.payment_method = json.customer_info.payment_select;
    }
    if (json.pos_info && json.pos_info.payment && Array.isArray(json.pos_info.payment)) {
      update_object.payment_method = json.pos_info.payment
        .map((item: any) => {
          return item.method;
        })
        .sort()
        .join('|');
    }
    //配送方式
    update_object.shipment_method = json.user_info.shipment;
    //配送日期
    if (json.user_info.shipment_date) {
      update_object.shipment_date = new Date(json.user_info.shipment_date);
    } else {
      update_object.shipment_date = null;
    }
    update_object.total=json.total;
    //出貨單號碼
    if(json.user_info.shipment_number){
      update_object.shipment_number=json.user_info.shipment_number;
    }else{
      update_object.shipment_number=null;
    }
    await db.query(
      `update \`${obj.app_name}\`.t_checkout
       set ?
       where id = ${obj.id}`,
      [update_object]
    );
  }
}
