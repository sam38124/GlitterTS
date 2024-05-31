import {GVC} from "../glitterBundle/GVController.js";
import {ShareDialog} from "../dialog/ShareDialog.js";
import {BgWidget} from "../backend-manager/bg-widget.js";
import {EditorElem} from "../glitterBundle/plugins/editor-elem.js";
import {ApiWallet} from "../glitter-base/route/wallet.js";
import {UserList} from "./user-list.js";

export class ShoppingRebate {
    public static main(gvc: GVC) {
        const glitter = gvc.glitter;
        const html=String.raw;
        const vm: {
            type: "list" | "add" | "replace",
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

        return gvc.bindView(() => {
            const id = glitter.getUUID()
            const dialog = new ShareDialog(gvc.glitter)

            function refresh() {
                gvc.notifyDataChange(id)
            }

            return {
                bind: id,
                dataList: [{obj: vm, key: 'type'}],
                view: () => {
                    if (vm.type === 'list') {
                        return BgWidget.container(html`
                            <div class="d-flex w-100 align-items-center mb-3 ">
                                ${BgWidget.title('回饋金紀錄')}
                                <div class="flex-fill"></div>
                                <button class="btn hoverBtn me-2 px-3"
                                        style="height:35px !important;font-size: 14px;color:black;border:1px solid black;"
                                        onclick="${
                                                gvc.event(() => {
                                                    gvc.glitter.innerDialog((gvc2) => {
                                                        const vm = {
                                                            type: 'add',
                                                            value: '0',
                                                            note: ''
                                                        }
                                                        return `<div class="modal-content bg-white rounded-3 p-2" style="max-width:90%;width:400px;">
                                <div class="">
                                           ${gvc.bindView(() => {
                                                            const id = gvc.glitter.getUUID()
                                                            return {
                                                                bind: id,
                                                                view: () => {
                                                                    return [
                                                                        `<div style="height: 50px;" class="d-flex align-items-center  border-bottom">
<h3 class="m-0 fs-6">新增紀錄</h3>
</div>`,
                                                                        EditorElem.checkBox({
                                                                            title: "類型",
                                                                            gvc: gvc,
                                                                            def: vm.type,
                                                                            array: [
                                                                                {title: '新增', value: 'add'},
                                                                                {title: '減少', value: 'minus'}
                                                                            ],
                                                                            callback: (text) => {
                                                                                vm.type = text
                                                                                gvc.notifyDataChange(id)
                                                                            }
                                                                        }),
                                                                        EditorElem.editeInput({
                                                                            title: "數值",
                                                                            gvc: gvc,
                                                                            default: vm.value,
                                                                            placeHolder: '設定數值',
                                                                            callback: (text) => {
                                                                                vm.value = text
                                                                                gvc.notifyDataChange(id)
                                                                            }
                                                                        }),
                                                                        EditorElem.editeText({
                                                                            title: "備註",
                                                                            gvc: gvc,
                                                                            default: vm.note,
                                                                            placeHolder: '輸入備註',
                                                                            callback: (text) => {
                                                                                vm.note = text
                                                                                gvc.notifyDataChange(id)
                                                                            }
                                                                        })
                                                                    ].join(``)
                                                                },
                                                                divCreate: {
                                                                    class: `ps-1 pe-1`
                                                                }
                                                            }
                                                        })}
                                    <div class="modal-footer mb-0 pb-0 mt-2 pt-1">
                                        <button type="button" class="btn btn-outline-dark me-2" onclick="${gvc.event(() => {
                                                            gvc2.closeDialog()
                                                        })}">取消
                                        </button>
                                        <button type="button" class="btn btn-primary-c" onclick="${gvc.event(() => {
                                                            gvc.glitter.innerDialog((gvc) => {
                                                                let dataList: any = []
                                                                return `
                                                                <div>
                                                                ${BgWidget.container(
                                                                        BgWidget.card([
                                                                            html`
                                                                                <div class="d-flex w-100 align-items-center mb-3 ">
                                                                                    ${BgWidget.goBack(gvc.event(() => {
                                                                                        gvc.closeDialog()
                                                                                    }))}
                                                                                    ${BgWidget.title(`選擇變動對象`)}
                                                                                    <div class="flex-fill"></div>
                                                                                    <button class="btn btn-primary-c"
                                                                                            style="height:38px;font-size: 14px;"
                                                                                            onclick="${gvc.event(() => {
                                                                                                const dialog = new ShareDialog(gvc.glitter)
                                                                                                if (dataList.length > 0) {
                                                                                                    dialog.dataLoading({
                                                                                                        text: '發送中...',
                                                                                                        visible: true
                                                                                                    })
                                                                                                    ApiWallet.storeRebateByManager({
                                                                                                        userID: dataList.map((dd: any) => {
                                                                                                            return dd.userID
                                                                                                        }),
                                                                                                        total: (() => {
                                                                                                            if (vm.type === 'add') {
                                                                                                                return parseInt(vm.value, 10)
                                                                                                            } else {
                                                                                                                const minus = parseInt(vm.value, 10);
                                                                                                                return (minus) ? minus * -1 : minus
                                                                                                            }
                                                                                                        })(),
                                                                                                        note: {
                                                                                                            note: vm.note
                                                                                                        }
                                                                                                    }).then(() => {
                                                                                                        dialog.dataLoading({
                                                                                                            visible: false
                                                                                                        })
                                                                                                        dialog.successMessage({text: `設定成功!`})
                                                                                                        gvc.closeDialog()
                                                                                                        gvc2.closeDialog()
                                                                                                        refresh()
                                                                                                    })
                                                                                                } else {
                                                                                                    dialog.errorMessage({text: "請選擇變動對象!"})
                                                                                                }
                                                                                            })}">確認並發送
                                                                                    </button>
                                                                                </div>
                                                                            ` +
                                                                            `<div class="mx-n2">${UserList.userManager(gvc, 'select', (data) => {
                                                                                dataList = data
                                                                            })}<div>`
                                                                        ].join('')),
                                                                        900)}
                                                                <div>
                                                                `
                                                            }, 'email')
                                                        })}">下一步 => 選擇用戶
                                        </button>
                                    </div>
                                </div>
                            </div>`
                                                    }, 'add')
                                                })
                                        }">
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
                                        search: vm.query || undefined
                                    }).then((data) => {
                                        vmi.pageSize = Math.ceil(data.response.total / 20)
                                        vm.dataList = data.response.data

                                        function getDatalist() {
                                            return data.response.data.map((dd: any) => {
                                                return [
                                                    {
                                                        key: EditorElem.checkBoxOnly({
                                                            gvc: gvc,
                                                            def: (!data.response.data.find((dd: any) => {
                                                                return !dd.checked
                                                            })),
                                                            callback: (result) => {
                                                                data.response.data.map((dd: any) => {
                                                                    dd.checked = result
                                                                })
                                                                vmi.data = getDatalist()
                                                                vmi.callback()
                                                                gvc.notifyDataChange(filterID)
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
                                                            },
                                                            style: "height:25px;"
                                                        })
                                                    },
                                                    {
                                                        key: '用戶名稱',
                                                        value: `<span class="fs-7">${(dd.userData && dd.userData.name) ?? "資料異常"}</span>`
                                                    },
                                                    {
                                                        key: '訂單編號',
                                                        value: `<span class="fs-7">${(dd.status === 2) ? `手動新增` : dd.orderID}</span>`
                                                    },
                                                    {
                                                        key: '異動金額',
                                                        value: `${(dd.money > 0) ? `<span class="fs-7 text-success">+ ${dd.money}</span>`
                                                                :
                                                                `<span class="fs-7 text-danger">- ${dd.money * -1}</span>`}`
                                                    },
                                                    {
                                                        key: '備註',
                                                        value: `<span class="fs-7">${(typeof dd.note === 'string') ? dd.note : (dd.note && dd.note.note) ?? "尚未填寫備註"}</span>`
                                                    },
                                                    {
                                                        key: '異動時間',
                                                        value: `<span class="fs-7">${glitter.ut.dateFormat(new Date(dd.created_time), 'yyyy-MM-dd hh:mm')}</span>`
                                                    }
                                                ]
                                            })
                                        }

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
                                    }),vm.query || '','搜尋所有用戶')}
                                    ${
                                            gvc.bindView(() => {
                                                return {
                                                    bind: filterID,
                                                    view: () => {
                                                        if (!vm.dataList || !vm.dataList.find((dd: any) => {
                                                            return dd.checked
                                                        })) {
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
                                                                                ApiWallet.deleteRebate({
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
                                                            class: `d-flex align-items-center mt-2 p-2 py-3 ${(!vm.dataList || !vm.dataList.find((dd: any) => {
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
                        return UserList.userInformationDetail({
                            userID: vm.data.userID,
                            callback: () => {
                                vm.type = 'list'
                                gvc.notifyDataChange(id)
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

(window as any).glitter.setModule(import.meta.url, ShoppingRebate)