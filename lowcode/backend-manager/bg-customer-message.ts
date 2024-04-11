import {GVC} from "../glitterBundle/GVController.js";
import {Chat} from "../glitter-base/route/chat.js";
//@ts-ignore
import autosize from "../glitterBundle/plugins/autosize.js";
import {EditorElem} from "../glitterBundle/plugins/editor-elem.js";
import {ApiUser} from "../glitter-base/route/user.js";
import {FormWidget} from "../official_view_component/official/form.js";
import {ShareDialog} from "../glitterBundle/dialog/ShareDialog.js";

export class BgCustomerMessage {
    public static config = {
        color: 'rgb(254, 85, 65);',
        title: '',
        content: '',
        name: '',
        head: ''
    }
    public static visible = false

    public static vm: {
        type: 'list' | 'detail',
        chat_user: any,
        select_bt: 'list' | 'robot' | 'preview' | 'setting'
    } = {
        type: 'list',
        chat_user: '',
        select_bt: 'list'
    }
    public static id = `dsmdklweew3`

    public static leftNav(gvc: GVC) {
        const html = String.raw
        return html`
            <div class="avatar-img rounded-circle"
                 style="background-color: ${BgCustomerMessage.config.color};width: 58px;height: 58px ;cursor: pointer;display: flex;align-items: center;justify-content: center;position: fixed;left: 20px;bottom:20px;z-index: 100;"
                 onclick="${gvc.event(() => {
                     BgCustomerMessage.toggle(true, gvc)
                 })}">
                <i class="fa-solid fa-message-dots"
                   style=" color: white;font-size: 30px;"></i>
                ${gvc.bindView(() => {
                    const id = gvc.glitter.getUUID()
                    return {
                        bind: id,
                        view: () => {
                            return new Promise((resolve, reject) => {
                                Chat.getUnRead({user_id: 'manager'}).then((data) => {
                                    if (data.response.length === 0) {
                                        resolve('')
                                    } else {
                                        resolve(` <div class="position-absolute   rounded-circle d-flex align-items-center justify-content-center fw-500 shadow-lg border-danger text-danger" style="background: white;width:28px;height: 28px;top:-5px;right: -10px;border:2px solid red;">${data.response.length}</div>`)
                                    }
                                })
                            })
                        },
                        onCreate: () => {
                            setTimeout(() => {
                                gvc.notifyDataChange(id)
                            }, 2000)
                        }
                    }
                })}
            </div>
            <div class="vw-100 vh-100 position-fixed left-0 top-0 d-none"
                 id="BgCustomerMessageHover"
                 style="z-index: 99999;background: rgba(0,0,0,0.5);"
                 onclick="${gvc.event(() => {
                     BgCustomerMessage.toggle(false, gvc)
                 })}"></div>
            <div id="BgCustomerMessage"
                 class="position-fixed left-0 top-0 h-100 bg-white shadow-lg "
                 style="width:480px;z-index: 99999;left: -100%;">
                <div class="w-100 d-flex align-items-center p-3 border-bottom">
                    <h5 class=" offcanvas-title  " style="">
                        客服訊息</h5>
                    <div class="flex-fill"></div>
                    <div class="fs-5 text-black" style="cursor: pointer;" onclick="${gvc.event(() => {
                        BgCustomerMessage.toggle(false, gvc)
                    })}"><i class="fa-sharp fa-regular fa-circle-xmark" style="color:black;"></i></div>
                </div>
                ${BgCustomerMessage.view(gvc)}
            </div>`
    }

