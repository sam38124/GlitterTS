export class Currency{
    public static code=[
        {
            "country_code": "US",
            "country_name": "美國",
            "currency_symbol": "$",
            "currency_code": "USD",
            "currency_title":'美金 (USD)'
        },
        {
            "country_code": "JP",
            "country_name": "日本",
            "currency_symbol": "¥",
            "currency_code": "JPY",
            "currency_title":'日幣 (JPY)'
        },
        {
            "country_code": "CN",
            "country_name": "中國",
            "currency_symbol": "¥",
            "currency_code": "CNY",
            "currency_title":'人民幣 (CNY)'
        },
        {
            "country_code": "MY",
            "country_name": "馬來西亞",
            "currency_symbol": "RM",
            "currency_code": "MYR",
            "currency_title":'令吉 (MYR)'
        },
        {
            "country_code": "CA",
            "country_name": "加拿大",
            "currency_symbol": "$",
            "currency_code": "CAD",
            "currency_title":'加幣 (CAD)'
        },
        {
            "country_code": "HK",
            "country_name": "香港",
            "currency_symbol": "$",
            "currency_code": "HKD",
            "currency_title":'港幣 (HKD)'
        },
        {
            "country_code": "KR",
            "country_name": "韓國",
            "currency_symbol": "₩",
            "currency_code": "KRW",
            "currency_title":'韓幣 (KRW)'
        },
        {
            "country_code": "TW",
            "country_name": "台灣",
            "currency_symbol": "$",
            "currency_code": "TWD",
            "currency_title":'新台幣 (TWD)'
        }
    ]


public static getCurrency(){
    (window as any).store_info.currency_code=(window as any).store_info.currency_code||'TWD';

    if(!(window as any).store_info.multi_currency){
        return Currency.code.find((dd)=>{
            return dd.currency_code=== (window as any).store_info.currency_code
        })
    }
    let last_select = localStorage.getItem('select_currency_' + (window as any).appName);

    if(!Currency.code.find((dd)=>{
        return dd.country_code===last_select
    })){
        //判斷現在IP是否有對應的幣別
        if(Currency.code.find((dd)=>{
            return dd.country_code===(window as any).ip_country
        })){
            last_select=(window as any).ip_country
        }else{
            last_select=Currency.code.find((dd)=>{
                return dd.currency_code===(window as any).store_info.currency_code
            })!.country_code
        }
    }
    localStorage.setItem(('select_currency_' + (window as any).appName),last_select as string);
    return Currency.code.find((dd)=>{
        return dd.country_code===last_select
    });
}

public static setCurrency(country:string){
    localStorage.setItem(('select_currency_' + (window as any).appName),country);
}

public static convertCurrency(money:any){
    //主要幣別
    const base=  (window as any).store_info.currency_code=(window as any).store_info.currency_code||'TWD';
    //選擇的幣別
    const select=this.getCurrency()!.currency_code as string
    const data=(window as any).currency_covert
    Object.keys(data).map((dd)=>{
        data[dd]=(data[dd]/data[base])
    })
    return parseFloat((data[select]*money).toFixed(2))
}

    public static convertCurrencyText(money:any){
        //主要幣別
        const base=  (window as any).store_info.currency_code=(window as any).store_info.currency_code||'TWD';
        const select_currency_code=this.getCurrency();
        //選擇的幣別
        const select=this.getCurrency()!.currency_code as string
        const data=(window as any).currency_covert
        const dbase=data[base]
        Object.keys(data).map((dd)=>{
            data[dd]=(data[dd]/dbase)
        });
        (window as any).glitter.share.currency=data;
        if(select_currency_code?.currency_code==='TWD'){
            return  `NT$ ${parseFloat((data[select]*money).toFixed(2)).toLocaleString()}`
        }else{
            return  `${select_currency_code?.currency_symbol}${parseFloat((data[select]*money).toFixed(2)).toLocaleString()} ${select_currency_code?.currency_code}`
        }

    }

}

