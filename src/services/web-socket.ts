import {WebSocket as wk} from "ws";
import jwt from "jsonwebtoken";
import {IToken} from "../api-public/models/Auth.js";
import {config, saasConfig} from '../config';
import redis from "../modules/redis.js";
import {UtPermission} from "../api-public/utils/ut-permission.js";

export class WebSocket {
    public static chatMemory: {
        [key: string]: {
            id: any,
            user_id: string,
            callback: (data: any) => void;
        }[]
    } = {}


    public static messageChangeMem: {
        [userID: string]: {
            id: any,
            callback: (data: any) => void;
        }[]
    } = {}

    public static noticeChangeMem: {
        [userID: string]: {
            id: any,
            callback: (data: any) => void;
        }[]
    } = {}

    public static posDeviceList: {
        [app_name: string]: {
            device_id: string,
            callback: (json: any) => void,
            connect_device: string
        }[]
    } = {}

    public static getDeviceList: {
        [app_name: string]: {
            device_id: string,
            callback: (json: any) => void,
            connect_device: string
        }[]
    } = {}

    public static start() {
        WebSocket.userMessage()
    }

    public static userMessage() {
        const wss = new wk.Server({port: 9003});
        wss.on('connection', function connection(ws: any) {
            let event: {
                close: (() => void)[]
            } = {
                close: []
            }
            const id = new Date().getTime()
            console.log('Client connected');

            ws.on('message', async function incoming(message: any) {
                console.log('received: %s', message);
                const json = JSON.parse(message);
                const chat_key = json.app_name + json.chatID as string;
                if (json.type === 'message') {
                    WebSocket.chatMemory[chat_key] = WebSocket.chatMemory[chat_key] ?? []
                    WebSocket.chatMemory[chat_key].push({
                        id: id,
                        user_id: json.user_id,
                        callback: (data) => {
                            ws.send(JSON.stringify(data));
                        }
                    })
                    event.close.push(() => {
                        WebSocket.chatMemory[chat_key] = WebSocket.chatMemory[chat_key].filter((dd) => {
                            return dd.id !== id
                        })
                    })
                } else if (json.type === 'message-count-change') {
                    json.user_id = `${json.user_id}`
                    WebSocket.messageChangeMem[json.user_id as string] = WebSocket.messageChangeMem[json.user_id as string] ?? []
                    WebSocket.messageChangeMem[json.user_id as string].push({
                        id: id,
                        callback: (data) => {
                            ws.send(JSON.stringify(data));
                        }
                    })
                    event.close.push(() => {
                        WebSocket.messageChangeMem[json.user_id as string] = WebSocket.messageChangeMem[json.user_id as string].filter((dd) => {
                            return dd.id !== id
                        })
                    })
                } else if (json.type === 'notice_count_change') {
                    json.user_id = `${json.user_id}`
                    WebSocket.noticeChangeMem[json.user_id as string] = WebSocket.noticeChangeMem[json.user_id as string] ?? []
                    WebSocket.noticeChangeMem[json.user_id as string].push({
                        id: id,
                        callback: (data) => {
                            ws.send(JSON.stringify(data));
                        }
                    })
                    event.close.push(() => {
                        WebSocket.noticeChangeMem[json.user_id as string] = WebSocket.noticeChangeMem[json.user_id as string].filter((dd) => {
                            return dd.id !== id
                        })
                    })
                } else if (json.type === 'add_post_device') {
                    const cf: {
                        app_name: string,
                        token: string,
                        device_id: string
                    } = json
                    //判斷token有過再加入裝置
                    try {
                        const token = jwt.verify(cf.token, config.SECRET_KEY) as IToken;
                        const redisToken = await redis.getValue(cf.token);
                        if (redisToken && await UtPermission.isManagerTokenCheck(cf.app_name, `${token.userID}`)) {
                            console.log(`成功加入裝置至${cf.app_name}:${cf.device_id}`);
                            WebSocket.posDeviceList[cf.app_name] = WebSocket.posDeviceList[cf.app_name] ?? []
                            const da={
                                device_id: cf.device_id,
                                callback: (json:any) => {
                                    ws.send(JSON.stringify(json));
                                },
                                connect_device: ''
                            }
                            WebSocket.posDeviceList[cf.app_name].push(da);
                            PosCallback.updateDevice(cf.app_name);
                            event.close.push(() => {
                                console.log(`成功移除裝置至${cf.app_name}:${cf.device_id}`);
                                WebSocket.posDeviceList[cf.app_name] = WebSocket.posDeviceList[cf.app_name].filter((dd) => {
                                    return dd.device_id !== cf.device_id
                                })
                                //通知斷線
                                if(da.connect_device){
                                    PosCallback.disconnect_paired(da.device_id,da.connect_device,cf.app_name)
                                }
                                PosCallback.updateDevice(cf.app_name);
                            })
                        }
                    } catch (e) {
console.log(e)
                    }
                } else if (json.type === 'get_post_device') {
                    const cf: {
                        app_name: string,
                        token: string,
                        device_id: string
                    } = json
                    //判斷token有過再加入裝置
                    try {
                        const token = jwt.verify(cf.token, config.SECRET_KEY) as IToken;
                        const redisToken = await redis.getValue(cf.token);
                        if (redisToken && await UtPermission.isManagerTokenCheck(cf.app_name, `${token.userID}`)) {
                            WebSocket.posDeviceList[cf.app_name] = WebSocket.posDeviceList[cf.app_name] ?? []
                            WebSocket.getDeviceList[cf.app_name] = WebSocket.getDeviceList[cf.app_name] ?? []
                            const pa={
                                callback: (data:any) => {
                                    ws.send(JSON.stringify(data));
                                },
                                device_id: cf.device_id,
                                connect_device: ''
                            }
                            WebSocket.getDeviceList[cf.app_name].push(pa);
                            PosCallback.updateDevice(cf.app_name);
                            event.close.push(() => {
                                console.log(`成功移除裝置${cf.app_name}:${cf.device_id}`);
                                WebSocket.getDeviceList[cf.app_name] = WebSocket.getDeviceList[cf.app_name].filter((dd) => {
                                    return dd.device_id !== cf.device_id
                                })
                                //通知斷線
                                if(pa.connect_device){
                                    PosCallback.disconnect_device(pa.device_id,pa.connect_device,cf.app_name)
                                }
                            })
                        }
                    } catch (e) {

                    }
                }else  if (json.type === 'connect') {
                    const cf: {
                        app_name: string,
                        token: string,
                        device_id: string,
                        connect:string
                    } = json
                    //判斷token有過再執行
                    try {
                        const token = jwt.verify(cf.token, config.SECRET_KEY) as IToken;
                        const redisToken = await redis.getValue(cf.token);
                        if (redisToken && await UtPermission.isManagerTokenCheck(cf.app_name, `${token.userID}`)) {
                            //連線至裝置
                            PosCallback.connect(cf.device_id,cf.connect,cf.app_name)
                        }
                    } catch (e) {
console.log(e)
                    }
                }else  if (json.type === 'send_to_pos'){
                    const cf: {
                        app_name: string,
                        token: string,
                        device_id: string,
                        connect:string,
                        data:any
                    } = json
                    //判斷token有過再執行
                    try {
                        const token = jwt.verify(cf.token, config.SECRET_KEY) as IToken;
                        const redisToken = await redis.getValue(cf.token);
                        if (redisToken && await UtPermission.isManagerTokenCheck(cf.app_name, `${token.userID}`)) {
                            //連線至裝置
                            PosCallback.sendToPos(cf.connect,cf.app_name,cf.data)
                        }
                    } catch (e) {
                        console.log(e)
                    }
                }else  if (json.type === 'send_to_paired'){
                    const cf: {
                        app_name: string,
                        token: string,
                        device_id: string,
                        connect:string,
                        data:any
                    } = json
                    //判斷token有過再執行
                    try {
                        const token = jwt.verify(cf.token, config.SECRET_KEY) as IToken;
                        const redisToken = await redis.getValue(cf.token);
                        if (redisToken && await UtPermission.isManagerTokenCheck(cf.app_name, `${token.userID}`)) {
                            //連線至裝置
                            PosCallback.sendToPosReal(cf.connect,cf.app_name,cf.data)
                        }
                    } catch (e) {
                        console.log(e)
                    }
                }

            });

            ws.on('close', function close() {
                console.log('Client disconnected');
                event.close.map((dd) => {
                    dd()
                })
            });
        });
    }

}

