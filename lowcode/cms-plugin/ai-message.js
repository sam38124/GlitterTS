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
import { AiChat } from "../glitter-base/route/ai-chat.js";
export class AiMessage {
    static aiRobot(cf) {
        const gvc = cf.gvc;
        cf.userID = `${cf.userID}`;
        const chatID = [cf.userID, cf.toUser || 'manager'].sort().join('-');
        const vm = {
            visible: false,
            id: gvc.glitter.getUUID()
        };
        return gvc.bindView(() => {
            AiMessage.toggle = ((vis) => {
                vm.visible = vis;
                $(document.querySelector('.ai-left')).addClass(`scroll-out`);
                setTimeout(() => {
                    gvc.notifyDataChange(vm.id);
                }, 250);
            });
            return {
                bind: vm.id,
                view: () => {
                    if (!vm.visible) {
                        return ``;
                    }
                    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                        yield Chat.post({
                            type: 'user',
                            participant: [cf.userID, cf.toUser || 'manager'],
                        });
                        resolve(`<div class="position-fixed start-0 top-0 vw-100 vh-100" style="background: rgba(0,0,0,0.5);z-index:999;" onclick="${gvc.event(() => {
                            AiMessage.toggle(false);
                        })}"><div class="position-fixed vh-100  top-0 scroll-in bg-white ai-left" style="top:0px;width: 500px;height: 100vh;max-width: 100vw;" onclick="${gvc.event((e, event) => {
                            event.stopPropagation();
                        })}">${AiMessage.detail({
                            gvc: gvc,
                            chat: {
                                chat_id: chatID,
                                type: 'user',
                            },
                            user_id: cf.userID,
                            containerHeight: $('body').height() + 72 + 'px',
                            document: document,
                            goBack: () => {
                            },
                            close: () => {
                                AiMessage.toggle(false);
                            },
                        })}</div></div>`);
                    }));
                },
                divCreate: {
                    elem: 'div',
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
        return gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                        gvc.addStyle(css `
                            .btn-white-primary {
                                border: 2px solid ${AiMessage.config.color};
                                justify-content: space-between;
                                align-items: center;
                                cursor: pointer;
                                color: ${AiMessage.config.color};
                                gap: 10px;
                            }

                            .btn-white-primary:hover {
                                background: ${AiMessage.config.color};
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
                                            console.log(`chatRoom.who==>`, chatRoom);
                                            if (chatRoom.who === 'manager') {
                                                chatRoom.user_data = AiMessage.config;
                                            }
                                            resolve(`<div class="navbar  d-flex align-items-center justify-content-between w-100  p-3 ${AiMessage.config.hideBar ? `d-none` : ``}" style="background: ${AiMessage.config.color};">
                      <div class="d-flex align-items-center pe-3 w-100" style="gap:10px;display: flex;align-items: center;">
                        <img src="https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/size1440_s*px$_sas0s9s0s1sesas0_1697354801736-Glitterlogo.png" class="rounded-circle border" style="background: white;border-radius: 50%;width: 40px;height: 40px;" width="40" alt="Albert Flores">
                      
                        <div class="d-flex flex-column px-1 text-white">
                          <h6 class="mb-0 text-white ">AI 智能助手</h6>
                          <span class="fw-500 d-none" style="font-size:13px;">剩餘代幣:10</span>
</div>
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
                                const viewId = gvc.glitter.getUUID();
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
                                    ai_loading: false
                                };
                                Chat.getMessage({
                                    page: 0,
                                    limit: 50,
                                    chat_id: cf.chat.chat_id,
                                    user_id: cf.user_id,
                                }).then((res) => __awaiter(this, void 0, void 0, function* () {
                                    yield AiChat.sync_data({});
                                    vm.data = res.response.data.reverse();
                                    vm.last_read = res.response.lastRead;
                                    vm.loading = false;
                                    gvc.notifyDataChange(viewId);
                                }));
                                const url = new URL(window.glitterBackend);
                                let socket = undefined;
                                function add_line(dd, index) {
                                    if (dd.user_id == 'manager') {
                                        dd.user_data = AiMessage.config;
                                    }
                                    if (cf.user_id !== dd.user_id) {
                                        return html `
                                            <div
                                                    class="mt-auto d-flex align-items-start ${vm.data[index + 1] && vm.data[index + 1].user_id === dd.user_id ? `mb-1` : `mb-3`}"
                                            >
                                                <img
                                                        src="https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/size1440_s*px$_sas0s9s0s1sesas0_1697354801736-Glitterlogo.png"
                                                        class="rounded-circle border"
                                                        width="40"
                                                        style="background: white;border-radius: 50%;width: 40px;height: 40px;"
                                                />
                                                <div class="ps-2 ms-1"
                                                     style="max-width: 348px;">
                                                    <div
                                                            class="p-3 mb-1"
                                                            style="background:#eeeef1;border-top-right-radius: .5rem; border-bottom-right-radius: .5rem; border-bottom-left-radius: .5rem;white-space: normal;"
                                                    >
                                                        ${dd.message.text.replace(/\n/g, '<br>')}
                                                    </div>
                                                    <div class="fs-sm text-muted time-tt ${vm.data[index + 1] && vm.data[index + 1].user_id === dd.user_id ? `d-none` : ``}">
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
                                                <div class="pe-2 me-1"
                                                     style="max-width: 348px;">
                                                    <div
                                                            class=" text-light p-3 mb-1"
                                                            style="background:${AiMessage.config
                                            .color};border-top-left-radius: .5rem; border-bottom-right-radius: .5rem; border-bottom-left-radius: .5rem;white-space: normal;"
                                                    >
                                                        ${dd.message.text.replace(/\n/g, '<br>')}
                                                    </div>
                                                    <div
                                                            class="fw-500 d-flex justify-content-end align-items-center time-tt fs-sm text-muted ${vm.data[index + 1] &&
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
                                            </div>`;
                                    }
                                }
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
                                            document.querySelector('.nomessage') && document.querySelector('.nomessage').remove();
                                            vm.data.push(data);
                                            const element = document.querySelector('.chatContainer');
                                            const st = element.scrollTop;
                                            const ofs = element.offsetHeight;
                                            const sh = element.scrollHeight;
                                            $('.time-tt').addClass('d-none');
                                            if (cf.user_id !== data.user_id) {
                                                vm.message = '';
                                                vm.ai_loading = false;
                                                gvc.notifyDataChange('footer-ai');
                                            }
                                            $(element).append(add_line(data, vm.data.length - 1));
                                            if (st + ofs >= sh - 50) {
                                                vm.lastScroll = -1;
                                                setTimeout(() => {
                                                    document.querySelector('.chatContainer').scrollTop = document.querySelector('.chatContainer').scrollHeight;
                                                }, 100);
                                            }
                                            else {
                                                vm.lastScroll = st;
                                            }
                                        }
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
                                        if (vm.loading) {
                                            return String.raw `<div class="d-flex align-items-center justify-content-center w-100 flex-column pt-3">
                                <div class="spinner-border" role="status">
                                    <span class="sr-only"></span>
                                </div>
                                <span class="mt-2">AI 就位中...</span>
                            </div>`;
                                        }
                                        return html ` ${gvc.bindView(() => {
                                            return {
                                                bind: messageID,
                                                view: () => {
                                                    return ` 
 
                                                <div class="my-auto flex-fill"></div>
                                                ${add_line({
                                                        user_id: 'robot',
                                                        message: {
                                                            text: `您好！我是您的 AI 智能助手，隨時為您提供支援。無論是操作後台、查詢與分析訂單，還是用戶管理與數據分析，我都能輕鬆協助您高效處理日常任務。`
                                                        },
                                                        created_time: (new Date()).toISOString()
                                                    }, -1)}
                                                ${vm.data
                                                        .map((dd, index) => {
                                                        return add_line(dd, index);
                                                    })
                                                        .join('')}
                                        
`;
                                                },
                                                divCreate: {
                                                    class: `chatContainer p-3 d-flex flex-column position-relative`,
                                                    style: `overflow-y: auto;height: calc(${cf.containerHeight} - 240px);background: white;padding-top:60px;`,
                                                },
                                                onCreate: () => {
                                                    vm.close = false;
                                                    let targetElement = document.querySelector('.chatContainer');
                                                    if (vm.lastScroll === -1) {
                                                        document.querySelector('.chatContainer').scrollTop = document.querySelector('.chatContainer').scrollHeight;
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
                                        ${gvc.bindView(() => {
                                            return {
                                                bind: 'footer-ai',
                                                view: () => {
                                                    if (vm.ai_loading) {
                                                        return html `
                                                                    <div class="d-flex align-items-center justify-content-center ai-waiting flex-fill mx-2">
                                                                        <div class="w-100 py-2 bt_ffb40_stroke d-flex align-items-center justify-content-center"
                                                                             style="gap: 8px;">
                                                                            <div class="spinner-border"
                                                                                 style="width:20px;height: 20px;"></div>
                                                                            AI 解答中
                                                                        </div>
                                                                    </div>`;
                                                    }
                                                    else {
                                                        return html `
                                                                    <div class="d-flex px-2"
                                                                         style="overflow-x: auto;gap:5px;">
                                                                        ${[
                                                            '要怎麼設定購物金?',
                                                            '這個月的銷售額是多少',
                                                            '賣最好的五個商品',
                                                            '哪個客戶買最多商品?',
                                                            '尚未出貨的訂單還有哪些?'
                                                        ].map((dd) => {
                                                            return `<div class="insignia insignia-secondary bgf6" style="white-space: nowrap;cursor: pointer;" onclick="${gvc.event(() => {
                                                                vm.ai_loading = true;
                                                                gvc.notifyDataChange('footer-ai');
                                                                Chat.postMessage({
                                                                    chat_id: cf.chat.chat_id,
                                                                    user_id: cf.user_id,
                                                                    message: {
                                                                        text: dd,
                                                                        attachment: '',
                                                                    },
                                                                }).then(() => {
                                                                    vm.message = '';
                                                                });
                                                            })}">${dd}</div>`;
                                                        }).join('')}
                                                                    </div>
                                                                    <div class="px-2  d-flex align-items-center w-100 border-0 px-2" style="background: white;border-radius: 0px;">
                                                                        ${[`<div class="position-relative w-100 me-2">${gvc.bindView(() => {
                                                                return {
                                                                    bind: textAreaId,
                                                                    view: () => {
                                                                        var _a;
                                                                        return (_a = vm.message) !== null && _a !== void 0 ? _a : '';
                                                                    },
                                                                    divCreate: {
                                                                        elem: `textArea`,
                                                                        style: `max-height:100px;white-space: pre-wrap; word-wrap: break-word;height:40px;`,
                                                                        class: `form-control`,
                                                                        option: [
                                                                            {
                                                                                key: 'placeholder',
                                                                                value: '輸入訊息內容'
                                                                            },
                                                                            {
                                                                                key: 'onchange',
                                                                                value: gvc.event((e) => {
                                                                                    vm.message = e.value;
                                                                                }),
                                                                            },
                                                                        ],
                                                                    },
                                                                    onCreate: () => {
                                                                        const input = gvc.getBindViewElem(textAreaId).get(0);
                                                                        input.addEventListener('input', function () {
                                                                            input.style.height = 'auto';
                                                                            input.style.height = input.scrollHeight + 'px';
                                                                        });
                                                                    },
                                                                };
                                                            })}</div>`, ` <button
                                                        type="button"
                                                        class="btn btn-icon btn-lg  d-sm-inline-flex ms-1 send-action"
                                                        style="height: 36px;background: ${AiMessage.config.color};"
                                                        onclick="${gvc.event(() => {
                                                                if (vm.message) {
                                                                    vm.ai_loading = true;
                                                                    gvc.notifyDataChange('footer-ai');
                                                                    Chat.postMessage({
                                                                        chat_id: cf.chat.chat_id,
                                                                        user_id: cf.user_id,
                                                                        message: {
                                                                            text: vm.message,
                                                                            attachment: '',
                                                                        },
                                                                    }).then(() => {
                                                                        vm.message = '';
                                                                    });
                                                                    const textArea = gvc.getBindViewElem(textAreaId).get(0);
                                                                    textArea.value = '';
                                                                    textArea.focus();
                                                                }
                                                                else {
                                                                }
                                                            })}"
                                                >
                                                    <i class="fa-regular fa-paper-plane-top"></i>
                                                </button>`].join('')}
                                                                    </div>
                                                                `;
                                                    }
                                                    return ``;
                                                },
                                                divCreate: {
                                                    class: `d-flex flex-column w-100 position-fixed bottom-0 position-lg-absolute py-2  border-top bg-white`,
                                                    style: `gap:8px;`
                                                }
                                            };
                                        })}
                                        `;
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
                                 style="width: 100%;white-space: normal;background: ${AiMessage.config.color};">
                                <div class="text-white fw-bold" style=" font-size: 20px;">
                                    ${(_a = AiMessage.config.title) !== null && _a !== void 0 ? _a : ''}
                                </div>
                                <p class=" text-white mt-2 mb-4"
                                   style=" font-size: 16px;line-height: 22px;font-weight: 300;">
                                    ${((_b = AiMessage.config.content) !== null && _b !== void 0 ? _b : '').replace(/\n/g, `<br>`)}</p>
                                <button
                                        class="btn w-100  rounded"
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
}
AiMessage.config = {
    color: 'linear-gradient(135deg, var(--main-orange) 0%, #ff6c02 100%)',
    head: 'https://liondesign-prd.s3.amazonaws.com/file/252530754/1695093945424-Frame 62 (1).png',
    name: '萊恩設計',
    user_data: {
        head_img: 'https://liondesign-prd.s3.amazonaws.com/file/252530754/1695093945424-Frame 62 (1).png'
    }
};
AiMessage.vm = {
    type: 'list',
    chat_user: '',
    select_bt: 'list'
};
AiMessage.id = `dsmdklweew3`;
AiMessage.toggle = (visible) => {
};
window.glitter.setModule(import.meta.url, AiMessage);
