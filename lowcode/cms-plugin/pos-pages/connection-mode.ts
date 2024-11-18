import {GVC} from "../../glitterBundle/GVController.js";
import {ApiUser} from "../../glitter-base/route/user.js";
import {GlobalUser} from "../../glitter-base/global/global-user.js";
import {ShareDialog} from "../../glitterBundle/dialog/ShareDialog.js";
import {IminModule} from "./imin-module.js";

export class ConnectionMode {
    //GVC
    public static gvc: GVC;

    //主機的ID
    public static get device_id() {
        return localStorage.getItem('pos_device_id') as string
    }

    public static set device_id(value: string) {
        localStorage.setItem('pos_device_id', value)
    }

    //附機的ID
    public static get connect_id() {
        return localStorage.getItem('pos_connect_id') as string
    }

    public static set connect_id(value: string) {
        localStorage.setItem('pos_connect_id', value)
    }

    //紀錄上次連線的裝置
    public static get last_connect_id() {
        return localStorage.getItem('pos_last_connect_id') as string
    }

    public static set last_connect_id(value: string) {
        localStorage.setItem('pos_last_connect_id', value)
    }

    //現在有的POS裝置列表
    public static device_list = []
    //連線用的Socket
    public static socket: any;
    //已連線的裝置ID
    public static on_connected_device = ''
    //已配對的裝置UD
    public static on_pare_device = ''
    public static main(gvc: GVC) {
        const html = String.raw
        const url = new URL((window as any).glitterBackend)
        let socket: any = undefined;
        const vm = {
            id: gvc.glitter.getUUID(),
            close: false,
            connected: false
        }

        gvc.glitter.innerDialog(
            (gvc: GVC) => {
                //添加POS裝置列表
                function connect() {
                    const url = new URL((window as any).glitterBackend)
                    socket = (location.href.includes('https://')) ? new WebSocket(`wss://${url.hostname}/websocket`) : new WebSocket(`ws://${url.hostname}:9003`);
                    socket.addEventListener('open', async function (event: any) {
                        console.log('Connected to pos device server');
                        socket.send(JSON.stringify({
                            type: 'add_post_device',
                            token: (window as any).saasConfig.config.token,
                            device_id: ConnectionMode.device_id,
                            app_name: (window as any).appName
                        }))
                    });
                    socket.addEventListener('message', async function (event: any) {
                        const data = JSON.parse(event.data)
                        console.log(`getMessage:`, data)
                        switch (data.type) {
                            case 'on_connected':
                                vm.connected = true;
                                ConnectionMode.on_pare_device=data.connect_id;
                                console.log(`ConnectionMode.on_pare_device`,ConnectionMode.on_pare_device)
                                gvc.notifyDataChange(vm.id)
                                break
                            case 'disconnect':
                                vm.connected = false
                                gvc.notifyDataChange(vm.id)
                                break
                            case 'function':
                                console.log(`收到命令:`, data.function)
                                switch (data.function.cmd) {
                                    case 'print_invoice':
                                        IminModule.printInvoice(data.function.invoice, data.function.orderID, data.function.staff_title)
                                        break
                                    case 'credit_card':

                                        gvc.glitter.runJsInterFace(
                                            'credit_card',
                                            {
                                                amount: data.function.amount,
                                                memo: data.function.memo
                                            },
                                            (res: any) => {
                                                res.cmd='credit_card'
                                                ConnectionMode.sendCommandToPaired(res)
                                            }
                                        )
                                        break
                                }
                                break
                        }
                    });
                    socket.addEventListener('close', function (event: any) {
                        console.log('Disconnected from pos device server');
                        if (!vm.close) {
                            console.log('Reconnected from server');
                            connect()
                        }
                    });
                }

                connect()
                return gvc.bindView(() => {
                    return {
                        bind: vm.id,
                        view: () => {
                            return `<div class="dialog-content position-relative "
                             style="width: 370px;max-width: calc(100% - 20px);background: #f4f6f8;">
                            <div class="my-3  fw-500 text-center d-flex flex-column align-items-center justify-content-center"
                                 style="white-space: normal; overflow-wrap: anywhere;font-size: 20px;font-style: normal;font-weight: 700;line-height: normal;letter-spacing: 2.8px;gap:10px;">
                                ${vm.connected ? `裝置已成功配對` : `等待配對中`} \n
                                <span class="fs-6" style="color:gray;">配對ID : ${ConnectionMode.device_id}</span>
                            </div>
                            <img src="${gvc.glitter.root_path}cms-plugin/pos-pages/lottie/${(vm.connected) ? `connected` : `disconect`}.jpg" class="mx-auto " speed="1"
                                           style="max-width:70%;" ></img>
                            <div class="fw-500 w-100 mt-3"
                                 style="border-radius: 10px;border: 1px solid #DDD;background: #FFF;padding: 12px 24px;color: #393939;width:120px;text-align:center;cursor: pointer;"
                                 onclick="${gvc.event(() => {
                                const dialog = new ShareDialog(gvc.glitter)
                                dialog.checkYesOrNot({
                                    text: '是否確認關閉連線?',
                                    callback: (response) => {
                                        if (response) {
                                            vm.close = true;
                                            socket && socket.close();
                                            gvc.glitter.closeDiaLog();
                                        }
                                    }
                                })
                            })}">關閉連線模式
                            </div>
                        </div>`
                        },
                        divCreate: {
                            class: `dialog-box`
                        },
                        onCreate: () => {

                        },
                        onDestroy: () => {
                        }
                    }
                })
            },
            'connection_mode',
            {
                dismiss: () => {
                    // vm.type = "list";
                },
            }
        )
    }

