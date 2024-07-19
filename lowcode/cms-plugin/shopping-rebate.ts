import { GVC } from '../glitterBundle/GVController.js';
import { ShareDialog } from '../dialog/ShareDialog.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { ApiWallet } from '../glitter-base/route/wallet.js';
import { UserList } from './user-list.js';

export class ShoppingRebate {
    public static main(gvc: GVC) {
        const glitter = gvc.glitter;
        const html = String.raw;
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
                        return BgWidget.container(
                            html`
                                <div class="d-flex w-100 align-items-center">
                                    ${BgWidget.title('購物金紀錄')}
                                    <div class="flex-fill"></div>
                                    ${BgWidget.darkButton(
                                        '新增紀錄',
                                        gvc.event(() => {
                                            gvc.glitter.innerDialog((gvc2) => {
                                                const vm = {
                                                    type: 'add',
                                                    value: '0',
                                                    note: '',
                                                    rebateEndDay: '0',
                                                };
                                                return html`<div class="modal-content bg-white rounded-3 p-2" style="max-width: 90%; width: 400px;">
                                                    <div>
                                                        <div style="height: 50px; margin-bottom: 16px" class="d-flex align-items-center border-bottom">
                                                            <span class="ps-2 tx_700">新增紀錄</span>
                                                        </div>
                                                        ${gvc.bindView(() => {
                                                            const id = gvc.glitter.getUUID();
                                                            return {
                                                                bind: id,
                                                                view: () => {
                                                                    return [
                                                                        html`<div>
                                                                            ${EditorElem.radio({
                                                                                title: html`<h6 class="tx_700">類型</h6>`,
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
                                                                            })}
                                                                        </div>`,
                                                                        html`<div class="row">
                                                                            <div class="col-6">
                                                                                ${EditorElem.editeInput({
                                                                                    title: html`<h6 class="tx_700">金額</h6>`,
                                                                                    gvc: gvc,
                                                                                    default: vm.value,
                                                                                    type: 'number',
                                                                                    placeHolder: '設定數值',
                                                                                    callback: (text) => {
                                                                                        vm.value = text;
                                                                                        gvc.notifyDataChange(id);
                                                                                    },
                                                                                })}
                                                                            </div>
                                                                            <div class="col-6">
                                                                                ${EditorElem.editeInput({
                                                                                    title: html`<h6 class="tx_700">可使用天數</h6>`,
                                                                                    gvc: gvc,
                                                                                    default: vm.rebateEndDay,
                                                                                    type: 'number',
                                                                                    placeHolder: '設定數值',
                                                                                    callback: (text) => {
                                                                                        vm.rebateEndDay = text;
                                                                                        gvc.notifyDataChange(id);
                                                                                    },
                                                                                    unit: '天',
                                                                                    readonly: vm.type !== 'add',
                                                                                })}
                                                                                ${BgWidget.grayNote('輸入0，則為無期限', 'margin-top:6px; font-size: 14px;')}
                                                                            </div>
                                                                        </div>`,
                                                                        html`<div>
                                                                            ${EditorElem.editeText({
                                                                                title: html`<h6 class="tx_700">備註</h6>`,
                                                                                gvc: gvc,
                                                                                default: vm.note,
                                                                                placeHolder: '輸入備註',
                                                                                callback: (text) => {
                                                                                    vm.note = text;
                                                                                    gvc.notifyDataChange(id);
                                                                                },
                                                                            })}
                                                                        </div>`,
                                                                    ].join(``);
                                                                },
                                                                divCreate: {
                                                                    class: `p-2`,
                                                                    style: `display: flex; gap: 12px; flex-direction: column;`,
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
                                                                        return html`
                                                                            <div>
                                                                                ${BgWidget.container(
                                                                                    BgWidget.mainCard(
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
                                                                                                                    rebateEndDay: vm.rebateEndDay,
                                                                                                                }).then((result) => {
                                                                                                                    dialog.dataLoading({ visible: false });
                                                                                                                    if (result.response.result) {
                                                                                                                        dialog.successMessage({ text: `設定成功` });
                                                                                                                        gvc.closeDialog();
                                                                                                                        gvc2.closeDialog();
                                                                                                                        refresh();
                                                                                                                    } else {
                                                                                                                        dialog.errorMessage({ text: result.response.msg });
                                                                                                                    }
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
                                                                                                html`<div class="mx-n2">
                                                                                                    ${UserList.userManager(gvc, 'select', (data) => {
                                                                                                        dataList = data;
                                                                                                    })}
                                                                                                    <div></div>
                                                                                                </div>`,
                                                                                        ].join('')
                                                                                    ),
                                                                                    900,
                                                                                    'max-height: 80vh; overflow-y: auto; padding: 0;'
                                                                                )}
                                                                            </div>
                                                                        `;
                                                                    }, 'email');
                                                                })}"
                                                            >
                                                                選擇用戶
                                                                <i class="fa-solid fa-arrow-right ms-2"></i>
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
                                            getData: (vmi) => {
                                                const limit = 15;
                                                ApiWallet.getRebate({
                                                    page: vmi.page - 1,
                                                    limit: limit,
                                                    search: vm.query || undefined,
                                                }).then((data) => {
                                                    vmi.pageSize = Math.ceil(data.response.total / limit);
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
                                                                    value: `<span class="fs-7">${dd.name ?? '資料異常'}</span>`,
                                                                },
                                                                {
                                                                    key: '購物金來源',
                                                                    value: (() => {
                                                                        let text = '';
                                                                        if (dd.content.order_id) {
                                                                            text = `訂單編號：${dd.content.order_id}`;
                                                                        } else {
                                                                            switch (dd.content.type) {
                                                                                case 'manual':
                                                                                    text = '手動設定';
                                                                                    break;
                                                                                case 'first_regiser':
                                                                                    text = '新加入會員';
                                                                                    break;
                                                                                case 'birth':
                                                                                    text = '生日禮';
                                                                                    break;
                                                                                default:
                                                                                    text = dd.origin < 0 ? '使用折抵' : '其他';
                                                                                    break;
                                                                            }
                                                                        }
                                                                        return html`<span class="fs-7">${text}</span>`;
                                                                    })(),
                                                                },
                                                                {
                                                                    key: '增減金額',
                                                                    value: (() => {
                                                                        if (dd.origin > 0) {
                                                                            return html`<span class="tx_700 text-success">+ ${dd.origin}</span>`;
                                                                        }
                                                                        return html`<span class="tx_700 text-danger">- ${dd.origin * -1}</span>`;
                                                                    })(),
                                                                },
                                                                {
                                                                    key: '剩餘金額',
                                                                    value: (() => {
                                                                        if (dd.origin < 0) {
                                                                            return html`<span class="tx_700">-</span>`;
                                                                        }
                                                                        if (dd.remain > 0) {
                                                                            return html`<span class="tx_700 text-success">+ ${dd.remain}</span>`;
                                                                        }
                                                                        return html`<span class="tx_700">0</span>`;
                                                                    })(),
                                                                },
                                                                {
                                                                    key: '備註',
                                                                    value: `<span class="fs-7">${typeof dd.note === 'string' ? dd.note : (dd.note && dd.note.note) ?? '尚未填寫備註'}</span>`,
                                                                },
                                                                {
                                                                    key: '建立時間',
                                                                    value: `<span class="fs-7">${glitter.ut.dateFormat(new Date(dd.created_at), 'yyyy-MM-dd hh:mm:ss')}</span>`,
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
                                                    '搜尋顧客信箱、姓名'
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
                                                                return '';
                                                            } else {
                                                                const dialog = new ShareDialog(gvc.glitter);
                                                                const selCount = vm.dataList.filter((dd: any) => dd.checked).length;
                                                                return BgWidget.selNavbar({
                                                                    count: selCount,
                                                                    buttonList: [],
                                                                });
                                                            }
                                                        },
                                                        divCreate: () => {
                                                            return {
                                                                class: `d-flex align-items-center mt-2 p-2 py-3 ${
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
                                        })
                                    ) + BgWidget.mbContainer(120)
                                )}
                            `,
                            BgWidget.getContainerWidth()
                        );
                    } else if (vm.type == 'replace') {
                        return UserList.userInformationDetail({
                            userID: vm.data.user_id,
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

(window as any).glitter.setModule(import.meta.url, ShoppingRebate);
