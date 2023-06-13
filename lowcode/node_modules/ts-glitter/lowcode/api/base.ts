import {config} from "../config";

export class BaseApi {
    public static create(config: any) {
        return new Promise<{result:boolean,response:any}>((resolve, reject) => {
            config.error = (jqXHR: any, textStatus: any, errorThrown: any) => {
                resolve({result: false,response:jqXHR})
            }
            config.success = (response:any) => {
                resolve({result: true,response:response})
            }
            $.ajax(config);
        })
    }
}