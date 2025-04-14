"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialFakeData = void 0;
const database_1 = __importDefault(require("../../modules/database"));
const fake_user_js_1 = require("./fake-data-model/fake-user.js");
const fake_order_js_1 = require("./fake-data-model/fake-order.js");
const checkout_js_1 = require("./checkout.js");
const ut_timer_1 = require("../utils/ut-timer");
class InitialFakeData {
    constructor(app_name) {
        this.app_name = app_name;
    }
    async run() {
        await this.insertFakeUser();
    }
    async insertFakeUser() {
        const utTimer = new ut_timer_1.UtTimer('insert-fake-user');
        const users = new fake_user_js_1.FakeUser().generateUser(15000);
        const orders = new fake_order_js_1.FakeOrder(users).generateOrder(10000);
        const preservedEmails = [
            'sam38124@gmail.com',
            'jianzhiwang826@gmail.com',
            'a0981825882@gmail.com',
            'open94006880103@gmail.com',
        ];
        await database_1.default.query(`DELETE FROM \`${this.app_name}\`.t_user WHERE id > 0 AND account NOT IN (?)
      `, [preservedEmails]);
        utTimer.checkPoint('Delete Account');
        await database_1.default.query(`DELETE FROM \`${this.app_name}\`.t_checkout WHERE id > 0 AND email NOT IN (?)
        `, [preservedEmails]);
        utTimer.checkPoint('Delete Checkout');
        const userChunk = 500;
        const userChunksCount = Math.ceil(users.length / userChunk);
        for (let i = 0; i < userChunksCount; i++) {
            const userSlice = users.slice(i * userChunk, (i + 1) * userChunk);
            await database_1.default.query(`INSERT INTO \`${this.app_name}\`.t_user
           (userID, account, userData, created_time, online_time, pwd) VALUES ?`, [
                userSlice.map(user => [
                    user.userID,
                    user.userData.email,
                    JSON.stringify(user.userData),
                    user.created_time,
                    user.online_time,
                    user.pwd,
                ]),
            ]);
            utTimer.checkPoint(`Insert Users Query ${i}`);
        }
        const orderChunk = 200;
        const orderChunksCount = Math.ceil(orders.length / orderChunk);
        for (let i = 0; i < orderChunksCount; i++) {
            const orderSlice = orders.slice(i * orderChunk, (i + 1) * orderChunk);
            await database_1.default.query(`INSERT INTO \`${this.app_name}\`.t_checkout 
            (cart_token, status, email, orderData, created_time) VALUES ?`, [orderSlice]);
            utTimer.checkPoint(`Insert Checkout Array ${i}`);
            await Promise.all(orderSlice.map(async (order) => {
                await checkout_js_1.CheckoutService.updateAndMigrateToTableColumn({
                    cart_token: order[0],
                    orderData: JSON.parse(order[3]),
                    app_name: this.app_name,
                });
                utTimer.checkPoint(`Migrate To Table Column #${order[0]}`);
            }));
        }
    }
}
exports.InitialFakeData = InitialFakeData;
//# sourceMappingURL=initial-fake-data.js.map