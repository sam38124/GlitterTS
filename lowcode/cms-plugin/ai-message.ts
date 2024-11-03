import {GVC} from '../glitterBundle/GVController.js';
import {ApiUser} from '../glitter-base/route/user.js';
import {Chat} from '../glitter-base/route/chat.js';
import {BgWidget} from '../backend-manager/bg-widget.js';
import {AiChat} from '../glitter-base/route/ai-chat.js';
import {ShareDialog} from '../glitterBundle/dialog/ShareDialog.js';
import {AiPointsApi} from "../glitter-base/route/ai-points-api.js";
import {EditorElem} from "../glitterBundle/plugins/editor-elem.js";
import {AiEditor} from "../editor/ai-editor.js";

export class AiMessage {
    public static config: any = {
        color: 'linear-gradient(135deg, var(--main-orange) 0%, #ff6c02 100%)',
        head: 'https://liondesign-prd.s3.amazonaws.com/file/252530754/1695093945424-Frame 62 (1).png',
        name: '萊恩設計',
        user_data: {
            head_img: 'https://liondesign-prd.s3.amazonaws.com/file/252530754/1695093945424-Frame 62 (1).png',
        },
    };

    public static vm: {
        type: 'list' | 'detail';
        chat_user: any;
        select_bt: 'writer' | 'order_analysis' | 'operation_guide' | "page_editor";
    } = {
        type: 'list',
        chat_user: '',
        select_bt: 'writer',
    };


    public static id = `dsmdklweew3`;

    public static setDrawer(gvc: GVC, option?: { key: string, label: string }[]) {
        if (!option) {
            AiMessage.ai_support = [
                {
                    key: 'writer',
                    label: '文案寫手',
                },
                {
                    key: 'order_analysis',
                    label: '訂單分析',
                },
                {
                    key: 'design',
                    label: '圖片生成',
                },
                {
                    key: 'operation_guide',
                    label: '操作引導',
                }
            ]
        } else {
            AiMessage.ai_support = option!
        }
        if (!AiMessage.ai_support.find((dd) => {
            return dd.key === AiMessage.vm.select_bt
        })) {
            AiMessage.vm.select_bt = AiMessage.ai_support[0].key as any
        }

        gvc.glitter.setDrawer(`<div
                                        class="position-fixed start-0 top-0 vw-100 vh-100"
                                        style="background: rgba(0,0,0,0.5);z-index:999;"
                                        onclick="${gvc.event(() => {
            gvc.glitter.closeDrawer()
        })}"
                                >
                                    <div
                                            class="position-fixed vh-100 top-0 scroll-in bg-white ai-left"
                                            style="top:0px;width: 500px;height: 100vh;max-width: 100vw;"
                                            onclick="${gvc.event((e, event) => {
            event.stopPropagation();
        })}"
                                    >
                                        ${(() => {
            return AiMessage.detail({
                gvc: gvc,
                user_id: 'manager',
                containerHeight: ($('body').height() as any) + 10 + 'px',
                document: document,
                goBack: () => {
                },
                close: () => {
                    gvc.glitter.closeDrawer()
                },
            })
        })()}
                                    </div>
                                </div>`, () => {
            gvc.glitter.openDrawer((document.body.clientWidth > 768) ? 500 : document.body.clientWidth)
        })
    }

    public static ai_support: { key: string, label: string }[] = []


    public static toggle() {
        AiMessage.setDrawer((window.parent as any).glitter.pageConfig[(window.parent as any).glitter.pageConfig.length-1].gvc);
    }

