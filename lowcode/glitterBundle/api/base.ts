import {Language} from "../../glitter-base/global/language.js";


export class BaseApi {
    public static create(config: any) {
        return new Promise<{result:boolean,response:any}>((resolve, reject) => {
            const requestOptions :any= {
                method: config.type,
                headers: config.headers,
                body:config.data,
                mode: 'cors'
            };
            if(requestOptions.method==='GET'){
                requestOptions.body=undefined
            }
            try {
                requestOptions.headers['mac_address']=(window as any).glitter.macAddress;
                requestOptions.headers['language']=Language.getLanguage()
            }catch (e) {

            }
            fetch(config.url, requestOptions)
                .then(async (response) => {
                    try {
                        const json=await response.json()
                        resolve({result:  response.status===200,response:json})
                    }catch (e){
                        resolve({result:  response.status===200,response:''})
                    }
                }).catch(error => {
                console.log(`fetch-error`,error)
                resolve({result: false,response:error})
            });

        })
    }
}

