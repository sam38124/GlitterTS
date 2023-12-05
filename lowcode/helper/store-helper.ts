import {ApiPageConfig} from "../api/pageConfig.js";
import {config} from "../config.js";

export class StoreHelper{
    public static setPlugin(ogConfig:any,changeConfig:any){
        return new Promise((resolve, reject)=>{
            ApiPageConfig.getPlugin((window as any).appName).then(async (response)=>{
                const config=response.response.data;
                (['homePage','globalStyle','globalScript','globalValue','globalStyleTag']).map((dd:any)=>{
                    if(JSON.stringify(ogConfig[dd])===JSON.stringify(changeConfig[dd])){
                        changeConfig[dd]=config[dd]
                    }
                })
                const api = await ApiPageConfig.setPlugin((window as any).appName, changeConfig)

                resolve(api.result)
            }).catch(()=>{
                resolve(false)
            })
        })
    }

}