import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { BgListComponent } from '../backend-manager/bg-list-component.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { FilterOptions } from './filter-options.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { CheckInput } from '../modules/checkInput.js';
import { Tool } from '../modules/tool.js';
const html = String.raw;
export class StockVendors {
    static main(gvc) {
        const glitter = gvc.glitter;
        const emptyData = () => {
            return {
                id: '',
                name: '',
                address: '',
                manager_name: '',
                manager_phone: '',
                note: '',
            };
        };
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
        const ListComp = new BgListComponent(gvc, vm, FilterOptions.vendorsFilterFrame);
        vm.filter = ListComp.getFilterObject();
        let vmi = undefined;
        function getDatalist() {
            return vm.dataList.map((dd) => {
                return [
                    {
                        key: '供應商名稱',
                        value: `<span class="fs-7">${dd.name}</span>`,
                    },
                    {
                        key: '地址',
                        value: `<span class="fs-7">${dd.address}</span>`,
                    },
                    {
                        key: '電話',
                        value: `<span class="fs-7">${dd.manager_phone}</span>`,
                    },
                    {
                        key: '聯絡人姓名',
                        value: `<span class="fs-7">${dd.manager_name}</span>`,
                    },
                ];
            });
        }
        return BgWidget.container(html ` <div class="title-container">
                    ${BgWidget.title('供應商管理')}
                    <div class="flex-fill"></div>
                    ${BgWidget.grayButton('新增供應商', gvc.event(() => {
            vm.type = 'create';
        }))}
                </div>
                ${BgWidget.container(BgWidget.mainCard([
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
                                options: FilterOptions.vendorsSelect,
                            }),
                            BgWidget.searchFilter(gvc.event((e) => {
                                vm.query = `${e.value}`.trim();
                                gvc.notifyDataChange(vm.tableId);
                                gvc.notifyDataChange(id);
                            }), vm.query || '', '搜尋庫存點名稱'),
                            BgWidget.funnelFilter({
                                gvc,
                                callback: () => ListComp.showRightMenu(FilterOptions.vendorsFunnel),
                            }),
                            BgWidget.updownFilter({
                                gvc,
                                callback: (value) => {
                                    vm.orderString = value;
                                    gvc.notifyDataChange(vm.tableId);
                                    gvc.notifyDataChange(id);
                                },
                                default: vm.orderString || 'default',
                                options: FilterOptions.vendorsOrderBy,
                            }),
                        ];
                        const filterTags = ListComp.getFilterTags(FilterOptions.vendorsFunnel);
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
                            this.getPublicData().then((data) => {
                                console.log(data.list);
                                if (data.list) {
                                    vm.dataList = data.list;
                                    vmi.pageSize = Math.ceil(data.list.length / limit);
                                    vmi.originalData = vm.dataList;
                                    vmi.tableData = getDatalist();
                                }
                                vmi.loading = false;
                                vmi.callback();
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
                        <div>${BgWidget.title(type === 'create' ? '新增供應商' : vm.data.name)}</div>
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
                            html ` <div class="tx_700">供應商資訊</div>`,
                            html ` <div class="row">
                                                <div class="col-12 col-md-6">
                                                    <div class="tx_normal">供應商名稱</div>
                                                    ${BgWidget.mbContainer(8)}
                                                    ${BgWidget.editeInput({
                                gvc: gvc,
                                title: '',
                                default: (_a = vm.data.name) !== null && _a !== void 0 ? _a : '',
                                placeHolder: '請輸入供應商名稱',
                                callback: (text) => {
                                    vm.data.name = text;
                                },
                            })}
                                                </div>
                                                ${document.body.clientWidth > 768 ? '' : BgWidget.mbContainer(18)}
                                                <div class="col-12 col-md-6">
                                                    <div class="tx_normal">供應商地址</div>
                                                    ${BgWidget.mbContainer(8)}
                                                    ${BgWidget.editeInput({
                                gvc: gvc,
                                title: '',
                                default: (_b = vm.data.address) !== null && _b !== void 0 ? _b : '',
                                placeHolder: '請輸入供應商地址',
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
                        text: '確定要刪除此供應商？',
                        callback: () => {
                            this.getPublicData().then((vendors) => {
                                ApiUser.setPublicConfig({
                                    key: 'vendor_manager',
                                    value: {
                                        list: vendors.list.filter((item) => item.id !== vm.data.id),
                                    },
                                    user_id: 'manager',
                                }).then((dd) => {
                                    dialog.dataLoading({ visible: false });
                                    dialog.successMessage({ text: '刪除成功' });
                                    setTimeout(() => {
                                        vm.type = 'list';
                                    }, 500);
                                });
                            });
                        },
                    });
                }))
                : ''}
                    ${BgWidget.cancel(gvc.event(() => {
                vm.type = 'list';
            }))}
                    ${BgWidget.save(gvc.event(() => {
                const valids = [
                    { key: 'name', text: '供應商名稱不得為空白' },
                    { key: 'address', text: '地址不得為空白' },
                ];
                for (const v of valids) {
                    if (vm.data[v.key] === undefined || vm.data[v.key].length === 0 || vm.data[v.key] === null) {
                        dialog.infoMessage({ text: v.text });
                        return;
                    }
                }
                if (!CheckInput.isTaiwanPhone(vm.data.manager_phone)) {
                    dialog.infoMessage({ text: BgWidget.taiwanPhoneAlert() });
                    return;
                }
                dialog.dataLoading({ visible: true });
                this.getPublicData().then((vendors) => {
                    var _a;
                    vendors.list = (_a = vendors.list) !== null && _a !== void 0 ? _a : [];
                    if (type === 'replace') {
                        const vendor = vendors.list.find((item) => item.id === vm.data.id);
                        if (vendor) {
                            Object.assign(vendor, vm.data);
                        }
                    }
                    else {
                        vm.data.id = this.getNewID(vendors.list);
                        vendors.list.push(vm.data);
                    }
                    ApiUser.setPublicConfig({
                        key: 'vendor_manager',
                        value: {
                            list: vendors.list,
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
            ApiUser.getPublicConfig('vendor_manager', 'manager').then((dd) => {
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
            newId = `vendor_${Tool.randomString(6)}`;
        } while (list.some((item) => item.id === newId));
        return newId;
    }
}
window.glitter.setModule(import.meta.url, StockVendors);
