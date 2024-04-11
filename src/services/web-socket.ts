import {WebSocket as wk} from "ws";

export class WebSocket {
    public static chatMemory: {
        [key: string]: {
            id: any,
            user_id:string,
            callback: (data: any) => void;
        }[]
    } = {}

    public static start() {
        const wss = new wk.Server({port: 9003});
        wss.on('connection', function connection(ws: any) {
            let event:{
                close:(()=>void)[]
            }={
                close:[]
            }
            const id=new Date().getTime()
            console.log('Client connected');

            ws.on('message', function incoming(message: any) {
                console.log('received: %s', message);
                const json = JSON.parse(message)
                if (json.type === 'message') {
                    WebSocket.chatMemory[json.chatID as string] = WebSocket.chatMemory[json.chatID as string] ?? []
                    WebSocket.chatMemory[json.chatID as string].push({
                        id:id,
                        user_id:json.user_id,
                        callback:(data)=>{
                            ws.send(JSON.stringify(data));
                        }
                    })
                    event.close.push(()=>{
                        WebSocket.chatMemory[json.chatID as string]=WebSocket.chatMemory[json.chatID as string].filter((dd)=>{
                            return dd.id !== id
                        })
                    })
                }
            });

            ws.on('close', function close() {
                console.log('Client disconnected');
                event.close.map((dd)=>{
                    dd()
                })
            });
        });

    }
}