import db from '../../modules/database.js';
import { Cart, Shopping } from './shopping.js';
import { FbApi } from './fb-api.js';
import { User } from './user.js';

export class OrderEvent {
  public static async insertOrder(obj: { cartData: Cart | any; status: number; app: string }) {
    const { orderID, email } = obj.cartData;
    const store_info = await new User(obj.app).getConfigV2({
      key: 'store-information',
      user_id: 'manager',
    });
    console.log(`store_info.pickup_mode=>`,store_info.pickup_mode)
    if(store_info.pickup_mode){

      obj.cartData.user_info.shipment_number=parseInt(store_info.pickup_now || '0',10)+1
      if(obj.cartData.user_info.shipment_number < parseInt(store_info.pickup_start || '0',10)){
        obj.cartData.user_info.shipment_number = parseInt(store_info.pickup_start || '0',10)
      }

      if(obj.cartData.user_info.shipment_number > parseInt(store_info.pickup_end|| '0',10)){
        obj.cartData.user_info.shipment_number=parseInt(store_info.pickup_start || '0',10)
      }
      store_info.pickup_now=obj.cartData.user_info.shipment_number;
      //更新取貨號碼
      await new User(obj.app).setConfig({
        key:'store-information',
        value:store_info,
        user_id:'manager'
      });
    }
    // 新增訂單
    await db.execute(
      `REPLACE INTO \`${obj.app}\`.t_checkout (cart_token, status, email, orderData) VALUES (?, ?, ?, ?)
      `,
      [orderID, obj.status, email, obj.cartData]
    );

    // 添加索引
    await new Shopping(obj.app).putOrder({
      cart_token: orderID,
      status: undefined,
      orderData: obj.cartData,
    });

    // Facebook 事件
    await new FbApi(obj.app).checkOut(obj.cartData);
  }
}
