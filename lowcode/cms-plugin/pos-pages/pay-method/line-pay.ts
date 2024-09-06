import {BaseApi} from "../../../glitterBundle/api/base.js";
import {config} from "../../../config.js";
import {GlobalUser} from "../../../glitter-base/global/global-user.js";
import {PayConfig} from "../pay-config.js";

export class LinePay {
    public static pay(order_id:string,product_name:string,amount:number,oneTimeKey:string) {
        return BaseApi.create({
            "url": `${PayConfig.linePay.api}/v2/payments/oneTimeKeys/pay`,
            "type": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "X-LINE-ChannelId": PayConfig.linePay["X-LINE-ChannelId"],
                "X-LINE-ChannelSecret": PayConfig.linePay["X-LINE-ChannelSecret"]
            },
            "data":{
                "amount": amount,
                "currency": "TWD",
                "orderId": order_id,
                "productName": product_name,
                "oneTimeKey": oneTimeKey
            }
        })
    }
}