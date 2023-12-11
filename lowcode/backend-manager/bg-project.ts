import {GVC} from "../glitterBundle/GVController.js";
import {EditorElem} from "../glitterBundle/plugins/editor-elem.js";
import {ShareDialog} from "../dialog/ShareDialog.js";
import {BgShopping} from "./bg-shopping.js";
import {PageEditor} from "../editor/page-editor.js";
import {BgWidget} from "./bg-widget.js";
import {ApiShop} from "../glitter-base/route/shopping.js";
import {ApiUser} from "../glitter-base/route/user.js";
import {ApiPost} from "../glitter-base/route/post.js";
import {GlobalUser} from "../glitter-base/global/global-user.js";
import {ApiApp} from "../glitter-base/route/app.js";


const html = String.raw

export class BgProject {
    public static setLoginConfig(gvc: GVC) {
        const saasConfig: {
            config: any,
            api: any
        } = (window as any).saasConfig
        const html = String.raw
        const dialog = new ShareDialog(gvc.glitter)
        let keyData: {
            verify: 'normal' | 'mail' | 'phone',
            verify_forget: 'mail'
            name: string,
            content: string
            title: string,
            forget_title: string,
            forget_content: string,
            forget_page: string
        } = {
            verify: 'normal',
            name: '',
            content: '',
            title: '',
            verify_forget: 'mail',
            forget_title: '',
            forget_content: '',
            forget_page: ''
        }

        function save(next: () => void) {
            const dialog = new ShareDialog(gvc.glitter)
            dialog.dataLoading({text: '設定中', visible: true})
            saasConfig.api.setPrivateConfig(saasConfig.config.appName, `glitter_loginConfig`, keyData).then((r: { response: any, result: boolean }) => {
                dialog.dataLoading({visible: false})
                if (r.response) {
                    next()
                } else {
                    dialog.errorMessage({text: "設定失敗"})
                }
            })
        }

        return BgShopping.container(html`
            <div class="d-flex w-100 align-items-center mb-3 ">
                ${BgShopping.title(`登入設定`)}
                <div class="flex-fill"></div>
                <button class="btn btn-primary-c" style="height:38px;font-size: 14px;" onclick="${gvc.event(() => {
                    save(() => {
                        dialog.successMessage({
                            text: '設定成功'
                        })
                    })
                })}">儲存並更改
                </button>
            </div>
            ${gvc.bindView(() => {
                const id = gvc.glitter.getUUID()
                saasConfig.api.getPrivateConfig(saasConfig.config.appName, `glitter_loginConfig`).then((data: any) => {
                    if (data.response.result[0]) {
                        keyData = data.response.result[0].value
                        keyData.verify_forget = keyData.verify_forget ?? 'mail'
                        gvc.notifyDataChange(id)
                    }
                })

                return {
                    bind: id,
                    view: () => {
                        return new Promise(async (resolve, reject) => {
                            resolve(html`
                                <div style="width:900px;max-width:100%;"> ${BgShopping.card([
                                    EditorElem.select({
                                        title: '登入認證',
                                        gvc: gvc,
                                        def: keyData.verify,
                                        array: [
                                            {title: '無需認證', value: "normal"},
                                            {title: '信箱認證', value: "mail"}
                                        ],
                                        callback: (text: any) => {
                                            keyData.verify = text
                                            gvc.notifyDataChange(id)
                                        }
                                    }),
                                    (() => {
                                        if (keyData.verify === 'mail') {
                                            keyData.content = keyData.content ?? ''
                                            keyData.title = keyData.title ?? '嗨！歡迎加入 GLITTER.AI，請輸入驗證碼。'
                                            if (keyData.content.indexOf('@{{code}}') === -1) {
                                                keyData.content = `嗨！歡迎加入 GLITTER.AI，請輸入驗證碼「 @{{code}} 」。請於1分鐘內輸入並完成驗證。`
                                            }
                                            return [
                                                EditorElem.editeInput({
                                                    gvc: gvc,
                                                    title: '寄件者名稱',
                                                    default: keyData.name,
                                                    callback: (text) => {
                                                        keyData.name = text
                                                        gvc.notifyDataChange(id)
                                                    },
                                                    placeHolder: '請輸入寄件者名稱'
                                                }),
                                                EditorElem.editeInput({
                                                    gvc: gvc,
                                                    title: '信件標題',
                                                    default: keyData.title,
                                                    callback: (text) => {
                                                        keyData.title = text
                                                        gvc.notifyDataChange(id)
                                                    },
                                                    placeHolder: '請輸入信件標題'
                                                }),
                                                EditorElem.h3('信件內容'),
                                                EditorElem.richText({
                                                    gvc: gvc,
                                                    def: keyData.content,
                                                    callback: (text) => {
                                                        keyData.content = text
                                                    }
                                                })
                                            ].join('')
                                        } else {
                                            return ``
                                        }
                                    })()
                                ].join('<div class="my-2"></div>'))}
                                    <div class="my-4">${BgShopping.title(`忘記密碼設定`)}</div>
                                    ${BgShopping.card([
                                        EditorElem.select({
                                            title: '忘記密碼',
                                            gvc: gvc,
                                            def: keyData.verify_forget,
                                            array: [
                                                {title: '信箱認證', value: "mail"},
                                            ],
                                            callback: (text: any) => {
                                                keyData.verify_forget = text
                                                gvc.notifyDataChange(id)
                                            }
                                        }),
                                        (() => {
                                            keyData.forget_title = keyData.forget_title || "忘記密碼"
                                            keyData.forget_content = keyData.forget_content || ''
                                            if (keyData.forget_content.indexOf('@{{code}}') === -1) {
                                                keyData.forget_content = html`
                                                    <div style="margin:0">
                                                        <table style="height:100%!important;width:100%!important;border-spacing:0;border-collapse:collapse">
                                                            <tbody>
                                                            <tr>
                                                                <td style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif">
                                                                    <table class="m_-7325585852261570963header"
                                                                           style="width:100%;border-spacing:0;border-collapse:collapse;margin:40px 0 20px">
                                                                        <tbody>
                                                                        <tr>
                                                                            <td style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif">
                                                                                <center>

                                                                                    <table class="m_-7325585852261570963container"
                                                                                           style="width:560px;text-align:left;border-spacing:0;border-collapse:collapse;margin:0 auto">
                                                                                        <tbody>
                                                                                        <tr>
                                                                                            <td style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif">

                                                                                                <table style="width:100%;border-spacing:0;border-collapse:collapse">
                                                                                                    <tbody>
                                                                                                    <tr>
                                                                                                        <td class="m_-7325585852261570963shop-name__cell"
                                                                                                            style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif">
                                                                                                            <h1 style="font-weight:normal;font-size:30px;color:#333;margin:0">
                                                                                                                <a href="">GLITTER.AI</a>
                                                                                                            </h1>
                                                                                                        </td>

                                                                                                    </tr>
                                                                                                    </tbody>
                                                                                                </table>

                                                                                            </td>
                                                                                        </tr>
                                                                                        </tbody>
                                                                                    </table>

                                                                                </center>
                                                                            </td>
                                                                        </tr>
                                                                        </tbody>
                                                                    </table>

                                                                    <table style="width:100%;border-spacing:0;border-collapse:collapse">
                                                                        <tbody>
                                                                        <tr>
                                                                            <td style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif;padding-bottom:40px;border-width:0">
                                                                                <center>
                                                                                    <table class="m_-7325585852261570963container"
                                                                                           style="width:560px;text-align:left;border-spacing:0;border-collapse:collapse;margin:0 auto">
                                                                                        <tbody>
                                                                                        <tr>
                                                                                            <td style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif">

                                                                                                <h2 style="font-weight:normal;font-size:24px;margin:0 0 10px">
                                                                                                    重設密碼</h2>
                                                                                                <p style="color:#777;line-height:150%;font-size:16px;margin:0">
                                                                                                    利用此連結前往 <a
                                                                                                >GLITTER.AI</a>
                                                                                                    重設你的顧客帳號密碼。如果你沒有申請新密碼，
                                                                                                    <wbr>
                                                                                                    可以安心刪除這封電子郵件。
                                                                                                </p>
                                                                                                <table style="width:100%;border-spacing:0;border-collapse:collapse;margin-top:20px">
                                                                                                    <tbody>
                                                                                                    <tr>
                                                                                                        <td style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif;line-height:0em">
                                                                                                            &nbsp;
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                    <tr>
                                                                                                        <td style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif">
                                                                                                            <table class="m_-7325585852261570963button m_-7325585852261570963main-action-cell"
                                                                                                                   style="border-spacing:0;border-collapse:collapse;float:left;margin-right:15px">
                                                                                                                <tbody>
                                                                                                                <tr>
                                                                                                                    <td style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif;border-radius:4px"
                                                                                                                        align="center"
                                                                                                                        bgcolor="black">
                                                                                                                        <a href="@{{code}}"
                                                                                                                           class="m_-7325585852261570963button__text"
                                                                                                                           style="font-size:16px;text-decoration:none;display:block;color:#fff;padding:20px 25px">重設密碼</a>
                                                                                                                    </td>
                                                                                                                </tr>
                                                                                                                </tbody>
                                                                                                            </table>


                                                                                                        </td>
                                                                                                    </tr>
                                                                                                    </tbody>
                                                                                                </table>


                                                                                            </td>
                                                                                        </tr>
                                                                                        </tbody>
                                                                                    </table>
                                                                                </center>
                                                                            </td>
                                                                        </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                        <div class="yj6qo"></div>
                                                        <div class="adL">
                                                        </div>
                                                    </div>`
                                            }
                                            return [
                                                EditorElem.editeInput({
                                                    gvc: gvc,
                                                    title: '信件標題',
                                                    default: keyData.forget_title,
                                                    callback: (text) => {
                                                        keyData.forget_title = text
                                                        gvc.notifyDataChange(id)
                                                    },
                                                    placeHolder: '請輸入信件標題'
                                                }),
                                                EditorElem.pageSelect(gvc, '重設密碼頁面', keyData.forget_page, (data) => {
                                                    keyData.forget_page = data
                                                }),
                                                EditorElem.h3('信件內容'),
                                                EditorElem.richText({
                                                    gvc: gvc,
                                                    def: keyData.forget_content,
                                                    callback: (text) => {
                                                        keyData.forget_content = text
                                                    }
                                                })
                                            ].join('')
                                        })()
                                    ].join('<div class="my-2"></div>'))}
                                </div>`)
                        })
                    },
                    divCreate: {class: `d-flex flex-column flex-column-reverse  flex-md-row`, style: `gap:10px;`}
                }
            })}
        `, 900)
    }

