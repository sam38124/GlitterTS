import db from '../../modules/database';
import Tool from "../../modules/tool.js";
import {fakeUser} from "./fake-data-model/fake-user.js";
import {fakeOrder} from "./fake-data-model/fake-order.js";

export class InitialFakeData {
    public app_name: string

    constructor(app_name: string) {
        this.app_name = app_name
    }

    public async run() {
await this.insertFakeUser()
    }

    public async insertFakeUser() {
        await db.query(`delete from \`${this.app_name}\`.t_user where id>0`,[]);
        await db.query(`delete from \`${this.app_name}\`.t_checkout where id>0`,[]);
        await db.query(`insert into \`${this.app_name}\`.t_user
                            (userID, account,userData,created_time,online_time,pwd) VALUES ?`,[
                                fakeUser.map((dd)=>{
                                    return [dd.userID,dd.userData.email,JSON.stringify(dd.userData),dd.created_time,dd.online_time,dd.pwd]
                                })
            ]
        )
        await db.query(`insert into \`${this.app_name}\`.t_checkout
                            (cart_token, status,email,orderData,created_time) VALUES ?`,[fakeOrder]
        )
    }
}
