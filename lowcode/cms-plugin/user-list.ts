import {GVC} from "../glitterBundle/GVController.js";
import {EditorElem} from "../glitterBundle/plugins/editor-elem.js";
import {BgWidget} from "../backend-manager/bg-widget.js";
import {ApiUser} from "../glitter-base/route/user.js";
import {ShareDialog} from "../glitterBundle/dialog/ShareDialog.js";
import {FormWidget} from "../official_view_component/official/form.js";
import {ApiWallet} from "../glitter-base/route/wallet.js";
import {SeoSetting} from "./seo-setting.js";

export class UserList {
    public static main(gvc: GVC) {
        const html = String.raw;
        const glitter = gvc.glitter;
        let callback = (data: any) => {
        }
        const vm: {
            type: "list" | "add" | "replace" | 'select',
            data: any,
            dataList: any,
            query?: string
        } = {
            type: "list",
            data: {
                "id": 61,
                "userID": 549313940,
                "account": "jianzhi.wang@homee.ai",
                "userData": {"name": "王建智", "email": "jianzhi.wang@homee.ai", "phone": "0978028739"},
                "created_time": "2023-11-26T02:14:09.000Z",
                "role": 0,
                "company": null,
                "status": 1
            },
            dataList: undefined,
            query: ''
        }
        const filterID = gvc.glitter.getUUID()
        let vmi: any = undefined

        function getDatalist() {
            return vm.dataList.map((dd: any) => {
                return [
                    {
                        key: EditorElem.checkBoxOnly({
                            gvc: gvc,
                            def: (!vm.dataList.find((dd: any) => {
                                return !dd.checked
                            })),
                            callback: (result) => {
                                vm.dataList.map((dd: any) => {
                                    dd.checked = result
                                })
                                vmi.data = getDatalist()
                                vmi.callback()
                                gvc.notifyDataChange(filterID)
                                callback(vm.dataList.filter((dd: any) => {
                                    return dd.checked
                                }))
                            }
                        }),
                        value: EditorElem.checkBoxOnly({
                            gvc: gvc,
                            def: dd.checked,
                            callback: (result) => {
                                dd.checked = result
                                vmi.data = getDatalist()
                                vmi.callback()
                                gvc.notifyDataChange(filterID)
                                callback(vm.dataList.filter((dd: any) => {
                                    return dd.checked
                                }))

                            },
                            style: "height:25px;"
                        })
                    },
                    {
                        key: '用戶名稱',
                        value: `<span class="fs-7">${dd.userData.name}</span>`
                    },
                    {
                        key: '用戶信箱',
                        value: `<span class="fs-7">${dd.userData.email}</span>`
                    },
                    {
                        key: '建立時間',
                        value: `<span class="fs-7">${glitter.ut.dateFormat(new Date(dd.created_time), 'yyyy-MM-dd hh:mm')}</span>`
                    },
                    {
                        key: '用戶狀態',
                        value: (() => {
                            if (dd.status === 1) {
                                return `<div class="badge bg-info fs-7" style="max-height:34px;">啟用中</div>`
                            } else {
                                return `<div class="badge bg-danger fs-7" style="max-height:34px;">已停用</div>`
                            }
                        })()
                    }
                ]
            })
        }

        return gvc.bindView(() => {
            const id = glitter.getUUID()
            return {
                bind: id,
                dataList: [{obj: vm, key: 'type'}],
                view: () => {
                    if (vm.type === 'list') {
                        return BgWidget.container(html`
                            <div class="d-flex w-100 align-items-center mb-3">
                                ${BgWidget.title('用戶管理')}
                                <div class="flex-fill"></div>
                                <button class="btn hoverBtn me-2 px-3"
                                        style="height:35px !important;font-size: 14px;color:black;border:1px solid black;"
                                        onclick="${
                                                gvc.event(() => {
                                                    UserList.setUserForm(gvc, () => {
                                                        gvc.notifyDataChange(id)
                                                    })
                                                })
                                        }">
                                    <i class="fa-regular fa-gear me-2 "></i>
                                    自訂資料
                                </button>
                            </div>
                            ${BgWidget.table({
                                gvc: gvc,
                                getData: (vd) => {
                                    vmi = vd
                                    ApiUser.getUserList({
                                        page: vmi.page - 1,
                                        limit: 20,
                                        search: vm.query || undefined
                                    }).then((data) => {
                                        vmi.pageSize = Math.ceil(data.response.total / 20)
                                        vm.dataList = data.response.data
                                        vmi.data = getDatalist()
                                        vmi.loading = false
                                        vmi.callback()
                                    })
                                },
                                rowClick: (data, index) => {
                                    vm.data = vm.dataList[index]
                                    vm.type = "replace"
                                },
                                filter: html`
                                    ${BgWidget.searchPlace(gvc.event((e, event) => {
                                        vm.query = e.value
                                        gvc.notifyDataChange(id)
                                    }), vm.query || '','搜尋所有用戶')}
                                    ${
                                            gvc.bindView(() => {
                                                return {
                                                    bind: filterID,
                                                    view: () => {
                                                        return [
                                                            `<span class="fs-7 fw-bold">操作選項</span>`,
                                                            `<button class="btn btn-danger fs-7 px-2" style="height:30px;border:none;" onclick="${gvc.event(() => {
                                                                const dialog = new ShareDialog(gvc.glitter)
                                                                dialog.checkYesOrNot({
                                                                    text: '是否確認移除所選項目?',
                                                                    callback: (response) => {
                                                                        if (response) {
                                                                            dialog.dataLoading({visible: true})
                                                                            ApiUser.deleteUser({
                                                                                id: vm.dataList.filter((dd: any) => {
                                                                                    return dd.checked
                                                                                }).map((dd: any) => {
                                                                                    return dd.id
                                                                                }).join(`,`)
                                                                            }).then((res) => {
                                                                                dialog.dataLoading({visible: false})
                                                                                if (res.result) {
                                                                                    vm.dataList = undefined
                                                                                    gvc.notifyDataChange(id)
                                                                                } else {
                                                                                    dialog.errorMessage({text: "刪除失敗"})
                                                                                }
                                                                            })
                                                                        }
                                                                    }
                                                                })
                                                            })}">批量移除</button>`
                                                        ].join(``)
                                                    },
                                                    divCreate: () => {
                                                        return {
                                                            class: `d-flex align-items-center p-2 py-3 ${(!vm.dataList || !vm.dataList.find((dd: any) => {
                                                                return dd.checked
                                                            })) ? `d-none` : ``}`,
                                                            style: `height:40px;gap:10px;margin-top:10px;`
                                                        }
                                                    }
                                                }
                                            })
                                    }
                                `
                            })}
                        `)
                    } else if (vm.type == 'replace') {
                        return this.userInformationDetail({
                            userID: vm.data.userID,
                            callback: () => {
                                vm.type = 'list'
                            },
                            gvc: gvc
                        })
                    } else {
                        return ``
                    }

                },
                divCreate: {
                    class: `w-100`
                }
            }
        })
    }

