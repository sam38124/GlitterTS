import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { BgListComponent } from '../backend-manager/bg-list-component.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { FilterOptions } from './filter-options.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { CheckInput } from '../modules/checkInput.js';
import { Tool } from '../modules/tool.js';
const html = String.raw;
export class StockStores {
    static main(gvc) {
        const glitter = gvc.glitter;
        const vm = {
            id: glitter.getUUID(),
            tableId: glitter.getUUID(),
            type: 'list',
            data: emptyData(),
            dataList: [],
            query: '',
            queryType: '',
            filter: {},
            orderString: '',
        };
        function emptyData() {
            return {
                id: '',
                name: '',
                address: '',
                manager_name: '',
                manager_phone: '',
                note: '',
            };
        }
        return gvc.bindView({
            bind: vm.id,
            dataList: [{ obj: vm, key: 'type' }],
            view: () => {
                if (vm.type === 'list') {
                    return this.list(gvc, vm);
                }
                if (vm.type === 'replace') {
                    return this.detailPage(gvc, vm, 'replace');
                }
                if (vm.type === 'create') {
                    vm.data = emptyData();
                    return this.detailPage(gvc, vm, 'create');
                }
                return '';
            },
        });
    }
    static list(gvc, vm) {
        const ListComp = new BgListComponent(gvc, vm, FilterOptions.storesFilterFrame);
        vm.filter = ListComp.getFilterObject();
        let vmi = undefined;
        function getDatalist() {
            return vm.dataList.map((dd) => {
                return [
                    {
                        key: '庫存點名稱',
                        value: `<span class="fs-7">${dd.name}</span>`,
                    },
                    {
                        key: '地址',
                        value: `<span class="fs-7">${dd.address || '-'}</span>`,
                    },
                    {
                        key: '電話',
                        value: `<span class="fs-7">${dd.manager_phone || '-'}</span>`,
                    },
                    {
                        key: '聯絡人姓名',
                        value: `<span class="fs-7">${dd.manager_name || '-'}</span>`,
                    },
                ];
            });
        }
        return BgWidget.container(html ` <div class="title-container">
                    ${BgWidget.title('庫存點管理')}
                    <div class="flex-fill"></div>
                    ${BgWidget.grayButton('新增庫存點', gvc.event(() => {
            vm.type = 'create';
        }))}
                </div>
                ${BgWidget.container(BgWidget.mainCard([
            (() => {
                const id = gvc.glitter.getUUID();
                return gvc.bindView({
                    bind: id,
                    view: () => {
                        var _a;
                        const filterList = [
                            BgWidget.selectFilter({
                                gvc,
                                callback: (value) => {
                                    vm.queryType = value;
                                    gvc.notifyDataChange(vm.tableId);
                                    gvc.notifyDataChange(id);
                                },
                                default: vm.queryType || 'name',
                                options: FilterOptions.storesSelect,
                            }),
                            BgWidget.searchFilter(gvc.event((e) => {
                                vm.query = `${e.value}`.trim();
                                gvc.notifyDataChange(vm.tableId);
                                gvc.notifyDataChange(id);
                            }), vm.query || '', '搜尋庫存點名稱'),
                        ];
                        const filterTags = ListComp.getFilterTags(FilterOptions.storesFunnel);
                        if (document.body.clientWidth < 768) {
                            return html ` <div style="display: flex; align-items: center; gap: 10px; width: 100%; justify-content: space-between">
                                                    <div>${filterList[0]}</div>
                                                    <div style="display: flex;">${filterList[2] ? `<div class="me-2">${filterList[2]}</div>` : ''} ${(_a = filterList[3]) !== null && _a !== void 0 ? _a : ''}</div>
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
                            const limit = 100;
                            function callback(list) {
                                vm.dataList = list;
                                vmi.pageSize = Math.ceil(list.length / limit);
                                vmi.originalData = vm.dataList;
                                vmi.tableData = getDatalist();
                                vmi.loading = false;
                                vmi.callback();
                            }
                            this.getPublicData().then((data) => {
                                if (data.list && data.list.length > 0) {
                                    data.list = data.list.filter((item) => {
                                        return vm.query === '' || item.name.includes(vm.query);
                                    });
                                    callback(data.list);
                                }
                                else {
                                    const defaultList = [
                                        {
                                            id: this.getNewID([]),
                                            name: '庫存點1（預設）',
                                            address: '',
                                            manager_name: '',
                                            manager_phone: '',
                                            note: '',
                                        },
                                    ];
                                    ApiUser.setPublicConfig({
                                        key: 'store_manager',
                                        value: {
                                            list: defaultList,
                                        },
                                        user_id: 'manager',
                                    }).then(() => {
                                        callback(defaultList);
                                    });
                                }
                            });
                        },
                        rowClick: (data, index) => {
                            vm.data = vm.dataList[index];
                            vm.type = 'replace';
                        },
                        filter: [],
                    });
                },
            }),
        ].join('')))}`);
    }
    static detailPage(gvc, vm, type) {
        const glitter = gvc.glitter;
        const dialog = new ShareDialog(glitter);
        return BgWidget.container([
            html ` <div class="title-container">
                        <div class="mt-1">
                            ${BgWidget.goBack(gvc.event(() => {
                vm.type = 'list';
            }))}
                        </div>
                        <div>${BgWidget.title(type === 'create' ? '新增庫存點' : vm.data.name)}</div>
                    </div>
                    <div class="flex-fill"></div>`,
            html ` <div class="d-flex justify-content-center ${document.body.clientWidth < 768 ? 'flex-column' : ''}" style="gap: 24px">
                    ${BgWidget.container(gvc.bindView(() => {
                const id = glitter.getUUID();
                return {
                    bind: id,
                    view: () => {
                        var _a, _b, _c, _d, _e;
                        return BgWidget.mainCard([
                            html ` <div class="tx_700">庫存點資訊</div>`,
                            html ` <div class="row">
                                                <div class="col-12 col-md-6">
                                                    <div class="tx_normal">庫存點名稱</div>
                                                    ${BgWidget.mbContainer(8)}
                                                    ${BgWidget.editeInput({
                                gvc: gvc,
                                title: '',
                                default: (_a = vm.data.name) !== null && _a !== void 0 ? _a : '',
                                placeHolder: '請輸入庫存點名稱',
                                callback: (text) => {
                                    vm.data.name = text;
                                },
                            })}
                                                </div>
                                                ${document.body.clientWidth > 768 ? '' : BgWidget.mbContainer(18)}
                                                <div class="col-12 col-md-6">
                                                    <div class="tx_normal">庫存點地址</div>
                                                    ${BgWidget.mbContainer(8)}
                                                    ${BgWidget.editeInput({
                                gvc: gvc,
                                title: '',
                                default: (_b = vm.data.address) !== null && _b !== void 0 ? _b : '',
                                placeHolder: '請輸入庫存點地址',
                                callback: (text) => {
                                    vm.data.address = text;
                                },
                            })}
                                                </div>
                                            </div>`,
                            html `<div class="row">
                                                <div class="col-12 col-md-6">
                                                    <div class="tx_normal">聯絡人姓名</div>
                                                    ${BgWidget.mbContainer(8)}
                                                    ${BgWidget.editeInput({
                                gvc: gvc,
                                title: '',
                                default: (_c = vm.data.manager_name) !== null && _c !== void 0 ? _c : '',
                                placeHolder: '請輸入聯絡人姓名',
                                callback: (text) => {
                                    vm.data.manager_name = text;
                                },
                            })}
                                                </div>
                                                <div class="col-12 col-md-6">
                                                    <div class="tx_normal">電話</div>
                                                    ${BgWidget.mbContainer(8)}
                                                    ${BgWidget.editeInput({
                                gvc: gvc,
                                title: '',
                                default: (_d = vm.data.manager_phone) !== null && _d !== void 0 ? _d : '',
                                placeHolder: '請輸入電話',
                                callback: (text) => {
                                    vm.data.manager_phone = text;
                                },
                            })}
                                                </div>
                                            </div> `,
                            html ` <div class="tx_normal">備註</div>
                                                ${EditorElem.editeText({
                                gvc: gvc,
                                title: '',
                                default: (_e = vm.data.note) !== null && _e !== void 0 ? _e : '',
                                placeHolder: '請輸入備註',
                                callback: (text) => {
                                    vm.data.note = text;
                                },
                            })}`,
                        ].join(BgWidget.mbContainer(18)));
                    },
                    divCreate: { class: 'p-0' },
                };
            }))}
                </div>`,
            BgWidget.mbContainer(240),
            html ` <div class="update-bar-container">
                    ${type === 'replace'
                ? BgWidget.danger(gvc.event(() => {
                    dialog.checkYesOrNot({
                        text: '確定要刪除此庫存點？',
                        callback: (bool) => {
                            if (bool) {
                                dialog.dataLoading({ visible: true });
                                this.getPublicData().then((stores) => {
                                    const filterList = stores.list.filter((item) => item.id !== vm.data.id);
                                    if (filterList.length === 0) {
                                        dialog.dataLoading({ visible: false });
                                        dialog.errorMessage({ text: '庫存點數量不可小於0' });
                                        return;
                                    }
                                    ApiUser.setPublicConfig({
                                        key: 'store_manager',
                                        value: {
                                            list: filterList,
                                        },
                                        user_id: 'manager',
                                    }).then(() => {
                                        dialog.dataLoading({ visible: false });
                                        dialog.successMessage({ text: '刪除成功' });
                                        setTimeout(() => {
                                            vm.type = 'list';
                                        }, 500);
                                    });
                                });
                            }
                        },
                    });
                }))
                : ''}
                    ${BgWidget.cancel(gvc.event(() => {
                vm.type = 'list';
            }))}
                    ${BgWidget.save(gvc.event(() => {
                this.getPublicData().then((stores) => {
                    if (CheckInput.isEmpty(vm.data.name)) {
                        dialog.infoMessage({ text: '庫存點名稱不得為空白' });
                        return;
                    }
                    if (type === 'replace' && stores.list.length > 1) {
                        if (CheckInput.isEmpty(vm.data.address)) {
                            dialog.infoMessage({ text: '地址不得為空白' });
                            return;
                        }
                        if (!CheckInput.isTaiwanPhone(vm.data.manager_phone)) {
                            dialog.infoMessage({ text: BgWidget.taiwanPhoneAlert() });
                            return;
                        }
                    }
                    if (type === 'replace') {
                        const store = stores.list.find((item) => item.id === vm.data.id);
                        if (store) {
                            Object.assign(store, vm.data);
                        }
                    }
                    else {
                        vm.data.id = this.getNewID(stores.list);
                        stores.list.push(vm.data);
                    }
                    dialog.dataLoading({ visible: true });
                    ApiUser.setPublicConfig({
                        key: 'store_manager',
                        value: {
                            list: stores.list,
                        },
                        user_id: 'manager',
                    }).then((dd) => {
                        dialog.dataLoading({ visible: false });
                        dialog.successMessage({ text: type === 'create' ? '新增成功' : '更新成功' });
                        setTimeout(() => {
                            vm.type = 'list';
                        }, 500);
                    });
                });
            }))}
                </div>`,
        ].join('<div class="my-2"></div>'));
    }
    static getPublicData() {
        return new Promise((resolve, reject) => {
            ApiUser.getPublicConfig('store_manager', 'manager').then((dd) => {
                if (dd.result && dd.response.value) {
                    resolve(dd.response.value);
                }
                else {
                    resolve({});
                }
            });
        });
    }
    static getNewID(list) {
        let newId;
        do {
            newId = `store_${Tool.randomString(6)}`;
        } while (list.some((item) => item.id === newId));
        return newId;
    }
}
window.glitter.setModule(import.meta.url, StockStores);
