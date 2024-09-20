export class PayConfig{
    public static mode:"beta"|"normal"="beta"
    public static get linePay():{
        "X-LINE-ChannelId":string,
        "X-LINE-ChannelSecret":string,
        "api":string
    }{
        if(PayConfig.mode==="normal"){
            return {
                "X-LINE-ChannelId":"2006263059",
                "X-LINE-ChannelSecret":"9bcca1d8f66b9ec60cd1a3498be253e2",
                "api":"https://sandbox-api-pay.line.me"
            }
        }else{
            return {
                "X-LINE-ChannelId":"2006263059",
                "X-LINE-ChannelSecret":"9bcca1d8f66b9ec60cd1a3498be253e2",
                "api":"https://sandbox-api-pay.line.me"
            }
        }
    }
    public static deviceType:'pos'|'app'|'web'='web'

    public static pos_config:any={}
}