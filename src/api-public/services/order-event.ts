import db from "../../modules/database.js";
import { Cart, Order, Shopping } from './shopping.js';
import {FbApi} from "./fb-api.js";
import express from "express";
import { CheckoutService } from './checkout.js';

export class OrderEvent {
    //添加訂單時的事件
    public static async insertOrder(obj:{
        cartData:Cart | any,
        status:number,
        app:string
    }){
        const insert=await db.execute(
            `replace INTO \`${obj.app}\`.t_checkout (cart_token, status, email, orderData)
                             values (?, ?, ?, ?)`,
            [obj.cartData.orderID, obj.status, obj.cartData.email, obj.cartData]
        );
        //添加索引
        await new Shopping(obj.app).putOrder({
            cart_token:obj.cartData.orderID,
            status:undefined,
            orderData:obj.cartData
        })
        await new FbApi(obj.app).checkOut(obj.cartData);
    }
}