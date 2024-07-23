import { GVC } from '../glitterBundle/GVController.js';
import { ShareDialog } from '../dialog/ShareDialog.js';
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { ApiWallet } from '../glitter-base/route/wallet.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { UserList } from './user-list.js';

const html = String.raw;

export class WalletList {
    public static walletList(gvc: GVC) {
        const glitter = gvc.glitter;
        const vm: {
            type: 'list' | 'add' | 'replace';
            data: any;
            dataList: any;
            query?: string;
        } = {
            type: 'list',
            data: {},
            dataList: undefined,
            query: '',
        };
        const filterID = gvc.glitter.getUUID();

        return gvc.bindView(() => {
            const id = glitter.getUUID();
            const dialog = new ShareDialog(gvc.glitter);

            function refresh() {
                gvc.notifyDataChange(id);
            }

            return {
                bind: id,
                dataList: [{ obj: vm, key: 'type' }],
                view: () => {
                    if (vm.type === 'list') {
                        return BgWidget.container(html`
                            <div class="d-flex w-100 align-items-center mb-3 ">
                                ${BgWidget.title('用戶錢包紀錄')}
                                <div class="flex-fill"></div>
                                <button
                                    class="btn hoverBtn me-2 px-3"
                                    style="height:35px !important;font-size: 14px;color:black;border:1px solid black;"
                                    onclick="${gvc.event(() => {
                                        gvc.glitter.innerDialog((gvc2) => {
                                            const vm = {
                                                type: 'add',
                                                value: '0',
                                                note: '',
                                            };
                                            return html`<div class="modal-content bg-white rounded-3 p-2" style="max-width:90%;width:400px;">
                                                <div class="">
                                                    ${gvc.bindView(() => {
                                                        const id = gvc.glitter.getUUID();
                                                        return {
                                                            bind: id,
                                                            view: () => {
                                                                return [
                                                                    html`<div style="height: 50px;" class="d-flex align-items-center  border-bottom">
                                                                        <h3 class="m-0 fs-6">新增紀錄</h3>
                                                                    </div>`,
                                                                    EditorElem.checkBox({
                                                                        title: '類型',
                                                                        gvc: gvc,
                                                                        def: vm.type,
                                                                        array: [
                                                                            { title: '新增', value: 'add' },
                                                                            { title: '減少', value: 'minus' },
                                                                        ],
                                                                        callback: (text) => {
                                                                            vm.type = text;
                                                                            gvc.notifyDataChange(id);
                                                                        },
                                                                    }),
                                                                    EditorElem.editeInput({
                                                                        title: '數值',
                                                                        gvc: gvc,
                                                                        default: vm.value,
                                                                        placeHolder: '設定數值',
                                                                        callback: (text) => {
                                                                            vm.value = text;
                                                                            gvc.notifyDataChange(id);
                                                                        },
                                                                    }),
                                                                    EditorElem.editeText({
                                                                        title: '備註',
                                                                        gvc: gvc,
                                                                        default: vm.note,
                                                                        placeHolder: '輸入備註',
                                                                        callback: (text) => {
                                                                            vm.note = text;
                                                                            gvc.notifyDataChange(id);
                                                                        },
                                                                    }),
                                                                ].join(``);
                                                            },
                                                            divCreate: {
                                                                class: `ps-1 pe-1`,
                                                            },
                                                        };
                                                    })}
                                                    <div class="modal-footer mb-0 pb-0 mt-2 pt-1">
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
                                                                gvc.glitter.innerDialog((gvc) => {
                                                                    let dataList: any = [];
                                                                    return `
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
                                                                                    ${BgWidget.title(`選擇變動對象`)}
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
                                                                                                ApiWallet.storeByManager({
                                                                                                    userID: dataList.map((dd: any) => {
                                                                                                        return dd.userID;
                                                                                                    }),
                                                                                                    total: (() => {
                                                                                                        if (vm.type === 'add') {
                                                                                                            return parseInt(vm.value, 10);
                                                                                                        } else {
                                                                                                            const minus = parseInt(vm.value, 10);
                                                                                                            return minus ? minus * -1 : minus;
                                                                                                        }
                                                                                                    })(),
                                                                                                    note: vm.note,
                                                                                                }).then(() => {
                                                                                                    dialog.dataLoading({
                                                                                                        visible: false,
                                                                                                    });
                                                                                                    dialog.successMessage({ text: `設定成功!` });
                                                                                                    gvc.closeDialog();
                                                                                                    gvc2.closeDialog();
                                                                                                    refresh();
                                                                                                });
                                                                                            } else {
                                                                                                dialog.errorMessage({ text: '請選擇變動對象!' });
                                                                                            }
                                                                                        })}"
                                                                                    >
                                                                                        確認並發送
                                                                                    </button>
                                                                                </div>
                                                                            ` +
                                                                                `<div class="mx-n2">${UserList.userManager(gvc, 'select', (data) => {
                                                                                    dataList = data;
                                                                                })}<div>`,
                                                                        ].join('')
                                                                    ),
                                                                    900
                                                                )}
                                                                <div>
                                                                `;
                                                                }, 'email');
                                                            })}"
                                                        >
                                                            下一步 => 選擇用戶
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>`;
                                        }, 'add');
                                    })}"
                                >
                                    <i class="fa-regular fa-circle-plus me-2"></i>
                                    新增紀錄
                                </button>
                            </div>
                            ${BgWidget.table({
                                gvc: gvc,
                                getData: (vmi) => {
                                    ApiWallet.get({
                                        page: vmi.page - 1,
                                        limit: 20,
                                        search: vm.query || undefined,
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
                                                        key: '用戶名稱',
                                                        value: `<span class="fs-7">${(dd.userData && dd.userData.name) ?? '資料異常'}</span>`,
                                                    },
                                                    {
                                                        key: '金流單號',
                                                        value: `<span class="fs-7">${dd.status === 2 ? `手動新增` : dd.orderID}</span>`,
                                                    },
                                                    {
                                                        key: '異動金額',
                                                        value: `${dd.money > 0 ? `<span class="fs-7 text-success">+ ${dd.money}</span>` : `<span class="fs-7 text-danger">- ${dd.money * -1}</span>`}`,
                                                    },
                                                    {
                                                        key: '備註',
                                                        value: `<span class="fs-7">${typeof dd.note === 'string' ? dd.note : (dd.note && dd.note.note) ?? '尚未填寫備註'}</span>`,
                                                    },
                                                    {
                                                        key: '異動時間',
                                                        value: `<span class="fs-7">${glitter.ut.dateFormat(new Date(dd.created_time), 'yyyy-MM-dd hh:mm')}</span>`,
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
                                    vm.data = vm.dataList[index];
                                    vm.type = 'replace';
                                },
                                filter: html`
                                    ${BgWidget.searchPlace(
                                        gvc.event((e, event) => {
                                            vm.query = e.value;
                                            gvc.notifyDataChange(id);
                                        }),
                                        vm.query || '',
                                        '搜尋所有用戶'
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
                                                    const dialog = new ShareDialog(gvc.glitter);
                                                    const selCount = vm.dataList.filter((dd: any) => dd.checked).length;
                                                    return BgWidget.selNavbar({
                                                        count: selCount,
                                                        buttonList: [
                                                            BgWidget.selEventButton(
                                                                '批量移除',
                                                                gvc.event(() => {
                                                                    dialog.checkYesOrNot({
                                                                        text: '是否確認刪除所選項目？',
                                                                        callback: (response) => {
                                                                            if (response) {
                                                                                dialog.dataLoading({ visible: true });
                                                                                ApiWallet.delete({
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
                                                                })
                                                            ),
                                                        ],
                                                    });
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
                                                    style: ``,
                                                };
                                            },
                                        };
                                    })}
                                `,
                            })}
                        `);
                    } else if (vm.type == 'replace') {
                        return UserList.userInformationDetail({
                            userID: vm.data.userID,
                            callback: () => {
                                vm.type = 'list';
                                gvc.notifyDataChange(id);
                            },
                            gvc: gvc,
                        });
                    } else {
                        return ``;
                    }
                },
            };
        });
    }

    public static withdrawRequest(gvc: GVC) {
        const glitter = gvc.glitter;
        const vm: {
            type: 'list' | 'add' | 'replace';
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
        const filterID = gvc.glitter.getUUID();

        return gvc.bindView(() => {
            const id = glitter.getUUID();
            const dialog = new ShareDialog(gvc.glitter);

            function refresh() {
                gvc.notifyDataChange(id);
            }

            return {
                bind: id,
                dataList: [{ obj: vm, key: 'type' }],
                view: () => {
                    if (vm.type === 'list') {
                        return BgWidget.container(html`
                            <div class="d-flex w-100 align-items-center mb-3 ">
                                ${BgWidget.title('用戶提領請求')}
                                <div class="flex-fill"></div>
                            </div>
                            ${BgWidget.table({
                                gvc: gvc,
                                getData: (vmi) => {
                                    ApiWallet.getWithdraw({
                                        page: vmi.page - 1,
                                        limit: 20,
                                        search: vm.query || undefined,
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
                                                        key: '用戶名稱',
                                                        value: `<span class="fs-7">${(dd.userData && dd.userData.name) ?? '資料異常'}</span>`,
                                                    },
                                                    {
                                                        key: '提領金額',
                                                        value: `<span class="fs-7">${dd.money}</span>`,
                                                    },
                                                    {
                                                        key: '狀態',
                                                        value: (() => {
                                                            switch (dd.status) {
                                                                case 0:
                                                                    return `<div class="badge bg-warning fs-7 " style="color:black;">尚未審核</div>`;
                                                                case -1:
                                                                    return `<div class="badge bg-danger fs-7" style="max-height:34px;">拒絕</div>`;
                                                                case 1:
                                                                    return `<div class="badge  fs-7" style="background:#0000000f;color:black;">已撥款</div>`;
                                                            }
                                                        })(),
                                                    },
                                                    {
                                                        key: '備註',
                                                        value: `<span class="fs-7">${typeof dd.note === 'string' ? dd.note : (dd.note && dd.note.note) ?? '尚未填寫備註'}</span>`,
                                                    },
                                                    {
                                                        key: '申請時間',
                                                        value: `<span class="fs-7">${glitter.ut.dateFormat(new Date(dd.created_time), 'yyyy-MM-dd hh:mm')}</span>`,
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
                                    vm.data = vm.dataList[index];
                                    gvc.glitter.innerDialog((gvc2) => {
                                        return html`<div class="modal-content bg-white rounded-3 p-2" style="max-width:90%;width:400px;">
                                            <div class="">
                                                ${gvc.bindView(() => {
                                                    const id = gvc.glitter.getUUID();
                                                    return {
                                                        bind: id,
                                                        view: () => {
                                                            return [
                                                                html`<div style="height: 50px;" class="d-flex align-items-center  border-bottom">
                                                                    <h3 class="m-0 fs-6">提領請求</h3>
                                                                </div>`,
                                                                html` ${gvc.bindView(() => {
                                                                        return {
                                                                            bind: gvc.glitter.getUUID(),
                                                                            view: () => {
                                                                                return new Promise(async (resolve, reject) => {
                                                                                    const sum = (await ApiWallet.getSum({ userID: vm.data.userID })).response.sum;
                                                                                    if (sum < vm.data.money) {
                                                                                        resolve(`<div class="alert alert-danger  "><strong>請注意當前用戶錢包餘額不足，請勿進行撥款。</strong></div>`);
                                                                                    } else {
                                                                                        resolve(``);
                                                                                    }
                                                                                });
                                                                            },
                                                                            divCreate: {
                                                                                class: `fs-7 text-success mt-2`,
                                                                            },
                                                                        };
                                                                    })}
                                                                    <button
                                                                        type="button"
                                                                        class="btn btn-primary-c w-100 "
                                                                        onclick="${gvc.event(() => {
                                                                            gvc2.glitter.innerDialog((gvc) => {
                                                                                return html`<div style="width:700px;">
                                                                                    ${BgWidget.card(
                                                                                        UserList.userInformationDetail({
                                                                                            userID: vm.data.userID,
                                                                                            gvc: gvc,
                                                                                            callback: () => {
                                                                                                gvc.closeDialog();
                                                                                            },
                                                                                            type: 'readonly',
                                                                                        }),
                                                                                        `p-0 bg-white rounded`
                                                                                    )}
                                                                                </div>`;
                                                                            }, `detail`);
                                                                        })}"
                                                                    >
                                                                        查看用戶詳細資料
                                                                    </button>`,
                                                                EditorElem.select({
                                                                    title: '審核結果',
                                                                    gvc: gvc,
                                                                    def: `${vm.data.status}`,
                                                                    array: [
                                                                        { title: '確認撥款', value: '1' },
                                                                        { title: '拒絕撥款', value: '-1' },
                                                                        { title: '待審核', value: '0' },
                                                                    ],
                                                                    callback: (text) => {
                                                                        vm.data.status = text;
                                                                    },
                                                                    readonly: `${vm.data.status}` === '1',
                                                                }),
                                                                EditorElem.editeInput({
                                                                    title: '提領金額',
                                                                    gvc: gvc,
                                                                    default: vm.data.money,
                                                                    placeHolder: '',
                                                                    callback: (text) => {},
                                                                    readonly: true,
                                                                }),
                                                                EditorElem.editeInput({
                                                                    title: '撥款銀行代號',
                                                                    gvc: gvc,
                                                                    default: vm.data.note.code,
                                                                    placeHolder: '',
                                                                    callback: (text) => {
                                                                        vm.data.note.note = text;
                                                                        gvc.notifyDataChange(id);
                                                                    },
                                                                    readonly: true,
                                                                }),
                                                                EditorElem.editeInput({
                                                                    title: '撥款銀行帳戶',
                                                                    gvc: gvc,
                                                                    default: vm.data.note.number,
                                                                    placeHolder: '',
                                                                    callback: (text) => {
                                                                        vm.data.note.number = text;
                                                                        gvc.notifyDataChange(id);
                                                                    },
                                                                    readonly: true,
                                                                }),
                                                                EditorElem.editeText({
                                                                    title: '備註欄位',
                                                                    gvc: gvc,
                                                                    default: vm.data.note.note,
                                                                    placeHolder: '輸入備註',
                                                                    callback: (text) => {
                                                                        vm.data.note.note = text;
                                                                        gvc.notifyDataChange(id);
                                                                    },
                                                                }),
                                                            ].join(``);
                                                        },
                                                        divCreate: {
                                                            class: `ps-1 pe-1`,
                                                        },
                                                    };
                                                })}
                                                <div class="modal-footer mb-0 pb-0 mt-2 pt-1">
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
                                                            const dialog = new ShareDialog(gvc.glitter);
                                                            dialog.dataLoading({
                                                                text: '變更中...',
                                                                visible: true,
                                                            });
                                                            ApiWallet.withdrawPut({
                                                                id: vm.data.id as number,
                                                                status: vm.data.status as number,
                                                                note: vm.data.note,
                                                            }).then((res) => {
                                                                dialog.dataLoading({
                                                                    visible: false,
                                                                });
                                                                if (!res.result) {
                                                                    dialog.errorMessage({ text: `撥款失敗，用戶錢包金額不足!` });
                                                                    gvc.closeDialog();
                                                                    gvc2.closeDialog();
                                                                } else {
                                                                    dialog.successMessage({ text: `變更成功!` });
                                                                    gvc.closeDialog();
                                                                    gvc2.closeDialog();
                                                                    refresh();
                                                                }
                                                            });
                                                        })}"
                                                    >
                                                        確認變更
                                                    </button>
                                                </div>
                                            </div>
                                        </div>`;
                                    }, 'add');
                                },
                                filter: html`
                                    ${BgWidget.searchPlace(
                                        gvc.event((e, event) => {
                                            vm.query = e.value;
                                            gvc.notifyDataChange(id);
                                        }),
                                        vm.query || '',
                                        '搜尋所有用戶'
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
                                                    const dialog = new ShareDialog(gvc.glitter);
                                                    const selCount = vm.dataList.filter((dd: any) => dd.checked).length;
                                                    return BgWidget.selNavbar({
                                                        count: selCount,
                                                        buttonList: [
                                                            BgWidget.selEventButton(
                                                                '批量移除',
                                                                gvc.event(() => {
                                                                    dialog.checkYesOrNot({
                                                                        text: '是否確認刪除所選項目？',
                                                                        callback: (response) => {
                                                                            if (response) {
                                                                                dialog.dataLoading({ visible: true });
                                                                                ApiWallet.deleteWithdraw({
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
                                                                })
                                                            ),
                                                        ],
                                                    });
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
                                                    style: ``,
                                                };
                                            },
                                        };
                                    })}
                                `,
                            })}
                        `);
                    } else if (vm.type == 'replace') {
                        return ``;
                    } else {
                        return ``;
                    }
                },
            };
        });
    }

    public static rebateList(gvc: GVC) {
        const glitter = gvc.glitter;
        const vm: {
            type: 'list' | 'add' | 'replace';
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
        const filterID = gvc.glitter.getUUID();

        return gvc.bindView(() => {
            const id = glitter.getUUID();
            const dialog = new ShareDialog(gvc.glitter);

            function refresh() {
                gvc.notifyDataChange(id);
            }

            return {
                bind: id,
                dataList: [{ obj: vm, key: 'type' }],
                view: () => {
                    if (vm.type === 'list') {
                        return BgWidget.container(html`
                            <div class="d-flex w-100 align-items-center mb-3 ">
                                ${BgWidget.title('回饋金紀錄')}
                                <div class="flex-fill"></div>
                                <button
                                    class="btn hoverBtn me-2 px-3"
                                    style="height:35px !important;font-size: 14px;color:black;border:1px solid black;"
                                    onclick="${gvc.event(() => {
                                        gvc.glitter.innerDialog((gvc2) => {
                                            const vm = {
                                                type: 'add',
                                                value: '0',
                                                note: '',
                                            };
                                            return `<div class="modal-content bg-white rounded-3 p-2" style="max-width:90%;width:400px;">
                                <div class="">
                                           ${gvc.bindView(() => {
                                               const id = gvc.glitter.getUUID();
                                               return {
                                                   bind: id,
                                                   view: () => {
                                                       return [
                                                           `<div style="height: 50px;" class="d-flex align-items-center  border-bottom">
<h3 class="m-0 fs-6">新增紀錄</h3>
</div>`,
                                                           EditorElem.checkBox({
                                                               title: '類型',
                                                               gvc: gvc,
                                                               def: vm.type,
                                                               array: [
                                                                   { title: '新增', value: 'add' },
                                                                   { title: '減少', value: 'minus' },
                                                               ],
                                                               callback: (text) => {
                                                                   vm.type = text;
                                                                   gvc.notifyDataChange(id);
                                                               },
                                                           }),
                                                           EditorElem.editeInput({
                                                               title: '數值',
                                                               gvc: gvc,
                                                               default: vm.value,
                                                               placeHolder: '設定數值',
                                                               callback: (text) => {
                                                                   vm.value = text;
                                                                   gvc.notifyDataChange(id);
                                                               },
                                                           }),
                                                           EditorElem.editeText({
                                                               title: '備註',
                                                               gvc: gvc,
                                                               default: vm.note,
                                                               placeHolder: '輸入備註',
                                                               callback: (text) => {
                                                                   vm.note = text;
                                                                   gvc.notifyDataChange(id);
                                                               },
                                                           }),
                                                       ].join(``);
                                                   },
                                                   divCreate: {
                                                       class: `ps-1 pe-1`,
                                                   },
                                               };
                                           })}
                                    <div class="modal-footer mb-0 pb-0 mt-2 pt-1">
                                        <button type="button" class="btn btn-outline-dark me-2" onclick="${gvc.event(() => {
                                            gvc2.closeDialog();
                                        })}">取消
                                        </button>
                                        <button type="button" class="btn btn-primary-c" onclick="${gvc.event(() => {
                                            gvc.glitter.innerDialog((gvc) => {
                                                let dataList: any = [];
                                                return `
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
                                                                                    ${BgWidget.title(`選擇變動對象`)}
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
                                                                                                ApiWallet.storeRebateByManager({
                                                                                                    userID: dataList.map((dd: any) => {
                                                                                                        return dd.userID;
                                                                                                    }),
                                                                                                    total: (() => {
                                                                                                        if (vm.type === 'add') {
                                                                                                            return parseInt(vm.value, 10);
                                                                                                        } else {
                                                                                                            const minus = parseInt(vm.value, 10);
                                                                                                            return minus ? minus * -1 : minus;
                                                                                                        }
                                                                                                    })(),
                                                                                                    note: vm.note,
                                                                                                }).then(() => {
                                                                                                    dialog.dataLoading({
                                                                                                        visible: false,
                                                                                                    });
                                                                                                    dialog.successMessage({ text: `設定成功!` });
                                                                                                    gvc.closeDialog();
                                                                                                    gvc2.closeDialog();
                                                                                                    refresh();
                                                                                                });
                                                                                            } else {
                                                                                                dialog.errorMessage({ text: '請選擇變動對象!' });
                                                                                            }
                                                                                        })}"
                                                                                    >
                                                                                        確認並發送
                                                                                    </button>
                                                                                </div>
                                                                            ` +
                                                                                `<div class="mx-n2">${UserList.userManager(gvc, 'select', (data) => {
                                                                                    dataList = data;
                                                                                })}<div>`,
                                                                        ].join('')
                                                                    ),
                                                                    900
                                                                )}
                                                                <div>
                                                                `;
                                            }, 'email');
                                        })}">下一步 => 選擇用戶
                                        </button>
                                    </div>
                                </div>
                            </div>`;
                                        }, 'add');
                                    })}"
                                >
                                    <i class="fa-regular fa-circle-plus me-2"></i>
                                    新增紀錄
                                </button>
                            </div>
                            ${BgWidget.table({
                                gvc: gvc,
                                getData: (vmi) => {
                                    ApiWallet.getRebate({
                                        page: vmi.page - 1,
                                        limit: 20,
                                        search: vm.query || undefined,
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
                                                        key: '用戶名稱',
                                                        value: `<span class="fs-7">${(dd.userData && dd.userData.name) ?? '資料異常'}</span>`,
                                                    },
                                                    {
                                                        key: '訂單編號',
                                                        value: `<span class="fs-7">${dd.status === 2 ? `手動新增` : dd.orderID}</span>`,
                                                    },
                                                    {
                                                        key: '異動金額',
                                                        value: `${dd.money > 0 ? `<span class="fs-7 text-success">+ ${dd.money}</span>` : `<span class="fs-7 text-danger">- ${dd.money * -1}</span>`}`,
                                                    },
                                                    {
                                                        key: '備註',
                                                        value: `<span class="fs-7">${typeof dd.note === 'string' ? dd.note : (dd.note && dd.note.note) ?? '尚未填寫備註'}</span>`,
                                                    },
                                                    {
                                                        key: '異動時間',
                                                        value: `<span class="fs-7">${glitter.ut.dateFormat(new Date(dd.created_time), 'yyyy-MM-dd hh:mm')}</span>`,
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
                                    vm.data = vm.dataList[index];
                                    vm.type = 'replace';
                                },
                                filter: html`
                                    ${BgWidget.searchPlace(
                                        gvc.event((e, event) => {
                                            vm.query = e.value;
                                            gvc.notifyDataChange(id);
                                        }),
                                        vm.query || '',
                                        '搜尋所有用戶'
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
                                                    const dialog = new ShareDialog(gvc.glitter);
                                                    const selCount = vm.dataList.filter((dd: any) => dd.checked).length;
                                                    return BgWidget.selNavbar({
                                                        count: selCount,
                                                        buttonList: [
                                                            BgWidget.selEventButton(
                                                                '批量移除',
                                                                gvc.event(() => {
                                                                    dialog.checkYesOrNot({
                                                                        text: '是否確認刪除所選項目？',
                                                                        callback: (response) => {
                                                                            if (response) {
                                                                                dialog.dataLoading({ visible: true });
                                                                                ApiWallet.deleteRebate({
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
                                                                })
                                                            ),
                                                        ],
                                                    });
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
                                                    style: ``,
                                                };
                                            },
                                        };
                                    })}
                                `,
                            })}
                        `);
                    } else if (vm.type == 'replace') {
                        return UserList.userInformationDetail({
                            userID: vm.data.userID,
                            callback: () => {
                                vm.type = 'list';
                                gvc.notifyDataChange(id);
                            },
                            gvc: gvc,
                        });
                    } else {
                        return ``;
                    }
                },
            };
        });
    }
}

(window as any).glitter.setModule(import.meta.url, WalletList);
