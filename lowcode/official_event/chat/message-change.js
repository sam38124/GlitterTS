var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { TriggerEvent } from "../../glitterBundle/plugins/trigger-event.js";
export const messageChange = TriggerEvent.createSingleEvent(import.meta.url, (glitter) => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            var _a, _b;
            object.who = (_a = object.who) !== null && _a !== void 0 ? _a : {};
            object.change_event = (_b = object.change_event) !== null && _b !== void 0 ? _b : {};
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
                    ].join(`<div class="my-2"></div>`);
                },
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        const userID = yield TriggerEvent.trigger({
                            gvc: gvc, widget: widget, clickEvent: object.who
                        });
                        let socket = undefined;
                        const url = new URL(window.glitterBackend);
                        let vm = {
                            close: false
                        };
                        function connect() {
                            if (gvc.glitter.share.message_change_close_socket) {
                                gvc.glitter.share.message_change_close_socket();
                            }
                            socket = (location.href.includes('https://')) ? new WebSocket(`wss://${url.hostname}/websocket`) : new WebSocket(`ws://${url.hostname}:9003`);
                            gvc.glitter.share.message_change_close_socket = () => {
                                vm.close = true;
                                socket.close();
                                gvc.glitter.share.message_change_close_socket = undefined;
                            };
                            gvc.glitter.share.message_change_socket = socket;
                            socket.addEventListener('open', function (event) {
                                console.log('Connected to server');
                                socket.send(JSON.stringify({
                                    type: 'message-count-change',
                                    user_id: userID,
                                    app_name: window.appName
                                }));
                            });
                            let interVal = 0;
                            socket.addEventListener('message', function (event) {
                                return __awaiter(this, void 0, void 0, function* () {
                                    const data = JSON.parse(event.data);
                                    if (data.type === 'update_message_count') {
                                        yield TriggerEvent.trigger({
                                            gvc: gvc, widget: widget, clickEvent: object.change_event
                                        });
                                    }
                                });
                            });
                            socket.addEventListener('close', function (event) {
                                console.log('Disconnected from server');
                                if (!vm.close) {
                                    console.log('Reconnected from server');
                                    connect();
                                }
                            });
                        }
                        connect();
                    }));
                }
            };
        }
    };
});
