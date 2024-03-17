

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
            fetch(config.url, requestOptions)
                .then(async (response) => {
                    try {
                        const json=await response.json()
                        resolve({result: true,response:json})
                    }catch (e){
                        resolve({result: true,response:''})
                    }

                }).catch(error => {
                    console.log(error)
                resolve({result: false,response:error})
            });
        })
    }
}