    public static detail(cf: {
        gvc: GVC;
        user_id: string;
        containerHeight: string;
        document: any;
        goBack: () => void;
        close?: () => void;
        hideBar?: boolean
    }) {
        const gvc = cf.gvc;
        const document = cf.document;
        const css = String.raw;
        const html = String.raw;

        return gvc.bindView(() => {
            const id = gvc.glitter.getUUID();

            function refresh() {
                gvc.notifyDataChange(id);
            }

            return {
                bind: id,
                view: () => {
                    return new Promise(async (resolve, reject) => {
                        gvc.addStyle(`
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

                            .select-label-ai-message {
                                gap: 10px;
                                border-radius: 7px;
                                cursor: pointer;
                                color: white;
                                font-size: 16px;
                                flex: 1;
                                border: 1px solid #ffb400;
                                background: linear-gradient(143deg, #ffb400 -22.7%, #ff6c02 114.57%);
                            }

                            .select-btn-ai-message {
                                border-radius: 7px;
                                flex: 1;
                                font-size: 16px;
                                border: 1px solid #ffb400;
                                cursor: pointer;
                                background: linear-gradient(143deg, #ffb400 -22.7%, #ff6c02 114.57%);
                                background-clip: text;
                                -webkit-background-clip: text;
                                -webkit-text-fill-color: transparent;
                            }
                        `);
                        resolve(
                            [
                                gvc.bindView(() => {
                                    const id = gvc.glitter.getUUID();
                                    return {
                                        bind: id,
                                        view: () => {
                                            if (cf.hideBar) {
                                                return ``;
                                            }
                                            return new Promise(async (resolve, reject) => {
                                                await Chat.post({
                                                    type: 'user',
                                                    participant: [cf.user_id, AiMessage.vm.select_bt],
                                                });
                                                const chatRoom = (
                                                    await Chat.getChatRoom({
                                                        page: 0,
                                                        limit: 1000,
                                                        user_id: cf.user_id,
                                                        chat_id: [cf.user_id, AiMessage.vm.select_bt].sort().join('-'),
                                                    })
                                                ).response.data[0];

                                                if (chatRoom.who === 'manager') {
                                                    chatRoom.user_data = AiMessage.config;
                                                }

                                                resolve(
                                                    html`
                                                        <div
                                                                class="navbar  d-flex align-items-center justify-content-between w-100  p-3 ${AiMessage.config.hideBar ? `d-none` : ``}"
                                                                style="background: ${AiMessage.config.color};"
                                                        >
                                                            <div class="d-flex align-items-center pe-3 w-100"
                                                                 style="gap:10px;display: flex;align-items: center;">
                                                                <img
                                                                        src="https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/size1440_s*px$_sas0s9s0s1sesas0_1697354801736-Glitterlogo.png"
                                                                        class="rounded-circle border"
                                                                        style="background: white;border-radius: 50%;width: 40px;height: 40px;"
                                                                        width="40"
                                                                        alt="Albert Flores"
                                                                />
                                                                <div class="d-flex flex-column px-1 text-white">
                                                                    <h6 class="mb-0 text-white d-flex">AI 智能助手</h6>
                                                                    ${gvc.bindView(() => {
                                                                        return {
                                                                            bind: 'ai_points_count',
                                                                            view: () => {
                                                                                return new Promise(async (resolve, reject) => {
                                                                                    resolve(`剩餘『<span class="fw-bold mx-1">${parseInt(((await AiPointsApi.getSum({})).response.sum), 10).toLocaleString()}</span>』 AI Points`)
                                                                                })
                                                                            },
                                                                            divCreate: {
                                                                                class: `fw-500 d-flex`,
                                                                                style: `font-size:13px;`
                                                                            }
                                                                        }
                                                                    })}
                                                                </div>
                                                                <div class="flex-fill" style="flex: 1;"></div>
                                                                <i
                                                                        class="fa-regular fa-circle-xmark text-white fs-3 ${cf.close ? `` : `d-none`}"
                                                                        onclick="${gvc.event(() => {
                                                                            cf.close && cf.close();
                                                                        })}"
                                                                ></i>
                                                            </div>
                                                        </div>` +
                                                    html`
                                                        <div class="d-flex align-items-center p-2 shadow border-bottom"
                                                             style="gap:10px;">
                                                            ${(() => {
                                                                const list = AiMessage.ai_support;
                                                                return list
                                                                        .map((dd) => {
                                                                            if (AiMessage.vm.select_bt === dd.key) {
                                                                                return html`
                                                                                    <div class="d-flex align-items-center justify-content-center fw-bold px-2 py-2 fw-500 select-label-ai-message fs-6">
                                                                                        ${dd.label}
                                                                                    </div>`;
                                                                            } else {
                                                                                return html`
                                                                                    <div class="d-flex align-items-center justify-content-center fw-bold  px-2 py-2 fw-500 select-btn-ai-message fs-6"
                                                                                         onclick="${gvc.event(() => {
                                                                                             AiMessage.vm.select_bt = dd.key as any;
                                                                                             refresh();
                                                                                         })}"
                                                                                    >
                                                                                        ${dd.label}
                                                                                    </div>`;
                                                                            }
                                                                        })
                                                                        .join('');
                                                            })()}
                                                        </div>`
                                                );
                                            });
                                        },
                                    };
                                }),
                                (AiMessage.vm.select_bt === 'page_editor') ? (() => {
                                    const html = String.raw
                                    let message = ''
                                    return ` <div class="p-5">
                                    ${[
                                        html`
                                            <lottie-player src="${gvc.glitter.root_path}lottie/ai.json" class="mx-auto my-n4" speed="1"
                                                           style="max-width: 100%;width: 250px;height:250px;" loop
                                                           autoplay></lottie-player>`,
                                        `<div class="w-100 d-flex align-items-center justify-content-center my-3">${BgWidget.grayNote('點擊想要調整的元件之後，在輸入 AI 語句進行調整', `font-weight: 500;`)}</div>`,
                                        html`
                                            <div class="w-100" onclick="${gvc.event(() => {
                                                if (!gvc.glitter.share.editorViewModel.selectItem) {
                                                    const dialog = new ShareDialog(gvc.glitter)
                                                    dialog.errorMessage({text: '請先點擊要編輯的元件'})
                                                }
                                            })}">
                                                ${EditorElem.editeText({
                                                    gvc: gvc,
                                                    title: '',
                                                    default: '',
                                                    placeHolder: `字體大小20px，距離左邊20px，背景顏色黃色，字體顏色藍色，標題為歡迎來到SHOPNEX開店平台.`,
                                                    callback: (text) => {
                                                        message = text;
                                                    },
                                                    min_height: 100
                                                })}
                                            </div>`,
                                        `<div class="w-100 d-flex align-items-center justify-content-end">
${BgWidget.save(gvc.event(() => {
                                            const dialog = new ShareDialog(gvc.glitter)
                                            if (!message) {
                                                dialog.errorMessage({text: '請輸入描述語句'})
                                                return
                                            }

                                            dialog.dataLoading({visible: true})
                                            gvc.glitter.getModule(new URL('./editor/ai-editor.js', gvc.glitter.root_path).href, (AiEditor) => {
                                                AiEditor.editView(message, gvc.glitter.share.editorViewModel.selectItem, (result:any) => {
                                                    dialog.dataLoading({visible: false})
                                                    if (result) {
                                                        dialog.successMessage({text: `已為你調整元件『${result}』`})
                                                        gvc.glitter.share.editorViewModel.selectItem.refreshComponent()
                                                        gvc.glitter.closeDrawer()
                                                    } else {
                                                        dialog.errorMessage({text: 'AI無法理解你的意思，請輸入更確切的需求'})
                                                    }

                                                })
                                            })
                                            // const dialog = new ShareDialog(gvc.glitter)
                                            // dialog.dataLoading({visible: true})
                                            // AiChat.generateHtml({
                                            //     app_name: (window as any).appName,
                                            //     text: message
                                            // }).then((res) => {
                                            //     if (res.result && res.response.data.usage === 0) {
                                            //         dialog.dataLoading({visible: false})
                                            //         dialog.errorMessage({text: `很抱歉你的AI代幣不足，請先前往加值`})
                                            //     } else if (res.result && (!res.response.data.obj.result)) {
                                            //         dialog.dataLoading({visible: false})
                                            //         dialog.errorMessage({text: `AI無法理解你的需求，請給出具體一點的描述`})
                                            //     } else if (!res.result) {
                                            //         dialog.dataLoading({visible: false})
                                            //         dialog.errorMessage({text: `發生錯誤`})
                                            //     } else {
                                            //
                                            //         dialog.successMessage({text: `AI生成完畢，使用了『${res.response.data.usage}』點 AI Points.`})
                                            //
                                            //     }
                                            // })
                                        }), "調整元素", "w-100 mt-3 py-2")}
</div>`
                                    ].join('<div class="my-2"></div>')}
                                </div>`
                                })() : gvc.bindView(() => {
                                    const viewId = gvc.glitter.getUUID();
                                    const messageID = gvc.glitter.getUUID();
                                    const vm: {
                                        data: any;
                                        loading: boolean;
                                        scrollToBtn: boolean;
                                        lastScroll: number;
                                        message: string;
                                        prefixScroll: number;
                                        last_read: any;
                                        close: boolean;
                                        ai_loading: boolean;
                                    } = {
                                        data: [],
                                        loading: true,
                                        scrollToBtn: false,
                                        lastScroll: -1,
                                        message: '',
                                        prefixScroll: 0,
                                        last_read: {},
                                        close: false,
                                        ai_loading: false,
                                    };
                                    //chat_id
                                    Chat.getMessage({
                                        page: 0,
                                        limit: 50,
                                        chat_id: [cf.user_id, AiMessage.vm.select_bt].sort().join('-'),
                                        user_id: cf.user_id,
                                    }).then(async (res) => {
                                        await AiChat.sync_data({type: AiMessage.vm.select_bt});
                                        vm.data = res.response.data.reverse();
                                        vm.last_read = res.response.lastRead;
                                        vm.loading = false;
                                        gvc.notifyDataChange(viewId);
                                    });

                                    const url = new URL((window as any).glitterBackend);

                                    let socket: any = undefined;

                                    function markdownToHTML(markdownString: string) {
                                        // 粗體
                                        markdownString = markdownString.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

                                        // 斜體
                                        markdownString = markdownString.replace(/\*(.*?)\*/g, '<em>$1</em>');

                                        // 標題
                                        markdownString = markdownString.replace(/#{1,6} (.*?)(?:\n|\r\n)?/g, function (match, group) {
                                            var level = match.split(' ')[0].length;
                                            return '<h' + level + '>' + group + '</h' + level + '>';
                                        });

                                        // 嵌字
                                        markdownString = markdownString.replace(/<h(\d)><\/h\d>([\d\.]+[^\n]+)/g, (match, hLevel, content) => {
                                            return `<h${hLevel}>${content.trim()}</h${hLevel}>`;
                                        });

                                        // 列表
                                        markdownString = markdownString.replace(/\n(\*|\d+\.) (.*?)(?:\n|\r\n)?/g, function (match, type, content) {
                                            var tag = type === '*' ? 'ul' : 'ol';
                                            return '<' + tag + '><li>' + content + '</li></' + tag + '>';
                                        });


                                        return markdownString.replace(/\n/g, '<br>');
                                    }

                                    function add_line(dd: any, index: number) {
                                        dd.message.text = dd.message.text || ''
                                        if (dd.user_id == 'manager') {
                                            dd.user_data = AiMessage.config;
                                        }
                                        const replacedString = markdownToHTML(dd.message.text);
                                        const width = (document.body.clientWidth < 768) ? document.body.clientWidth - 120 : 348
                                        if (cf.user_id !== dd.user_id) {
                                            return html`
                                                <div class="mt-auto d-flex align-items-start ${vm.data[index + 1] && vm.data[index + 1].user_id === dd.user_id ? `mb-1` : `mb-3`}">
                                                    <img
                                                            src="https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/size1440_s*px$_sas0s9s0s1sesas0_1697354801736-Glitterlogo.png"
                                                            class="rounded-circle border"
                                                            width="40"
                                                            style="background: white;border-radius: 50%;width: 40px;height: 40px;"
                                                    />
                                                    <div class="ps-2 ms-1" style="max-width: ${width}px;">
                                                        <div
                                                                class="p-3 mb-1"
                                                                style="background:#eeeef1;border-top-right-radius: .5rem; border-bottom-right-radius: .5rem; border-bottom-left-radius: .5rem;white-space: normal;"
                                                        >
                                                            ${replacedString}
                                                            ${dd.message.image ? `<img style="cursor: pointer;width:${width - 40}px;height: ${width - 40}px;"
                                 src="${dd.message.image}"
                                 alt="image"
                                 onclick="${gvc.event(() => {
                                                                gvc.glitter.openDiaLog(new URL('./dialog/image-preview.js', gvc.glitter.root_path).href, 'preview', dd.message.image)
                                                            })}">` : ``}
                                                            <div class="w-100 d-flex align-items-center justify-content-end text-muted  fs-sm mt-2 ${!(dd.message.usage) ? `d-none` : ``}"
                                                                 style="letter-spacing: 1.2px;">
                                                                ${dd.message.usage ? `消耗『${dd.message.usage.toLocaleString()}』點 AI Points` : ``}
                                                            </div>
                                                        </div>
                                                        <div class="fs-sm d-flex text-muted time-tt ${vm.data[index + 1] && vm.data[index + 1].user_id === dd.user_id ? `d-none` : ``}">
                                                            ${gvc.glitter.ut.dateFormat(new Date(dd.created_time), 'MM-dd hh:mm')}
                                                        </div>
                                                    </div>
                                                </div>`;
                                        } else {
                                            return html`
                                                <div class="d-flex align-items-start justify-content-end ${vm.data[index + 1] && vm.data[index + 1].user_id === dd.user_id ? `mb-1` : `mb-3`}">
                                                    <div class="pe-2 me-1" style="max-width: ${width}px;">
                                                        <div
                                                                class=" text-light p-3 mb-1"
                                                                style="background:#575757;border-top-left-radius: .5rem; border-bottom-right-radius: .5rem; border-bottom-left-radius: .5rem;white-space: normal;"
                                                        >
                                                            ${replacedString}
                                                            ${dd.message.image ? `<img style="cursor: pointer;width:${width - 40}px;height: ${width - 40}px;"
                                 src="${dd.message.image}"
                                 alt="image"
                                 onclick="${gvc.event(() => {
                                                                gvc.glitter.openDiaLog(new URL('./dialog/image-preview.js', gvc.glitter.root_path).href, 'preview', dd.message.image)
                                                            })}">` : ``}
                                                        </div>
                                                        <div
                                                                class="fw-500 d-flex justify-content-end align-items-center time-tt fs-sm text-muted ${vm.data[index + 1] &&
                                                                vm.data[index + 1].user_id === dd.user_id
                                                                        ? `d-none`
                                                                        : ``}"
                                                                style="gap:5px;"
                                                        >
                                                            <span> ${gvc.glitter.ut.dateFormat(new Date(dd.created_time), 'MM/dd hh:mm')}</span>
                                                            ${vm.last_read.find((d2: any) => {
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
                                        socket.addEventListener('open', function (event: any) {
                                            console.log('Connected to server');
                                            socket.send(
                                                JSON.stringify({
                                                    type: 'message',
                                                    chatID: [cf.user_id, AiMessage.vm.select_bt].sort().join('-'),
                                                    user_id: cf.user_id,
                                                    app_name: (window as any).appName,
                                                })
                                            );
                                        });
                                        let interVal: any = 0;
                                        socket.addEventListener('message', function (event: any) {
                                            const data = JSON.parse(event.data);
                                            if (data.type === 'update_read_count') {
                                                vm.last_read = data.data;
                                            } else {
                                                document.querySelector('.nomessage') && document.querySelector('.nomessage').remove();
                                                vm.data.push(data);
                                                const element: any = document.querySelector('.chatContainer')!;
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
                                                        document.querySelector('.chatContainer')!.scrollTop = document.querySelector('.chatContainer')!.scrollHeight;
                                                    }, 100);
                                                } else {
                                                    vm.lastScroll = st;
                                                }
                                                gvc.notifyDataChange('ai_points_count')
                                            }

                                            // const element: any = document.querySelector('.chatContainer')!;

                                            // if (st + ofs >= sh - 50) {
                                            //     vm.lastScroll = -1;
                                            // } else {
                                            //     vm.lastScroll = st;
                                            // }
                                            // clearInterval(interVal);
                                            // gvc.notifyDataChange(messageID);
                                            // console.log('Message from server:', event.data);
                                        });
                                        socket.addEventListener('close', function (event: any) {
                                            console.log('Disconnected from server');
                                            if (!vm.close) {
                                                console.log('Reconnected from server');
                                                connect();
                                            }
                                        });
                                    }

                                    connect();
                                    const textAreaId = gvc.glitter.getUUID();
                                    return {
                                        bind: viewId,
                                        view: () => {
                                            if (vm.loading) {
                                                return html`
                                                    <div class="d-flex align-items-center justify-content-center w-100 flex-column pt-3">
                                                        <div class="spinner-border" role="status">
                                                            <span class="sr-only"></span>
                                                        </div>
                                                        <span class="mt-2">AI 就位中...</span>
                                                    </div>`;
                                            }
                                            return html`
                                                ${gvc.bindView(() => {
                                                    return {
                                                        bind: messageID,
                                                        view: () => {
                                                            return html`
                                                                <div class="my-auto flex-fill"></div>
                                                                ${add_line(
                                                                        {
                                                                            user_id: 'robot',
                                                                            message: {
                                                                                text: [
                                                                                    {
                                                                                        key: 'writer',
                                                                                        text: '您好！我是AI文案寫手，專門協助您撰寫任何文案。',
                                                                                    },
                                                                                    {
                                                                                        key: 'order_analysis',
                                                                                        text: `您好！我是AI資料分析師，能為您查詢與分析訂單資料，並提供可行的建議。`,
                                                                                    },
                                                                                    {
                                                                                        key: 'operation_guide',
                                                                                        text: '您好！我是AI後台引導員，能協助你使用平台，如果有任何不了解的地方請直接詢問我。',
                                                                                    },
                                                                                    {
                                                                                        key: 'design',
                                                                                        text: '您好！我是AI設計師，能協助你生成任何行銷或商品圖面。',
                                                                                    }
                                                                                ].find((dd) => {
                                                                                    return dd.key === AiMessage.vm.select_bt;
                                                                                })?.text,
                                                                            },
                                                                            created_time: new Date().toISOString(),
                                                                        },
                                                                        -1
                                                                )}
                                                                ${vm.data
                                                                        .map((dd: any, index: number) => {
                                                                            return add_line(dd, index);
                                                                        })
                                                                        .join('')}
                                                            `;
                                                        },
                                                        divCreate: {
                                                            class: `chatContainer p-3 d-flex flex-column position-relative`,
                                                            style: `overflow-y: auto;height: calc(${cf.containerHeight} - ${240 + (parseInt(gvc.glitter.share.top_inset, 10) + parseInt(gvc.glitter.share.bottom_inset, 10))}px);background: white;padding-top:60px;`,
                                                        },
                                                        onCreate: () => {
                                                            vm.close = false;
                                                            // 取得要監聽的元素
                                                            let targetElement = document.querySelector('.chatContainer')!;
                                                            if (vm.lastScroll === -1) {
                                                                setTimeout(() => {
                                                                    document.querySelector('.chatContainer')!.scrollTop = document.querySelector('.chatContainer')!.scrollHeight;
                                                                }, 100)
                                                            } else {
                                                                if (vm.prefixScroll) {
                                                                    vm.lastScroll = targetElement.scrollHeight - vm.prefixScroll + vm.lastScroll;
                                                                    vm.prefixScroll = 0;
                                                                }
                                                                document.querySelector('.chatContainer')!.scrollTop = vm.lastScroll;
                                                            }
                                                            // 添加滾動事件監聽器
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
                                                                        chat_id: [cf.user_id, AiMessage.vm.select_bt].sort().join('-'),
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
                                                                return html`
                                                                    <div class="d-flex align-items-center justify-content-center ai-waiting flex-fill mx-2">
                                                                        <div class="w-100 py-2 bt_ffb40_stroke d-flex align-items-center justify-content-center"
                                                                             style="gap: 8px;">
                                                                            <div class="spinner-border"
                                                                                 style="width:20px;height: 20px;"></div>
                                                                            AI 解答中
                                                                        </div>
                                                                    </div>`;
                                                            } else {
                                                                return html`
                                                                    <div class="d-flex px-2"
                                                                         style="overflow-x: auto;gap:5px;"
                                                                         ontouchmove="${gvc.event((e, event) => {
                                                                             event.stopPropagation();
                                                                         })}" onmouseup="${gvc.event((e, event) => {
                                                                        event.stopPropagation();
                                                                    })}">
                                                                        ${[
                                                                            {
                                                                                key: 'writer',
                                                                                data: [
                                                                                    '幫我撰寫一個精品包的文案',
                                                                                    '撰寫一個關於我們的範本',
                                                                                    '幫我撰寫一個限時特價的文案',
                                                                                    '撰寫一個關於退貨條款的範本',
                                                                                    '撰寫一個關於服務條款的範本',
                                                                                ],
                                                                            },
                                                                            {
                                                                                key: 'order_analysis',
                                                                                data: [
                                                                                    '這個月的銷售額是多少？',
                                                                                    '這週賣最好的五個商品？',
                                                                                    '未付款的訂單有哪些？',
                                                                                    '哪個客戶買最多商品？',
                                                                                    '尚未出貨的訂單還有哪些？',
                                                                                ],
                                                                            },
                                                                            {
                                                                                key: 'operation_guide',
                                                                                data: [
                                                                                    '如何新增訂單？',
                                                                                    '購物金的用途是什麼？',
                                                                                    '什麼是安全庫存？',
                                                                                    '如何設定優惠促銷活動？',
                                                                                    '要如何匯出商品列表？',
                                                                                    '如何設定網站佈景主題？',
                                                                                ],
                                                                            },
                                                                            {
                                                                                key: 'design',
                                                                                data: ['家具電商平台宣傳圖，現代極簡主義，背景保持乾淨整潔',
                                                                                    '服飾店宣傳圖，模特背著名牌包，腳穿高跟鞋']
                                                                            }
                                                                        ]
                                                                                .find((dd) => {
                                                                                    return dd.key === AiMessage.vm.select_bt;
                                                                                })
                                                                                ?.data.map((dd) => {
                                                                                    return html`
                                                                                        <div
                                                                                                class="insignia insignia-secondary bgf6"
                                                                                                style="white-space: nowrap;cursor: pointer;"
                                                                                                onclick="${gvc.event(() => {
                                                                                                    vm.ai_loading = true;
                                                                                                    gvc.notifyDataChange('footer-ai');
                                                                                                    Chat.postMessage({
                                                                                                        chat_id: [cf.user_id, AiMessage.vm.select_bt].sort().join('-'),
                                                                                                        user_id: cf.user_id,
                                                                                                        message: {
                                                                                                            text: dd,
                                                                                                            attachment: '',
                                                                                                        },
                                                                                                    }).then(() => {
                                                                                                        vm.message = '';
                                                                                                    });
                                                                                                })}"
                                                                                        >
                                                                                            ${dd}
                                                                                        </div>`;
                                                                                })
                                                                                .join('')}
                                                                    </div>
                                                                    <div class="px-2 d-flex align-items-center w-100 border-0 px-2"
                                                                         style="background: white;border-radius: 0px;">
                                                                        ${BgWidget.customButton({
                                                                            button: {
                                                                                color: 'snow',
                                                                                size: 'sm',
                                                                                style: 'min-height: 40px;'
                                                                            },
                                                                            icon: {name: 'fa-regular fa-broom-wide text-dark'},
                                                                            text: {name: '重置'},
                                                                            event: gvc.event(() => {
                                                                                const dialog = new ShareDialog(gvc.glitter);
                                                                                dialog.warningMessage({
                                                                                    text: '重置對話將會刪除之前的提問，<br />使AI重新閱讀上下文，請問是否要重置？',
                                                                                    callback: (response) => {
                                                                                        if (response) {
                                                                                            dialog.dataLoading({visible: true});
                                                                                            AiChat.reset({
                                                                                                type: AiMessage.vm.select_bt,
                                                                                            }).then(() => {
                                                                                                dialog.dataLoading({visible: false});
                                                                                                refresh();
                                                                                            });
                                                                                        }
                                                                                    },
                                                                                });
                                                                            }),
                                                                        })}
                                                                        ${[
                                                                            html`
                                                                                <div class="position-relative w-100 mx-2">
                                                                                    ${gvc.bindView(() => {
                                                                                        return {
                                                                                            bind: textAreaId,
                                                                                            view: () => {
                                                                                                return vm.message ?? '';
                                                                                            },
                                                                                            divCreate: {
                                                                                                elem: `textArea`,
                                                                                                style: `max-height:100px;white-space: pre-wrap; word-wrap: break-word;height:40px;`,
                                                                                                class: `form-control`,
                                                                                                option: [
                                                                                                    {
                                                                                                        key: 'placeholder',
                                                                                                        value: '輸入訊息內容',
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
                                                                                                    input.style.height = 'auto'; // 重置高度
                                                                                                    input.style.height = input.scrollHeight + 'px'; // 设置为内容高度
                                                                                                });
                                                                                            },
                                                                                        };
                                                                                    })}
                                                                                </div>`,
                                                                            html`
                                                                                <button
                                                                                        type="button"
                                                                                        class="btn btn-icon btn-lg  d-sm-inline-flex ms-1 send-action"
                                                                                        style="height: 36px;background: ${AiMessage.config.color};"
                                                                                        onclick="${gvc.event(() => {
                                                                                            if (vm.message) {
                                                                                                vm.ai_loading = true;
                                                                                                gvc.notifyDataChange('footer-ai');
                                                                                                Chat.postMessage({
                                                                                                    chat_id: [cf.user_id, AiMessage.vm.select_bt].sort().join('-'),
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
                                                                                            } else {
                                                                                            }
                                                                                        })}"
                                                                                >
                                                                                    <i class="fa-regular fa-paper-plane-top"></i>
                                                                                </button>`,
                                                                        ].join('')}
                                                                    </div>
                                                                `;
                                                            }
                                                            return ``;
                                                        },
                                                        divCreate: {
                                                            class: `d-flex flex-column w-100 position-fixed bottom-0 position-lg-absolute py-2  border-top bg-white`,
                                                            style: `gap:8px;${(parseInt(gvc.glitter.share.bottom_inset, 10)) ? `padding-bottom:${parseInt(gvc.glitter.share.bottom_inset, 10) + 10}px !important;` : ``}`,
                                                        },
                                                        onCreate: () => {
                                                        },
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
                            ].join('')
                        );
                    });
                },
            };
        });
    }

    public static robotMessage(gvc: GVC, goToChat: (text: string) => void) {
        const html = String.raw;
        return gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    return html`
                        <div class=" card rounded-3">
                            <div class="p-3 rounded-top"
                                 style="width: 100%;white-space: normal;background: ${AiMessage.config.color};">
                                <div class="text-white fw-bold" style=" font-size: 20px;">
                                    ${AiMessage.config.title ?? ''}
                                </div>
                                <p class=" text-white mt-2 mb-4"
                                   style=" font-size: 16px;line-height: 22px;font-weight: 300;">
                                    ${(AiMessage.config.content ?? '').replace(/\n/g, `<br>`)}</p>
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
                                    return new Promise(async (resolve, reject) => {
                                        const returnHtml: any = [];
                                        const robot = (await ApiUser.getPublicConfig('robot_auto_reply', 'manager')).response.value.question;
                                        if (robot.length > 0) {
                                            returnHtml.push(html`
                                                <div class=" fw-bold"
                                                     style=" height: 60px;display: flex;align-items: center;justify-content: center;font-size: 16px;">
                                                    <div class="" style="color: black;">即時解答</div>
                                                </div>`);
                                        }
                                        robot.map((dd: any) => {
                                            returnHtml.push(html`
                                                <div
                                                        class="rounded-3 w-100 d-flex px-3 btn-white-primary py-2 fw-500"
                                                        style=" "
                                                        onclick="${gvc.event(() => {
                                                            goToChat(dd.ask);
                                                        })}"
                                                >
                                                    <div style="white-space: normal;" class="flex-fill">${dd.ask}</div>
                                                    <i class="fa-solid fa-paper-plane-top" style="font-size:18px;"
                                                       aria-hidden="true"></i>
                                                </div>`);
                                        });

                                        resolve(
                                                returnHtml.join('') &&
                                                html`
                                                    <div class="px-3 pb-3"
                                                         style=" display: flex;flex-direction: column;align-items: center;justify-content: center;gap:10px;font-size: 16px;">
                                                        ${returnHtml.join('')}
                                                    </div>`
                                        );
                                    });
                                },
                                divCreate: {
                                    style: css`
                                        background-color: white;
                                    `,
                                },
                            };
                            // (await ApiUser.getPublicConfig('robot_auto_reply','manager')).response.value.question
                        })}
                    `;
                },
                divCreate: {},
            };
        });
    }
}

(window as any).glitter.setModule(import.meta.url, AiMessage);