    public static setUserForm(gvc: GVC, callback: () => void) {
        const dialog = new ShareDialog(gvc.glitter)
        const saasConfig: {
            config: any,
            api: any
        } = (window.parent as any).saasConfig
        new Promise(async (resolve, reject) => {
            let data = (((await saasConfig.api.getPrivateConfig(saasConfig.config.appName, `glitterUserForm`)).response.result[0]) ?? {}).value
            if (!Array.isArray(data)) {
                data = []
            }
            EditorElem.openEditorDialog(gvc, (gvc) => {
                return [
                    gvc.bindView(() => {
                        const id = gvc.glitter.getUUID()
                        return {
                            bind: id,
                            view: () => {
                                return FormWidget.settingView({
                                    gvc: gvc,
                                    array: data,
                                    refresh: () => {
                                        setTimeout(() => {
                                            gvc.notifyDataChange(id)
                                        }, 100)

                                    },
                                    title: '',
                                    styleSetting: false,
                                    concat: (dd) => {
                                        dd.auth = dd.auth ?? 'all';
                                        return [
                                            EditorElem.select({
                                                title: "更改資料權限",
                                                gvc: gvc,
                                                def: dd.auth,
                                                array: [
                                                    {title: '用戶與管理員', value: 'all'},
                                                    {title: '僅管理員', value: 'manager'}
                                                ],
                                                callback: (text) => {
                                                    dd.auth = text
                                                }
                                            })
                                        ]
                                    }
                                })
                            }
                        }
                    }),
                    `<div class="d-flex">
<div class="flex-fill"></div>
<div class=" btn-primary-c btn my-2 me-2" style="margin-left: 10px;height:35px;" onclick="${gvc.event(() => {
                        dialog.dataLoading({text: '設定中', visible: true})
                        saasConfig.api.setPrivateConfig(saasConfig.config.appName, "glitterUserForm", data).then((r: { response: any, result: boolean }) => {
                            setTimeout(() => {
                                dialog.dataLoading({visible: false})
                                if (r.response) {
                                    dialog.successMessage({text: "設定成功"})
                                    callback()
                                } else {
                                    dialog.errorMessage({text: "設定失敗"})
                                }
                            }, 1000)
                        })
                        gvc.closeDialog()
                    })}">儲存設定</div>
</div>`
                ].join('')
            }, () => {
                return new Promise((resolve, reject) => {
                    const dialog = new ShareDialog(gvc.glitter)
                    dialog.checkYesOrNot({
                        text: '是否取消除儲存?',
                        callback: (response) => {
                            resolve(response)
                        }
                    })
                })
            }, 500, '自訂表單')
        })

    }