export class PosCallback {
    //更新裝置
    public static updateDevice(app_name: string) {
        //通知裝置列表更新
        WebSocket.getDeviceList[app_name].map((dd) => {
            dd.callback({
                type: 'device_list_updated',
                device_list: WebSocket.posDeviceList[app_name].filter((dd) => {
                    return !dd.connect_device
                }).map((dd) => ({
                    device_id: dd.device_id
                }))
            })
        })
    }
    //連線裝置
    public static connect(connect_id:string,device_id:string,app_name:string){
        //Pos連線裝置
        const device=WebSocket.posDeviceList[app_name].find((dd)=>{return (dd.device_id===device_id) && !dd.connect_device})
        //請求連線的裝置
        const req_paired=WebSocket.getDeviceList[app_name].find((dd)=>{
            return dd.device_id===connect_id
        })
        console.log(`配對裝置1`,device);
        console.log(`配對裝置2`,req_paired);
        if(device && req_paired){
            console.log(`配對裝置成功`)
            device.connect_device=req_paired.device_id;
            req_paired.connect_device=device.device_id;
            //通知連線
            req_paired.callback({type:'on_connected',connect_id:device.device_id})
            device.callback({type:'on_connected',connect_id:req_paired.device_id})
            //更新可連線列表
            PosCallback.updateDevice(app_name)
            console.log(`已成功連線至:${device.device_id}`)
        }else if(req_paired){
            //連線失敗通知
            req_paired.callback({type:'connected_false',connect_id:device_id})
        }
    }
    //解除裝置連線
    public static disconnect_device(connect_id:string,device_id:string,app_name:string){
        //Pos連線裝置
        const device=WebSocket.posDeviceList[app_name].find((dd)=>{return (dd.device_id===device_id) && dd.connect_device===connect_id})

        if(device){
            device.connect_device=''
            //連線失敗通知
            device.callback({type:'disconnect',connect_id:connect_id})
        }
    }
    //解除配對連線
    public static disconnect_paired(local:string,who:string,app_name:string){
        //Pos連線裝置
        const device=WebSocket.getDeviceList[app_name].find((dd)=>{return (dd.device_id===who) && dd.connect_device===local})

        if(device){
            device.connect_device=''
            //連線失敗通知
            device.callback({type:'disconnect',connect_id:who})
        }
    }
    //傳送訊息至Imin裝置
    public static sendToPos(device_id:string,app_name:string,data:any){
        //Pos連線裝置
        const device=WebSocket.posDeviceList[app_name].find((dd)=>{return (dd.device_id===device_id)})
       if(device){
           device.callback({
               type:"function",
               function:data
           })
       }
    }
    //傳送訊息至POS虛擬機
    public static sendToPosReal(device_id:string,app_name:string,data:any){
        //Pos連線裝置
        const device=WebSocket.getDeviceList[app_name].find((dd)=>{return (dd.device_id===device_id)})
        if(device){
            device.callback({
                type:"function",
                function:data
            })
        }
    }
}