var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
import { ShoppingRebate } from './shopping-rebate.js';
import { Tool } from '../modules/tool.js';
import { CheckInput } from '../modules/checkInput.js';
import { BgNotify } from '../backend-manager/bg-notify.js';
const html = String.raw;
export class UserList {
    static main(gvc, obj) {
        const glitter = gvc.glitter;
        const vm = {
            id: glitter.getUUID(),
            type: 'list',
            data: {},
            dataList: undefined,
            query: '',
            queryType: '',
            orderString: '',
            filter: {},
            filter_type: `normal`,
            filterId: glitter.getUUID(),
            tableId: glitter.getUUID(),
            initial_data: {},
        };
        const ListComp = new BgListComponent(gvc, vm, FilterOptions.userFilterFrame);
        vm.filter = ListComp.getFilterObject();
        let vmi = undefined;
        function getDatalist() {
            return vm.dataList.map((dd) => {
                return [
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
                        key: '上次登入時間',
                        value: `<span class="fs-7">${glitter.ut.dateFormat(new Date(dd.online_time), 'yyyy-MM-dd hh:mm')}</span>`,
                    },
                    {
                        key: '用戶狀態',
                        value: (() => {
                            if (dd.status === 1) {
                                return html `<div class="badge bg-info fs-7" style="max-height:34px;">啟用中</div>`;
                            }
                            else {
                                return html `<div class="badge bg-danger fs-7" style="max-height:34px;">已停用</div>`;
                            }
                        })(),
                    },
                ];
            });
        }
        if (localStorage.getItem('add_member')) {
            vm.type = 'create';
            vm.initial_data = JSON.parse(localStorage.getItem('add_member'));
            localStorage.removeItem('add_member');
        }
        return gvc.bindView({
            bind: vm.id,
            dataList: [{ obj: vm, key: 'type' }],
            view: () => {
                var _a, _b;
                if (vm.type === 'list') {
                    return BgWidget.container(html `
                            <div class="title-container">
                                ${(() => {
                        if (obj && obj.group && obj.backButtonEvent) {
                            return BgWidget.goBack(obj.backButtonEvent) + BgWidget.title(obj.group.title);
                        }
                        return BgWidget.title('顧客列表');
                    })()}
                                <div class="flex-fill"></div>
                                ${BgWidget.darkButton('新增', (_a = obj === null || obj === void 0 ? void 0 : obj.createUserEvent) !== null && _a !== void 0 ? _a : gvc.event(() => {
                        vm.type = 'create';
                    }))}
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
                            <div class="title-container">
                                ${BgWidget.tab(((_b = obj === null || obj === void 0 ? void 0 : obj.group) === null || _b === void 0 ? void 0 : _b.type) === 'subscriber'
                        ? [
                            {
                                title: '一般列表',
                                key: 'normal',
                            },
                            {
                                title: '黑名單',
                                key: 'block',
                            },
                            {
                                title: '未註冊',
                                key: 'notRegistered',
                            },
                        ]
                        : [
                            {
                                title: '一般列表',
                                key: 'normal',
                            },
                            {
                                title: '黑名單',
                                key: 'block',
                            },
                        ], gvc, vm.filter_type, (text) => {
                        vm.filter_type = text;
                        gvc.notifyDataChange(vm.id);
                    }, `margin:0;margin-top:24px;`)}
                            </div>
                            ${BgWidget.container((() => {
                        if (vm.filter_type === 'notRegistered') {
                            return BgNotify.email(gvc, 'list', () => {
                                return obj === null || obj === void 0 ? void 0 : obj.backButtonEvent;
                            });
                        }
                        return BgWidget.mainCard([
                            (() => {
                                const id = gvc.glitter.getUUID();
                                return gvc.bindView({
                                    bind: id,
                                    view: () => {
                                        const filterList = [
                                            BgWidget.selectFilter({
                                                gvc,
                                                callback: (value) => {
                                                    vm.queryType = value;
                                                    gvc.notifyDataChange(vm.tableId);
                                                    gvc.notifyDataChange(id);
                                                },
                                                default: vm.queryType || 'name',
                                                options: FilterOptions.userSelect,
                                            }),
                                            BgWidget.searchFilter(gvc.event((e) => {
                                                vm.query = `${e.value}`.trim();
                                                gvc.notifyDataChange(vm.tableId);
                                                gvc.notifyDataChange(id);
                                            }), vm.query || '', '搜尋所有用戶'),
                                            BgWidget.funnelFilter({
                                                gvc,
                                                callback: () => ListComp.showRightMenu(FilterOptions.userFunnel),
                                            }),
                                            BgWidget.updownFilter({
                                                gvc,
                                                callback: (value) => {
                                                    vm.orderString = value;
                                                    gvc.notifyDataChange(vm.tableId);
                                                    gvc.notifyDataChange(id);
                                                },
                                                default: vm.orderString || 'default',
                                                options: FilterOptions.userOrderBy,
                                            }),
                                        ];
                                        const filterTags = ListComp.getFilterTags(FilterOptions.userFunnel);
                                        if (document.body.clientWidth < 768) {
                                            return html ` <div style="display: flex; align-items: center; gap: 10px; width: 100%; justify-content: space-between">
                                                                    <div>${filterList[0]}</div>
                                                                    <div style="display: flex;">
                                                                        <div class="me-2">${filterList[2]}</div>
                                                                        ${filterList[3]}
                                                                    </div>
                                                                </div>
                                                                <div style="display: flex; margin-top: 8px;">${filterList[1]}</div>
                                                                <div>${filterTags}</div>`;
                                        }
                                        else {
                                            return html ` <div style="display: flex; align-items: center; gap: 10px;">${filterList.join('')}</div>
                                                                <div>${filterTags}</div>`;
                                        }
                                    },
                                });
                            })(),
                            gvc.bindView({
                                bind: vm.tableId,
                                view: () => {
                                    return BgWidget.tableV3({
                                        gvc: gvc,
                                        getData: (vd) => {
                                            vmi = vd;
                                            const limit = 20;
                                            ApiUser.getUserListOrders({
                                                page: vmi.page - 1,
                                                limit: limit,
                                                search: vm.query || undefined,
                                                searchType: vm.queryType || 'name',
                                                orderString: vm.orderString || '',
                                                filter: vm.filter,
                                                filter_type: vm.filter_type,
                                                group: obj && obj.group ? obj.group : {},
                                            }).then((data) => {
                                                vm.dataList = data.response.data;
                                                vmi.pageSize = Math.ceil(data.response.total / limit);
                                                vmi.originalData = vm.dataList;
                                                vmi.tableData = getDatalist();
                                                vmi.loading = false;
                                                vmi.callback();
                                            });
                                        },
                                        rowClick: (data, index) => {
                                            vm.data = vm.dataList[index];
                                            vm.type = 'replace';
                                        },
                                        filter: [
                                            {
                                                name: '批量刪除',
                                                event: (checkedData) => {
                                                    const dialog = new ShareDialog(gvc.glitter);
                                                    dialog.warningMessage({
                                                        text: '您即將批量刪除所選顧客的所有資料<br />此操作無法復原。確定要刪除嗎？',
                                                        callback: (response) => {
                                                            if (response) {
                                                                dialog.dataLoading({ visible: true });
                                                                ApiUser.deleteUser({
                                                                    id: checkedData
                                                                        .map((dd) => {
                                                                        return dd.id;
                                                                    })
                                                                        .join(`,`),
                                                                }).then((res) => {
                                                                    dialog.dataLoading({ visible: false });
                                                                    if (res.result) {
                                                                        vm.dataList = undefined;
                                                                        gvc.notifyDataChange(vm.id);
                                                                    }
                                                                    else {
                                                                        dialog.errorMessage({ text: '刪除失敗' });
                                                                    }
                                                                });
                                                            }
                                                        },
                                                    });
                                                },
                                            },
                                        ],
                                    });
                                },
                            }),
                        ].join(''));
                    })(), undefined)}
                        `);
                }
                else if (vm.type == 'replace') {
                    return this.userInformationDetail({
                        userID: vm.data.userID,
                        callback: () => {
                            vm.type = 'list';
                        },
                        gvc: gvc,
                    });
                }
                else if (vm.type === 'create') {
                    return this.createUser(gvc, vm);
                }
                else {
                    return ``;
                }
            },
        });
    }
    static posSelect(gvc, obj) {
        const glitter = gvc.glitter;
        const vm = {
            id: glitter.getUUID(),
            type: 'list',
            data: {},
            dataList: undefined,
            query: '',
            queryType: '',
            orderString: '',
            filter: {},
            filter_type: `normal`,
            filterId: glitter.getUUID(),
            tableId: glitter.getUUID(),
        };
        const ListComp = new BgListComponent(gvc, vm, FilterOptions.userFilterFrame);
        vm.filter = ListComp.getFilterObject();
        let vmi = undefined;
        function getDatalist() {
            return vm.dataList.map((dd) => {
                return [
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
                        key: '上次登入時間',
                        value: `<span class="fs-7">${glitter.ut.dateFormat(new Date(dd.online_time), 'yyyy-MM-dd hh:mm')}</span>`,
                    },
                    {
                        key: '用戶狀態',
                        value: (() => {
                            if (dd.status === 1) {
                                return html `<div class="badge bg-info fs-7" style="max-height:34px;">啟用中</div>`;
                            }
                            else {
                                return html `<div class="badge bg-danger fs-7" style="max-height:34px;">已停用</div>`;
                            }
                        })(),
                    },
                ];
            });
        }
        return gvc.bindView({
            bind: vm.id,
            dataList: [{ obj: vm, key: 'type' }],
            view: () => {
                if (vm.type === 'list') {
                    return [
                        (() => {
                            const id = gvc.glitter.getUUID();
                            return gvc.bindView({
                                bind: id,
                                view: () => {
                                    const filterList = [
                                        BgWidget.selectFilter({
                                            gvc,
                                            callback: (value) => {
                                                vm.queryType = value;
                                                gvc.notifyDataChange(vm.tableId);
                                                gvc.notifyDataChange(id);
                                            },
                                            default: vm.queryType || 'name',
                                            options: FilterOptions.userSelect,
                                        }),
                                        BgWidget.searchFilter(gvc.event((e) => {
                                            vm.query = `${e.value}`.trim();
                                            gvc.notifyDataChange(vm.tableId);
                                            gvc.notifyDataChange(id);
                                        }), vm.query || '', '搜尋會員電話/編號/名稱'),
                                        BgWidget.funnelFilter({
                                            gvc,
                                            callback: () => ListComp.showRightMenu(FilterOptions.userFunnel),
                                        }),
                                        BgWidget.updownFilter({
                                            gvc,
                                            callback: (value) => {
                                                vm.orderString = value;
                                                gvc.notifyDataChange(vm.tableId);
                                                gvc.notifyDataChange(id);
                                            },
                                            default: vm.orderString || 'default',
                                            options: FilterOptions.userOrderBy,
                                        }),
                                    ];
                                    const filterTags = ListComp.getFilterTags(FilterOptions.userFunnel);
                                    if (document.body.clientWidth < 768) {
                                        return html ` <div style="display: flex; align-items: center; gap: 10px; width: 100%; justify-content: space-between">
                                                <div>${filterList[0]}</div>
                                                <div style="display: flex;">
                                                    <div class="me-2">${filterList[2]}</div>
                                                    ${filterList[3]}
                                                </div>
                                            </div>
                                            <div style="display: flex; margin-top: 8px;">${filterList[1]}</div>
                                            <div>${filterTags}</div>`;
                                    }
                                    else {
                                        return html ` <div style="display: flex; align-items: center; gap: 10px;">${filterList.join('')}</div>
                                            <div>${filterTags}</div>`;
                                    }
                                },
                            });
                        })(),
                        gvc.bindView({
                            bind: vm.tableId,
                            view: () => {
                                return BgWidget.tableV3({
                                    gvc: gvc,
                                    getData: (vd) => {
                                        vmi = vd;
                                        const limit = 20;
                                        ApiUser.getUserListOrders({
                                            page: vmi.page - 1,
                                            limit: limit,
                                            search: vm.query || undefined,
                                            searchType: vm.queryType || 'name',
                                            orderString: vm.orderString || '',
                                            filter: vm.filter,
                                            filter_type: vm.filter_type,
                                            group: obj && obj.group ? obj.group : {},
                                        }).then((data) => {
                                            vm.dataList = data.response.data;
                                            vmi.pageSize = Math.ceil(data.response.total / limit);
                                            vmi.originalData = vm.dataList;
                                            vmi.tableData = getDatalist();
                                            vmi.loading = false;
                                            vmi.callback();
                                        });
                                    },
                                    rowClick: (data, index) => {
                                        vm.data = vm.dataList[index];
                                        vm.type = 'replace';
                                    },
                                    filter: [
                                        {
                                            name: '批量移除',
                                            event: (checkedData) => {
                                                const dialog = new ShareDialog(gvc.glitter);
                                                dialog.checkYesOrNot({
                                                    text: '是否確認刪除所選項目？',
                                                    callback: (response) => {
                                                        if (response) {
                                                            dialog.dataLoading({ visible: true });
                                                            ApiUser.deleteUser({
                                                                id: checkedData
                                                                    .map((dd) => {
                                                                    return dd.id;
                                                                })
                                                                    .join(`,`),
                                                            }).then((res) => {
                                                                dialog.dataLoading({ visible: false });
                                                                if (res.result) {
                                                                    vm.dataList = undefined;
                                                                    gvc.notifyDataChange(vm.id);
                                                                }
                                                                else {
                                                                    dialog.errorMessage({ text: '刪除失敗' });
                                                                }
                                                            });
                                                        }
                                                    },
                                                });
                                            },
                                        },
                                    ],
                                });
                            },
                        }),
                    ].join('');
                }
                else if (vm.type == 'replace') {
                    return this.userInformationDetail({
                        userID: vm.data.userID,
                        callback: () => {
                            vm.type = 'list';
                        },
                        gvc: gvc,
                    });
                }
                else if (vm.type === 'create') {
                    return this.createUser(gvc, vm);
                }
                else {
                    return ``;
                }
            },
        });
    }
    static setUserForm(gvc, callback) {
        const dialog = new ShareDialog(gvc.glitter);
        const saasConfig = window.parent.saasConfig;
        new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            let data = ((_a = (yield saasConfig.api.getPrivateConfig(saasConfig.config.appName, `glitterUserForm`)).response.result[0]) !== null && _a !== void 0 ? _a : {}).value;
            if (!Array.isArray(data)) {
                data = [];
            }
            EditorElem.openEditorDialog(gvc, (gvc) => {
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
                                        var _a;
                                        dd.auth = (_a = dd.auth) !== null && _a !== void 0 ? _a : 'all';
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
                    html ` <div class="d-flex">
                            <div class="flex-fill"></div>
                            <div
                                class=" btn-primary-c btn my-2 me-2"
                                style="margin-left: 10px;height:35px;"
                                onclick="${gvc.event(() => {
                        dialog.dataLoading({ text: '設定中', visible: true });
                        saasConfig.api.setPrivateConfig(saasConfig.config.appName, 'glitterUserForm', data).then((r) => {
                            setTimeout(() => {
                                dialog.dataLoading({ visible: false });
                                if (r.response) {
                                    dialog.successMessage({ text: '設定成功' });
                                    callback();
                                }
                                else {
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
            }, () => {
                return new Promise((resolve, reject) => {
                    const dialog = new ShareDialog(gvc.glitter);
                    dialog.checkYesOrNot({
                        text: '是否取消儲存?',
                        callback: (response) => {
                            resolve(response);
                        },
                    });
                });
            }, 500, '自訂表單');
        }));
    }
    static userInformationDetail(cf) {
        const html = String.raw;
        const gvc = cf.gvc;
        const vm = {
            id: gvc.glitter.getUUID(),
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
                gvc.notifyDataChange(vm.id);
            });
        }
        function getOrderlist(data) {
            return data.map((dd) => {
                return [
                    {
                        key: '訂單編號',
                        value: html ` <div style="overflow: hidden;white-space: normal;color: #4D86DB;word-break: break-all;">${dd.orderData.orderID}</div>`,
                    },
                    {
                        key: '訂單日期',
                        value: html ` <div style="overflow: hidden;white-space: normal;word-break: break-all;">${gvc.glitter.ut.dateFormat(new Date(dd.created_time), 'yyyy-MM-dd hh:mm')}</div>`,
                    },
                    {
                        key: '總金額',
                        value: parseInt(dd.orderData.total, 10).toLocaleString(),
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
                        value: BgWidget.grayButton('查閱', gvc.event(() => {
                            vm.userData = JSON.parse(JSON.stringify(vm.data));
                            vm.data = dd;
                            vm.type = 'order';
                            gvc.notifyDataChange(vm.id);
                        })),
                    },
                ];
            });
        }
        function getRebatelist(data) {
            return data.map((dd) => {
                var _a;
                return [
                    { key: '建立日期', value: gvc.glitter.ut.dateFormat(new Date(dd.created_at), 'yyyy-MM-dd hh:mm'), width: 20 },
                    {
                        key: '到期日期',
                        value: (() => {
                            if (dd.origin <= 0) {
                                return html `<span class="tx_700">-</span>`;
                            }
                            if (dd.deadline && dd.deadline.includes('2999-')) {
                                return '無期限';
                            }
                            return gvc.glitter.ut.dateFormat(new Date(dd.deadline), 'yyyy-MM-dd hh:mm');
                        })(),
                    },
                    { key: '購物金項目', value: (_a = dd.note) !== null && _a !== void 0 ? _a : '' },
                    {
                        key: '增減',
                        value: (() => {
                            if (dd.origin > 0) {
                                return html `<span class="tx_700 text-success">+ ${dd.origin}</span>`;
                            }
                            return html `<span class="tx_700 text-danger">- ${dd.origin * -1}</span>`;
                        })(),
                    },
                    {
                        key: '此筆可使用餘額',
                        value: (() => {
                            const now = new Date();
                            if (dd.origin > 0 && dd.remain > 0 && now > new Date(dd.created_at) && now < new Date(dd.deadline)) {
                                return html `<span class="tx_700 text-success">+ ${dd.remain}</span>`;
                            }
                            return html `<span class="tx_700">0</span>`;
                        })(),
                    },
                ];
            });
        }
        regetData();
        return gvc.bindView(() => {
            return {
                bind: vm.id,
                dataList: [{ obj: vm, key: 'type' }],
                view: () => {
                    var _a, _b, _c, _d;
                    if (vm.loading) {
                        return html `<div class="d-flex w-100 align-items-center pt-5">${BgWidget.spinner()}</div>`;
                    }
                    vm.data.userData = (_a = vm.data.userData) !== null && _a !== void 0 ? _a : {};
                    const saasConfig = window.parent.saasConfig;
                    switch (vm.type) {
                        case 'order':
                            return ShoppingOrderManager.replaceOrder(gvc, vm);
                        case 'list':
                        default:
                            vm.data = JSON.parse(JSON.stringify(vm.userData));
                            function getButtonList() {
                                return html `<div class="ms-auto d-flex" style="gap: 14px;">
                                    ${BgWidget.grayButton('刪除顧客', gvc.event(() => {
                                    const dialog = new ShareDialog(gvc.glitter);
                                    dialog.warningMessage({
                                        text: '您即將刪除此顧客的所有資料，此操作無法復原。確定要刪除嗎？',
                                        callback: (response) => {
                                            if (response) {
                                                dialog.dataLoading({ visible: true });
                                                ApiUser.deleteUser({ id: `${vm.data.id}` }).then(() => {
                                                    dialog.dataLoading({ visible: false });
                                                    dialog.infoMessage({ text: '帳號已刪除完成' });
                                                    cf.callback();
                                                });
                                            }
                                        },
                                    });
                                }))}
                                    ${BgWidget.grayButton(vm.data.status ? '加入黑名單' : '解除黑名單', gvc.event(() => {
                                    const dialog = new ShareDialog(gvc.glitter);
                                    dialog.warningMessage({
                                        text: vm.data.status
                                            ? '加入黑名單之後，此顧客將無法再進行登入、購買及使用其他功能。確定要加入黑名單嗎？'
                                            : '解除黑名單後，此顧客將恢復正常權限，確定要解除黑名單嗎？',
                                        callback: (response) => {
                                            if (response) {
                                                dialog.dataLoading({ text: '更新中', visible: true });
                                                vm.data.userData.type = vm.data.status ? 'block' : 'normal';
                                                ApiUser.updateUserDataManager(vm.data, vm.data.userID).then((response) => {
                                                    dialog.dataLoading({ text: '', visible: false });
                                                    if (response.result) {
                                                        regetData();
                                                        dialog.successMessage({ text: '更新成功' });
                                                        vm.loading = true;
                                                        gvc.notifyDataChange(vm.id);
                                                    }
                                                    else {
                                                        dialog.errorMessage({ text: '更新異常' });
                                                    }
                                                });
                                            }
                                        },
                                    });
                                }))}
                                </div>`;
                            }
                            return BgWidget.container([
                                html `
                                        <div class="title-container">
                                            ${BgWidget.goBack(gvc.event(() => {
                                    cf.callback();
                                }))}
                                            <div class="d-flex ${document.body.clientWidth > 768 ? 'flex-column' : ''}">
                                                <div class="me-3">${BgWidget.title((_b = vm.data.userData.name) !== null && _b !== void 0 ? _b : '匿名用戶')}</div>
                                                <div style="margin-top: 4px">${BgWidget.grayNote(`上次登入時間：${gvc.glitter.ut.dateFormat(new Date(vm.data.online_time), 'yyyy-MM-dd hh:mm')}`)}</div>
                                            </div>
                                            ${document.body.clientWidth > 768 ? getButtonList() : ''}
                                        </div>
                                        ${document.body.clientWidth > 768 ? '' : html ` <div class="title-container mt-3">${getButtonList()}</div>`}
                                    `,
                                BgWidget.container1x2({
                                    html: [
                                        gvc.bindView(() => {
                                            const id = gvc.glitter.getUUID();
                                            const vmi = {
                                                mode: 'read',
                                            };
                                            return {
                                                bind: id,
                                                view: () => {
                                                    return BgWidget.mainCard(html ` <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                                                    <span class="tx_700">顧客資訊</span>
                                                                    <div style="display: flex; gap: 8px;">
                                                                        ${BgWidget.grayButton(vmi.mode === 'edit' ? '關閉修改' : '啟用修改', gvc.event(() => {
                                                        vmi.mode = vmi.mode === 'edit' ? 'read' : 'edit';
                                                        gvc.notifyDataChange(id);
                                                    }))}
                                                                    </div>
                                                                </div>` +
                                                        gvc.bindView(() => {
                                                            const id = gvc.glitter.getUUID();
                                                            return {
                                                                bind: id,
                                                                view: () => {
                                                                    return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                                                                        var _a;
                                                                        let data = ((_a = (yield saasConfig.api.getPrivateConfig(saasConfig.config.appName, `glitterUserForm`)).response.result[0]) !== null && _a !== void 0 ? _a : {}).value;
                                                                        if (!Array.isArray(data)) {
                                                                            data = [];
                                                                        }
                                                                        function loopForm(data, refer_obj) {
                                                                            let h = '';
                                                                            data.map((item) => {
                                                                                if (item.page) {
                                                                                    item.type = 'form_plugin_v2';
                                                                                    item.group = '';
                                                                                }
                                                                                if (item.group === '個人履歷') {
                                                                                    return '';
                                                                                }
                                                                                switch (item.page) {
                                                                                    case 'input':
                                                                                        h += html ` <div>
                                                                                                        <div class="tx_normal">${item.title}</div>
                                                                                                        <div>
                                                                                                            ${BgWidget.editeInput({
                                                                                            gvc: gvc,
                                                                                            title: '',
                                                                                            default: refer_obj[item.key] || '',
                                                                                            placeHolder: `請輸入${item.title}`,
                                                                                            callback: (text) => {
                                                                                                refer_obj[item.key] = text;
                                                                                                gvc.notifyDataChange(id);
                                                                                            },
                                                                                            readonly: vmi.mode !== 'edit',
                                                                                        })}
                                                                                                        </div>
                                                                                                    </div>`;
                                                                                        break;
                                                                                    case 'multiple_line_text':
                                                                                        h += html ` <div>
                                                                                                        <div class="tx_normal">${item.title}</div>
                                                                                                        ${BgWidget.textArea({
                                                                                            gvc: gvc,
                                                                                            title: '',
                                                                                            default: refer_obj[item.key] || '',
                                                                                            placeHolder: `請輸入${item.title}`,
                                                                                            callback: (text) => {
                                                                                                refer_obj[item.key] = text;
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
                                                                                            refresh: () => { },
                                                                                            formData: refer_obj,
                                                                                            readonly: vmi.mode === 'edit' ? 'write' : 'read',
                                                                                        });
                                                                                        break;
                                                                                }
                                                                            });
                                                                            return h;
                                                                        }
                                                                        const form_array_view = [
                                                                            html `<div style="display:flex; gap: 18px; flex-direction: column;">${loopForm(data, vm.data.userData)}</div>`,
                                                                        ];
                                                                        const form_formats = {};
                                                                        const form_keys = ['custom_form_register', 'customer_form_user_setting'];
                                                                        for (const b of form_keys) {
                                                                            form_formats[b] = (yield ApiUser.getPublicConfig(b, 'manager')).response.value || { list: [] };
                                                                            form_formats[b].list.map((dd) => {
                                                                                dd.toggle = false;
                                                                            });
                                                                        }
                                                                        form_formats['custom_form_register'].list.length > 0 &&
                                                                            form_array_view.push([
                                                                                html `<div class="tx_normal fw-bolder mt-2 d-flex flex-column" style="margin-bottom: 12px;">
                                                                                                        註冊頁面表單內容
                                                                                                    </div>
                                                                                                    ${loopForm(form_formats['custom_form_register'].list, vm.data.userData)}`,
                                                                            ].join(''));
                                                                        form_formats['customer_form_user_setting'].list.length > 0 &&
                                                                            form_array_view.push([
                                                                                html `<div class="tx_normal fw-bolder mt-2 d-flex flex-column" style="margin-bottom: 12px;">
                                                                                                        設定頁面表單內容
                                                                                                    </div>
                                                                                                    ${loopForm(form_formats['customer_form_user_setting'].list, vm.data.userData)}`,
                                                                            ].join(''));
                                                                        resolve(form_array_view.join(`<div class="my-4 border"></div>`));
                                                                    }));
                                                                },
                                                            };
                                                        }));
                                                },
                                                divCreate: {
                                                    class: 'p-0',
                                                },
                                            };
                                        }),
                                        BgWidget.mainCard([
                                            [
                                                html `<div class="tx_700">會員等級</div>`,
                                                html `<div class="badge bg-dark fs-7" style="max-height: 34px;">${vm.data.member_level.tag_name}</div>`,
                                            ].join(BgWidget.mbContainer(12)),
                                            [
                                                html `<div class="tx_700">升級方式</div>`,
                                                BgWidget.multiCheckboxContainer(gvc, [
                                                    {
                                                        key: 'auto',
                                                        name: html `<div>
                                                                            根據本站<span
                                                                                style="color: #4D86DB; text-decoration: underline;"
                                                                                onclick="${gvc.event((e, ev) => {
                                                            ev.stopPropagation();
                                                            BgWidget.infoDialog({
                                                                gvc: gvc,
                                                                title: '會員規則',
                                                                innerHTML: BgWidget.tableV3({
                                                                    gvc: gvc,
                                                                    getData: (vd) => {
                                                                        setTimeout(() => {
                                                                            vd.tableData = vm.data.member.map((leadData, index) => {
                                                                                return [
                                                                                    { key: '會員等級', value: leadData.tag_name },
                                                                                    {
                                                                                        key: '升級條件',
                                                                                        value: (() => {
                                                                                            let text = '';
                                                                                            const val = parseInt(`${leadData.og.condition.value}`, 10).toLocaleString();
                                                                                            const condition_type = leadData.og.condition.type === 'single' ? '單筆' : '累積';
                                                                                            if (leadData.og.duration.type === 'noLimit') {
                                                                                                text = `${condition_type}消費額達 NT$${val}`;
                                                                                            }
                                                                                            else {
                                                                                                text = `${leadData.og.duration.value}天內${condition_type}消費額達 NT$${val}`;
                                                                                            }
                                                                                            return text;
                                                                                        })(),
                                                                                    },
                                                                                    {
                                                                                        key: '有效期限',
                                                                                        value: (() => {
                                                                                            let dead_line = '';
                                                                                            if (leadData.og.dead_line.type === 'date') {
                                                                                                const day = [
                                                                                                    { title: '一個月', value: 30 },
                                                                                                    { title: '三個月', value: 90 },
                                                                                                    { title: '六個月', value: 180 },
                                                                                                    { title: '一年', value: 365 },
                                                                                                ].find((item) => {
                                                                                                    return item.value == leadData.og.dead_line.value;
                                                                                                });
                                                                                                dead_line = day ? day.title : `${leadData.og.dead_line.value}天`;
                                                                                            }
                                                                                            if (leadData.og.dead_line.type === 'noLimit') {
                                                                                                dead_line = '沒有期限';
                                                                                            }
                                                                                            return dead_line;
                                                                                        })(),
                                                                                    },
                                                                                ];
                                                                            });
                                                                            vd.originalData = vm.data.member;
                                                                            vd.loading = false;
                                                                            vd.callback();
                                                                        }, 200);
                                                                    },
                                                                    filter: [],
                                                                    rowClick: () => { },
                                                                }),
                                                            });
                                                        })}"
                                                                                >會員規則</span
                                                                            >自動升級
                                                                        </div>`,
                                                    },
                                                    {
                                                        key: 'manual',
                                                        name: '手動調整',
                                                        innerHtml: gvc.bindView((() => {
                                                            const id = gvc.glitter.getUUID();
                                                            let loading = true;
                                                            let options = [];
                                                            return {
                                                                bind: id,
                                                                view: () => {
                                                                    var _a;
                                                                    if (loading) {
                                                                        return BgWidget.spinner();
                                                                    }
                                                                    else {
                                                                        vm.data.userData.level_default = (_a = vm.data.userData.level_default) !== null && _a !== void 0 ? _a : options[0].key;
                                                                        return html `
                                                                                                ${BgWidget.grayNote('針對特殊會員，手動調整後將無法自動升級')}
                                                                                                ${BgWidget.select({
                                                                            gvc: gvc,
                                                                            default: vm.data.userData.level_default,
                                                                            callback: (key) => {
                                                                                vm.data.userData.level_default = key;
                                                                            },
                                                                            options: options,
                                                                            style: 'margin: 8px 0;',
                                                                        })}
                                                                                            `;
                                                                    }
                                                                },
                                                                divCreate: {},
                                                                onCreate: () => {
                                                                    if (loading) {
                                                                        ApiUser.getPublicConfig('member_level_config', 'manager').then((dd) => {
                                                                            if (dd.result && dd.response.value) {
                                                                                options = dd.response.value.levels.map((item) => {
                                                                                    return {
                                                                                        key: `${item.id}`,
                                                                                        value: item.tag_name,
                                                                                    };
                                                                                });
                                                                                loading = false;
                                                                                gvc.notifyDataChange(id);
                                                                            }
                                                                        });
                                                                    }
                                                                },
                                                            };
                                                        })()),
                                                    },
                                                ], [(_c = vm.data.userData.level_status) !== null && _c !== void 0 ? _c : 'auto'], (value) => {
                                                    vm.data.userData.level_status = value[0];
                                                }, { single: true }),
                                            ].join(BgWidget.mbContainer(12)),
                                            [
                                                html `<div class="tx_700">會員有效期</div>`,
                                                html `<div class="tx_noraml">
                                                                ${((_d = vm.data.member_level.dead_line) === null || _d === void 0 ? void 0 : _d.length) > 0 ? Tool.convertDateTimeFormat(vm.data.member_level.dead_line) : '永久'}
                                                            </div>`,
                                            ].join(BgWidget.mbContainer(12)),
                                            [html `<div class="tx_700">註冊時間</div>`, Tool.convertDateTimeFormat(vm.data.created_time)].join(BgWidget.mbContainer(12)),
                                        ].join(BgWidget.mbContainer(18))),
                                        gvc.bindView(() => {
                                            const id = gvc.glitter.getUUID();
                                            return {
                                                bind: id,
                                                view: () => {
                                                    return BgWidget.mainCard(html ` <div style="display: flex; margin-bottom: 8px;">
                                                                    <span class="tx_700">訂單記錄</span>
                                                                </div>` +
                                                        gvc.bindView(() => {
                                                            const id = gvc.glitter.getUUID();
                                                            return {
                                                                bind: id,
                                                                view: () => {
                                                                    const limit = 10;
                                                                    return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                                                                        const h = BgWidget.tableV3({
                                                                            gvc: gvc,
                                                                            getData: (vd) => {
                                                                                ApiShop.getOrder({
                                                                                    page: vd.page - 1,
                                                                                    limit: limit,
                                                                                    data_from: 'manager',
                                                                                    email: vm.data.userData.email,
                                                                                    phone: vm.data.userData.phone,
                                                                                    status: 1,
                                                                                }).then((data) => {
                                                                                    vm.dataList = data.response.data;
                                                                                    vd.pageSize = Math.ceil(data.response.total / limit);
                                                                                    vd.originalData = vm.dataList;
                                                                                    vd.tableData = getOrderlist(vm.dataList);
                                                                                    vd.loading = false;
                                                                                    vd.callback();
                                                                                });
                                                                            },
                                                                            rowClick: () => { },
                                                                            filter: [],
                                                                        });
                                                                        resolve(html ` <div style="display:flex; gap: 18px; flex-direction: column;">${h}</div>`);
                                                                    }));
                                                                },
                                                            };
                                                        }));
                                                },
                                                divCreate: {
                                                    class: 'p-0',
                                                },
                                            };
                                        }),
                                        gvc.bindView(() => {
                                            const id = gvc.glitter.getUUID();
                                            return {
                                                bind: id,
                                                view: () => {
                                                    return BgWidget.mainCard(html ` <div style="display: flex; justify-content: space-between; align-items: center;">
                                                                    <span class="tx_700">購物金</span>
                                                                    <div>
                                                                        ${BgWidget.grayButton('添加購物金', gvc.event(() => {
                                                        ShoppingRebate.newRebateDialog({
                                                            gvc: gvc,
                                                            saveButton: {
                                                                event: (obj) => {
                                                                    const dialog = new ShareDialog(gvc.glitter);
                                                                    dialog.dataLoading({
                                                                        text: '發送中...',
                                                                        visible: true,
                                                                    });
                                                                    ApiWallet.storeRebateByManager({
                                                                        userID: [vm.data.userID],
                                                                        total: (() => {
                                                                            if (obj.type === 'add') {
                                                                                return parseInt(obj.value, 10);
                                                                            }
                                                                            else {
                                                                                const minus = parseInt(obj.value, 10);
                                                                                return minus ? minus * -1 : minus;
                                                                            }
                                                                        })(),
                                                                        note: obj.note,
                                                                        rebateEndDay: obj.rebateEndDay,
                                                                    }).then((result) => {
                                                                        dialog.dataLoading({ visible: false });
                                                                        if (result.response.result) {
                                                                            dialog.successMessage({ text: `設定成功` });
                                                                            setTimeout(() => {
                                                                                gvc.notifyDataChange(id);
                                                                            }, 200);
                                                                        }
                                                                        else {
                                                                            dialog.errorMessage({ text: result.response.msg });
                                                                        }
                                                                    });
                                                                },
                                                                text: '確認',
                                                            },
                                                        });
                                                    }))}
                                                                    </div>
                                                                </div>` +
                                                        html ` <div style="display: flex; margin-bottom: 18px; align-items: center; gap: 18px">
                                                                        <span class="tx_700">現有購物金</span>
                                                                        <span style="font-size: 24px; font-weight: 400; color: #393939;"
                                                                            >${gvc.bindView(() => {
                                                            const id = gvc.glitter.getUUID();
                                                            return {
                                                                bind: id,
                                                                view: () => {
                                                                    return new Promise((resolve, reject) => {
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
                                                            };
                                                        })}</span
                                                                        >
                                                                    </div>` +
                                                        html ` <div style="display: flex; margin-bottom: 18px;">
                                                                        <span class="tx_700">購物金紀錄</span>
                                                                    </div>` +
                                                        gvc.bindView(() => {
                                                            const id = gvc.glitter.getUUID();
                                                            return {
                                                                bind: id,
                                                                view: () => {
                                                                    const limit = 10;
                                                                    return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                                                                        const h = BgWidget.tableV3({
                                                                            gvc: gvc,
                                                                            getData: (vd) => {
                                                                                ApiWallet.getRebate({
                                                                                    page: vd.page - 1,
                                                                                    limit: limit,
                                                                                    search: vm.data.userData.email,
                                                                                }).then((data) => {
                                                                                    vm.dataList = data.response.data;
                                                                                    vd.pageSize = Math.ceil(data.response.total / limit);
                                                                                    vd.originalData = vm.dataList;
                                                                                    vd.tableData = getRebatelist(vm.dataList);
                                                                                    vd.loading = false;
                                                                                    vd.callback();
                                                                                });
                                                                            },
                                                                            rowClick: () => { },
                                                                            filter: [],
                                                                        });
                                                                        resolve(html ` <div style="display:flex; gap: 18px; flex-direction: column;">${h}</div>`);
                                                                    }));
                                                                },
                                                            };
                                                        }));
                                                },
                                                divCreate: {
                                                    class: 'p-0',
                                                },
                                            };
                                        }),
                                    ].join(BgWidget.mbContainer(24)),
                                    ratio: 78,
                                }, {
                                    html: gvc.bindView(() => {
                                        const id = gvc.glitter.getUUID();
                                        return {
                                            bind: id,
                                            view: () => {
                                                return BgWidget.mainCard(gvc.bindView(() => {
                                                    const id = gvc.glitter.getUUID();
                                                    return {
                                                        bind: id,
                                                        view: () => {
                                                            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                                                                var _a;
                                                                let data = ((_a = (yield saasConfig.api.getPrivateConfig(saasConfig.config.appName, `glitterUserForm`)).response.result[0]) !== null && _a !== void 0 ? _a : {})
                                                                    .value;
                                                                if (!Array.isArray(data)) {
                                                                    data = [];
                                                                }
                                                                let h = html `
                                                                                <div class="gray-bottom-line-18">
                                                                                    <div class="tx_700">會員等級</div>
                                                                                    <div style="margin-top: 12px">
                                                                                        <div class="badge bg-dark fs-7" style="max-height: 34px;">${vm.data.member_level.tag_name}</div>
                                                                                    </div>
                                                                                </div>
                                                                                ${(() => {
                                                                    const id = gvc.glitter.getUUID();
                                                                    return gvc.bindView({
                                                                        bind: id,
                                                                        view: () => {
                                                                            return new Promise((resolve, reject) => {
                                                                                ApiShop.getOrder({
                                                                                    page: 0,
                                                                                    limit: 99999,
                                                                                    data_from: 'manager',
                                                                                    email: vm.data.userData.email,
                                                                                    phone: vm.data.userData.phone,
                                                                                    status: 1,
                                                                                }).then((data) => {
                                                                                    let total_price = 0;
                                                                                    data.response.data.map((item) => {
                                                                                        total_price += item.orderData.total;
                                                                                    });
                                                                                    const formatNum = (n) => parseInt(`${n}`, 10).toLocaleString();
                                                                                    resolve(html ` <div class="gray-bottom-line-18">
                                                                                                        <div class="tx_700">消費總金額</div>
                                                                                                        ${total_price === 0
                                                                                        ? html ` <div style="font-size: 14px; font-weight: 400; color: #393939; margin-top: 12px;">
                                                                                                                  此顧客還沒有任何消費紀錄
                                                                                                              </div>`
                                                                                        : html ` <div style="font-size: 32px; font-weight: 400; color: #393939; margin-top: 12px;">
                                                                                                                  ${formatNum(total_price)}
                                                                                                              </div>`}
                                                                                                        <div class="tx_700" style="margin-top: 18px">消費次數</div>
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
                                                                                    <div class="tx_700">所屬分群</div>
                                                                                    <div style="display: flex; gap: 12px; margin-top: 12px; flex-direction: column;">
                                                                                        <div>電子郵件訂閱者</div>
                                                                                        <div>已購買多次的顧客</div>
                                                                                    </div>
                                                                                </div>
                                                                            `;
                                                                resolve(html ` <div style="display:flex; gap: 18px; flex-direction: column;">${h}</div>`);
                                                            }));
                                                        },
                                                    };
                                                }));
                                            },
                                            divCreate: {
                                                class: 'summary-card p-0',
                                            },
                                        };
                                    }),
                                    ratio: 22,
                                }),
                                BgWidget.mbContainer(240),
                                html ` <div class="update-bar-container">
                                        ${BgWidget.cancel(gvc.event(() => cf.callback()))}
                                        ${BgWidget.save(gvc.event(() => {
                                    const dialog = new ShareDialog(gvc.glitter);
                                    dialog.dataLoading({ text: '更新中', visible: true });
                                    ApiUser.updateUserDataManager(vm.data, vm.data.userID).then((response) => {
                                        dialog.dataLoading({ text: '', visible: false });
                                        if (response.result) {
                                            regetData();
                                            dialog.successMessage({ text: '更新成功' });
                                            vm.loading = true;
                                            gvc.notifyDataChange(vm.id);
                                        }
                                        else {
                                            dialog.errorMessage({ text: '更新異常' });
                                        }
                                    });
                                }))}
                                    </div>`,
                            ].join(html ` <div style="margin-top: 24px;"></div>`));
                    }
                },
                onCreate: () => {
                    if (vm.loading) {
                        ApiUser.getPublicUserData(cf.userID).then((dd) => {
                            vm.data = dd.response;
                            vm.userData = vm.data;
                            vm.loading = false;
                            gvc.notifyDataChange(vm.id);
                        });
                    }
                },
            };
        });
    }
    static createUser(gvc, vm) {
        const viewID = gvc.glitter.getUUID();
        const saasConfig = window.parent.saasConfig;
        let userData = vm.initial_data || {
            name: '',
            email: '',
            phone: '',
            birth: '',
            address: '',
            managerNote: '',
        };
        return gvc.bindView({
            bind: viewID,
            view: () => {
                return BgWidget.container(html `
                        <div class="title-container">
                            ${BgWidget.goBack(gvc.event(() => {
                    vm.type = 'list';
                }))}
                            ${BgWidget.title('新增顧客')}
                        </div>
                        <div class="d-flex justify-content-center ${document.body.clientWidth < 768 ? 'flex-column' : ''}" style="gap: 24px; padding: 0;">
                            ${BgWidget.container([
                    gvc.bindView(() => {
                        const id = gvc.glitter.getUUID();
                        const vmi = {
                            mode: 'edit',
                        };
                        return {
                            bind: id,
                            view: () => {
                                return BgWidget.mainCard(html `<div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                                        <span class="tx_700">顧客資訊</span>
                                                    </div>` +
                                    gvc.bindView(() => {
                                        const id = gvc.glitter.getUUID();
                                        return {
                                            bind: id,
                                            view: () => {
                                                return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                                                    var _a;
                                                    let data = ((_a = (yield saasConfig.api.getPrivateConfig(saasConfig.config.appName, `glitterUserForm`)).response.result[0]) !== null && _a !== void 0 ? _a : {})
                                                        .value;
                                                    if (!Array.isArray(data)) {
                                                        data = [];
                                                    }
                                                    function loopForm(data, refer_obj) {
                                                        let h = '';
                                                        data.map((item) => {
                                                            switch (item.page) {
                                                                case 'input':
                                                                    h += html ` <div>
                                                                                            <div class="tx_normal">${item.title}</div>
                                                                                            <div>
                                                                                                ${BgWidget.editeInput({
                                                                        gvc: gvc,
                                                                        title: '',
                                                                        default: refer_obj[item.key] || '',
                                                                        placeHolder: `請輸入${item.title}`,
                                                                        callback: (text) => {
                                                                            refer_obj[item.key] = text;
                                                                        },
                                                                        readonly: vmi.mode !== 'edit',
                                                                    })}
                                                                                            </div>
                                                                                        </div>`;
                                                                    break;
                                                                case 'multiple_line_text':
                                                                    h += html ` <div>
                                                                                            <div class="tx_normal">${item.title}</div>
                                                                                            ${BgWidget.textArea({
                                                                        gvc: gvc,
                                                                        title: '',
                                                                        default: refer_obj[item.key] || '',
                                                                        placeHolder: `請輸入${item.title}`,
                                                                        callback: (text) => {
                                                                            refer_obj[item.key] = text;
                                                                        },
                                                                        readonly: vmi.mode !== 'edit',
                                                                    })}
                                                                                        </div>`;
                                                                    break;
                                                                default:
                                                                    h += FormWidget.editorView({
                                                                        gvc: gvc,
                                                                        array: [item],
                                                                        refresh: () => { },
                                                                        formData: refer_obj,
                                                                        readonly: vmi.mode === 'edit' ? 'write' : 'read',
                                                                    });
                                                                    break;
                                                            }
                                                        });
                                                        return h;
                                                    }
                                                    const form_array_view = [
                                                        html `<div style="display:flex; gap: 12px; flex-direction: column;">${loopForm(data, userData)}</div>`,
                                                    ];
                                                    resolve(form_array_view.join(`<div class="my-4 border"></div>`));
                                                }));
                                            },
                                        };
                                    }));
                            },
                            divCreate: {
                                class: 'p-0',
                            },
                        };
                    }),
                    BgWidget.mbContainer(240),
                    html ` <div class="update-bar-container">
                                        ${BgWidget.cancel(gvc.event(() => {
                        vm.type = 'list';
                    }))}
                                        ${BgWidget.save(gvc.event(() => __awaiter(this, void 0, void 0, function* () {
                        const dialog = new ShareDialog(gvc.glitter);
                        if (CheckInput.isEmpty(userData.name)) {
                            dialog.infoMessage({ text: '請輸入顧客姓名' });
                            return;
                        }
                        if (!CheckInput.isEmail(userData.email)) {
                            dialog.infoMessage({ text: '請輸入正確的電子信箱格式' });
                            return;
                        }
                        if (!CheckInput.isEmpty(userData.phone) && !CheckInput.isTaiwanPhone(userData.phone)) {
                            dialog.infoMessage({ text: BgWidget.taiwanPhoneAlert() });
                            return;
                        }
                        if (!CheckInput.isBirthString(userData.birth)) {
                            dialog.infoMessage({ text: html ` <div class="text-center">生日日期無效，請確認年月日是否正確<br />(ex: 19950107)</div> ` });
                            return;
                        }
                        dialog.dataLoading({ visible: true });
                        if ((yield ApiUser.getPhoneCount(userData.phone)).response.result) {
                            dialog.dataLoading({ visible: false });
                            dialog.errorMessage({ text: '此電話號碼已被註冊' });
                        }
                        else if ((yield ApiUser.getEmailCount(userData.email)).response.result) {
                            dialog.dataLoading({ visible: false });
                            dialog.errorMessage({ text: '此信箱已被註冊' });
                        }
                        else {
                            ApiUser.quickRegister({
                                account: userData.email,
                                pwd: gvc.glitter.getUUID(),
                                userData: userData,
                            }).then((r) => {
                                if (r.result) {
                                    dialog.dataLoading({ visible: false });
                                    dialog.infoMessage({ text: '成功新增會員' });
                                    vm.type = 'list';
                                }
                                else {
                                    dialog.dataLoading({ visible: false });
                                    dialog.errorMessage({ text: '會員建立失敗' });
                                }
                            });
                        }
                    })))}
                                    </div>`,
                ].join(''))}
                        </div>
                    `);
            },
            divCreate: {},
        });
    }
    static userManager(gvc, type = 'list', callback = () => { }) {
        const glitter = gvc.glitter;
        const vm = {
            type: 'list',
            data: {},
            dataList: undefined,
            query: '',
        };
        let vmi = undefined;
        function getDatalist() {
            return vm.dataList.map((dd) => {
                return [
                    {
                        key: '用戶名稱',
                        value: `<span class="fs-7">${dd.userData.name}</span>`,
                    },
                    {
                        key: '用戶信箱',
                        value: `<span class="fs-7">${dd.userData.email}</span>`,
                    },
                    {
                        key: '上次登入時間',
                        value: `<span class="fs-7">${glitter.ut.dateFormat(new Date(dd.online_time), 'yyyy-MM-dd hh:mm')}</span>`,
                    },
                    {
                        key: '用戶狀態',
                        value: (() => {
                            if (dd.status === 1) {
                                return html ` <div class="badge bg-info fs-7" style="max-height:34px;">啟用中</div>`;
                            }
                            else {
                                return html ` <div class="badge bg-danger fs-7" style="max-height:34px;">已停用</div>`;
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
                        return BgWidget.container(html `
                                <div class="title-container ${type === 'select' ? `d-none` : ``}">
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
                                ${BgWidget.mainCard([
                            BgWidget.searchPlace(gvc.event((e, event) => {
                                vm.query = e.value;
                                gvc.notifyDataChange(id);
                            }), vm.query || '', '搜尋所有用戶'),
                            BgWidget.tableV3({
                                gvc: gvc,
                                getData: (vd) => {
                                    vmi = vd;
                                    const limit = type === 'select' ? 10 : 20;
                                    ApiUser.getUserList({
                                        page: vmi.page - 1,
                                        limit: limit,
                                        search: vm.query || undefined,
                                    }).then((data) => {
                                        vm.dataList = data.response.data;
                                        vmi.pageSize = Math.ceil(data.response.total / limit);
                                        vmi.originalData = vm.dataList;
                                        vmi.tableData = getDatalist();
                                        vmi.loading = false;
                                        vmi.callback();
                                    });
                                },
                                rowClick: (data, index) => {
                                    if (type === 'select') {
                                        vm.dataList[index].checked = !vm.dataList[index].checked;
                                        vmi.data = getDatalist();
                                        vmi.callback();
                                        console.log(vm.dataList.filter((dd) => {
                                            return dd.checked;
                                        }));
                                        callback(vm.dataList.filter((dd) => {
                                            return dd.checked;
                                        }));
                                    }
                                    else {
                                        vm.data = vm.dataList[index];
                                        vm.type = 'replace';
                                    }
                                },
                                filter: [
                                    {
                                        name: '批量移除',
                                        event: (checkedData) => {
                                            const dialog = new ShareDialog(gvc.glitter);
                                            dialog.checkYesOrNot({
                                                text: '是否確認刪除所選項目？',
                                                callback: (response) => {
                                                    if (response) {
                                                        dialog.dataLoading({ visible: true });
                                                        ApiUser.deleteUser({
                                                            id: checkedData
                                                                .map((dd) => {
                                                                return dd.id;
                                                            })
                                                                .join(`,`),
                                                        }).then((res) => {
                                                            dialog.dataLoading({ visible: false });
                                                            if (res.result) {
                                                                vm.dataList = undefined;
                                                                gvc.notifyDataChange(id);
                                                            }
                                                            else {
                                                                dialog.errorMessage({ text: '刪除失敗' });
                                                            }
                                                        });
                                                    }
                                                },
                                            });
                                        },
                                    },
                                ],
                            }),
                        ].join(''))}
                            `);
                    }
                    else if (vm.type == 'replace') {
                        return this.userInformationDetail({
                            userID: vm.data.userID,
                            callback: () => {
                                vm.type = 'list';
                            },
                            gvc: gvc,
                        });
                    }
                    else {
                        return ``;
                    }
                },
            };
        });
    }
}
window.glitter.setModule(import.meta.url, UserList);
