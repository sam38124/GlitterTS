var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ShareDialog } from "../../glitterBundle/dialog/ShareDialog.js";
import { IminModule } from "./imin-module.js";
export class ConnectionMode {
    static get device_id() {
        return localStorage.getItem('pos_device_id');
    }
    static set device_id(value) {
        localStorage.setItem('pos_device_id', value);
    }
    static get connect_id() {
        return localStorage.getItem('pos_connect_id');
    }
    static set connect_id(value) {
        localStorage.setItem('pos_connect_id', value);
    }
    static get last_connect_id() {
        return localStorage.getItem('pos_last_connect_id');
    }
    static set last_connect_id(value) {
        localStorage.setItem('pos_last_connect_id', value);
    }
    static main(gvc) {
        const html = String.raw;
        const url = new URL(window.glitterBackend);
        let socket = undefined;
        const vm = {
            id: gvc.glitter.getUUID(),
            close: false,
            connected: false
        };
        gvc.glitter.innerDialog((gvc) => {
            function connect() {
                const url = new URL(window.glitterBackend);
                socket = (location.href.includes('https://')) ? new WebSocket(`wss://${url.hostname}/websocket`) : new WebSocket(`ws://${url.hostname}:9003`);
                socket.addEventListener('open', function (event) {
                    return __awaiter(this, void 0, void 0, function* () {
                        console.log('Connected to pos device server');
                        socket.send(JSON.stringify({
                            type: 'add_post_device',
                            token: window.saasConfig.config.token,
                            device_id: ConnectionMode.device_id,
                            app_name: window.appName
                        }));
                    });
                });
                socket.addEventListener('message', function (event) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const data = JSON.parse(event.data);
                        console.log(`getMessage:`, data);
                        switch (data.type) {
                            case 'on_connected':
                                vm.connected = true;
                                ConnectionMode.on_pare_device = data.connect_id;
                                console.log(`ConnectionMode.on_pare_device`, ConnectionMode.on_pare_device);
                                gvc.notifyDataChange(vm.id);
                                break;
                            case 'disconnect':
                                vm.connected = false;
                                gvc.notifyDataChange(vm.id);
                                break;
                            case 'function':
                                console.log(`收到命令:`, data.function);
                                switch (data.function.cmd) {
                                    case 'print_invoice':
                                        IminModule.printInvoice(data.function.invoice, data.function.orderID, data.function.staff_title);
                                        break;
                                    case 'credit_card':
                                        gvc.glitter.runJsInterFace('credit_card', {
                                            amount: data.function.amount,
                                            memo: data.function.memo,
                                            orderID: data.function.orderID,
                                            pwd: data.function.pwd
                                        }, (res) => {
                                            res.cmd = 'credit_card';
                                            ConnectionMode.sendCommandToPaired(res);
                                        });
                                        break;
                                }
                                break;
                        }
                    });
                });
                socket.addEventListener('close', function (event) {
                    console.log('Disconnected from pos device server');
                    if (!vm.close) {
                        console.log('Reconnected from server');
                        connect();
                    }
                });
            }
            connect();
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
                            const dialog = new ShareDialog(gvc.glitter);
                            dialog.checkYesOrNot({
                                text: '是否確認關閉連線?',
                                callback: (response) => {
                                    if (response) {
                                        vm.close = true;
                                        socket && socket.close();
                                        gvc.glitter.closeDiaLog();
                                    }
                                }
                            });
                        })}">關閉連線模式
                            </div>
                        </div>`;
                    },
                    divCreate: {
                        class: `dialog-box`
                    },
                    onCreate: () => {
                    },
                    onDestroy: () => {
                    }
                };
            });
        }, 'connection_mode', {
            dismiss: () => {
            },
        });
    }
    static sendCommand(data) {
        console.log(`send_to_pos`, data);
        ConnectionMode.socket.send(JSON.stringify({
            type: 'send_to_pos',
            token: window.saasConfig.config.token,
            app_name: window.appName,
            device_id: ConnectionMode.connect_id,
            connect: ConnectionMode.on_connected_device,
            data: data
        }));
    }
    static sendCommandToPaired(data) {
        ConnectionMode.socket.send(JSON.stringify({
            type: 'send_to_paired',
            token: window.saasConfig.config.token,
            app_name: window.appName,
            device_id: ConnectionMode.device_id,
            connect: ConnectionMode.on_pare_device,
            data: data
        }));
    }
    static connect(id) {
        ConnectionMode.last_connect_id = id;
        const dialog = new ShareDialog(this.gvc.glitter);
        dialog.dataLoading({ text: '配對中', visible: true });
        ConnectionMode.socket.send(JSON.stringify({
            type: 'connect',
            token: window.saasConfig.config.token,
            app_name: window.appName,
            device_id: ConnectionMode.connect_id,
            connect: id
        }));
    }
    static monitorDeviceList(gvc) {
        const dialog = new ShareDialog(this.gvc.glitter);
        function connect() {
            const url = new URL(window.glitterBackend);
            ConnectionMode.socket = (location.href.includes('https://')) ? new WebSocket(`wss://${url.hostname}/websocket`) : new WebSocket(`ws://${url.hostname}:9003`);
            ConnectionMode.socket.addEventListener('open', function (event) {
                return __awaiter(this, void 0, void 0, function* () {
                    console.log('Connected to get_post_device device server');
                    ConnectionMode.socket.send(JSON.stringify({
                        type: 'get_post_device',
                        token: window.saasConfig.config.token,
                        app_name: window.appName,
                        device_id: ConnectionMode.connect_id
                    }));
                });
            });
            let disconnect_timer = 0;
            ConnectionMode.socket.addEventListener('message', function (event) {
                return __awaiter(this, void 0, void 0, function* () {
                    const data = JSON.parse(event.data);
                    switch (data.type) {
                        case 'device_list_updated':
                            ConnectionMode.device_list = data.device_list.map((dd) => {
                                return dd.device_id;
                            });
                            if (ConnectionMode.device_list.find((dd) => {
                                return dd === ConnectionMode.last_connect_id;
                            })) {
                                ConnectionMode.connect(ConnectionMode.last_connect_id);
                            }
                            gvc.notifyDataChange(['right_top_info']);
                            break;
                        case 'on_connected':
                            clearInterval(disconnect_timer);
                            dialog.dataLoading({ visible: false });
                            ConnectionMode.on_connected_device = data.connect_id;
                            ConnectionMode.last_connect_id = data.connect_id;
                            gvc.glitter.closeDiaLog('disconnected');
                            dialog.successMessage({ text: '裝置配對成功' });
                            break;
                        case 'connected_false':
                            dialog.dataLoading({ visible: false });
                            dialog.errorMessage({ text: '配對失敗' });
                            break;
                        case 'disconnect':
                            ConnectionMode.on_connected_device = '';
                            clearInterval(disconnect_timer);
                            disconnect_timer = setTimeout(() => {
                                dialog.errorMessage({ text: '裝置已斷線', tag: 'disconnected' });
                            }, 1000);
                            break;
                        case 'function':
                            console.log(`收到命令:`, data.function);
                            switch (data.function.cmd) {
                                case 'credit_card':
                                    gvc.glitter.share.credit_card_callback(data.function);
                                    break;
                            }
                            break;
                    }
                });
            });
            ConnectionMode.socket.addEventListener('close', function (event) {
                console.log('Disconnected from get_post_device device server');
                console.log('Reconnected from server');
                ConnectionMode.on_connected_device = '';
                connect();
            });
        }
        connect();
    }
    static initial(gvc) {
        ConnectionMode.gvc = gvc;
        ConnectionMode.connect_id = ConnectionMode.connect_id || randomString(6).toUpperCase();
        ConnectionMode.device_id = ConnectionMode.device_id || randomString(6).toUpperCase();
        ConnectionMode.monitorDeviceList(gvc);
        gvc.glitter.share.ConnectionMode = ConnectionMode;
    }
    static printInvoice() {
    }
}
ConnectionMode.device_list = [];
ConnectionMode.on_connected_device = '';
ConnectionMode.on_pare_device = '';
function randomString(max) {
    let possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let text = possible.charAt(Math.floor(Math.random() * (possible.length - 10)));
    for (let i = 1; i < max; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}
