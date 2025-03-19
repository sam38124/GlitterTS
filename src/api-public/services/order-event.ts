import db from '../../modules/database.js';
import { Cart, Shopping } from './shopping.js';
import { FbApi } from './fb-api.js';

export class OrderEvent {
  public static async insertOrder(obj: { cartData: Cart | any; status: number; app: string }) {
    // 新增訂單
    await db.execute(
      `REPLACE INTO \`${obj.app}\`.t_checkout (cart_token, status, email, orderData) VALUES (?, ?, ?, ?)
      `,
      [obj.cartData.orderID, obj.status, obj.cartData.email, obj.cartData]
    );

    // 添加索引
    await new Shopping(obj.app).putOrder({
      cart_token: obj.cartData.orderID,
      status: undefined,
      orderData: obj.cartData,
    });

    // Facebook 事件
    await new FbApi(obj.app).checkOut(obj.cartData);
  }
}
