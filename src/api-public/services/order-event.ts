import db from "../../modules/database.js";
import {Cart, Order} from "./shopping.js";
import {FbApi} from "./fb-api.js";
import express from "express";

export class OrderEvent {
    //添加訂單時的事件
    public static async insertOrder(obj:{
        cartData:Cart | any,
        status:number,
        app:string
    }){
        await db.execute(
            `INSERT INTO \`${obj.app}\`.t_checkout (cart_token, status, email, orderData)
                             values (?, ?, ?, ?)`,
            [obj.cartData.orderID, obj.status, obj.cartData.email, obj.cartData]
        );
        await new FbApi(obj.app).checkOut(obj.cartData);
    }
}