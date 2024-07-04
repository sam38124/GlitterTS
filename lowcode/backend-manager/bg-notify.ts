import { GVC } from '../glitterBundle/GVController.js';
import { BgShopping } from './bg-shopping.js';
import { BgWidget } from './bg-widget.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { ShareDialog } from '../dialog/ShareDialog.js';
import { ApiShop } from '../glitter-base/route/shopping.js';
import { ApiPost } from '../glitter-base/route/post.js';
import { GlobalUser } from '../glitter-base/global/global-user.js';
import { ApiSmtp } from '../glitter-base/route/smtp.js';
import { ApiFcm } from '../glitter-base/route/fcm.js';
import { FormWidget } from '../official_view_component/official/form.js';
import { Chat } from '../glitter-base/route/chat.js';
import { component } from '../official_view_component/official/component.js';
import { PublicConfig } from '../glitter-base/route/public-config.js';

const html = String.raw;

export class BgNotify {
    public static email(gvc: GVC, type: 'list' | 'select' = 'list', callback: (select: any) => void = () => {}) {
        const vm: {
            type: 'list' | 'replace';
            data: any;
            dataList: any;
            query?: string;
        } = {
            type: 'list',
            data: {
                id: 61,
                userID: 549313940,
                account: 'jianzhi.wang@homee.ai',
                userData: { name: '王建智', email: 'jianzhi.wang@homee.ai', phone: '0978028739' },
                created_time: '2023-11-26T02:14:09.000Z',
                role: 0,
                company: null,
                status: 1,
            },
            dataList: undefined,
            query: '',
        };
        const glitter = gvc.glitter;
        const filterID = glitter.getUUID();
        const id = glitter.getUUID();
        const dialog = new ShareDialog(gvc.glitter);
        return gvc.bindView(() => {
            return {
                bind: id,
                view: () => {
                    let vmi: any = undefined;

                    function getDatalist() {
                        let interval: any = 0;
                        return vm.dataList.map((dd: any) => {
                            return [
                                {
                                    key: (() => {
                                        clearInterval(interval);
                                        if (
                                            !vm.dataList.find((dd: any) => {
                                                return !dd.checked;
                                            })
                                        ) {
                                            interval = setTimeout(() => {
                                                ApiUser.getSubScribe({
                                                    page: vmi.page - 1,
                                                    limit: 100000,
                                                    search: vm.query || undefined,
                                                }).then((data) => {
                                                    callback(data.response.data);
                                                });
                                            }, 10);
                                        }

                                        return EditorElem.checkBoxOnly({
                                            gvc: gvc,
                                            def: !vm.dataList.find((dd: any) => {
                                                return !dd.checked;
                                            }),
                                            callback: (result) => {
                                                vm.dataList.map((dd: any) => {
                                                    dd.checked = result;
                                                });
                                                vmi.data = getDatalist();
                                                vmi.callback();
                                                gvc.notifyDataChange(filterID);
                                                callback(
                                                    vm.dataList.filter((dd: any) => {
                                                        return dd.checked;
                                                    })
                                                );
                                            },
                                        });
                                    })(),
                                    value: EditorElem.checkBoxOnly({
                                        gvc: gvc,
                                        def: dd.checked,
                                        callback: (result) => {
                                            dd.checked = result;
                                            vmi.data = getDatalist();
                                            vmi.callback();
                                            gvc.notifyDataChange(filterID);
                                            callback(
                                                vm.dataList.filter((dd: any) => {
                                                    return dd.checked;
                                                })
                                            );
                                        },
                                        style: 'height:25px;',
                                    }),
                                },
                                {
                                    key: '註冊信箱',
                                    value: `<span class="fs-7">${dd.email}</span>`,
                                },
                                {
                                    key: '訂閱標籤',
                                    value: `<span class="fs-7">${dd.tag}</span>`,
                                },
                            ];
                        });
                    }

                    return BgWidget.container(
                        html`
                            <div class="d-flex w-100 align-items-center ${type === 'select' ? `d-none` : ``}">
                                ${BgWidget.title('已註冊信箱')}
                                <div class="flex-fill"></div>
                                ${BgWidget.darkButton(
                                    '新增推播信箱',
                                    gvc.event(() => {
                                        gvc.glitter.innerDialog((gvc2) => {
                                            let mail = '';
                                            let tag = '';
                                            return html`<div class="modal-content bg-white rounded-3 p-2" style="max-width:90%;width:400px;">
                                                <div class="border-bottom ms-1 my-2 pb-2">
                                                    <span class="tx_700">新增推播信箱</span>
                                                </div>
                                                <div class="">
                                                    <div class="ps-1 pe-1">
                                                        <div class="mb-3">
                                                            <label for="username" class="form-label">信箱</label>
                                                            <input
                                                                class="form-control"
                                                                type="text"
                                                                id="userName"
                                                                required=""
                                                                placeholder="請輸入推播信箱"
                                                                onchange="${gvc.event((e, event) => {
                                                                    mail = e.value;
                                                                })}"
                                                            />
                                                        </div>
                                                        <div class="mb-3">
                                                            <label for="username" class="form-label">標籤</label>
                                                            <input
                                                                class="form-control"
                                                                type="text"
                                                                id="userName"
                                                                required=""
                                                                placeholder="請輸入註冊標籤"
                                                                onchange="${gvc.event((e, event) => {
                                                                    tag = e.value;
                                                                })}"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div class="modal-footer mb-0 pb-0">
                                                        <button
                                                            type="button"
                                                            class="btn btn-outline-dark me-2"
                                                            onclick="${gvc.event(() => {
                                                                gvc2.closeDialog();
                                                            })}"
                                                        >
                                                            取消
                                                        </button>
                                                        <button
                                                            type="button"
                                                            class="btn btn-primary-c"
                                                            onclick="${gvc.event(() => {
                                                                dialog.dataLoading({ visible: true });
                                                                ApiUser.subScribe(mail, tag).then((response) => {
                                                                    dialog.dataLoading({ visible: false });
                                                                    if (!response.result) {
                                                                        dialog.errorMessage({ text: '伺服器錯誤!' });
                                                                    } else {
                                                                        dialog.successMessage({ text: '更新成功!' });
                                                                        gvc.notifyDataChange(id);
                                                                        gvc2.closeDialog();
                                                                    }
                                                                });
                                                            })}"
                                                        >
                                                            確認添加
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>`;
                                        }, 'add');
                                    })
                                )}
                            </div>
                            ${BgWidget.container(
                                BgWidget.mainCard(
                                    BgWidget.tableV2({
                                        gvc: gvc,
                                        getData: (vmk) => {
                                            vmi = vmk;
                                            ApiUser.getSubScribe({
                                                page: vmi.page - 1,
                                                limit: 20,
                                                search: vm.query || undefined,
                                            }).then((data) => {
                                                vmi.pageSize = Math.ceil(data.response.total / 20);
                                                vm.dataList = data.response.data;
                                                vmi.data = getDatalist();
                                                vmi.loading = false;
                                                vmi.callback();
                                                if (type === 'select') {
                                                    callback(
                                                        vm.dataList.filter((dd: any) => {
                                                            return dd.checked;
                                                        })
                                                    );
                                                }
                                            });
                                        },
                                        rowClick: (data, index) => {
                                            vm.dataList[index].checked = !vm.dataList[index].checked;
                                            vmi.data = getDatalist();
                                            vmi.callback();
                                            gvc.notifyDataChange(filterID);
                                            callback(
                                                vm.dataList.filter((dd: any) => {
                                                    return dd.checked;
                                                })
                                            );
                                        },
                                        filter: html`
                                            ${BgWidget.searchPlace(
                                                gvc.event((e, event) => {
                                                    vm.query = e.value;
                                                    gvc.notifyDataChange(id);
                                                }),
                                                vm.query || '',
                                                '搜尋信箱或者標籤'
                                            )}
                                            ${gvc.bindView(() => {
                                                return {
                                                    bind: filterID,
                                                    view: () => {
                                                        if (
                                                            !vm.dataList ||
                                                            !vm.dataList.find((dd: any) => {
                                                                return dd.checked;
                                                            })
                                                        ) {
                                                            return ``;
                                                        } else {
                                                            return [
                                                                html`<span class="fs-7 fw-bold">操作選項</span>`,
                                                                html`<button
                                                                    class="btn btn-danger fs-7 px-2"
                                                                    style="height:30px;border:none;"
                                                                    onclick="${gvc.event(() => {
                                                                        const dialog = new ShareDialog(gvc.glitter);
                                                                        dialog.checkYesOrNot({
                                                                            text: '是否確認移除所選項目?',
                                                                            callback: (response) => {
                                                                                if (response) {
                                                                                    dialog.dataLoading({ visible: true });
                                                                                    ApiUser.deleteSubscribe({
                                                                                        email: vm.dataList
                                                                                            .filter((dd: any) => {
                                                                                                return dd.checked;
                                                                                            })
                                                                                            .map((dd: any) => {
                                                                                                return dd.email;
                                                                                            })
                                                                                            .join(`,`),
                                                                                    }).then((res) => {
                                                                                        dialog.dataLoading({ visible: false });
                                                                                        if (res.result) {
                                                                                            vm.dataList = undefined;
                                                                                            gvc.notifyDataChange(id);
                                                                                        } else {
                                                                                            dialog.errorMessage({ text: '刪除失敗' });
                                                                                        }
                                                                                    });
                                                                                }
                                                                            },
                                                                        });
                                                                    })}"
                                                                >
                                                                    批量移除
                                                                </button>`,
                                                            ].join(``);
                                                        }
                                                    },
                                                    divCreate: () => {
                                                        return {
                                                            class: `d-flex align-items-center p-2 py-3 ${
                                                                !vm.dataList ||
                                                                !vm.dataList.find((dd: any) => {
                                                                    return dd.checked;
                                                                }) ||
                                                                type === 'select'
                                                                    ? `d-none`
                                                                    : ``
                                                            }`,
                                                            style: `height:40px;gap:10px;margin-top:10px;`,
                                                        };
                                                    },
                                                };
                                            })}
                                        `,
                                    })
                                )
                            )}
                        `,
                        BgWidget.getContainerWidth()
                    );
                },
                divCreate: {
                    class: type === 'select' ? `m-n4` : ``,
                },
            };
        });
    }

    public static emailSetting(gvc: GVC) {
        const glitter = gvc.glitter;
        const vm: {
            type: 'list' | 'add' | 'replace';
            data: any;
            dataList: any;
            query?: string;
        } = {
            type: 'list',
            data: undefined,
            dataList: undefined,
            query: undefined,
        };
        return gvc.bindView(() => {
            const id = glitter.getUUID();
            const filterID = glitter.getUUID();
            return {
                bind: id,
                dataList: [{ obj: vm, key: 'type' }],
                view: () => {
                    if (vm.type === 'list') {
                        return BgWidget.container(
                            html`
                                <div class="d-flex w-100 align-items-center mb-3">
                                    ${BgWidget.title('信件設定')}
                                    <div class="flex-fill"></div>
                                    ${BgWidget.darkButton(
                                        '新增信件',
                                        gvc.event(() => {
                                            vm.data = undefined;
                                            vm.type = 'add';
                                        })
                                    )}
                                </div>
                                ${BgWidget.container(
                                    BgWidget.mainCard(
                                        BgWidget.tableV2({
                                            gvc: gvc,
                                            getData: (vmi) => {
                                                ApiPost.getManagerPost({
                                                    page: vmi.page - 1,
                                                    limit: 20,
                                                    search: vm.query ? [`title->${vm.query}`] : undefined,
                                                    type: 'notify-email-config',
                                                }).then((data) => {
                                                    vmi.pageSize = Math.ceil(data.response.total / 20);
                                                    vm.dataList = data.response.data;

                                                    function getDatalist() {
                                                        return data.response.data.map((dd: any) => {
                                                            return [
                                                                {
                                                                    key: EditorElem.checkBoxOnly({
                                                                        gvc: gvc,
                                                                        def: !data.response.data.find((dd: any) => {
                                                                            return !dd.checked;
                                                                        }),
                                                                        callback: (result) => {
                                                                            data.response.data.map((dd: any) => {
                                                                                dd.checked = result;
                                                                            });
                                                                            vmi.data = getDatalist();
                                                                            vmi.callback();
                                                                            gvc.notifyDataChange(filterID);
                                                                        },
                                                                    }),
                                                                    value: EditorElem.checkBoxOnly({
                                                                        gvc: gvc,
                                                                        def: dd.checked,
                                                                        callback: (result) => {
                                                                            dd.checked = result;
                                                                            vmi.data = getDatalist();
                                                                            vmi.callback();
                                                                            gvc.notifyDataChange(filterID);
                                                                        },
                                                                        style: 'height:25px;',
                                                                    }),
                                                                },
                                                                {
                                                                    key: '信件主旨',
                                                                    value: `<span class="fs-7">${dd.content.title}</span>`,
                                                                },
                                                                {
                                                                    key: '信件內文',
                                                                    value: html`<span class="fs-7"
                                                                        >${(dd.content.content && dd.content.content.replace(/<[^>]*>/g, '').substring(0, 50)) || ''}...</span
                                                                    >`,
                                                                },
                                                                {
                                                                    key: '發送信件',
                                                                    value: html`<button
                                                                        class="btn btn-primary-c px-4"
                                                                        style="width:20px !important;height: 30px;"
                                                                        onclick="${gvc.event((e, event) => {
                                                                            event.stopPropagation();
                                                                            gvc.glitter.innerDialog((gvc) => {
                                                                                let dataList: any = [];
                                                                                return html`
                                                                                    <div>
                                                                                        ${BgWidget.container(
                                                                                            BgWidget.card(
                                                                                                [
                                                                                                    html`
                                                                                                        <div class="d-flex w-100 align-items-center mb-3 ">
                                                                                                            ${BgWidget.goBack(
                                                                                                                gvc.event(() => {
                                                                                                                    gvc.closeDialog();
                                                                                                                })
                                                                                                            )}
                                                                                                            ${BgWidget.title(`選擇群發對象`)}
                                                                                                            <div class="flex-fill"></div>
                                                                                                            <button
                                                                                                                class="btn btn-primary-c"
                                                                                                                style="height:38px;font-size: 14px;"
                                                                                                                onclick="${gvc.event(() => {
                                                                                                                    const dialog = new ShareDialog(gvc.glitter);
                                                                                                                    if (dataList.length > 0) {
                                                                                                                        dialog.dataLoading({
                                                                                                                            text: '發送中...',
                                                                                                                            visible: true,
                                                                                                                        });
                                                                                                                        ApiSmtp.send({
                                                                                                                            email: dataList.map((dd: any) => {
                                                                                                                                return dd.email;
                                                                                                                            }),
                                                                                                                            name: dd.content.name,
                                                                                                                            title: dd.content.title,
                                                                                                                            content: dd.content.content,
                                                                                                                        }).then(() => {
                                                                                                                            dialog.dataLoading({
                                                                                                                                visible: false,
                                                                                                                            });
                                                                                                                            dialog.successMessage({ text: `發送成功!` });
                                                                                                                        });
                                                                                                                    } else {
                                                                                                                        dialog.errorMessage({ text: '請選擇發送對象!' });
                                                                                                                    }
                                                                                                                })}"
                                                                                                            >
                                                                                                                確認並發送
                                                                                                            </button>
                                                                                                        </div>
                                                                                                    ` +
                                                                                                        BgNotify.email(gvc, 'select', (data) => {
                                                                                                            dataList = data;
                                                                                                        }),
                                                                                                ].join('')
                                                                                            ),
                                                                                            900
                                                                                        )}
                                                                                        <div></div>
                                                                                    </div>
                                                                                `;
                                                                            }, 'email');
                                                                        })}"
                                                                    >
                                                                        <i class="fa-sharp fa-regular fa-paper-plane-top"></i>
                                                                    </button>`,
                                                                },
                                                            ];
                                                        });
                                                    }
                                                    vmi.data = getDatalist();
                                                    vmi.loading = false;
                                                    vmi.callback();
                                                });
                                            },
                                            rowClick: (data, index) => {
                                                vm.data = vm.dataList[index].content;
                                                vm.type = 'replace';
                                            },
                                            filter: html` ${BgWidget.searchPlace(
                                                gvc.event((e, event) => {
                                                    vm.query = e.value;
                                                    gvc.notifyDataChange(id);
                                                }),
                                                vm.query || '',
                                                '搜尋所有信件內容'
                                            )}
                                            ${gvc.bindView(() => {
                                                return {
                                                    bind: filterID,
                                                    view: () => {
                                                        if (
                                                            !vm.dataList ||
                                                            !vm.dataList.find((dd: any) => {
                                                                return dd.checked;
                                                            })
                                                        ) {
                                                            return ``;
                                                        } else {
                                                            return [
                                                                html`<span class="fs-7 fw-bold">操作選項</span>`,
                                                                html`<button
                                                                    class="btn btn-danger fs-7 px-2"
                                                                    style="height:30px;border:none;"
                                                                    onclick="${gvc.event(() => {
                                                                        const dialog = new ShareDialog(gvc.glitter);
                                                                        dialog.checkYesOrNot({
                                                                            text: '是否確認移除所選項目?',
                                                                            callback: (response) => {
                                                                                if (response) {
                                                                                    dialog.dataLoading({ visible: true });
                                                                                    ApiPost.delete({
                                                                                        id: vm.dataList
                                                                                            .filter((dd: any) => {
                                                                                                return dd.checked;
                                                                                            })
                                                                                            .map((dd: any) => {
                                                                                                return dd.id;
                                                                                            })
                                                                                            .join(`,`),
                                                                                    }).then((res) => {
                                                                                        dialog.dataLoading({ visible: false });
                                                                                        if (res.result) {
                                                                                            vm.dataList = undefined;
                                                                                            gvc.notifyDataChange(id);
                                                                                        } else {
                                                                                            dialog.errorMessage({ text: '刪除失敗' });
                                                                                        }
                                                                                    });
                                                                                }
                                                                            },
                                                                        });
                                                                    })}"
                                                                >
                                                                    批量移除
                                                                </button>`,
                                                            ].join(``);
                                                        }
                                                    },
                                                    divCreate: () => {
                                                        return {
                                                            class: `d-flex align-items-center p-2 py-3 ${
                                                                !vm.dataList ||
                                                                !vm.dataList.find((dd: any) => {
                                                                    return dd.checked;
                                                                })
                                                                    ? `d-none`
                                                                    : ``
                                                            }`,
                                                            style: `height:40px;gap:10px;margin-top:10px;`,
                                                        };
                                                    },
                                                };
                                            })}`,
                                        })
                                    )
                                )}
                                ${BgWidget.mbContainer(120)}
                            `,
                            BgWidget.getContainerWidth()
                        );
                    } else if (vm.type == 'replace') {
                        return this.emailEditor({
                            vm: vm,
                            gvc: gvc,
                            type: 'replace',
                        });
                    } else {
                        return this.emailEditor({
                            vm: vm,
                            gvc: gvc,
                            type: 'add',
                        });
                    }
                },
            };
        });
    }

    public static emailEditor(obj: { vm: any; gvc: GVC; type?: 'add' | 'replace'; defData?: any }) {
        const gvc = obj.gvc;
        const glitter = gvc.glitter;
        const vm = obj.vm;
        const postData: {
            id: string;
            content: string;
            title: string;
            type: 'notify-email-config';
            name: string;
        } = vm.data ?? {
            content: '',
            title: '',
            type: 'notify-email-config',
            name: '',
        };
        gvc.addStyle(`
            .bg-warning {
                background: #ffef9d !important;
                color: black !important;
            }
        `);

        return BgWidget.container(
            html`
                <div class="d-flex w-100 align-items-center">
                    ${BgWidget.goBack(
                        gvc.event(() => {
                            vm.type = 'list';
                        })
                    )}
                    ${BgWidget.title('編輯群發信件')}
                    <div class="flex-fill"></div>
                </div>
                ${BgWidget.container(
                    BgWidget.mainCard(
                        [
                            obj.gvc.bindView(() => {
                                const bi = obj.gvc.glitter.getUUID();
                                return {
                                    bind: bi,
                                    view: () => {
                                        return [
                                            EditorElem.editeInput({
                                                gvc: gvc,
                                                title: '寄件者名稱',
                                                default: postData.name,
                                                placeHolder: '請輸入寄件者名稱',
                                                callback: (text) => {
                                                    postData.name = text;
                                                },
                                            }),
                                            EditorElem.editeInput({
                                                gvc: gvc,
                                                title: '信件主旨',
                                                default: postData.title,
                                                placeHolder: '請輸入信件主旨',
                                                callback: (text) => {
                                                    postData.title = text;
                                                },
                                            }),
                                            EditorElem.h3(html`<div class="d-flex align-items-center">
                                                信件內文<button
                                                    class=" btn ms-2 btn-primary-c ms-2"
                                                    style="height: 30px;width: 60px;"
                                                    onclick="${obj.gvc.event(() => {
                                                        postData.content = `親愛的 [使用者名稱],

歡迎來到 [你的公司或社群名稱]！我們很高興你選擇了我們，並成為我們社群的一員。

在這裡，我們致力於提供 [描述你的服務或社群的價值]。我們的團隊一直在努力讓你有一個令人愉快和有價值的體驗。

以下是一些建議的下一步：

1. **完善個人資料：** 請登入您的帳戶，完善您的個人資料，這有助於我們更好地瞭解您的需求。

2. **參與社群：** 加入我們的社交媒體，訂閱我們的通訊，參與我們的討論，您將有機會與其他社群成員建立聯繫。

3. **探索我們的服務：** 探索我們的網站/應用程式，瞭解我們提供的所有功能和服務。

如果您在使用過程中遇到任何問題，或者有任何反饋，請隨時與我們聯繫。我們的支援團隊隨時準備協助您。

再次感謝您加入 [你的公司或社群名稱]，我們期待與您建立長期的合作關係！

祝您有美好的一天！

最誠摯的問候，

[你的名稱]
[你的職務]
[你的公司或社群名稱]
[聯絡電子郵件]
[聯絡電話]`.replace(/\n/g, `<br>`);
                                                        obj.gvc.notifyDataChange(bi);
                                                    })}"
                                                >
                                                    範例
                                                </button>
                                            </div>`),
                                            EditorElem.richText({
                                                gvc: obj.gvc,
                                                def: postData.content,
                                                callback: (text) => {
                                                    postData.content = text;
                                                },
                                                style: `overflow-y: auto;`,
                                            }),
                                        ].join('');
                                    },
                                    divCreate: {},
                                };
                            }),
                            obj.type === 'replace'
                                ? html`
                                      <div class="d-flex w-100">
                                          <div class="flex-fill"></div>
                                          <button
                                              class="btn btn-danger mt-3 ${obj.type === 'replace' ? `` : `d-none`}  ms-auto px-2"
                                              style="height:30px;width:100px;"
                                              onclick="${obj.gvc.event(() => {
                                                  const dialog = new ShareDialog(obj.gvc.glitter);
                                                  dialog.checkYesOrNot({
                                                      text: '是否確認刪除群發信件?',
                                                      callback: (response) => {
                                                          if (response) {
                                                              dialog.dataLoading({ visible: true });
                                                              ApiPost.delete({
                                                                  id: postData.id,
                                                              }).then((res) => {
                                                                  dialog.dataLoading({ visible: false });
                                                                  if (res.result) {
                                                                      vm.type = 'list';
                                                                  } else {
                                                                      dialog.errorMessage({ text: '刪除失敗' });
                                                                  }
                                                              });
                                                          }
                                                      },
                                                  });
                                              })}"
                                          >
                                              刪除信件
                                          </button>
                                      </div>
                                  `
                                : ``,
                        ].join('')
                    )
                )}
                ${BgWidget.mb240()}
                <div class="update-bar-container">
                    ${BgWidget.save(
                        gvc.event(() => {
                            const dialog = new ShareDialog(gvc.glitter);
                            if (obj.type === 'replace') {
                                dialog.dataLoading({ text: '變更信件', visible: true });
                                ApiPost.put({
                                    postData: postData,
                                    token: (window.parent as any).saasConfig.config.token,
                                    type: 'manager',
                                }).then((re) => {
                                    dialog.dataLoading({ visible: false });
                                    if (re.result) {
                                        vm.status = 'list';
                                        dialog.successMessage({ text: '上傳成功' });
                                    } else {
                                        dialog.errorMessage({ text: '上傳失敗' });
                                    }
                                });
                            } else {
                                dialog.dataLoading({ text: '新增信件', visible: true });
                                ApiPost.post({
                                    postData: postData,
                                    token: (window.parent as any).saasConfig.config.token,
                                    type: 'manager',
                                }).then((re) => {
                                    dialog.dataLoading({ visible: false });
                                    if (re.result) {
                                        vm.type = 'list';
                                        dialog.successMessage({ text: '上傳成功' });
                                    } else {
                                        dialog.errorMessage({ text: '上傳失敗' });
                                    }
                                });
                            }
                        })
                    )}
                </div>
            `,
            BgWidget.getContainerWidth()
        );
    }

    public static fcmEditor(obj: { vm: any; gvc: GVC; type?: 'add' | 'replace'; defData?: any }) {
        const gvc = obj.gvc;
        const glitter = gvc.glitter;
        const vm = obj.vm;
        const postData: {
            id: string;
            content: string;
            title: string;
            link:string;
            type: 'notify-message-config';
            name: string;
        } = vm.data ?? {
            content: '',
            title: '',
            link:'',
            type: 'notify-message-config',
            name: '',
        };
        gvc.addStyle(`
            .bg-warning {
                background: #ffef9d !important;
                color: black !important;
            }
        `);

        return BgWidget.container(
            html`
                <div class="d-flex w-100 align-items-center">
                    ${BgWidget.goBack(
                        gvc.event(() => {
                            vm.type = 'list';
                        })
                    )}
                    ${BgWidget.title(`編輯推播通知`)}
                    <div class="flex-fill"></div>
                </div>
                ${BgWidget.container(html`<div class="d-flex px-0" style="gap: 10px;">
                        <div style="width: 100%">
                            ${BgWidget.mainCard(
                                obj.gvc.bindView(() => {
                                    const bi = obj.gvc.glitter.getUUID();
                                    return {
                                        bind: bi,
                                        view: () => {
                                            return [
                                                EditorElem.editeInput({
                                                    gvc: gvc,
                                                    title: '推播標題',
                                                    default: postData.title,
                                                    placeHolder: '請輸入推播標題',
                                                    callback: (text) => {
                                                        postData.title = text;
                                                    },
                                                }),
                                                EditorElem.editeInput({
                                                    gvc: gvc,
                                                    title: '跳轉連結',
                                                    default: postData.link,
                                                    placeHolder: '請輸入要跳轉的連結',
                                                    callback: (text) => {
                                                        postData.link = text;
                                                    },
                                                }),
                                                EditorElem.editeText({
                                                    gvc: gvc,
                                                    title: '推播主旨',
                                                    default: postData.content,
                                                    placeHolder: '請輸入推播內容',
                                                    callback: (text) => {
                                                        postData.content = text;
                                                    },
                                                }),
                                            ].join('');
                                        },
                                        divCreate: {},
                                    };
                                })
                            )}
                        </div>
                    </div>
                    ${obj.type === 'replace'
                        ? html`
                              <div class="d-flex w-100 mt-2">
                                  <div class="flex-fill"></div>
                                  ${BgWidget.redButton(
                                      '刪除樣本',
                                      obj.gvc.event(() => {
                                          const dialog = new ShareDialog(obj.gvc.glitter);
                                          dialog.checkYesOrNot({
                                              text: '是否確認刪除樣本?',
                                              callback: (response) => {
                                                  if (response) {
                                                      dialog.dataLoading({ visible: true });
                                                      ApiPost.delete({
                                                          id: postData.id,
                                                      }).then((res) => {
                                                          dialog.dataLoading({ visible: false });
                                                          if (res.result) {
                                                              vm.type = 'list';
                                                          } else {
                                                              dialog.errorMessage({ text: '刪除失敗' });
                                                          }
                                                      });
                                                  }
                                              },
                                          });
                                      })
                                  )}
                              </div>
                          `
                        : ``}
                    <div class="update-bar-container">
                        ${BgWidget.cancel(
                            gvc.event(() => {
                                vm.type = 'list';
                            })
                        )}
                        ${BgWidget.save(
                            gvc.event(() => {
                                const dialog = new ShareDialog(gvc.glitter);
                                if (obj.type === 'replace') {
                                    dialog.dataLoading({ text: '變更信件', visible: true });
                                    ApiPost.put({
                                        postData: postData,
                                        token: (window.parent as any).saasConfig.config.token,
                                        type: 'manager',
                                    }).then((re) => {
                                        dialog.dataLoading({ visible: false });
                                        if (re.result) {
                                            vm.status = 'list';
                                            dialog.successMessage({ text: '上傳成功' });
                                        } else {
                                            dialog.errorMessage({ text: '上傳失敗' });
                                        }
                                    });
                                } else {
                                    dialog.dataLoading({ text: '新增信件', visible: true });
                                    ApiPost.post({
                                        postData: postData,
                                        token: (window.parent as any).saasConfig.config.token,
                                        type: 'manager',
                                    }).then((re) => {
                                        dialog.dataLoading({ visible: false });
                                        if (re.result) {
                                            vm.type = 'list';
                                            dialog.successMessage({ text: '上傳成功' });
                                        } else {
                                            dialog.errorMessage({ text: '上傳失敗' });
                                        }
                                    });
                                }
                            })
                        )}
                    </div>`)}
            `,
            BgWidget.getContainerWidth({ rate: { web: 0.68 } })
        );
    }

    public static fcmDevice(gvc: GVC, type: 'list' | 'select' = 'list', callback: (select: any) => void = () => {}) {
        const vm: {
            type: 'list' | 'replace';
            data: any;
            dataList: any;
            query?: string;
        } = {
            type: 'list',
            data: {
                id: 61,
                userID: 549313940,
                account: 'jianzhi.wang@homee.ai',
                userData: { name: '王建智', email: 'jianzhi.wang@homee.ai', phone: '0978028739' },
                created_time: '2023-11-26T02:14:09.000Z',
                role: 0,
                company: null,
                status: 1,
            },
            dataList: undefined,
            query: '',
        };
        const glitter = gvc.glitter;
        const filterID = glitter.getUUID();
        const id = glitter.getUUID();
        const dialog = new ShareDialog(gvc.glitter);
        return gvc.bindView(() => {
            return {
                bind: id,
                view: () => {
                    let vmi: any = undefined;

                    function getDatalist() {
                        let interval: any = 0;
                        return vm.dataList.map((dd: any) => {
                            return [
                                {
                                    key: (() => {
                                        clearInterval(interval);
                                        if (
                                            !vm.dataList.find((dd: any) => {
                                                return !dd.checked;
                                            })
                                        ) {
                                            interval = setTimeout(() => {
                                                ApiUser.getFCM({
                                                    page: vmi.page - 1,
                                                    limit: 100000,
                                                    search: vm.query || undefined,
                                                }).then((data) => {
                                                    callback(data.response.data);
                                                });
                                            }, 10);
                                        }

                                        return EditorElem.checkBoxOnly({
                                            gvc: gvc,
                                            def: !vm.dataList.find((dd: any) => {
                                                return !dd.checked;
                                            }),
                                            callback: (result) => {
                                                vm.dataList.map((dd: any) => {
                                                    dd.checked = result;
                                                });
                                                vmi.data = getDatalist();
                                                vmi.callback();
                                                gvc.notifyDataChange(filterID);
                                                callback(
                                                    vm.dataList.filter((dd: any) => {
                                                        return dd.checked;
                                                    })
                                                );
                                            },
                                        });
                                    })(),
                                    value: EditorElem.checkBoxOnly({
                                        gvc: gvc,
                                        def: dd.checked,
                                        callback: (result) => {
                                            dd.checked = result;
                                            vmi.data = getDatalist();
                                            vmi.callback();
                                            gvc.notifyDataChange(filterID);
                                            callback(
                                                vm.dataList.filter((dd: any) => {
                                                    return dd.checked;
                                                })
                                            );
                                        },
                                        style: 'height:25px;',
                                    }),
                                },
                                {
                                    key: '用戶ID',
                                    value: `<span class="fs-7">${dd.userID ?? '尚未登入'}</span>`,
                                },
                                {
                                    key: '用戶名稱',
                                    value: `<span class="fs-7">${dd.userData ? dd.userData.name : '尚未登入'}</span>`,
                                },
                                {
                                    key: '訂閱Token',
                                    value: `<span class="fs-7">${dd.deviceToken.substring(0, 80)}...</span>`,
                                },
                            ];
                        });
                    }

                    return BgWidget.container(
                        html`
                            <div class="d-flex w-100 align-items-center ${type === 'select' ? `d-none` : ``}">
                                ${BgWidget.title('已訂閱裝置')}
                                <div class="flex-fill"></div>
                            </div>
                            ${BgWidget.container(
                                BgWidget.mainCard(
                                    BgWidget.tableV2({
                                        gvc: gvc,
                                        getData: (vmk) => {
                                            vmi = vmk;
                                            ApiUser.getFCM({
                                                page: vmi.page - 1,
                                                limit: 20,
                                                search: vm.query || undefined,
                                            }).then((data) => {
                                                vmi.pageSize = Math.ceil(data.response.total / 20);
                                                vm.dataList = data.response.data;
                                                vmi.data = getDatalist();
                                                vmi.loading = false;
                                                vmi.callback();
                                                if (type === 'select') {
                                                    callback(
                                                        vm.dataList.filter((dd: any) => {
                                                            return dd.checked;
                                                        })
                                                    );
                                                }
                                            });
                                        },
                                        rowClick: (data, index) => {
                                            vm.dataList[index].checked = !vm.dataList[index].checked;
                                            vmi.data = getDatalist();
                                            vmi.callback();
                                            gvc.notifyDataChange(filterID);
                                            callback(
                                                vm.dataList.filter((dd: any) => {
                                                    return dd.checked;
                                                })
                                            );
                                        },
                                        filter: html`
                                            ${BgWidget.searchPlace(
                                                gvc.event((e, event) => {
                                                    vm.query = e.value;
                                                    gvc.notifyDataChange(id);
                                                }),
                                                vm.query || '',
                                                '搜尋信箱或者標籤'
                                            )}
                                            ${gvc.bindView(() => {
                                                return {
                                                    bind: filterID,
                                                    view: () => {
                                                        if (
                                                            !vm.dataList ||
                                                            !vm.dataList.find((dd: any) => {
                                                                return dd.checked;
                                                            })
                                                        ) {
                                                            return ``;
                                                        } else {
                                                            return [
                                                                `<span class="fs-7 fw-bold">操作選項</span>`,
                                                                `<button class="btn btn-danger fs-7 px-2" style="height:30px;border:none;" onclick="${gvc.event(() => {
                                                                    const dialog = new ShareDialog(gvc.glitter);
                                                                    dialog.checkYesOrNot({
                                                                        text: '是否確認移除所選項目?',
                                                                        callback: (response) => {
                                                                            if (response) {
                                                                                dialog.dataLoading({ visible: true });
                                                                                ApiUser.deleteSubscribe({
                                                                                    email: vm.dataList
                                                                                        .filter((dd: any) => {
                                                                                            return dd.checked;
                                                                                        })
                                                                                        .map((dd: any) => {
                                                                                            return dd.email;
                                                                                        })
                                                                                        .join(`,`),
                                                                                }).then((res) => {
                                                                                    dialog.dataLoading({ visible: false });
                                                                                    if (res.result) {
                                                                                        vm.dataList = undefined;
                                                                                        gvc.notifyDataChange(id);
                                                                                    } else {
                                                                                        dialog.errorMessage({ text: '刪除失敗' });
                                                                                    }
                                                                                });
                                                                            }
                                                                        },
                                                                    });
                                                                })}">批量移除</button>`,
                                                            ].join(``);
                                                        }
                                                    },
                                                    divCreate: () => {
                                                        return {
                                                            class: `d-flex align-items-center p-2 py-3 ${
                                                                !vm.dataList ||
                                                                !vm.dataList.find((dd: any) => {
                                                                    return dd.checked;
                                                                }) ||
                                                                type === 'select'
                                                                    ? `d-none`
                                                                    : ``
                                                            }`,
                                                            style: `height:40px;gap:10px;margin-top:10px;`,
                                                        };
                                                    },
                                                };
                                            })}
                                        `,
                                    })
                                )
                            )}
                        `,
                        BgWidget.getContainerWidth()
                    );
                },
                divCreate: {
                    class: type === 'select' ? `m-n4` : ``,
                },
            };
        });
    }

    public static fcmSetting(gvc: GVC) {
        const glitter = gvc.glitter;
        const vm: {
            type: 'list' | 'add' | 'replace';
            data: any;
            dataList: any;
            query?: string;
        } = {
            type: 'list',
            data: undefined,
            dataList: undefined,
            query: undefined,
        };
        return gvc.bindView(() => {
            const id = glitter.getUUID();
            const filterID = glitter.getUUID();
            return {
                bind: id,
                dataList: [{ obj: vm, key: 'type' }],
                view: () => {
                    if (vm.type === 'list') {
                        return BgWidget.container(
                            html`
                                <div class="d-flex w-100 align-items-center">
                                    ${BgWidget.title('推播訊息管理')}
                                    <div class="flex-fill"></div>
                                    ${BgWidget.darkButton(
                                        '新增推播',
                                        gvc.event(() => {
                                            vm.data = undefined;
                                            vm.type = 'add';
                                        })
                                    )}
                                </div>
                                ${BgWidget.container(
                                    BgWidget.mainCard(
                                        BgWidget.tableV2({
                                            gvc: gvc,
                                            getData: (vmi) => {
                                                ApiPost.getManagerPost({
                                                    page: vmi.page - 1,
                                                    limit: 20,
                                                    search: vm.query ? [`title->${vm.query}`] : undefined,
                                                    type: 'notify-message-config',
                                                }).then((data) => {
                                                    vmi.pageSize = Math.ceil(data.response.total / 20);
                                                    vm.dataList = data.response.data;

                                                    function getDatalist() {
                                                        return data.response.data.map((dd: any) => {
                                                            return [
                                                                {
                                                                    key: EditorElem.checkBoxOnly({
                                                                        gvc: gvc,
                                                                        def: !data.response.data.find((dd: any) => {
                                                                            return !dd.checked;
                                                                        }),
                                                                        callback: (result) => {
                                                                            data.response.data.map((dd: any) => {
                                                                                dd.checked = result;
                                                                            });
                                                                            vmi.data = getDatalist();
                                                                            vmi.callback();
                                                                            gvc.notifyDataChange(filterID);
                                                                        },
                                                                    }),
                                                                    value: EditorElem.checkBoxOnly({
                                                                        gvc: gvc,
                                                                        def: dd.checked,
                                                                        callback: (result) => {
                                                                            dd.checked = result;
                                                                            vmi.data = getDatalist();
                                                                            vmi.callback();
                                                                            gvc.notifyDataChange(filterID);
                                                                        },
                                                                        style: 'height:25px;',
                                                                    }),
                                                                },
                                                                {
                                                                    key: '推播標題',
                                                                    value: `<span class="fs-7">${dd.content.title}</span>`,
                                                                },
                                                                {
                                                                    key: '推播內文',
                                                                    value: `<span class="fs-7">${dd.content.content.replace(/<[^>]*>/g, '').substring(0, 30)}...</span>`,
                                                                },
                                                                {
                                                                    key: '發送推播',
                                                                    value: html`<button
                                                                        class="btn btn-primary-c px-4"
                                                                        style="width:20px !important;height: 30px;"
                                                                        onclick="${gvc.event((e, event) => {
                                                                            event.stopPropagation();
                                                                            gvc.glitter.innerDialog((gvc) => {
                                                                                let dataList: any = [];
                                                                                return html`
                                                                                    <div style="max-height: calc(100vh - 100px);overflow-y: auto;">
                                                                                        ${BgWidget.container(
                                                                                            BgWidget.card(
                                                                                                [
                                                                                                    html`
                                                                                                        <div class="d-flex w-100 align-items-center mb-3 ">
                                                                                                            ${BgWidget.goBack(
                                                                                                                gvc.event(() => {
                                                                                                                    gvc.closeDialog();
                                                                                                                })
                                                                                                            )}
                                                                                                            ${BgWidget.title(`選擇群發對象`)}
                                                                                                            <div class="flex-fill"></div>
                                                                                                            <button class="btn bt_c39 me-2"  style="height:38px;font-size: 14px;" onclick="${gvc.event(()=>{
                                                                                                                const dialog = new ShareDialog(gvc.glitter);
                                                                                                                dialog.dataLoading({
                                                                                                                    text: '發送中...',
                                                                                                                    visible: true,
                                                                                                                });
                                                                                                                ApiFcm.send({
                                                                                                                    device_token:['all'],
                                                                                                                    title: dd.content.title,
                                                                                                                    content: dd.content.content,
                                                                                                                    link:dd.content.link
                                                                                                                }).then(() => {
                                                                                                                    dialog.dataLoading({
                                                                                                                        visible: false,
                                                                                                                    });
                                                                                                                    dialog.successMessage({ text: `發送成功!` });
                                                                                                                });
                                                                                                            })}">
                                                                                                                發送給所有用戶
                                                                                                            </button>
                                                                                                            <button
                                                                                                                class="btn bt_c39"
                                                                                                                style="height:38px;font-size: 14px;"
                                                                                                                onclick="${gvc.event(() => {
                                                                                                                    const dialog = new ShareDialog(gvc.glitter);
                                                                                                                    if (dataList.length > 0) {
                                                                                                                        dialog.dataLoading({
                                                                                                                            text: '發送中...',
                                                                                                                            visible: true,
                                                                                                                        });
                                                                                                                        ApiFcm.send({
                                                                                                                            device_token: dataList.map((dd: any) => {
                                                                                                                                return dd.deviceToken;
                                                                                                                            }),
                                                                                                                            title: dd.content.title,
                                                                                                                            content: dd.content.content,
                                                                                                                            link:dd.content.link
                                                                                                                        }).then(() => {
                                                                                                                            dialog.dataLoading({
                                                                                                                                visible: false,
                                                                                                                            });
                                                                                                                            dialog.successMessage({ text: `發送成功!` });
                                                                                                                        });
                                                                                                                    } else {
                                                                                                                        dialog.errorMessage({ text: '請選擇發送對象!' });
                                                                                                                    }
                                                                                                                })}"
                                                                                                            >
                                                                                                                確認並發送
                                                                                                            </button>
                                                                                                        </div>
                                                                                                    ` +
                                                                                                        BgNotify.fcmDevice(gvc, 'select', (data) => {
                                                                                                            dataList = data;
                                                                                                        }),
                                                                                                ].join('')
                                                                                            ),
                                                                                            900
                                                                                        )}
                                                                                        <div></div>
                                                                                    </div>
                                                                                `;
                                                                            }, 'email');
                                                                        })}"
                                                                    >
                                                                        <i class="fa-sharp fa-regular fa-paper-plane-top"></i>
                                                                    </button>`,
                                                                },
                                                            ];
                                                        });
                                                    }

                                                    vmi.data = getDatalist();
                                                    vmi.loading = false;
                                                    vmi.callback();
                                                });
                                            },
                                            rowClick: (data, index) => {
                                                vm.data = vm.dataList[index].content;
                                                vm.type = 'replace';
                                            },
                                            filter: html` ${BgWidget.searchPlace(
                                                gvc.event((e, event) => {
                                                    vm.query = e.value;
                                                    gvc.notifyDataChange(id);
                                                }),
                                                vm.query || '',
                                                '搜尋所有信件內容'
                                            )}
                                            ${gvc.bindView(() => {
                                                return {
                                                    bind: filterID,
                                                    view: () => {
                                                        if (
                                                            !vm.dataList ||
                                                            !vm.dataList.find((dd: any) => {
                                                                return dd.checked;
                                                            })
                                                        ) {
                                                            return ``;
                                                        } else {
                                                            return [
                                                                html`<span class="fs-7 fw-bold">操作選項</span>`,
                                                                html`<button
                                                                    class="btn btn-danger fs-7 px-2"
                                                                    style="height:30px;border:none;"
                                                                    onclick="${gvc.event(() => {
                                                                        const dialog = new ShareDialog(gvc.glitter);
                                                                        dialog.checkYesOrNot({
                                                                            text: '是否確認移除所選項目?',
                                                                            callback: (response) => {
                                                                                if (response) {
                                                                                    dialog.dataLoading({ visible: true });
                                                                                    ApiPost.delete({
                                                                                        id: vm.dataList
                                                                                            .filter((dd: any) => {
                                                                                                return dd.checked;
                                                                                            })
                                                                                            .map((dd: any) => {
                                                                                                return dd.id;
                                                                                            })
                                                                                            .join(`,`),
                                                                                    }).then((res) => {
                                                                                        dialog.dataLoading({ visible: false });
                                                                                        if (res.result) {
                                                                                            vm.dataList = undefined;
                                                                                            gvc.notifyDataChange(id);
                                                                                        } else {
                                                                                            dialog.errorMessage({ text: '刪除失敗' });
                                                                                        }
                                                                                    });
                                                                                }
                                                                            },
                                                                        });
                                                                    })}"
                                                                >
                                                                    批量移除
                                                                </button>`,
                                                            ].join(``);
                                                        }
                                                    },
                                                    divCreate: () => {
                                                        return {
                                                            class: `d-flex align-items-center p-2 py-3 ${
                                                                !vm.dataList ||
                                                                !vm.dataList.find((dd: any) => {
                                                                    return dd.checked;
                                                                })
                                                                    ? `d-none`
                                                                    : ``
                                                            }`,
                                                            style: `height:40px;gap:10px;margin-top:10px;`,
                                                        };
                                                    },
                                                };
                                            })}`,
                                        })
                                    )
                                )}
                            `,
                            BgWidget.getContainerWidth()
                        );
                    } else if (vm.type == 'replace') {
                        return this.fcmEditor({
                            vm: vm,
                            gvc: gvc,
                            type: 'replace',
                        });
                    } else {
                        return this.fcmEditor({
                            vm: vm,
                            gvc: gvc,
                            type: 'add',
                        });
                    }
                },
            };
        });
    }

    public static rebackMessage(gvc: GVC, type: 'list' | 'select' = 'list', callback: (select: any) => void = () => {}) {
        const vm: {
            type: 'list' | 'replace';
            data: any;
            dataList: any;
            query?: string;
        } = {
            type: 'list',
            data: {
                id: 61,
                userID: 549313940,
                account: 'jianzhi.wang@homee.ai',
                userData: { name: '王建智', email: 'jianzhi.wang@homee.ai', phone: '0978028739' },
                created_time: '2023-11-26T02:14:09.000Z',
                role: 0,
                company: null,
                status: 1,
            },
            dataList: undefined,
            query: '',
        };
        const glitter = gvc.glitter;
        const filterID = glitter.getUUID();
        const id = glitter.getUUID();
        const dialog = new ShareDialog(gvc.glitter);
        return gvc.bindView(() => {
            return {
                bind: id,
                view: () => {
                    let vmi: any = undefined;

                    function getDatalist() {
                        let interval: any = 0;
                        return vm.dataList.map((dd: any) => {
                            return [
                                {
                                    key: (() => {
                                        clearInterval(interval);
                                        if (
                                            !vm.dataList.find((dd: any) => {
                                                return !dd.checked;
                                            })
                                        ) {
                                            interval = setTimeout(() => {
                                                ApiUser.getFCM({
                                                    page: vmi.page - 1,
                                                    limit: 100000,
                                                    search: vm.query || undefined,
                                                }).then((data) => {
                                                    callback(data.response.data);
                                                });
                                            }, 10);
                                        }

                                        return EditorElem.checkBoxOnly({
                                            gvc: gvc,
                                            def: !vm.dataList.find((dd: any) => {
                                                return !dd.checked;
                                            }),
                                            callback: (result) => {
                                                vm.dataList.map((dd: any) => {
                                                    dd.checked = result;
                                                });
                                                vmi.data = getDatalist();
                                                vmi.callback();
                                                gvc.notifyDataChange(filterID);
                                                callback(
                                                    vm.dataList.filter((dd: any) => {
                                                        return dd.checked;
                                                    })
                                                );
                                            },
                                        });
                                    })(),
                                    value: EditorElem.checkBoxOnly({
                                        gvc: gvc,
                                        def: dd.checked,
                                        callback: (result) => {
                                            dd.checked = result;
                                            vmi.data = getDatalist();
                                            vmi.callback();
                                            gvc.notifyDataChange(filterID);
                                            callback(
                                                vm.dataList.filter((dd: any) => {
                                                    return dd.checked;
                                                })
                                            );
                                        },
                                        style: 'height:25px;',
                                    }),
                                },
                                {
                                    key: '名稱',
                                    value: `<span class="fs-7">${dd.content.name}</span>`,
                                },
                                {
                                    key: '信箱',
                                    value: `<span class="fs-7">${dd.content.email}</span>`,
                                },
                                {
                                    key: '標題',
                                    value: `<span class="fs-7">${dd.content.title}</span>`,
                                },
                                {
                                    key: '內文',
                                    value: `<span class="fs-7">${(dd.content.content ?? '').substring(0, 30)}...</span>`,
                                },
                            ];
                        });
                    }

                    if (vm.type === 'replace') {
                        return BgWidget.container(
                            html`
                                <div class="d-flex w-100 align-items-center mb-3 ">
                                    ${BgWidget.goBack(
                                        gvc.event(() => {
                                            vm.type = 'list';
                                            gvc.notifyDataChange(id);
                                        })
                                    )}
                                    ${BgWidget.title(`用戶回饋內容`)}
                                    <div class="flex-fill"></div>
                                </div>
                                ${BgWidget.card(
                                    ` ${FormWidget.editorView({
                                        gvc: gvc,
                                        array: [
                                            {
                                                key: 'name',
                                                type: 'name',
                                                title: '姓名',
                                                require: 'true',
                                                readonly: 'read',
                                                style_data: {
                                                    input: {
                                                        class: '',
                                                        style: '',
                                                    },
                                                    label: {
                                                        class: 'form-label fs-base ',
                                                        style: '',
                                                    },
                                                    container: {
                                                        tag: 'aboutus-container',
                                                        class: '',
                                                        style: '',
                                                        stylist: [],
                                                        dataType: 'static',
                                                        style_from: 'tag',
                                                        classDataType: 'static',
                                                    },
                                                },
                                            },
                                            {
                                                key: 'email',
                                                type: 'email',
                                                title: '信箱',
                                                require: 'true',
                                                readonly: 'read',
                                                style_data: {
                                                    input: {
                                                        class: '',
                                                        style: '',
                                                    },
                                                    label: {
                                                        class: 'form-label fs-base ',
                                                        style: '',
                                                    },
                                                    container: {
                                                        tag: 'aboutus-container',
                                                        class: '',
                                                        style: '',
                                                        stylist: [],
                                                        style_from: 'tag',
                                                    },
                                                },
                                            },
                                            {
                                                key: 'title',
                                                type: 'text',
                                                title: '標題',
                                                require: 'true',
                                                readonly: 'read',
                                                style_data: {
                                                    input: {
                                                        class: '',
                                                        style: '',
                                                    },
                                                    label: {
                                                        class: 'form-label fs-base ',
                                                        style: '',
                                                    },
                                                    container: {
                                                        tag: 'aboutus-container',
                                                        class: '',
                                                        style: '',
                                                        stylist: [],
                                                        dataType: 'static',
                                                        style_from: 'tag',
                                                        classDataType: 'static',
                                                    },
                                                },
                                            },
                                            {
                                                key: 'content',
                                                type: 'textArea',
                                                title: '訊息',
                                                require: 'true',
                                                readonly: 'read',
                                                style_data: {
                                                    input: {
                                                        class: '',
                                                        style: '',
                                                    },
                                                    label: {
                                                        class: 'form-label fs-base ',
                                                        style: '',
                                                    },
                                                    container: {
                                                        class: '',
                                                        style: '',
                                                    },
                                                },
                                            },
                                        ],
                                        refresh: () => {},
                                        formData: vm.data.content,
                                    })}`
                                )}
                            `,
                            800
                        );
                    }
                    return BgWidget.container(html`
                        <div class="d-flex w-100 align-items-center mb-3 ${type === 'select' ? `d-none` : ``}">
                            ${BgWidget.title('回饋信件')}
                            <div class="flex-fill"></div>
                        </div>
                        ${BgWidget.table({
                            gvc: gvc,
                            getData: (vmk) => {
                                vmi = vmk;
                                ApiPost.getUserPost({
                                    page: vmi.page - 1,
                                    limit: 20,
                                    search: vm.query || undefined,
                                    type: 'userQuestion',
                                }).then((data) => {
                                    vmi.pageSize = Math.ceil(data.response.total / 20);
                                    vm.dataList = data.response.data;
                                    vmi.data = getDatalist();
                                    vmi.loading = false;
                                    vmi.callback();
                                    if (type === 'select') {
                                        callback(
                                            vm.dataList.filter((dd: any) => {
                                                return dd.checked;
                                            })
                                        );
                                    }
                                });
                            },
                            rowClick: (data, index) => {
                                vm.type = 'replace';
                                vm.data = vm.dataList[index];
                                gvc.notifyDataChange(id);
                            },
                            filter: html`
                                ${BgWidget.searchPlace(
                                    gvc.event((e, event) => {
                                        vm.query = e.value;
                                        gvc.notifyDataChange(id);
                                    }),
                                    vm.query || '',
                                    '搜尋標題'
                                )}
                                ${gvc.bindView(() => {
                                    return {
                                        bind: filterID,
                                        view: () => {
                                            if (
                                                !vm.dataList ||
                                                !vm.dataList.find((dd: any) => {
                                                    return dd.checked;
                                                })
                                            ) {
                                                return ``;
                                            } else {
                                                return [
                                                    `<span class="fs-7 fw-bold">操作選項</span>`,
                                                    `<button class="btn btn-danger fs-7 px-2" style="height:30px;border:none;" onclick="${gvc.event(() => {
                                                        const dialog = new ShareDialog(gvc.glitter);
                                                        dialog.checkYesOrNot({
                                                            text: '是否確認移除所選項目?',
                                                            callback: (response) => {
                                                                if (response) {
                                                                    dialog.dataLoading({ visible: true });
                                                                    ApiPost.deleteUserPost({
                                                                        id: vm.dataList
                                                                            .filter((dd: any) => {
                                                                                return dd.checked;
                                                                            })
                                                                            .map((dd: any) => {
                                                                                return dd.id;
                                                                            })
                                                                            .join(`,`),
                                                                    }).then((res) => {
                                                                        dialog.dataLoading({ visible: false });
                                                                        if (res.result) {
                                                                            vm.dataList = undefined;
                                                                            gvc.notifyDataChange(id);
                                                                        } else {
                                                                            dialog.errorMessage({ text: '刪除失敗' });
                                                                        }
                                                                    });
                                                                }
                                                            },
                                                        });
                                                    })}">批量移除</button>`,
                                                ].join(``);
                                            }
                                        },
                                        divCreate: () => {
                                            return {
                                                class: `d-flex align-items-center p-2 py-3 ${
                                                    !vm.dataList ||
                                                    !vm.dataList.find((dd: any) => {
                                                        return dd.checked;
                                                    }) ||
                                                    type === 'select'
                                                        ? `d-none`
                                                        : ``
                                                }`,
                                                style: `height:40px;gap:10px;margin-top:10px;`,
                                            };
                                        },
                                    };
                                })}
                            `,
                        })}
                    `);
                },
                divCreate: {
                    class: type === 'select' ? `m-n4` : ``,
                },
            };
        });
    }

    public static customerMessage(gvc: GVC, type: 'list' | 'select' = 'list', callback: (select: any) => void = () => {}) {
        const vm: {
            type: 'list' | 'replace';
            data: any;
            dataList: any;
            query?: string;
        } = {
            type: 'list',
            data: {
                id: 61,
                userID: 549313940,
                account: 'jianzhi.wang@homee.ai',
                userData: { name: '王建智', email: 'jianzhi.wang@homee.ai', phone: '0978028739' },
                created_time: '2023-11-26T02:14:09.000Z',
                role: 0,
                company: null,
                status: 1,
            },
            dataList: undefined,
            query: '',
        };
        const glitter = gvc.glitter;
        const filterID = glitter.getUUID();
        const id = glitter.getUUID();
        const dialog = new ShareDialog(gvc.glitter);
        return gvc.bindView(() => {
            return {
                bind: id,
                view: () => {
                    let vmi: any = undefined;

                    function getDatalist() {
                        let interval: any = 0;
                        return vm.dataList.map((dd: any) => {
                            return [
                                {
                                    key: (() => {
                                        clearInterval(interval);
                                        if (
                                            !vm.dataList.find((dd: any) => {
                                                return !dd.checked;
                                            })
                                        ) {
                                            interval = setTimeout(() => {
                                                ApiUser.getFCM({
                                                    page: vmi.page - 1,
                                                    limit: 100000,
                                                    search: vm.query || undefined,
                                                }).then((data) => {
                                                    callback(data.response.data);
                                                });
                                            }, 10);
                                        }

                                        return EditorElem.checkBoxOnly({
                                            gvc: gvc,
                                            def: !vm.dataList.find((dd: any) => {
                                                return !dd.checked;
                                            }),
                                            callback: (result) => {
                                                vm.dataList.map((dd: any) => {
                                                    dd.checked = result;
                                                });
                                                vmi.data = getDatalist();
                                                vmi.callback();
                                                gvc.notifyDataChange(filterID);
                                                callback(
                                                    vm.dataList.filter((dd: any) => {
                                                        return dd.checked;
                                                    })
                                                );
                                            },
                                        });
                                    })(),
                                    value: EditorElem.checkBoxOnly({
                                        gvc: gvc,
                                        def: dd.checked,
                                        callback: (result) => {
                                            dd.checked = result;
                                            vmi.data = getDatalist();
                                            vmi.callback();
                                            gvc.notifyDataChange(filterID);
                                            callback(
                                                vm.dataList.filter((dd: any) => {
                                                    return dd.checked;
                                                })
                                            );
                                        },
                                        style: 'height:25px;',
                                    }),
                                },
                                {
                                    key: '名稱',
                                    value: `<span class="fs-7">${dd.user_data ? dd.user_data.userData.name : `訪客`}</span>`,
                                },
                                {
                                    key: '信箱',
                                    value: `<span class="fs-7">${dd.user_data ? dd.user_data.userData.email : `...`}</span>`,
                                },
                                {
                                    key: '訊息內容',
                                    value: `<span class="fs-7">${dd.topMessage ? dd.topMessage.text : ``}</span>`,
                                },
                            ];
                        });
                    }

                    if (vm.type === 'replace') {
                        return BgWidget.container(
                            html`
                                <div class="d-flex w-100 align-items-center mb-3 ">
                                    ${BgWidget.goBack(
                                        gvc.event(() => {
                                            vm.type = 'list';
                                            gvc.notifyDataChange(id);
                                        })
                                    )}
                                    ${BgWidget.title(`客服訊息`)}
                                    <div class="flex-fill"></div>
                                </div>
                                ${BgWidget.card(
                                    ` ${FormWidget.editorView({
                                        gvc: gvc,
                                        array: [
                                            {
                                                key: 'name',
                                                type: 'name',
                                                title: '姓名',
                                                require: 'true',
                                                readonly: 'read',
                                                style_data: {
                                                    input: {
                                                        class: '',
                                                        style: '',
                                                    },
                                                    label: {
                                                        class: 'form-label fs-base ',
                                                        style: '',
                                                    },
                                                    container: {
                                                        tag: 'aboutus-container',
                                                        class: '',
                                                        style: '',
                                                        stylist: [],
                                                        dataType: 'static',
                                                        style_from: 'tag',
                                                        classDataType: 'static',
                                                    },
                                                },
                                            },
                                            {
                                                key: 'email',
                                                type: 'email',
                                                title: '信箱',
                                                require: 'true',
                                                readonly: 'read',
                                                style_data: {
                                                    input: {
                                                        class: '',
                                                        style: '',
                                                    },
                                                    label: {
                                                        class: 'form-label fs-base ',
                                                        style: '',
                                                    },
                                                    container: {
                                                        tag: 'aboutus-container',
                                                        class: '',
                                                        style: '',
                                                        stylist: [],
                                                        style_from: 'tag',
                                                    },
                                                },
                                            },
                                            {
                                                key: 'title',
                                                type: 'text',
                                                title: '標題',
                                                require: 'true',
                                                readonly: 'read',
                                                style_data: {
                                                    input: {
                                                        class: '',
                                                        style: '',
                                                    },
                                                    label: {
                                                        class: 'form-label fs-base ',
                                                        style: '',
                                                    },
                                                    container: {
                                                        tag: 'aboutus-container',
                                                        class: '',
                                                        style: '',
                                                        stylist: [],
                                                        dataType: 'static',
                                                        style_from: 'tag',
                                                        classDataType: 'static',
                                                    },
                                                },
                                            },
                                            {
                                                key: 'content',
                                                type: 'textArea',
                                                title: '訊息',
                                                require: 'true',
                                                readonly: 'read',
                                                style_data: {
                                                    input: {
                                                        class: '',
                                                        style: '',
                                                    },
                                                    label: {
                                                        class: 'form-label fs-base ',
                                                        style: '',
                                                    },
                                                    container: {
                                                        class: '',
                                                        style: '',
                                                    },
                                                },
                                            },
                                        ],
                                        refresh: () => {},
                                        formData: vm.data.content,
                                    })}`
                                )}
                            `,
                            800
                        );
                    }
                    return BgWidget.container(html`
                        <div class="d-flex w-100 align-items-center mb-3 ${type === 'select' ? `d-none` : ``}">
                            ${BgWidget.title('客服訊息')}
                            <div class="flex-fill"></div>
                            <button
                                class="btn hoverBtn me-2 px-3"
                                style="height:35px !important;font-size: 14px;color:black;border:1px solid black;"
                                onclick="${gvc.event(() => {
                                    EditorElem.openEditorDialog(
                                        gvc,
                                        (gvc) => {
                                            const saasConfig: {
                                                config: any;
                                                api: any;
                                            } = (window as any).saasConfig;
                                            const id = gvc.glitter.getUUID();
                                            let keyData = {};
                                            return [
                                                gvc.bindView(() => {
                                                    ApiUser.getPublicConfig(`robot_auto_reply`, 'manager').then((data: any) => {
                                                        if (data.response.value) {
                                                            keyData = data.response.value;
                                                            gvc.notifyDataChange(id);
                                                        }
                                                    });
                                                    return {
                                                        bind: id,
                                                        view: () => {
                                                            return new Promise((resolve, reject) => {
                                                                resolve(
                                                                    FormWidget.editorView({
                                                                        gvc: gvc,
                                                                        array: [
                                                                            {
                                                                                title: '機器人問答',
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
                                                                                plusBtn: '添加自動問答',
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
                                                                            gvc.notifyDataChange(id);
                                                                        },
                                                                        formData: keyData,
                                                                    })
                                                                );
                                                            });
                                                        },
                                                        divCreate: {
                                                            class: 'p-2',
                                                        },
                                                    };
                                                }),
                                                html`<div class="d-flex">
                                                    <div class="flex-fill"></div>
                                                    <div
                                                        class=" btn-primary-c btn my-2 me-2"
                                                        style="margin-left: 10px;height:35px;"
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
                                                        儲存設定
                                                    </div>
                                                </div>`,
                                            ].join('');
                                        },
                                        () => {},
                                        500,
                                        '自訂表單'
                                    );
                                })}"
                            >
                                <i class="fa-regular fa-gear me-2 "></i>
                                機器人問答
                            </button>
                        </div>
                        ${BgWidget.table({
                            gvc: gvc,
                            getData: (vmk) => {
                                vmi = vmk;
                                Chat.getChatRoom({
                                    page: vmi.page - 1,
                                    limit: 20,
                                    user_id: 'manager',
                                }).then((data) => {
                                    vmi.pageSize = Math.ceil(data.response.total / 20);
                                    vm.dataList = data.response.data;
                                    vmi.data = getDatalist();
                                    vmi.loading = false;
                                    vmi.callback();
                                    if (type === 'select') {
                                        callback(
                                            vm.dataList.filter((dd: any) => {
                                                return dd.checked;
                                            })
                                        );
                                    }
                                });
                            },
                            rowClick: (data, index) => {
                                gvc.glitter.innerDialog(() => {
                                    return EditorElem.iframeComponent({
                                        page: 'chat_page',
                                        width: 400,
                                        height: 680,
                                        par: [
                                            {
                                                key: 'is_manager',
                                                value: 'true',
                                            },
                                            {
                                                key: 'chat_who',
                                                value: vm.dataList[index].who,
                                            },
                                        ],
                                    });
                                }, '');
                            },
                            filter: html`
                                <div style="height:50px;" class="w-100 border-bottom ">
                                    <input
                                        class="form-control h-100 "
                                        style="border: none;"
                                        placeholder="搜尋用戶名稱"
                                        onchange="${gvc.event((e, event) => {
                                            vm.query = e.value;
                                            gvc.notifyDataChange(id);
                                        })}"
                                        value="${vm.query || ''}"
                                    />
                                </div>
                                ${gvc.bindView(() => {
                                    return {
                                        bind: filterID,
                                        view: () => {
                                            if (
                                                !vm.dataList ||
                                                !vm.dataList.find((dd: any) => {
                                                    return dd.checked;
                                                })
                                            ) {
                                                return ``;
                                            } else {
                                                return [
                                                    html`<span class="fs-7 fw-bold">操作選項</span>`,
                                                    html`<button
                                                        class="btn btn-danger fs-7 px-2"
                                                        style="height:30px;border:none;"
                                                        onclick="${gvc.event(() => {
                                                            const dialog = new ShareDialog(gvc.glitter);
                                                            dialog.checkYesOrNot({
                                                                text: '是否確認移除所選項目?',
                                                                callback: (response) => {
                                                                    if (response) {
                                                                        dialog.dataLoading({ visible: true });
                                                                        Chat.deleteChatRoom({
                                                                            id: vm.dataList
                                                                                .filter((dd: any) => {
                                                                                    return dd.checked;
                                                                                })
                                                                                .map((dd: any) => {
                                                                                    return dd.id;
                                                                                })
                                                                                .join(`,`),
                                                                        }).then((res) => {
                                                                            dialog.dataLoading({ visible: false });
                                                                            if (res.result) {
                                                                                vm.dataList = undefined;
                                                                                gvc.notifyDataChange(id);
                                                                            } else {
                                                                                dialog.errorMessage({ text: '刪除失敗' });
                                                                            }
                                                                        });
                                                                    }
                                                                },
                                                            });
                                                        })}"
                                                    >
                                                        批量移除
                                                    </button>`,
                                                ].join(``);
                                            }
                                        },
                                        divCreate: () => {
                                            return {
                                                class: `d-flex align-items-center p-2 py-3 ${
                                                    !vm.dataList ||
                                                    !vm.dataList.find((dd: any) => {
                                                        return dd.checked;
                                                    }) ||
                                                    type === 'select'
                                                        ? `d-none`
                                                        : ``
                                                }`,
                                                style: `height:40px;gap:10px;margin-top:10px;`,
                                            };
                                        },
                                    };
                                })}
                            `,
                        })}
                    `);
                },
                divCreate: {
                    class: type === 'select' ? `m-n4` : ``,
                },
            };
        });
    }
}

(window as any).glitter.setModule(import.meta.url, BgNotify);
