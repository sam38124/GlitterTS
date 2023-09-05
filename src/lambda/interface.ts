import axios from "axios";
import fs from "fs";
import fsn from "fs";
import path2 from "path";

export interface DB {
    query: (sql: string, par: any[]) => Promise<string[]>,
}

export interface USER {
    userID: number,
    userData: any,
    account: string,
    created_time: Date,
    status: number
}

function setup(config: {
    firebase?: {
        projectId: string,
        clientEmail: string,
        privateKey: string
    }
    auth: {
        account: string,
        pwd: string
    },
    domain: string,
    app_name: string,
    router: {
        name: string,
        route: string,
        type: 'post' | 'delete' | 'get' | 'put'
        execute: (db: DB, request: {
            user?: USER,
            data: any,
            app: string,
            firebase: {
                sendMessage: (message: {
                    notification: {
                        title: string,
                        body: string,
                    },
                    type: "topic" | "token",
                    for: string
                }) => void
            }
        }) => Promise<any>
    }[]
}) {
    let data = JSON.stringify(config.auth);
    axios.request({
        method: 'post',
        url: config.domain + '/api/v1/user/login',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    })
        .then((response: any) => {
            const token = response.data.userData.token
            axios.request({
                method: 'get',
                url: `${config.domain}/api/v1/private?appName=${config.app_name}&key=sql_api_config_post`,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => {
                    let postData = config.router.map((dd) => {
                        return {
                            "sql": `{
 execute: ${dd.execute.toString()}
}`,
                            "type": dd.type,
                            "route": dd.route,
                            "title": dd.name,
                            "expand": false
                        }
                    })
                    axios.request({
                        method: 'post',
                        url: `${config.domain}/api/v1/private`,
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        data: JSON.stringify({
                            "appName": config.app_name,
                            "key": "sql_api_config_post",
                            "value": {
                                "expand": true,
                                "firebase": config.firebase,
                                "apiList": postData
                            }
                        })
                    })
                        .then((response) => {
                            console.log("部署成功");
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                })
                .catch((error) => {
                    console.log(error);
                });

        })
        .catch((error: any) => {
            console.log(error);
        });
}

function create_function(fun: (db: DB, request: {
    user?: USER,
    data: any,
    app: string,
    query:any,
    firebase: {
        sendMessage: (message: {
            notification: {
                title: string,
                body: string,
            },
            type: "topic" | "token",
            for: string
        }) => void
    }
}) => Promise<any>) {
    return fun
}

export function createViewComponent(config: {
    domain: string,
    app_name: string,
    auth: {
        account: string,
        pwd: string
    },
    router: {
        prefix: string,
        path: string,
        interface: {
            name: string,
            path: string,
            key:string
        }[]
    }[],
    loop:boolean
}) {
    const cloneConfig=JSON.parse(JSON.stringify(config))
    return new Promise( (resolve, reject)=>{
        (new Promise(async (resolve, reject) => {
            let waitPush: { path: string, name: string, prefix: string }[] = []
            let lastRead: any = {}
            try {
                lastRead = JSON.parse(fsn.readFileSync('glitter.buildInfo', 'utf8'));
            } catch (e) {
            }

            function readPath(path: string, parent: string, prefix: string) {
                fsn.readdirSync(path).map((file) => {
                    if (fsn.lstatSync(`${path}/${file}`).isDirectory()) {
                        readPath(`${path}/${file}`, parent, prefix)
                    } else if (path2.extname(`${path}/${file}`) !== ".ts" && path2.extname(`${path}/${file}`) !== ".ts~") {
                        const stats = fsn.statSync(`${path}/${file}`)
                        const pathRoute=path2.relative(path2.resolve(parent), path2.resolve(`${path}/${file}`))
                        if (!lastRead[pathRoute] || lastRead[pathRoute] < (stats.mtime.getTime())) {
                            console.log(`修改了:${path}/${file}`);
                            lastRead[pathRoute] = stats.mtime.getTime()
                            waitPush.push({
                                path: `${path}/${file}`,
                                prefix: prefix,
                                name: pathRoute
                            })
                        }

                    }
                });
            }

            config.router.map((dd) => {
                readPath(dd.path, dd.path, dd.prefix)
            })
            if (waitPush.length === 0) {
                resolve(true)
                return
            }
            const token = await new Promise((resolve, reject) => {
                axios.request({
                    method: 'post',
                    url: config.domain + '/api/v1/user/login',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify(config.auth)
                })
                    .then((response: any) => {
                        resolve(response.data.userData.token)
                    }).catch((error) => {
                    resolve(false)
                })
            })
            if (!token) {
                console.log(`部署失敗．`)
                resolve(false)
                return
            }

            function upload(path: string, fileName: string) {
                return new Promise(async (resolve, reject) => {
                    const fileData = await fs.readFileSync(path)
                    axios.request({
                        method: 'post',
                        url: `${config.domain}/api/v1/fileManager/uploadTemplate`,
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        data: JSON.stringify({
                            "fileName": fileName,
                            "app": config.app_name,
                        })
                    }).then((response) => {
                        const data1 = response.data;
                        axios.request({
                            method: 'put',
                            url: data1.url,
                            headers: {
                                'Content-Type': data1.type
                            },
                            data: fileData
                        })
                            .then((response: any) => {
                                console.log(`上傳成功:${data1.fullUrl}`)
                                resolve(data1.fullUrl)
                            }).catch((error) => {
                            console.log(`上傳失敗:${fileName}`)
                            reject(false)
                        })
                    }).catch((e) => {
                        console.log(e)
                        console.log(`上傳失敗:${fileName}`)
                        reject(false)
                    })
                })


            }


            for (const b of chunkArray(waitPush, 200)) {
                const result = await new Promise((resolve, reject) => {
                    let count = 0
                    for (let c = 0; c < b.length; c++) {
                        //嘗試三次
                        let falRetry = 3
                        function exe() {
                            if (fs.statSync(b[c].path).size === 0) {
                                count++
                                if (count === b.length) {
                                    resolve(true)
                                }
                            } else {
                                upload(b[c].path, b[c].prefix + "/" + b[c].name).then((data) => {
                                    count++
                                    if (count === b.length) {
                                        resolve(true)
                                    }
                                }).catch((reason) => {
                                    falRetry--
                                    if (falRetry == 0) {
                                        resolve(false)
                                    } else {
                                        setTimeout(() => {
                                            exe()
                                        }, 100)
                                    }
                                })
                            }
                        }
                        exe()
                    }
                })
                if (!result) {
                    console.log(`上傳檔案失敗`)
                    resolve(false)
                    return
                }
            }

            const data: any = await new Promise((resolve, reject) => {
                axios.request({
                    method: 'get',
                    url: `${config.domain}/api/v1/app/plugin?appName=${config.app_name}`,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }).then((response) => {
                    resolve(response.data.data)
                }).catch((e) => {
                    console.log(e)
                    console.log(`取得失敗`)
                    reject(false)
                })
            })
            const appPrefix: string = await new Promise((resolve, reject) => {
                axios.request({
                    method: 'get',
                    url: `${config.domain}/api/v1/fileManager/templatePrefix?app=${config.app_name}`,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }).then((response) => {
                    resolve(response.data.domain)
                }).catch((e) => {
                    console.log(e)
                    console.log(`取得失敗`)
                    reject(false)
                })
            })
              data.lambdaView = (data.lambdaView ?? []).filter((dd: any) => {
                return !config.router.find((d2) => {
                    return dd.prefix === d2.prefix
                });
            })
            config.router.map((d2) => {
                data.lambdaView = data.lambdaView.concat(d2.interface.map((dd: any) => {
                    dd.path = appPrefix + "/" + d2.prefix + "/" + dd.path;
                   (dd as any).prefix = d2.prefix;
                    return dd;
                }))
            })
            await new Promise((resolve, reject) => {
                axios.request({
                    method: 'put',
                    url: `${config.domain}/api/v1/app/plugin`,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify({
                        appName: config.app_name,
                        config: data
                    })
                }).then((response) => {
                    resolve(response.data.data)
                }).catch((e) => {
                    console.log(e)
                    console.log(`上傳配置檔失敗`)
                    reject(false)
                })
            })
            console.log(`部署成功`)
            fsn.writeFileSync(`glitter.buildInfo`,JSON.stringify(lastRead))
            resolve(true)
        })).then(()=>{
            if(config.loop){
                setTimeout(()=>{
                    createViewComponent(cloneConfig)
                },500)
            }
        })

    })
}

function chunkArray(array: any[], groupSize: number) {
    const result = [];
    for (let i = 0; i < array.length; i += groupSize) {
        result.push(array.slice(i, i + groupSize))
    }
    return result
}


export const lambda = {
    setup: setup,
    create_function: create_function,
    createViewComponent: createViewComponent
}
