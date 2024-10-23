var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ApiUser } from "../glitter-base/route/user.js";
import { Chat } from "../glitter-base/route/chat.js";
import { imageLibrary } from "../modules/image-library.js";
import { ShareDialog } from "../glitterBundle/dialog/ShareDialog.js";
export class CustomerMessageUser {
    static showCustomerMessage(cf) {
        const gvc = cf.gvc;
        const html = String.raw;
        cf.userID = `${cf.userID}`;
        const chatID = [cf.userID, cf.toUser || 'manager'].sort().join('-');
        let open = cf.open || false;
        let vm = {
            viewType: cf.viewType || 'robot',
        };
        return gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                        const config = (yield ApiUser.getPublicConfig(`message_setting`, 'manager')).response.value || {
                            color: '#FE5541',
                            head: 'https://liondesign-prd.s3.amazonaws.com/file/252530754/1695093945424-Frame 62 (1).png',
                            name: '萊恩設計',
                        };
                        if (cf.type !== 'preview' && !config.toggle) {
                            resolve(``);
                            return;
                        }
                        CustomerMessageUser.config = config;
                        yield Chat.post({
                            type: 'user',
                            participant: [cf.userID, cf.toUser || 'manager'],
                        });
                        const css = String.raw;
                        const viewId = gvc.glitter.getUUID();
                        const chatView = () => {
                            return `<div class=" ${(cf.type === 'preview') ? `w-100 h-100 shadow-lg` : `position-fixed  rounded-3 shadow-lg `}" style="${gvc.glitter.ut.frSize({
                                sm: (cf.type === 'preview') ? css `
                                        width: 100%;
                                        height: 100%;
                                        z-index: 99999;
                                        overflow: hidden;
                                        background: white;
                                        padding-bottom: 70px;
                                    ` : css `
                                        width: 376px;
                                        height: 756px;
                                        bottom: 90px;
                                        left: 20px;
                                        z-index: 99999;
                                        overflow-y: hidden;
                                        background: white;
                                    `,
                            }, css `
                                    width: 100%;
                                    height: 100%;
                                    bottom: 0px;
                                    left: 0px;
                                    z-index: 99999;
                                    overflow-y: auto;
                                    background: white;
                                `)}">${CustomerMessageUser.detail({
                                gvc: gvc,
                                chat: {
                                    chat_id: chatID,
                                    type: 'user',
                                },
                                user_id: cf.userID,
                                containerHeight: gvc.glitter.ut.frSize({
                                    sm: (cf.type !== 'preview') ? `826px` : `${($('body').height() + 25)}px`,
                                }, `${window.innerHeight + 20}px`),
                                document: document,
                                goBack: () => {
                                    vm.viewType = 'robot';
                                    gvc.notifyDataChange(viewId);
                                },
                                close: gvc.glitter.ut.frSize({
                                    sm: undefined,
                                }, () => {
                                    open = !open;
                                    gvc.notifyDataChange(id);
                                }),
                            })}</div>`;
                        };
                        const roBotView = () => {
                            return `<div class="${(cf.type === 'preview') ? `position-relative` : `position-fixed `} rounded-3 shadow-lg " style="${gvc.glitter.ut.frSize({
                                sm: (cf.type === 'preview') ? css `
                                        width: 100%;
                                        height: 100%;
                                        z-index: 99999;
                                        overflow: hidden;
                                        background: white;
                                    ` : css `
                                        width: 376px;
                                        height: 756px;
                                        bottom: 90px;
                                        left: 20px;
                                        z-index: 99999;
                                        overflow-y: auto;
                                        background: white;
                                    `,
                            }, css `
                                    width: 100%;
                                    height: ${window.innerHeight}px;
                                    top: 0px;
                                    left: 0px;
                                    z-index: 99999;
                                    overflow-y: auto;
                                    background: white;

                                `)}">${CustomerMessageUser.robotMessage(gvc, (text) => __awaiter(this, void 0, void 0, function* () {
                                vm.viewType = 'message';
                                if (text) {
                                    yield Chat.postMessage({
                                        chat_id: chatID,
                                        user_id: cf.userID,
                                        message: {
                                            text: text,
                                            attachment: '',
                                        },
                                    });
                                }
                                gvc.notifyDataChange(viewId);
                            }))}</div>`;
                        };
                        const baseUrl = new URL('../', import.meta.url);
                        const chatBtID = id;
                        gvc.addStyle(css `
                            .btn-white-primary {
                                border: 2px solid ${CustomerMessageUser.config.color};
                                justify-content: space-between;
                                align-items: center;
                                cursor: pointer;
                                color: ${CustomerMessageUser.config.color};
                                gap: 10px;
                            }

                            .btn-white-primary:hover {
                                background: ${CustomerMessageUser.config.color};
                                color: white !important;
                            }
                        `);
                        resolve(gvc.bindView(() => {
                            return {
                                bind: viewId,
                                view: () => {
                                    if (cf.type === 'preview') {
                                        if (vm.viewType === 'message') {
                                            return chatView();
                                        }
                                        else if (vm.viewType === 'robot') {
                                            return roBotView();
                                        }
                                    }
                                    const btn = html `
                                        <div
                                                class="avatar-img rounded-circle position-relative"
                                                style="background-color: ${config
                                        .color};width: 58px;height: 58px ;cursor: pointer;display: flex;align-items: center;justify-content: center;position: fixed;left: 20px;bottom:20px;z-index: 100;"
                                                onclick="${gvc.event(() => {
                                        open = !open;
                                        gvc.notifyDataChange(viewId);
                                    })}"
                                        >
                                            <i class="${open ? `fa-sharp fa-regular fa-xmark` : `fa-solid fa-message-dots `}"
                                               style=" color: white;font-size: 30px;"></i>
                                            ${gvc.bindView(() => {
                                        const id = gvc.glitter.getUUID();
                                        let unread = 0;
                                        function checkUnread() {
                                            Chat.getUnRead({ user_id: cf.userID }).then((data) => {
                                                if (unread !== data.response.length) {
                                                    unread = data.response.length;
                                                    gvc.notifyDataChange(id);
                                                }
                                            });
                                        }
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
                                                    user_id: cf.userID,
                                                    app_name: window.appName
                                                }));
                                            });
                                            socket.addEventListener('message', function (event) {
                                                return __awaiter(this, void 0, void 0, function* () {
                                                    const data = JSON.parse(event.data);
                                                    if (data.type === 'update_message_count') {
                                                        checkUnread();
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
                                        checkUnread();
                                        return {
                                            bind: id,
                                            view: () => {
                                                if (unread === 0) {
                                                    return '';
                                                }
                                                else {
                                                    return ` <div class="position-absolute   rounded-circle d-flex align-items-center justify-content-center fw-500 shadow-lg border-danger text-danger" style="background: white;width:28px;height: 28px;top:-5px;right: -10px;border:2px solid red;">${unread}</div>`;
                                                }
                                            },
                                            onCreate: () => {
                                            },
                                        };
                                    })}
                                        </div>`;
                                    let view = [];
                                    gvc.glitter.ut.frSize({
                                        sm: () => {
                                            view.push(btn);
                                        },
                                    }, () => {
                                        !open && view.push(btn);
                                    })();
                                    if (open) {
                                        vm.viewType === 'message' && view.push(chatView());
                                        vm.viewType === 'robot' && view.push(roBotView());
                                    }
                                    else {
                                    }
                                    return view.join('');
                                },
                                divCreate: { class: `` },
                                onCreate: () => {
                                },
                            };
                        }));
                    }));
                },
                divCreate: {
                    elem: 'div',
                    class: (cf.type === 'preview') ? `position-relative` : `position-fixed`,
                    style: `z-index:99999;bottom:0px;left:0px;`,
                },
                onCreate: () => __awaiter(this, void 0, void 0, function* () {
                }),
            };
        });
    }
    static detail(cf) {
        const gvc = cf.gvc;
        const document = cf.document;
        const css = String.raw;
        const viewId = gvc.glitter.getUUID();
        let chatRoomInf = {};
        return gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                        const config = (yield ApiUser.getPublicConfig(`message_setting`, 'manager')).response.value || {
                            color: '#FE5541',
                            head: 'https://liondesign-prd.s3.amazonaws.com/file/252530754/1695093945424-Frame 62 (1).png',
                            name: '萊恩設計',
                        };
                        CustomerMessageUser.config = config;
                        gvc.addStyle(css `
                            .btn-white-primary {
                                border: 2px solid ${CustomerMessageUser.config.color};
                                justify-content: space-between;
                                align-items: center;
                                cursor: pointer;
                                color: ${CustomerMessageUser.config.color};
                                gap: 10px;
                            }

                            .btn-white-primary:hover {
                                background: ${CustomerMessageUser.config.color};
                                color: white !important;
                            }
                        `);
                        resolve([
                            gvc.bindView(() => {
                                const id = gvc.glitter.getUUID();
                                return {
                                    bind: id,
                                    view: () => {
                                        if (cf.hideBar) {
                                            return ``;
                                        }
                                        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                                            const chatRoom = (yield Chat.getChatRoom({
                                                page: 0,
                                                limit: 1000,
                                                user_id: cf.user_id,
                                                chat_id: cf.chat.chat_id,
                                            })).response.data[0];
                                            if (chatRoom.who === 'manager') {
                                                chatRoom.user_data = CustomerMessageUser.config;
                                            }
                                            if (chatRoom.who.startsWith('line')) {
                                                chatRoom.user_data.head = chatRoom.info.line.head;
                                                chatRoom.user_data.name = chatRoom.info.line.name;
                                                chatRoomInf = chatRoom;
                                                gvc.notifyDataChange(viewId);
                                            }
                                            if (chatRoom.who.startsWith('fb')) {
                                                chatRoom.user_data.head = chatRoom.info.fb.head;
                                                chatRoom.user_data.name = chatRoom.info.fb.name;
                                                chatRoomInf = chatRoom;
                                                gvc.notifyDataChange(viewId);
                                            }
                                            resolve(`<div class="navbar  d-flex align-items-center justify-content-between w-100  p-3 ${CustomerMessageUser.config.hideBar ? `d-none` : ``}" style="background: ${CustomerMessageUser.config.color};">
                      <div class="d-flex align-items-center pe-3 w-100" style="gap:10px;display: flex;align-items: center;">
                        <i class="fa-solid fa-chevron-left fs-6" style="color:white;cursor: pointer;" onclick="${gvc.event(() => {
                                                cf.goBack();
                                            })}"></i>
                        <img src="${chatRoom.type === 'user'
                                                ? (chatRoom.user_data && chatRoom.user_data.head) || chatRoom.user_data.head_img || 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1704269678588-43.png'
                                                : `https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1704269678588-43.png`}" class="rounded-circle border" style="background: white;border-radius: 50%;width: 40px;height: 40px;" width="40" alt="Albert Flores">
                        <h6 class="mb-0 px-1 text-white">${chatRoom.type === 'user' ? (chatRoom.user_data && chatRoom.user_data.name) || '訪客' : `群組`}</h6>
                        <div class="flex-fill" style="flex: 1;"></div>
                      <i class="fa-regular fa-circle-xmark text-white fs-3 ${cf.close ? `` : `d-none`}" onclick="${gvc.event(() => {
                                                cf.close && cf.close();
                                            })}"></i>
                      </div>
                    </div>`);
                                        }));
                                    },
                                };
                            }),
                            gvc.bindView(() => {
                                const messageID = gvc.glitter.getUUID();
                                const vm = {
                                    data: [],
                                    loading: true,
                                    scrollToBtn: false,
                                    lastScroll: -1,
                                    message: '',
                                    prefixScroll: 0,
                                    last_read: {},
                                    close: false,
                                };
                                Chat.getMessage({
                                    page: 0,
                                    limit: 50,
                                    chat_id: cf.chat.chat_id,
                                    user_id: cf.user_id,
                                }).then((res) => {
                                    vm.data = res.response.data.reverse();
                                    vm.last_read = res.response.lastRead;
                                    vm.loading = false;
                                    gvc.notifyDataChange(viewId);
                                });
                                const url = new URL(window.glitterBackend);
                                let socket = undefined;
                                function connect() {
                                    if (gvc.glitter.share.close_socket) {
                                        gvc.glitter.share.close_socket();
                                    }
                                    vm.close = false;
                                    socket = location.href.includes('https://') ? new WebSocket(`wss://${url.hostname}/websocket`) : new WebSocket(`ws://${url.hostname}:9003`);
                                    gvc.glitter.share.close_socket = () => {
                                        vm.close = true;
                                        socket.close();
                                        gvc.glitter.share.close_socket = undefined;
                                    };
                                    gvc.glitter.share.socket = socket;
                                    socket.addEventListener('open', function (event) {
                                        console.log('Connected to server');
                                        socket.send(JSON.stringify({
                                            type: 'message',
                                            chatID: cf.chat.chat_id,
                                            user_id: cf.user_id,
                                            app_name: window.appName
                                        }));
                                    });
                                    let interVal = 0;
                                    socket.addEventListener('message', function (event) {
                                        const data = JSON.parse(event.data);
                                        console.log(`message_in`, data.data);
                                        if (data.type === 'update_read_count') {
                                            vm.last_read = data.data;
                                        }
                                        else {
                                            vm.data.push(data);
                                            const element = document.querySelector('.chatContainer');
                                            const st = element.scrollTop;
                                            const ofs = element.offsetHeight;
                                            const sh = element.scrollHeight;
                                            for (const dd of document.querySelectorAll('.time-mute')) {
                                                dd.remove();
                                            }
                                            document.querySelector(`#message-lines`).innerHTML += CustomerMessageUser.message_line(data, vm.data.length - 1, gvc, vm, cf, chatRoomInf);
                                            if (st + ofs >= sh - 50) {
                                                element.scrollTop = element.scrollHeight;
                                                let clock = gvc.glitter.ut.clock();
                                                const interval = setInterval(() => {
                                                    if (clock.stop() > 1000) {
                                                        clearInterval(interval);
                                                    }
                                                    element.scrollTop = element.scrollHeight;
                                                }, 50);
                                            }
                                        }
                                        console.log('Message from server:', event.data);
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
                                const textAreaId = gvc.glitter.getUUID();
                                const html = String.raw;
                                return {
                                    bind: viewId,
                                    view: () => {
                                        let imageArray = [];
                                        if (vm.loading) {
                                            return String.raw `<div class="d-flex align-items-center justify-content-center w-100 flex-column pt-3">
                                <div class="spinner-border" role="status">
                                    <span class="sr-only"></span>
                                </div>
                                <span class="mt-2">載入中...</span>
                            </div>`;
                                        }
                                        return html ` ${gvc.bindView(() => {
                                            return {
                                                bind: messageID,
                                                view: () => {
                                                    try {
                                                        return ` 
                                                <div class="my-auto flex-fill"></div>
                                                   <div class="w-100" id="message-lines">
                                                          ${vm.data
                                                            .map((dd, index) => {
                                                            return CustomerMessageUser.message_line(dd, index, gvc, vm, cf, chatRoomInf);
                                                        })
                                                            .join('')}
                                                    </div>
                                            ${vm.data.length === 0
                                                            ? `
                                            <div class="w-100 text-center"><div class="badge bg-secondary">尚未展開對話，於下方輸入訊息並傳送。</div></div>
                                            `
                                                            : ``}`;
                                                    }
                                                    catch (e) {
                                                        console.log(e);
                                                        return `${e}`;
                                                    }
                                                },
                                                divCreate: {
                                                    class: `chatContainer p-3 d-flex flex-column`,
                                                    style: `overflow-y: auto;height: calc(${cf.containerHeight} - ${220 + (parseInt(gvc.glitter.share.bottom_inset || 0, 10))}px);background: white;padding-bottom:${cf.hideBar ? `80` : `0`}px !important;`,
                                                },
                                                onCreate: () => {
                                                    vm.close = false;
                                                    let targetElement = document.querySelector('.chatContainer');
                                                    if (vm.lastScroll === -1) {
                                                        setTimeout(() => {
                                                            document.querySelector('.chatContainer').scrollTop = document.querySelector('.chatContainer').scrollHeight;
                                                        }, 100);
                                                    }
                                                    else {
                                                        if (vm.prefixScroll) {
                                                            vm.lastScroll = targetElement.scrollHeight - vm.prefixScroll + vm.lastScroll;
                                                            vm.prefixScroll = 0;
                                                        }
                                                        document.querySelector('.chatContainer').scrollTop = vm.lastScroll;
                                                    }
                                                    targetElement.addEventListener('scroll', () => {
                                                        vm.lastScroll = targetElement.scrollTop;
                                                        if (targetElement.scrollTop === 0) {
                                                            if (vm.loading) {
                                                                return;
                                                            }
                                                            vm.loading = true;
                                                            Chat.getMessage({
                                                                page: 0,
                                                                limit: 50,
                                                                chat_id: cf.chat.chat_id,
                                                                olderID: vm.data[0].id,
                                                                user_id: cf.user_id,
                                                            }).then((res) => {
                                                                vm.loading = false;
                                                                vm.prefixScroll = targetElement.scrollHeight;
                                                                vm.data = res.response.data.reverse().concat(vm.data);
                                                                gvc.notifyDataChange(viewId);
                                                            });
                                                        }
                                                    });
                                                },
                                            };
                                        })}
                                        ${gvc.bindView({
                                            bind: "inputRow",
                                            view: () => {
                                                return html `
                                                    ${gvc.bindView({
                                                    bind: 'imageBox',
                                                    view: () => {
                                                        if (imageArray.length == 0) {
                                                            return ``;
                                                        }
                                                        else {
                                                            return html `
                                                                    <div class="d-flex align-items-center w-100"
                                                                         style="overflow-x: scroll;gap: 5px;padding:10px 0;margin-bottom:10px;">
                                                                        ${(() => {
                                                                return imageArray.map((url) => {
                                                                    return html `
                                                                                    <div class=""
                                                                                         style="position: relative;flex-shrink: 0;width: 25%;aspect-ratio: 1 / 1;background:50%/cover  url('${url}')">
                                                                                        <i class="fa-sharp fa-regular fa-circle-xmark bg-white"
                                                                                           style="position: absolute;right: -6px;top: -6px;cursor:pointer;font-size: 20px"></i>
                                                                                    </div>
                                                                                `;
                                                                });
                                                            })()}

                                                                    </div>
                                                                `;
                                                        }
                                                    }, divCreate: {
                                                        class: `d-flex w-100`,
                                                        style: ``
                                                    }
                                                })}
                                                    <div class="d-flex  w-100">
                                                        <div class="d-flex align-items-end">
                                                            <button
                                                                    type="button"
                                                                    class="btn btn-icon d-sm-inline-flex text-white"
                                                                    style="height: 36px;"
                                                                    onclick="${gvc.event(() => {
                                                    const queryParams = new URLSearchParams(window.location.search);
                                                    if (queryParams.get('function') != "backend-manger") {
                                                        gvc.glitter.ut.chooseMediaCallback({
                                                            single: true,
                                                            accept: 'json,image/*',
                                                            callback(data) {
                                                                const saasConfig = window.saasConfig;
                                                                const dialog = new ShareDialog(gvc.glitter);
                                                                dialog.dataLoading({ visible: true });
                                                                const file = data[0].file;
                                                                saasConfig.api.uploadFile(file.name).then((data) => {
                                                                    dialog.dataLoading({ visible: false });
                                                                    const data1 = data.response;
                                                                    dialog.dataLoading({ visible: true });
                                                                    const objP = {
                                                                        url: data1.url,
                                                                        type: 'put',
                                                                        data: file,
                                                                        headers: {
                                                                            "Content-Type": data1.type
                                                                        },
                                                                        processData: false,
                                                                        crossDomain: true,
                                                                        success: () => {
                                                                            dialog.dataLoading({ visible: false });
                                                                            imageArray.push(data1.fullUrl);
                                                                            gvc.notifyDataChange(`inputRow`);
                                                                        },
                                                                        error: () => {
                                                                            dialog.dataLoading({ visible: false });
                                                                            dialog.errorMessage({ text: '上傳失敗' });
                                                                        },
                                                                    };
                                                                    if (file.type.indexOf('svg') !== -1) {
                                                                        objP["headers"] = {
                                                                            "Content-Type": file.type
                                                                        };
                                                                    }
                                                                    $.ajax(objP);
                                                                });
                                                            },
                                                        });
                                                    }
                                                    else {
                                                        imageLibrary.selectImageLibrary(gvc, (urlArray) => {
                                                            imageArray.push(...urlArray.map((data) => {
                                                                return data.data;
                                                            }));
                                                            gvc.notifyDataChange(`inputRow`);
                                                        }, `<div class="d-flex flex-column" style="border-radius: 10px 10px 0px 0px;background: #F2F2F2;">圖片庫</div>`, { mul: true });
                                                    }
                                                })}"
                                                            >
                                                                <i class="fa-sharp fa-solid fa-image"
                                                                   style="font-size: 23px;color: #393939;"></i>
                                                            </button>
                                                        </div>

                                                        <div class="position-relative w-100 me-2 ms-1 d-flex flex-column"
                                                             style="">
                                                            ${gvc.bindView(() => {
                                                    return {
                                                        bind: textAreaId,
                                                        view: () => {
                                                            var _a;
                                                            return (_a = vm.message) !== null && _a !== void 0 ? _a : '';
                                                        },
                                                        divCreate: {
                                                            elem: `textArea`,
                                                            style: `max-height:100px;white-space: pre-wrap; word-wrap: break-word;height:40px;min-height:auto;height:45px;`,
                                                            class: `form-control`,
                                                            option: [
                                                                { key: 'placeholder', value: '輸入訊息內容' },
                                                                {
                                                                    key: 'onchange',
                                                                    value: gvc.event((e) => {
                                                                        vm.message = e.value;
                                                                    }),
                                                                },
                                                            ],
                                                        },
                                                        onCreate: () => {
                                                            const input = gvc.getBindViewElem(id).get(0);
                                                            input.addEventListener('input', function () {
                                                                console.log(`input.scrollHeight->`, input.scrollHeight);
                                                                input.style.height = 'auto';
                                                                input.style.height = input.scrollHeight + 'px';
                                                            });
                                                        },
                                                    };
                                                })}
                                                        </div>
                                                        <div class="d-flex align-items-end h-100">
                                                            <button
                                                                    type="button"
                                                                    class="btn btn-icon btn-lg  d-sm-inline-flex ms-1 text-white"
                                                                    style="background: ${CustomerMessageUser.config.color};height:45px;"
                                                                    onclick="${gvc.event(() => {
                                                    const dialog = new ShareDialog(gvc.glitter);
                                                    if (!imageArray.length && !vm.message) {
                                                        dialog.errorMessage({ text: '請輸入訊息' });
                                                        return;
                                                    }
                                                    dialog.dataLoading({
                                                        visible: true
                                                    });
                                                    if (imageArray.length) {
                                                        dialog.dataLoading({
                                                            visible: true
                                                        });
                                                        for (const image of imageArray) {
                                                            Chat.postMessage({
                                                                chat_id: cf.chat.chat_id,
                                                                user_id: cf.user_id,
                                                                message: {
                                                                    image: image,
                                                                    attachment: '',
                                                                },
                                                            }).then((res) => {
                                                                imageArray = [];
                                                                gvc.notifyDataChange('imageBox');
                                                                dialog.dataLoading({
                                                                    visible: false
                                                                });
                                                            });
                                                        }
                                                    }
                                                    if (vm.message) {
                                                        dialog.dataLoading({
                                                            visible: true
                                                        });
                                                        Chat.postMessage({
                                                            chat_id: cf.chat.chat_id,
                                                            user_id: cf.user_id,
                                                            message: {
                                                                text: vm.message,
                                                                attachment: '',
                                                            },
                                                        }).then((res) => {
                                                            vm.message = '';
                                                            console.log(res);
                                                            dialog.dataLoading({
                                                                visible: false
                                                            });
                                                        });
                                                        const textArea = gvc.getBindViewElem(textAreaId).get(0);
                                                        textArea.value = '';
                                                        vm.message = '';
                                                    }
                                                })}"
                                                            >
                                                                <i class="fa-regular fa-paper-plane-top"></i>
                                                            </button>
                                                        </div>
                                                    </div>


                                                `;
                                            }, divCreate: {
                                                class: `card-footer border-top d-flex flex-column align-items-center w-100 border-0 pt-3 pb-3 pe-4 ps-3 position-fixed bottom-0 position-lg-absolute`,
                                                style: `background: white;min-height:45px;`
                                            }
                                        })}`;
                                    },
                                    divCreate: {},
                                    onCreate: () => {
                                    },
                                    onDestroy: () => {
                                        vm.close = true;
                                        socket.close();
                                    },
                                };
                            }),
                        ].join(''));
                    }));
                },
            };
        });
    }
    static robotMessage(gvc, goToChat) {
        const html = String.raw;
        return gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    var _a, _b;
                    return html `
                        <div class=" card rounded-3">
                            <div class="p-3 rounded-top"
                                 style="width: 100%;white-space: normal;background: ${CustomerMessageUser.config.color};">
                                <div class="text-white fw-bold" style=" font-size: 20px;">
                                    ${(_a = CustomerMessageUser.config.title) !== null && _a !== void 0 ? _a : ''}
                                </div>
                                <p class=" text-white mt-2 mb-4"
                                   style=" font-size: 16px;line-height: 22px;font-weight: 400;">
                                    ${((_b = CustomerMessageUser.config.content) !== null && _b !== void 0 ? _b : '').replace(/\n/g, `<br>`)}</p>
                                <button
                                        class="btn w-100  rounded text-white"
                                        style=" background-color: rgba(0, 0, 0, 0.2);"
                                        onclick="${gvc.event(() => {
                        goToChat('');
                    })}"
                                >
                                    返回聊天
                                </button>
                            </div>
                        </div>
                        ${gvc.bindView(() => {
                        const css = String.raw;
                        const id = gvc.glitter.getUUID();
                        return {
                            bind: id,
                            view: () => {
                                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                                    const returnHtml = [];
                                    const robot = (yield ApiUser.getPublicConfig('robot_auto_reply', 'manager')).response.value.question;
                                    if (robot.length > 0) {
                                        returnHtml.push(html `
                                                <div class=" fw-bold"
                                                     style=" height: 60px;display: flex;align-items: center;justify-content: center;font-size: 16px;">
                                                    <div class="" style="color: black;">即時解答</div>
                                                </div>`);
                                    }
                                    robot.map((dd) => {
                                        returnHtml.push(`<div class="rounded-3 w-100 d-flex px-3 btn-white-primary py-2 fw-500"
                                                     style=" " onclick="${gvc.event(() => {
                                            goToChat(dd.ask);
                                        })}">
                                                    <div style="white-space: normal;" class="flex-fill">${dd.ask}</div><i class="fa-solid fa-paper-plane-top"
                                                                        style="font-size:18px;"
                                                                        aria-hidden="true"></i></div>`);
                                    });
                                    resolve(returnHtml.join('') &&
                                        html `
                                                    <div class="px-3 pb-3"
                                                         style=" display: flex;flex-direction: column;align-items: center;justify-content: center;gap:10px;font-size: 16px;">
                                                        ${returnHtml.join('')}
                                                    </div>`);
                                }));
                            },
                            divCreate: {
                                style: css `
                                        background-color: white;
                                    `,
                            },
                        };
                    })}
                    `;
                },
                divCreate: {},
            };
        });
    }
    static message_line(dd, index, gvc, vm, cf, chatRoomInf) {
        var _a, _b;
        const html = String.raw;
        function drawChatContent() {
            if (dd.message.image) {
                return html `<img style="cursor: pointer;"
                                 src="${dd.message.image}"
                                 alt="image"
                                 onclick="${gvc.event(() => {
                    gvc.glitter.openDiaLog(new URL('./dialog/image-preview.js', gvc.glitter.root_path).href, 'preview', dd.message.image);
                })}">`;
            }
            else {
                return dd.message.text.replace(/\n/g, '<br>');
            }
        }
        dd.message.text = dd.message.text || "";
        if (dd.user_id == 'manager') {
            dd.user_data = CustomerMessageUser.config;
        }
        if (cf.user_id !== dd.user_id) {
            if (chatRoomInf.who && (chatRoomInf.who.startsWith('line'))) {
                dd.user_data.head = chatRoomInf.info.line.head;
                dd.user_data.name = chatRoomInf.info.line.name;
            }
            if (chatRoomInf.who && (chatRoomInf.who.startsWith('fb'))) {
                dd.user_data.head = chatRoomInf.info.fb.head;
                dd.user_data.name = chatRoomInf.info.fb.name;
            }
            return html `
                <div
                        class="mt-auto d-flex align-items-start ${vm.data[index + 1] && vm.data[index + 1].user_id === dd.user_id ? `mb-1` : `mb-3`}"
                >
                    <img
                            src="${(dd.user_data && dd.user_data.head) || `https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1704269678588-43.png`}"
                            class="rounded-circle border"
                            width="40"
                            style="background: white;border-radius: 50%;width: 40px;height: 40px;"
                            alt="Albert Flores"
                    />
                    <div class="ps-2 ms-1 pe-3"
                         style="max-width: 348px;">
                        <div
                                class="p-3 mb-1 ${((_a = dd === null || dd === void 0 ? void 0 : dd.message) === null || _a === void 0 ? void 0 : _a.image) ? '' : 'py-2'}"
                                style="background:#eeeef1;border-top-right-radius: .5rem; border-bottom-right-radius: .5rem; border-bottom-left-radius: .5rem;white-space: normal;"
                        >
                            ${drawChatContent()}
                        </div>
                        <div class="fs-sm text-muted ${vm.data[index + 1] && vm.data[index + 1].user_id === dd.user_id ? `d-none` : ``}">
                            ${gvc.glitter.ut.dateFormat(new Date(dd.created_time), 'MM-dd hh:mm')}
                        </div>
                    </div>
                </div>`;
        }
        else {
            return html `
                <div
                        class="d-flex align-items-start justify-content-end ${vm.data[index + 1] && vm.data[index + 1].user_id === dd.user_id
                ? `mb-1`
                : `mb-3`}"
                >
                    <div class="pe-2 me-1 ps-3"
                         style="max-width: 348px;">
                        <div
                                class=" text-light p-3 mb-1 ${((_b = dd === null || dd === void 0 ? void 0 : dd.message) === null || _b === void 0 ? void 0 : _b.image) ? '' : 'py-2'}"
                                style="background:${CustomerMessageUser.config
                .color};border-top-left-radius: .5rem; border-bottom-right-radius: .5rem; border-bottom-left-radius: .5rem;white-space: normal;"
                        >
                            ${drawChatContent()}
                        </div>
                        <div
                                class="fw-500 d-flex justify-content-end align-items-center fs-sm text-muted ${vm.data[index + 1] &&
                vm.data[index + 1].user_id === dd.user_id
                ? `d-none`
                : ``}"
                                style="gap:5px;"
                        >
                            <span> ${gvc.glitter.ut.dateFormat(new Date(dd.created_time), 'MM/dd hh:mm')}</span>
                            ${vm.last_read.find((d2) => {
                return d2.user_id !== cf.user_id && new Date(d2.last_read).getTime() >= new Date(dd.created_time).getTime();
            })
                ? `已讀`
                : ``}
                        </div>
                    </div>
                    <img
                            src="${(dd.user_data && dd.user_data.head) || `https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1704269678588-43.png`}"
                            class="rounded-circle border"
                            style="background: white;border-radius: 50%;width: 40px;height: 40px;"
                            width="40"
                            alt="Albert Flores"
                    />
                </div>`;
        }
    }
}
CustomerMessageUser.config = {};
CustomerMessageUser.vm = {
    type: 'list',
    chat_user: '',
    select_bt: 'list',
};
CustomerMessageUser.id = `dsmdklweew3`;
window.glitter.setModule(import.meta.url, CustomerMessageUser);
