import { GVC } from '../glitterBundle/GVController.js';
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { BgListComponent } from '../backend-manager/bg-list-component.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { FormWidget } from '../official_view_component/official/form.js';
import { ApiWallet } from '../glitter-base/route/wallet.js';
import { ApiShop } from '../glitter-base/route/shopping.js';
import { ShoppingOrderManager } from './shopping-order-manager.js';
import { FilterOptions } from './filter-options.js';

const html = String.raw;

interface ViewModel {
    id: string;
    filterId: string;
    type: 'list' | 'add' | 'replace' | 'select';
    data: any;
    dataList: any;
    query?: string;
    queryType?: string;
    orderString?: string;
    filter?: any;
}

export class UserList {
    public static main(gvc: GVC) {
        const glitter = gvc.glitter;

        const vm: ViewModel = {
            id: glitter.getUUID(),
            type: 'list',
            data: {},
            dataList: undefined,
            query: '',
            queryType: '',
            orderString: '',
            filter: {},
            filterId: glitter.getUUID(),
        };

        const ListComp = new BgListComponent(gvc, vm, FilterOptions.userFilterFrame);

        vm.filter = ListComp.getFilterObject();
        let vmi: any = undefined;

        function getDatalist() {
            return vm.dataList.map((dd: any) => {
                return [
                    {
                        key: EditorElem.checkBoxOnly({
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
                                gvc.notifyDataChange(vm.filterId);
                            },
                        }),
                        value: EditorElem.checkBoxOnly({
                            gvc: gvc,
                            def: dd.checked,
                            callback: (result) => {
                                dd.checked = result;
                                vmi.data = getDatalist();
                                vmi.callback();
                                gvc.notifyDataChange(vm.filterId);
                            },
                            style: 'height:25px;',
                        }),
                    },
                    {
                        key: '顧客名稱',
                        value: `<span class="fs-7">${dd.userData.name}</span>`,
                    },
                    {
                        key: '電子信箱',
                        value: `<span class="fs-7">${dd.userData.email}</span>`,
                    },
                    {
                        key: '訂單',
                        value: `<span class="fs-7">${dd.checkout_count} 筆</span>`,
                    },
                    {
                        key: '會員等級',
                        value: `<span class="fs-7">${dd.tag_name}</span>`,
                    },
                    {
                        key: '累積消費',
                        value: `<span class="fs-7">$ ${parseInt(`${dd.checkout_total}`, 10).toLocaleString()}</span>`,
                    },
                    {
                        key: '建立時間',
                        value: `<span class="fs-7">${glitter.ut.dateFormat(new Date(dd.created_time), 'yyyy-MM-dd hh:mm')}</span>`,
                    },
                    {
                        key: '用戶狀態',
                        value: (() => {
                            if (dd.status === 1) {
                                return `<div class="badge bg-info fs-7" style="max-height:34px;">啟用中</div>`;
                            } else {
                                return `<div class="badge bg-danger fs-7" style="max-height:34px;">已停用</div>`;
                            }
                        })(),
                    },
                ];
            });
        }

