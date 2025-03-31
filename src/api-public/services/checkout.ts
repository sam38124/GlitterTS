import db from '../../modules/database.js';

export class CheckoutService {
  public static async updateAndMigrateToTableColumn(obj: {
    id?: string;
    orderData: any;
    app_name: string;
    no_shipment_number?: boolean;
  }) {
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
    update_object.total = json.total || 0;
    //出貨單號碼
    if (!obj.no_shipment_number) {
      if (json.user_info.shipment_number) {
        update_object.shipment_number = json.user_info.shipment_number;
      } else {
        update_object.shipment_number = null;
      }
    }
    update_object.order_source=json.orderSource || null;
    update_object.archived=json.archived;

    if(json.customer_info){
      update_object.customer_name=json.customer_info.name;
      update_object.customer_phone=json.customer_info.phone;
      update_object.customer_email=json.customer_info.email;
    }
    if(json.user_info){
      update_object.shipment_name=json.user_info.name;
      update_object.shipment_phone=json.user_info.phone;
      update_object.shipment_email=json.user_info.email;
      update_object.shipment_address=[json.user_info.city, json.user_info.area, json.user_info.address].filter((dd)=>{
        return dd
      }).join('');
    }
    //更新t_checkout欄位
    await db.query(
      `update \`${obj.app_name}\`.t_checkout
       set ?
       where id = ${obj.id}`,
      [update_object]
    );
    //更新購買記錄資料表
    try {
      await db.query(
        `delete
                      from \`${obj.app_name}\`.t_products_sold_history
                      where order_id = ? and id>0`,
        [obj.orderData.orderID]
      );
      for (const b of obj.orderData.lineItems) {
        await db.query(
          `insert into \`${obj.app_name}\`.t_products_sold_history
                        set ?`,
          [
            {
              product_id: b.id ?? -1,
              order_id: obj.orderData.orderID,
              spec: (b.spec || []).join('-'),
              count:b.count
            },
          ]
        );
      }
    } catch (e) {

      console.error(`insert-history-error: ${e}`);
    }
  }
}
