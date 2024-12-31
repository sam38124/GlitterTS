export class PayConfig{
    public static mode:"beta"|"normal"="beta"
    public static deviceType:'pos'|'app'|'web'='web'
    public static pos_config:any={}

    //在付款模式
    public static onPayment?:(scanText:string)=>void=undefined
}