        return gvc.bindView(() => {
            return {
                bind: vm.id,
                dataList: [{ obj: vm, key: 'type' }],
                view: () => {
                    if (vm.type === 'list') {
                        return BgWidget.container(
                            html`
                                <div class="d-flex w-100 align-items-center">
                                    ${BgWidget.title('顧客列表')}
                                    <div class="flex-fill"></div>
                                    <button
                                        class="btn hoverBtn me-2 px-3 d-none"
                                        style="height:35px !important;font-size: 14px;color:black;border:1px solid black;"
                                        onclick="${gvc.event(() => {
                                            UserList.setUserForm(gvc, () => {
                                                gvc.notifyDataChange(vm.id);
                                            });
                                        })}"
                                    >
                                        <i class="fa-regular fa-gear me-2 "></i>
                                        自訂資料
                                    </button>
                                </div>
                                ${BgWidget.tableV2({
                                    gvc: gvc,
                                    getData: (vd) => {
                                        vmi = vd;
                                        const limit = 2;
                                        ApiUser.getUserListOrders({
                                            page: vmi.page - 1,
                                            limit: limit,
                                            search: vm.query || undefined,
                                            searchType: vm.queryType || 'name',
                                            orderString: vm.orderString || '',
                                            filter: vm.filter,
                                        }).then((data) => {
                                            vmi.pageSize = Math.ceil(data.response.total / limit);
                                            vm.dataList = data.response.data;
                                            vmi.data = getDatalist();
                                            vmi.callback();
                                        });
                                    },
                                    rowClick: (data, index) => {
                                        vm.data = vm.dataList[index];
                                        vm.type = 'replace';
                                    },
                                    filter: html`
                                        <div>
                                            <div style="display: flex; align-items: center; gap: 10px;">
                                                ${BgWidget.selectFilter({
                                                    gvc,
                                                    callback: (value: any) => {
                                                        vm.queryType = value;
                                                        gvc.notifyDataChange(vm.id);
                                                    },
                                                    default: vm.queryType || 'name',
                                                    options: FilterOptions.userSelect,
                                                })}
                                                ${BgWidget.searchFilter(
                                                    gvc.event((e, event) => {
                                                        vm.query = e.value;
                                                        gvc.notifyDataChange(vm.id);
                                                    }),
                                                    vm.query || '',
                                                    '搜尋所有用戶'
                                                )}
                                                ${BgWidget.funnelFilter({
                                                    gvc,
                                                    callback: () => ListComp.showRightMenu(FilterOptions.userFunnel),
                                                })}
                                                ${BgWidget.updownFilter({
                                                    gvc,
                                                    callback: (value: any) => {
                                                        vm.orderString = value;
                                                        gvc.notifyDataChange(vm.id);
                                                    },
                                                    default: vm.orderString || 'default',
                                                    options: FilterOptions.userOrderBy,
                                                })}
                                            </div>
                                            <div>${ListComp.getFilterTags(FilterOptions.userFunnel)}</div>
                                        </div>
                                        ${gvc.bindView(() => {
                                            return {
                                                bind: vm.filterId,
                                                view: () => {
                                                    return [
                                                        html`<span class="fs-7 fw-bold">操作選項</span
                                                            ><button
                                                                class="btn btn-danger fs-7 px-2"
                                                                style="height: 30px; border: none;"
                                                                onclick="${gvc.event(() => {
                                                                    const dialog = new ShareDialog(gvc.glitter);
                                                                    dialog.checkYesOrNot({
                                                                        text: '是否確認移除所選項目?',
                                                                        callback: (response) => {
                                                                            if (response) {
                                                                                dialog.dataLoading({ visible: true });
                                                                                ApiUser.deleteUser({
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
                                                                                        gvc.notifyDataChange(vm.id);
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
                                                        style: `height: 40px; gap: 10px; margin-top: 10px;`,
                                                    };
                                                },
                                            };
                                        })}
                                    `,
                                    table_style: `
                                        background-color: #fff;
                                        margin: 24px 0 !important;
                                        padding: 32px 42px !important;
                                        border-radius: 10px;
                                        background: #fff;
                                        box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.08);
                                    `,
                                })}
                            `,
                            1200
                        );
                    } else if (vm.type == 'replace') {
                        return this.userInformationDetail({
                            userID: vm.data.userID,
                            callback: () => {
                                vm.type = 'list';
                            },
                            gvc: gvc,
                        });
                    } else {
                        return ``;
                    }
                },
                divCreate: {
                    style: 'margin: 0 32px;',
                },
            };
        });
    }

    public static setUserForm(gvc: GVC, callback: () => void) {
        const dialog = new ShareDialog(gvc.glitter);
        const saasConfig: {
            config: any;
            api: any;
        } = (window.parent as any).saasConfig;
        new Promise(async (resolve, reject) => {
            let data = ((await saasConfig.api.getPrivateConfig(saasConfig.config.appName, `glitterUserForm`)).response.result[0] ?? {}).value;
            if (!Array.isArray(data)) {
                data = [];
            }
            EditorElem.openEditorDialog(
                gvc,
                (gvc) => {
                    return [
                        gvc.bindView(() => {
                            const id = gvc.glitter.getUUID();
                            return {
                                bind: id,
                                view: () => {
                                    return FormWidget.settingView({
                                        gvc: gvc,
                                        array: data,
                                        refresh: () => {
                                            setTimeout(() => {
                                                gvc.notifyDataChange(id);
                                            }, 100);
                                        },
                                        title: '',
                                        styleSetting: false,
                                        concat: (dd) => {
                                            dd.auth = dd.auth ?? 'all';
                                            return [
                                                EditorElem.select({
                                                    title: '更改資料權限',
                                                    gvc: gvc,
                                                    def: dd.auth,
                                                    array: [
                                                        { title: '用戶與管理員', value: 'all' },
                                                        { title: '僅管理員', value: 'manager' },
                                                    ],
                                                    callback: (text) => {
                                                        dd.auth = text;
                                                    },
                                                }),
                                            ];
                                        },
                                    });
                                },
                            };
                        }),
                        html`<div class="d-flex">
                            <div class="flex-fill"></div>
                            <div
                                class=" btn-primary-c btn my-2 me-2"
                                style="margin-left: 10px;height:35px;"
                                onclick="${gvc.event(() => {
                                    dialog.dataLoading({ text: '設定中', visible: true });
                                    saasConfig.api.setPrivateConfig(saasConfig.config.appName, 'glitterUserForm', data).then((r: { response: any; result: boolean }) => {
                                        setTimeout(() => {
                                            dialog.dataLoading({ visible: false });
                                            if (r.response) {
                                                dialog.successMessage({ text: '設定成功' });
                                                callback();
                                            } else {
                                                dialog.errorMessage({ text: '設定失敗' });
                                            }
                                        }, 1000);
                                    });
                                    gvc.closeDialog();
                                })}"
                            >
                                儲存設定
                            </div>
                        </div>`,
                    ].join('');
                },
                () => {
                    return new Promise((resolve, reject) => {
                        const dialog = new ShareDialog(gvc.glitter);
                        dialog.checkYesOrNot({
                            text: '是否取消除儲存?',
                            callback: (response) => {
                                resolve(response);
                            },
                        });
                    });
                },
                500,
                '自訂表單'
            );
        });
    }

    public static userInformationDetail(cf: { userID: string; gvc: GVC; callback: () => void; type?: 'readonly' | 'write' }) {
        const html = String.raw;
        const gvc = cf.gvc;
        const id = gvc.glitter.getUUID();
        const vm: any = {
            data: undefined,
            userData: undefined,
            loading: true,
            type: 'list',
        };

        function regetData() {
            ApiUser.getPublicUserData(cf.userID).then((dd) => {
                vm.data = dd.response;
                vm.userData = vm.data;
                vm.loading = false;
                gvc.notifyDataChange(id);
            });
        }

        function getOrderlist(data: any) {
            return data.map((dd: any) => {
                return [
                    {
                        key: '訂單編號',
                        value: html`<div style="max-width: 100px;overflow: hidden;white-space: normal;color: #4D86DB;word-break: break-all;">${dd.orderData.orderID}</div>`,
                    },
                    {
                        key: '訂單日期',
                        value: html`<div style="max-width: 100px;overflow: hidden;white-space: normal;word-break: break-all;">
                            ${gvc.glitter.ut.dateFormat(new Date(dd.created_time), 'yyyy-MM-dd hh:mm')}
                        </div>`,
                    },
                    {
                        key: '總金額',
                        value: dd.orderData.total,
                    },
                    {
                        key: '訂單狀態',
                        value: (() => {
                            if (dd.orderData.progress) {
                                const status = ApiShop.getShippingStatusArray().find((item) => item.value === dd.orderData.progress);
                                if (status) {
                                    return status ? status.title : '尚未設定出貨狀態';
                                }
                            }
                            return '尚未設定出貨狀態';
                        })(),
                    },
                    {
                        key: '',
                        value: BgWidget.grayButton(
                            '查閱',
                            gvc.event(() => {
                                vm.userData = JSON.parse(JSON.stringify(vm.data));
                                vm.data = dd;
                                vm.type = 'order';
                                gvc.notifyDataChange(id);
                            })
                        ),
                    },
                ];
            });
        }

        function getRebatelist(data: any) {
            return data.map((dd: any) => {
                return [
                    { key: '日期', value: gvc.glitter.ut.dateFormat(new Date(dd.created_time), 'yyyy-MM-dd hh:mm') },
                    { key: '回饋金項目', value: dd.note.note ?? '' },
                    { key: '款項', value: dd.money },
                    { key: '到期日', value: dd.money > 0 ? '永不到期' : '-' },
                    // { key: '餘額', value: 0 },
                ];
            });
        }
        regetData();
        return gvc.bindView(() => {
            return {
                bind: id,
                dataList: [{ obj: vm, key: 'type' }],
                view: () => {
                    if (vm.loading) {
                        // ! spinner position
                        return html`<div class="w-100 h-100 d-flex align-items-center"><div class="spinner-border"></div></div>`;
                    }

                    vm.data.userData = vm.data.userData ?? {};

                    const saasConfig: { config: any; api: any } = (window.parent as any).saasConfig;

                    switch (vm.type) {
                        case 'order':
                            return ShoppingOrderManager.replaceOrder(gvc, vm, id);
                        case 'list':
                        default:
                            vm.data = JSON.parse(JSON.stringify(vm.userData));
                            return BgWidget.container(
                                [
                                    // 上層導覽
                                    html`<div class="d-flex w-100 align-items-center">
                                            ${BgWidget.goBack(
                                                gvc.event(() => {
                                                    cf.callback();
                                                })
                                            )}
                                            ${BgWidget.title(vm.data.userData.name ?? '匿名用戶')}
                                        </div>
                                        <div style="margin: 2px 15px 0">${BgWidget.grayNote(`註冊時間：${gvc.glitter.ut.dateFormat(new Date(vm.data.created_time), 'yyyy-MM-dd hh:mm')}`)}</div>`,
                                    // 左右容器
                                    html`<div class="d-flex justify-content-center" style="gap: 24px">
                                        ${BgWidget.container(
                                            [
                                                // 顧客資料
                                                html`<div>
                                                    ${gvc.bindView(() => {
                                                        const id = gvc.glitter.getUUID();
                                                        const vmi: { mode: 'edit' | 'read' | 'block' } = { mode: 'read' };
                                                        return {
                                                            bind: id,
                                                            view: () => {
                                                                return BgWidget.card_main(
                                                                    html`<div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                                                        <span class="cms_left_items">顧客資訊</span>
                                                                        <div style="display: flex; gap: 8px;">
                                                                            ${BgWidget.grayButton(
                                                                                vmi.mode === 'edit' ? '修改關閉' : '修改啟用',
                                                                                gvc.event(() => {
                                                                                    vmi.mode = vmi.mode === 'edit' ? 'read' : 'edit';
                                                                                    gvc.notifyDataChange(id);
                                                                                })
                                                                            )}
                                                                            ${BgWidget.grayButton(
                                                                                '自訂資料',
                                                                                gvc.event(() => {
                                                                                    UserList.setUserForm(gvc, () => {
                                                                                        gvc.notifyDataChange(id);
                                                                                    });
                                                                                })
                                                                            )}
                                                                        </div>
                                                                    </div>` +
                                                                        gvc.bindView(() => {
                                                                            const id = gvc.glitter.getUUID();
                                                                            return {
                                                                                bind: id,
                                                                                view: () => {
                                                                                    return new Promise(async (resolve, reject) => {
                                                                                        let data = (
                                                                                            (await saasConfig.api.getPrivateConfig(saasConfig.config.appName, `glitterUserForm`)).response.result[0] ??
                                                                                            {}
                                                                                        ).value;
                                                                                        if (!Array.isArray(data)) {
                                                                                            data = [];
                                                                                        }

                                                                                        let h = '';
                                                                                        data.map((item: any) => {
                                                                                            if (item.page) {
                                                                                                item.type = 'form_plugin_v2';
                                                                                                item.group = '';
                                                                                            }
                                                                                            if (item.group === '個人履歷') {
                                                                                                return ``;
                                                                                            }
                                                                                            switch (item.page) {
                                                                                                case 'input':
                                                                                                    h += html`<div>
                                                                                                        <div class="t_39_16">${item.title}</div>
                                                                                                        <div>
                                                                                                            ${BgWidget.editeInput({
                                                                                                                gvc: gvc,
                                                                                                                title: '',
                                                                                                                default: vm.data.userData[item.key] || '',
                                                                                                                placeHolder: `請輸入${item.title}`,
                                                                                                                callback: (text) => {
                                                                                                                    vm.data.userData[item.key] = text;
                                                                                                                    gvc.notifyDataChange(id);
                                                                                                                },
                                                                                                                readonly: vmi.mode !== 'edit',
                                                                                                            })}
                                                                                                        </div>
                                                                                                    </div>`;
                                                                                                    break;
                                                                                                case 'multiple_line_text':
                                                                                                    h += html`<div>
                                                                                                        <div class="t_39_16">${item.title}</div>
                                                                                                        ${BgWidget.textArea({
                                                                                                            gvc: gvc,
                                                                                                            title: '',
                                                                                                            default: vm.data.userData[item.key] || '',
                                                                                                            placeHolder: `請輸入${item.title}`,
                                                                                                            callback: (text) => {
                                                                                                                vm.data.userData[item.key] = text;
                                                                                                                gvc.notifyDataChange(id);
                                                                                                            },
                                                                                                            readonly: vmi.mode !== 'edit',
                                                                                                        })}
                                                                                                    </div>`;
                                                                                                    break;
                                                                                                default:
                                                                                                    h += FormWidget.editorView({
                                                                                                        gvc: gvc,
                                                                                                        array: [item],
                                                                                                        refresh: () => {},
                                                                                                        formData: vm.data.userData,
                                                                                                        readonly: vmi.mode === 'edit' ? 'write' : 'read',
                                                                                                    });
                                                                                                    break;
                                                                                            }
                                                                                        });
                                                                                        resolve(html`<div style="display:flex; gap: 18px; flex-direction: column;">${h}</div>`);
                                                                                    });
                                                                                },
                                                                            };
                                                                        })
                                                                );
                                                            },
                                                        };
                                                    })}
                                                </div>`,
                                                // 訂單記錄
                                                html`<div>
                                                    ${gvc.bindView(() => {
                                                        const id = gvc.glitter.getUUID();
                                                        return {
                                                            bind: id,
                                                            view: () => {
                                                                return BgWidget.card_main(
                                                                    html`<div style="display: flex; margin-bottom: 8px;">
                                                                        <span class="cms_left_items">訂單記錄</span>
                                                                    </div>` +
                                                                        gvc.bindView(() => {
                                                                            const id = gvc.glitter.getUUID();
                                                                            return {
                                                                                bind: id,
                                                                                view: () => {
                                                                                    const limit = 10;
                                                                                    return new Promise(async (resolve, reject) => {
                                                                                        const h = BgWidget.tableV2({
                                                                                            gvc: gvc,
                                                                                            getData: (vd) => {
                                                                                                ApiShop.getOrder({
                                                                                                    page: vd.page - 1,
                                                                                                    limit: limit,
                                                                                                    data_from: 'manager',
                                                                                                    email: vm.data.account,
                                                                                                    status: 1,
                                                                                                }).then((data) => {
                                                                                                    vd.pageSize = Math.ceil(data.response.total / limit);
                                                                                                    vm.dataList = data.response.data;
                                                                                                    vd.data = getOrderlist(vm.dataList);
                                                                                                    vd.loading = false;
                                                                                                    vd.callback();
                                                                                                });
                                                                                            },
                                                                                            rowClick: (data, index) => {},
                                                                                            filter: '',
                                                                                            style: new Array(5).fill('').map(() => {
                                                                                                return 'text-wrap: nowrap; align-content: center;';
                                                                                            }),
                                                                                            tableHeader: ['訂單編號', '訂單日期', '總金額', '訂單狀態', ''],
                                                                                        });
                                                                                        resolve(html`<div style="display:flex; gap: 18px; flex-direction: column;">${h}</div>`);
                                                                                    });
                                                                                },
                                                                            };
                                                                        })
                                                                );
                                                            },
                                                        };
                                                    })}
                                                </div>`,
                                                // 回饋金
                                                html`<div>
                                                    ${gvc.bindView(() => {
                                                        const id = gvc.glitter.getUUID();
                                                        return {
                                                            bind: id,
                                                            view: () => {
                                                                return BgWidget.card_main(
                                                                    html`<div style="display: flex; margin-bottom: 12px;">
                                                                        <span class="cms_left_items">回饋金</span>
                                                                    </div>` +
                                                                        html`<div style="display: flex; margin-bottom: 18px; align-items: center; gap: 18px">
                                                                            <span class="cms_left_items">現有回饋金</span>
                                                                            <span style="font-size: 24px; font-weight: 400; color: #393939;"
                                                                                >${gvc.bindView({
                                                                                    bind: vm.id,
                                                                                    view: () => {
                                                                                        return new Promise<string>((resolve, reject) => {
                                                                                            ApiWallet.getRebateSum({
                                                                                                userID: vm.data.userID,
                                                                                            }).then((data) => {
                                                                                                if (data.result) {
                                                                                                    resolve(parseInt(data.response.sum, 10).toLocaleString());
                                                                                                }
                                                                                                resolve('發生錯誤');
                                                                                            });
                                                                                        });
                                                                                    },
                                                                                })}</span
                                                                            >
                                                                        </div>` +
                                                                        html`<div style="display: flex; margin-bottom: 18px;">
                                                                            <span class="cms_left_items">回饋金紀錄</span>
                                                                        </div>` +
                                                                        gvc.bindView(() => {
                                                                            const id = gvc.glitter.getUUID();
                                                                            return {
                                                                                bind: id,
                                                                                view: () => {
                                                                                    const limit = 10;
                                                                                    return new Promise(async (resolve, reject) => {
                                                                                        const h = BgWidget.tableV2({
                                                                                            gvc: gvc,
                                                                                            getData: (vd) => {
                                                                                                ApiWallet.getRebate({
                                                                                                    page: vd.page - 1,
                                                                                                    limit: limit,
                                                                                                    id: vm.data.userID,
                                                                                                    dataType: 'all',
                                                                                                }).then((data) => {
                                                                                                    vd.pageSize = Math.ceil(data.response.total / limit);
                                                                                                    vm.dataList = data.response.data;
                                                                                                    vd.data = getRebatelist(vm.dataList);
                                                                                                    vd.loading = false;
                                                                                                    vd.callback();
                                                                                                });
                                                                                            },
                                                                                            rowClick: (data, index) => {},
                                                                                            filter: '',
                                                                                            style: new Array(5).fill('').map(() => {
                                                                                                return 'text-wrap: nowrap; align-content: center;';
                                                                                            }),
                                                                                        });
                                                                                        resolve(html`<div style="display:flex; gap: 18px; flex-direction: column;">${h}</div>`);
                                                                                    });
                                                                                },
                                                                            };
                                                                        })
                                                                );
                                                            },
                                                        };
                                                    })}
                                                </div>`,
                                            ].join(html`<div style="margin-top: 24px"></div>`),
                                            738,
                                            'padding: 0; margin: 0 !important;'
                                        )}
                                        ${BgWidget.container(
                                            // 會員等級
                                            html`<div>
                                                ${gvc.bindView(() => {
                                                    const id = gvc.glitter.getUUID();
                                                    return {
                                                        bind: id,
                                                        view: () => {
                                                            return BgWidget.card_main(
                                                                gvc.bindView(() => {
                                                                    const id = gvc.glitter.getUUID();
                                                                    return {
                                                                        bind: id,
                                                                        view: () => {
                                                                            return new Promise(async (resolve, reject) => {
                                                                                let data = (
                                                                                    (await saasConfig.api.getPrivateConfig(saasConfig.config.appName, `glitterUserForm`)).response.result[0] ?? {}
                                                                                ).value;
                                                                                if (!Array.isArray(data)) {
                                                                                    data = [];
                                                                                }
                                                                                let h = html`
                                                                                    <div class="gray-bottom-line-18">
                                                                                        <div class="cms_left_items">會員等級</div>
                                                                                        <div style="margin-top: 12px">
                                                                                            <div class="badge bg-warning fs-7" style="max-height:34px;">
                                                                                                ${(
                                                                                                    vm.data.member.find((dd: any) => {
                                                                                                        return dd.trigger;
                                                                                                    }) || {}
                                                                                                ).tag_name || '一般會員'}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    ${(() => {
                                                                                        const id = gvc.glitter.getUUID();
                                                                                        return gvc.bindView({
                                                                                            bind: id,
                                                                                            view: () => {
                                                                                                return new Promise<string>((resolve, reject) => {
                                                                                                    ApiShop.getOrder({
                                                                                                        page: 0,
                                                                                                        limit: 99999,
                                                                                                        data_from: 'manager',
                                                                                                        email: vm.data.account,
                                                                                                        status: 1,
                                                                                                    }).then((data) => {
                                                                                                        let total_price = 0;
                                                                                                        data.response.data.map((item: any) => {
                                                                                                            total_price += item.orderData.total;
                                                                                                        });
                                                                                                        const formatNum = (n: string | number) => parseInt(`${n}`, 10).toLocaleString();

                                                                                                        resolve(html`<div class="gray-bottom-line-18">
                                                                                                            <div class="cms_left_items">消費總金額</div>
                                                                                                            ${total_price === 0
                                                                                                                ? html`<div
                                                                                                                      style="font-size: 14px; font-weight: 400; color: #393939; margin-top: 12px;"
                                                                                                                  >
                                                                                                                      此顧客還沒有任何消費紀錄
                                                                                                                  </div>`
                                                                                                                : html`<div
                                                                                                                      style="font-size: 32px; font-weight: 400; color: #393939; margin-top: 12px;"
                                                                                                                  >
                                                                                                                      ${formatNum(total_price)}
                                                                                                                  </div>`}
                                                                                                            <div class="cms_left_items" style="margin-top: 18px">消費次數</div>
                                                                                                            <div style="font-size: 32px; font-weight: 400; color: #393939; margin-top: 12px;">
                                                                                                                ${formatNum(data.response.total)}
                                                                                                            </div>
                                                                                                        </div>`);
                                                                                                    });
                                                                                                });
                                                                                            },
                                                                                        });
                                                                                    })()}

                                                                                    <div class="d-none">
                                                                                        <div class="cms_left_items">所屬分群</div>
                                                                                        <div style="display: flex; gap: 12px; margin-top: 12px; flex-direction: column;">
                                                                                            <div>電子郵件訂閱者</div>
                                                                                            <div>已購買多次的顧客</div>
                                                                                        </div>
                                                                                    </div>
                                                                                `;
                                                                                resolve(html`<div style="display:flex; gap: 18px; flex-direction: column;">${h}</div>`);
                                                                            });
                                                                        },
                                                                    };
                                                                })
                                                            );
                                                        },
                                                    };
                                                })}
                                            </div>`,
                                            262,
                                            'padding: 0; margin: 0 !important;'
                                        )}
                                    </div>`,
                                    // 空白容器
                                    html`<div style="margin-bottom: 240px"></div>`,
                                    // 儲存資料
                                    html` <div class="update-bar-container">
                                        ${BgWidget.cancel(gvc.event(() => cf.callback()))}
                                        ${BgWidget.save(
                                            gvc.event(() => {
                                                const dialog = new ShareDialog(gvc.glitter);
                                                dialog.dataLoading({ text: '更新中', visible: true });

                                                ApiUser.updateUserDataManager(vm.data, vm.data.userID).then((response) => {
                                                    dialog.dataLoading({ text: '', visible: false });
                                                    if (response.result) {
                                                        regetData();
                                                        dialog.successMessage({ text: '更新成功!' });
                                                        vm.loading = true;
                                                        gvc.notifyDataChange(id);
                                                    } else {
                                                        dialog.errorMessage({ text: '更新異常!' });
                                                    }
                                                });
                                            })
                                        )}
                                    </div>`,
                                ].join(html`<div style="margin-top: 24px"></div>`),
                                1000
                            );
                    }
                },
                onCreate: () => {
                    if (vm.loading) {
                        ApiUser.getPublicUserData(cf.userID).then((dd) => {
                            vm.data = dd.response;
                            vm.userData = vm.data;
                            vm.loading = false;
                            gvc.notifyDataChange(id);
                        });
                    }
                },
            };
        });
    }

    public static userManager(gvc: GVC, type: 'select' | 'list' = 'list', callback: (list: any[]) => void = () => {}) {
        const glitter = gvc.glitter;
        const vm: {
            type: 'list' | 'add' | 'replace' | 'select';
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
        let vmi: any = undefined;

        function getDatalist() {
            return vm.dataList.map((dd: any) => {
                return [
                    {
                        key: EditorElem.checkBoxOnly({
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
                        }),
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
                        key: '用戶名稱',
                        value: `<span class="fs-7">${dd.userData.name}</span>`,
                    },
                    {
                        key: '用戶信箱',
                        value: `<span class="fs-7">${dd.userData.email}</span>`,
                    },
                    {
                        key: '建立時間',
                        value: `<span class="fs-7">${glitter.ut.dateFormat(new Date(dd.created_time), 'yyyy-MM-dd hh:mm')}</span>`,
                    },
                    {
                        key: '用戶狀態',
                        value: (() => {
                            if (dd.status === 1) {
                                return `<div class="badge bg-info fs-7" style="max-height:34px;">啟用中</div>`;
                            } else {
                                return `<div class="badge bg-danger fs-7" style="max-height:34px;">已停用</div>`;
                            }
                        })(),
                    },
                ];
            });
        }

        const html = String.raw;
        return gvc.bindView(() => {
            const id = glitter.getUUID();
            return {
                bind: id,
                dataList: [{ obj: vm, key: 'type' }],
                view: () => {
                    if (vm.type === 'list') {
                        return BgWidget.container(html`
                            <div class="d-flex w-100 align-items-center mb-3 ${type === 'select' ? `d-none` : ``}">
                                ${type === 'select' ? BgWidget.title('選擇用戶') : BgWidget.title('用戶管理')}
                                <div class="flex-fill"></div>
                                <button
                                    class="btn hoverBtn me-2 px-3"
                                    style="height:35px !important;font-size: 14px;color:black;border:1px solid black;"
                                    onclick="${gvc.event(() => {
                                        UserList.setUserForm(gvc, () => {
                                            gvc.notifyDataChange(id);
                                        });
                                    })}"
                                >
                                    <i class="fa-regular fa-gear me-2 "></i>
                                    自訂資料
                                </button>
                            </div>
                            ${BgWidget.table({
                                gvc: gvc,
                                getData: (vd) => {
                                    vmi = vd;
                                    ApiUser.getUserList({
                                        page: vmi.page - 1,
                                        limit: 20,
                                        search: vm.query || undefined,
                                    }).then((data) => {
                                        vmi.pageSize = Math.ceil(data.response.total / 20);
                                        vm.dataList = data.response.data;
                                        vmi.data = getDatalist();
                                        vmi.loading = false;
                                        vmi.callback();
                                    });
                                },
                                rowClick: (data, index) => {
                                    if (type === 'select') {
                                        vm.dataList[index].checked = !vm.dataList[index].checked;
                                        vmi.data = getDatalist();
                                        vmi.callback();
                                        callback(
                                            vm.dataList.filter((dd: any) => {
                                                return dd.checked;
                                            })
                                        );
                                    } else {
                                        vm.data = vm.dataList[index];
                                        vm.type = 'replace';
                                    }
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
                                                    }) ||
                                                    type === 'select'
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
                                                                            ApiUser.deleteUser({
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
                    } else if (vm.type == 'replace') {
                        return this.userInformationDetail({
                            userID: vm.data.userID,
                            callback: () => {
                                vm.type = 'list';
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

(window as any).glitter.setModule(import.meta.url, UserList);
