import { GVC } from '../glitterBundle/GVController.js';
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { BgWidget, OptionsItem } from '../backend-manager/bg-widget.js';
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

type ViewModel = {
    id: string;
    filterId: string;
    tableId: string;
    type: 'list' | 'add' | 'replace' | 'select' | 'create';
    data: any;
    dataList: any;
    query?: string;
    queryType?: string;
    orderString?: string;
    filter_type: string;
    filter?: any;
    initial_data?: any;
};

export class UserList {
    public static vm = {
        page: 1,
    };

    public static setUserTags(gvc: GVC, arr: string[]) {
        const dialog = new ShareDialog(gvc.glitter);
        const list = [...new Set(arr)];
        dialog.dataLoading({ visible: false });
        ApiUser.setPublicConfig({
            key: 'user_general_tags',
            value: { list },
            user_id: 'manager',
        }).then(() => {
            dialog.dataLoading({ visible: false });
        });
    }

    public static printOption(gvc: GVC, vmt: { id: string; postData: string[] }, opt: OptionsItem) {
        const id = `user-tag-${opt.key}`;
        opt.key = `${opt.key}`;

        function call() {
            if (vmt.postData.includes(opt.key)) {
                vmt.postData = vmt.postData.filter((item) => item !== opt.key);
            } else {
                vmt.postData.push(opt.key);
            }
            gvc.notifyDataChange(vmt.id);
        }

        return html`<div class="d-flex align-items-center gap-3 mb-3">
            ${gvc.bindView({
                bind: id,
                view: () => {
                    return html`<input
                        class="form-check-input mt-0 ${BgWidget.getCheckedClass(gvc)}"
                        type="checkbox"
                        id="${opt.key}"
                        name="radio_${opt.key}"
                        onclick="${gvc.event(() => call())}"
                        ${vmt.postData.includes(opt.key) ? 'checked' : ''}
                    />`;
                },
                divCreate: {
                    class: 'd-flex align-items-center justify-content-center',
                },
            })}
            <div class="form-check-label c_updown_label cursor_pointer" onclick="${gvc.event(() => call())}">
                <div class="tx_normal ${opt.note ? 'mb-1' : ''}">${opt.value}</div>
                ${opt.note ? html` <div class="tx_gray_12">${opt.note}</div> ` : ''}
            </div>
        </div>`;
    }

    public static renderOptions(gvc: GVC, vmt: { id: string; postData: string[]; dataList: any }) {
        if (vmt.dataList.length === 0) {
            return html`<div class="d-flex justify-content-center fs-5">查無標籤</div>`;
        }
        return vmt.dataList
            .map((item: any) => {
                return UserList.printOption(gvc, vmt, { key: item, value: item });
            })
            .join('');
    }

    public static main(
        gvc: GVC,
        obj?: {
            group?: { type: string; title: string };
            backButtonEvent?: string;
            createUserEvent?: string;
        }
    ) {
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
            filter_type: `normal`,
            filterId: glitter.getUUID(),
            tableId: glitter.getUUID(),
            initial_data: {},
        };

        const ListComp = new BgListComponent(gvc, vm, FilterOptions.userFilterFrame);

        vm.filter = ListComp.getFilterObject();
        let vmi: any = undefined;

