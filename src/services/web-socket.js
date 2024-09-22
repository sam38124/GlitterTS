"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocket = void 0;
const ws_1 = require("ws");
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
            ws.on('message', function incoming(message) {
                var _a, _b;
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
//# sourceMappingURL=web-socket.js.map