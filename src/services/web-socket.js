"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocket = void 0;
const ws_1 = require("ws");
class WebSocket {
    static start() {
        const wss = new ws_1.WebSocket.Server({ port: 9003 });
        wss.on('connection', function connection(ws) {
            let event = {
                close: []
            };
            const id = new Date().getTime();
            console.log('Client connected');
            ws.on('message', function incoming(message) {
                var _a;
                console.log('received: %s', message);
                const json = JSON.parse(message);
                if (json.type === 'message') {
                    WebSocket.chatMemory[json.chatID] = (_a = WebSocket.chatMemory[json.chatID]) !== null && _a !== void 0 ? _a : [];
                    WebSocket.chatMemory[json.chatID].push({
                        id: id,
                        user_id: json.user_id,
                        callback: (data) => {
                            ws.send(JSON.stringify(data));
                        }
                    });
                    event.close.push(() => {
                        WebSocket.chatMemory[json.chatID] = WebSocket.chatMemory[json.chatID].filter((dd) => {
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
//# sourceMappingURL=web-socket.js.map