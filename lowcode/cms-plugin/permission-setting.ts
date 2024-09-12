import { GVC } from '../glitterBundle/GVController.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { FilterOptions } from './filter-options.js';
import { BgListComponent } from '../backend-manager/bg-list-component.js';
import { CheckInput } from '../modules/checkInput.js';
import { Setting_editor } from '../jspage/function-page/setting_editor.js';
import { Tool } from '../modules/tool.js';

const html = String.raw;

type CRUD = {
    create?: boolean;
    read?: boolean;
    update?: boolean;
    delete?: boolean;
};

type authItem = {
    key?: string;
    name?: string;
    children?: authItem[];
};

interface PermissionItem {
    id: number;
    user: string;
    appName: string;
    config: {
        auth: {
            key: string;
            value: CRUD;
        }[];
        name: string;
        phone: string;
        title: string;
        verifyEmail?: string;
    };
    created_time: string;
    updated_time: string;
    status: number;
    invited: number;
    email: string;
    online_time: string;
}

type ViewModel = {
    id: string;
    filterId: string;
    tableId: string;
    type: 'list' | 'add' | 'replace';
    tab: string;
    query: string;
    queryType: string;
    orderString: string;
    data: PermissionItem;
    dataList: any;
    filter: any;
};

export class PermissionSetting {
    static main(gvc: GVC) {
        const glitter = gvc.glitter;
        const dialog = new ShareDialog(glitter);
        const vm: ViewModel = {
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
                status: 0,
                invited: 0,
                email: '',
                online_time: '',
            },
            dataList: [],
            filter: {},
        };
        let vmi: any = undefined;
        const ListComp = new BgListComponent(gvc, vm, FilterOptions.permissionFilterFrame);
        vm.filter = ListComp.getFilterObject();

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
                        key: '員工名稱',
                        value: `<span class="fs-7">${dd.config.name}</span>`,
                    },
                    {
                        key: '信箱帳號',
                        value: dd.email ? `<span class="fs-7">${dd.email}</span>` : BgWidget.warningInsignia('信箱尚未註冊'),
                    },
                    {
                        key: '電話',
                        value: `<span class="fs-7">${dd.config.phone}</span>`,
                    },
                    {
                        key: '職稱',
                        value: `<span class="fs-7">${dd.config.title}</span>`,
                    },
                    {
                        key: '最後登入',
                        value: dd.online_time ? html`<span class="fs-7">${glitter.ut.dateFormat(new Date(dd.online_time), 'yyyy-MM-dd hh:mm')}</span>` : BgWidget.warningInsignia('信箱尚未註冊'),
                    },
                    {
                        key: '存取權',
                        value: gvc.bindView(
                            (() => {
                                const id = glitter.getUUID();
                                return {
                                    bind: id,
                                    view: () => {
                                        return BgWidget.switchTextButton(
                                            gvc,
                                            dd.status,
                                            {
                                                left: dd.status ? '啟用' : '關閉',
                                            },
                                            () => {
                                                ApiUser.togglePermissionStatus(dd.email).then((data) => {
                                                    if (data.result) {
                                                        dd.status = data.response.status;
                                                        dialog.successMessage({ text: `${dd.status ? '啟用' : '關閉'}成功` });
                                                    } else {
                                                        dialog.errorMessage({ text: `${dd.status ? '啟用' : '關閉'}失敗` });
                                                    }
                                                    gvc.notifyDataChange(id);
                                                });
                                            }
                                        );
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
                            })()
                        ),
                    },
                    {
                        key: '邀請狀態',
                        value: dd.invited ? BgWidget.infoInsignia('已接受') : BgWidget.notifyInsignia('邀請中'),
                    },
                ];
            });
        }

        return gvc.bindView({
            bind: vm.id,
            dataList: [{ obj: vm, key: 'type' }],
            view: () => {
                if (vm.type === 'list') {
                    return BgWidget.container(
                        html` <div class="d-flex w-100 align-items-center" style="gap: 14px;">
                                ${BgWidget.title('員工設定')}
                                <div class="flex-fill"></div>
                                ${BgWidget.darkButton(
                                    '新增',
                                    gvc.event(() => {
                                        vm.data = {
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
                                            status: 0,
                                            invited: 0,
                                            email: '',
                                            online_time: '',
                                        };
                                        vm.type = 'add';
                                    })
                                )}
                            </div>
                            ${BgWidget.tab(
                                [
                                    {
                                        title: '所有員工',
                                        key: 'all',
                                    },
                                ],
                                gvc,
                                vm.tab,
                                (text) => {
                                    vm.tab = text as any;
                                    gvc.notifyDataChange(vm.id);
                                }
                            )}
                            ${BgWidget.mainCard(
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
                                                        options: FilterOptions.permissionSelect,
                                                    }),
                                                    BgWidget.searchFilter(
                                                        gvc.event((e) => {
                                                            vm.query = e.value;
                                                            gvc.notifyDataChange(vm.tableId);
                                                            gvc.notifyDataChange(id);
                                                        }),
                                                        vm.query || '',
                                                        '搜尋所有員工'
                                                    ),
                                                    BgWidget.funnelFilter({
                                                        gvc,
                                                        callback: () => ListComp.showRightMenu(FilterOptions.permissionFunnel),
                                                    }),
                                                    BgWidget.updownFilter({
                                                        gvc,
                                                        callback: (value: any) => {
                                                            vm.orderString = value;
                                                            gvc.notifyDataChange(vm.tableId);
                                                            gvc.notifyDataChange(id);
                                                        },
                                                        default: vm.orderString || 'default',
                                                        options: FilterOptions.permissionOrderBy,
                                                    }),
                                                ];

                                                const filterTags = ListComp.getFilterTags(FilterOptions.permissionFunnel);

                                                if (document.body.clientWidth < 768) {
                                                    // 手機版
                                                    return html` <div style="display: flex; align-items: center; gap: 10px; width: 100%; justify-content: space-between">
                                                            <div>${filterList[0]}</div>
                                                            <div style="display: flex;">
                                                                <div class="me-2">${filterList[2]}</div>
                                                                ${filterList[3]}
                                                            </div>
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
                                            return BgWidget.tableV2({
                                                gvc: gvc,
                                                getData: (vd) => {
                                                    vmi = vd;
                                                    const limit = 10;
                                                    ApiUser.getPermission({
                                                        page: vmi.page - 1,
                                                        limit: limit,
                                                        queryType: vm.queryType,
                                                        query: vm.query,
                                                        orderBy: vm.orderString,
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
                                                filter: gvc.bindView(() => {
                                                    return {
                                                        bind: vm.filterId,
                                                        view: () => {
                                                            const dialog = new ShareDialog(gvc.glitter);
                                                            const selCount = vm.dataList.filter((dd: any) => dd.checked).length;
                                                            return BgWidget.selNavbar({
                                                                count: selCount,
                                                                buttonList: [
                                                                    BgWidget.selEventButton(
                                                                        '批量刪除',
                                                                        gvc.event(() => {
                                                                            dialog.warningMessage({
                                                                                text: '您即將批量刪除所選員工的所有資料<br />此操作無法復原。確定要刪除嗎？',
                                                                                callback: (response) => {
                                                                                    if (response) {
                                                                                        let n = 0;
                                                                                        const emails = vm.dataList
                                                                                            .filter((dd: any) => {
                                                                                                return dd.checked;
                                                                                            })
                                                                                            .map((dd: any) => {
                                                                                                return dd.email;
                                                                                            });

                                                                                        dialog.dataLoading({ visible: true });
                                                                                        new Promise<void>((resolve, reject) => {
                                                                                            for (const email of emails) {
                                                                                                ApiUser.deletePermission(email).then((res) => {
                                                                                                    if (res.result && res.response.result) {
                                                                                                        if (++n === emails.length) {
                                                                                                            resolve();
                                                                                                        }
                                                                                                    } else {
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
                                                                                            }, 400);
                                                                                        });
                                                                                    }
                                                                                },
                                                                            });
                                                                        })
                                                                    ),
                                                                ],
                                                            });
                                                        },
                                                        divCreate: () => {
                                                            const display = !vm.dataList || !vm.dataList.find((dd: any) => dd.checked) ? 'd-none' : '';
                                                            return {
                                                                class: `d-flex align-items-center p-2 ${display}`,
                                                                style: ``,
                                                            };
                                                        },
                                                    };
                                                }),
                                            });
                                        },
                                    }),
                                ].join('')
                            )}`,
                        BgWidget.getContainerWidth()
                    );
                } else if (vm.type == 'replace') {
                    return this.editorDetail({
                        vm: vm,
                        gvc: gvc,
                        type: 'replace',
                    });
                }
                return this.editorDetail({
                    vm: vm,
                    gvc: gvc,
                    type: 'add',
                });
            },
        });
    }

    static editorDetail(obj: { vm: ViewModel; gvc: any; type: string }) {
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
                    return BgWidget.container(
                        [
                            // 上層導覽
                            html` <div class="d-flex w-100 align-items-center">
                                ${BgWidget.goBack(
                                    gvc.event(() => {
                                        vm.type = 'list';
                                    })
                                )}
                                ${BgWidget.title(obj.type === 'add' ? '新增員工' : '編輯員工')}
                            </div>`,
                            [
                                obj.type === 'replace'
                                    ? BgWidget.mainCard(html`
                                          <div class="tx_700">登錄存取權</div>
                                          ${BgWidget.mbContainer(18)}
                                          <div class="d-flex align-items-center gap-2">
                                              <div class="tx_normal">存取權開啟</div>
                                              ${BgWidget.switchButton(gvc, vm.data.status === 1, () => {
                                                  vm.data.status = (vm.data.status - 1) * -1;
                                              })}
                                          </div>
                                          ${BgWidget.grayNote('一鍵開啟或關閉此員工的登入存取權，停用後員工將無法登入店家管理後台。')}
                                      `)
                                    : '',
                                BgWidget.mainCard(
                                    html`
                                        <div class="tx_700">員工資料</div>
                                        ${BgWidget.mbContainer(18)}
                                        <div class="row">
                                            ${[
                                                BgWidget.editeInput({
                                                    gvc: gvc,
                                                    title: '員工名稱',
                                                    placeHolder: `請輸入員工名稱`,
                                                    default: vm.data.config.name,
                                                    callback: (text) => {
                                                        vm.data.config.name = text;
                                                    },
                                                }),
                                                BgWidget.editeInput({
                                                    gvc: gvc,
                                                    title: '職稱',
                                                    placeHolder: `請輸入職稱`,
                                                    default: vm.data.config.title,
                                                    callback: (text) => {
                                                        vm.data.config.title = text;
                                                    },
                                                }),
                                                BgWidget.editeInput({
                                                    gvc: gvc,
                                                    title: '信箱帳號',
                                                    placeHolder: '此信箱將會作為寄送邀請信之信箱',
                                                    default: vm.data.email ?? vm.data.config.verifyEmail,
                                                    callback: (text) => {
                                                        vm.data.email = text;
                                                    },
                                                    readonly: obj.type === 'replace',
                                                }),
                                                BgWidget.editeInput({
                                                    gvc: gvc,
                                                    title: '電話',
                                                    placeHolder: `請輸入電話`,
                                                    default: vm.data.config.phone,
                                                    callback: (text) => {
                                                        vm.data.config.phone = text;
                                                    },
                                                }),
                                            ]
                                                .filter((str) => {
                                                    return str.length > 0;
                                                })
                                                .map((str) => {
                                                    return html`<div class="col-12 col-md-6">${str}</div>`;
                                                })
                                                .join('')}
                                        </div>
                                    `
                                ),
                                BgWidget.mainCard(html` <div class="tx_700">權限指派</div>
                                    ${BgWidget.mbContainer(18)} ${this.permissionOptions(gvc, vm.data.config.auth)}`),
                            ].join(BgWidget.mbContainer(24)),
                            // 空白容器
                            BgWidget.mbContainer(240),
                            // 儲存資料
                            html` <div class="update-bar-container">
                                ${obj.type === 'replace'
                                    ? BgWidget.redButton(
                                          '移除此員工',
                                          gvc.event(() => {
                                              dialog.warningMessage({
                                                  text: '此動作無法復原，確定要刪除此員工嗎？',
                                                  callback: (bool) => {
                                                      if (bool) {
                                                          dialog.dataLoading({ visible: true });
                                                          ApiUser.deletePermission(vm.data.email).then((res) => {
                                                              dialog.dataLoading({ visible: false });
                                                              if (res.result && res.response.result) {
                                                                  dialog.successMessage({ text: '刪除成功' });
                                                                  vm.type = 'list';
                                                              } else {
                                                                  dialog.errorMessage({ text: '刪除失敗' });
                                                              }
                                                          });
                                                      }
                                                  },
                                              });
                                          })
                                      )
                                    : ''}
                                ${BgWidget.cancel(
                                    gvc.event(() => {
                                        vm.type = 'list';
                                    })
                                )}
                                ${BgWidget.save(
                                    gvc.event(() => {
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
                                            },
                                            status: vm.data.status,
                                        }).then((res) => {
                                            dialog.dataLoading({ visible: false });
                                            if (res.result) {
                                                if (res.response.result) {
                                                    vm.type = 'list';
                                                    dialog.successMessage({ text: '更新成功' });
                                                } else {
                                                    dialog.errorMessage({ text: res.response.message });
                                                }
                                            } else {
                                                dialog.errorMessage({ text: '更新失敗' });
                                            }
                                        });
                                    })
                                )}
                            </div>`,
                        ].join(html` <div style="margin-top: 24px;"></div>`),
                        BgWidget.getContainerWidth() / (document.body.clientWidth > 768 ? 1.25 : 1)
                    );
                },
            };
        });
    }

    static permissionOptions(gvc: GVC, authData: { key: string; value: CRUD }[]) {
        const tempMenu: authItem[] = [];
        Setting_editor.menuItems().map((menu) => {
            const index = tempMenu.findIndex((item) => {
                return item.key === menu.group;
            });
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
            } else {
                (tempMenu[index].children as authItem[]).push({
                    key: menu.page,
                    name: menu.title,
                });
            }
        });

        return html` <div class="row">${this.checkboxContainer(gvc, tempMenu, authData)}</div>`;
    }

    static checkboxContainer(
        gvc: GVC,
        items: authItem[],
        authData: {
            key: string;
            value: CRUD;
        }[],
        callback?: () => void
    ) {
        const id = gvc.glitter.getUUID();
        const inputColor = undefined;
        const randomString = BgWidget.getCheckedClass(gvc, inputColor);
        const viewId = Tool.randomString(5);

        function renderCheck(key: string | undefined, status: boolean) {
            if (key) {
                const i = authData.findIndex((auth) => auth.key === key);
                if (i === -1) {
                    authData.push({
                        key: key,
                        value: {
                            read: status,
                        },
                    });
                } else {
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
                items.map((item) => {
                    const i = authData.findIndex((auth) => auth.key === item.key);
                    let checked = i === -1 ? false : Boolean(authData[i].value.read);

                    if (item.children && item.children.length > 0) {
                        const allStatus = item.children.every((child) => {
                            const k = authData.findIndex((auth) => auth.key === child.key);
                            return k > -1 ? authData[k].value.read : false;
                        });
                        checked = allStatus;
                    }

                    checkboxHTML += html`
                        <div class="col-12 ${item.children ? 'col-md-4 mb-3' : 'col-md-12'}">
                            <div
                                class="form-check"
                                onclick="${gvc.event(() => {
                                    renderCheck(item.key, !checked);
                                    if (item.children && item.children.length > 0) {
                                        item.children.map((child) => {
                                            renderCheck(child.key, !checked);
                                        });
                                    }
                                    if (callback) {
                                        callback();
                                    } else {
                                        gvc.notifyDataChange(viewId);
                                    }
                                })}"
                            >
                                <input class="form-check-input ${randomString} cursor_pointer" style="margin-top: 0.35rem;" type="checkbox" id="${id}_${item.key}" ${checked ? 'checked' : ''} />
                                <label class="form-check-label cursor_pointer" for="${id}_${item.key}" style="font-size: 16px; color: #393939;">${item.name}</label>
                            </div>
                            ${item.children
                                ? html` <div class="d-flex position-relative my-2">
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

                return html` <div class="row" style="">${checkboxHTML}</div> `;
            },
        });
    }
}

(window as any).glitter.setModule(import.meta.url, PermissionSetting);
