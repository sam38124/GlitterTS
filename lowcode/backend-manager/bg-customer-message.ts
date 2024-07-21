import {GVC} from '../glitterBundle/GVController.js';
import {Chat} from '../glitter-base/route/chat.js';
//@ts-ignore
import autosize from '../glitterBundle/plugins/autosize.js';
import {EditorElem} from '../glitterBundle/plugins/editor-elem.js';
import {ApiUser} from '../glitter-base/route/user.js';
import {FormWidget} from '../official_view_component/official/form.js';
import {ShareDialog} from '../glitterBundle/dialog/ShareDialog.js';
import {BgWidget} from "./bg-widget.js";
import {CustomerMessageUser} from "../cms-plugin/customer-message-user.js";

export class BgCustomerMessage {
    public static config = {
        color: 'rgb(254, 85, 65);',
        title: '',
        content: '',
        name: '',
        head: '',
        hideBar: false,
    };
    public static visible = false;

    public static vm: {
        type: 'list' | 'detail';
        chat_user: any;
        select_bt: 'list' | 'robot' | 'preview' | 'setting';
    } = {
        type: 'list',
        chat_user: '',
        select_bt: 'list',
    };
    public static id = `dsmdklweew3`;

    public static leftNav(gvc: GVC) {
        const html = String.raw;
        return `<div id="BgCustomerMessage" class="position-fixed left-0 top-0 h-100 bg-white shadow-lg " style="width:480px;z-index: 99999;right: -120%;">
                <div class="w-100 d-flex align-items-center p-3 border-bottom">
                    <h5 class=" offcanvas-title  " style="">客服訊息</h5>
                    <div class="flex-fill"></div>
                    <div
                        class="fs-5 text-black"
                        style="cursor: pointer;"
                        onclick="${gvc.event(() => {
            BgCustomerMessage.toggle(false, gvc);
        })}"
                    >
                        <i class="fa-sharp fa-regular fa-circle-xmark" style="color:black;"></i>
                    </div>
                </div>
                ${BgCustomerMessage.view(gvc)}
            </div>`
        return html`
            <div
                    class="avatar-img rounded-circle"
                    style="background-color: ${BgCustomerMessage.config
                            .color};width: 58px;height: 58px ;cursor: pointer;display: flex;align-items: center;justify-content: center;position: fixed;left: 20px;bottom:20px;z-index: 100;"
                    onclick="${gvc.event(() => {
                        BgCustomerMessage.toggle(true, gvc);
                    })}"
            >
                <i class="fa-solid fa-message-dots" style=" color: white;font-size: 30px;"></i>
                ${gvc.bindView(() => {
                    const id = gvc.glitter.getUUID();
                    return {
                        bind: id,
                        view: () => {
                            return new Promise((resolve, reject) => {
                                Chat.getUnRead({user_id: 'manager'}).then((data) => {
                                    if (data.response.length === 0) {
                                        resolve('');
                                    } else {
                                        resolve(
                                                ` <div class="position-absolute   rounded-circle d-flex align-items-center justify-content-center fw-500 shadow-lg border-danger text-danger" style="background: white;width:28px;height: 28px;top:-5px;right: -10px;border:2px solid red;">${data.response.length}</div>`
                                        );
                                    }
                                });
                            });
                        },
                        onCreate: () => {
                            setTimeout(() => {
                                gvc.notifyDataChange(id);
                            }, 2000);
                        },
                    };
                })}
            </div>
            <div
                    class="vw-100 vh-100 position-fixed left-0 top-0 d-none"
                    id="BgCustomerMessageHover"
                    style="z-index: 99999;background: rgba(0,0,0,0.5);"
                    onclick="${gvc.event(() => {
                        BgCustomerMessage.toggle(false, gvc);
                    })}"
            ></div>
        `;
    }

