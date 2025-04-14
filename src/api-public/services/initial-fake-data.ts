import db from '../../modules/database';
import { FakeUser } from './fake-data-model/fake-user.js';
import { FakeOrder } from './fake-data-model/fake-order.js';
import { CheckoutService } from './checkout.js';
import { UtTimer } from '../utils/ut-timer';

export class InitialFakeData {
  app_name: string;

  constructor(app_name: string) {
    this.app_name = app_name;
  }

  async run() {
    await this.insertFakeUser();
  }

  async insertFakeUser() {
    const utTimer = new UtTimer('insert-fake-user');

    // 取得假顧客資料
    const users = new FakeUser().generateUser(15000);

    // 取得假訂單資料
    const orders = new FakeOrder(users).generateOrder(10000);

    // 保留這些郵件地址的用戶資料
    const preservedEmails = [
      'sam38124@gmail.com',
      'jianzhiwang826@gmail.com',
      'a0981825882@gmail.com',
      'open94006880103@gmail.com',
    ];

    // 刪除所有用戶資料，但保留指定的電子郵件地址
    await db.query(
      `DELETE FROM \`${this.app_name}\`.t_user WHERE id > 0 AND account NOT IN (?)
      `,
      [preservedEmails]
    );
    utTimer.checkPoint('Delete Account');

    // 刪除所有結帳資料，但保留指定用戶的資料
    await db.query(
      `DELETE FROM \`${this.app_name}\`.t_checkout WHERE id > 0 AND email NOT IN (?)
        `,
      [preservedEmails]
    );
    utTimer.checkPoint('Delete Checkout');

    // 插入假顧客資料
    const userChunk = 500;
    const userChunksCount = Math.ceil(users.length / userChunk);

    for (let i = 0; i < userChunksCount; i++) {
      const userSlice = users.slice(i * userChunk, (i + 1) * userChunk);

      await db.query(
        `INSERT INTO \`${this.app_name}\`.t_user
           (userID, account, userData, created_time, online_time, pwd) VALUES ?`,
        [
          userSlice.map(user => [
            user.userID,
            user.userData.email,
            JSON.stringify(user.userData),
            user.created_time,
            user.online_time,
            user.pwd,
          ]),
        ]
      );
      utTimer.checkPoint(`Insert Users Query ${i}`);
    }

    // 插入假訂單資料，並進行資料庫重整
    const orderChunk = 200;
    const orderChunksCount = Math.ceil(orders.length / orderChunk);

    for (let i = 0; i < orderChunksCount; i++) {
      const orderSlice = orders.slice(i * orderChunk, (i + 1) * orderChunk);

      await db.query(
        `INSERT INTO \`${this.app_name}\`.t_checkout 
            (cart_token, status, email, orderData, created_time) VALUES ?`,
        [orderSlice]
      );
      utTimer.checkPoint(`Insert Checkout Array ${i}`);

      await Promise.all(
        orderSlice.map(async order => {
          await CheckoutService.updateAndMigrateToTableColumn({
            cart_token: order[0],
            orderData: JSON.parse(order[3]),
            app_name: this.app_name,
          });
          utTimer.checkPoint(`Migrate To Table Column #${order[0]}`);
        })
      );
    }
  }
}
