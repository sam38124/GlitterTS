"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialFakeData = void 0;
const database_1 = __importDefault(require("../../modules/database"));
const fake_user_js_1 = require("./fake-data-model/fake-user.js");
const fake_order_js_1 = require("./fake-data-model/fake-order.js");
class InitialFakeData {
    constructor(app_name) {
        this.app_name = app_name;
    }
    async run() {
        await this.insertFakeUser();
    }
    async insertFakeUser() {
        await database_1.default.query(`delete from \`${this.app_name}\`.t_user where id>0`, []);
        await database_1.default.query(`delete from \`${this.app_name}\`.t_checkout where id>0`, []);
        await database_1.default.query(`insert into \`${this.app_name}\`.t_user
                            (userID, account,userData,created_time,online_time,pwd) VALUES ?`, [
            fake_user_js_1.fakeUser.map((dd) => {
                return [dd.userID, dd.userData.email, JSON.stringify(dd.userData), dd.created_time, dd.online_time, dd.pwd];
            })
        ]);
        await database_1.default.query(`insert into \`${this.app_name}\`.t_checkout
                            (cart_token, status,email,orderData,created_time) VALUES ?`, [fake_order_js_1.fakeOrder]);
    }
}
exports.InitialFakeData = InitialFakeData;
//# sourceMappingURL=initial-fake-data.js.map