import db from '../../modules/database.js';
import { Cart, Shopping } from './shopping.js';
import { FbApi } from './fb-api.js';

export class OrderEvent {
  public static async insertOrder(obj: { cartData: Cart | any; status: number; app: string }) {
    const { orderID, email } = obj.cartData;

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
