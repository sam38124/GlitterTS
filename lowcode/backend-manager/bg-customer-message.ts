import { GVC } from '../glitterBundle/GVController.js';
import { Chat } from '../glitter-base/route/chat.js';
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { FormWidget } from '../official_view_component/official/form.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { BgWidget } from './bg-widget.js';
import { CustomerMessageUser } from '../cms-plugin/customer-message-user.js';

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
        return html`<div id="BgCustomerMessage" class="position-fixed left-0 top-0 h-100 bg-white shadow-lg " style="width:480px; z-index: 99999; right: -125%;">
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
        </div>`;
    }

    public static view(gvc: GVC) {
        return gvc.bindView(() => {
            const html = String.raw;
            const vm = BgCustomerMessage.vm;
            return {
                bind: BgCustomerMessage.id,
                view: () => {
                    if (!BgCustomerMessage.visible) {
                        return html` <div class="d-flex align-items-center justify-content-center w-100 flex-column pt-3">
                            <div class="spinner-border" role="status">
                                <span class="sr-only"></span>
                            </div>
                            <span class="mt-2">載入中...</span>
                        </div>`;
                    }
                    if (vm.type === 'detail') {
                        return html`<div style="padding-bottom: 70px;">
                            ${CustomerMessageUser.detail({
                                gvc: gvc,
                                chat: vm.chat_user,
                                user_id: 'manager',
                                containerHeight: ($('body').height() as any) + 60 + 'px',
                                document: document,
                                goBack: () => {
                                    vm.type = 'list';
                                    vm.select_bt = 'list';
                                    gvc.notifyDataChange(BgCustomerMessage.id);
                                },
                                close: () => {
                                    vm.type = 'list';
                                    vm.select_bt = 'list';
                                    gvc.notifyDataChange(BgCustomerMessage.id);
                                },
                            })}
                        </div>`;
                    } else {
                        let view = [
                            html`<div class="d-flex  py-2 px-2 bg-white align-items-center w-100 justify-content-around border-bottom">
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
                                        },
                                    ];
                                    return list
                                        .map((dd) => {
                                            return html`<div
                                                class="d-flex align-items-center justify-content-center hoverBtn  border"
                                                style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;
                                                ${BgCustomerMessage.vm.select_bt === dd.key
                                                    ? `background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);background:-webkit-linear-gradient(135deg, #667eea 0%, #764ba2 100%);color:white;`
                                                    : ``}
                                                "
                                                data-bs-toggle="tooltip"
                                                data-bs-placement="top"
                                                data-bs-custom-class="custom-tooltip"
                                                data-bs-title="${dd.label}"
                                                onclick="${gvc.event(() => {
                                                    BgCustomerMessage.vm.select_bt = dd.key as any;
                                                    gvc.notifyDataChange(BgCustomerMessage.id);
                                                })}"
                                            >
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
                                                                dialog.dataLoading({ visible: true });

                                                                ApiUser.setPublicConfig({
                                                                    key: `robot_auto_reply`,
                                                                    value: keyData,
                                                                    user_id: 'manager',
                                                                }).then((data: any) => {
                                                                    dialog.dataLoading({ visible: false });
                                                                    dialog.successMessage({ text: '設定成功!' });
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
                                                                        input: { class: '', style: '' },
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
                                                            refresh: () => {},
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
                                    type: 'preview',
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
                                                    robot_setting: undefined,
                                                };

                                                async function save() {
                                                    dialog.dataLoading({ visible: true });
                                                    await ApiUser.setPublicConfig({
                                                        key: `message_setting`,
                                                        value: vm.message_setting,
                                                        user_id: 'manager',
                                                    });
                                                    await ApiUser.setPublicConfig({
                                                        key: `robot_auto_reply`,
                                                        value: vm.robot_setting,
                                                        user_id: 'manager',
                                                    });
                                                    dialog.dataLoading({ visible: false });
                                                    dialog.successMessage({ text: '設定成功!' });
                                                }

                                                const view = [
                                                    html` <div class="position-relative bgf6 d-flex align-items-center justify-content-between m-n2 p-2 border-bottom shadow">
                                                            <span class="fs-6 fw-bold " style="color:black;">功能設定</span>
                                                            ${BgWidget.darkButton(
                                                                '儲存',
                                                                gvc.event(() => {
                                                                    save();
                                                                })
                                                            )}
                                                        </div>
                                                        <div style="margin-top: 10px;" class="p-2">
                                                            ${[
                                                                html` <div class="mb-3" style="display:flex; align-items: center; gap: 4px; margin-bottom: 8px;">
                                                                    <div class="fw-500" style="color: #393939;font-size: 15px;">功能啟用</div>
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
                                                                    vm.robot_setting = keyData;
                                                                    const dialog = new ShareDialog(gvc.glitter);
                                                                    resolve(html`
                                                                        <div
                                                                            class="position-relative bgf6 d-flex align-items-center justify-content-between mx-n2 p-2 py-3 border-top border-bottom mt-2 shadow"
                                                                        >
                                                                            <span class="fs-6 fw-bold " style="color:black;">自動問答</span>
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
                                                                                                style: '',
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
                                                                                refresh: () => {},
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
                                                    }),
                                                ];
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
                divCreate: {
                    style: `position:relative;`,
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
            const html = String.raw;
            const listId = gvc.glitter.getUUID();
            let chatData: any = undefined;
            let unRead: any = undefined;
            Chat.getChatRoom({
                page: 0,
                limit: 1000,
                user_id: 'manager',
            }).then(async (data) => {
                chatData = data.response.data;
                Chat.getUnRead({ user_id: 'manager' }).then((data) => {
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
                                    <input type="text" class="form-control pe-5" placeholder="搜尋用戶" />
                                    <i class="bx bx-search fs-xl text-nav position-absolute top-50 end-0 translate-middle-y me-3"></i>
                                </div>
                            </div>
                            <div style="max-height: calc(100vh - 180px);overflow-y: auto;">
                                ${chatData
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
                                                    })}"
                                                >
                                                    <div class="rounded-circle position-relative " style="width: 40px;height: 40px;">
                                                        <div
                                                            class="rounded-circle text-white bg-danger ${unReadCount ? `` : `d-none`} fw-500 d-flex align-items-center justify-content-center me-2"
                                                            style="min-width:18px !important;height: 18px !important;position: absolute;right: -15px;top:-5px;font-size:11px;"
                                                        >
                                                            ${unReadCount}
                                                        </div>
                                                        <img
                                                            src="${(dd.userData && dd.userData.head) || `https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1704269678588-43.png`}"
                                                            class="rounded-circle border"
                                                            style="border-radius: 50%;"
                                                            width="40"
                                                            alt="Devon Lane"
                                                        />
                                                    </div>

                                                    <div class="w-100 ps-2 ms-1">
                                                        <div class="d-flex align-items-center justify-content-between mb-1">
                                                            <h6 class="mb-0 me-2">${(dd.user_data && dd.user_data.name) || `訪客`}</h6>
                                                            <span class="fs-xs  fw-500 text-muted">${gvc.glitter.ut.dateFormat(new Date(dd.topMessage.created_time), 'MM-dd hh:mm')}</span>
                                                        </div>
                                                        <p class="fs-sm  mb-0 " style="white-space: normal;${unReadCount ? `color:black;` : `color:#585c7b !important;`}">
                                                            ${(dd.topMessage ? dd.topMessage.text : ``).length > 50
                                                                ? (dd.topMessage ? dd.topMessage.text : ``).substring(0, 50) + '.....'
                                                                : dd.topMessage
                                                                ? dd.topMessage.text
                                                                : ``}
                                                        </p>
                                                    </div>
                                                </a>`;
                                        } else {
                                            return ``;
                                        }
                                    })
                                    .join('') ||
                                html`<div class="d-flex align-items-center justify-content-center flex-column w-100" style="width:700px;">
                                    <lottie-player
                                        style="max-width: 100%;width: 300px;"
                                        src="https://assets10.lottiefiles.com/packages/lf20_rc6CDU.json"
                                        speed="1"
                                        loop="true"
                                        background="transparent"
                                    ></lottie-player>
                                    <h3 class="text-dark fs-6 mt-n3 px-2" style="line-height: 200%;text-align: center;">尚未收到客服訊息。</h3>
                                </div>`}
                            </div>
                        `);
                        return view.join('');
                    } else {
                        return html`<div class="d-flex align-items-center justify-content-center w-100 flex-column pt-3">
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

    public static userMessage(cf: { gvc: GVC; userID: string; toUser: string; width: number; height: number; color: string; hideBar: boolean }) {
        const gvc = cf.gvc;
        const html = String.raw;
        cf.userID = `${cf.userID}`;
        const chatID = [cf.userID, cf.toUser].sort().join('-');
        return gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    return ``;
                },
                divCreate: {
                    elem: 'web-component',
                    option: [
                        {
                            key: 'id',
                            value: id,
                        },
                    ],
                    class: `w-100 h-100`,
                    style: `z-index:9999;bottom:0px;left:0px;`,
                },
                onCreate: async () => {
                    BgCustomerMessage.config.hideBar = cf.hideBar;
                    BgCustomerMessage.config.color = cf.color;
                    await Chat.post({
                        type: 'user',
                        participant: [cf.userID, cf.toUser],
                    });
                    const viewId = gvc.glitter.getUUID();
                    const chatView = html`<div class="w-100 h-100" style="position: relative;">
                        ${BgCustomerMessage.detail({
                            gvc: gvc,
                            chat: {
                                chat_id: chatID,
                                type: 'user',
                            },
                            user_id: cf.userID,
                            containerHeight: `${cf.height}px`,
                            document: (document.querySelector('#' + id)! as any).shadowRoot,
                            goBack: () => {
                                gvc.notifyDataChange(viewId);
                            },
                            close: gvc.glitter.ut.frSize(
                                {
                                    sm: undefined,
                                },
                                () => {
                                    gvc.notifyDataChange(id);
                                }
                            ),
                        })}
                    </div>`;

                    const baseUrl = new URL('../', import.meta.url);
                    (document.querySelector('#' + id)! as any).addStyleLink(baseUrl.href + `assets/css/theme.css`);
                    (document.querySelector('#' + id)! as any).addStyleLink(baseUrl.href + `assets/vendor/boxicons/css/boxicons.min.css`);
                    (document.querySelector('#' + id)! as any).addStyleLink(`https://kit.fontawesome.com/cccedec0f8.css`);
                    (document.querySelector('#' + id)! as any).addStyle(`
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
                    (document.querySelector('#' + id)! as any).setView({
                        gvc: gvc,
                        view: chatView,
                        id: id,
                    });
                },
            };
        });
    }
    public static detail(cf: { gvc: GVC; chat: any; user_id: string; containerHeight: string; document: any; goBack: () => void; close?: () => void }) {
        const gvc = cf.gvc;
        const document = cf.document;
        const html = String.raw;
        return gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    return [
                        gvc.bindView(() => {
                            const id = gvc.glitter.getUUID();
                            return {
                                bind: id,
                                view: () => {
                                    return new Promise(async (resolve, reject) => {
                                        const chatRoom = (
                                            await Chat.getChatRoom({
                                                page: 0,
                                                limit: 1000,
                                                user_id: cf.user_id,
                                                chat_id: cf.chat.chat_id,
                                            })
                                        ).response.data[0];
                                        if (chatRoom.who === 'manager') {
                                            chatRoom.user_data = BgCustomerMessage.config;
                                        }
                                        resolve(html`<div
                                            class="navbar  d-flex align-items-center justify-content-between w-100  p-3 ${BgCustomerMessage.config.hideBar ? `d-none` : ``}"
                                            style="background: ${BgCustomerMessage.config.color};"
                                        >
                                            <div class="d-flex align-items-center pe-3 w-100" style="gap:10px;display: flex;align-items: center;">
                                                <i
                                                    class="fa-solid fa-chevron-left fs-6"
                                                    style="color:white;cursor: pointer;"
                                                    onclick="${gvc.event(() => {
                                                        if (cf.user_id === 'manager') {
                                                            BgCustomerMessage.vm.type = 'list';
                                                            gvc.notifyDataChange(BgCustomerMessage.id);
                                                        } else {
                                                            cf.goBack();
                                                        }
                                                    })}"
                                                ></i>
                                                <img
                                                    src="${chatRoom.type === 'user'
                                                        ? (chatRoom.user_data && chatRoom.user_data.head) ||
                                                          chatRoom.user_data.head_img ||
                                                          'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1704269678588-43.png'
                                                        : `https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1704269678588-43.png`}"
                                                    class="rounded-circle border"
                                                    style="background: white;"
                                                    width="40"
                                                    alt="Albert Flores"
                                                />
                                                <h6 class="mb-0 px-1 text-white">${chatRoom.type === 'user' ? (chatRoom.user_data && chatRoom.user_data.name) || '訪客' : `群組`}</h6>
                                                <div class="flex-fill" style="flex: 1;"></div>
                                                <i
                                                    class="fa-regular fa-circle-xmark text-white fs-3 ${cf.close ? `` : `d-none`}"
                                                    onclick="${gvc.event(() => {
                                                        cf.close && cf.close();
                                                    })}"
                                                ></i>
                                            </div>
                                        </div>`);
                                    });
                                },
                            };
                        }),
                        gvc.bindView(() => {
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
                            } = {
                                data: [],
                                loading: true,
                                scrollToBtn: false,
                                lastScroll: -1,
                                message: '',
                                prefixScroll: 0,
                                last_read: {},
                                close: false,
                            };
                            //chat_id
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

                            const url = new URL((window as any).glitterBackend);

                            let socket: any = undefined;

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
                                            chatID: cf.chat.chat_id,
                                            user_id: cf.user_id,
                                        })
                                    );
                                });
                                let interVal: any = 0;
                                socket.addEventListener('message', function (event: any) {
                                    const data = JSON.parse(event.data);
                                    if (data.type === 'update_read_count') {
                                        vm.last_read = data.data;
                                    } else {
                                        vm.data.push(data);
                                        const element: any = document.querySelector('.chatContainer')!;
                                        const st = element.scrollTop;
                                        const ofs = element.offsetHeight;
                                        const sh = element.scrollHeight;
                                        for (const dd of document.querySelectorAll('.time-mute')) {
                                            dd.remove();
                                        }
                                        document.querySelector(`#message-lines`).innerHTML += BgCustomerMessage.message_line(data, cf, vm.data.length - 1, vm, gvc);
                                        if (st + ofs >= sh - 50) {
                                            element.scrollTop = element.scrollHeight;
                                        }
                                    }
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
                            const html = String.raw;
                            return {
                                bind: viewId,
                                view: () => {
                                    if (vm.loading) {
                                        return String.raw`<div class="d-flex align-items-center justify-content-center w-100 flex-column pt-3">
                                <div class="spinner-border" role="status">
                                    <span class="sr-only"></span>
                                </div>
                                <span class="mt-2">載入中...</span>
                            </div>`;
                                    }
                                    return html` ${gvc.bindView(() => {
                                            return {
                                                bind: messageID,
                                                view: () => {
                                                    return html` <div class="my-auto flex-fill" id=""></div>
                                                        <div class="w-100" id="message-lines">
                                                            ${vm.data
                                                                .map((dd: any, index: number) => {
                                                                    return BgCustomerMessage.message_line(dd, cf, index, vm, gvc);
                                                                })
                                                                .join('')}
                                                        </div>

                                                        ${vm.data.length === 0
                                                            ? html` <div class="w-100 text-center"><div class="badge bg-secondary">尚未展開對話，於下方輸入訊息並傳送。</div></div> `
                                                            : ``}`;
                                                },
                                                divCreate: {
                                                    class: `chatContainer p-3 d-flex flex-column`,
                                                    style: `overflow-y: auto;height: calc(${cf.containerHeight} - 220px);background: white;padding-bottom:80px !important;`,
                                                },
                                                onCreate: () => {
                                                    vm.close = false;
                                                    // 取得要監聽的元素
                                                    let targetElement = document.querySelector('.chatContainer')!;
                                                    if (vm.lastScroll === -1) {
                                                        document.querySelector('.chatContainer')!.scrollTop = document.querySelector('.chatContainer')!.scrollHeight;
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
                                                            console.log(`scrollTop===0`);
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
                                        <div
                                            class="card-footer border-top d-flex align-items-center w-100 border-0 pt-3 pb-3 px-4 position-fixed bottom-0 position-lg-absolute"
                                            style="background: white;"
                                        >
                                            <div class="position-relative w-100 me-2 ">
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
                                                                input.style.height = 'auto'; // 重置高度
                                                                input.style.height = input.scrollHeight + 'px'; // 设置为内容高度
                                                            });
                                                        },
                                                    };
                                                })}
                                            </div>
                                            <button
                                                type="button"
                                                class="btn btn-icon btn-lg  d-sm-inline-flex ms-1"
                                                style="height: 36px;background: ${BgCustomerMessage.config.color};"
                                                onclick="${gvc.event(() => {
                                                    if (vm.message) {
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
                                                })}"
                                            >
                                                <i class="fa-regular fa-paper-plane-top"></i>
                                            </button>
                                        </div>`;
                                },
                                divCreate: {},
                                onCreate: () => {},
                                onDestroy: () => {
                                    vm.close = true;
                                    socket.close();
                                },
                            };
                        }),
                    ].join('');
                },
            };
        });
    }
    public static message_line(dd: any, cf: any, index: number, vm: any, gvc: GVC) {
        const html = String.raw;
        if (dd.user_id == 'manager') {
            dd.user_data = BgCustomerMessage.config;
        }
        if (cf.user_id !== dd.user_id) {
            return html` <div class="mt-auto d-flex align-items-start ${vm.data[index + 1] && vm.data[index + 1].user_id === dd.user_id ? `mb-1` : `mb-3`}">
                <img
                    src="${(dd.user_data && dd.user_data.head) || `https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1704269678588-43.png`}"
                    class="rounded-circle border"
                    width="40"
                    alt="Albert Flores"
                />
                <div class="ps-2 ms-1" style="max-width: 348px;">
                    <div class="p-3 mb-1" style="background:#eeeef1;border-top-right-radius: .5rem; border-bottom-right-radius: .5rem; border-bottom-left-radius: .5rem;white-space: normal;">
                        ${dd.message.text.replace(/\n/g, '<br>')}
                    </div>
                    <div class="fs-sm text-muted ${vm.data[index + 1] && vm.data[index + 1].user_id === dd.user_id ? `d-none` : ``}">
                        ${gvc.glitter.ut.dateFormat(new Date(dd.created_time), 'MM-dd hh:mm')}
                    </div>
                </div>
            </div>`;
        } else {
            return html` <div class="d-flex align-items-start justify-content-end ${vm.data[index + 1] && vm.data[index + 1].user_id === dd.user_id ? `mb-1` : `mb-3`}">
                <div class="pe-2 me-1" style="max-width: 348px;">
                    <div
                        class=" text-light p-3 mb-1"
                        style="background:${BgCustomerMessage.config.color};border-top-left-radius: .5rem; border-bottom-right-radius: .5rem; border-bottom-left-radius: .5rem;white-space: normal;"
                    >
                        ${dd.message.text.replace(/\n/g, '<br>')}
                    </div>
                    <div
                        class="time-mute fw-500 d-flex justify-content-end align-items-center fs-sm text-muted ${vm.data[index + 1] && vm.data[index + 1].user_id === dd.user_id ? `d-none` : ``}"
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
                <img
                    src="${(dd.user_data && dd.user_data.head) || `https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1704269678588-43.png`}"
                    class="rounded-circle border"
                    width="40"
                    alt="Albert Flores"
                />
            </div>`;
        }
    }
}

(window as any).glitter.setModule(import.meta.url, BgCustomerMessage);