    public static sendCommand(data: any) {
        console.log(`send_to_pos`,data)
        ConnectionMode.socket.send(JSON.stringify({
            type: 'send_to_pos',
            token: (window as any).saasConfig.config.token,
            app_name: (window as any).appName,
            device_id: ConnectionMode.connect_id,
            connect: ConnectionMode.on_connected_device,
            data: data
        }))
    }

    public static sendCommandToPaired(data: any) {
        ConnectionMode.socket.send(JSON.stringify({
            type: 'send_to_paired',
            token: (window as any).saasConfig.config.token,
            app_name: (window as any).appName,
            device_id: ConnectionMode.device_id,
            connect: ConnectionMode.on_pare_device,
            data: data
        }))
    }

    public static connect(id: string) {
        ConnectionMode.last_connect_id = id
        const dialog = new ShareDialog(this.gvc.glitter)
        dialog.dataLoading({text: '配對中', visible: true})
        ConnectionMode.socket.send(JSON.stringify({
            type: 'connect',
            token: (window as any).saasConfig.config.token,
            app_name: (window as any).appName,
            device_id: ConnectionMode.connect_id,
            connect: id
        }))
    }

    public static monitorDeviceList(gvc: GVC) {
        const dialog = new ShareDialog(this.gvc.glitter)

        //列出POS裝置列表
        function connect() {
            const url = new URL((window as any).glitterBackend)
            ConnectionMode.socket = (location.href.includes('https://')) ? new WebSocket(`wss://${url.hostname}/websocket`) : new WebSocket(`ws://${url.hostname}:9003`);
            ConnectionMode.socket.addEventListener('open', async function (event: any) {
                console.log('Connected to get_post_device device server');
                ConnectionMode.socket.send(JSON.stringify({
                    type: 'get_post_device',
                    token: (window as any).saasConfig.config.token,
                    app_name: (window as any).appName,
                    device_id: ConnectionMode.connect_id
                }))
            });
            let disconnect_timer:any=0
            ConnectionMode.socket.addEventListener('message', async function (event: any) {
                const data = JSON.parse(event.data)
                console.log(`get_post_device==>`, data)
                switch (data.type) {
                    case 'device_list_updated':
                        ConnectionMode.device_list = data.device_list.map((dd: any) => {
                            return dd.device_id
                        });
                        //當找到上次連線裝置時重新連線
                        if (ConnectionMode.device_list.find((dd) => {
                            return dd === ConnectionMode.last_connect_id
                        })) {
                            ConnectionMode.connect(ConnectionMode.last_connect_id)
                        }
                        gvc.notifyDataChange(['right_top_info'])
                        break
                    case 'on_connected':
                        clearInterval(disconnect_timer)
                        dialog.dataLoading({visible: false})
                        ConnectionMode.on_connected_device = data.connect_id
                        ConnectionMode.last_connect_id = data.connect_id
                        gvc.glitter.closeDiaLog('disconnected')
                        dialog.successMessage({text: '裝置配對成功'})
                        break
                    case 'connected_false':
                        dialog.dataLoading({visible: false})
                        dialog.errorMessage({text: '配對失敗'})
                        break
                    case 'disconnect':
                        ConnectionMode.on_connected_device = ''
                        clearInterval(disconnect_timer)
                        disconnect_timer=setTimeout(()=>{
                            dialog.errorMessage({text: '裝置已斷線',tag:'disconnected'})
                        },1000)
                        break
                    case 'function':
                        console.log(`收到命令:`, data.function)
                        switch (data.function.cmd){
                            case 'credit_card':
                                gvc.glitter.share.credit_card_callback(data.function)
                                break
                        }
                        break
                }

            });
            ConnectionMode.socket.addEventListener('close', function (event: any) {
                console.log('Disconnected from get_post_device device server');
                console.log('Reconnected from server');
                ConnectionMode.on_connected_device = ''
                connect()
            });
        }

        connect()
    }


    public static initial(gvc: GVC) {
        ConnectionMode.gvc = gvc
        //設定連線裝置ID
        ConnectionMode.connect_id = ConnectionMode.connect_id || randomString(6).toUpperCase()
        //設定POS裝置ID
        ConnectionMode.device_id = ConnectionMode.device_id || randomString(6).toUpperCase()
        //監聽裝置列表
        ConnectionMode.monitorDeviceList(gvc)
        //設定到global環境中方便呼叫
        gvc.glitter.share.ConnectionMode = ConnectionMode

    }

    //發票列印
    public static printInvoice() {

    }
}

function randomString(max: number) {
    let possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let text = possible.charAt(Math.floor(Math.random() * (possible.length - 10)));
    for (let i = 1; i < max; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}