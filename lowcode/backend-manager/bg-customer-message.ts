import {GVC} from '../glitterBundle/GVController.js';
import {Chat} from '../glitter-base/route/chat.js';
import {EditorElem} from '../glitterBundle/plugins/editor-elem.js';
import {ApiUser} from '../glitter-base/route/user.js';
import {FormWidget} from '../official_view_component/official/form.js';
import {ShareDialog} from '../glitterBundle/dialog/ShareDialog.js';
import {BgWidget} from './bg-widget.js';
import {CustomerMessageUser} from '../cms-plugin/customer-message-user.js';

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
        return html`
            <div id="BgCustomerMessageHover" class="d-none position-fixed vw-100 vh-100"
                 style="background: rgba(0,0,0,0.5);z-index: 99999;" onclick="${gvc.event(() => {
                BgCustomerMessage.toggle(false, gvc)
            })}"></div>
            <div id="BgCustomerMessage" class="position-fixed left-0 top-0 h-100 bg-white shadow-lg "
                 style="width:480px;max-width:100vw; z-index: 99999; right: -125%;background: rgba(0,0,0,0.5);">
                ${BgCustomerMessage.view(gvc)}
            </div>`;
    }

    public static view(gvc: GVC) {
        return gvc.bindView(() => {
            const html = String.raw;
            const vm = BgCustomerMessage.vm;
            gvc.addStyle(`
                            .btn-white-primary {
                                border: 2px solid #ffb400;;
                                justify-content: space-between;
                                align-items: center;
                                cursor: pointer;
                                color: #ffb400;
                                gap: 10px;
                            }

                            .btn-white-primary:hover {
                                background: #ffb400;
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
            return {
                bind: BgCustomerMessage.id,
                view: () => {


                    if (!BgCustomerMessage.visible) {
                        return html`
                            <div class="d-flex align-items-center justify-content-center w-100 flex-column pt-3">
                                <div class="spinner-border" role="status">
                                    <span class="sr-only"></span>
                                </div>
                                <span class="mt-2">載入中...</span>
                            </div>`;
                    }
                    if (vm.type === 'detail') {
                        return html`
                            <div style="padding-bottom: 70px;">
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
                            ` <div class="navbar  d-flex align-items-center justify-content-between w-100  p-3 "
                     style="background: linear-gradient(135deg, var(--main-orange) 0%, #ff6c02 100%);">
                    <div class="d-flex align-items-center pe-3 w-100"
                         style="gap:10px;display: flex;align-items: center;">
                        <img src="https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/size1440_s*px$_sas0s9s0s1sesas0_1697354801736-Glitterlogo.png"
                             class="rounded-circle border"
                             style="background: white;border-radius: 50%;width: 40px;height: 40px;" width="40"
                             alt="Albert Flores">
                        <div class="d-flex flex-column px-1 text-white">
                            <h6 class="mb-0 text-white d-flex">客服訊息</h6>
                            <span class="fw-500 d-none" style="font-size:13px;">剩餘代幣:10</span>
                        </div>
                        <div class="flex-fill" style="flex: 1;"></div>
                        <i class="fa-regular fa-circle-xmark text-white fs-3 " aria-hidden="true"
                           onclick="${gvc.event(() => {
                                BgCustomerMessage.toggle(false, gvc)
                            })}"></i>
                    </div>
                </div>`,
                            html`
                                <div class="d-flex align-items-center p-2 shadow border-bottom" style="gap:10px;">
                                    ${(() => {
                                        const list = [
                                            {
                                                key: 'list',
                                                label: '訊息列表',
                                            },
                                            {
                                                key: 'setting',
                                                label: '客服設定',
                                            },
                                            // {
                                            //     key: 'preview',
                                            //     label: '預覽樣式',
                                            // },
                                        ];
                                        return list
                                                .map((dd) => {
                                                    if (BgCustomerMessage.vm.select_bt === dd.key) {
                                                        return html`
                                                            <div class="d-flex align-items-center justify-content-center fw-bold px-3 py-2 fw-500 select-label-ai-message">
                                                                ${dd.label}
                                                            </div>`;
                                                    } else {
                                                        return html`
                                                            <div
                                                                    class="d-flex align-items-center justify-content-center fw-bold  px-3 py-2 fw-500 select-btn-ai-message"
                                                                    onclick="${gvc.event(() => {
                                                                        BgCustomerMessage.vm.select_bt = dd.key as any;
                                                                        gvc.notifyDataChange(BgCustomerMessage.id);
                                                                    })}"
                                                            >
                                                                ${dd.label}
                                                            </div>`;
                                                    }
                                                })
                                                .join('');
                                    })()}
                                </div>`
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
                                            class: `p-2`,style:``
                                        },
                                    };
                                })
                            );
                        } else if (BgCustomerMessage.vm.select_bt === 'preview') {
                            return `<div class="w-100 vh-100">${
                                CustomerMessageUser.showCustomerMessage({
                                    gvc: gvc,
                                    userID: 'preview',
                                    open: true,
                                    type: 'preview',
                                })
                            }</div>`
                        } else if (BgCustomerMessage.vm.select_bt === 'setting') {
                            view.push(
                                gvc.bindView(() => {
                                    const html = String.raw;
                                    const vO: {
                                        id: string,
                                        loading: boolean,
                                        data: any
                                    } = {
                                        id: gvc.glitter.getUUID(),
                                        loading: false,
                                        data: {}
                                    }
                                    const keyData = (ApiUser.getPublicConfig(`message_setting`, 'manager')).then((res) => {
                                        vO.data = res.response.value;
                                        gvc.notifyDataChange(vO.id)
                                    });
                                    return {
                                        bind: vO.id,
                                        view: () => {
                                            if (vO.loading) {
                                                return BgWidget.spinner()
                                            }
                                            const keyData = vO.data
                                            keyData.color = keyData.color ?? '#FE5541';
                                            const dialog = new ShareDialog(gvc.glitter);
                                            const vm = {
                                                message_setting: keyData,
                                                robot_setting: undefined,
                                            };

                                            async function save() {
                                                dialog.dataLoading({visible: true});
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
                                                dialog.dataLoading({visible: false});
                                                dialog.successMessage({text: '設定成功!'});
                                            }

                                            const view = [
                                                html`
                                                    <div class="position-relative bgf6 d-flex align-items-center justify-content-between m-n2 p-2 border-bottom shadow">
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
                                                            html`
                                                                <div class="mb-3"
                                                                     style="display:flex; align-items: center; gap: 4px; margin-bottom: 8px;">
                                                                    <div class="fw-500"
                                                                         style="color: #393939;font-size: 15px;">啟用客服功能
                                                                    </div>
                                                                    ${BgWidget.switchButton(gvc, keyData.toggle, (bool) => {
                                                                        keyData.toggle = bool;
                                                                    })}
                                                                </div>`,
                                                            BgWidget.editeInput({
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
                                                            EditorElem.colorSelect({
                                                                gvc: gvc,
                                                                title: '設定主色調',
                                                                def: keyData.color,
                                                                callback: (text) => {
                                                                    keyData.color = text;
                                                                    gvc.notifyDataChange(vO.id)
                                                                },
                                                            }),
                                                            BgWidget.editeInput({
                                                                gvc: gvc,
                                                                title: '置頂標題',
                                                                placeHolder: `請輸入置頂標題`,
                                                                default: keyData.title,
                                                                callback: (text) => {
                                                                    keyData.title = text;
                                                                },
                                                            }),
                                                            BgWidget.textArea({
                                                                gvc: gvc,
                                                                title: '置頂內文',
                                                                placeHolder: `請輸入置頂內文`,
                                                                default: keyData.content,
                                                                callback: (text) => {
                                                                    keyData.content = text;
                                                                },
                                                            }),
                                                        ].join(`<div class="my-2"></div>`)}
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
                                                                keyData.question = keyData.question ?? []
                                                                const parId = gvc.glitter.getUUID()
                                                                const id = gvc.glitter.getUUID()
                                                                function refresh(){
                                                                    gvc.notifyDataChange(id)
                                                                }
                                                                resolve(html`
                                                                    <div class="position-relative bgf6 d-flex align-items-center justify-content-between mx-n2 p-2 py-3 border-top border-bottom mt-2 shadow">
                                                                        <span class="fs-6 fw-bold "
                                                                              style="color:black;">自動回覆</span>
                                                                    </div>
                                                                    <div style="" class="p-2">
                                                                        ${gvc.bindView(() => {
                                                                            return {
                                                                                bind: id,
                                                                                view: () => {
                                                                                    return (keyData.question || []).map((d2: any, index: number) => {
                                                                                        return html`
                                                                                            <li onclick="${gvc.event(() => {
                                                                                                const copy = JSON.parse(JSON.stringify(d2))
                                                                                                BgWidget.settingDialog({
                                                                                                    gvc: gvc,
                                                                                                    title: '設定問答',
                                                                                                    innerHTML: (gvc) => {
                                                                                                        return [BgWidget.editeInput({
                                                                                                            gvc: gvc,
                                                                                                            title: '問題',
                                                                                                            placeHolder: `請輸入問題`,
                                                                                                            default: copy.ask,
                                                                                                            callback: (text) => {
                                                                                                                copy.ask = text;
                                                                                                            },
                                                                                                        }), BgWidget.textArea({
                                                                                                            gvc: gvc,
                                                                                                            title: '回答',
                                                                                                            placeHolder: `請輸入回答`,
                                                                                                            default: copy.response,
                                                                                                            callback: (text) => {
                                                                                                                copy.response = text;
                                                                                                            },
                                                                                                        })].map((dd)=>{
                                                                                                            return `<div>${dd}</div>`
                                                                                                        }).join('')
                                                                                                    },
                                                                                                    footer_html: (gvc) => {
                                                                                                        return [
                                                                                                            BgWidget.cancel(gvc.event(() => {
                                                                                                                gvc.closeDialog()
                                                                                                            })),
                                                                                                            BgWidget.save(gvc.event(() => {
                                                                                                                keyData.question[index] = copy
                                                                                                                refresh()
                                                                                                                gvc.closeDialog()
                                                                                                            }))
                                                                                                        ].join(``)
                                                                                                    }
                                                                                                })
                                                                                            })}">
                                                                                                <div class="w-100 fw-500 d-flex align-items-center  fs-6 hoverBtn h_item  rounded px-2 hoverF2 mb-1 subComponentGuide"
                                                                                                     style="gap:5px;color:#393939;">
                                                                                                    <div class=" p-1 dragItem ">
                                                                                                        <i class="fa-solid fa-grip-dots-vertical d-flex align-items-center justify-content-center  "
                                                                                                           style="width:15px;height:15px;"
                                                                                                           aria-hidden="true"></i>
                                                                                                    </div>
                                                                                                    <span>${d2.ask}</span>
                                                                                                    <div class="flex-fill"></div>
                                                                                                    <div class="hoverBtn p-1 child"
                                                                                                         onclick="${gvc.event((e, event) => {
                                                                                                             event.stopPropagation();
                                                                                                             event.preventDefault();
                                                                                                             dialog.checkYesOrNot({
                                                                                                                 text: '是否確認移除問答?',
                                                                                                                 callback: (response) => {
                                                                                                                     if (response) {
                                                                                                                         keyData.question.splice(index, 1)
                                                                                                                         gvc.notifyDataChange(id)
                                                                                                                     }
                                                                                                                 }
                                                                                                             })
                                                                                                         })}">
                                                                                                        <i class="fa-regular fa-trash d-flex align-items-center justify-content-center "
                                                                                                           aria-hidden="true"></i>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </li>`
                                                                                    }).join('')
                                                                                },
                                                                                divCreate: {
                                                                                    class: `mx-n2`,
                                                                                    elem: 'ul',
                                                                                    option: [{key: 'id', value: parId}],
                                                                                },
                                                                                onCreate: () => {
                                                                                    gvc.glitter.addMtScript(
                                                                                            [
                                                                                                {
                                                                                                    src: `https://raw.githack.com/SortableJS/Sortable/master/Sortable.js`,
                                                                                                },
                                                                                            ],
                                                                                            () => {
                                                                                                const interval = setInterval(() => {
                                                                                                    if ((window as any).Sortable) {
                                                                                                        try {
                                                                                                            gvc.addStyle(`
                                    ul {
                                        list-style: none;
                                        padding: 0;
                                    }
                                `);

                                                                                                            function swapArr(arr: any, index1: number, index2: number) {
                                                                                                                const data = arr[index1];
                                                                                                                arr.splice(index1, 1);
                                                                                                                arr.splice(index2, 0, data);
                                                                                                            }

                                                                                                            let startIndex = 0;
                                                                                                            //@ts-ignore
                                                                                                            Sortable.create(gvc.glitter.document.getElementById(parId), {
                                                                                                                handle: '.dragItem',
                                                                                                                group: gvc.glitter.getUUID(),

                                                                                                                animation: 100,
                                                                                                                onChange: function (evt: any) {
                                                                                                                    swapArr(keyData.question, startIndex, evt.newIndex);
                                                                                                                    const newIndex = evt.newIndex
                                                                                                                    startIndex = newIndex
                                                                                                                },
                                                                                                                onEnd: (evt: any) => {

                                                                                                                },
                                                                                                                onStart: function (evt: any) {
                                                                                                                    startIndex = evt.oldIndex;
                                                                                                                },
                                                                                                            });
                                                                                                        } catch (e) {
                                                                                                        }
                                                                                                        clearInterval(interval);
                                                                                                    }
                                                                                                }, 100);
                                                                                            },
                                                                                            () => {
                                                                                            }
                                                                                    );
                                                                                }
                                                                            }
                                                                        })}
                                                                        <div class="w-100" style="justify-content: center; align-items: center; gap: 4px; display: flex;color: #3366BB;cursor: pointer;" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                                                                             onclick="${gvc.event(() => {
                                                                                 const copy={ask:'',response:''}
                                                                                 BgWidget.settingDialog({
                                                                                     gvc: gvc,
                                                                                     title: '設定問答',
                                                                                     innerHTML: (gvc) => {
                                                                                         return [BgWidget.editeInput({
                                                                                             gvc: gvc,
                                                                                             title: '問題',
                                                                                             placeHolder: `請輸入問題`,
                                                                                             default: copy.ask,
                                                                                             callback: (text) => {
                                                                                                 copy.ask = text;
                                                                                             },
                                                                                         }), BgWidget.textArea({
                                                                                             gvc: gvc,
                                                                                             title: '回答',
                                                                                             placeHolder: `請輸入回答`,
                                                                                             default: copy.response,
                                                                                             callback: (text) => {
                                                                                                 copy.response = text;
                                                                                             },
                                                                                         })].map((dd)=>{
                                                                                             return `<div>${dd}</div>`
                                                                                         }).join('')
                                                                                     },
                                                                                     footer_html: (gvc) => {
                                                                                         return [
                                                                                             BgWidget.cancel(gvc.event(() => {
                                                                                                 gvc.closeDialog()
                                                                                             })),
                                                                                             BgWidget.save(gvc.event(() => {
                                                                                                 if(!copy.ask || !copy.response){
                                                                                                     dialog.errorMessage({text:'內容不得為空'})
                                                                                                     return
                                                                                                 }
                                                                                                 keyData.question.push(copy) 
                                                                                                 refresh()
                                                                                                 gvc.closeDialog()
                                                                                             }))
                                                                                         ].join(``)
                                                                                     }
                                                                                 })
                                                                             })}">
                                                                            <div style="font-size: 16px; font-family: Noto Sans; font-weight: 400; word-wrap: break-word">新增一則回覆</div>
                                                                            <i class="fa-solid fa-plus" aria-hidden="true"></i>
                                                                        </div>
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
                                            return view.join('')
                                        },
                                        divCreate: {
                                            class: `p-2`,style:`height: calc(100vh - 132px);overflow-y:auto;`
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
                                    <input type="text" class="form-control pe-5" placeholder="搜尋用戶"/>
                                    <i class="bx bx-search fs-xl text-nav position-absolute top-50 end-0 translate-middle-y me-3"></i>
                                </div>
                            </div>
                            <div style="max-height: calc(100vh - 180px);overflow-y: auto;">
                                ${chatData
                                        .filter((dd: any) => {
                                            return !['manager-operation_guide', 'manager-order_analysis', 'manager-writer'].includes(dd.chat_id)
                                        }).map((dd: any) => {
                                            if (dd.topMessage && dd.chat_id !== 'manager-preview') {
                                                const unReadCount = unRead.filter((d2: any) => {
                                                    return dd.chat_id === d2.chat_id;
                                                }).length;
                                                if (dd.chat_id){
                                                    if (dd.chat_id.startsWith('line')){
                                                        dd.user_data.head = dd.info.line.head;
                                                        dd.user_data.name = dd.info.line.name;
                                                    }
                                                    let head = (dd.user_data && dd.user_data.head) || `https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1704269678588-43.png`;
                                                    let name = (dd.user_data && dd.user_data.name) || `訪客`
                                                    
                                                    return html`<a
                                                            class="d-flex align-items-center border-bottom text-decoration-none bg-faded-primary-hover py-3 px-4"
                                                            style="cursor: pointer;"
                                                            onclick="${gvc.event(() => {
                                                        callback(dd);
                                                    })}"
                                                    >
                                                        <div class="rounded-circle position-relative "
                                                             style="width: 40px;height: 40px;">
                                                            <div
                                                                    class="rounded-circle text-white bg-danger ${unReadCount ? `` : `d-none`} fw-500 d-flex align-items-center justify-content-center me-2"
                                                                    style="min-width:18px !important;height: 18px !important;position: absolute;right: -15px;top:-5px;font-size:11px;"
                                                            >
                                                                ${unReadCount}
                                                            </div>
                                                            <img
                                                                    src="${head}"
                                                                    class="rounded-circle ${dd.chat_id.startsWith('line')?'':'border'}"
                                                                    style="border-radius: 50%;${dd.chat_id.startsWith('line')?'border:1px solid green':''}"
                                                                    width="40"
                                                                    alt="Devon Lane"
                                                            />
                                                            ${(()=>{
                                                        let id:string = dd.chat_id
                                                        if (id.startsWith('line')){
                                                            return `<i class="fa-brands fa-line bg-white rounded" style="position:absolute;right:0;bottom:0;color:green;"></i>`
                                                        }
                                                        return ``
                                                    })()}
                                                        </div>

                                                        <div class="w-100 ps-2 ms-1">
                                                            <div class="d-flex align-items-center justify-content-between mb-1">
                                                                <h6 class="mb-0 me-2">
                                                                    ${name}</h6>
                                                                <span class="fs-xs  fw-500 text-muted">${gvc.glitter.ut.dateFormat(new Date(dd.topMessage.created_time), 'MM-dd hh:mm')}</span>
                                                            </div>
                                                            <p class="fs-sm  mb-0 "
                                                               style="white-space: normal;${unReadCount ? `color:black;` : `color:#585c7b !important;`}">
                                                                ${(dd.topMessage ? dd.topMessage.text : ``).length > 50
                                                            ? (dd.topMessage ? dd.topMessage.text : ``).substring(0, 50) + '.....'
                                                            : dd.topMessage
                                                                    ? dd.topMessage.text
                                                                    : ``}
                                                            </p>
                                                        </div>
                                                    </a>`;
                                                }
                                                    
                                            } else {
                                                return ``;
                                            }
                                        })
                                        .join('') ||
                                html`
                                    <div class="d-flex align-items-center justify-content-center flex-column w-100"
                                         style="width:700px;">
                                        <lottie-player
                                                style="max-width: 100%;width: 300px;"
                                                src="https://assets10.lottiefiles.com/packages/lf20_rc6CDU.json"
                                                speed="1"
                                                loop="true"
                                                background="transparent"
                                        ></lottie-player>
                                        <h3 class="text-dark fs-6 mt-n3 px-2"
                                            style="line-height: 200%;text-align: center;">尚未收到任何訊息</h3>
                                    </div>`}
                            </div>
                        `);
                        return view.join('');
                    } else {
                        return html`
                            <div class="d-flex align-items-center justify-content-center w-100 flex-column pt-3">
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

    public static userMessage(cf: {
        gvc: GVC;
        userID: string;
        toUser: string;
        width: number;
        height: number;
        color: string;
        hideBar: boolean
    }) {
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
                    const chatView = html`
                        <div class="w-100 h-100" style="position: relative;">
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

    public static detail(cf: {
        gvc: GVC;
        chat: any;
        user_id: string;
        containerHeight: string;
        document: any;
        goBack: () => void;
        close?: () => void
    }) {
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

                                        if (chatRoom.chat_id.startsWith('line')){
                                            chatRoom.user_data.head = chatRoom.info.line?.head;
                                            chatRoom.user_data.name = chatRoom.info.line?.name;
                                        }
                                        resolve(html`
                                            <div
                                                    class="navbar  d-flex align-items-center justify-content-between w-100  p-3 ${BgCustomerMessage.config.hideBar ? `d-none` : ``}"
                                                    style="background: ${BgCustomerMessage.config.color};"
                                            >
                                                <div class="d-flex align-items-center pe-3 w-100"
                                                     style="gap:10px;display: flex;align-items: center;">
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
                                                    <h6 class="mb-0 px-1 text-white">
                                                        ${chatRoom.type === 'user' ? (chatRoom.user_data && chatRoom.user_data.name) || '訪客' : `群組`}</h6>
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
                                            app_name: (window as any).appName
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
                                                return html`
                                                    <div class="my-auto flex-fill" id=""></div>
                                                    <div class="w-100" id="message-lines">
                                                        ${vm.data
                                                                .map((dd: any, index: number) => {
                                                                    return BgCustomerMessage.message_line(dd, cf, index, vm, gvc);
                                                                })
                                                                .join('')}
                                                    </div>

                                                    ${vm.data.length === 0
                                                            ? html`
                                                                <div class="w-100 text-center">
                                                                    <div class="badge bg-secondary">
                                                                        尚未展開對話，於下方輸入訊息並傳送。
                                                                    </div>
                                                                </div> `
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
                                                            {key: 'placeholder', value: '輸入訊息內容22'},
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
                                onCreate: () => {
                                },
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
            return html`
                <div class="mt-auto d-flex align-items-start ${vm.data[index + 1] && vm.data[index + 1].user_id === dd.user_id ? `mb-1` : `mb-3`}">
                    <img
                            src="${(dd.user_data && dd.user_data.head) || `https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1704269678588-43.png`}"
                            class="rounded-circle border"
                            width="40"
                            alt="Albert Flores"
                    />
                    <div class="ps-2 ms-1" style="max-width: 348px;">
                        <div class="p-3 mb-1"
                             style="background:#eeeef1;border-top-right-radius: .5rem; border-bottom-right-radius: .5rem; border-bottom-left-radius: .5rem;white-space: normal;">
                            ${dd.message.text.replace(/\n/g, '<br>')}
                        </div>
                        <div class="fs-sm text-muted ${vm.data[index + 1] && vm.data[index + 1].user_id === dd.user_id ? `d-none` : ``}">
                            ${gvc.glitter.ut.dateFormat(new Date(dd.created_time), 'MM-dd hh:mm')}
                        </div>
                    </div>
                </div>`;
        } else {
            return html`
                <div class="d-flex align-items-start justify-content-end ${vm.data[index + 1] && vm.data[index + 1].user_id === dd.user_id ? `mb-1` : `mb-3`}">
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
