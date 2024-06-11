
import {TriggerEvent} from "../../glitterBundle/plugins/trigger-event.js";
import {Chat} from "../../glitter-base/route/chat.js";

TriggerEvent.createSingleEvent(import.meta.url, (glitter) => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            object.who=object.who??{}
            object.change_event=  object.change_event ?? {}
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.who, {
                            hover: false,
                            option: [],
                            title: "用戶ID"
                        }),
                        TriggerEvent.editer(gvc, widget, object.change_event, {
                            hover: false,
                            option: [],
                            title: "更新事件"
                        })
                    ].join(`<div class="my-2"></div>`)
                },
                event: () => {
                    return new Promise<any>(async (resolve, reject) => {
                        const userID = await TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.who
                        })
                        console.log(`linstiner_message->`,userID)
                        let socket:any=undefined
                        const url = new URL((window as any).glitterBackend)
                        let vm={
                            close:false
                        }
                        function connect(){
                            if (gvc.glitter.share.message_change_close_socket) {
                                gvc.glitter.share.message_change_close_socket()
                            }
                            socket=(location.href.includes('https://')) ? new WebSocket(`wss://${url.hostname}/websocket`) : new WebSocket(`ws://${url.hostname}:9003`);

                            gvc.glitter.share.message_change_close_socket=()=>{
                                vm.close=true
                                socket.close()
                                gvc.glitter.share.message_change_close_socket=undefined
                            }

                            gvc.glitter.share.message_change_socket = socket;
                            socket.addEventListener('open', function (event:any) {
                                console.log('Connected to server');
                                socket.send(JSON.stringify({
                                    type: 'message-count-change',
                                    user_id: userID
                                }))
                            });
                            let interVal: any = 0
                            socket.addEventListener('message', async function (event:any) {
                                const data = JSON.parse(event.data)
                                if (data.type === 'update_message_count') {
                                    await TriggerEvent.trigger({
                                        gvc: gvc, widget: widget, clickEvent: object.change_event
                                    })
                                }
                            });

                            socket.addEventListener('close', function (event:any) {
                                console.log('Disconnected from server');
                                if(!vm.close){
                                    console.log('Reconnected from server');
                                    connect()
                                }
                            });

                        }
                        connect()
                    })
                }
            }
        }
    }
})