        function getDatalist() {
            return vm.dataList.map((dd: any) => {
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
                                return html`<div class="badge bg-info fs-7" style="max-height:34px;">啟用中</div>`;
                            } else {
                                return html`<div class="badge bg-danger fs-7" style="max-height:34px;">已停用</div>`;
                            }
                        })(),
                    },
                ];
            });
        }

        // AI快速生成
        if (localStorage.getItem('add_member')) {
            vm.type = 'create';
            vm.initial_data = JSON.parse(localStorage.getItem('add_member') as string);
            localStorage.removeItem('add_member');
        }

        return gvc.bindView({
            bind: vm.id,
            dataList: [{ obj: vm, key: 'type' }],
            view: () => {
                if (vm.type === 'list') {
                    return BgWidget.container(html`
                        <div class="title-container">
                            ${(() => {
                                if (obj && obj.group && obj.backButtonEvent) {
                                    return BgWidget.goBack(obj.backButtonEvent) + BgWidget.title(obj.group.title);
                                }
                                return BgWidget.title('顧客列表');
                            })()}
                            <div class="flex-fill"></div>
                            ${BgWidget.darkButton(
                                '新增',
                                obj?.createUserEvent ??
                                    gvc.event(() => {
                                        vm.type = 'create';
                                    })
                            )}
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
                            ${BgWidget.tab(
                                obj?.group?.type === 'subscriber'
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
                                      ],
                                gvc,
                                vm.filter_type,
                                (text) => {
                                    vm.filter_type = text as any;
                                    gvc.notifyDataChange(vm.id);
                                },
                                `margin:0;margin-top:24px;`
                            )}
                        </div>
                        ${BgWidget.container(
                            (() => {
                                if (vm.filter_type === 'notRegistered') {
                                    return BgNotify.email(gvc, 'list', () => {
                                        return obj?.backButtonEvent;
                                    });
                                }
                                return BgWidget.mainCard(
                                    [
                                        (() => {
                                            const id = gvc.glitter.getUUID();
                                            return gvc.bindView({
                                                bind: id,
                                                view: () => {
                                                    const filterList = [
                                                        BgWidget.selectFilter({
                                                            gvc,
                                                            callback: (value: any) => {
                                                                vm.queryType = value;
                                                                gvc.notifyDataChange(vm.tableId);
                                                                gvc.notifyDataChange(id);
                                                            },
                                                            default: vm.queryType || 'name',
                                                            options: FilterOptions.userSelect,
                                                        }),
                                                        BgWidget.searchFilter(
                                                            gvc.event((e) => {
                                                                vm.query = `${e.value}`.trim();
                                                                gvc.notifyDataChange(vm.tableId);
                                                                gvc.notifyDataChange(id);
                                                            }),
                                                            vm.query || '',
                                                            '搜尋所有用戶'
                                                        ),
                                                        BgWidget.funnelFilter({
                                                            gvc,
                                                            callback: () => ListComp.showRightMenu(FilterOptions.userFunnel),
                                                        }),
                                                        BgWidget.updownFilter({
                                                            gvc,
                                                            callback: (value: any) => {
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
                                                        // 手機版
                                                        return html` <div style="display: flex; align-items: center; gap: 10px; width: 100%; justify-content: space-between">
                                                                <div>${filterList[0]}</div>
                                                                <div style="display: flex;">${filterList[2] ? `<div class="me-2">${filterList[2]}</div>` : ''} ${filterList[3] ?? ''}</div>
                                                            </div>
                                                            <div style="display: flex; margin-top: 8px;">${filterList[1]}</div>
                                                            <div>${filterTags}</div>`;
                                                    } else {
                                                        // 電腦版
                                                        return html` <div style="display: flex; align-items: center; gap: 10px;">${filterList.join('')}</div>
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
                                                        UserList.vm.page = vmi.page;
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
                                                            if (vmi.pageSize != 0 && vmi.page > vmi.pageSize) {
                                                                UserList.vm.page = 1;
                                                                gvc.notifyDataChange(vm.id);
                                                            }
                                                            vmi.callback();
                                                        });
                                                    },
                                                    rowClick: (data, index) => {
                                                        vm.data = vm.dataList[index];
                                                        vm.type = 'replace';
                                                    },
                                                    filter: [
                                                        {
                                                            name: '新增標籤',
                                                            option: true,
                                                            event: (dataArray) => {
                                                                const vmt = {
                                                                    id: gvc.glitter.getUUID(),
                                                                    loading: true,
                                                                    dataList: [] as string[],
                                                                    postData: JSON.parse(JSON.stringify([])) as string[],
                                                                    search: '',
                                                                };

                                                                BgWidget.settingDialog({
                                                                    gvc,
                                                                    title: '批量新增標籤',
                                                                    innerHTML: (gvc2) => {
                                                                        return gvc2.bindView(
                                                                            (() => {
                                                                                return {
                                                                                    bind: vmt.id,
                                                                                    view: () => {
                                                                                        if (vmt.loading) {
                                                                                            return BgWidget.spinner();
                                                                                        } else {
                                                                                            return [
                                                                                                BgWidget.searchPlace(
                                                                                                    gvc2.event((e) => {
                                                                                                        vmt.search = e.value;
                                                                                                        vmt.loading = true;
                                                                                                        gvc2.notifyDataChange(vmt.id);
                                                                                                    }),
                                                                                                    vmt.search,
                                                                                                    '搜尋標籤',
                                                                                                    '0',
                                                                                                    '0'
                                                                                                ),
                                                                                                BgWidget.grayNote('勾選的標籤將會新增至已選取顧客的資料，未勾選的並不會從顧客資料中移除'),
                                                                                                UserList.renderOptions(gvc2, vmt),
                                                                                            ].join(BgWidget.mbContainer(18));
                                                                                        }
                                                                                    },
                                                                                    divCreate: {},
                                                                                    onCreate: () => {
                                                                                        if (vmt.loading) {
                                                                                            ApiUser.getPublicConfig('user_general_tags', 'manager').then((dd: any) => {
                                                                                                if (dd.result && dd.response?.value?.list) {
                                                                                                    vmt.dataList = dd.response.value.list.filter((item: string) => item.includes(vmt.search));
                                                                                                    vmt.loading = false;
                                                                                                    gvc2.notifyDataChange(vmt.id);
                                                                                                } else {
                                                                                                    UserList.setUserTags(gvc2, []);
                                                                                                }
                                                                                            });
                                                                                        }
                                                                                    },
                                                                                };
                                                                            })()
                                                                        );
                                                                    },
                                                                    footer_html: (gvc2) => {
                                                                        return [
                                                                            html`<div
                                                                                style="color: #393939; text-decoration-line: underline; cursor: pointer"
                                                                                onclick="${gvc2.event(() => {
                                                                                    vmt.postData = [];
                                                                                    vmt.loading = true;
                                                                                    gvc2.notifyDataChange(vmt.id);
                                                                                })}"
                                                                            >
                                                                                清除全部
                                                                            </div>`,
                                                                            BgWidget.cancel(
                                                                                gvc2.event(() => {
                                                                                    gvc2.closeDialog();
                                                                                })
                                                                            ),
                                                                            BgWidget.save(
                                                                                gvc2.event(async () => {
                                                                                    const dialog = new ShareDialog(gvc.glitter);
                                                                                    try {
                                                                                        // 確保 userData.tags 存在，並去重複
                                                                                        dataArray.forEach((item: any) => {
                                                                                            item.userData.tags = item.userData.tags
                                                                                                ? [...new Set([...item.userData.tags, ...vmt.postData])]
                                                                                                : vmt.postData;
                                                                                        });

                                                                                        // 顯示 loading
                                                                                        dialog.dataLoading({ visible: true });

                                                                                        // 更新所有用戶數據
                                                                                        const results = await Promise.allSettled(
                                                                                            dataArray.map((item: any) => ApiUser.updateUserDataManager(item, item.userID))
                                                                                        );

                                                                                        // 檢查是否有失敗
                                                                                        const failedUpdates = results.filter((r) => r.status === 'rejected');
                                                                                        if (failedUpdates.length > 0) {
                                                                                            dialog.errorMessage({ text: `部分用戶更新失敗 (${failedUpdates.length}/${dataArray.length})` });
                                                                                        } else {
                                                                                            dialog.successMessage({ text: '更新成功' });
                                                                                        }

                                                                                        // 隱藏 loading 並關閉對話框
                                                                                        dialog.dataLoading({ visible: false });
                                                                                        gvc2.closeDialog();

                                                                                        // 更新 UI
                                                                                        gvc.notifyDataChange(vm.id);
                                                                                    } catch (error) {
                                                                                        console.error('更新用戶標籤失敗:', error);
                                                                                        dialog.errorMessage({ text: '更新失敗，請稍後再試' });
                                                                                    }
                                                                                })
                                                                            ),
                                                                        ].join('');
                                                                    },
                                                                });
                                                            },
                                                        },
                                                        {
                                                            name: '移除標籤',
                                                            option: true,
                                                            event: (dataArray) => {
                                                                let tagJoinList: Record<string, boolean> = {};
                                                                dataArray.map((item: any) => {
                                                                    if (item.userData.tags) {
                                                                        item.userData.tags.map((tag: string) => {
                                                                            if (!tagJoinList[tag]) {
                                                                                tagJoinList[tag] = true;
                                                                            }
                                                                        });
                                                                    }
                                                                });

                                                                const vmt = {
                                                                    id: gvc.glitter.getUUID(),
                                                                    loading: true,
                                                                    dataList: [] as string[],
                                                                    postData: JSON.parse(JSON.stringify([])) as string[],
                                                                };

                                                                BgWidget.settingDialog({
                                                                    gvc,
                                                                    title: '批量刪除標籤',
                                                                    innerHTML: (gvc2) => {
                                                                        return gvc2.bindView(
                                                                            (() => {
                                                                                return {
                                                                                    bind: vmt.id,
                                                                                    view: () => {
                                                                                        if (vmt.loading) {
                                                                                            return BgWidget.spinner();
                                                                                        } else {
                                                                                            return [
                                                                                                BgWidget.grayNote('勾選的標籤將會從已選取顧客的資料中移除，未勾選的並不會從顧客資料中移除'),
                                                                                                UserList.renderOptions(gvc2, vmt),
                                                                                            ].join(BgWidget.mbContainer(18));
                                                                                        }
                                                                                    },
                                                                                    divCreate: {},
                                                                                    onCreate: () => {
                                                                                        if (vmt.loading) {
                                                                                            ApiUser.getPublicConfig('user_general_tags', 'manager').then((dd: any) => {
                                                                                                if (dd.result && dd.response?.value?.list) {
                                                                                                    vmt.dataList = dd.response.value.list.filter((item: string) => tagJoinList[item]);
                                                                                                    vmt.loading = false;
                                                                                                    gvc2.notifyDataChange(vmt.id);
                                                                                                } else {
                                                                                                    UserList.setUserTags(gvc2, []);
                                                                                                }
                                                                                            });
                                                                                        }
                                                                                    },
                                                                                };
                                                                            })()
                                                                        );
                                                                    },
                                                                    footer_html: (gvc2) => {
                                                                        return [
                                                                            html`<div
                                                                                style="color: #393939; text-decoration-line: underline; cursor: pointer"
                                                                                onclick="${gvc2.event(() => {
                                                                                    vmt.postData = [];
                                                                                    vmt.loading = true;
                                                                                    gvc2.notifyDataChange(vmt.id);
                                                                                })}"
                                                                            >
                                                                                清除全部
                                                                            </div>`,
                                                                            BgWidget.cancel(
                                                                                gvc2.event(() => {
                                                                                    gvc2.closeDialog();
                                                                                })
                                                                            ),
                                                                            BgWidget.save(
                                                                                gvc2.event(async () => {
                                                                                    const dialog = new ShareDialog(gvc.glitter);
                                                                                    try {
                                                                                        const postMap: Map<string, boolean> = new Map(vmt.postData.map((tag) => [tag, true]));

                                                                                        dataArray.forEach((item: any) => {
                                                                                            item.userData.tags = item.userData.tags
                                                                                                ? item.userData.tags.filter((tag: string) => !postMap.get(tag))
                                                                                                : [];
                                                                                        });

                                                                                        // 顯示 loading
                                                                                        dialog.dataLoading({ visible: true });

                                                                                        // 更新所有用戶數據
                                                                                        const results = await Promise.allSettled(
                                                                                            dataArray.map((item: any) => ApiUser.updateUserDataManager(item, item.userID))
                                                                                        );

                                                                                        // 檢查是否有失敗
                                                                                        const failedUpdates = results.filter((r) => r.status === 'rejected');
                                                                                        if (failedUpdates.length > 0) {
                                                                                            dialog.errorMessage({ text: `部分用戶更新失敗 (${failedUpdates.length}/${dataArray.length})` });
                                                                                        } else {
                                                                                            dialog.successMessage({ text: '更新成功' });
                                                                                        }

                                                                                        // 隱藏 loading 並關閉對話框
                                                                                        dialog.dataLoading({ visible: false });
                                                                                        gvc2.closeDialog();

                                                                                        // 更新 UI
                                                                                        gvc.notifyDataChange(vm.id);
                                                                                    } catch (error) {
                                                                                        console.error('更新用戶標籤失敗:', error);
                                                                                        dialog.errorMessage({ text: '更新失敗，請稍後再試' });
                                                                                    }
                                                                                })
                                                                            ),
                                                                        ].join('');
                                                                    },
                                                                });
                                                            },
                                                        },
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
                                                            },
                                                        },
                                                    ],
                                                    def_page: UserList.vm.page,
                                                });
                                            },
                                        }),
                                    ].join('')
                                );
                            })(),
                            undefined
                        )}
                    `);
                } else if (vm.type == 'replace') {
                    return this.userInformationDetail({
                        userID: vm.data.userID,
                        callback: () => {
                            vm.type = 'list';
                        },
                        gvc: gvc,
                    });
                } else if (vm.type === 'create') {
                    return this.createUser(gvc, vm);
                }
                return '';
            },
        });
    }

    public static posSelect(
        gvc: GVC,
        obj?: {
            group?: { type: string; title: string };
            backButtonEvent?: string;
        }
    ) {
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
            filter_type: `normal`,
            filterId: glitter.getUUID(),
            tableId: glitter.getUUID(),
        };

        const ListComp = new BgListComponent(gvc, vm, FilterOptions.userFilterFrame);

        vm.filter = ListComp.getFilterObject();
        let vmi: any = undefined;

        function getDatalist() {
            return vm.dataList.map((dd: any) => {
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
                                return html`<div class="badge bg-info fs-7" style="max-height:34px;">啟用中</div>`;
                            } else {
                                return html`<div class="badge bg-danger fs-7" style="max-height:34px;">已停用</div>`;
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
                                            callback: (value: any) => {
                                                vm.queryType = value;
                                                gvc.notifyDataChange(vm.tableId);
                                                gvc.notifyDataChange(id);
                                            },
                                            default: vm.queryType || 'name',
                                            options: FilterOptions.userSelect,
                                        }),
                                        BgWidget.searchFilter(
                                            gvc.event((e) => {
                                                vm.query = `${e.value}`.trim();
                                                gvc.notifyDataChange(vm.tableId);
                                                gvc.notifyDataChange(id);
                                            }),
                                            vm.query || '',
                                            '搜尋會員電話/編號/名稱'
                                        ),
                                        BgWidget.funnelFilter({
                                            gvc,
                                            callback: () => ListComp.showRightMenu(FilterOptions.userFunnel),
                                        }),
                                        BgWidget.updownFilter({
                                            gvc,
                                            callback: (value: any) => {
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
                                        // 手機版
                                        return html` <div style="display: flex; align-items: center; gap: 10px; width: 100%; justify-content: space-between">
                                                <div>${filterList[0]}</div>
                                                <div style="display: flex;">${filterList[2] ? `<div class="me-2">${filterList[2]}</div>` : ''} ${filterList[3] ?? ''}</div>
                                            </div>
                                            <div style="display: flex; margin-top: 8px;">${filterList[1]}</div>
                                            <div>${filterTags}</div>`;
                                    } else {
                                        // 電腦版
                                        return html` <div style="display: flex; align-items: center; gap: 10px;">${filterList.join('')}</div>
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
                                                                id: checkedData.map((dd: any) => dd.id).join(','),
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
                                            },
                                        },
                                    ],
                                });
                            },
                        }),
                    ].join('');
                } else if (vm.type == 'replace') {
                    return this.userInformationDetail({
                        userID: vm.data.userID,
                        callback: () => {
                            vm.type = 'list';
                        },
                        gvc: gvc,
                    });
                } else if (vm.type === 'create') {
                    return this.createUser(gvc, vm);
                }
                return '';
            },
        });
    }

    public static async setUserForm(gvc: GVC, callback: () => void) {
        const dialog = new ShareDialog(gvc.glitter);
        const saasConfig: { config: any; api: any } = (window.parent as any).saasConfig;

        try {
            let data = ((await saasConfig.api.getPrivateConfig(saasConfig.config.appName, 'glitterUserForm')).response.result[0] ?? {}).value;
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
                                        refresh: () => gvc.notifyDataChange(id),
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
                        html`
                            <div class="d-flex">
                                <div class="flex-fill"></div>
                                <div
                                    class="btn-primary-c btn my-2 me-2"
                                    style="margin-left: 10px;height:35px;"
                                    onclick="${gvc.event(async () => {
                                        try {
                                            dialog.dataLoading({ text: '設定中', visible: true });
                                            const response = await saasConfig.api.setPrivateConfig(saasConfig.config.appName, 'glitterUserForm', data);
                                            dialog.dataLoading({ visible: false });

                                            if (response.response) {
                                                dialog.successMessage({ text: '設定成功' });
                                                callback();
                                            } else {
                                                dialog.errorMessage({ text: '設定失敗' });
                                            }
                                        } catch (err) {
                                            dialog.dataLoading({ visible: false });
                                            dialog.errorMessage({ text: '設定過程中發生錯誤' });
                                            console.error('setUserForm error:', err);
                                        }
                                        gvc.closeDialog();
                                    })}"
                                >
                                    儲存設定
                                </div>
                            </div>
                        `,
                    ].join('');
                },
                () =>
                    new Promise((resolve) => {
                        const confirmDialog = new ShareDialog(gvc.glitter);
                        confirmDialog.checkYesOrNot({
                            text: '是否取消儲存?',
                            callback: resolve,
                        });
                    }),
                500,
                '自訂表單'
            );
        } catch (err) {
            dialog.errorMessage({ text: '載入表單資料失敗' });
            console.error('setUserForm initialization error:', err);
        }
    }

    public static userInformationDetail(cf: { userID: string; gvc: GVC; callback: () => void; type?: 'readonly' | 'write' }): string {
        const html = String.raw;
        const gvc = cf.gvc;
        const vm: any = {
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

        function getOrderlist(data: any) {
            return data.map((dd: any) => {
                return [
                    {
                        key: '訂單編號',
                        value: html` <div style="overflow: hidden;white-space: normal;color: #4D86DB;word-break: break-all;">${dd.orderData.orderID}</div>`,
                    },
                    {
                        key: '訂單日期',
                        value: html` <div style="overflow: hidden;white-space: normal;word-break: break-all;">${gvc.glitter.ut.dateFormat(new Date(dd.created_time), 'yyyy-MM-dd hh:mm')}</div>`,
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
                        value: BgWidget.grayButton(
                            '查閱',
                            gvc.event(() => {
                                vm.userData = JSON.parse(JSON.stringify(vm.data));
                                vm.data = dd;
                                vm.type = 'order';
                                gvc.notifyDataChange(vm.id);
                            })
                        ),
                    },
                ];
            });
        }

        function getRebatelist(data: any) {
            return data.map((dd: any) => {
                return [
                    { key: '建立日期', value: gvc.glitter.ut.dateFormat(new Date(dd.created_at), 'yyyy-MM-dd hh:mm'), width: 20 },
                    {
                        key: '到期日期',
                        value: (() => {
                            if (dd.origin <= 0) {
                                return html`<span class="tx_700">-</span>`;
                            }
                            if (dd.deadline && dd.deadline.includes('2999-')) {
                                return '無期限';
                            }
                            return gvc.glitter.ut.dateFormat(new Date(dd.deadline), 'yyyy-MM-dd hh:mm');
                        })(),
                    },
                    { key: '購物金項目', value: dd.note ?? '' },
                    {
                        key: '增減',
                        value: (() => {
                            if (dd.origin > 0) {
                                return html`<span class="tx_700 text-success">+ ${dd.origin}</span>`;
                            }
                            return html`<span class="tx_700 text-danger">- ${dd.origin * -1}</span>`;
                        })(),
                    },
                    {
                        key: '此筆可使用餘額',
                        value: (() => {
                            const now = new Date();
                            if (dd.origin > 0 && dd.remain > 0 && now > new Date(dd.created_at) && now < new Date(dd.deadline)) {
                                return html`<span class="tx_700 text-success">+ ${dd.remain}</span>`;
                            }
                            return html`<span class="tx_700">0</span>`;
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
                    if (vm.loading) {
                        return html`<div class="d-flex w-100 align-items-center pt-5">${BgWidget.spinner()}</div>`;
                    }

                    vm.data.userData = vm.data.userData ?? {};

                    const saasConfig: { config: any; api: any } = (window.parent as any).saasConfig;
                    switch (vm.type) {
                        case 'order':
                            return ShoppingOrderManager.replaceOrder(gvc, vm);
                        case 'list':
                        default:
                            vm.data = JSON.parse(JSON.stringify(vm.userData));
                            function getButtonList() {
                                return html`<div class="ms-auto d-flex" style="gap: 14px;">
                                    ${BgWidget.grayButton(
                                        '刪除顧客',
                                        gvc.event(() => {
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
                                        })
                                    )}
                                    ${BgWidget.grayButton(
                                        vm.data.status ? '加入黑名單' : '解除黑名單',
                                        gvc.event(() => {
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
                                                            } else {
                                                                dialog.errorMessage({ text: '更新異常' });
                                                            }
                                                        });
                                                    }
                                                },
                                            });
                                        })
                                    )}
                                </div>`;
                            }
                            return BgWidget.container(
                                [
                                    // 上層導覽
                                    html`
                                        <div class="title-container">
                                            ${BgWidget.goBack(
                                                gvc.event(() => {
                                                    cf.callback();
                                                })
                                            )}
                                            <div class="d-flex ${document.body.clientWidth > 768 ? 'flex-column' : ''}">
                                                <div class="me-3">${BgWidget.title(vm.data.userData.name ?? '匿名用戶')}</div>
                                                <div style="margin-top: 4px">${BgWidget.grayNote(`上次登入時間：${gvc.glitter.ut.dateFormat(new Date(vm.data.online_time), 'yyyy-MM-dd hh:mm')}`)}</div>
                                            </div>
                                            ${document.body.clientWidth > 768 ? getButtonList() : ''}
                                        </div>
                                        ${document.body.clientWidth > 768 ? '' : html` <div class="title-container mt-3">${getButtonList()}</div>`}
                                    `,
                                    // 左右容器
                                    BgWidget.container1x2(
                                        {
                                            html: [
                                                // 顧客資料
                                                gvc.bindView(() => {
                                                    const id = gvc.glitter.getUUID();
                                                    const vmi: { mode: 'edit' | 'read' | 'block' } = { mode: 'read' };
                                                    return {
                                                        bind: id,
                                                        view: () => {
                                                            return BgWidget.mainCard(
                                                                html` <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                                                    <span class="tx_700">顧客資訊</span>
                                                                    <div style="display: flex; gap: 8px;">
                                                                        ${BgWidget.grayButton(
                                                                            vmi.mode === 'edit' ? '關閉修改' : '啟用修改',
                                                                            gvc.event(() => {
                                                                                vmi.mode = vmi.mode === 'edit' ? 'read' : 'edit';
                                                                                gvc.notifyDataChange(id);
                                                                            })
                                                                        )}
                                                                    </div>
                                                                </div>` +
                                                                    gvc.bindView(() => {
                                                                        const id = gvc.glitter.getUUID();
                                                                        return {
                                                                            bind: id,
                                                                            view: async () => {
                                                                                try {
                                                                                    const data = (
                                                                                        (await saasConfig.api.getPrivateConfig(saasConfig.config.appName, 'glitterUserForm')).response.result[0] ?? {}
                                                                                    ).value;
                                                                                    const formData = Array.isArray(data) ? data : [];

                                                                                    function loopForm(data: any[], referObj: any) {
                                                                                        return data
                                                                                            .filter((item) => item.group !== '個人履歷')
                                                                                            .map((item) => {
                                                                                                if (item.page) {
                                                                                                    item.type = 'form_plugin_v2';
                                                                                                    item.group = '';
                                                                                                }

                                                                                                const formRenderMap: Record<string, () => string> = {
                                                                                                    input: () => html`
                                                                                                        <div>
                                                                                                            <div class="tx_normal">${item.title}</div>
                                                                                                            <div>
                                                                                                                ${BgWidget.editeInput({
                                                                                                                    gvc,
                                                                                                                    title: '',
                                                                                                                    default: referObj[item.key] || '',
                                                                                                                    placeHolder: `請輸入${item.title}`,
                                                                                                                    callback: (text) => {
                                                                                                                        referObj[item.key] = text;
                                                                                                                        gvc.notifyDataChange(id);
                                                                                                                    },
                                                                                                                    readonly: vmi.mode !== 'edit',
                                                                                                                })}
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    `,
                                                                                                    multiple_line_text: () => html`
                                                                                                        <div>
                                                                                                            <div class="tx_normal">${item.title}</div>
                                                                                                            ${BgWidget.textArea({
                                                                                                                gvc,
                                                                                                                title: '',
                                                                                                                default: referObj[item.key] || '',
                                                                                                                placeHolder: `請輸入${item.title}`,
                                                                                                                callback: (text) => {
                                                                                                                    referObj[item.key] = text;
                                                                                                                    gvc.notifyDataChange(id);
                                                                                                                },
                                                                                                                readonly: vmi.mode !== 'edit',
                                                                                                            })}
                                                                                                        </div>
                                                                                                    `,
                                                                                                };

                                                                                                return formRenderMap[item.page]
                                                                                                    ? formRenderMap[item.page]()
                                                                                                    : FormWidget.editorView({
                                                                                                          gvc,
                                                                                                          array: [item],
                                                                                                          refresh: () => {},
                                                                                                          formData: referObj,
                                                                                                          readonly: vmi.mode === 'edit' ? 'write' : 'read',
                                                                                                      });
                                                                                            })
                                                                                            .join('');
                                                                                    }

                                                                                    // 預設用戶表單
                                                                                    const formArrayView: string[] = [
                                                                                        html`<div style="display:flex; gap: 18px; flex-direction: column;">
                                                                                            ${loopForm(formData, vm.data.userData)}
                                                                                        </div>`,
                                                                                    ];

                                                                                    // 獲取配置資料
                                                                                    const formKeys = ['custom_form_register', 'customer_form_user_setting'];
                                                                                    const formConfigs = await Promise.all(
                                                                                        formKeys.map(async (key) => ({
                                                                                            key,
                                                                                            value: (await ApiUser.getPublicConfig(key, 'manager')).response.value || { list: [] },
                                                                                        }))
                                                                                    );

                                                                                    // 組裝表單
                                                                                    formConfigs.forEach(({ key, value }) => {
                                                                                        value.list = value.list ?? [];
                                                                                        value.list.forEach((dd: any) => (dd.toggle = false));

                                                                                        if (value.list.length > 0) {
                                                                                            formArrayView.push(html`
                                                                                                <div class="tx_normal fw-bolder mt-2 d-flex flex-column" style="margin-bottom: 12px;">
                                                                                                    ${key === 'custom_form_register' ? '註冊頁面表單內容' : '設定頁面表單內容'}
                                                                                                </div>
                                                                                                ${loopForm(value.list, vm.data.userData)}
                                                                                            `);
                                                                                        }
                                                                                    });

                                                                                    return formArrayView.join('<div class="my-4 border"></div>');
                                                                                } catch (err) {
                                                                                    console.error('Error loading form:', err);
                                                                                    return html`<div class="text-danger">載入表單時發生錯誤，請稍後再試。</div>`;
                                                                                }
                                                                            },
                                                                        };
                                                                    })
                                                            );
                                                        },
                                                        divCreate: {
                                                            class: 'p-0',
                                                        },
                                                    };
                                                }),
                                                // 會員標籤
                                                BgWidget.mainCard(
                                                    (() => {
                                                        const id = gvc.glitter.getUUID();

                                                        vm.data.userData.tags = vm.data.userData.tags ?? [];

                                                        function getTagCard(): string {
                                                            return [
                                                                html`<div class="tx_700">標籤</div>`,
                                                                html`
                                                                    <div>
                                                                        <div class="d-flex justify-content-between">
                                                                            <div class="mb-2" style="font-weight: 700;">顧客標籤</div>
                                                                            <div
                                                                                style="overflow: hidden;white-space: normal;color: #4D86DB;word-break: break-all; cursor: pointer;"
                                                                                onclick="${gvc.event(() => {
                                                                                    const vmt = {
                                                                                        id: gvc.glitter.getUUID(),
                                                                                        loading: true,
                                                                                        dataList: [] as string[],
                                                                                        postData: JSON.parse(JSON.stringify(vm.data.userData.tags)) as string[],
                                                                                        search: '',
                                                                                    };

                                                                                    BgWidget.settingDialog({
                                                                                        gvc,
                                                                                        title: '使用現有標籤',
                                                                                        innerHTML: (gvc2) => {
                                                                                            return gvc2.bindView(
                                                                                                (() => {
                                                                                                    return {
                                                                                                        bind: vmt.id,
                                                                                                        view: () => {
                                                                                                            if (vmt.loading) {
                                                                                                                return BgWidget.spinner();
                                                                                                            } else {
                                                                                                                return [
                                                                                                                    BgWidget.searchPlace(
                                                                                                                        gvc2.event((e) => {
                                                                                                                            vmt.search = e.value;
                                                                                                                            vmt.loading = true;
                                                                                                                            gvc2.notifyDataChange(vmt.id);
                                                                                                                        }),
                                                                                                                        vmt.search,
                                                                                                                        '搜尋標籤',
                                                                                                                        '0',
                                                                                                                        '0'
                                                                                                                    ),
                                                                                                                    UserList.renderOptions(gvc2, vmt),
                                                                                                                ].join(BgWidget.mbContainer(18));
                                                                                                            }
                                                                                                        },
                                                                                                        divCreate: {},
                                                                                                        onCreate: () => {
                                                                                                            if (vmt.loading) {
                                                                                                                ApiUser.getPublicConfig('user_general_tags', 'manager').then((dd: any) => {
                                                                                                                    if (dd.result && dd.response?.value?.list) {
                                                                                                                        vmt.dataList = dd.response.value.list.filter((item: string) =>
                                                                                                                            item.includes(vmt.search)
                                                                                                                        );
                                                                                                                        vmt.loading = false;
                                                                                                                        gvc2.notifyDataChange(vmt.id);
                                                                                                                    } else {
                                                                                                                        UserList.setUserTags(gvc2, []);
                                                                                                                    }
                                                                                                                });
                                                                                                            }
                                                                                                        },
                                                                                                    };
                                                                                                })()
                                                                                            );
                                                                                        },
                                                                                        footer_html: (gvc2) => {
                                                                                            return [
                                                                                                html`<div
                                                                                                    style="color: #393939; text-decoration-line: underline; cursor: pointer"
                                                                                                    onclick="${gvc2.event(() => {
                                                                                                        vmt.postData = [];
                                                                                                        vmt.loading = true;
                                                                                                        gvc2.notifyDataChange(vmt.id);
                                                                                                    })}"
                                                                                                >
                                                                                                    清除全部
                                                                                                </div>`,
                                                                                                BgWidget.cancel(
                                                                                                    gvc2.event(() => {
                                                                                                        gvc2.closeDialog();
                                                                                                    })
                                                                                                ),
                                                                                                BgWidget.save(
                                                                                                    gvc2.event(() => {
                                                                                                        vm.data.userData.tags = vmt.postData;
                                                                                                        gvc.notifyDataChange(id);
                                                                                                        gvc2.closeDialog();
                                                                                                    })
                                                                                                ),
                                                                                            ].join('');
                                                                                        },
                                                                                    });
                                                                                })}"
                                                                            >
                                                                                使用現有標籤
                                                                            </div>
                                                                        </div>
                                                                        ${BgWidget.multipleInput(
                                                                            gvc,
                                                                            vm.data.userData.tags,
                                                                            {
                                                                                save: (def) => {
                                                                                    vm.data.userData.tags = [...new Set(def)];
                                                                                },
                                                                            },
                                                                            true
                                                                        )}
                                                                    </div>
                                                                `,
                                                            ].join(BgWidget.mbContainer(12));
                                                        }

                                                        return gvc.bindView({
                                                            bind: id,
                                                            view: () => getTagCard(),
                                                        });
                                                    })()
                                                ),
                                                // 會員等級設定
                                                BgWidget.mainCard(
                                                    [
                                                        [
                                                            html`<div class="tx_700">會員等級</div>`,
                                                            html`<div class="badge bg-dark fs-7" style="max-height: 34px;">${vm.data.member_level.tag_name}</div>`,
                                                        ].join(BgWidget.mbContainer(12)),
                                                        [
                                                            html`<div class="tx_700">升級方式</div>`,
                                                            BgWidget.multiCheckboxContainer(
                                                                gvc,
                                                                [
                                                                    {
                                                                        key: 'auto',
                                                                        name: html`<div>
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
                                                                                                    vd.tableData = vm.data.member.map((leadData: any, index: number) => {
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
                                                                                                                    } else {
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
                                                                                            rowClick: () => {},
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
                                                                        innerHtml: gvc.bindView(
                                                                            (() => {
                                                                                const id = gvc.glitter.getUUID();
                                                                                let loading = true;
                                                                                let options: { key: string; value: string }[] = [];
                                                                                return {
                                                                                    bind: id,
                                                                                    view: () => {
                                                                                        if (loading) {
                                                                                            return BgWidget.spinner();
                                                                                        } else {
                                                                                            vm.data.userData.level_default = vm.data.userData.level_default ?? options[0].key;
                                                                                            return html`
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
                                                                                            ApiUser.getPublicConfig('member_level_config', 'manager').then((dd: any) => {
                                                                                                if (dd.result && dd.response?.value?.levels) {
                                                                                                    options = dd.response.value.levels.map((item: { id: string; tag_name: string }) => {
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
                                                                            })()
                                                                        ),
                                                                    },
                                                                ],
                                                                [vm.data.userData.level_status ?? 'auto'],
                                                                (value) => {
                                                                    vm.data.userData.level_status = value[0];
                                                                },
                                                                { single: true }
                                                            ),
                                                        ].join(BgWidget.mbContainer(12)),
                                                        [
                                                            html`<div class="tx_700">會員有效期</div>`,
                                                            html`<div class="tx_noraml">
                                                                ${vm.data.member_level.dead_line?.length > 0 ? Tool.convertDateTimeFormat(vm.data.member_level.dead_line) : '永久'}
                                                            </div>`,
                                                        ].join(BgWidget.mbContainer(12)),
                                                        [html`<div class="tx_700">註冊時間</div>`, Tool.convertDateTimeFormat(vm.data.created_time)].join(BgWidget.mbContainer(12)),
                                                    ].join(BgWidget.mbContainer(18))
                                                ),
                                                // 訂單記錄
                                                gvc.bindView(() => {
                                                    const id = gvc.glitter.getUUID();
                                                    return {
                                                        bind: id,
                                                        view: () => {
                                                            return BgWidget.mainCard(
                                                                html` <div style="display: flex; margin-bottom: 8px;">
                                                                    <span class="tx_700">訂單記錄</span>
                                                                </div>` +
                                                                    gvc.bindView(() => {
                                                                        const id = gvc.glitter.getUUID();
                                                                        return {
                                                                            bind: id,
                                                                            view: () => {
                                                                                const limit = 10;
                                                                                return new Promise(async (resolve) => {
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
                                                                                        rowClick: () => {},
                                                                                        filter: [],
                                                                                    });
                                                                                    resolve(html` <div style="display:flex; gap: 18px; flex-direction: column;">${h}</div>`);
                                                                                });
                                                                            },
                                                                        };
                                                                    })
                                                            );
                                                        },
                                                        divCreate: {
                                                            class: 'p-0',
                                                        },
                                                    };
                                                }),
                                                // 購物金
                                                gvc.bindView(() => {
                                                    const id = gvc.glitter.getUUID();
                                                    return {
                                                        bind: id,
                                                        view: () => {
                                                            return BgWidget.mainCard(
                                                                html` <div style="display: flex; justify-content: space-between; align-items: center;">
                                                                    <span class="tx_700">購物金</span>
                                                                    <div>
                                                                        ${BgWidget.grayButton(
                                                                            '添加購物金',
                                                                            gvc.event(() => {
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
                                                                                                    } else {
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
                                                                                                } else {
                                                                                                    dialog.errorMessage({ text: result.response.msg });
                                                                                                }
                                                                                            });
                                                                                        },
                                                                                        text: '確認',
                                                                                    },
                                                                                });
                                                                            })
                                                                        )}
                                                                    </div>
                                                                </div>` +
                                                                    html` <div style="display: flex; margin-bottom: 18px; align-items: center; gap: 18px">
                                                                        <span class="tx_700">現有購物金</span>
                                                                        <span style="font-size: 24px; font-weight: 400; color: #393939;"
                                                                            >${gvc.bindView(() => {
                                                                                const id = gvc.glitter.getUUID();
                                                                                return {
                                                                                    bind: id,
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
                                                                                };
                                                                            })}</span
                                                                        >
                                                                    </div>` +
                                                                    html` <div style="display: flex; margin-bottom: 18px;">
                                                                        <span class="tx_700">購物金紀錄</span>
                                                                    </div>` +
                                                                    gvc.bindView(() => {
                                                                        const id = gvc.glitter.getUUID();
                                                                        return {
                                                                            bind: id,
                                                                            view: () => {
                                                                                const limit = 10;
                                                                                return new Promise(async (resolve) => {
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
                                                                                        rowClick: () => {},
                                                                                        filter: [],
                                                                                    });
                                                                                    resolve(html` <div style="display:flex; gap: 18px; flex-direction: column;">${h}</div>`);
                                                                                });
                                                                            },
                                                                        };
                                                                    })
                                                            );
                                                        },
                                                        divCreate: {
                                                            class: 'p-0',
                                                        },
                                                    };
                                                }),
                                            ].join(BgWidget.mbContainer(24)),
                                            ratio: 78,
                                        },
                                        {
                                            html: gvc.bindView(() => {
                                                const id = gvc.glitter.getUUID();
                                                return {
                                                    bind: id,
                                                    view: () => {
                                                        return BgWidget.mainCard(
                                                            gvc.bindView(() => {
                                                                const id = gvc.glitter.getUUID();
                                                                return {
                                                                    bind: id,
                                                                    view: () => {
                                                                        return new Promise(async (resolve, reject) => {
                                                                            let data = ((await saasConfig.api.getPrivateConfig(saasConfig.config.appName, `glitterUserForm`)).response.result[0] ?? {})
                                                                                .value;
                                                                            if (!Array.isArray(data)) {
                                                                                data = [];
                                                                            }
                                                                            let h = html`
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
                                                                                            return new Promise<string>((resolve, reject) => {
                                                                                                ApiShop.getOrder({
                                                                                                    page: 0,
                                                                                                    limit: 99999,
                                                                                                    data_from: 'manager',
                                                                                                    email: vm.data.userData.email,
                                                                                                    phone: vm.data.userData.phone,
                                                                                                    status: 1,
                                                                                                }).then((data) => {
                                                                                                    let total_price = 0;
                                                                                                    data.response.data.map((item: any) => {
                                                                                                        total_price += item.orderData.total;
                                                                                                    });
                                                                                                    const formatNum = (n: string | number) => parseInt(`${n}`, 10).toLocaleString();

                                                                                                    resolve(
                                                                                                        html` <div class="gray-bottom-line-18">
                                                                                                            <div class="tx_700">消費總金額</div>
                                                                                                            ${total_price === 0
                                                                                                                ? html` <div
                                                                                                                      style="font-size: 14px; font-weight: 400; color: #393939; margin-top: 12px;"
                                                                                                                  >
                                                                                                                      此顧客還沒有任何消費紀錄
                                                                                                                  </div>`
                                                                                                                : html` <div
                                                                                                                      style="font-size: 32px; font-weight: 400; color: #393939; margin-top: 12px;"
                                                                                                                  >
                                                                                                                      ${formatNum(total_price)}
                                                                                                                  </div>`}
                                                                                                            <div class="tx_700" style="margin-top: 18px">消費次數</div>
                                                                                                            <div style="font-size: 32px; font-weight: 400; color: #393939; margin-top: 12px;">
                                                                                                                ${formatNum(data.response.total)}
                                                                                                            </div>
                                                                                                        </div>`
                                                                                                    );
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
                                                                            resolve(html` <div style="display:flex; gap: 18px; flex-direction: column;">${h}</div>`);
                                                                        });
                                                                    },
                                                                };
                                                            })
                                                        );
                                                    },
                                                    divCreate: {
                                                        class: 'summary-card p-0',
                                                    },
                                                };
                                            }),
                                            ratio: 22,
                                        }
                                    ),
                                    // 空白容器
                                    BgWidget.mbContainer(240),
                                    // 儲存資料
                                    html` <div class="update-bar-container">
                                        ${BgWidget.cancel(gvc.event(() => cf.callback()))}
                                        ${BgWidget.save(
                                            gvc.event(() => {
                                                ApiUser.getPublicConfig('user_general_tags', 'manager').then((dd) => {
                                                    if (dd.result && dd.response?.value?.list) {
                                                        UserList.setUserTags(gvc, [...dd.response.value.list, ...vm.data.userData.tags]);
                                                    } else {
                                                        UserList.setUserTags(gvc, vm.data.userData.tags);
                                                    }
                                                });

                                                const dialog = new ShareDialog(gvc.glitter);
                                                dialog.dataLoading({ text: '更新中', visible: true });
                                                ApiUser.updateUserDataManager(vm.data, vm.data.userID).then((response) => {
                                                    dialog.dataLoading({ text: '', visible: false });
                                                    if (response.result) {
                                                        regetData();
                                                        dialog.successMessage({ text: '更新成功' });
                                                        vm.loading = true;
                                                        gvc.notifyDataChange(vm.id);
                                                    } else {
                                                        dialog.errorMessage({ text: '更新異常' });
                                                    }
                                                });
                                            })
                                        )}
                                    </div>`,
                                ].join(html` <div style="margin-top: 24px;"></div>`)
                            );
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

    public static createUser(gvc: GVC, vm: any) {
        const viewID = gvc.glitter.getUUID();
        const saasConfig: { config: any; api: any } = (window.parent as any).saasConfig;
        let userData: any = vm.initial_data || {
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
                return BgWidget.container(html`
                    <div class="title-container">
                        ${BgWidget.goBack(
                            gvc.event(() => {
                                vm.type = 'list';
                            })
                        )}
                        ${BgWidget.title('新增顧客')}
                    </div>
                    <div class="d-flex justify-content-center ${document.body.clientWidth < 768 ? 'flex-column' : ''}" style="gap: 24px; padding: 0;">
                        ${BgWidget.container(
                            [
                                // 顧客資料
                                gvc.bindView(() => {
                                    const id = gvc.glitter.getUUID();
                                    const vmi: {
                                        mode: 'edit' | 'read' | 'block';
                                    } = {
                                        mode: 'edit',
                                    };
                                    return {
                                        bind: id,
                                        view: () => {
                                            return BgWidget.mainCard(
                                                html`<div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                                    <span class="tx_700">顧客資訊</span>
                                                </div>` +
                                                    gvc.bindView(() => {
                                                        const id = gvc.glitter.getUUID();
                                                        return {
                                                            bind: id,
                                                            view: () => {
                                                                return new Promise(async (resolve) => {
                                                                    let data = ((await saasConfig.api.getPrivateConfig(saasConfig.config.appName, `glitterUserForm`)).response.result[0] ?? {}).value;
                                                                    if (!Array.isArray(data)) {
                                                                        data = [];
                                                                    }

                                                                    function loopForm(data: any, refer_obj: any) {
                                                                        let h = '';
                                                                        data.map((item: any) => {
                                                                            switch (item.page) {
                                                                                case 'input':
                                                                                    h += html` <div>
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
                                                                                    h += html` <div>
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
                                                                                        refresh: () => {},
                                                                                        formData: refer_obj,
                                                                                        readonly: vmi.mode === 'edit' ? 'write' : 'read',
                                                                                    });
                                                                                    break;
                                                                            }
                                                                        });
                                                                        return h;
                                                                    }

                                                                    // 預設用戶表單
                                                                    const form_array_view: any = [
                                                                        html`<div style="display:flex; gap: 12px; flex-direction: column;">${loopForm(data, userData)}</div>`,
                                                                    ];

                                                                    resolve(form_array_view.join(html`<div class="my-4 border"></div>`));
                                                                });
                                                            },
                                                        };
                                                    })
                                            );
                                        },
                                        divCreate: {
                                            class: 'p-0',
                                        },
                                    };
                                }),
                                BgWidget.mbContainer(240),
                                // 儲存資料
                                html` <div class="update-bar-container">
                                    ${BgWidget.cancel(
                                        gvc.event(() => {
                                            vm.type = 'list';
                                        })
                                    )}
                                    ${BgWidget.save(
                                        gvc.event(async () => {
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
                                                dialog.infoMessage({ text: html` <div class="text-center">生日日期無效，請確認年月日是否正確<br />(ex: 19950107)</div> ` });
                                                return;
                                            }

                                            dialog.dataLoading({ visible: true });
                                            if ((await ApiUser.getPhoneCount(userData.phone)).response.result) {
                                                dialog.dataLoading({ visible: false });
                                                dialog.errorMessage({ text: '此電話號碼已被註冊' });
                                            } else if ((await ApiUser.getEmailCount(userData.email)).response.result) {
                                                dialog.dataLoading({ visible: false });
                                                dialog.errorMessage({ text: '此信箱已被註冊' });
                                            } else {
                                                ApiUser.quickRegister({
                                                    account: userData.email,
                                                    pwd: gvc.glitter.getUUID(),
                                                    userData: userData,
                                                }).then((r) => {
                                                    if (r.result) {
                                                        dialog.dataLoading({ visible: false });
                                                        dialog.infoMessage({ text: '成功新增會員' });
                                                        vm.type = 'list';
                                                    } else {
                                                        dialog.dataLoading({ visible: false });
                                                        dialog.errorMessage({ text: '會員建立失敗' });
                                                    }
                                                });
                                            }
                                        })
                                    )}
                                </div>`,
                            ].join('')
                        )}
                    </div>
                `);
            },
            divCreate: {},
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
        let vmi: any = undefined;

        function getDatalist() {
            return vm.dataList.map((dd: any) => {
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
                                return html` <div class="badge bg-info fs-7" style="max-height:34px;">啟用中</div>`;
                            } else {
                                return html` <div class="badge bg-danger fs-7" style="max-height:34px;">已停用</div>`;
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
                            ${BgWidget.mainCard(
                                [
                                    BgWidget.searchPlace(
                                        gvc.event((e, event) => {
                                            vm.query = e.value;
                                            gvc.notifyDataChange(id);
                                        }),
                                        vm.query || '',
                                        '搜尋所有用戶'
                                    ),
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
                                                callback(vm.dataList.filter((dd: any) => dd.checked));
                                            } else {
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
                                                },
                                            },
                                        ],
                                    }),
                                ].join('')
                            )}
                        `);
                    } else if (vm.type == 'replace') {
                        return this.userInformationDetail({
                            userID: vm.data.userID,
                            callback: () => {
                                vm.type = 'list';
                            },
                            gvc: gvc,
                        });
                    }
                    return '';
                },
            };
        });
    }
}

(window as any).glitter.setModule(import.meta.url, UserList);
