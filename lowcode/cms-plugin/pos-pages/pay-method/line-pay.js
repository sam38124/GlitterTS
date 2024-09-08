import { BaseApi } from "../../../glitterBundle/api/base.js";
import { PayConfig } from "../pay-config.js";
export class LinePay {
    static pay(order_id, product_name, amount, oneTimeKey) {
        return BaseApi.create({
            "url": `${PayConfig.linePay.api}/v2/payments/oneTimeKeys/pay`,
            "type": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "X-LINE-ChannelId": PayConfig.linePay["X-LINE-ChannelId"],
                "X-LINE-ChannelSecret": PayConfig.linePay["X-LINE-ChannelSecret"]
            },
            "data": JSON.stringify({
                "amount": amount,
                "currency": "TWD",
                "orderId": order_id,
                "productName": product_name,
                "oneTimeKey": oneTimeKey
            })
        });
    }
}