    public static view(gvc: GVC) {
        return gvc.bindView(() => {
            const vm = BgCustomerMessage.vm;
            return {
                bind: BgCustomerMessage.id,
                view: () => {
                    if (!BgCustomerMessage.visible) {
                        return `  <div class="d-flex align-items-center justify-content-center w-100 flex-column pt-3">
                                <div class="spinner-border" role="status">
                                    <span class="sr-only"></span>
                                </div>
                                <span class="mt-2">載入中...</span>
                            </div>`;
                    }
                    if (vm.type === 'detail') {
                        return  `<div style="padding-bottom: 70px;">
${CustomerMessageUser.detail({
                            gvc: gvc,
                            chat: vm.chat_user,
                            user_id: 'manager',
                            containerHeight:($('body').height() as any + 60)+'px',
                            document: document,
                            goBack: () => {
                                vm.type='list'
                                vm.select_bt = 'list'
                                gvc.notifyDataChange(BgCustomerMessage.id);
                            },
                            close: ()=>{
                                vm.type='list'
                                vm.select_bt = 'list'
                                gvc.notifyDataChange(BgCustomerMessage.id);
                            }
                        })}
</div>`
                    } else {
                        let view = [
                            `<div class="d-flex  py-2 px-2 bg-white align-items-center w-100 justify-content-around border-bottom">
                            ${(() => {
                                let list = [
                                    {
                                        key: 'list',
                                        label: '訊息列表',
                                        icon: '<i class="fa-regular fa-messages"></i>',
                                    },
                                    {
                                        key: 'setting',
                                        label: '內容設定',
                                        icon: '<i class="fa-regular fa-gear"></i>',
                                    },
                                    {
                                        key: 'preview',
                                        label: '預覽樣式',
                                        icon: '<i class="fa-regular fa-eye"></i>',
                                    }
                                ];
                                return list
                                    .map((dd) => {
                                        return `<div class="d-flex align-items-center justify-content-center hoverBtn  border"
                                 style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;
                                 ${
                                            BgCustomerMessage.vm.select_bt === dd.key
                                                ? `background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);background:-webkit-linear-gradient(135deg, #667eea 0%, #764ba2 100%);color:white;`
                                                : ``
                                        }
                                 "
                                 data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                 data-bs-title="${dd.label}" onclick="${gvc.event(() => {
                                            BgCustomerMessage.vm.select_bt = dd.key as any;
                                            gvc.notifyDataChange(BgCustomerMessage.id);
                                        })}">
                               ${dd.icon}
                            </div>`;
                                    })
                                    .join('');
                            })()}
                        </div>`,
                        ];
                        if (BgCustomerMessage.vm.select_bt === 'list') {
                            view.push(
                                BgCustomerMessage.list(gvc, (user) => {
                                    vm.type = 'detail';
                                    vm.chat_user = user;
                                    gvc.notifyDataChange(BgCustomerMessage.id);
                                })
                            );
                        } else if (BgCustomerMessage.vm.select_bt === 'robot') {
                            view.push(
                                gvc.bindView(() => {
                                    const id = gvc.glitter.getUUID();
                                    const html = String.raw;
                                    return {
                                        bind: id,
                                        view: () => {
                                            return new Promise(async (resolve, reject) => {
                                                let keyData = (await ApiUser.getPublicConfig(`robot_auto_reply`, 'manager')).response.value || {};
                                                if (Array.isArray(keyData)) {
                                                    keyData = {};
                                                }
                                                const dialog = new ShareDialog(gvc.glitter);
                                                resolve(html`
                                                    <div class="position-relative bgf6 d-flex align-items-center justify-content-between m-n2 p-2 border-bottom shadow">
                                                        <span class="fs-6 fw-bold " style="color:black;">自動問答</span>
                                                        <button
                                                                class="btn btn-primary-c "
                                                                style="height: 28px;width:40px;font-size:14px;"
                                                                onclick="${gvc.event(() => {
                                                                    dialog.dataLoading({visible: true});

                                                                    ApiUser.setPublicConfig({
                                                                        key: `robot_auto_reply`,
                                                                        value: keyData,
                                                                        user_id: 'manager',
                                                                    }).then((data: any) => {
                                                                        dialog.dataLoading({visible: false});
                                                                        dialog.successMessage({text: '設定成功!'});
                                                                    });
                                                                })}"
                                                        >
                                                            儲存
                                                        </button>
                                                    </div>
                                                    <div style="margin-top: -30px;">
                                                        ${FormWidget.editorView({
                                                            gvc: gvc,
                                                            array: [
                                                                {
                                                                    title: '',
                                                                    key: 'question',
                                                                    readonly: 'write',
                                                                    type: 'array',
                                                                    require: 'true',
                                                                    style_data: {
                                                                        label: {
                                                                            class: 'form-label fs-base ',
                                                                            style: '',
                                                                        },
                                                                        input: {class: '', style: ''},
                                                                        container: {
                                                                            class: '',
                                                                            style: '',
                                                                        },
                                                                    },
                                                                    referTitile: 'ask',
                                                                    plusBtn: '添加問答項目',
                                                                    formList: [
                                                                        {
                                                                            title: '問題',
                                                                            key: 'ask',
                                                                            readonly: 'write',
                                                                            type: 'text',
                                                                            require: 'true',
                                                                            style_data: {
                                                                                label: {
                                                                                    class: 'form-label fs-base ',
                                                                                    style: '',
                                                                                },
                                                                                input: {
                                                                                    class: '',
                                                                                    style: '',
                                                                                },
                                                                                container: {
                                                                                    class: '',
                                                                                    style: '',
                                                                                },
                                                                            },
                                                                        },
                                                                        {
                                                                            title: '回應',
                                                                            key: 'response',
                                                                            readonly: 'write',
                                                                            type: 'textArea',
                                                                            require: 'true',
                                                                            style_data: {
                                                                                label: {
                                                                                    class: 'form-label fs-base ',
                                                                                    style: '',
                                                                                },
                                                                                input: {
                                                                                    class: '',
                                                                                    style: '',
                                                                                },
                                                                                container: {
                                                                                    class: '',
                                                                                    style: '',
                                                                                },
                                                                            },
                                                                        },
                                                                    ],
                                                                },
                                                            ],
                                                            refresh: () => {
                                                            },
                                                            formData: keyData,
                                                        })}
                                                    </div>
                                                `);
                                            });
                                        },
                                        divCreate: {
                                            class: `p-2`,
                                        },
                                    };
                                })
                            );
                        } else if (BgCustomerMessage.vm.select_bt === 'preview') {
                            view.push(
                                CustomerMessageUser.showCustomerMessage({
                                    gvc: gvc,
                                    userID: 'preview',
                                    open: true,
                                    type: 'preview'
                                })
                            );
                        } else if (BgCustomerMessage.vm.select_bt === 'setting') {
                            view.push(
                                gvc.bindView(() => {
                                    const id = gvc.glitter.getUUID();
                                    const html = String.raw;
                                    return {
                                        bind: id,
                                        view: () => {
                                            return new Promise(async (resolve, reject) => {
                                                const keyData = (await ApiUser.getPublicConfig(`message_setting`, 'manager')).response.value || {};
                                                keyData.color = keyData.color ?? '#FE5541';
                                                const dialog = new ShareDialog(gvc.glitter);
                                                const vm = {
                                                    message_setting: keyData,
                                                    robot_setting: undefined
                                                }

                                                async function save() {
                                                    dialog.dataLoading({visible: true});
                                                    await ApiUser.setPublicConfig({
                                                        key: `message_setting`,
                                                        value: vm.message_setting,
                                                        user_id: 'manager',
                                                    })
                                                    await ApiUser.setPublicConfig({
                                                        key: `robot_auto_reply`,
                                                        value: vm.robot_setting,
                                                        user_id: 'manager',
                                                    })
                                                    dialog.dataLoading({visible: false});
                                                    dialog.successMessage({text: '設定成功!'});
                                                }

                                                const view = [
                                                    html`
                                                        <div class="position-relative bgf6 d-flex align-items-center justify-content-between m-n2 p-2 border-bottom shadow">
                                                            <span class="fs-6 fw-bold "
                                                                  style="color:black;">功能設定</span>
                                                            ${BgWidget.darkButton('儲存', gvc.event(() => {
                                                                save()
                                                            }))}
                                                        </div>
                                                        <div style="margin-top: 10px;" class="p-2">
                                                            ${[
                                                                html`
                                                                    <div class="mb-3"
                                                                         style="display:flex; align-items: center; gap: 4px; margin-bottom: 8px;">
                                                                        <div class="fw-500"
                                                                             style="color: #393939;font-size: 15px;">
                                                                            功能啟用
                                                                        </div>
                                                                        ${BgWidget.switchButton(gvc, keyData.toggle, (bool) => {
                                                                            keyData.toggle = bool;
                                                                        })}
                                                                    </div>`,
                                                                EditorElem.editeInput({
                                                                    gvc: gvc,
                                                                    title: '客服名稱',
                                                                    type: 'name',
                                                                    placeHolder: `請輸入客服名稱`,
                                                                    default: keyData.name,
                                                                    callback: (text) => {
                                                                        keyData.name = text;
                                                                    },
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
                                                                    },
                                                                }),
                                                                EditorElem.editeInput({
                                                                    gvc: gvc,
                                                                    title: '置頂標題',
                                                                    placeHolder: `請輸入置頂標題`,
                                                                    default: keyData.title,
                                                                    callback: (text) => {
                                                                        keyData.title = text;
                                                                    },
                                                                }),
                                                                EditorElem.editeText({
                                                                    gvc: gvc,
                                                                    title: '置頂內文',
                                                                    placeHolder: `請輸入置頂內文`,
                                                                    default: keyData.content,
                                                                    callback: (text) => {
                                                                        keyData.content = text;
                                                                    },
                                                                }),
                                                            ].join('')}
                                                        </div>`,
                                                    gvc.bindView(() => {
                                                        const id = gvc.glitter.getUUID();
                                                        const html = String.raw;
                                                        return {
                                                            bind: id,
                                                            view: () => {
                                                                return new Promise(async (resolve, reject) => {
                                                                    let keyData = (await ApiUser.getPublicConfig(`robot_auto_reply`, 'manager')).response.value || {};
                                                                    if (Array.isArray(keyData)) {
                                                                        keyData = {};
                                                                    }
                                                                    vm.robot_setting = keyData
                                                                    const dialog = new ShareDialog(gvc.glitter);
                                                                    resolve(html`
                                                                        <div class="position-relative bgf6 d-flex align-items-center justify-content-between mx-n2 p-2 py-3 border-top border-bottom mt-2 shadow">
                                                                            <span class="fs-6 fw-bold "
                                                                                  style="color:black;">自動問答</span>
                                                                        </div>
                                                                        <div style="margin-top: -30px;" class="mx-n4">
                                                                            ${FormWidget.editorView({
                                                                                gvc: gvc,
                                                                                array: [
                                                                                    {
                                                                                        title: '',
                                                                                        key: 'question',
                                                                                        readonly: 'write',
                                                                                        type: 'array',
                                                                                        require: 'true',
                                                                                        style_data: {
                                                                                            label: {
                                                                                                class: 'form-label fs-base ',
                                                                                                style: '',
                                                                                            },
                                                                                            input: {
                                                                                                class: '',
                                                                                                style: ''
                                                                                            },
                                                                                            container: {
                                                                                                class: '',
                                                                                                style: '',
                                                                                            },
                                                                                        },
                                                                                        referTitile: 'ask',
                                                                                        plusBtn: '添加問答項目',
                                                                                        formList: [
                                                                                            {
                                                                                                title: '問題',
                                                                                                key: 'ask',
                                                                                                readonly: 'write',
                                                                                                type: 'text',
                                                                                                require: 'true',
                                                                                                style_data: {
                                                                                                    label: {
                                                                                                        class: 'form-label fs-base ',
                                                                                                        style: '',
                                                                                                    },
                                                                                                    input: {
                                                                                                        class: '',
                                                                                                        style: '',
                                                                                                    },
                                                                                                    container: {
                                                                                                        class: '',
                                                                                                        style: '',
                                                                                                    },
                                                                                                },
                                                                                            },
                                                                                            {
                                                                                                title: '回應',
                                                                                                key: 'response',
                                                                                                readonly: 'write',
                                                                                                type: 'textArea',
                                                                                                require: 'true',
                                                                                                style_data: {
                                                                                                    label: {
                                                                                                        class: 'form-label fs-base ',
                                                                                                        style: '',
                                                                                                    },
                                                                                                    input: {
                                                                                                        class: '',
                                                                                                        style: '',
                                                                                                    },
                                                                                                    container: {
                                                                                                        class: '',
                                                                                                        style: '',
                                                                                                    },
                                                                                                },
                                                                                            },
                                                                                        ],
                                                                                    },
                                                                                ],
                                                                                refresh: () => {
                                                                                },
                                                                                formData: keyData,
                                                                            })}
                                                                        </div>
                                                                    `);
                                                                });
                                                            },
                                                            divCreate: {
                                                                class: ``,
                                                            },
                                                        };
                                                    })
                                                ]
                                                resolve(view.join(''));
                                            });
                                        },
                                        divCreate: {
                                            class: `p-2`,
                                        },
                                    };
                                })
                            );
                        }
                        return view.join('');
                    }
                },
                divCreate:{
                    style:`position:relative;`
                },
                onCreate: () => {
                    $('.tooltip').remove();
                    ($('[data-bs-toggle="tooltip"]') as any).tooltip();
                },
            };
        });
    }


    public static list(gvc: GVC, callback: (chat_id: any) => void): string {
        return gvc.bindView(() => {
            const html = String.raw
            const listId = gvc.glitter.getUUID();
            let chatData: any = undefined;
            let unRead: any = undefined;
            Chat.getChatRoom({
                page: 0,
                limit: 1000,
                user_id: 'manager',
            }).then(async (data) => {
                chatData = data.response.data;
                // alert(JSON.stringify(chatData))
                Chat.getUnRead({user_id: 'manager'}).then((data) => {
                    unRead = data.response;
                    gvc.notifyDataChange(listId);
                });
            });
            return {
                bind: listId,
                view: () => {
                    if (chatData) {
                        const view = [];
                        view.push(html`
                            <div class="p-2">
                                <div class="position-relative">
                                    <input type="text" class="form-control pe-5" placeholder="搜尋用戶">
                                    <i class="bx bx-search fs-xl text-nav position-absolute top-50 end-0 translate-middle-y me-3"></i>
                                </div>
                            </div>
                            <div style="max-height: calc(100vh - 180px);overflow-y: auto;">
                                ${
                                        chatData
                                                .map((dd: any) => {
                                                    if (dd.topMessage && dd.chat_id !== 'manager-preview') {
                                                        const unReadCount = unRead.filter((d2: any) => {
                                                            return dd.chat_id === d2.chat_id;
                                                        }).length;
                                                        if (dd.chat_id)
                                                            return html`<a
                                                                    class="d-flex align-items-center border-bottom text-decoration-none bg-faded-primary-hover py-3 px-4"
                                                                    style="cursor: pointer;"
                                                                    onclick="${gvc.event(() => {
                                                                        callback(dd);
                                                                    })}">
                                                                <div class="rounded-circle position-relative "
                                                                     style="width: 40px;height: 40px;">
                                                                    <div class="rounded-circle text-white bg-danger ${unReadCount ? `` : `d-none`} fw-500 d-flex align-items-center justify-content-center me-2"
                                                                         style="min-width:18px !important;height: 18px !important;
position: absolute;right: -15px;top:-5px;font-size:11px;">${unReadCount}
                                                                    </div>
                                                                    <img src="${(dd.userData && dd.userData.head) || `https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1704269678588-43.png`}"
                                                                         class="rounded-circle border" style="border-radius: 50%;" width="40"
                                                                         alt="Devon Lane">
                                                                </div>


                                                                <div class="w-100 ps-2 ms-1">
                                                                    <div class="d-flex align-items-center justify-content-between mb-1">
                                                                        <h6 class="mb-0 me-2">
                                                                            ${(dd.user_data && dd.user_data.name) || `訪客`}</h6>
                                                                        <span class="fs-xs  fw-500 text-muted">${gvc.glitter.ut.dateFormat(new Date(dd.topMessage.created_time), 'MM-dd hh:mm')}</span>
                                                                    </div>
                                                                    <p class="fs-sm  mb-0 "
                                                                       style="white-space: normal;${unReadCount ? `color:black;` : `color:#585c7b !important;`}">
                                                                        ${
                                                                                (dd.topMessage ? dd.topMessage.text : ``).length > 50 ? (dd.topMessage ? dd.topMessage.text : ``).substring(0, 50) + '.....' : dd.topMessage ? dd.topMessage.text : ``
                                                                        }</p>
                                                                </div>
                                                            </a>`;
                                                    } else {
                                                        return ``;
                                                    }
                                                })
                                                .join('') ||
                                        `<div class="d-flex align-items-center justify-content-center flex-column w-100"
                                                         style="width:700px;">
                                                        <lottie-player style="max-width: 100%;width: 300px;"
                                                                       src="https://assets10.lottiefiles.com/packages/lf20_rc6CDU.json"
                                                                       speed="1" loop="true"
                                                                       background="transparent"></lottie-player>
                                                        <h3 class="text-dark fs-6 mt-n3 px-2  "
                                                            style="line-height: 200%;text-align: center;">
                                                            尚未收到客服訊息。</h3>
                                                    </div>`
                                }
                            </div>
                        `);
                        return view.join('');
                    } else {
                        return `<div class="d-flex align-items-center justify-content-center w-100 flex-column pt-3">
                                <div class="spinner-border" role="status">
                                    <span class="sr-only"></span>
                                </div>
                                <span class="mt-2">載入中...</span>
                            </div>`;
                    }
                },
                divCreate: {},
            };
        });
    }

    public static toggle(visible: boolean, gvc: GVC) {
        BgCustomerMessage.visible = visible;
        BgCustomerMessage.vm.type = 'list';
        if (visible) {
            $('#BgCustomerMessageHover').removeClass('d-none');
            $('#BgCustomerMessage').removeClass('scroll-out');
            $('#BgCustomerMessage').addClass('scroll-in');
        } else {
            $('#BgCustomerMessageHover').addClass('d-none');
            $('#BgCustomerMessage').addClass('scroll-out');
            $('#BgCustomerMessage').removeClass('scroll-in');
        }
        gvc.notifyDataChange(BgCustomerMessage.id);
    }


}

(window as any).glitter.setModule(import.meta.url, BgCustomerMessage);
