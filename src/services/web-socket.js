"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PosCallback = exports.WebSocket = void 0;
const ws_1 = require("ws");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const redis_js_1 = __importDefault(require("../modules/redis.js"));
const ut_permission_js_1 = require("../api-public/utils/ut-permission.js");
class WebSocket {
    static start() {
        WebSocket.userMessage();
    }
    static userMessage() {
        const wss = new ws_1.WebSocket.Server({ port: 9003 });
        wss.on('connection', function connection(ws) {
            let event = {
                close: []
            };
            const id = new Date().getTime();
            console.log('Client connected');
            ws.on('message', async function incoming(message) {
                var _a, _b, _c, _d, _e, _f;
                console.log('received: %s', message);
                const json = JSON.parse(message);
                const chat_key = json.app_name + json.chatID;
                if (json.type === 'message') {
                    WebSocket.chatMemory[chat_key] = (_a = WebSocket.chatMemory[chat_key]) !== null && _a !== void 0 ? _a : [];
                    WebSocket.chatMemory[chat_key].push({
                        id: id,
                        user_id: json.user_id,
                        callback: (data) => {
                            ws.send(JSON.stringify(data));
                        }
                    });
                    event.close.push(() => {
                        WebSocket.chatMemory[chat_key] = WebSocket.chatMemory[chat_key].filter((dd) => {
                            return dd.id !== id;
                        });
                    });
                }
                else if (json.type === 'message-count-change') {
                    json.user_id = `${json.user_id}`;
                    WebSocket.messageChangeMem[json.user_id] = (_b = WebSocket.messageChangeMem[json.user_id]) !== null && _b !== void 0 ? _b : [];
                    WebSocket.messageChangeMem[json.user_id].push({
                        id: id,
                        callback: (data) => {
                            ws.send(JSON.stringify(data));
                        }
                    });
                    event.close.push(() => {
                        WebSocket.messageChangeMem[json.user_id] = WebSocket.messageChangeMem[json.user_id].filter((dd) => {
                            return dd.id !== id;
                        });
                    });
                }
                else if (json.type === 'notice_count_change') {
                    json.user_id = `${json.user_id}`;
                    WebSocket.noticeChangeMem[json.user_id] = (_c = WebSocket.noticeChangeMem[json.user_id]) !== null && _c !== void 0 ? _c : [];
                    WebSocket.noticeChangeMem[json.user_id].push({
                        id: id,
                        callback: (data) => {
                            ws.send(JSON.stringify(data));
                        }
                    });
                    event.close.push(() => {
                        WebSocket.noticeChangeMem[json.user_id] = WebSocket.noticeChangeMem[json.user_id].filter((dd) => {
                            return dd.id !== id;
                        });
                    });
                }
                else if (json.type === 'add_post_device') {
                    const cf = json;
                    try {
                        const token = jsonwebtoken_1.default.verify(cf.token, config_1.config.SECRET_KEY);
                        const redisToken = await redis_js_1.default.getValue(cf.token);
                        if (redisToken && await ut_permission_js_1.UtPermission.isManagerTokenCheck(cf.app_name, `${token.userID}`)) {
                            console.log(`成功加入裝置至${cf.app_name}:${cf.device_id}`);
                            WebSocket.posDeviceList[cf.app_name] = (_d = WebSocket.posDeviceList[cf.app_name]) !== null && _d !== void 0 ? _d : [];
                            const da = {
                                device_id: cf.device_id,
                                callback: (json) => {
                                    ws.send(JSON.stringify(json));
                                },
                                connect_device: ''
                            };
                            WebSocket.posDeviceList[cf.app_name].push(da);
                            PosCallback.updateDevice(cf.app_name);
                            event.close.push(() => {
                                console.log(`成功移除裝置至${cf.app_name}:${cf.device_id}`);
                                WebSocket.posDeviceList[cf.app_name] = WebSocket.posDeviceList[cf.app_name].filter((dd) => {
                                    return dd.device_id !== cf.device_id;
                                });
                                if (da.connect_device) {
                                    PosCallback.disconnect_paired(da.device_id, da.connect_device, cf.app_name);
                                }
                                PosCallback.updateDevice(cf.app_name);
                            });
                        }
                    }
                    catch (e) {
                        console.log(e);
                    }
                }
                else if (json.type === 'get_post_device') {
                    const cf = json;
                    try {
                        const token = jsonwebtoken_1.default.verify(cf.token, config_1.config.SECRET_KEY);
                        const redisToken = await redis_js_1.default.getValue(cf.token);
                        if (redisToken && await ut_permission_js_1.UtPermission.isManagerTokenCheck(cf.app_name, `${token.userID}`)) {
                            WebSocket.posDeviceList[cf.app_name] = (_e = WebSocket.posDeviceList[cf.app_name]) !== null && _e !== void 0 ? _e : [];
                            WebSocket.getDeviceList[cf.app_name] = (_f = WebSocket.getDeviceList[cf.app_name]) !== null && _f !== void 0 ? _f : [];
                            const pa = {
                                callback: (data) => {
                                    ws.send(JSON.stringify(data));
                                },
                                device_id: cf.device_id,
                                connect_device: ''
                            };
                            WebSocket.getDeviceList[cf.app_name].push(pa);
                            PosCallback.updateDevice(cf.app_name);
                            event.close.push(() => {
                                console.log(`成功移除裝置${cf.app_name}:${cf.device_id}`);
                                WebSocket.getDeviceList[cf.app_name] = WebSocket.getDeviceList[cf.app_name].filter((dd) => {
                                    return dd.device_id !== cf.device_id;
                                });
                                if (pa.connect_device) {
                                    PosCallback.disconnect_device(pa.device_id, pa.connect_device, cf.app_name);
                                }
                            });
                        }
                    }
                    catch (e) {
                    }
                }
                else if (json.type === 'connect') {
                    const cf = json;
                    try {
                        const token = jsonwebtoken_1.default.verify(cf.token, config_1.config.SECRET_KEY);
                        const redisToken = await redis_js_1.default.getValue(cf.token);
                        if (redisToken && await ut_permission_js_1.UtPermission.isManagerTokenCheck(cf.app_name, `${token.userID}`)) {
                            PosCallback.connect(cf.device_id, cf.connect, cf.app_name);
                        }
                    }
                    catch (e) {
                        console.log(e);
                    }
                }
                else if (json.type === 'send_to_pos') {
                    const cf = json;
                    try {
                        const token = jsonwebtoken_1.default.verify(cf.token, config_1.config.SECRET_KEY);
                        const redisToken = await redis_js_1.default.getValue(cf.token);
                        if (redisToken && await ut_permission_js_1.UtPermission.isManagerTokenCheck(cf.app_name, `${token.userID}`)) {
                            PosCallback.sendToPos(cf.connect, cf.app_name, cf.data);
                        }
                    }
                    catch (e) {
                        console.log(e);
                    }
                }
                else if (json.type === 'send_to_paired') {
                    const cf = json;
                    try {
                        const token = jsonwebtoken_1.default.verify(cf.token, config_1.config.SECRET_KEY);
                        const redisToken = await redis_js_1.default.getValue(cf.token);
                        if (redisToken && await ut_permission_js_1.UtPermission.isManagerTokenCheck(cf.app_name, `${token.userID}`)) {
                            PosCallback.sendToPosReal(cf.connect, cf.app_name, cf.data);
                        }
                    }
                    catch (e) {
                        console.log(e);
                    }
                }
            });
            ws.on('close', function close() {
                console.log('Client disconnected');
                event.close.map((dd) => {
                    dd();
                });
            });
        });
    }
}
exports.WebSocket = WebSocket;
WebSocket.chatMemory = {};
WebSocket.messageChangeMem = {};
WebSocket.noticeChangeMem = {};
WebSocket.posDeviceList = {};
WebSocket.getDeviceList = {};
class PosCallback {
    static updateDevice(app_name) {
        WebSocket.getDeviceList[app_name].map((dd) => {
            dd.callback({
                type: 'device_list_updated',
                device_list: WebSocket.posDeviceList[app_name].filter((dd) => {
                    return !dd.connect_device;
                }).map((dd) => ({
                    device_id: dd.device_id
                }))
            });
        });
    }
    static connect(connect_id, device_id, app_name) {
        const device = WebSocket.posDeviceList[app_name].find((dd) => { return (dd.device_id === device_id) && !dd.connect_device; });
        const req_paired = WebSocket.getDeviceList[app_name].find((dd) => {
            return dd.device_id === connect_id;
        });
        console.log(`配對裝置1`, device);
        console.log(`配對裝置2`, req_paired);
        if (device && req_paired) {
            console.log(`配對裝置成功`);
            device.connect_device = req_paired.device_id;
            req_paired.connect_device = device.device_id;
            req_paired.callback({ type: 'on_connected', connect_id: device.device_id });
            device.callback({ type: 'on_connected', connect_id: req_paired.device_id });
            PosCallback.updateDevice(app_name);
            console.log(`已成功連線至:${device.device_id}`);
        }
        else if (req_paired) {
            req_paired.callback({ type: 'connected_false', connect_id: device_id });
        }
    }
    static disconnect_device(connect_id, device_id, app_name) {
        const device = WebSocket.posDeviceList[app_name].find((dd) => { return (dd.device_id === device_id) && dd.connect_device === connect_id; });
        if (device) {
            device.connect_device = '';
            device.callback({ type: 'disconnect', connect_id: connect_id });
        }
    }
    static disconnect_paired(local, who, app_name) {
        const device = WebSocket.getDeviceList[app_name].find((dd) => { return (dd.device_id === who) && dd.connect_device === local; });
        if (device) {
            device.connect_device = '';
            device.callback({ type: 'disconnect', connect_id: who });
        }
    }
    static sendToPos(device_id, app_name, data) {
        const device = WebSocket.posDeviceList[app_name].find((dd) => { return (dd.device_id === device_id); });
        if (device) {
            device.callback({
                type: "function",
                function: data
            });
        }
    }
    static sendToPosReal(device_id, app_name, data) {
        const device = WebSocket.getDeviceList[app_name].find((dd) => { return (dd.device_id === device_id); });
        if (device) {
            device.callback({
                type: "function",
                function: data
            });
        }
    }
}
exports.PosCallback = PosCallback;
//# sourceMappingURL=web-socket.js.map