    public static setGlobalValue(gvc: GVC) {
        gvc.glitter.share.editorViewModel.selectItem = undefined
        return gvc.bindView(() => {
            const id = gvc.glitter.getUUID()
            return {
                bind: id,
                view: () => {
                    return new Promise(async (resolve, reject) => {
                        PageEditor.valueRender(gvc).then((response) => {
                            resolve(BgShopping.container([html`
                                <div class="d-flex w-100 align-items-center mb-3 ">
                                    ${BgShopping.title(`共用資源`)}
                                    <div class="flex-fill"></div>
                                    <button class="btn btn-primary-c" style="height:38px;font-size: 14px;"
                                            onclick="${gvc.event(() => {
                                                gvc.glitter.htmlGenerate.saveEvent(false)
                                            })}">儲存並更改
                                    </button>
                                </div>
                            `,
                                BgShopping.card(html`
                                    <div class="d-flex">
                                        <div class="border-end " style="width:350px;overflow:hidden;">${response.left}
                                        </div>
                                        <div class="flex-fill " style="width:400px;">${response.right}</div>
                                    </div>`, 'p-0 bg-white rounded border'),
                            ].join(''), 700))
                        })

                    })
                }
            }
        })

    }

    public static userManager(gvc: GVC) {
        const glitter = gvc.glitter
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
            return {
                bind: id,
                dataList: [{obj: vm, key: 'type'}],
                view: () => {
                    if (vm.type === 'list') {
                        return BgShopping.container(html`
                            <div class="d-flex w-100 align-items-center mb-3 ">
                                ${BgShopping.title('用戶管理')}
                                <div class="flex-fill"></div>
                            </div>
                            ${BgWidget.table({
                                gvc: gvc,
                                getData: (vmi) => {
                                    ApiUser.getUserList({
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
                                    <div style="height:50px;" class="w-100 border-bottom">
                                        <input class="form-control h-100 " style="border: none;"
                                               placeholder="搜尋所有用戶" onchange="${gvc.event((e, event) => {
                                            vm.query = e.value
                                            gvc.notifyDataChange(id)
                                        })}" value="${vm.query || ''}">
                                    </div>
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
                                                            })) ? `d-none` : ``}`,
                                                            style: `height:40px;gap:10px;`
                                                        }
                                                    }
                                                }
                                            })
                                    }
                                `
                            })}
                        `)
                    } else if (vm.type == 'replace') {
                        console.log(JSON.stringify(vm.data))
                        return BgShopping.container([
                            `<div class="d-flex w-100 align-items-center mb-3 ">
                ${BgShopping.goBack(gvc.event(() => {
                                vm.type = 'list'
                            }))} ${BgShopping.title(vm.data.userData.name)}
                <div class="flex-fill"></div>
                <button class="btn btn-primary-c" style="height:38px;font-size: 14px;"
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
                            BgShopping.card([
                                ...(() => {
                                    let map: any = [];
                                    (vm.data.userData.name) && map.push(`
                                    <div class="fw-bold fs-7">用戶名稱</div>
                                    <div class="fw-normal fs-7">${vm.data.userData.name}</div>`);
                                    (vm.data.userID) && map.push(`
                                    <div class="fw-bold fs-7">用戶ID</div>
                                    <div class="fw-normal fs-7">${vm.data.userID}</div>`);
                                    (vm.data.userData.email) && map.push(`
                                    <div class="fw-bold fs-7">用戶信箱</div>
                                    <div class="fw-normal fs-7">${vm.data.userData.email}</div>`);
                                    (vm.data.userData.phone) && map.push(`
                                    <div class="fw-bold fs-7">用戶電話</div>
                                    <div class="fw-normal fs-7">${vm.data.userData.phone}</div>`);
                                    (vm.data.userData.address) && map.push(`
                                    <div class="fw-bold fs-7">用戶地址</div>
                                    <div class="fw-normal fs-7">${vm.data.userData.address}</div>`);
                                    (vm.data.created_time) && map.push(`
                                    <div class="fw-bold fs-7">建立時間</div>
                                    <div class="fw-normal fs-7">${glitter.ut.dateFormat(new Date(vm.data.created_time), 'yyyy-MM-dd hh:mm')}</div>`);
                                    return map
                                })()
                            ].join(`<div class="my-2 bgf6 w-100" style="height:1px;"></div>`)),
                            BgShopping.card([
                                gvc.bindView(() => {
                                    const id = glitter.getUUID()
                                    const vmi: {
                                        mode: 'edit' | 'read'
                                    } = {
                                        mode: 'read'
                                    }
                                    return {
                                        bind: id,
                                        view: () => {
                                            return html`
                                                <div class="d-flex align-items-center ">
                                                    <div class="fw-bold fs-7">備註</div>
                                                    <div class="flex-fill"></div>
                                                    <i class="fa-solid fa-pencil" style="cursor:pointer;" onclick="${
                                                            gvc.event(() => {
                                                                vmi.mode = (vmi.mode === 'edit') ? 'read' : 'edit'
                                                                gvc.notifyDataChange(id)
                                                            })
                                                    }"></i>
                                                </div>
                                                ${(vmi.mode == 'read') ? `
                                                 <div class="fs-7 w-100 mt-2  lh-lg fw-normal"
                                                     style="word-break: break-all;white-space:normal;">
                                                    ${(vm.data.userData.managerNote ?? "尚未填寫").replace(/\n/g, `<br>`)}
                                                </div>
                                                ` : EditorElem.editeText({
                                                    gvc: gvc,
                                                    title: '',
                                                    default: vm.data.userData.managerNote ?? "",
                                                    placeHolder: '',
                                                    callback: (text) => {
                                                        vm.data.userData.managerNote = text
                                                    }
                                                })}
                                            `
                                        },
                                        divCreate: {
                                            class: `fw-normal`,
                                        }
                                    }
                                })
                            ].join(`<div class="my-2 bgf6 w-100" style="height:1px;"></div>`))
                        ].join('<div class="my-2"></div>'), 700)
                    } else {
                        return ``
                    }

                }
            }
        })
    }


    public static appRelease(gvc: GVC, type: string) {

        const glitter = gvc.glitter
        const vm: {
            status: 'list' | 'add' | 'replace',
            dataList: any,
            query: string
        } = {
            status: "list",
            dataList: undefined,
            query: ''
        }
        let replaceData: any = ''
        return gvc.bindView(() => {
            const id = glitter.getUUID()
            return {
                dataList: [{
                    obj: vm, key: 'status'
                }],
                bind: id,
                view: () => {
                    switch (vm.status) {
                        case "add":
                            return BgProject.appReleaseForm(vm, gvc, type)
                        case "list":
                            const filterID = gvc.glitter.getUUID();
                            return BgShopping.container(html`
                                <div class="d-flex w-100 align-items-center mb-3">
                                    ${BgShopping.title((type==='android_release') ? 'Google Play應用商城':'APPLE應用商城')}
                                    <div class="flex-fill"></div>
                                    <button class="btn btn-primary-c" style="height:45px;font-size: 14px;"
                                            onclick="${gvc.event(() => {
                                                vm.status = 'add'
                                            })}">新增送審項目
                                    </button>
                                </div>
                                ${BgWidget.table({
                                    gvc: gvc,
                                    getData: (vmi) => {
                                        ApiApp.getAppRelease({
                                            page: vmi.page - 1, limit: 50,
                                            search: vm.query || undefined,
                                            type: type
                                        }).then((data) => {
                                            vmi.pageSize = Math.ceil(data.response.total / 50)
                                            vm.dataList = data.response.data;

                                            function getDatalist() {
                                                return data.response.data.map((dd: {
                                                    content: {
                                                        logo: string,
                                                        image: {
                                                            '6.7': string[],
                                                            '6.5': string[],
                                                            '5.5': string[]
                                                        },
                                                        type: 'apple_release',
                                                        market_info: {
                                                            promote_string: string,
                                                            description: string,
                                                            keywords: string,
                                                            support_url: string,
                                                            version: string,
                                                            copy_right: string,
                                                            market_url: string,
                                                            title: string,
                                                            sub_title: string,
                                                            privacy: string
                                                        },
                                                        name: string,
                                                        bundle_id: string,
                                                        status: 'wait' | 'finish' | 'manual' | 'error'
                                                    },
                                                    checked: boolean
                                                }) => {
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
                                                                style: "height:40px;"
                                                            })
                                                        },
                                                        {
                                                            key: 'APP',
                                                            value: `<img class="rounded border me-4" alt="" src="${dd.content.logo}" style="width:40px;height:40px;">` + dd.content.name
                                                        },
                                                        {
                                                            key: '審核狀態',
                                                            value: (() => {
                                                                switch (dd.content.status) {
                                                                    case "finish":
                                                                        return `<div class="badge badge-success fs-7" >審核通過</div>`;
                                                                    case "error":
                                                                        return `<div class="badge bg-danger fs-7" >審核失敗</div>`;
                                                                    case "wait":
                                                                        return `<div class="badge bg-warning fs-7" style="color:black;">等待審核</div>`
                                                                    default:
                                                                        return `<div class="badge bg-secondary fs-7" >手動送審</div>`

                                                                }
                                                            })()
                                                        },
                                                        {
                                                            key: '專案包',
                                                            value: `<i class="fa-solid fa-download fs-6 ms-3" onclick="${gvc.event((e, event) => {
                                                                const dialog = new ShareDialog(gvc.glitter)
                                                                dialog.dataLoading({visible: true});
                                                                (((type==='android_release') ? ApiApp.downloadAndroidRelease:ApiApp.downloadIOSRelease) as any)({
                                                                    "app_name": dd.content.name,
                                                                    "bundle_id": dd.content.bundle_id
                                                                }).then((dd:any) => {
                                                                    dialog.dataLoading({visible: false})
                                                                    if (dd.result) {
                                                                        dialog.successMessage({
                                                                            text: "下載成功，請前往資料夾查看。"
                                                                        })
                                                                        glitter.openNewTab(dd.response.url)
                                                                    } else {
                                                                        alert('下載失敗!')
                                                                    }
                                                                })
                                                                event.stopPropagation()
                                                            })}"></i>`
                                                        }
                                                    ].map((dd) => {
                                                        dd.value = `<div style="line-height:40px;">${dd.value}</div>`
                                                        return dd
                                                    })
                                                })
                                            }

                                            vmi.data = getDatalist()
                                            vmi.loading = false
                                            vmi.callback()
                                        })
                                    },
                                    rowClick: (data, index) => {
                                        replaceData = vm.dataList[index].content
                                        vm.status = 'replace'
                                    },
                                    filter: html`
                                        <div style="height:50px;" class="w-100 border-bottom">
                                            <input class="form-control h-100 " style="border: none;"
                                                   placeholder="搜尋所有紀錄" onchange="${gvc.event((e, event) => {
                                                vm.query = e.value
                                                gvc.notifyDataChange(id)
                                            })}" value="${vm.query}">
                                        </div>
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
                                                                                    ApiShop.delete({
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
                                                                })) ? `d-none` : ``}`,
                                                                style: `height:40px;gap:10px;`
                                                            }
                                                        }
                                                    }
                                                })
                                        }
                                    `
                                })}
                            `)
                        case "replace":
                            return BgProject.appReleaseForm(vm, gvc, type, replaceData)
                    }

                },
                divCreate: {
                    class: `w-100 h-100`
                }
            }
        })
    }


    public static appReleaseForm(vm: {
        status: 'list' | 'add' | 'replace',
        dataList: any,
        query: string
    }, gvc: GVC, type: string, editorData?: any) {
        const saasConfig: {
            config: any,
            api: any
        } = (window as any).saasConfig
        const html = String.raw
        const dialog = new ShareDialog(gvc.glitter)
        const postMD: {
            logo: string,
            image: {
                '6.7': string[],
                '6.5': string[],
                '5.5': string[],
                'android': string[]
            },
            type: 'apple_release' | 'android_release',
            market_info: {
                promote_string: string,
                description: string,
                keywords: string,
                support_url: string,
                version: string,
                copy_right: string,
                market_url: string,
                title: string,
                sub_title: string,
                privacy: string
            },
            name: string,
            bundle_id: string,
            status: 'wait' | 'finish' | 'manual' | 'error'
        } = editorData || {
            logo: '',
            image: {
                '6.7': [],
                '6.5': [],
                '5.5': [],
                'android': []
            },
            name: '',
            type: type,
            market_info: {
                title: '',
                sub_title: '',
                keywords: '',
                support_url: '',
                version: '',
                copy_right: '',
                market_url: '',
                privacy: '',
                promote_string: '',
                description: '',

            },
            bundle_id: '',
            status: 'manual'
        }

        function save() {
            if ((!(postMD.name && postMD.logo && postMD.bundle_id)) ||
                !((postMD.image["6.7"].length >= 3 && postMD.image["6.5"].length >= 3 && postMD.image["5.5"].length >= 3) || postMD.type === 'android_release') ||
                !((postMD.image.android.length >= 3) || postMD.type === 'apple_release') ||
                (Object.keys(postMD.market_info).find((dd) => {
                    return (!postMD.market_info as any)[dd];
                }))
            ) {
                alert('請確實填寫所有內容!')
                return
            }
            const dialog = new ShareDialog(gvc.glitter)
            dialog.dataLoading({text: '提交審核中...', visible: true});
            ((editorData) ? ApiPost.put : ApiPost.post)({
                postData: postMD,
                token: GlobalUser.token,
                type: 'manager'
            }).then((re: any) => {
                dialog.dataLoading({visible: false})
                if (re.result) {
                    vm.status = 'list'
                    dialog.successMessage({text: `上傳成功...`})
                } else {
                    dialog.errorMessage({text: `上傳失敗...`})
                }
            })
        }

        return BgShopping.container(html`
            <div class="d-flex w-100 align-items-center mb-3 ">
                ${BgShopping.goBack(gvc.event(() => {
                    vm.status = 'list'
                }))}
                ${BgShopping.title(`審核項目`)}
                ${
                        (() => {
                            return (() => {
                                switch (postMD.status) {
                                    case "finish":
                                        return `<div class="badge badge-success fs-7 ms-2" >審核通過</div>`;
                                    case "error":
                                        return `<div class="badge bg-danger fs-7 ms-2" >審核失敗</div>`;
                                    case "wait":
                                        return `<div class="badge bg-warning fs-7 ms-2" style="color:black;">等待審核</div>`
                                    default:
                                        return `<div class="badge bg-secondary fs-7 ms-2" >手動送審</div>`

                                }
                            })()
                        })()
                }
                <div class="flex-fill"></div>
                <button class="btn btn-primary-c" style="height:38px;font-size: 14px;" onclick="${gvc.event(() => {
                    save()
                })}">${(editorData) ? `再次送審` : `確認送審`}
                </button>
            </div>
            ${gvc.bindView(() => {
                const id = gvc.glitter.getUUID()
                return {
                    bind: id,
                    view: () => {
                        return new Promise(async (resolve, reject) => {
                            resolve(html`
                                <div style="width:900px;max-width:100%;">
                                    ${[
                                        BgShopping.card(html`
                                            <div class="alert alert-info p-2 m-1" style="white-space: normal;">
                                                <strong>請注意!!</strong><br>
                                                審核通過的結果可能會因應用程式的完整性、商店條款、隱私權政策、以及符合蘋果公司的政策等方面而有所不同，建議送審時需再三進行確認。
                                                審核時間會落在7-14個工作天左右。
                                            </div>`),
                                        BgShopping.card([
                                            html`
                                                ${BgShopping.title('APP資訊')}
                                                <div class="row">
                                                    ${[
                                                        EditorElem.editeInput({
                                                            title: 'APP名稱',
                                                            gvc: gvc,
                                                            default: postMD.name,
                                                            callback: (text) => {
                                                                postMD.name = text
                                                            },
                                                            placeHolder: '請輸入APP名稱'
                                                        }),
                                                        EditorElem.editeInput({
                                                            title: `套件識別碼(${(type === 'apple_release') ? `Bundle ID` : `Application Id`})`,
                                                            gvc: gvc,
                                                            default: postMD.bundle_id,
                                                            callback: (text) => {
                                                                postMD.bundle_id = text
                                                            },
                                                            placeHolder: '請輸入套件識別碼'
                                                        }),
                                                        EditorElem.uploadImage({
                                                            title: 'LOGO',
                                                            gvc: gvc,
                                                            def: postMD.logo,
                                                            callback: (text) => {
                                                                postMD.logo = text
                                                            }
                                                        }),
                                                        (() => {
                                                            switch (postMD.status) {
                                                                case "finish":
                                                                case "error":
                                                                    return ``
                                                                case "wait":
                                                                case "manual":
                                                                    return EditorElem.select({
                                                                        title: '審核方式',
                                                                        gvc: gvc,
                                                                        def: postMD.status,
                                                                        array: [
                                                                            {
                                                                                title: "自行送審(僅下載專案包)",
                                                                                value: "manual"
                                                                            },
                                                                            {
                                                                                title: "官方送審(透過GLITTER官方代為審核)",
                                                                                value: "wait"
                                                                            }
                                                                        ],
                                                                        callback: (text) => {
                                                                            (postMD.status as any) = text;

                                                                        }
                                                                    })
                                                            }
                                                        })()
                                                    ].map((dd) => {
                                                        return `<div class="col-6">${dd}</div>`
                                                    }).join('')}
                                                </div>
                                                <div class="mx-n3 mt-3">
                                                    ${((postMD.type === 'apple_release') ? ['6.7', '6.5', '5.5'] : ['android']).map((value, index: number) => {
                                                        const key: '6.7' | '6.5' | '5.5' | 'android' = value as any;
                                                        return EditorElem.arrayItem({
                                                            gvc: gvc,
                                                            title: (key==='android') ? `上傳應用程式截圖 *至少三張*`:`上傳${key}寸截圖 (${
                                                                    (() => {
                                                                        switch (key) {
                                                                            case "5.5":
                                                                                return '1242 x 2208'
                                                                            case "6.5":
                                                                                return '1284 x 2778'
                                                                            case "6.7":
                                                                                return '1290 x 2796'
                                                                        }
                                                                        {
                                                                        }
                                                                    })()
                                                            }) *至少三張*`,
                                                            array: () => {
                                                                return postMD.image[key].map((dd) => {
                                                                    return {
                                                                        title: dd,
                                                                        innerHtml: (gvc) => {
                                                                            gvc.glitter.openDiaLog(new URL('../dialog/image-preview.js', import.meta.url).href, 'preview', dd)
                                                                            return ``
                                                                        },

                                                                    }
                                                                })
                                                            },
                                                            customEditor: true,
                                                            originalArray: postMD.image[key],
                                                            expand: {},
                                                            refreshComponent: () => {
                                                                gvc.notifyDataChange(id)
                                                            },
                                                            plus: {
                                                                title: "新增截圖",
                                                                event: gvc.event(() => {
                                                                    EditorElem.fileUploadEvent('image/*', (url) => {
                                                                        postMD.image[key].push(url)
                                                                        gvc.notifyDataChange(id)
                                                                    })
                                                                })
                                                            },
                                                            copyable: false
                                                        })
                                                    }).join('')}
                                                </div>`
                                        ].join('<div class="my-2"></div>')),
                                        BgShopping.card([
                                            html`
                                                <div class="border-bottom pb-2">
                                                    ${BgShopping.title('商店資訊')}
                                                </div>
                                            `,
                                            `<div class="row">${
                                                    (() => {
                                                        return ["title",
                                                            "sub_title",
                                                            "keywords",
                                                            "support_url",
                                                            "version",
                                                            "copy_right",
                                                            "market_url",
                                                            "privacy",
                                                            "promote_string",
                                                            "description"].map((dd) => {
                                                            const key: 'promote_string' | 'privacy' | 'description' | 'keywords' | 'support_url' | 'version' | 'copy_right' | 'market_url' | 'title' | 'sub_title' = dd as any;
                                                            const title = (() => {
                                                                switch (key) {
                                                                    case "copy_right":
                                                                        return '版權'
                                                                    case "description":
                                                                        return '描述'
                                                                    case "keywords":
                                                                        return '關鍵字'
                                                                    case "market_url":
                                                                        return '行銷 URL'
                                                                    case "promote_string":
                                                                        return '行銷宣傳文字'
                                                                    case "support_url":
                                                                        return '支援 URL'
                                                                    case "version":
                                                                        return '版本'
                                                                    case "privacy":
                                                                        return "隱私權政策網址"
                                                                    case "sub_title":
                                                                        return '副標題'
                                                                    case 'title':
                                                                        return '商店名稱'

                                                                }
                                                            })()
                                                            if (['promote_string', 'description'].indexOf(dd) !== -1) {
                                                                return `<div class="col-12">${EditorElem.editeText({
                                                                    gvc: gvc,
                                                                    title: title,
                                                                    placeHolder: `請輸入${title}`,
                                                                    default: postMD.market_info[key],
                                                                    callback: (text) => {
                                                                        postMD.market_info[key] = text
                                                                    }
                                                                })}</div>`
                                                            }
                                                            return `<div class="col-6">${EditorElem.editeInput({
                                                                gvc: gvc,
                                                                title: title,
                                                                placeHolder: `請輸入${title}`,
                                                                default: postMD.market_info[key],
                                                                callback: (text) => {
                                                                    postMD.market_info[key] = text
                                                                }
                                                            })}</div>`
                                                        }).join('')
                                                    })()
                                            }</div>`
                                        ].join('<div class="my-2"></div>'))
                                    ].join(`<div class="my-3"></div>`)}
                                </div>`)
                        })
                    },
                    divCreate: {class: `d-flex flex-column flex-column-reverse  flex-md-row`, style: `gap:10px;`}
                }
            })}
        `, 900)
    }


}