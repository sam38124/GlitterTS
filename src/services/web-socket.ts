import {WebSocket as wk} from "ws";

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

            ws.on('message', function incoming(message: any) {
                console.log('received: %s', message);
                const json = JSON.parse(message);
                const chat_key=json.app_name+json.chatID as string;
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
                }else if(json.type==='message-count-change'){
                    json.user_id=`${json.user_id}`
                    WebSocket.messageChangeMem[json.user_id as string]=WebSocket.messageChangeMem[json.user_id as string] ?? []
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
                }else if(json.type==='notice_count_change'){
                    json.user_id=`${json.user_id}`
                    WebSocket.noticeChangeMem[json.user_id as string]=WebSocket.noticeChangeMem[json.user_id as string] ?? []
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