    public static view(gvc: GVC) {
        return gvc.bindView(() => {
            const vm = BgCustomerMessage.vm
            return {
                bind: BgCustomerMessage.id,
                view: () => {
                    if (!BgCustomerMessage.visible) {
                        return `  <div class="d-flex align-items-center justify-content-center w-100 flex-column pt-3">
                                <div class="spinner-border" role="status">
                                    <span class="sr-only"></span>
                                </div>
                                <span class="mt-2">加載中...</span>
                            </div>`
                    }
                    if (vm.type === 'detail') {
                        return BgCustomerMessage.detail({
                            gvc: gvc,
                            chat: vm.chat_user,
                            user_id: 'manager',
                            containerHeight: '100vh',
                            document: document,
                            goBack: () => {
                            }
                        })
                    } else {
                        let view = [`<div class="d-flex  py-2 px-2 bg-white align-items-center w-100 justify-content-around border-bottom">
                            ${(() => {
                            let list = [
                                {
                                    key: 'list',
                                    label: "訊息列表",
                                    icon: '<i class="fa-regular fa-messages"></i>'
                                },
                                {
                                    key: 'setting',
                                    label: "內容設定",
                                    icon: '<i class="fa-regular fa-gear"></i>'
                                }
                                , {
                                    key: 'robot',
                                    label: "自動問答",
                                    icon: '<i class="fa-regular fa-robot"></i>'
                                },
                                {
                                    key: 'preview',
                                    label: "預覽樣式",
                                    icon: '<i class="fa-regular fa-eye"></i>'
                                }
                            ]
                            return list.map((dd) => {
                                return `<div class="d-flex align-items-center justify-content-center hoverBtn  border"
                                 style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;
                                 ${(BgCustomerMessage.vm.select_bt === dd.key) ? `background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);background:-webkit-linear-gradient(135deg, #667eea 0%, #764ba2 100%);color:white;` : ``}
                                 "
                                 data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                 data-bs-title="${dd.label}" onclick="${gvc.event(() => {
                                    BgCustomerMessage.vm.select_bt = (dd.key) as any;
                                    gvc.notifyDataChange(BgCustomerMessage.id)
                                })}">
                               ${dd.icon}
                            </div>`
                            }).join('')
                        })()}
                        </div>`]
                        if (BgCustomerMessage.vm.select_bt === 'list') {
                            view.push(BgCustomerMessage.list(gvc, (user) => {
                                vm.type = "detail"
                                vm.chat_user = user
                                gvc.notifyDataChange(BgCustomerMessage.id)
                            }))
                        } else if (BgCustomerMessage.vm.select_bt === 'robot') {
                            view.push(gvc.bindView(() => {
                                const id = gvc.glitter.getUUID()
                                const html = String.raw
                                return {
                                    bind: id,
                                    view: () => {
                                        return new Promise(async (resolve, reject) => {
                                            let keyData = (await ApiUser.getPublicConfig(`robot_auto_reply`, 'manager')).response.value || {}
                                            if (Array.isArray(keyData)) {
                                                keyData = {}
                                            }
                                            const dialog = new ShareDialog(gvc.glitter)
                                            resolve(html`
                                                <div class="position-relative bgf6 d-flex align-items-center justify-content-between m-n2 p-2 border-bottom shadow">
                                                    <span class="fs-6 fw-bold " style="color:black;">自動問答</span>
                                                    <button class="btn btn-primary-c "
                                                            style="height: 28px;width:40px;font-size:14px;"
                                                            onclick="${gvc.event(() => {
                                                                dialog.dataLoading({visible: true})

                                                                ApiUser.setPublicConfig({
                                                                    key: `robot_auto_reply`, value: keyData,
                                                                    user_id: 'manager'
                                                                }).then((data: any) => {
                                                                    dialog.dataLoading({visible: false})
                                                                    dialog.successMessage({text: "設定成功!"})
                                                                })
                                                            })}">儲存
                                                    </button>
                                                </div>
                                                <div style="margin-top: -30px;">
                                                    ${FormWidget.editorView({
                                                        gvc: gvc,
                                                        array: [{
                                                            "title": "",
                                                            "key": "question",
                                                            "readonly": "write",
                                                            "type": "array",
                                                            "require": "true",
                                                            "style_data": {
                                                                "label": {
                                                                    "class": "form-label fs-base ",
                                                                    "style": ""
                                                                },
                                                                "input": {"class": "", "style": ""},
                                                                "container": {
                                                                    "class": "",
                                                                    "style": ""
                                                                }
                                                            },
                                                            "referTitile": "ask",
                                                            "plusBtn": "添加問答項目",
                                                            "formList": [{
                                                                "title": "問題",
                                                                "key": "ask",
                                                                "readonly": "write",
                                                                "type": "text",
                                                                "require": "true",
                                                                "style_data": {
                                                                    "label": {
                                                                        "class": "form-label fs-base ",
                                                                        "style": ""
                                                                    },
                                                                    "input": {
                                                                        "class": "",
                                                                        "style": ""
                                                                    },
                                                                    "container": {
                                                                        "class": "",
                                                                        "style": ""
                                                                    }
                                                                }
                                                            }, {
                                                                "title": "回應",
                                                                "key": "response",
                                                                "readonly": "write",
                                                                "type": "textArea",
                                                                "require": "true",
                                                                "style_data": {
                                                                    "label": {
                                                                        "class": "form-label fs-base ",
                                                                        "style": ""
                                                                    },
                                                                    "input": {
                                                                        "class": "",
                                                                        "style": ""
                                                                    },
                                                                    "container": {
                                                                        "class": "",
                                                                        "style": ""
                                                                    }
                                                                }
                                                            }]
                                                        }],
                                                        refresh: () => {
                                                        },
                                                        formData: keyData
                                                    })}
                                                </div>
                                            `)
                                        })
                                    },
                                    divCreate: {
                                        class: `p-2`
                                    }
                                }
                            }))
                        } else if (BgCustomerMessage.vm.select_bt === 'preview') {
                            view.push(gvc.bindView(() => {
                                const id = gvc.glitter.getUUID()
                                return {
                                    bind: id,
                                    view: () => {
                                        return new Promise((resolve, reject) => {
                                            const userID = 'preview'
                                            const url = new URL(location.origin + location.pathname + 'backend-manager/bg-customer-message.js');
                                            gvc.glitter.getModule(url.href, (BgCustomerMessage) => {
                                                resolve(BgCustomerMessage.showCustomerMessage({
                                                    gvc: gvc,
                                                    userID: userID,
                                                    open: true
                                                }))
                                            })

                                        })
                                    },
                                    divCreate: {
                                        class: `vh-100 bgf6`
                                    }
                                }
                            }))
                        } else if (BgCustomerMessage.vm.select_bt === 'setting') {
                            view.push(gvc.bindView(() => {
                                const id = gvc.glitter.getUUID()
                                const html = String.raw
                                return {
                                    bind: id,
                                    view: () => {
                                        return new Promise(async (resolve, reject) => {
                                            const keyData = ((await ApiUser.getPublicConfig(`message_setting`, 'manager')).response.value) || {}
                                            keyData.color = keyData.color ?? '#FE5541';
                                            const dialog = new ShareDialog(gvc.glitter)
                                            resolve(html`
                                                <div class="position-relative bgf6 d-flex align-items-center justify-content-between m-n2 p-2 border-bottom shadow">
                                                    <span class="fs-6 fw-bold " style="color:black;">參數設定</span>
                                                    <button class="btn btn-primary-c "
                                                            style="height: 28px;width:40px;font-size:14px;"
                                                            onclick="${gvc.event(() => {
                                                                dialog.dataLoading({visible: true})
                                                                ApiUser.setPublicConfig({
                                                                    key: `message_setting`, value: keyData,
                                                                    user_id: 'manager'
                                                                }).then((data: any) => {
                                                                    dialog.dataLoading({visible: false})
                                                                    dialog.successMessage({text: "設定成功!"})
                                                                })
                                                            })}">儲存
                                                    </button>
                                                </div>
                                                <div style="margin-top: 10px;" class="p-2">
                                                    ${[
                                                        EditorElem.editeInput({
                                                            gvc: gvc,
                                                            title: '客服名稱',
                                                            type: 'name',
                                                            placeHolder: `請輸入客服名稱`,
                                                            default: keyData.name,
                                                            callback: (text) => {
                                                                keyData.name = text;
                                                            }
                                                        }),
                                                        EditorElem.uploadImage({
                                                            title: '大頭照',
                                                            gvc: gvc,
                                                            def: keyData.head || '',
                                                            callback: (text: string) => {
                                                                keyData.head = text;
                                                            },
                                                        }),
                                                        EditorElem.editeInput({
                                                            gvc: gvc,
                                                            title: '主色調',
                                                            type: 'color',
                                                            placeHolder: `請輸入主色調`,
                                                            default: keyData.color,
                                                            callback: (text) => {
                                                                keyData.color = text;
                                                            }
                                                        }),
                                                        EditorElem.editeInput({
                                                            gvc: gvc,
                                                            title: '置頂標題',
                                                            placeHolder: `請輸入置頂標題`,
                                                            default: keyData.title,
                                                            callback: (text) => {
                                                                keyData.title = text;
                                                            }
                                                        }), EditorElem.editeText({
                                                            gvc: gvc,
                                                            title: '置頂內文',
                                                            placeHolder: `請輸入置頂內文`,
                                                            default: keyData.content,
                                                            callback: (text) => {
                                                                keyData.content = text;
                                                            }
                                                        })
                                                    ].join('')}
                                                </div>`)
                                        })
                                    },
                                    divCreate: {
                                        class: `p-2`
                                    }
                                }
                            }))
                        }
                        return view.join('')
                    }


                },
                onCreate: () => {
                    $('.tooltip').remove();
                    ($('[data-bs-toggle="tooltip"]') as any).tooltip();
                }
            }
        });

    }

    public static detail(cf: {
        gvc: GVC, chat: any, user_id: string, containerHeight: string, document: any, goBack: () => void, close?: () => void
    }) {
        const gvc = cf.gvc;
        const document = cf.document;
        return gvc.bindView(() => {
            const id = gvc.glitter.getUUID()
            return {
                bind: id,
                view: () => {
                    return [
                        gvc.bindView(() => {
                            const id = gvc.glitter.getUUID()
                            return {
                                bind: id,
                                view: () => {
                                    return new Promise(async (resolve, reject) => {
                                        const chatRoom = (await Chat.getChatRoom({
                                            page: 0,
                                            limit: 1000,
                                            user_id: cf.user_id,
                                            chat_id: cf.chat.chat_id
                                        })).response.data[0];
                                        if (chatRoom.who === 'manager') {
                                            chatRoom.user_data = BgCustomerMessage.config
                                        }
                                        resolve(`<div class="navbar  d-flex align-items-center justify-content-between w-100  p-3" style="background: ${BgCustomerMessage.config.color};">
                      <div class="d-flex align-items-center pe-3 w-100" style="gap:10px;display: flex;align-items: center;">
                        <i class="fa-solid fa-chevron-left fs-6" style="color:white;cursor: pointer;" onclick="${gvc.event(() => {
                                            if (cf.user_id === 'manager') {
                                                BgCustomerMessage.vm.type = 'list'
                                                gvc.notifyDataChange(BgCustomerMessage.id)
                                            } else {
                                                cf.goBack()
                                            }
                                        })}"></i>
                        <img src="${(chatRoom.type === 'user') ? ((chatRoom.user_data && chatRoom.user_data.head) || 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1704269678588-43.png') : `https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1704269678588-43.png`}" class="rounded-circle border" style="background: white;" width="40" alt="Albert Flores">
                        <h6 class="mb-0 px-1 text-white">${(chatRoom.type === 'user') ? ((chatRoom.user_data && chatRoom.user_data.name) || '訪客') : `群組`}</h6>
                        <div class="flex-fill" style="flex: 1;"></div>
                      <i class="fa-regular fa-circle-xmark text-white fs-3 ${(cf.close) ? `` : `d-none`}" onclick="${gvc.event(() => {
                                            cf.close && cf.close()
                                        })}"></i>
                      </div>
                    </div>`)
                                    })
                                }
                            }
                        }),
                        gvc.bindView(() => {
                            const viewId = gvc.glitter.getUUID()
                            const vm: {
                                data: any
                                loading: boolean,
                                scrollToBtn: boolean,
                                lastScroll: number,
                                message: string,
                                prefixScroll: number,
                                last_read: any
                            } = {
                                data: [],
                                loading: true,
                                scrollToBtn: false,
                                lastScroll: -1,
                                message: '',
                                prefixScroll: 0,
                                last_read: {}
                            }
                            //chat_id
                            Chat.getMessage({
                                page: 0,
                                limit: 50,
                                chat_id: cf.chat.chat_id,
                                user_id: cf.user_id
                            }).then((res) => {
                                vm.data = res.response.data.reverse()
                                vm.last_read = res.response.lastRead
                                vm.loading = false
                                gvc.notifyDataChange(viewId)
                            })

                            const url = new URL((window as any).glitterBackend)
                            if (gvc.share.socket) {
                                gvc.share.socket.close()
                            }

                            const socket = (location.href.includes('https://')) ? new WebSocket(`wss://${url.hostname}/websocket`) : new WebSocket(`ws://${url.hostname}:9003`);
                            gvc.share.socket = socket;
                            socket.addEventListener('open', function (event) {
                                console.log('Connected to server');
                                socket.send(JSON.stringify({
                                    type: 'message',
                                    chatID: cf.chat.chat_id,
                                    user_id: cf.user_id
                                }))
                            });
                            let interVal: any = 0
                            socket.addEventListener('message', function (event) {
                                const data = JSON.parse(event.data)
                                console.log(`message_in`, data.data)
                                if (data.type === 'update_read_count') {
                                    vm.last_read = (data.data);
                                } else {
                                    vm.data.push(data);
                                }

                                const element: any = document.querySelector(".chatContainer")!
                                const st = element.scrollTop;
                                const ofs = element.offsetHeight;
                                const sh = element.scrollHeight;
                                if ((st + ofs) >= sh - 50) {
                                    vm.lastScroll = -1;
                                } else {
                                    vm.lastScroll = st;
                                }
                                clearInterval(interVal)
                                interVal = setTimeout(() => {
                                    gvc.notifyDataChange(viewId)
                                }, 500)

                                console.log('Message from server:', event.data);
                            });

                            socket.addEventListener('close', function (event) {
                                console.log('Disconnected from server');
                            });
                            const html = String.raw
                            return {
                                bind: viewId,
                                view: () => {
                                    if (vm.loading) {
                                        return String.raw`<div class="d-flex align-items-center justify-content-center w-100 flex-column pt-3">
                                <div class="spinner-border" role="status">
                                    <span class="sr-only"></span>
                                </div>
                                <span class="mt-2">加載中...</span>
                            </div>`
                                    }
                                    return html`
                                        <div class="chatContainer p-3"
                                             style="overflow-y: auto;height: calc(${cf.containerHeight} - 220px);background: white;">
                                            ${vm.data.map((dd: any, index: number) => {
                                                if (dd.user_id == 'manager') {
                                                    dd.user_data = BgCustomerMessage.config
                                                }
                                                if (cf.user_id !== dd.user_id) {
                                                    return html`
                                                        <div class="d-flex align-items-start ${(vm.data[index + 1] && (vm.data[index + 1].user_id === dd.user_id)) ? `mb-1` : `mb-3`}">
                                                            <img src="${(dd.user_data && dd.user_data.head) || `https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1704269678588-43.png`}"
                                                                 class="rounded-circle border" width="40"
                                                                 alt="Albert Flores">
                                                            <div class="ps-2 ms-1" style="max-width: 348px;">
                                                                <div class="p-3 mb-1"
                                                                     style="background:#eeeef1;border-top-right-radius: .5rem; border-bottom-right-radius: .5rem; border-bottom-left-radius: .5rem;white-space: normal;">
                                                                    ${dd.message.text.replace(/\n/g, '<br>')}
                                                                </div>
                                                                <div class="fs-sm text-muted ${(vm.data[index + 1] && (vm.data[index + 1].user_id === dd.user_id)) ? `d-none` : ``}">
                                                                    ${gvc.glitter.ut.dateFormat(new Date(dd.created_time), 'MM-dd hh:mm')}
                                                                </div>
                                                            </div>
                                                        </div>`
                                                } else {
                                                    return html`
                                                        <div class="d-flex align-items-start justify-content-end ${(vm.data[index + 1] && (vm.data[index + 1].user_id === dd.user_id)) ? `mb-1` : `mb-3`}">
                                                            <div class="pe-2 me-1" style="max-width: 348px;">
                                                                <div class=" text-light p-3 mb-1"
                                                                     style="background:${BgCustomerMessage.config.color};border-top-left-radius: .5rem; border-bottom-right-radius: .5rem; border-bottom-left-radius: .5rem;white-space: normal;">
                                                                    ${dd.message.text.replace(/\n/g, '<br>')}
                                                                </div>
                                                                <div class="fw-500 d-flex justify-content-end align-items-center fs-sm text-muted ${(vm.data[index + 1] && (vm.data[index + 1].user_id === dd.user_id)) ? `d-none` : ``}"
                                                                     style="gap:5px;">
                                                                    <span>  ${gvc.glitter.ut.dateFormat(new Date(dd.created_time), 'MM/dd hh:mm')}</span>
                                                                    ${(vm.last_read.find((d2: any) => {
                                                                        return (d2.user_id !== cf.user_id) && new Date(d2.last_read).getTime() >= new Date(dd.created_time).getTime()
                                                                    })) ? `已讀` : ``}

                                                                </div>
                                                            </div>
                                                            <img src="${(dd.user_data && dd.user_data.head) || `https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1704269678588-43.png`}"
                                                                 class="rounded-circle border" width="40"
                                                                 alt="Albert Flores">
                                                        </div>`
                                                }
                                            }).join('')}
                                        </div>
                                        <div class="card-footer border-top d-flex align-items-center w-100 border-0 pt-3 pb-3 px-4 position-absolute bottom-0 "
                                             style="background: white;">
                                            <div class="position-relative w-100 me-2 ">
                                                ${gvc.bindView(() => {
                                                    const id = gvc.glitter.getUUID()
                                                    return {
                                                        bind: id,
                                                        view: () => {
                                                            return vm.message ?? ''
                                                        },
                                                        divCreate: {
                                                            elem: `textArea`,
                                                            style: `max-height:100px;white-space: pre-wrap; word-wrap: break-word;height:40px;`,
                                                            class: `form-control`, option: [
                                                                {key: 'placeholder', value: '輸入訊息內容'},
                                                                {
                                                                    key: 'onchange', value: gvc.event((e) => {
                                                                        vm.message = e.value;
                                                                    })
                                                                }
                                                            ]
                                                        },
                                                        onCreate: () => {
                                                            const input = gvc.getBindViewElem(id).get(0)
                                                            input.addEventListener('input', function () {
                                                                console.log(`input.scrollHeight->`, input.scrollHeight)
                                                                input.style.height = 'auto'; // 重置高度
                                                                input.style.height = (input.scrollHeight) + 'px'; // 设置为内容高度

                                                            });
                                                            // autosize(gvc.getBindViewElem(id))
                                                        }
                                                    }
                                                })}
                                                <!-- <div class="position-absolute top-50 end-0 translate-middle-y d-flex zindex-3 me-2"> -->
                                                <!--     <button type="button" -->
                                                <!--             class="btn btn-icon btn-sm btn-link nav-link bg-faded-primary-hover me-1"> -->
                                                <!--         <i class="bx bx-paperclip fs-4"></i> -->
                                                <!--     </button> -->
                                                <!--     <button type="button" -->
                                                <!--             class="btn btn-icon btn-sm btn-link nav-link bg-faded-primary-hover"> -->
                                                <!--         <i class="bx bx-smile fs-4"></i> -->
                                                <!--     </button> -->
                                                <!-- </div> -->
                                            </div>
                                            <button type="button"
                                                    class="btn btn-icon btn-lg  d-sm-inline-flex ms-1"
                                                    style="height: 36px;background: ${BgCustomerMessage.config.color};"
                                                    onclick="${gvc.event(() => {
                                                        if (vm.message) {
                                                            Chat.postMessage({
                                                                chat_id: cf.chat.chat_id,
                                                                user_id: cf.user_id,
                                                                message: {
                                                                    text: vm.message,
                                                                    attachment: ''
                                                                }
                                                            })
                                                            vm.message = '';
                                                        } else {

                                                        }
                                                    })}">
                                                <i class="fa-regular fa-paper-plane-top"></i>
                                            </button>
                                        </div>`

                                },
                                divCreate: {},
                                onCreate: () => {
                                    // 取得要監聽的元素
                                    let targetElement = document.querySelector('.chatContainer')!;
                                    if (vm.lastScroll === -1) {
                                        document.querySelector('.chatContainer')!.scrollTop = document.querySelector('.chatContainer')!.scrollHeight;
                                    } else {
                                        if (vm.prefixScroll) {
                                            vm.lastScroll = targetElement.scrollHeight - vm.prefixScroll + vm.lastScroll;
                                            vm.prefixScroll = 0
                                        }
                                        document.querySelector('.chatContainer')!.scrollTop = vm.lastScroll;
                                    }
                                    // 添加滾動事件監聽器
                                    targetElement.addEventListener('scroll', () => {
                                        vm.lastScroll = targetElement.scrollTop
                                        if (targetElement.scrollTop === 0) {
                                            if (vm.loading) {
                                                return
                                            }
                                            vm.loading = true
                                            Chat.getMessage({
                                                page: 0,
                                                limit: 50,
                                                chat_id: cf.chat.chat_id,
                                                olderID: vm.data[0].id,
                                                user_id: cf.user_id
                                            }).then((res) => {
                                                vm.loading = false
                                                vm.prefixScroll = targetElement.scrollHeight
                                                vm.data = res.response.data.reverse().concat(vm.data)
                                                gvc.notifyDataChange(viewId)
                                            })

                                        }
                                    });
                                },
                                onDestroy: () => {
                                    socket.close()
                                }
                            }
                        })
                    ].join('')
                }
            }
        })
    }

    public static list(gvc: GVC, callback: (chat_id: any) => void): string {
        return gvc.bindView(() => {
            const listId = gvc.glitter.getUUID()
            let chatData: any = undefined
            let unRead: any = undefined
            Chat.getChatRoom({
                page: 0,
                limit: 1000,
                user_id: 'manager'
            }).then(async (data) => {
                chatData = (data.response.data)
                Chat.getUnRead({user_id: 'manager'}).then((data) => {
                    unRead = data.response
                    gvc.notifyDataChange(listId)
                })
            })
            return {
                bind: listId,
                view: () => {
                    if (chatData) {
                        const view = []
                        view.push(`
                        <div class="p-2"><div class="position-relative">
                        <input type="text" class="form-control pe-5" placeholder="搜尋用戶">
                        <i class="bx bx-search fs-xl text-nav position-absolute top-50 end-0 translate-middle-y me-3"></i>
                      </div></div>
<div style="max-height: calc(100vh - 180px);overflow-y: auto;">
${chatData.map((dd: any) => {
                            if (dd.topMessage && dd.chat_id !== 'manager-preview') {
                                const unReadCount = unRead.filter((d2: any) => {
                                    return dd.chat_id === d2.chat_id
                                }).length
                                if (dd.chat_id)
                                    return `<a  class="d-flex align-items-center border-bottom text-decoration-none bg-faded-primary-hover py-3 px-4" style="cursor: pointer;" onclick="${
                                        gvc.event(() => {
                                            callback(dd)
                                        })
                                    }">
<div class="rounded-circle position-relative " style="width: 40px;height: 40px;">
<div class="rounded-circle text-white bg-danger ${(unReadCount) ? `` : `d-none`} fw-500 d-flex align-items-center justify-content-center me-2" style="min-width:18px !important;height: 18px !important;
position: absolute;right: -15px;top:-5px;font-size:11px;">${unReadCount}</div>
  <img src="${(dd.userData && dd.userData.head) || `https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1704269678588-43.png`}" class="rounded-circle border" width="40" alt="Devon Lane">
</div>

                          
                            <div class="w-100 ps-2 ms-1">
                              <div class="d-flex align-items-center justify-content-between mb-1">
                                <h6 class="mb-0 me-2">${(dd.user_data && dd.user_data.name) || `訪客`}</h6>
                                <span class="fs-xs  fw-500 text-muted">${gvc.glitter.ut.dateFormat(new Date(dd.topMessage.created_time), 'MM-dd hh:mm')}</span>
                              </div>
                              <p class="fs-sm  mb-0 " style="white-space: normal;${(unReadCount) ? `color:black;` : `color:#585c7b !important;`}">${(dd.topMessage ? dd.topMessage.text : ``).length > 50 ? (dd.topMessage ? dd.topMessage.text : ``).substring(0, 50) + '.....' : (dd.topMessage ? dd.topMessage.text : ``)}</p>
                            </div>
                            
                          </a>`
                            } else {
                                return ``
                            }

                        }).join('') || ` <div class="d-flex align-items-center justify-content-center flex-column w-100"
                                                         style="width:700px;">
                                                        <lottie-player style="max-width: 100%;width: 300px;"
                                                                       src="https://assets10.lottiefiles.com/packages/lf20_rc6CDU.json"
                                                                       speed="1" loop="true"
                                                                       background="transparent"></lottie-player>
                                                        <h3 class="text-dark fs-6 mt-n3 px-2  "
                                                            style="line-height: 200%;text-align: center;">
                                                            尚無相關訊息。</h3>
                                                    </div>`}
</div>
`)
                        return (view.join(''))
                    } else {
                        return `<div class="d-flex align-items-center justify-content-center w-100 flex-column pt-3">
                                <div class="spinner-border" role="status">
                                    <span class="sr-only"></span>
                                </div>
                                <span class="mt-2">加載中...</span>
                            </div>`
                    }
                },
                divCreate: {}
            }
        })
    }

    public static toggle(visible: boolean, gvc: GVC) {
        BgCustomerMessage.visible = visible
        BgCustomerMessage.vm.type = 'list';
        if (visible) {
            $('#BgCustomerMessageHover').removeClass('d-none')
            $('#BgCustomerMessage').removeClass('scroll-out')
            $('#BgCustomerMessage').addClass('scroll-in')
        } else {
            $('#BgCustomerMessageHover').addClass('d-none')
            $('#BgCustomerMessage').addClass('scroll-out')
            $('#BgCustomerMessage').removeClass('scroll-in')
        }
        gvc.notifyDataChange(BgCustomerMessage.id)
    }

    public static robotMessage(gvc: GVC, goToChat: (text: string) => void) {
        const html = String.raw
        return gvc.bindView(() => {
            const id = gvc.glitter.getUUID()
            return {
                bind: id,
                view: () => {
                    return html`
                        <div class=" card rounded-3">
                            <div class="p-3 rounded-top"
                                 style="width: 100%;white-space: normal;background: ${BgCustomerMessage.config.color};">
                                <div class="text-white fw-bold" style=" font-size: 20px;">
                                    ${BgCustomerMessage.config.title ?? ""}
                                </div>
                                <p class=" text-white mt-2 mb-4"
                                   style=" font-size: 16px;line-height: 22px;font-weight: 300;">
                                    ${(BgCustomerMessage.config.content ?? "").replace(/\n/g, `<br>`)}
                                </p>
                                <button class="btn w-100  rounded"
                                        style=" background-color: rgba(0, 0, 0, 0.2);" onclick="${gvc.event(() => {
                                    goToChat('')
                                })}">返回聊天
                                </button>
                            </div>
                        </div>
                        ${gvc.bindView(() => {
                            const css = String.raw
                            const id = gvc.glitter.getUUID()
                            return {
                                bind: id,
                                view: () => {
                                    return new Promise(async (resolve, reject) => {
                                        const returnHtml: any = [];
                                        const robot = (await ApiUser.getPublicConfig('robot_auto_reply', 'manager')).response.value.question
                                        if (robot.length > 0) {
                                            returnHtml.push(html`
                                                <div class=" fw-bold"
                                                     style=" height: 60px;display: flex;align-items: center;justify-content: center;font-size: 16px;">
                                                    <div class="" style="color: black;">即時解答</div>
                                                </div>`)
                                        }
                                        robot.map((dd: any) => {
                                            returnHtml.push(`<div class="rounded-3 w-100 d-flex px-3 btn-white-primary py-2 fw-500"
                                                     style=" " onclick="${gvc.event(() => {
                                                goToChat(dd.ask)

                                            })}">
                                                    <div style="white-space: normal;" class="flex-fill">${dd.ask}</div><i class="fa-solid fa-paper-plane-top"
                                                                        style="font-size:18px;"
                                                                        aria-hidden="true"></i></div>`)
                                        })

                                        resolve(returnHtml.join('') && html`
                                            <div class="px-3 pb-3"
                                                 style=" display: flex;flex-direction: column;align-items: center;justify-content: center;gap:10px;font-size: 16px;">
                                                ${returnHtml.join('')}
                                            </div>`)
                                    })
                                },
                                divCreate: {
                                    style: css`background-color: white;`
                                }
                            }
                            // (await ApiUser.getPublicConfig('robot_auto_reply','manager')).response.value.question
                        })}


                    `
                },
                divCreate: {}
            }
        })
    }

    public static showCustomerMessage(cf: {
        gvc: GVC,
        userID: string,
        open?: boolean
    }) {
        const gvc = cf.gvc;
        const html = String.raw
        cf.userID = `${cf.userID}`
        const chatID = [cf.userID, 'manager'].sort().join('-');
        let open = cf.open || false
        let vm: {
            viewType: 'message' | 'robot'
        } = {
            viewType: 'robot'
        }
        return gvc.bindView(() => {
            const id = gvc.glitter.getUUID()
            return {
                bind: id,
                view: () => {
                    return ``
                },
                divCreate: {
                    elem: 'web-component', option: [
                        {
                            key: 'id', value: id
                        }
                    ],
                    class: `position-fixed`,
                    style: `z-index:9999;bottom:0px;left:0px;`
                },
                onCreate: async () => {
                    const keyData = ((await ApiUser.getPublicConfig(`message_setting`, 'manager')).response.value) || {
                        color: '#FE5541',
                        head: 'https://liondesign-prd.s3.amazonaws.com/file/252530754/1695093945424-Frame 62 (1).png',
                        name: '萊恩設計'
                    }
                    BgCustomerMessage.config = keyData as any
                    await Chat.post({
                        type: 'user',
                        participant: [cf.userID, 'manager']
                    })
                    const css = String.raw
                    const viewId = gvc.glitter.getUUID()
                    const chatView = `<div class="position-fixed  rounded-3 shadow-lg" style="${gvc.glitter.ut.frSize({
                        sm: css`width: 376px;
                          height: 756px;
                          bottom: 90px;
                          left: 20px;
                          z-index: 9999;
                          overflow: hidden;
                          background: white;`
                    }, css`width: 100%;
                      height: 100%;
                      bottom: 0px;
                      left: 0px;
                      z-index: 9999;
                      overflow: hidden;
                      background: white;`)}">${BgCustomerMessage.detail({
                        gvc: gvc,
                        chat: {
                            "chat_id": chatID,
                            "type": "user",
                        },
                        user_id: cf.userID,
                        containerHeight: gvc.glitter.ut.frSize({
                            sm: `826px`
                        }, `${($('body').height() as any) + 60}px`),
                        document: (document.querySelector('#' + id)! as any).shadowRoot,
                        goBack: () => {
                            vm.viewType = 'robot'
                            gvc.notifyDataChange(viewId)
                        },
                        close: gvc.glitter.ut.frSize({
                            sm: undefined
                        }, () => {
                            open = !open
                            gvc.notifyDataChange(id)
                        })
                    })}</div>`;

                    const roBotView = `<div class="position-fixed  rounded-3 shadow-lg " style="${gvc.glitter.ut.frSize({
                        sm: css`width: 376px;
                          max-height: 756px;
                          bottom: 90px;
                          left: 20px;
                          z-index: 9999;
                          overflow: hidden;
                          background: white;`
                    }, css`width: 100%;
                      height: 100%;
                      bottom: 0px;
                      left: 0px;
                      z-index: 9999;
                      overflow: hidden;
                      background: white;`)}">${BgCustomerMessage.robotMessage(gvc, async (text) => {
                        vm.viewType = 'message'
                        if (text) {
                            await Chat.postMessage({
                                chat_id: chatID,
                                user_id: cf.userID,
                                message: {
                                    text: text,
                                    attachment: ''
                                }
                            })
                        }

                        gvc.notifyDataChange(viewId)
                    })}</div>`;
                    const baseUrl = new URL('../', import.meta.url);
                    (document.querySelector('#' + id)! as any).addStyleLink(baseUrl.href + `assets/css/theme.css`);
                    (document.querySelector('#' + id)! as any).addStyleLink(baseUrl.href + `assets/vendor/boxicons/css/boxicons.min.css`);
                    (document.querySelector('#' + id)! as any).addStyleLink(`https://kit.fontawesome.com/cccedec0f8.css`);
                    (document.querySelector('#' + id)! as any).addStyle(css`
                      .btn-white-primary {
                        border: 2px solid ${BgCustomerMessage.config.color};
                        justify-content: space-between;
                        align-items: center;
                        cursor: pointer;
                        color: ${BgCustomerMessage.config.color};
                        gap: 10px;
                      }

                      .btn-white-primary:hover {
                        background: ${BgCustomerMessage.config.color};
                        color: white !important;
                      }
                    `);
                    const chatBtID = id;
                    (document.querySelector('#' + id)! as any).setView({
                        gvc: gvc, view: gvc.bindView(() => {
                            return {
                                bind: viewId,
                                view: () => {
                                    const btn = html`
                                        <div class="avatar-img rounded-circle position-relative"
                                             style="background-color: ${BgCustomerMessage.config.color};width: 58px;height: 58px ;cursor: pointer;display: flex;align-items: center;justify-content: center;position: fixed;left: 20px;bottom:20px;z-index: 100;"
                                             onclick="${gvc.event(() => {
                                                 open = !open
                                                 gvc.notifyDataChange(viewId)
                                             })}">
                                            <i class="${(open) ? `fa-sharp fa-regular fa-xmark` : `fa-solid fa-message-dots `}"
                                               style=" color: white;font-size: 30px;"></i>
                                            ${gvc.bindView(() => {
                                                const id = gvc.glitter.getUUID()
                                                let unread = 0
                                                return {
                                                    bind: id,
                                                    view: () => {
                                                        if (unread === 0) {
                                                            return ''
                                                        } else {
                                                            return (` <div class="position-absolute   rounded-circle d-flex align-items-center justify-content-center fw-500 shadow-lg border-danger text-danger" style="background: white;width:28px;height: 28px;top:-5px;right: -10px;border:2px solid red;">${unread}</div>`)
                                                        }
                                                    },
                                                    onCreate: () => {
                                                        function loop(){
                                                            setTimeout(() => {
                                                                Chat.getUnRead({user_id: cf.userID}).then((data) => {
                                                                    if (unread !== data.response.length) {
                                                                        unread=data.response.length
                                                                        if ((document.querySelector('#' + chatBtID)! as any)) {
                                                                            gvc.notifyDataChange(id)
                                                                        }
                                                                    }else {
                                                                        loop()
                                                                    }
                                                                })
                                                            }, 2000)
                                                        }
                                                        loop()
                                                    }
                                                }
                                            })}

                                        </div>`
                                    let view = []
                                    gvc.glitter.ut.frSize({
                                        sm: (() => {
                                            view.push(btn)
                                        })
                                    }, (() => {
                                        !open && view.push(btn)
                                    }))();
                                    if (open) {
                                        vm.viewType === 'message' && view.push(chatView)
                                        vm.viewType === 'robot' && view.push(roBotView)
                                    } else {
                                    }
                                    return view.join('')
                                },
                                divCreate: {},
                                onCreate: () => {

                                }
                            }
                        }), id: id
                    });
                }
            }
        })
    }
}

(window as any).glitter.setModule(import.meta.url, BgCustomerMessage)

