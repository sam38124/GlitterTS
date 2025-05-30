import { BgWidget } from '../backend-manager/bg-widget.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { FilterOptions } from './filter-options.js';
import { BgListComponent } from '../backend-manager/bg-list-component.js';
import { CheckInput } from '../modules/checkInput.js';
import { Setting_editor } from '../jspage/function-page/setting_editor.js';
import { Tool } from '../modules/tool.js';
import { TableStorage } from './module/table-storage.js';
const html = String.raw;
export class PermissionSetting {
    static main(gvc, edit_mode) {
        const glitter = gvc.glitter;
        const dialog = new ShareDialog(glitter);
        function getInitialData() {
            if (edit_mode === 'backend') {
                const a = {
                    id: glitter.getUUID(),
                    filterId: glitter.getUUID(),
                    tableId: glitter.getUUID(),
                    type: 'list',
                    tab: 'all',
                    query: '',
                    queryType: 'name',
                    orderString: 'default',
                    data: {
                        id: 0,
                        user: '',
                        appName: '',
                        config: {
                            auth: [],
                            name: '',
                            phone: '',
                            title: '',
                        },
                        created_time: '',
                        updated_time: '',
                        status: 1,
                        invited: 0,
                        email: '',
                        online_time: '',
                    },
                    dataList: [],
                    filter: {},
                    listLimit: TableStorage.getLimit(),
                };
                return a;
            }
            else {
                return {
                    id: glitter.getUUID(),
                    filterId: glitter.getUUID(),
                    tableId: glitter.getUUID(),
                    type: 'list',
                    tab: 'all',
                    query: '',
                    queryType: 'name',
                    orderString: 'default',
                    data: {
                        id: 0,
                        user: '',
                        appName: '',
                        config: {
                            auth: [],
                            name: '',
                            phone: '',
                            title: '',
                        },
                        created_time: '',
                        updated_time: '',
                        status: 1,
                        invited: 0,
                        email: '',
                        online_time: '',
                    },
                    dataList: [],
                    filter: {},
                    listLimit: TableStorage.getLimit(),
                };
            }
        }
        const vm = getInitialData();
        let vmi = undefined;
        const ListComp = new BgListComponent(gvc, vm, FilterOptions.permissionFilterFrame);
        vm.filter = ListComp.getFilterObject();
        function getDatalist() {
            return vm.dataList.map((dd) => {
                return [
                    {
                        key: '員工名稱',
                        value: `<span class="fs-7">${dd.config.name}</span>`,
                    },
                    {
                        key: '信箱帳號',
                        value: dd.email || dd.config.verifyEmail
                            ? `<span class="fs-7">${dd.email || dd.config.verifyEmail}</span>`
                            : BgWidget.warningInsignia('信箱尚未註冊'),
                    },
                    {
                        key: '電話',
                        value: `<span class="fs-7">${dd.config.phone}</span>`,
                    },
                    {
                        key: '職稱',
                        value: `<span class="fs-7">${dd.config.title}</span>`,
                    },
                    ...(() => {
                        if (edit_mode === 'pos') {
                            return [];
                        }
                        else {
                            return [
                                {
                                    key: '最後登入',
                                    value: dd.online_time
                                        ? html `<span class="fs-7"
                        >${glitter.ut.dateFormat(new Date(dd.online_time), 'yyyy-MM-dd hh:mm')}</span
                      >`
                                        : '無登入紀錄',
                                },
                            ];
                        }
                    })(),
                    {
                        key: '存取權',
                        value: gvc.bindView((() => {
                            const id = glitter.getUUID();
                            return {
                                bind: id,
                                view: () => {
                                    if (dd.id === -1) {
                                        return `擁有者`;
                                    }
                                    return BgWidget.switchTextButton(gvc, dd.status, {
                                        left: dd.status ? '啟用' : '關閉',
                                    }, () => {
                                        ApiUser.togglePermissionStatus(dd.email || dd.config.verifyEmail).then(data => {
                                            if (data.result) {
                                                dd.status = data.response.status;
                                                dialog.successMessage({ text: `${dd.status ? '啟用' : '關閉'}成功` });
                                            }
                                            else {
                                                dialog.errorMessage({ text: `${dd.status ? '啟用' : '關閉'}失敗` });
                                            }
                                            gvc.notifyDataChange(id);
                                        });
                                    });
                                },
                                divCreate: {
                                    option: [
                                        {
                                            key: 'onclick',
                                            value: gvc.event((e, event) => {
                                                event.stopPropagation();
                                            }),
                                        },
                                    ],
                                },
                            };
                        })()),
                    },
                    ...(() => {
                        if (edit_mode === 'pos') {
                            return [];
                        }
                        else {
                            return [
                                {
                                    key: '邀請狀態',
                                    value: (() => {
                                        if (dd.id === -1) {
                                            return BgWidget.successInsignia('擁有者');
                                        }
                                        else {
                                            return dd.invited ? BgWidget.infoInsignia('已接受') : BgWidget.notifyInsignia('邀請中');
                                        }
                                    })(),
                                },
                            ];
                        }
                    })(),
                ];
            });
        }
        return gvc.bindView({
            bind: vm.id,
            dataList: [{ obj: vm, key: 'type' }],
            view: () => {
                if (vm.type === 'list') {
                    return BgWidget.container(html ` <div class="title-container">
                ${BgWidget.title('員工設定')}
                <div class="flex-fill"></div>
                ${BgWidget.darkButton('新增', gvc.event(() => {
                        vm.data = getInitialData().data;
                        vm.type = 'add';
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
                                                gvc.notifyDataChange([vm.tableId, id]);
                                            },
                                            default: vm.queryType || 'name',
                                            options: FilterOptions.permissionSelect,
                                        }),
                                        BgWidget.searchFilter(gvc.event(e => {
                                            vm.query = `${e.value}`.trim();
                                            gvc.notifyDataChange([vm.tableId, id]);
                                        }), vm.query || '', '搜尋所有員工'),
                                        BgWidget.countingFilter({
                                            gvc,
                                            callback: value => {
                                                vm.listLimit = value;
                                                gvc.notifyDataChange([vm.tableId, id]);
                                            },
                                            default: vm.listLimit,
                                        }),
                                        BgWidget.funnelFilter({
                                            gvc,
                                            callback: () => ListComp.showRightMenu(FilterOptions.permissionFunnel),
                                        }),
                                        BgWidget.updownFilter({
                                            gvc,
                                            callback: (value) => {
                                                vm.orderString = value;
                                                gvc.notifyDataChange([vm.tableId, id]);
                                            },
                                            default: vm.orderString || 'default',
                                            options: FilterOptions.permissionOrderBy,
                                        }),
                                    ];
                                    const filterTags = ListComp.getFilterTags(FilterOptions.permissionFunnel);
                                    return BgListComponent.listBarRWD(filterList, filterTags);
                                },
                            });
                        })(),
                        gvc.bindView({
                            bind: vm.tableId,
                            view: () => {
                                return BgWidget.tableV3({
                                    gvc: gvc,
                                    getData: vd => {
                                        vmi = vd;
                                        ApiUser.getPermission({
                                            page: vmi.page - 1,
                                            limit: vm.listLimit,
                                            queryType: vm.queryType,
                                            query: vm.query,
                                            orderBy: vm.orderString,
                                            filter: vm.filter,
                                        }).then(data => {
                                            vm.dataList = data.response.data;
                                            vmi.pageSize = Math.ceil(data.response.total / vm.listLimit);
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
                                            event: () => {
                                                const dialog = new ShareDialog(gvc.glitter);
                                                dialog.warningMessage({
                                                    text: '您即將批量刪除所選員工的所有資料<br />此操作無法復原。確定要刪除嗎？',
                                                    callback: response => {
                                                        if (response) {
                                                            let n = 0;
                                                            const emails = vm.dataList
                                                                .filter((dd) => {
                                                                return dd.checked;
                                                            })
                                                                .map((dd) => {
                                                                return dd.user;
                                                            });
                                                            dialog.dataLoading({ visible: true });
                                                            new Promise((resolve, reject) => {
                                                                for (const email of emails) {
                                                                    ApiUser.deletePermission(email).then(res => {
                                                                        if (res.result && res.response.result) {
                                                                            if (++n === emails.length) {
                                                                                resolve();
                                                                            }
                                                                        }
                                                                        else {
                                                                            dialog.dataLoading({ visible: false });
                                                                            dialog.errorMessage({ text: '刪除失敗' });
                                                                            reject();
                                                                        }
                                                                    });
                                                                }
                                                            }).then(() => {
                                                                dialog.dataLoading({ visible: false });
                                                                dialog.successMessage({ text: '刪除成功' });
                                                                setTimeout(() => {
                                                                    vm.dataList = undefined;
                                                                    gvc.notifyDataChange(vm.id);
                                                                }, 300);
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
                    ].join('')))}`);
                }
                else if (vm.type == 'replace') {
                    if (edit_mode === 'pos') {
                        return this.editorDetailPos({
                            vm: vm,
                            gvc: gvc,
                            type: 'replace',
                        });
                    }
                    else {
                        return this.editorDetail({
                            vm: vm,
                            gvc: gvc,
                            type: 'replace',
                        });
                    }
                }
                if (edit_mode === 'pos') {
                    return this.editorDetailPos({
                        vm: vm,
                        gvc: gvc,
                        type: 'add',
                    });
                }
                else {
                    return this.editorDetail({
                        vm: vm,
                        gvc: gvc,
                        type: 'add',
                    });
                }
            },
        });
    }
    static editorDetail(obj) {
        const html = String.raw;
        const gvc = obj.gvc;
        const vm = obj.vm;
        const original = JSON.parse(JSON.stringify(vm.data));
        const dialog = new ShareDialog(gvc.glitter);
        return gvc.bindView(() => {
            const viewID = gvc.glitter.getUUID();
            return {
                bind: viewID,
                view: () => {
                    var _a;
                    return BgWidget.container([
                        html ` <div class="title-container">
                ${BgWidget.goBack(gvc.event(() => {
                            vm.type = 'list';
                        }))}
                ${BgWidget.title(obj.type === 'add' ? '新增員工' : '編輯員工')}
              </div>`,
                        [
                            obj.type === 'replace'
                                ? BgWidget.mainCard(html `
                      <div class="tx_700">登錄存取權</div>
                      ${BgWidget.mbContainer(18)}
                      <div class="${vm.data.id === -1 ? `d-none` : `d-flex`} align-items-center gap-2 mb-2">
                        <div class="tx_normal">存取權開啟</div>
                        ${BgWidget.switchButton(gvc, vm.data.status === 1, () => {
                                    vm.data.status = (vm.data.status - 1) * -1;
                                })}
                      </div>
                      ${BgWidget.grayNote(vm.data.id === -1
                                    ? '此帳號為商店擁有者，擁有最高權限，如需轉讓權限請聯絡 SHOPNEX 客服。'
                                    : '一鍵開啟或關閉此員工的登入存取權，停用後員工將無法登入店家管理後台。')}
                    `)
                                : '',
                            BgWidget.mainCard(html `
                  <div class="tx_700">員工資料</div>
                  ${BgWidget.mbContainer(18)}
                  <div class="row">
                    ${[
                                BgWidget.editeInput({
                                    gvc: gvc,
                                    title: `員工名稱 ${BgWidget.requiredStar()}`,
                                    placeHolder: `請輸入員工名稱`,
                                    default: vm.data.config.name,
                                    callback: text => {
                                        vm.data.config.name = text;
                                    },
                                }),
                                BgWidget.editeInput({
                                    gvc: gvc,
                                    title: `職稱 ${BgWidget.requiredStar()}`,
                                    placeHolder: `請輸入職稱`,
                                    default: vm.data.config.title,
                                    callback: text => {
                                        vm.data.config.title = text;
                                    },
                                }),
                                BgWidget.editeInput({
                                    gvc: gvc,
                                    title: `信箱帳號 ${BgWidget.requiredStar()}`,
                                    placeHolder: '此信箱將會作為寄送邀請信之信箱',
                                    default: (_a = vm.data.email) !== null && _a !== void 0 ? _a : vm.data.config.verifyEmail,
                                    callback: text => {
                                        vm.data.email = text.toLowerCase();
                                    },
                                    readonly: obj.type === 'replace',
                                }),
                                BgWidget.editeInput({
                                    gvc: gvc,
                                    title: `電話 ${BgWidget.requiredStar()}`,
                                    placeHolder: `請輸入電話`,
                                    default: vm.data.config.phone,
                                    callback: text => {
                                        vm.data.config.phone = text;
                                    },
                                }),
                                BgWidget.editeInput({
                                    gvc: gvc,
                                    title: '員工編號',
                                    placeHolder: '此員工編號會用作POS登入帳號',
                                    default: vm.data.config.member_id || '',
                                    callback: text => {
                                        vm.data.config.member_id = text;
                                    },
                                }),
                                BgWidget.editeInput({
                                    gvc: gvc,
                                    title: 'PIN碼 ' + BgWidget.grayNote(`*請輸入6碼數字`),
                                    type: 'number',
                                    placeHolder: `此PIN碼會用作POS登入密碼`,
                                    default: vm.data.config.pin || '',
                                    callback: text => {
                                        vm.data.config.pin = text;
                                        gvc.notifyDataChange(viewID);
                                    },
                                    pattern: '0-9',
                                    oninput: text => {
                                        if (text.length >= 6) {
                                            vm.data.config.pin = text.substring(0, 6);
                                            gvc.notifyDataChange(viewID);
                                        }
                                    },
                                }),
                            ]
                                .filter(str => {
                                return str.length > 0;
                            })
                                .map(str => {
                                return html ` <div class="col-12 col-md-6">${str}</div>`;
                            })
                                .join('')}
                    ${gvc.bindView(() => {
                                const id = gvc.glitter.getUUID();
                                vm.data.config.support_shop = vm.data.config.support_shop || [];
                                let manager = undefined;
                                ApiUser.getPublicConfig('store_manager', 'manager').then(res => {
                                    manager = res;
                                    gvc.notifyDataChange(id);
                                });
                                return {
                                    bind: id,
                                    view: () => {
                                        if (!manager) {
                                            return BgWidget.spinner();
                                        }
                                        if (!manager.response.value.list.filter((dd) => {
                                            return dd.is_shop;
                                        }).length) {
                                            return ``;
                                        }
                                        return BgWidget.inlineCheckBox({
                                            title: '支援POS門市',
                                            gvc: gvc,
                                            def: vm.data.config.support_shop,
                                            type: 'multiple',
                                            array: manager.response.value.list
                                                .filter((dd) => {
                                                return dd.is_shop;
                                            })
                                                .map((dd) => {
                                                return {
                                                    title: dd.name,
                                                    value: dd.id,
                                                };
                                            }),
                                            callback: text => {
                                                vm.data.config.support_shop = text;
                                                gvc.notifyDataChange(id);
                                            },
                                        });
                                    },
                                    divCreate: {
                                        class: `col-12`,
                                    },
                                };
                            })}
                  </div>
                `),
                            vm.data.id !== -1
                                ? BgWidget.mainCard(html ` <div class="tx_700">權限指派</div>
                        ${BgWidget.mbContainer(18)} ${this.permissionOptions(gvc, vm.data.config.auth)}`)
                                : ``,
                        ]
                            .filter(dd => {
                            return dd;
                        })
                            .join(BgWidget.mbContainer(24)),
                        BgWidget.mbContainer(240),
                        html ` <div class="update-bar-container">
                ${obj.type === 'replace'
                            ? BgWidget.redButton('移除此員工', gvc.event(() => {
                                dialog.warningMessage({
                                    text: '此動作無法復原，確定要刪除此員工嗎？',
                                    callback: bool => {
                                        if (bool) {
                                            dialog.dataLoading({ visible: true });
                                            ApiUser.deletePermission(vm.data.email || vm.data.config.verifyEmail || vm.data.user).then(res => {
                                                dialog.dataLoading({ visible: false });
                                                if (res.result && res.response.result) {
                                                    dialog.successMessage({ text: '刪除成功' });
                                                    vm.type = 'list';
                                                }
                                                else {
                                                    dialog.errorMessage({ text: '刪除失敗' });
                                                }
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
                            if (CheckInput.isEmpty(vm.data.config.name)) {
                                dialog.infoMessage({ text: '員工名稱不可為空' });
                                return;
                            }
                            if (CheckInput.isEmpty(vm.data.config.title)) {
                                dialog.infoMessage({ text: '職稱不可為空' });
                                return;
                            }
                            if (obj.type === 'add' && !CheckInput.isEmail(vm.data.email)) {
                                dialog.infoMessage({ text: '信箱格式錯誤' });
                                return;
                            }
                            if (CheckInput.isEmpty(vm.data.config.phone)) {
                                dialog.infoMessage({ text: '電話不可為空' });
                                return;
                            }
                            if (!CheckInput.isTaiwanPhone(vm.data.config.phone)) {
                                dialog.infoMessage({ text: BgWidget.taiwanPhoneAlert() });
                                return;
                            }
                            dialog.dataLoading({ visible: true });
                            ApiUser.setPermission({
                                email: obj.type === 'add' ? vm.data.email : original.email,
                                config: {
                                    name: vm.data.config.name,
                                    title: vm.data.config.title,
                                    phone: vm.data.config.phone,
                                    auth: vm.data.config.auth,
                                    member_id: vm.data.config.member_id,
                                    pin: vm.data.config.pin,
                                    is_manager: vm.data.id === -1,
                                    support_shop: vm.data.config.support_shop,
                                },
                                status: obj.type === 'add' ? 1 : vm.data.status,
                            }).then(res => {
                                dialog.dataLoading({ visible: false });
                                if (res.result) {
                                    if (res.response.result) {
                                        vm.type = 'list';
                                        dialog.successMessage({ text: '更新成功' });
                                    }
                                    else {
                                        dialog.errorMessage({ text: res.response.message });
                                    }
                                }
                                else {
                                    dialog.errorMessage({ text: '更新失敗' });
                                }
                            });
                        }))}
              </div>`,
                    ].join(html ` <div style="margin-top: 24px;"></div>`));
                },
            };
        });
    }
    static editorDetailPos(obj) {
        const html = String.raw;
        const gvc = obj.gvc;
        const vm = obj.vm;
        const original = JSON.parse(JSON.stringify(vm.data));
        const dialog = new ShareDialog(gvc.glitter);
        return gvc.bindView(() => {
            const viewID = gvc.glitter.getUUID();
            return {
                bind: viewID,
                view: () => {
                    return BgWidget.container([
                        html ` <div class="title-container">
                ${BgWidget.goBack(gvc.event(() => {
                            vm.type = 'list';
                        }))}
                ${BgWidget.title(obj.type === 'add' ? '新增員工' : '編輯員工')}
              </div>`,
                        [
                            obj.type === 'replace'
                                ? BgWidget.mainCard(html `
                      <div class="tx_700">登錄存取權</div>
                      ${BgWidget.mbContainer(18)}
                      <div class="d-flex align-items-center gap-2 mb-2 ${vm.data.id === -1 ? `d-none` : ``}">
                        <div class="tx_normal">存取權開啟</div>
                        ${BgWidget.switchButton(gvc, vm.data.status === 1, () => {
                                    vm.data.status = (vm.data.status - 1) * -1;
                                })}
                      </div>
                      ${BgWidget.grayNote(vm.data.id === -1
                                    ? `當前為商店擁有者，如需更換商店擁有者請聯絡SHOPNEX客服`
                                    : '一鍵開啟或關閉此員工的登入存取權，停用後員工將無法登入店家管理後台。')}
                    `)
                                : '',
                            BgWidget.mainCard(html `
                  <div class="tx_700">員工資料</div>
                  ${BgWidget.mbContainer(18)}
                  <div class="row">
                    ${[
                                BgWidget.editeInput({
                                    gvc: gvc,
                                    title: '員工名稱',
                                    placeHolder: `請輸入員工名稱`,
                                    default: vm.data.config.name,
                                    callback: text => {
                                        vm.data.config.name = text;
                                    },
                                }),
                                BgWidget.editeInput({
                                    gvc: gvc,
                                    title: '職稱',
                                    placeHolder: `請輸入職稱`,
                                    default: vm.data.config.title,
                                    callback: text => {
                                        vm.data.config.title = text;
                                    },
                                }),
                                BgWidget.editeInput({
                                    gvc: gvc,
                                    title: '電話',
                                    placeHolder: `請輸入電話`,
                                    default: vm.data.config.phone,
                                    callback: text => {
                                        vm.data.config.phone = text;
                                    },
                                }),
                                BgWidget.editeInput({
                                    gvc: gvc,
                                    title: '電子信箱',
                                    placeHolder: `請輸入電子信箱`,
                                    default: vm.data.email || vm.data.config.verifyEmail || '',
                                    callback: text => {
                                        vm.data.email = text;
                                    },
                                    readonly: obj.type === 'replace',
                                }),
                                BgWidget.editeInput({
                                    gvc: gvc,
                                    title: '員工編號',
                                    placeHolder: '請輸入員工編號',
                                    default: vm.data.config.member_id,
                                    callback: text => {
                                        vm.data.config.member_id = text;
                                    },
                                }),
                                BgWidget.editeInput({
                                    gvc: gvc,
                                    title: 'PIN碼',
                                    type: 'number',
                                    placeHolder: `此PIN碼會用作員工登入密碼`,
                                    default: vm.data.config.pin,
                                    callback: text => {
                                        vm.data.config.pin = text;
                                    },
                                    pattern: '0-9',
                                    oninput: text => {
                                        if (text.length >= 6) {
                                            text.substring(0, 6);
                                            vm.data.config.pin = text;
                                            gvc.notifyDataChange(viewID);
                                        }
                                    },
                                }),
                            ]
                                .filter(str => {
                                return str.length > 0;
                            })
                                .map(str => {
                                return html ` <div class="col-12 col-md-6">${str}</div>`;
                            })
                                .join('')}
                  </div>
                `),
                        ]
                            .filter(dd => {
                            return dd;
                        })
                            .join(BgWidget.mbContainer(24)),
                        BgWidget.mbContainer(240),
                        html ` <div class="update-bar-container">
                ${obj.type === 'replace'
                            ? BgWidget.redButton('移除此員工', gvc.event(() => {
                                dialog.warningMessage({
                                    text: '此動作無法復原，確定要刪除此員工嗎？',
                                    callback: bool => {
                                        if (bool) {
                                            dialog.dataLoading({ visible: true });
                                            ApiUser.deletePermission(vm.data.email || vm.data.config.verifyEmail).then(res => {
                                                dialog.dataLoading({ visible: false });
                                                if (res.result && res.response.result) {
                                                    dialog.successMessage({ text: '刪除成功' });
                                                    vm.type = 'list';
                                                }
                                                else {
                                                    dialog.errorMessage({ text: '刪除失敗' });
                                                }
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
                            if (CheckInput.isEmpty(vm.data.config.name)) {
                                dialog.infoMessage({ text: '員工名稱不可為空' });
                                return;
                            }
                            if (CheckInput.isEmpty(vm.data.config.title)) {
                                dialog.infoMessage({ text: '職稱不可為空' });
                                return;
                            }
                            if (obj.type === 'add' && !CheckInput.isEmail(vm.data.email)) {
                                dialog.infoMessage({ text: '信箱格式錯誤' });
                                return;
                            }
                            if (CheckInput.isEmpty(vm.data.config.phone)) {
                                dialog.infoMessage({ text: '電話不可為空' });
                                return;
                            }
                            if (CheckInput.isEmpty(vm.data.config.pin)) {
                                dialog.infoMessage({ text: 'PIN不可為空' });
                                return;
                            }
                            else if (vm.data.config.pin.length < 6) {
                                dialog.infoMessage({ text: 'PIN碼長度需等於6' });
                                return;
                            }
                            else if (!/^[0-9]+$/.test(vm.data.config.pin)) {
                                dialog.infoMessage({ text: 'PIN碼只能包含數字' });
                                return;
                            }
                            if (!CheckInput.isTaiwanPhone(vm.data.config.phone)) {
                                dialog.infoMessage({ text: BgWidget.taiwanPhoneAlert() });
                                return;
                            }
                            dialog.dataLoading({ visible: true });
                            vm.data.config.come_from = 'pos';
                            ApiUser.setPermission({
                                email: obj.type === 'add' ? vm.data.email : original.email,
                                config: vm.data.config,
                                status: vm.data.status,
                            }).then(res => {
                                dialog.dataLoading({ visible: false });
                                if (res.result) {
                                    if (res.response.result) {
                                        vm.type = 'list';
                                        dialog.successMessage({ text: '更新成功' });
                                    }
                                    else {
                                        dialog.errorMessage({ text: res.response.message });
                                    }
                                }
                                else {
                                    dialog.errorMessage({ text: '更新失敗' });
                                }
                            });
                        }))}
              </div>`,
                    ].join(html ` <div style="margin-top: 24px;"></div>`));
                },
            };
        });
    }
    static permissionOptions(gvc, authData) {
        const tempMenu = [];
        Setting_editor.menuItems().map(menu => {
            const index = tempMenu.findIndex(item => item.key === menu.group);
            if (index === -1) {
                tempMenu.push({
                    key: menu.group,
                    name: menu.group,
                    children: [
                        {
                            key: menu.page,
                            name: menu.title,
                        },
                    ],
                });
            }
            else {
                tempMenu[index].children.push({
                    key: menu.page,
                    name: menu.title,
                });
            }
        });
        return html ` <div class="row">${this.checkboxContainer(gvc, tempMenu, authData)}</div>`;
    }
    static checkboxContainer(gvc, items, authData, callback) {
        const id = gvc.glitter.getUUID();
        const randomString = BgWidget.getCheckedClass(gvc);
        const viewId = Tool.randomString(5);
        function renderCheck(key, status) {
            if (key) {
                const i = authData.findIndex(auth => auth.key === key);
                if (i === -1) {
                    authData.push({
                        key: key,
                        value: {
                            read: status,
                        },
                    });
                }
                else {
                    authData[i].value = {
                        read: status,
                    };
                }
            }
        }
        return gvc.bindView({
            bind: viewId,
            view: () => {
                let checkboxHTML = '';
                items.map(item => {
                    const i = authData.findIndex(auth => auth.key === item.key);
                    let checked = i === -1 ? false : Boolean(authData[i].value.read);
                    if (item.children && item.children.length > 0) {
                        const allStatus = item.children.every(child => {
                            const k = authData.findIndex(auth => auth.key === child.key);
                            return k > -1 ? authData[k].value.read : false;
                        });
                        checked = allStatus;
                    }
                    checkboxHTML += html `
            <div class="col-12 ${item.children ? 'col-md-4 mb-3' : 'col-md-12'}">
              <div
                class="form-check"
                onclick="${gvc.event(() => {
                        renderCheck(item.key, !checked);
                        if (item.children && item.children.length > 0) {
                            item.children.map(child => {
                                renderCheck(child.key, !checked);
                            });
                        }
                        if (callback) {
                            callback();
                        }
                        else {
                            gvc.notifyDataChange(viewId);
                        }
                    })}"
              >
                <input
                  class="form-check-input ${randomString} cursor_pointer"
                  style="margin-top: 0.35rem;"
                  type="checkbox"
                  id="${id}_${item.key}"
                  ${checked ? 'checked' : ''}
                />
                <label
                  class="form-check-label cursor_pointer"
                  for="${id}_${item.key}"
                  style="font-size: 16px; color: #393939;"
                  >${item.name}</label
                >
              </div>
              ${item.children
                        ? html ` <div class="d-flex position-relative my-2">
                    ${BgWidget.leftLineBar()}
                    <div class="ms-4 w-100 flex-fill">
                      ${this.checkboxContainer(gvc, item.children, authData, () => {
                            gvc.notifyDataChange(viewId);
                        })}
                    </div>
                  </div>`
                        : ``}
            </div>
          `;
                });
                return html ` <div class="row">${checkboxHTML}</div> `;
            },
        });
    }
}
window.glitter.setModule(import.meta.url, PermissionSetting);