    public static userInformationDetail(cf: {
        userID: string,
        gvc: GVC,
        callback: () => void,
        type?: 'readonly' | 'write'
    }) {

        const gvc = cf.gvc
        const id = gvc.glitter.getUUID()
        const vm: any = {
            data: undefined,
            loading: true
        };

        (ApiUser.getPublicUserData(cf.userID)).then((dd) => {
            vm.data = dd.response;
            vm.loading = false;
            gvc.notifyDataChange(id)
        })
        return gvc.bindView(() => {
            return {
                bind: id,
                view: () => {
                    if (vm.loading) {
                        return `<div class="w-100 d-flex align-items-center"><div class="spinner-border"></div></div>`
                    }
                    vm.data.userData = vm.data.userData ?? {}
                    return BgWidget.container([
                        `<div class="d-flex w-100 align-items-center mb-3 ">
                ${BgWidget.goBack(gvc.event(() => {
                            cf.callback()
                        }))} ${BgWidget.title(vm.data.userData.name ?? "匿名用戶")}
                <div class="flex-fill"></div>
                <button class="btn hoverBtn me-2 px-3 ${(cf.type === 'readonly') ? `d-none` : ``}" style="height:35px !important;font-size: 14px;color:black;border:1px solid black;" onclick="${
                            gvc.event(() => {
                                this.setUserForm(gvc, () => {
                                    gvc.notifyDataChange(id)
                                })
                            })
                        }">
                <i class="fa-regular fa-gear me-2 " ></i>
                自訂資料
</button>
                <button class="btn btn-primary-c ${(cf.type === 'readonly') ? `d-none` : ``}" style="height:35px;font-size: 14px;"
                        onclick="${gvc.event(() => {
                            const dialog = new ShareDialog(gvc.glitter)
                            dialog.dataLoading({text: "更新中", visible: true})
                            ApiUser.updateUserDataManager(vm.data, vm.data.userID).then((response) => {
                                dialog.dataLoading({text: "", visible: false})
                                if (response.result) {
                                    dialog.successMessage({text: "更新成功!"})
                                    gvc.notifyDataChange(id)
                                } else {
                                    dialog.errorMessage({text: "更新異常!"})
                                }
                            })

                        })}">儲存
                </button>
            </div>`,
                        `<div class="d-flex" style="gap:10px;">
${
                            BgWidget.card([
                                gvc.bindView(() => {
                                    const id = gvc.glitter.getUUID()
                                    const vmi: {
                                        mode: 'edit' | 'read'
                                    } = {
                                        mode: 'read'
                                    }
                                    return {
                                        bind: id,
                                        view: () => {
                                            let map: any = [];
                                            (vm.data.userID) && map.push(`
 <div class="d-flex align-items-center border-bottom pb-2">
                                                    <div class="fw-bold fs-7"></div>
                                                      <div class="d-flex" style="gap:10px;">
                                                  <div class="fw-bold fs-7">用戶ID</div>
                                    <div class="fw-normal fs-7">${vm.data.userID}</div>
 <div class="fw-bold fs-7">用戶建立時間</div>
                                    <div class="fw-normal fs-7">${gvc.glitter.ut.dateFormat(new Date(vm.data.created_time), 'yyyy-MM-dd hh:mm')}</div>
</div>
                                                    <div class="flex-fill"></div>
                                                    <i class="fa-solid fa-pencil ${(cf.type === 'readonly') ? `d-none` : ``}" style="cursor:pointer;" onclick="${
                                                gvc.event(() => {
                                                    vmi.mode = (vmi.mode === 'edit') ? 'read' : 'edit'
                                                    gvc.notifyDataChange(id)
                                                })
                                            }"></i>
                                                </div>

`);
                                            map.push(gvc.bindView(() => {
                                                const saasConfig: {
                                                    config: any,
                                                    api: any
                                                } = (window.parent as any).saasConfig
                                                const id = gvc.glitter.getUUID()

                                                return {
                                                    bind: id,
                                                    view: () => {
                                                        return new Promise(async (resolve, reject) => {
                                                            let data = (((await saasConfig.api.getPrivateConfig(saasConfig.config.appName, `glitterUserForm`)).response.result[0]) ?? {}).value
                                                            if (!Array.isArray(data)) {
                                                                data = []
                                                            }
                                                            resolve(FormWidget.editorView({
                                                                gvc: gvc,
                                                                array: data,
                                                                refresh: () => {

                                                                },
                                                                formData: vm.data.userData,
                                                                readonly: (vmi.mode === 'edit') ? 'write' : 'read'
                                                            }))
                                                        })
                                                    }
                                                }
                                            }))
                                            return map.join('')
                                        }
                                    }
                                })
                            ].join(`<div class="my-2 bgf6 w-100" style="height:1px;"></div>`))
                        }
<div style="width:350px;">
${BgWidget.card([`<div class="fw-bold fs-7">電子錢包</div>
     ${gvc.bindView(() => {
                            return {
                                bind: gvc.glitter.getUUID(),
                                view: () => {
                                    return new Promise(async (resolve, reject) => {
                                        const sum = (await ApiWallet.getSum({userID: vm.data.userID})).response.sum
                                        resolve(`$${sum.toLocaleString()}`)
                                    })
                                },
                                divCreate: {
                                    class: `fs-7 `
                                }
                            }
                        })}
    `, `
     <div class="fw-bold fs-7">回饋金</div>
     <div class="fs-7">${gvc.bindView(() => {
                            return {
                                bind: gvc.glitter.getUUID(),
                                view: () => {
                                    return new Promise(async (resolve, reject) => {
                                        const sum = (await ApiWallet.getRebateSum({userID: vm.data.userID})).response.sum
                                        resolve(`$${sum.toLocaleString()}`)
                                    })
                                },
                                divCreate: {
                                    class: `fs-7 `
                                }
                            }
                        })}</div>
    `].join(`<div class="w-100 border-bottom my-2"></div>`))}
</div>
</div>`,
                    ].join('<div class="my-2"></div>'), 800)

                }
            }
        })

    }

    public static userManager(gvc: GVC, type: 'select' | 'list' = 'list', callback: (list: any[]) => void = () => {
    }) {
        const glitter = gvc.glitter
        const vm: {
            type: "list" | "add" | "replace" | 'select',
            data: any,
            dataList: any,
            query?: string
        } = {
            type: "list",
            data: {
                "id": 61,
                "userID": 549313940,
                "account": "jianzhi.wang@homee.ai",
                "userData": {"name": "王建智", "email": "jianzhi.wang@homee.ai", "phone": "0978028739"},
                "created_time": "2023-11-26T02:14:09.000Z",
                "role": 0,
                "company": null,
                "status": 1
            },
            dataList: undefined,
            query: ''
        }
        const filterID = gvc.glitter.getUUID()
        let vmi: any = undefined

        function getDatalist() {
            return vm.dataList.map((dd: any) => {
                return [
                    {
                        key: EditorElem.checkBoxOnly({
                            gvc: gvc,
                            def: (!vm.dataList.find((dd: any) => {
                                return !dd.checked
                            })),
                            callback: (result) => {
                                vm.dataList.map((dd: any) => {
                                    dd.checked = result
                                })
                                vmi.data = getDatalist()
                                vmi.callback()
                                gvc.notifyDataChange(filterID)
                                callback(vm.dataList.filter((dd: any) => {
                                    return dd.checked
                                }))
                            }
                        }),
                        value: EditorElem.checkBoxOnly({
                            gvc: gvc,
                            def: dd.checked,
                            callback: (result) => {
                                dd.checked = result
                                vmi.data = getDatalist()
                                vmi.callback()
                                gvc.notifyDataChange(filterID)
                                callback(vm.dataList.filter((dd: any) => {
                                    return dd.checked
                                }))

                            },
                            style: "height:25px;"
                        })
                    },
                    {
                        key: '用戶名稱',
                        value: `<span class="fs-7">${dd.userData.name}</span>`
                    },
                    {
                        key: '用戶信箱',
                        value: `<span class="fs-7">${dd.userData.email}</span>`
                    },
                    {
                        key: '建立時間',
                        value: `<span class="fs-7">${glitter.ut.dateFormat(new Date(dd.created_time), 'yyyy-MM-dd hh:mm')}</span>`
                    },
                    {
                        key: '用戶狀態',
                        value: (() => {
                            if (dd.status === 1) {
                                return `<div class="badge bg-info fs-7" style="max-height:34px;">啟用中</div>`
                            } else {
                                return `<div class="badge bg-danger fs-7" style="max-height:34px;">已停用</div>`
                            }
                        })()
                    }
                ]
            })
        }

        const html = String.raw
        return gvc.bindView(() => {
            const id = glitter.getUUID()
            return {
                bind: id,
                dataList: [{obj: vm, key: 'type'}],
                view: () => {
                    if (vm.type === 'list') {
                        return BgWidget.container(html`
                            <div class="d-flex w-100 align-items-center mb-3 ${(type === 'select') ? `d-none` : ``}">
                                ${(type === 'select') ? BgWidget.title('選擇用戶') : BgWidget.title('用戶管理')}
                                <div class="flex-fill"></div>
                                <button class="btn hoverBtn me-2 px-3"
                                        style="height:35px !important;font-size: 14px;color:black;border:1px solid black;"
                                        onclick="${
                                                gvc.event(() => {
                                                    UserList.setUserForm(gvc, () => {
                                                        gvc.notifyDataChange(id)
                                                    })
                                                })
                                        }">
                                    <i class="fa-regular fa-gear me-2 "></i>
                                    自訂資料
                                </button>
                            </div>
                            ${BgWidget.table({
                                gvc: gvc,
                                getData: (vd) => {
                                    vmi = vd
                                    ApiUser.getUserList({
                                        page: vmi.page - 1,
                                        limit: 20,
                                        search: vm.query || undefined
                                    }).then((data) => {
                                        vmi.pageSize = Math.ceil(data.response.total / 20)
                                        vm.dataList = data.response.data
                                        vmi.data = getDatalist()
                                        vmi.loading = false
                                        vmi.callback()
                                    })
                                },
                                rowClick: (data, index) => {

                                    if (type === 'select') {
                                        vm.dataList[index].checked = !vm.dataList[index].checked
                                        vmi.data = getDatalist()
                                        vmi.callback()
                                        callback(vm.dataList.filter((dd: any) => {
                                            return dd.checked
                                        }))
                                    } else {
                                        vm.data = vm.dataList[index]
                                        vm.type = "replace"
                                    }

                                },
                                filter: html`
                                    ${BgWidget.searchPlace(gvc.event((e, event) => {
                                        vm.query = e.value;
                                        gvc.notifyDataChange(id);
                                    }),vm.query || '','搜尋所有用戶')}
                                    ${
                                            gvc.bindView(() => {
                                                return {
                                                    bind: filterID,
                                                    view: () => {
                                                        if (!vm.dataList || !vm.dataList.find((dd: any) => {
                                                            return dd.checked
                                                        }) || type === 'select') {
                                                            return ``
                                                        } else {
                                                            return [
                                                                `<span class="fs-7 fw-bold">操作選項</span>`,
                                                                `<button class="btn btn-danger fs-7 px-2" style="height:30px;border:none;" onclick="${gvc.event(() => {
                                                                    const dialog = new ShareDialog(gvc.glitter)
                                                                    dialog.checkYesOrNot({
                                                                        text: '是否確認移除所選項目?',
                                                                        callback: (response) => {
                                                                            if (response) {
                                                                                dialog.dataLoading({visible: true})
                                                                                ApiUser.deleteUser({
                                                                                    id: vm.dataList.filter((dd: any) => {
                                                                                        return dd.checked
                                                                                    }).map((dd: any) => {
                                                                                        return dd.id
                                                                                    }).join(`,`)
                                                                                }).then((res) => {
                                                                                    dialog.dataLoading({visible: false})
                                                                                    if (res.result) {
                                                                                        vm.dataList = undefined
                                                                                        gvc.notifyDataChange(id)
                                                                                    } else {
                                                                                        dialog.errorMessage({text: "刪除失敗"})
                                                                                    }
                                                                                })
                                                                            }
                                                                        }
                                                                    })
                                                                })}">批量移除</button>`
                                                            ].join(``)
                                                        }

                                                    },
                                                    divCreate: () => {
                                                        return {
                                                            class: `d-flex align-items-center p-2 py-3 ${(!vm.dataList || !vm.dataList.find((dd: any) => {
                                                                return dd.checked
                                                            }) || type === 'select') ? `d-none` : ``}`,
                                                            style: `height:40px;gap:10px;margin-top:10px;`
                                                        }
                                                    }
                                                }
                                            })
                                    }
                                `
                            })}
                        `)
                    } else if (vm.type == 'replace') {
                        return this.userInformationDetail({
                            userID: vm.data.userID,
                            callback: () => {
                                vm.type = 'list'
                            },
                            gvc: gvc
                        })
                    } else {
                        return ``
                    }

                }
            }
        })
    }
}

(window as any).glitter.setModule(import.meta.url, UserList)