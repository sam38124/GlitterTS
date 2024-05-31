import {GVC} from "../glitterBundle/GVController.js";
import {EditorElem} from "../glitterBundle/plugins/editor-elem.js";
import {ShareDialog} from "../dialog/ShareDialog.js";
import {ApiPost} from "../glitter-base/route/post.js";
import {ApiShop} from "../glitter-base/route/shopping.js";
import {BgWidget} from "./bg-widget.js";
import {GlobalUser} from "../glitter-base/global/global-user.js";
import {TriggerEvent} from "../glitterBundle/plugins/trigger-event.js";
import {BgProject} from "./bg-project.js";

const html = String.raw

export class BgShopping {
    public static orderManager(gvc: GVC) {
        const filterID = gvc.glitter.getUUID()
        const glitter = gvc.glitter
        const vm: {
            type: "list" | "add" | "replace",
            data: any,
            dataList: any,
            query?: string
        } = {
            type: "list",
            data: undefined,
            dataList: undefined,
            query: undefined
        }
        return gvc.bindView(() => {
            const id = glitter.getUUID()
            return {
                bind: id,
                dataList: [{obj: vm, key: 'type'}],
                view: () => {
                    if (vm.type === 'list') {
                        return BgWidget.container(html`
                            <div class="d-flex w-100 align-items-center mb-3 ">
                                ${BgWidget.title('訂單管理')}
                                <div class="flex-fill"></div>
                                <button class="btn btn-primary-c d-none" style="height:45px;font-size: 14px;"
                                        onclick="${gvc.event(() => {
                                            vm.type = "add"
                                        })}">新增訂單
                                </button>
                            </div>
                            ${BgWidget.table({
                                gvc: gvc,
                                getData: (vmi) => {
                                    ApiShop.getOrder({
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
                                                            style: "height:40px;"
                                                        })
                                                    },
                                                    {
                                                        key: '訂單',
                                                        value: dd.cart_token
                                                    },
                                                    {
                                                        key: '日期',
                                                        value: glitter.ut.dateFormat(new Date(dd.created_time), 'yyyy-MM-dd hh:mm:ss')
                                                    },
                                                    {
                                                        key: '顧客名稱',
                                                        value: dd.orderData.user_info.name
                                                    },
                                                    {
                                                        key: '信箱',
                                                        value: dd.email || "未知"
                                                    },
                                                    {
                                                        key: '總計',
                                                        value: dd.orderData.total
                                                    },
                                                    {
                                                        key: '付款狀態',
                                                        value: (() => {
                                                            switch (dd.status) {
                                                                case 0:
                                                                    return `<div class="badge  fs-7 " style="color:black;background:#ffd6a4;">付款待處理</div>`
                                                                case 1:
                                                                    return `<div class="badge fs-7" style="background:#0000000f;color:black;">已付款</div>`
                                                                case -1:
                                                                    return `<div class="badge bg-danger fs-7" style="">付款失敗</div>`
                                                                case -2:
                                                                    return `<div class="badge bg-danger fs-7" style="">已退款</div>`
                                                            }
                                                        })()
                                                    },
                                                    {
                                                        key: '出貨狀態',
                                                        value: (() => {
                                                            switch (dd.orderData.progress ?? 'wait') {
                                                                case 'wait':
                                                                    return `<div class="badge bg-warning fs-7 " style="color:black;">尚未出貨</div>`
                                                                case 'shipping':
                                                                    return `<div class="badge bg-info fs-7" style="max-height:34px;">配送中</div>`
                                                                case 'finish':
                                                                    return `<div class="badge  fs-7" style="background:#0000000f;color:black;">已出貨</div>`
                                                            }
                                                        })()
                                                    }
                                                ].map((dd: any) => {
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
                                    vm.data = vm.dataList[index]
                                    vm.type = "replace"
                                },
                                filter: html`
                                    ${BgWidget.searchPlace(gvc.event((e, event) => {
                                        vm.query = e.value
                                        gvc.notifyDataChange(id)
                                    }),vm.query || '','搜尋所有訂單')}
                                   
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
                                                                                ApiShop.deleteOrders({
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
                                    }`
                            })}
                        `)
                    } else if (vm.type == 'replace') {
                        const orderData: {
                            "id": number,
                            "cart_token": string,
                            "status": number,
                            "email": string,
                            "orderData": {
                                use_wallet: number,
                                "email": string,
                                "total": number,
                                discount: number,
                                expectDate: string,
                                shipment_fee: number,
                                use_rebate: number,
                                "lineItems": {
                                    "id": number,
                                    "spec": string[],
                                    "count": string,
                                    "sale_price": number
                                }[],
                                "user_info": {
                                    "name": string,
                                    "email": string,
                                    "phone": string,
                                    "address": string,
                                    "shipment": 'normal' | 'FAMIC2C' | 'UNIMARTC2C' | 'HILIFEC2C' | 'OKMARTC2C',
                                    'CVSStoreName': string,
                                    "CVSStoreID": string,
                                    CVSTelephone: string,
                                    MerchantTradeNo: string,
                                    CVSAddress: string
                                    "note"?: string
                                },
                                "progress": 'finish' | 'wait' | 'shipping',
                                'order_note': string,
                                voucherList: [{
                                    title: string,
                                    method: 'percent' | 'fixed',
                                    trigger: 'auto' | "code"
                                    value: string,
                                    for: 'collection' | 'product',
                                    rule: 'min_price' | 'min_count'
                                    forKey: string[],
                                    ruleValue: number,
                                    startDate: string,
                                    startTime: string,
                                    endDate?: string,
                                    endTime?: string,
                                    status: 0 | 1 | -1,
                                    type: 'voucher',
                                    code?: string,
                                    overlay: boolean,
                                    bind?: {
                                        "id": string,
                                        "spec": string[],
                                        "count": number,
                                        "sale_price": number,
                                        "collection": string[],
                                        "discount_price": number
                                    }[],
                                    start_ISO_Date: string,
                                    end_ISO_Date: string
                                }],
                            },
                            "created_time": string
                        } = vm.data ?? {
                            "id": 3469,
                            "cart_token": "1699540611634",
                            "status": 1,
                            "email": "sam38124@gmail.com",
                            "orderData": {
                                "email": "sam38124@gmail.com",
                                "total": 99000,
                                "lineItems": [
                                    {
                                        "id": 291,
                                        "spec": [
                                            "A",
                                            "140 * 230 cm"
                                        ],
                                        "count": "9",
                                        "sale_price": 11000
                                    }
                                ],
                                "user_info": {
                                    "name": "王建智",
                                    "email": "sam38124@gmail.com",
                                    "phone": "0978028730",
                                    "address": "台中市潭子區昌平路三段150巷15弄12號"
                                },
                                "progress": 'wait',
                                "note": `用戶備註: 我的餐椅是要亞麻灰的，可是到後面頁面都會跳成米白！再麻煩幫我送亞麻灰的 麻煩12月中旬過後再幫我送貨，確切時間再提千跟我聯繫，謝謝！！ 訂單來源裝置: app 金流來源與編號: 藍新金流 / 2311110375 11/8 告知 chloe及 PM 此請技術排查，並讓 chloe 向供應商說明緣由。`
                            },
                            "created_time": "2023-11-09T06:36:51.000Z"
                        }
                        orderData.orderData.progress = orderData.orderData.progress ?? "wait"
                        gvc.addStyle(`
                        .bg-warning{
                        background:#ffef9d !important;
                        color:black !important;
                        }
                        `)
                        const vt = {
                            paymentBadge: () => {
                                if (orderData.status === 0) {
                                    return `<div class="badge bg-warning fs-6" style="max-height:34px;">未付款</div>`
                                } else if (orderData.status === 1) {
                                    return `<div class="badge  fs-6" style="background:#0000000f;color:black;max-height:34px;">已付款</div>`
                                } else if (orderData.status === -2) {
                                    return `<div class="badge bg-danger fs-6" style="max-height:34px;">已退款</div>`
                                } else {
                                    return `<div class="badge bg-danger fs-6" style="max-height:34px;">付款失敗</div>`
                                }
                            },
                            outShipBadge: () => {
                                if (orderData.orderData.progress === 'finish') {
                                    return `<div class="badge  fs-6" style="background:#0000000f;color:black;max-height:34px;">已出貨</div>`

                                } else if (orderData.orderData.progress === 'shipping') {
                                    return `<div class="badge bg-info fs-6" style="max-height:34px;">配送中</div>`
                                } else {
                                    return `<div class="badge bg-warning fs-6" style="max-height:34px;">未出貨</div>`
                                }
                            }
                        }
                        return BgWidget.container(html`
                            <div class="d-flex">
                                ${BgWidget.container(`<div class="d-flex w-100 align-items-center mb-3 ">
         ${BgWidget.goBack(gvc.event(() => {
                                    vm.type = 'list'
                                }))} ${BgWidget.title(`<div class="d-flex align-items-center">
<div class="d-flex flex-column">
<div class="fs-5 text-black fw-bold d-flex align-items-center" style="gap:10px;">${orderData.cart_token}${vt.paymentBadge()}${vt.outShipBadge()}</div>
<div class="fs-6 fw-500">${glitter.ut.dateFormat(new Date(orderData.created_time), 'yyyy-MM-dd hh:mm')}</div>
</div>
</div>`)}
        <div class="flex-fill"></div>
         <button class="btn btn-primary-c" style="height:38px;font-size: 14px;" onclick="${gvc.event(() => {
                                    const dialog = new ShareDialog(gvc.glitter)
                                    dialog.dataLoading({text: "上傳中", visible: true})
                                    ApiShop.putOrder({
                                        id: `${orderData.id}`,
                                        order_data: orderData.orderData
                                    }).then((response) => {
                                        dialog.dataLoading({text: "上傳中", visible: false})
                                        if (response.result) {
                                            dialog.successMessage({text: "更新成功!"})
                                            gvc.notifyDataChange(id)
                                        } else {
                                            dialog.errorMessage({text: "更新異常!"})
                                        }
                                    })
                                })}">儲存並更改</button>
        </div>
     <div class="d-flex flex-column flex-column-reverse  flex-md-row" style="gap:10px;">
     <div style="width:900px;max-width:100%;gap:10px;" class="d-flex flex-column"> 
${BgWidget.card([`<div class="d-flex mb-2 align-items-center">
${vt.outShipBadge()}
<div class="ms-auto" style="width:150px;">
${EditorElem.select({
                                    title: ``,
                                    gvc: gvc,
                                    def: '',
                                    array: [
                                        {title: '變更出貨狀態', value: ''},
                                        {title: '未出貨', value: 'wait'},
                                        {title: '配送中', value: 'shipping'},
                                        {title: '已送達', value: 'finish'}
                                    ],
                                    callback: (text) => {
                                        orderData.orderData.progress = orderData.orderData.progress || 'wait';
                                        if (text && text !== orderData.orderData.progress) {
                                            const dialog = new ShareDialog(gvc.glitter)
                                            const copy = JSON.parse(JSON.stringify(orderData.orderData))
                                            copy.progress = text
                                            dialog.dataLoading({text: "上傳中", visible: true})
                                            ApiShop.putOrder({
                                                id: `${orderData.id}`,
                                                order_data: copy
                                            }).then((response) => {
                                                dialog.dataLoading({text: "上傳中", visible: false})
                                                if (response.result) {
                                                    dialog.successMessage({text: "更新成功!"})
                                                    orderData.orderData = copy
                                                    gvc.notifyDataChange(id)
                                                } else {
                                                    dialog.errorMessage({text: "更新異常!"})
                                                }
                                            })
                                        }

                                    }
                                })}
</div>
</div>
<div class="border rounded">
${orderData.orderData.lineItems.map((dd: any) => {
                                    return `${gvc.bindView(() => {
                                        return {
                                            bind: glitter.getUUID(),
                                            view: () => {
                                                return new Promise(async (resolve, reject) => {
                                                    resolve(`<img src="${dd.preview_image || 'https://jmva.or.jp/wp-content/uploads/2018/07/noimage.png'}" class="border rounded" style="width:60px;height:60px;">
<div class="d-flex flex-column" style="gap:5px;">
<a class="fw-bold" style="color:#005bd3;">${dd.title}</a>
<div class="d-flex">${dd.spec.map((dd: any) => {
                                                        return `<div class="bg-secondary badge fs-6">${dd}</div>`
                                                    }).join('<div class="mx-1"></div>')}</div>
<p class="text-dark fs-6">存貨單位 (SKU)：${dd.sku ?? "--"}</p>
</div>
<div class="flex-fill"></div>
<p class="text-dark fs-6">$${dd.sale_price.toLocaleString()} × ${dd.count}</p>
<p class="text-dark fs-6">$${(dd.sale_price * parseInt(dd.count, 10)).toLocaleString()}</p>`)
                                                })
                                            },
                                            divCreate: {
                                                class: `d-flex align-items-center p-2`, style: `gap:20px;`
                                            }
                                        }
                                    })}
`
                                }).join('<div class="w-100 bgf6" style="height:1px;"></div>')}

</div>

`
                                ].join('<div class="my-2"></div>'))}

     ${BgWidget.card(`
     <div class="d-flex mb-2 align-items-center">
${vt.paymentBadge()}
<div class="ms-auto" style="width:150px;">
${EditorElem.select({
                                    title: ``,
                                    gvc: gvc,
                                    def: '',
                                    array: [
                                        {title: '變更付款狀態', value: ''}, {
                                            title: '已付款',
                                            value: '1'
                                        }, {title: '未付款', value: '0'},
                                        {title: '已退款', value: '-2'}],
                                    callback: (text) => {
                                        if (text && text !== `${orderData.status}`) {
                                            const dialog = new ShareDialog(gvc.glitter)
                                            dialog.dataLoading({text: "上傳中", visible: true})
                                            ApiShop.putOrder({
                                                id: `${orderData.id}`,
                                                order_data: orderData.orderData,
                                                status: text
                                            }).then((response) => {
                                                dialog.dataLoading({text: "上傳中", visible: false})
                                                if (response.result) {
                                                    orderData.status = parseInt(text, 10)
                                                    dialog.successMessage({text: "更新成功!"})
                                                    gvc.notifyDataChange(id)
                                                } else {
                                                    dialog.errorMessage({text: "更新異常!"})
                                                }
                                            })
                                        }

                                    }
                                })}
</div>
</div>
<div class="border rounded p-3 d-flex flex-column" style="gap:10px;">
${[
                                    {
                                        title: "小計",
                                        description: `${orderData.orderData.lineItems.map((dd) => {
                                            return parseInt(dd.count, 10)
                                        }).reduce((accumulator, currentValue) => accumulator + currentValue, 0)} 件商品`,
                                        total: `$${(orderData.orderData.total + orderData.orderData.discount - orderData.orderData.shipment_fee + orderData.orderData.use_rebate).toLocaleString()}`
                                    },
                                    {
                                        title: "運送",
                                        description: '',
                                        total: `$${orderData.orderData.shipment_fee.toLocaleString()}`
                                    },
                                    ...(() => {
                                        if (orderData.orderData.use_rebate) {
                                            return [{
                                                title: "回饋金",
                                                description: ``,
                                                total: `- $${(orderData.orderData.use_rebate).toLocaleString()}`
                                            }]
                                        } else {
                                            return []
                                        }
                                    })(),
                                    ...(() => {
                                        if (orderData.orderData.use_wallet) {
                                            return [{
                                                title: "錢包",
                                                description: `使用錢包扣款`,
                                                total: `- $${(orderData.orderData.use_wallet).toLocaleString()}`
                                            }]
                                        } else {
                                            return []
                                        }
                                    })()
                                    ,
                                    ...orderData.orderData.voucherList.map((dd: any) => {
                                        return {
                                            title: "折扣",
                                            description: `<div style="max-width:200px;white-space:nowrap;text-overflow:ellipsis;">${dd.title}</div>`,
                                            total: `- $${orderData.orderData.discount.toLocaleString()}`
                                        }
                                    }), {
                                        title: "總計",
                                        description: '',
                                        total: `<span class="fw-bold">$${orderData.orderData.total.toLocaleString()}</span>`
                                    }
                                ].map((dd) => {
                                    return html`
                                        <div class="d-flex align-items-center ">
                                            <div class="fs-6 fw-bold">${dd.title}</div>
                                            <div class="ms-5 fs-6">${dd.description}</div>
                                            <div class="flex-fill"></div>
                                            <div class="ms-5 fs-6">${dd.total}</div>
                                        </div>`
                                }).join(`
                                
                                `)}

</div>
     `)}
         </div>
         <div style="width:380px;max-width:100%;">
${BgWidget.card(gvc.bindView(() => {
                                    const id = glitter.getUUID()
                                    const vm: {
                                        mode: 'edit' | 'read'
                                    } = {
                                        mode: 'read'
                                    }
                                    return {
                                        bind: id,
                                        view: () => {
                                            return html`
                                                <div class="d-flex align-items-center ">
                                                    <div class="fw-bold fs-6">用戶備註</div>
                                                    <div class="flex-fill"></div>
                                                    <i class="fa-solid fa-pencil" style="cursor:pointer;" onclick="${
                                                            gvc.event(() => {
                                                                vm.mode = (vm.mode === 'edit') ? 'read' : 'edit'
                                                                gvc.notifyDataChange(id)
                                                            })
                                                    }"></i>
                                                </div>
                                                ${(vm.mode == 'read') ? `
                                                 <div class="fs-6 w-100 mt-2  lh-lg fw-normal"
                                                     style="word-break: break-all;white-space:normal;">
                                                    ${(orderData.orderData.user_info.note ?? "尚未填寫").replace(/\n/g, `<br>`)}
                                                </div>
                                                ` : EditorElem.editeText({
                                                    gvc: gvc,
                                                    title: '',
                                                    default: orderData.orderData.user_info.note as string,
                                                    placeHolder: '',
                                                    callback: (text) => {
                                                        orderData.orderData.user_info.note = text
                                                    }
                                                })}
                                            `
                                        },
                                        divCreate: {
                                            class: `p-2 fw-normal`,
                                        }
                                    }
                                }))}
<div class="mt-2"></div>
${BgWidget.card(gvc.bindView(() => {
                                    const id = glitter.getUUID()
                                    const vm: {
                                        mode: 'edit' | 'read'
                                    } = {
                                        mode: 'read'
                                    }
                                    return {
                                        bind: id,
                                        view: () => {
                                            return html`
                                                <div class="d-flex align-items-center ">
                                                    <div class="fw-bold fs-6">訂單備註</div>
                                                    <div class="flex-fill"></div>
                                                    <i class="fa-solid fa-pencil" style="cursor:pointer;" onclick="${
                                                            gvc.event(() => {
                                                                vm.mode = (vm.mode === 'edit') ? 'read' : 'edit'
                                                                gvc.notifyDataChange(id)
                                                            })
                                                    }"></i>
                                                </div>
                                                ${(vm.mode == 'read') ? `
                                                 <div class="fs-6 w-100 mt-2  lh-lg fw-normal"
                                                     style="word-break: break-all;white-space:normal;">
                                                    ${(orderData.orderData.order_note ?? "尚未填寫").replace(/\n/g, `<br>`)}
                                                </div>
                                                ` : EditorElem.editeText({
                                                    gvc: gvc,
                                                    title: '',
                                                    default: orderData.orderData.order_note as string,
                                                    placeHolder: '',
                                                    callback: (text) => {
                                                        orderData.orderData.order_note = text
                                                    }
                                                })}
                                            `
                                        },
                                        divCreate: {
                                            class: `p-2 fw-normal`,
                                        }
                                    }
                                }))}
<div class="mt-2"></div>
${BgWidget.card(`
<div class="p-2">
<div class="d-flex align-items-center">
<div class="fw-bold fs-6">預計送達日期</div>
<div class="flex-fill"></div>
</div>
<div class="w-100 d-flex flex-column mt-2" style="gap:5px;">
${[
                                    EditorElem.editeInput({
                                        gvc: gvc,
                                        title: '',
                                        default: orderData.orderData.expectDate as string,
                                        placeHolder: '',
                                        callback: (text) => {
                                            orderData.orderData.expectDate = text
                                        },
                                        type: 'date'
                                    })
                                ].join('')}
</div>
</div>
`)}
<div class="mt-2"></div>
${BgWidget.card(`
<div class="p-2">
<div class="d-flex align-items-center">
<div class="fw-bold fs-6">客戶</div>
<div class="flex-fill"></div>
</div>
<div class="w-100 d-flex flex-column mt-2" style="gap:5px;">
${[
                                    `<div class="fw-500 fs-6 text-primary">${orderData.orderData.user_info.name}</div>`,
                                    `<div class="my-2 bgf6" style="height: 1px;"></div>`,
                                    `<div class="fw-bold fs-6">聯絡資訊</div>`,
                                    `<div class="fw-normal fs-6">Email:${orderData.orderData.user_info.email}</div>`,
                                    `<div class="fw-normal fs-6">Phone:${orderData.orderData.user_info.phone}</div>`,
                                    `<div class="my-2 bgf6" style="height: 1px;"></div>`,
                                    `<div class="fw-bold fs-6">配送方式</div>`,
                                    `<div class="fw-normal fs-6">${(() => {
                                        switch (orderData.orderData.user_info.shipment) {
                                            case "FAMIC2C":
                                                return "全家店到店"
                                            case "HILIFEC2C":
                                                return "萊爾富店到店"
                                            case "normal":
                                                return "宅配到府"
                                            case "OKMARTC2C":
                                                return "OK超商店到店"
                                            case "UNIMARTC2C":
                                                return "7-ELEVEN超商交貨便"
                                            default:
                                                return '宅配到府'
                                        }
                                    })()}</div>`,
                                    `<div class="my-2 bgf6" style="height: 1px;"></div>`,
                                    (() => {
                                        switch (orderData.orderData.user_info.shipment) {
                                            case "FAMIC2C":
                                            case "HILIFEC2C":
                                            case "OKMARTC2C":
                                            case "UNIMARTC2C":
                                                return [`<div class="fw-bold fs-6">配送門市</div>`,
                                                    `<div class="fw-normal fs-6">名稱:${orderData.orderData.user_info.CVSStoreName}</div>`,
                                                    `<div class="fw-normal fs-6">代號:${orderData.orderData.user_info.CVSStoreID}</div>`,
                                                    `<div class="fw-normal fs-6">地址:${orderData.orderData.user_info.CVSAddress}</div>`,
                                                    `<div class="my-2 bgf6" style="height: 1px;"></div>`,].join('')
                                            case "normal":
                                            default:
                                                return [`<div class="fw-bold fs-6">配送地址</div>`,
                                                    `<div class="fw-normal fs-6" style="white-space: normal;">${orderData.orderData.user_info.address}</div>`,
                                                    `<div class="my-2 bgf6" style="height: 1px;"></div>`].join('')
                                        }
                                    })()
                                ].join('')}
</div>
</div>
`)}

         </div>
</div>
`, 1200)}
                            </div>

                        `, 1200)
                    } else {
                        return ``
                    }

                }
            }
        })
    }

    public static voucherManager(gvc: GVC) {

        const glitter = gvc.glitter
        const vm: {
            type: "list" | "add" | "replace",
            data: any,
            dataList: any,
            query?: string
        } = {
            type: "list",
            data: undefined,
            dataList: undefined,
            query: undefined
        }
        return gvc.bindView(() => {
            const id = glitter.getUUID()
            const filterID = glitter.getUUID()
            return {
                bind: id,
                dataList: [{obj: vm, key: 'type'}],
                view: () => {
                    if (vm.type === 'list') {
                        return BgWidget.container(html`
                            <div class="d-flex w-100 align-items-center mb-3 ">
                                ${BgWidget.title('折扣管理')}
                                <div class="flex-fill"></div>
                                <button class="btn btn-primary-c " style="height:45px;font-size: 14px;"
                                        onclick="${gvc.event(() => {
                                            vm.data = undefined
                                            vm.type = "add"
                                        })}">新增折扣
                                </button>
                            </div>
                            ${BgWidget.table({
                                gvc: gvc,
                                getData: (vmi) => {
                                    ApiShop.getVoucher({
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
                                                        key: '標題',
                                                        value: `<span class="fs-7">${dd.content.title}</span>`
                                                    },
                                                    {
                                                        key: '狀態',
                                                        value: (dd.content.status) ? `<div class="badge badge-success fs-7" >啟用中</div>` : `<div class="badge bg-secondary fs-7">已停用</div>`
                                                    },
                                                    {
                                                        key: '觸發方式',
                                                        value: `<span class="fs-7">${(dd.content.trigger === 'code') ? `輸入代碼` : `自動`}</span>`
                                                    },
                                                    {
                                                        key: '對象',
                                                        value: `<span class="fs-7">${(dd.content.for === 'product') ? `指定商品` : `商品系列`}</span>`
                                                    },
                                                    {
                                                        key: '折扣項目',
                                                        value: `<span class="fs-7">${(dd.content.method === 'percent') ? `折扣${dd.content.value}%` : `折扣$${dd.content.value}`}</span>`
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
                                    vm.data = vm.dataList[index].content
                                    vm.type = "replace"
                                },
                                filter: html`
                                    ${BgWidget.searchPlace(gvc.event((e, event) => {
                                        vm.query = e.value
                                        gvc.notifyDataChange(id)
                                    }),vm.query || '','搜尋所有折扣')}
                                   
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
                                                                                ApiShop.deleteVoucher({
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
                                                            style: `height:40px;gap:10px;margin-top:10px;`
                                                        }
                                                    }
                                                }
                                            })
                                    }`
                            })}
                        `)
                    } else if (vm.type == 'replace') {
                        return this.voucherEditor({
                            vm: vm,
                            gvc: gvc,
                            type: 'replace'
                        })
                    } else {
                        return this.voucherEditor({
                            vm: vm,
                            gvc: gvc,
                            type: 'add'
                        })
                    }

                }
            }
        })
    }

    public static voucherEditor(obj: {
        vm: any,
        gvc: GVC,
        type?: 'add' | 'replace',
        defData?: any
    }) {
        const gvc = obj.gvc
        const glitter = gvc.glitter;
        const vm = obj.vm;
        const voucherData: {
            id: string,
            title: string,
            reBackType: 'rebate' | 'discount' | 'shipment_free',
            method: 'percent' | 'fixed',
            trigger: 'auto' | "code"
            value: string,
            for: 'collection' | 'product' | 'all',
            rule: 'min_price' | 'min_count'
            forKey: string[],
            ruleValue: number,
            startDate: string,
            startTime: string,
            endDate?: string,
            endTime?: string,
            status: 0 | 1 | -1,
            type: 'voucher',
            code?: string,
            overlay: boolean,
            start_ISO_Date: string,
            end_ISO_Date: string
        } = vm.data ?? {
            title: '',
            trigger: 'code',
            method: 'fixed',
            value: '',
            for: 'product',
            forKey: [],
            rule: 'min_count',
            ruleValue: 0,
            startDate: '',
            startTime: '',
            endTime: '',
            endDate: '',
            status: 1,
            type: 'voucher',
            overlay: false,
            start_ISO_Date: '',
            end_ISO_Date: '',
            reBackType: 'discount'
        }
        gvc.addStyle(`
                        .bg-warning{
                        background:#ffef9d !important;
                        color:black !important;
                        }
                        `)

        return BgWidget.container(html`
            <div class="d-flex w-100 align-items-center mb-3 ">
                ${BgWidget.goBack(gvc.event(() => {
                    vm.type = 'list'
                }))} ${BgWidget.title(`編輯優惠券`)}
                <div class="flex-fill"></div>
                <button class="btn btn-primary-c" style="height:38px;font-size: 14px;"
                        onclick="${gvc.event(() => {
                            voucherData.start_ISO_Date = ''
                            voucherData.end_ISO_Date = ''
                            glitter.ut.tryMethod([
                                () => {
                                    voucherData.start_ISO_Date = new Date(`${voucherData.startDate} ${voucherData.startTime}`).toISOString()
                                },
                                () => {
                                    voucherData.end_ISO_Date = new Date(`${voucherData.endDate} ${voucherData.endTime}`).toISOString()
                                }
                            ])

                            const dialog = new ShareDialog(gvc.glitter)
                            if (obj.type === 'replace') {
                                dialog.dataLoading({text: '變更優換券', visible: true})
                                ApiPost.put({
                                    postData: voucherData,
                                    token: GlobalUser.token,
                                    type: 'manager'
                                }).then((re) => {
                                    dialog.dataLoading({visible: false})
                                    if (re.result) {
                                        vm.status = 'list'
                                        dialog.successMessage({text: `上傳成功...`})
                                    } else {
                                        dialog.errorMessage({text: `上傳失敗...`})
                                    }
                                })
                            } else {
                                dialog.dataLoading({text: '新增優換券', visible: true})
                                ApiPost.post({
                                    postData: voucherData,
                                    token: GlobalUser.token,
                                    type: 'manager'
                                }).then((re) => {
                                    dialog.dataLoading({visible: false})
                                    if (re.result) {
                                        vm.type = 'list'
                                        dialog.successMessage({text: `上傳成功...`})
                                    } else {
                                        dialog.errorMessage({text: `上傳失敗...`})
                                    }
                                })
                            }
                        })}">儲存並新增
                </button>
            </div>
            <div class="d-flex" style="gap:10px;">
                <div class="" style="width:700px;">
                    ${[
                        BgWidget.card(`
                            <h3 class="fs-7 mb-2">折扣券名稱</h3>
                              ${[EditorElem.editeInput({
                            gvc: gvc,
                            title: '',
                            default: voucherData.title,
                            placeHolder: '',
                            callback: (text) => {
                                voucherData.title = text
                            }
                        })].join('')}
                               <span class="badge bgf6 mt-2 fs-7" style="color:black;">顧客會在購物車內與結帳時看見此標題。</span>
                               <div class=" border w-100 my-2"></div>
                               ${EditorElem.checkBox({
                            gvc: gvc,
                            title: '觸發方式',
                            def: voucherData.trigger,
                            array: [
                                {title: '自動', value: 'auto'},
                                {
                                    title: '代碼', value: 'code', innerHtml: EditorElem.editeInput({
                                        gvc: gvc,
                                        title: '',
                                        default: voucherData.code ?? "",
                                        placeHolder: '請輸入優惠券代碼',
                                        callback: (text) => {
                                            voucherData.code = text
                                        }
                                    })
                                }
                            ],
                            callback: (text) => {
                                if (text === 'auto') {
                                    voucherData.code = undefined
                                }
                                voucherData.trigger = text as any
                            }
                        })}
                            `),
                        BgWidget.card(
                                gvc.bindView(() => {
                                    const id = glitter.getUUID()
                                    return {
                                        bind: id,
                                        dataList: [{obj: voucherData, key: 'method'}, {
                                            obj: voucherData,
                                            key: 'reBackType'
                                        }],
                                        view: () => {
                                            return html`
                                                <h6 class="fs-7 mb-2">折抵方式</h6>
                                                ${
                                                        EditorElem.checkBox({
                                                            gvc: gvc,
                                                            title: '',
                                                            def: voucherData.reBackType,
                                                            array: [
                                                                {title: '訂單現折', value: 'discount'},
                                                                {title: '回饋金', value: 'rebate'},
                                                                {title: '滿額免運', value: 'shipment_free'}
                                                            ],
                                                            callback: (text) => {
                                                                voucherData.reBackType = text as any
                                                            }
                                                        })
                                                }

                                                ${[
                                                    (() => {
                                                        if (voucherData.reBackType === 'shipment_free') {
                                                            return ``
                                                        } else {
                                                            return [`<h6 class="fs-7 mb-2 mt-2">折扣金額</h6>`,
                                                                EditorElem.checkBox({
                                                                    gvc: gvc,
                                                                    title: '',
                                                                    def: voucherData.method,
                                                                    array: [
                                                                        {title: '固定金額', value: 'fixed'},
                                                                        {title: '百分比', value: 'percent'}
                                                                    ],
                                                                    callback: (text) => {
                                                                        voucherData.value = ''
                                                                        voucherData.method = text as any
                                                                    }
                                                                }),
                                                                html`
                                                                    <h3 class="fs-7 mb-2">值</h3>
                                                                    <div class="d-flex align-items-center">
                                                                        ${EditorElem.editeInput({
                                                                            gvc: gvc,
                                                                            type: 'number',
                                                                            style: `width:125px;`,
                                                                            title: '',
                                                                            default: voucherData.value,
                                                                            placeHolder: '',
                                                                            callback: (text) => {
                                                                                if (voucherData.method === 'percent' && parseInt(text, 10) >= 100) {
                                                                                    alert('數值不得大於100%')
                                                                                    gvc.notifyDataChange(id)
                                                                                } else {
                                                                                    voucherData.value = text
                                                                                }

                                                                            }
                                                                        })}
                                                                        <div style="width:40px;"
                                                                             class="d-flex align-items-center justify-content-center">
                                                                            ${(voucherData.method === 'fixed') ? `$` : `%`}
                                                                        </div>
                                                                    </div>`].join('')
                                                        }
                                                    })(),
                                                    html`
                                                        <h3 class="fs-7 mb-2">套用至</h3>
                                                        ${EditorElem.checkBox({
                                                            gvc: gvc,
                                                            title: '',
                                                            def: voucherData.for,
                                                            array: [
                                                                {
                                                                    title: '商品系列',
                                                                    value: 'collection'
                                                                },
                                                                {title: '單一商品', value: 'product'},
                                                                {title: '所有商品', value: 'all'}
                                                            ],
                                                            callback: (text) => {
                                                                voucherData.forKey = []
                                                                voucherData.for = text as any
                                                                gvc.notifyDataChange(id)
                                                            }
                                                        })}
                                                    `,
                                                    (voucherData.for === 'collection') ? gvc.bindView(() => {
                                                        let interval: any = 0
                                                        const id2 = glitter.getUUID()
                                                        return {
                                                            bind: id2,
                                                            view: () => {
                                                                return new Promise(async (resolve, reject) => {
                                                                    resolve(EditorElem.arrayItem({
                                                                        gvc: gvc,
                                                                        title: '',
                                                                        height: 45,
                                                                        copyable: false,
                                                                        array: () => {
                                                                            return voucherData.forKey.map((dd: any, index: number) => {
                                                                                return {
                                                                                    title: EditorElem.searchInputDynamic({
                                                                                        title: '',
                                                                                        gvc: gvc,

                                                                                        def: dd,
                                                                                        search: (text, callback) => {
                                                                                            clearInterval(interval)
                                                                                            interval = setTimeout(() => {
                                                                                                ApiShop.getCollection().then((data) => {
                                                                                                    if (data.result && data.response.value) {
                                                                                                        let keyIndex: any = []

                                                                                                        function loopCValue(data: any, ind: string) {
                                                                                                            data.map((dd: any) => {
                                                                                                                const indt = (ind) ? `${ind} / ${dd.title}` : dd.title
                                                                                                                dd.collectionTag = indt
                                                                                                                keyIndex.push(indt)
                                                                                                                if (dd.array && dd.array.length > 0) {
                                                                                                                    loopCValue(dd.array, indt)
                                                                                                                }
                                                                                                            })
                                                                                                        }

                                                                                                        loopCValue(data.response.value, '')
                                                                                                        callback(keyIndex.filter((d2: string) => {
                                                                                                            return dd.indexOf(dd) !== -1
                                                                                                        }))
                                                                                                    } else {
                                                                                                        callback([])
                                                                                                    }
                                                                                                })
                                                                                            }, 100)
                                                                                        },
                                                                                        callback: (text) => {
                                                                                            voucherData.forKey[index] = text
                                                                                        },
                                                                                        placeHolder: '請輸入商品名稱'
                                                                                    })
                                                                                }
                                                                            })
                                                                        },
                                                                        originalArray: voucherData.forKey,
                                                                        expand: {},
                                                                        refreshComponent: () => {
                                                                            gvc.notifyDataChange(id2)
                                                                        },
                                                                        plus: {
                                                                            title: '新增商品系列',
                                                                            event: gvc.event(() => {
                                                                                voucherData.forKey.push('')
                                                                                gvc.notifyDataChange(id2)
                                                                            })
                                                                        }
                                                                    }))
                                                                })
                                                            },
                                                            divCreate: {
                                                                style: `pt-2`
                                                            }
                                                        }
                                                    }) : gvc.bindView(() => {
                                                        let interval: any = 0
                                                        let mapPdName: any = {}
                                                        const id2 = glitter.getUUID()
                                                        return {
                                                            bind: id2,
                                                            view: () => {
                                                                return new Promise(async (resolve, reject) => {
                                                                    if (voucherData.for === 'all') {
                                                                        resolve('')
                                                                    } else {
                                                                        resolve(EditorElem.arrayItem({
                                                                            gvc: gvc,
                                                                            title: '',
                                                                            height: 45,
                                                                            copyable: false,
                                                                            array: () => {
                                                                                return voucherData.forKey.map((dd: any, index: number) => {

                                                                                    return {
                                                                                        title: gvc.bindView(() => {
                                                                                            const id = glitter.getUUID()
                                                                                            return {
                                                                                                bind: id,
                                                                                                view: () => {
                                                                                                    return new Promise(async (resolve, reject) => {
                                                                                                        const title = await new Promise(async (resolve, reject) => {
                                                                                                            if (mapPdName[dd]) {
                                                                                                                resolve(mapPdName[dd])
                                                                                                                return
                                                                                                            } else if (!dd) {
                                                                                                                resolve('')
                                                                                                                return
                                                                                                            }
                                                                                                            ApiShop.getProduct({
                                                                                                                page: 0,
                                                                                                                limit: 50,
                                                                                                                id: dd
                                                                                                            }).then((data) => {
                                                                                                                if (data.result && data.response.result) {
                                                                                                                    mapPdName[dd] = data.response.data.content.title
                                                                                                                    resolve(data.response.data.content.title)
                                                                                                                } else {
                                                                                                                    mapPdName[dd] = ''
                                                                                                                    resolve('')
                                                                                                                }
                                                                                                            })
                                                                                                        })
                                                                                                        resolve(EditorElem.searchInputDynamic({
                                                                                                            title: '',
                                                                                                            gvc: gvc,
                                                                                                            def: title as string,
                                                                                                            search: (text, callback) => {
                                                                                                                clearInterval(interval)
                                                                                                                interval = setTimeout(() => {
                                                                                                                    ApiShop.getProduct({
                                                                                                                        page: 0,
                                                                                                                        limit: 50,
                                                                                                                        search: ''
                                                                                                                    }).then((data) => {
                                                                                                                        callback(data.response.data.map((dd: any) => {
                                                                                                                            return dd.content.title
                                                                                                                        }))
                                                                                                                    })
                                                                                                                }, 100)
                                                                                                            },
                                                                                                            callback: (text) => {
                                                                                                                ApiShop.getProduct({
                                                                                                                    page: 0,
                                                                                                                    limit: 50,
                                                                                                                    search: text
                                                                                                                }).then((data) => {
                                                                                                                    voucherData.forKey[index] = data.response.data.find((dd: any) => {
                                                                                                                        return dd.content.title === text
                                                                                                                    }).id
                                                                                                                    mapPdName[voucherData.forKey[index]] = text
                                                                                                                })
                                                                                                            },
                                                                                                            placeHolder: '請輸入商品名稱'
                                                                                                        }))
                                                                                                    })
                                                                                                }
                                                                                            }
                                                                                        })
                                                                                    }
                                                                                })
                                                                            },
                                                                            originalArray: voucherData.forKey,
                                                                            expand: {},
                                                                            refreshComponent: () => {
                                                                                gvc.notifyDataChange(id2)
                                                                            },
                                                                            plus: {
                                                                                title: '新增商品',
                                                                                event: gvc.event(() => {
                                                                                    voucherData.forKey.push('')
                                                                                    gvc.notifyDataChange(id2)
                                                                                })
                                                                            }
                                                                        }))
                                                                    }
                                                                })
                                                            },
                                                            divCreate: {
                                                                style: `pt-2`
                                                            }
                                                        }
                                                    })
                                                ].join('<div class="my-2"></div>')}
                                            `
                                        },
                                        divCreate: {}
                                    }
                                })
                        ),
                        BgWidget.card(
                                gvc.bindView(() => {
                                    const id = glitter.getUUID()
                                    return {
                                        bind: id,
                                        view: () => {
                                            return [
                                                ` <h6 class="fs-7 mb-2">最低消費要求</h6>`,
                                                EditorElem.checkBox({
                                                    gvc: gvc,
                                                    title: '',
                                                    def: voucherData.rule,
                                                    array: [
                                                        {
                                                            title: '最低消費金額',
                                                            value: 'min_price',
                                                            innerHtml: `<div class="d-flex align-items-center">
${EditorElem.editeInput({
                                                                gvc: gvc,
                                                                title: '',
                                                                type: 'number',
                                                                style: `font-size:0.85rem;height:40px;width:150px;`,
                                                                default: `${voucherData.ruleValue}`,
                                                                placeHolder: '',
                                                                callback: (text) => {
                                                                    voucherData.ruleValue = parseInt(text, 10)
                                                                }
                                                            })}
<span class="ms-2">元</span>
</div>`
                                                        },
                                                        {
                                                            title: '最少商品購買數量',
                                                            value: 'min_count',
                                                            innerHtml: `<div class="d-flex align-items-center">
${EditorElem.editeInput({
                                                                gvc: gvc,
                                                                title: '',
                                                                type: 'number',
                                                                style: `font-size:0.85rem;height:40px;width:150px;`,
                                                                default: `${voucherData.ruleValue}`,
                                                                placeHolder: '',
                                                                callback: (text) => {
                                                                    voucherData.ruleValue = parseInt(text, 10)
                                                                }
                                                            })}
<span class="ms-2">個</span>
</div>`
                                                        }
                                                    ],
                                                    callback: (text) => {
                                                        voucherData.ruleValue = 0
                                                        voucherData.rule = text as any
                                                        gvc.notifyDataChange(id)
                                                    }
                                                })
                                            ].join('')
                                        }
                                    }
                                })
                        ),
                        BgWidget.card(
                                gvc.bindView(() => {
                                    const id = glitter.getUUID()
                                    return {
                                        bind: id,
                                        view: () => {
                                            return [
                                                `<h6 class="fs-7 mb-2">是否可疊加使用</h6>`,
                                                EditorElem.checkBox({
                                                    gvc: gvc,
                                                    title: '',
                                                    def: voucherData.overlay ? `true` : `false`,
                                                    array: [
                                                        {
                                                            title: '可以疊加',
                                                            value: 'true'
                                                        },
                                                        {
                                                            title: '不可疊加',
                                                            value: 'false'
                                                        }
                                                    ],
                                                    callback: (text) => {
                                                        voucherData.overlay = text === 'true'
                                                        gvc.notifyDataChange(id)
                                                    }
                                                }),
                                                `<span class="badge bgf6 mt-2 fs-7" style="color:black;">系統將以最大優惠排序進行判定。</span>`
                                            ].join('')
                                        }
                                    }
                                })
                        ),
                        BgWidget.card(
                                gvc.bindView(() => {
                                    const id = glitter.getUUID()
                                    return {
                                        bind: id,
                                        view: () => {
                                            return [
                                                ` <h6 class="fs-7 mb-2">有效日期</h6>`,
                                                `<div class="d-flex align-items-center mb-2">
<div>
${EditorElem.editeInput({
                                                    gvc: gvc,
                                                    title: '<span class="me-2 fs-7">開始日期</span>',
                                                    type: 'date',
                                                    style: `font-size:0.85rem;height:40px;width:200px;`,
                                                    default: `${voucherData.startDate}`,
                                                    placeHolder: '',
                                                    callback: (text) => {
                                                        voucherData.startDate = text
                                                    }
                                                })}
</div>
<div class="ms-3">
${EditorElem.editeInput({
                                                    gvc: gvc,
                                                    title: '<span class="me-2 fs-7 ms-2">開始時間</span>',
                                                    type: 'time',
                                                    style: `font-size:0.85rem;height:40px;width:200px;`,
                                                    default: `${voucherData.startTime}`,
                                                    placeHolder: '',
                                                    callback: (text) => {
                                                        voucherData.startTime = text
                                                    }
                                                })}
</div>
</div>`,
                                                (() => {
                                                    const endDate = (voucherData.endDate) ? `withEnd` : `noEnd`
                                                    return EditorElem.checkBox({
                                                        gvc: gvc,
                                                        title: '',
                                                        def: endDate,
                                                        array: [
                                                            {
                                                                title: '無期限',
                                                                value: 'noEnd'
                                                            },
                                                            {
                                                                title: '有效期限',
                                                                value: 'withEnd',
                                                                innerHtml: `<div class="d-flex align-items-center mb-2">
<div>
${EditorElem.editeInput({
                                                                    gvc: gvc,
                                                                    title: '<span class="me-2 fs-7">結束日期</span>',
                                                                    type: 'date',
                                                                    style: `font-size:0.85rem;height:40px;width:200px;`,
                                                                    default: `${voucherData.endDate}`,
                                                                    placeHolder: '',
                                                                    callback: (text) => {
                                                                        voucherData.endDate = text
                                                                    }
                                                                })}
</div>
<div class="ms-3">
${EditorElem.editeInput({
                                                                    gvc: gvc,
                                                                    title: '<span class="me-2 fs-7 ms-2">結束時間</span>',
                                                                    type: 'time',
                                                                    style: `font-size:0.85rem;height:40px;width:200px;`,
                                                                    default: `${voucherData.endTime}`,
                                                                    placeHolder: '',
                                                                    callback: (text) => {
                                                                        voucherData.endTime = text
                                                                    }
                                                                })}
</div>
</div>`
                                                            }
                                                        ],
                                                        callback: (text) => {
                                                            if (text === 'noEnd') {
                                                                voucherData.endDate = undefined
                                                                voucherData.endTime = undefined
                                                            }
                                                        }
                                                    })
                                                })()
                                            ].join('')
                                        }
                                    }
                                })
                        )
                    ].join(`<div class="my-2"></div>`)}

                </div>
                <div class="flex-fill d-none">
                    ${BgWidget.card(`
                            <h3 class="fs-7">折扣券名稱</h3>
                            `)}
                </div>
            </div>
            ${(obj.type === 'replace') ? `
               <div class="d-flex w-100">
               <div class="flex-fill"></div>
                 <button class="btn btn-danger mt-3 ${(obj.type === 'replace') ? `` : `d-none`}  ms-auto px-2" style="height:30px;width:100px;" onclick="${
                    obj.gvc.event(() => {
                        const dialog = new ShareDialog(obj.gvc.glitter)
                        dialog.checkYesOrNot({
                            text: "是否確認刪除優惠券?",
                            callback: (response) => {
                                if (response) {
                                    dialog.dataLoading({visible: true})
                                    ApiShop.deleteVoucher({
                                        id: voucherData.id
                                    }).then((res) => {
                                        dialog.dataLoading({visible: false})
                                        if (res.result) {
                                            vm.type = 'list'
                                        } else {
                                            dialog.errorMessage({text: "刪除失敗"})
                                        }
                                    })
                                }
                            }
                        })
                    })
            }">刪除優惠券</button>
</div>
                ` : ``}
        `, 700)
    }

    public static productManager(gvc: GVC) {

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
                            return BgShopping.editProduct({
                                vm: vm,
                                gvc: gvc,
                                type: 'add'
                            })
                        case "list":
                            const filterID = gvc.glitter.getUUID();
                            return BgWidget.container(html`
                                <div class="d-flex w-100 align-items-center mb-3">
                                    ${BgWidget.title('商品管理')}
                                    <div class="flex-fill"></div>
                                    <button class="btn btn-primary-c" style="height:45px;font-size: 14px;"
                                            onclick="${gvc.event(() => {
                                                vm.status = 'add'
                                            })}">新增商品
                                    </button>
                                </div>
                                ${BgWidget.table({
                                    gvc: gvc,
                                    getData: (vmi) => {

                                        ApiShop.getProduct({
                                            page: vmi.page - 1, limit: 50,
                                            search: vm.query || undefined
                                        }).then((data) => {
                                            vmi.pageSize = Math.ceil(data.response.total / 50)
                                            vm.dataList = data.response.data;

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
                                                                style: "height:40px;"
                                                            })
                                                        },
                                                        {
                                                            key: '商品',
                                                            value: `<img class="rounded border me-4 ${dd.content.preview_image[0] ? `` : `d-none`}" alt="" src="${dd.content.preview_image[0] || 'https://jmva.or.jp/wp-content/uploads/2018/07/noimage.png'}" style="width:40px;height:40px;">` + dd.content.title
                                                        },
                                                        {
                                                            key: '狀態',
                                                            value: (dd.content.status === 'active') ? `<div class="badge badge-success fs-7" >啟用中</div>` : `<div class="badge bg-secondary fs-7">草稿</div>`
                                                        },
                                                        {
                                                            key: '售價',
                                                            value: Math.min(...dd.content.variants.map((dd: any) => {
                                                                return dd.sale_price
                                                            }))
                                                        },
                                                        {
                                                            key: '庫存',
                                                            value: Math.min(...dd.content.variants.map((dd: any) => {
                                                                return dd.stock
                                                            }))
                                                        },
                                                        {
                                                            key: '類別',
                                                            value: `<div class="d-flex align-items-center " style="height:40px;">${dd.content.collection.map((dd: any) => {
                                                                return `<div class="badge bg-secondary fs-7">${dd}</div>`
                                                            }).join(`<div class="mx-1"></div>`)}</div>`
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
                                        ${BgWidget.searchPlace(gvc.event((e, event) => {
                                            vm.query = e.value
                                            gvc.notifyDataChange(id)
                                        }),vm.query || '','搜尋所有商品')}
                                        
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
                                                                style: `height:40px;gap:10px;margin-top:10px;`
                                                            }
                                                        }
                                                    }
                                                })
                                        }
                                    `
                                })}
                            `)
                        case "replace":
                            return BgShopping.editProduct({
                                vm: vm,
                                gvc: gvc,
                                type: 'replace',
                                defData: replaceData
                            })
                    }

                },
                divCreate: {
                    class: `w-100 h-100`
                }
            }
        })
    }

    public static collectionManager(obj: {
        gvc: GVC
    }) {
        let array: any = [];
        const glitter = obj.gvc.glitter

        return html`
            ${BgWidget.container(obj.gvc.bindView(() => {
                const dialog = new ShareDialog(glitter)
                const id = glitter.getUUID()
                dialog.dataLoading({text: '', visible: true})
                ApiShop.getCollection().then((res) => {
                    array = res.response.value || []
                    setTimeout(() => {
                        dialog.dataLoading({visible: false})
                    }, 500)
                    obj.gvc.notifyDataChange(id)
                })
                return {
                    bind: id,
                    view: () => {
                        return ` <div class="d-flex w-100 align-items-center mb-3 ">
                    ${BgWidget.title('商品系列管理')}
                    <div class="flex-fill"></div>
                    <button class="btn btn-primary-c" style="height:38px;font-size: 14px;" onclick="${obj.gvc.event(() => {
                            dialog.dataLoading({text: '商品上傳中...', visible: true})
                            ApiShop.setCollection(array).then((response) => {
                                dialog.dataLoading({text: '上傳中...', visible: false})
                                if (response.result) {
                                    dialog.successMessage({text: "上傳成功..."})
                                } else {
                                    dialog.errorMessage({text: "上傳失敗..."})
                                }
                            })
                        })}">儲存</button>
                </div>
                ${BgWidget.card((() => {
                            function renderArray(title: string, array: any, notify: () => void) {
                                return EditorElem.arrayItem({
                                    gvc: obj.gvc,
                                    title: title,
                                    array: () => {
                                        return array.map((dd: any) => {
                                            return {
                                                title: dd.title || "尚未設定名稱",
                                                innerHtml: (gvc: GVC) => {
                                                    dd.array = dd.array ?? []
                                                    return gvc.bindView(() => {
                                                        const id2 = glitter.getUUID()
                                                        return {
                                                            bind: id2,
                                                            view: () => {
                                                                return EditorElem.container([
                                                                    EditorElem.editeInput({
                                                                        gvc: gvc,
                                                                        title: '商品系列標題',
                                                                        default: dd.title ?? '',
                                                                        placeHolder: '商品系列標題',
                                                                        callback: (text) => {
                                                                            dd.title = text
                                                                            obj.gvc.notifyDataChange(id)
                                                                        }
                                                                    }),
                                                                    EditorElem.uploadImage({
                                                                        title: "商品系列圖片",
                                                                        gvc: gvc,
                                                                        def: dd.img ?? '',
                                                                        callback: (text) => {
                                                                            dd.img = text
                                                                            obj.gvc.notifyDataChange(id)
                                                                        }
                                                                    }),
                                                                    `<div class="mx-n2">${renderArray('子分類項目', dd.array, () => {
                                                                        gvc.notifyDataChange(id2)
                                                                    })}</div>`
                                                                ])
                                                            }
                                                        }
                                                    })
                                                },
                                            }
                                        })
                                    },
                                    originalArray: array,
                                    expand: true,
                                    refreshComponent: () => {
                                        notify()
                                    },
                                    plus: {
                                        title: '新增分類項目',
                                        event: obj.gvc.event(() => {
                                                    array.push({title: ''})
                                                    notify()
                                                }
                                        )
                                    }
                                })
                            }

                            return renderArray('大分類', array, () => {
                                obj.gvc.notifyDataChange(id)
                            })
                        })(), `py-0 px-0 bg-white rounded-3 shadow border w-100`)}`
                    },
                    divCreate: {}
                }
            }), 800)}`
    }

    public static showListManager(obj: {
        gvc: GVC
    }) {
        let array: any = [];
        const glitter = obj.gvc.glitter

        return html`
            ${BgWidget.container(obj.gvc.bindView(() => {
                const dialog = new ShareDialog(glitter)
                const id = glitter.getUUID()
                dialog.dataLoading({text: '', visible: true})
                ApiShop.getShowList().then((res) => {
                    array = res.response.value || []
                    setTimeout(() => {
                        dialog.dataLoading({visible: false})
                    }, 500)
                    obj.gvc.notifyDataChange(id)
                })
                return {
                    bind: id,
                    view: () => {
                        return ` <div class="d-flex w-100 align-items-center mb-3 ">
                    ${BgWidget.title('商品顯示區塊')}
                    <div class="flex-fill"></div>
                    <button class="btn btn-primary-c" style="height:38px;font-size: 14px;" onclick="${obj.gvc.event(() => {
                            dialog.dataLoading({text: '商品上傳中...', visible: true})
                            ApiShop.setShowList(array).then((response) => {
                                dialog.dataLoading({text: '上傳中...', visible: false})
                                if (response.result) {
                                    dialog.successMessage({text: "上傳成功..."})
                                } else {
                                    dialog.errorMessage({text: "上傳失敗..."})
                                }
                            })
                        })}">儲存</button>
                </div>
                ${BgWidget.card((() => {
                            function renderArray(title: string, array: any, notify: () => void) {
                                return EditorElem.arrayItem({
                                    gvc: obj.gvc,
                                    title: title,
                                    array: () => {
                                        return array.map((dd: any) => {
                                            return {
                                                title: dd.title || "區塊名稱",
                                                innerHtml: (gvc: GVC) => {
                                                    dd.array = dd.array ?? []
                                                    return gvc.bindView(() => {
                                                        const id2 = glitter.getUUID()

                                                        function refreshIDView() {
                                                            gvc.notifyDataChange(id2)
                                                        }

                                                        return {
                                                            bind: id2,
                                                            view: () => {
                                                                return EditorElem.container([
                                                                    EditorElem.editeInput({
                                                                        gvc: gvc,
                                                                        title: '區塊標籤',
                                                                        default: dd.tag ?? '',
                                                                        placeHolder: '商品區塊標籤',
                                                                        callback: (text) => {
                                                                            dd.tag = text
                                                                            obj.gvc.notifyDataChange(id)
                                                                        }
                                                                    }),
                                                                    EditorElem.editeInput({
                                                                        gvc: gvc,
                                                                        title: '區塊標題',
                                                                        default: dd.title ?? '',
                                                                        placeHolder: '商品區塊標題',
                                                                        callback: (text) => {
                                                                            dd.title = text
                                                                            obj.gvc.notifyDataChange(id)
                                                                        }
                                                                    }),
                                                                    EditorElem.uploadImage({
                                                                        title: "區塊圖片",
                                                                        gvc: gvc,
                                                                        def: dd.img ?? '',
                                                                        callback: (text) => {
                                                                            dd.img = text
                                                                            obj.gvc.notifyDataChange(id)
                                                                        }
                                                                    }),
                                                                    `<div class="mx-n2">${EditorElem.arrayItem({
                                                                        gvc: gvc,
                                                                        title: "商品項目",
                                                                        array: () => {
                                                                            return dd.array.map((dd: any, index: number) => {
                                                                                return {
                                                                                    title: dd.title ?? `商品:${index + 1}`,
                                                                                    innerHtml: (gvc: GVC) => {
                                                                                        return gvc.bindView(() => {
                                                                                            let interval: any = 0
                                                                                            return {
                                                                                                bind: id,
                                                                                                view: () => {
                                                                                                    return new Promise(async (resolve, reject) => {
                                                                                                        const title = await new Promise((resolve, reject) => {
                                                                                                            ApiShop.getProduct({
                                                                                                                page: 0,
                                                                                                                limit: 50,
                                                                                                                id: dd.id
                                                                                                            }).then((data) => {
                                                                                                                if (data.result && data.response.result) {
                                                                                                                    resolve(data.response.data.content.title)
                                                                                                                } else {
                                                                                                                    resolve('')
                                                                                                                }
                                                                                                            })
                                                                                                        })
                                                                                                        resolve(EditorElem.searchInputDynamic({
                                                                                                            title: '搜尋商品',
                                                                                                            gvc: gvc,
                                                                                                            def: title as string,
                                                                                                            search: (text, callback) => {
                                                                                                                clearInterval(interval)
                                                                                                                interval = setTimeout(() => {
                                                                                                                    ApiShop.getProduct({
                                                                                                                        page: 0,
                                                                                                                        limit: 50,
                                                                                                                        search: ''
                                                                                                                    }).then((data) => {
                                                                                                                        callback(data.response.data.map((dd: any) => {
                                                                                                                            return dd.content.title
                                                                                                                        }))
                                                                                                                    })
                                                                                                                }, 100)
                                                                                                            },
                                                                                                            callback: (text) => {
                                                                                                                ApiShop.getProduct({
                                                                                                                    page: 0,
                                                                                                                    limit: 50,
                                                                                                                    search: text
                                                                                                                }).then((data) => {
                                                                                                                    dd.id = data.response.data.find((dd: any) => {
                                                                                                                        return dd.content.title === text
                                                                                                                    }).id
                                                                                                                    dd.title = text
                                                                                                                    refreshIDView()
                                                                                                                })
                                                                                                            },
                                                                                                            placeHolder: '請輸入商品名稱'
                                                                                                        }))
                                                                                                    })
                                                                                                },
                                                                                                divCreate: {
                                                                                                    style: `min-height:400px;pt-2`
                                                                                                }
                                                                                            }
                                                                                        })
                                                                                    },
                                                                                    expand: {},
                                                                                    minus: gvc.event(() => {
                                                                                        dd.array.splice(index, 1)
                                                                                        gvc.recreateView()
                                                                                    })
                                                                                }
                                                                            })
                                                                        },
                                                                        originalArray: dd.array,
                                                                        expand: {},
                                                                        plus: {
                                                                            title: "新增商品",
                                                                            event: gvc.event(() => {
                                                                                dd.array.push({})
                                                                                gvc.recreateView()
                                                                            })
                                                                        },
                                                                        refreshComponent: () => {
                                                                            gvc.recreateView()
                                                                        }
                                                                    })}</div>`
                                                                ])
                                                            }
                                                        }
                                                    })
                                                },
                                            }
                                        })
                                    },
                                    originalArray: array,
                                    expand: true,
                                    refreshComponent: () => {
                                        notify()
                                    },
                                    plus: {
                                        title: '新增顯示區塊',
                                        event: obj.gvc.event(() => {
                                                    array.push({title: ''})
                                                    notify()
                                                }
                                        )
                                    }
                                })
                            }

                            return renderArray('區塊設定', array, () => {
                                obj.gvc.notifyDataChange(id)
                            })
                        })(), `py-0 px-0 bg-white rounded-3 shadow border w-100`)}`
                    },
                    divCreate: {}
                }
            }), 800)}`
    }

    public static editProduct(obj: {
        vm: any,
        gvc: GVC,
        type?: 'add' | 'replace',
        defData?: any
    }) {
        let postMD: {
            id?: string,
            title: string,
            content: string,
            preview_image: string[],
            collection: string[],
            status: 'active' | 'draft',
            specs: { title: string, option: any }[],
            variants: { compare_price: number, sale_price: number, stock: number, sku: string, spec: string[], preview_image: string, shipment_weight: number }[],
            seo: {
                title: string,
                content: string,
            },
            template: string
        } = {
            title: '',
            content: '',
            status: 'active',
            collection: [],
            preview_image: [],
            specs: [],
            variants: [],
            seo: {
                title: '',
                content: ''
            },
            template: ''
        }
        if (obj.type === 'replace') {
            postMD = obj.defData
        }
        const html = String.raw
        const gvc = obj.gvc
        const seoID = gvc.glitter.getUUID()
        return html`
            <div class="d-flex">
                ${BgWidget.container(`<div class="d-flex w-100 align-items-center mb-3 ">
                ${BgWidget.goBack(obj.gvc.event(() => {
                    obj.vm.status = 'list'
                }))} ${BgWidget.title((obj.type === 'replace') ? `編輯商品` : `新增商品`)}
        <div class="flex-fill"></div>
         <button class="btn btn-primary-c" style="height:38px;font-size: 14px;" onclick="${obj.gvc.event(() => {
                    setTimeout(() => {
                        if (obj.type === 'replace') {
                            BgShopping.putEvent(postMD, obj.gvc, obj.vm)
                        } else {
                            BgShopping.postEvent(postMD, obj.gvc, obj.vm)
                        }
                    }, 500)

                })}">${(obj.type === 'replace') ? `儲存並更改` : `儲存並新增`}</button>
        </div>
     <div class="d-flex flex-column flex-column-reverse  flex-md-row" style="gap:10px;">
     <div style="width:800px;max-width:100%;">  ${BgWidget.card([
                    EditorElem.editeInput({
                        gvc: obj.gvc,
                        title: '商品標題',
                        default: postMD.title,
                        placeHolder: `請輸入標題`,
                        callback: (text) => {
                            postMD.title = text
                        }
                    }),
                    obj.gvc.bindView(() => {
                        const bi = obj.gvc.glitter.getUUID()
                        return {
                            bind: bi,
                            view: () => {
                                return [EditorElem.h3(`<div class="d-flex align-items-center">商品內文<button class=" btn ms-2 btn-primary-c ms-2" style="height: 30px;width: 60px;" onclick="${
                                        obj.gvc.event(() => {
                                            postMD.content = `<h3 style="padding: 32px 0px;">商品資訊</h3>

<p>优雅家居经典绒面椅将为您的家居空间带来一抹优雅和舒适。</p>

<p>这款椅子结合了现代舒适和经典风格，为您提供了完美的休憩之地。</p>

<p>绒面面料舒适柔软，而实木框架确保了椅子的坚固性。</p>

<p>您可以在这把椅子上放松身体和心灵，无论是阅读一本好书还是与家人共度美好时光。</p>

<p>它的多用途设计使它适用于各种房间和场合，是一个实用且具有装饰性的家居家具选择。</p>
<hr style="margin-top: 48px;" color="#E0E0E0">

<h3 style="padding: 32px 0px;">商品材質</h3>

<p>坐面：塑膠</p>
<hr style="margin-top: 48px;" color="#E0E0E0">

<h3 style="padding: 32px 0px;">商品交期</h3>

<p>標準交期：家具製造商已備妥家具組件，將在接單後直接組裝出貨，預計交期為 5-6 週。</p>

<p>平均交期：家具製造商無現成家具組件，須再加上製造時間，平均交期為 10 至 12 週。</p>

<p>若逢春節期間、國定假日及雙 11 檔期，交期可能會受到影響，建議提早下單，避免久候。</p>
<hr style="margin-top: 48px;" color="#E0E0E0">

<h3 style="padding: 32px 0px;">商品規格</h3>

<p>長：56 公分</p>

<p>寬：52 公分</p>

<p>高：83.5 公分</p>

<p>座高：48 公分</p>
<hr style="margin-top: 48px;" color="#E0E0E0">

<h3 style="padding: 32px 0px;">保養資訊</h3>

<p><strong>塑膠</strong></p>

<p><span style="font-weight: 400;">清潔時，可使用些許水擦拭並用乾淨的布擦乾。避免日曬。</span></p>

<p><span style="font-weight: 400;">使用時，應防止硬物碰撞。壁面金屬刷具清潔。</span></p>
<hr style="margin-top: 48px;" color="#E0E0E0">
`
                                            obj.gvc.notifyDataChange(bi)
                                        })
                                }">範例
                                </button></div>`), EditorElem.richText({
                                    gvc: obj.gvc,
                                    def: postMD.content,
                                    callback: (text) => {
                                        postMD.content = text
                                        console.log(`changeContent`)
                                    }
                                })].join('')
                            },
                            divCreate: {}
                        }
                    })
                ].join('<div class="my-2"></div>'))}
       <div class="my-2"></div>
       ${BgWidget.card(obj.gvc.bindView(() => {
                    const id = obj.gvc.glitter.getUUID()
                    return {
                        bind: id,
                        view: () => {
                            return EditorElem.h3(html`
                                        <div class="d-flex align-items-center" style="gap:10px;">多媒體檔案
                                            <div class="d-flex align-items-center justify-content-center rounded-3" style="height: 30px;width: 80px;
">
                                                <button class="btn ms-2 btn-primary-c ms-2" style="height: 30px;width: 80px;"
                                                        onclick="${obj.gvc.event(() => {
                                                            EditorElem.uploadFileFunction({
                                                                gvc: obj.gvc,
                                                                callback: (text) => {
                                                                    postMD.preview_image.push(text)
                                                                    obj.gvc.notifyDataChange(id)
                                                                },
                                                                type: `image/*, video/*`
                                                            })
                                                        })}">添加檔案
                                                </button>
                                            </div>
                                        </div>`) + html`
                                        <div class="my-2"></div>` +
                                    EditorElem.flexMediaManager({
                                        gvc: obj.gvc,
                                        data: postMD.preview_image
                                    })
                        },
                        divCreate: {}
                    }
                }))}
        <div class="my-2"></div>
       ${BgWidget.card(obj.gvc.bindView(() => {
                    const id = obj.gvc.glitter.getUUID()

                    function refresh() {
                        obj.gvc.notifyDataChange(id)
                    }

                    return {
                        bind: id,
                        view: () => {
                            return [
                                EditorElem.h3('商品規格'),
                                EditorElem.arrayItem({
                                    gvc: obj.gvc,
                                    title: '',
                                    array: () => {
                                        return postMD.specs.map((dd) => {
                                            dd.option = dd.option ?? [];

                                            return {
                                                title: `<div class="d-flex flex-column w-100 ps-2" style="gap:5px;">
<span>${dd.title || "尚未設定規格名稱"}</span>
<div class="d-flex">${dd.option.map((d2: any) => {
                                                    return `<div class="badge bg-secondary">${d2.title}</div>`
                                                }).join('<div class="mx-1"></div>')}</div>
</div>`,
                                                innerHtml: (gvc: GVC) => {
                                                    refresh()
                                                    return [
                                                        EditorElem.editeInput({
                                                            gvc: gvc,
                                                            title: "分類標題",
                                                            default: dd.title ?? "",
                                                            placeHolder: ``,
                                                            callback: (text: string) => {
                                                                dd.title = text
                                                                refresh()
                                                            }
                                                        }),
                                                        `<div class="mx-n2 mt-2">${EditorElem.arrayItem({
                                                            gvc: obj.gvc,
                                                            title: '分類選項',
                                                            array: () => {
                                                                return dd.option.map((dd: any) => {
                                                                    return {
                                                                        title: `<div class="px-2 w-100">${EditorElem.editeInput({
                                                                            gvc: gvc,
                                                                            title: "",
                                                                            default: dd.title ?? "",
                                                                            placeHolder: ``,
                                                                            callback: (text: string) => {
                                                                                dd.title = text
                                                                                refresh()
                                                                            }
                                                                        })}</div>`,
                                                                        innerHtml: () => {
                                                                            return ``
                                                                        },
                                                                    }
                                                                })
                                                            },
                                                            height: 50,
                                                            customEditor: true,
                                                            originalArray: dd.option,
                                                            expand: true,
                                                            plus: {
                                                                title: '添加選項',
                                                                event: obj.gvc.event(() => {
                                                                    dd.option.push({
                                                                        title: '',
                                                                    })
                                                                    gvc.recreateView()
                                                                })
                                                            },
                                                            refreshComponent: () => {
                                                                gvc.recreateView()
                                                            }
                                                        })}
</div>`
                                                    ].join('')
                                                },
                                                editTitle: `編輯規格`
                                            }
                                        })
                                    },
                                    height: 60,
                                    originalArray: postMD.specs,
                                    expand: true,
                                    plus: {
                                        title: '添加規格',
                                        event: obj.gvc.event(() => {
                                            postMD.specs.push({
                                                title: '',
                                                option: []
                                            })
                                            obj.gvc.notifyDataChange(id)
                                        })
                                    },
                                    refreshComponent: () => {
                                        obj.gvc.notifyDataChange(id)
                                    }
                                })
                            ].join('')
                        },
                        divCreate: {}
                    }
                }))}
        <div class="my-2"></div>
         ${BgWidget.card(EditorElem.h3('商品項目') + obj.gvc.bindView(() => {
                    const id = obj.gvc.glitter.getUUID()

                    function refresh() {
                        obj.gvc.notifyDataChange(id)
                    }

                    return {
                        bind: id,
                        view: () => {
                            const wi = `calc(100% / 7 - 10px);`


                            return new Promise(async (resolve, reject) => {
                                let shipmentSetting: {
                                    basic_fee: number;
                                    weight: number,
                                } = {
                                    basic_fee: 0,
                                    weight: 0
                                }
                                const saasConfig: {
                                    config: any,
                                    api: any
                                } = (window as any).saasConfig
                                const data = await saasConfig.api.getPrivateConfig(saasConfig.config.appName, `glitter_shipment`)
                                if (data.response.result[0]) {
                                    shipmentSetting = data.response.result[0].value

                                }
                                resolve([
                                    `<div class="w-100 bgf6 d-flex" >
<div style=" width:calc(100% / 7 - 90px);"></div>
<div style=" width:${wi};padding-left:10px; ">子類</div>
<div style=" width:${wi}; ">販售價格</div>
<div style=" width:${wi}; ">比較價格</div>
<div style=" width:${wi}; ">存貨數量</div>
<div style=" width:${wi};">存貨單位(SKU)</div>
<div style=" width:${wi};margin-left: 20px;">運費權重</div>
<div style=" width:${wi}; "></div>
</div>`,
                                    EditorElem.arrayItem({
                                        customEditor: true,
                                        gvc: obj.gvc,
                                        title: '',
                                        array: () => {
                                            return postMD.variants.map((dd) => {
                                                const wi = `calc(100% / 6 + 47px);`
                                                return {
                                                    title: `<div class="d-flex align-items-center p-0 px-2" style="gap:10px;">${[
                                                        dd.preview_image ? `<img class="rounded border" alt="" src="${dd.preview_image}" style="width:40px;height:40px;">` : '',
                                                        `<div style="width:calc(100% / 6.5);white-space:normal;">${dd.spec.join('-') || postMD.title}</div>`,
                                                        EditorElem.editeInput({
                                                            gvc: obj.gvc,
                                                            title: '',
                                                            default: `${dd.sale_price ?? 0}`,
                                                            placeHolder: '',
                                                            type: 'number',
                                                            callback: (text) => {
                                                                dd.sale_price = parseInt(text, 10)
                                                            },
                                                            style: ` width:${wi};`
                                                        }),
                                                        EditorElem.editeInput({
                                                            gvc: obj.gvc,
                                                            title: '',
                                                            default: `${dd.compare_price ?? 0}`,
                                                            placeHolder: '',
                                                            type: 'number',
                                                            callback: (text) => {
                                                                dd.compare_price = parseInt(text, 10)
                                                            },
                                                            style: ` width:${wi};`
                                                        }),
                                                        EditorElem.editeInput({
                                                            gvc: obj.gvc,
                                                            title: '',
                                                            default: `${dd.stock ?? 0}`,
                                                            placeHolder: '',
                                                            type: 'number',
                                                            callback: (text) => {
                                                                dd.stock = parseInt(text, 10)
                                                            },
                                                            style: ` width:${wi};`
                                                        }),
                                                        EditorElem.editeInput({
                                                            gvc: obj.gvc,
                                                            title: '',
                                                            default: `${dd.sku ?? 0}`,
                                                            placeHolder: '',
                                                            type: 'text',
                                                            callback: (text) => {
                                                                dd.sku = (text)
                                                            },
                                                            style: ` width:${wi};;`
                                                        }),
                                                        EditorElem.editeInput({
                                                            gvc: obj.gvc,
                                                            title: '',
                                                            default: `${dd.shipment_weight ?? 0}`,
                                                            placeHolder: '',
                                                            type: 'number',
                                                            callback: (text) => {
                                                                dd.shipment_weight = parseInt(text, 10)
                                                            },
                                                            style: ` width:${wi};;`
                                                        })
                                                    ].join('')}
<button class="btn ms-2 btn-primary-c ms-2" style="height: 38px; " onclick="${obj.gvc.event(() => {
                                                        obj.gvc.glitter.innerDialog((gvc: GVC) => {
                                                            return html`
                                                                <div class="dropdown-menu mx-0 position-fixed pb-0 border p-0 show "
                                                                     style="z-index:999999;400px;"
                                                                     onclick="${gvc.event((e: any, event: any) => {
                                                                         event.preventDefault()
                                                                         event.stopPropagation()
                                                                     })}">
                                                                    <div class="d-flex align-items-center px-2 border-bottom"
                                                                         style="height:50px;min-width:400px;">
                                                                        <h3 style="font-size:15px;font-weight:500;"
                                                                            class="m-0">
                                                                            ${`編輯內容`}</h3>
                                                                        <div class="flex-fill"></div>
                                                                        <div class="hoverBtn p-2"
                                                                             data-bs-toggle="dropdown"
                                                                             aria-haspopup="true" aria-expanded="false"
                                                                             style="color:black;font-size:20px;"
                                                                             onclick="${gvc.event((e: any, event: any) => {
                                                                                 gvc.closeDialog()
                                                                                 refresh()
                                                                             })}"><i
                                                                                class="fa-sharp fa-regular fa-circle-xmark"></i>
                                                                        </div>
                                                                    </div>
                                                                    <div class="px-2 pb-2 pt-2"
                                                                         style="max-height:calc(100vh - 150px);overflow-y:auto;">
                                                                        ${[EditorElem.uploadImage({
                                                                            title: '商品圖片',
                                                                            gvc: obj.gvc,
                                                                            def: dd.preview_image ?? "",
                                                                            callback: (text) => {
                                                                                dd.preview_image = text
                                                                                gvc.recreateView()
                                                                            }
                                                                        }),
                                                                            EditorElem.editeInput({
                                                                                gvc: obj.gvc,
                                                                                title: '販售價格',
                                                                                default: `${dd.sale_price ?? 0}`,
                                                                                placeHolder: '',
                                                                                type: 'number',
                                                                                callback: (text) => {
                                                                                    dd.sale_price = parseInt(text, 10)
                                                                                }
                                                                            }),
                                                                            EditorElem.editeInput({
                                                                                gvc: obj.gvc,
                                                                                title: '比較價格',
                                                                                default: `${dd.compare_price ?? 0}`,
                                                                                placeHolder: '',
                                                                                type: 'number',
                                                                                callback: (text) => {
                                                                                    dd.compare_price = parseInt(text, 10)
                                                                                }
                                                                            }),
                                                                            EditorElem.editeInput({
                                                                                gvc: obj.gvc,
                                                                                title: '存貨數量',
                                                                                default: `${dd.stock ?? 0}`,
                                                                                placeHolder: '',
                                                                                type: 'number',
                                                                                callback: (text) => {
                                                                                    dd.stock = parseInt(text, 10)
                                                                                }
                                                                            }),
                                                                            EditorElem.editeInput({
                                                                                gvc: obj.gvc,
                                                                                title: 'SKU',
                                                                                default: `${dd.sku ?? 0}`,
                                                                                placeHolder: '',
                                                                                type: 'text',
                                                                                callback: (text) => {
                                                                                    dd.sku = (text)
                                                                                }
                                                                            }),
                                                                            (() => {

                                                                                return EditorElem.editeInput({
                                                                                    gvc: obj.gvc,
                                                                                    title: html`
                                                                                        <div class="d-flex flex-column">
                                                                                            <span>運費權重</span>
                                                                                            <div class="alert-info alert mt-2 mb-0">
                                                                                                <span>( 每單位金額*權重 ) + 基本運費 = 總運費</span><br>
                                                                                                <span style="">試算 : ( ${shipmentSetting.weight} * ${dd.shipment_weight} ) + ${shipmentSetting.basic_fee} = ${shipmentSetting.weight * dd.shipment_weight + shipmentSetting.basic_fee}</span>
                                                                                            </div>
                                                                                        </div>`,
                                                                                    default: `${dd.shipment_weight ?? 0}`,
                                                                                    placeHolder: '',
                                                                                    type: 'number',
                                                                                    callback: (text) => {
                                                                                        dd.shipment_weight = parseInt(text)
                                                                                    }
                                                                                })
                                                                            })()
                                                                        ].join('')}
                                                                    </div>
                                                                </div>`
                                                        }, obj.gvc.glitter.getUUID())

                                                    })}">編輯商品</button>
</div>`,
                                                    innerHtml: (gvc: GVC) => {
                                                        // refresh()
                                                        return [].join('')
                                                    },
                                                    editTitle: `編輯規格`
                                                }
                                            })
                                        },
                                        height: 100,
                                        originalArray: postMD.variants,
                                        expand: true,
                                        copyable: false,
                                        hr: true,
                                        plus: {
                                            title: '添加商品項目',
                                            event: obj.gvc.event(() => {
                                                let ct = ''
                                                let cType: any = []

                                                function generateCombinations(specs: any, currentCombination: any, index = 0) {
                                                    if (index === specs.length) {
                                                        // 当达到规格数组的末尾，表示一种组合已生成，打印它或执行其他操作
                                                        cType.push(JSON.parse(JSON.stringify(currentCombination)))
                                                        return;
                                                    }
                                                    const currentSpecOptions = specs[index];
                                                    for (const option of currentSpecOptions) {
                                                        currentCombination[index] = option;
                                                        generateCombinations(specs, currentCombination, index + 1);
                                                    }
                                                }

                                                let currentCombination: any = [];
                                                generateCombinations(postMD.specs.map((dd) => {
                                                    return dd.option.map((dd: any) => {
                                                        return dd.title
                                                    })
                                                }), currentCombination)
                                                const waitAdd = cType.find((dd: any) => {
                                                    return !postMD.variants.find((d2) => {
                                                        return JSON.stringify(d2.spec) === JSON.stringify(dd)
                                                    })
                                                })

                                                if (
                                                        waitAdd
                                                ) {
                                                    postMD.variants.push({
                                                        spec: waitAdd,
                                                        sale_price: 0,
                                                        compare_price: 0,
                                                        stock: 0,
                                                        sku: '',
                                                        preview_image: '',
                                                        shipment_weight: 0
                                                    })
                                                    obj.gvc.notifyDataChange(id)
                                                } else {
                                                    alert('無可加入之規格')
                                                }
                                                //

                                            })
                                        },
                                        refreshComponent: () => {
                                            obj.gvc.notifyDataChange(id)
                                        }
                                    })
                                ].join(''))
                            })
                        },
                        divCreate: {
                            class: `mx-n3`
                        }
                    }
                }))}
          <div class="my-2"></div>
         ${BgWidget.card(obj.gvc.bindView(() => {
             
                    postMD.seo = postMD.seo ?? {
                        title: '',
                        content: ''
                    }
                    const id = seoID
                    let toggle = false
                    return {
                        bind: id,
                        view: () => {
                            let view = [`<div class="fs-sm fw-500 d-flex align-items-center justify-content-between mb-2">搜尋引擎列表
<div class="fw-500 fs-sm ${(toggle) ? `d-none` : ``}" style="cursor: pointer;color:rgba(0, 91, 211, 1);" onclick="${obj.gvc.event(() => {
                                toggle = !toggle
                                obj.gvc.notifyDataChange(id)
                            })}">編輯</div>
</div>`,
                                `<div class="fs-6 fw-500" style="color:#1a0dab;">${postMD.seo.title || '尚未設定'}</div>`,
                                (() => {
                                    const href = (() => {
                                        const url = new URL("", (gvc.glitter.share.editorViewModel.domain) ? `https://${gvc.glitter.share.editorViewModel.domain}/` : location.href)
                                        url.search = ''
                                        url.searchParams.set("page", postMD.template)
                                        url.searchParams.set('product_id', postMD.id || '')
                                        if (!gvc.glitter.share.editorViewModel.domain) {
                                            url.searchParams.set('appName', (window as any).appName)
                                        }
                                        return url.href
                                    })()
                                    return `<a class="fs-sm fw-500" style="color:#006621;cursor: pointer;" href="${href}">${href}</a>`
                                })(),
                                `<div class="fs-sm fw-500" style="color:#545454;white-space: normal;">${postMD.seo.content || '尚未設定'}</div>`
                            ]
                            if (toggle) {
                                view = view.concat([
                                    EditorElem.editeInput({
                                        gvc: obj.gvc,
                                        title: '頁面標題',
                                        default: postMD.seo.title,
                                        placeHolder: `請輸入頁面標題`,
                                        callback: (text) => {
                                            postMD.seo.title = text
                                        }
                                    }),
                                    EditorElem.editeText({
                                        gvc: obj.gvc,
                                        title: '中繼描述',
                                        default: postMD.seo.content,
                                        placeHolder: `請輸入中繼描述`,
                                        callback: (text) => {
                                            postMD.seo.content = text
                                        }
                                    })
                                ])
                            }
                            return view.join('')
                        }
                    }
                }))}
         </div>
         <div style="width:300px;max-width:100%;">
       
         ${BgWidget.card(
                        `  ${postMD.id ? `
         ${EditorElem.h3('商品ID')}
         ${postMD.id}
         ` : ``}` +
                        EditorElem.select({
                            gvc: obj.gvc,
                            title: '商品狀態',
                            def: postMD.status,
                            array: [{title: '啟用', value: 'active'}, {title: '草稿', value: 'draft'}],
                            callback: (text: any) => {
                                postMD.status = text
                            }
                        }))}
${(()=>{
    return ``
//     return `<div class="mt-2"></div>
// ${BgWidget.card(gvc.bindView(() => {
//         const id = gvc.glitter.getUUID()
//         return {
//             bind: id,
//             view: () => {
//                 return EditorElem.pageSelect(gvc, '選擇佈景主題', postMD.template ?? "", (data) => {
//                     postMD.template = data
//                 }, (dd) => {
//                     const filter_result = dd.group !== 'glitter-article' && dd.page_type === 'article' && dd.page_config.template_type === 'product'
//                     if (filter_result && !postMD.template) {
//                         postMD.template = dd.tag
//                         gvc.notifyDataChange([seoID, id])
//                     }
//                     return filter_result
//                 })
//             }
//         }
//     }))}`
                })()}
<div class="mt-2"></div>
         ${BgWidget.card(obj.gvc.bindView(() => {
                    const id = obj.gvc.glitter.getUUID()

                    function refresh() {
                        obj.gvc.notifyDataChange(id)
                    }

                    function selectCollection(callback: (cb: {
                        select: string,
                        gvc: GVC
                    }) => void) {
                        ApiShop.getCollection().then((res) => {
                            EditorElem.openEditorDialog(obj.gvc, (gvc: GVC) => {
                                function convertF(x: any, ind: string) {
                                    return x.map((dd: any) => {
                                        const indt = (ind) ? `${ind} / ${dd.title}` : dd.title
                                        if (dd.array && dd.array.length > 0) {
                                            return html`
                                                <li class="btn-group d-flex flex-column"
                                                    style="margin-top:1px;margin-bottom:1px;">
                                                    <div class="editor_item d-flex   pe-2 my-0 hi me-n1 "
                                                         style="" onclick="${gvc.event(() => {
                                                        dd.toogle = !dd.toogle
                                                        gvc.recreateView()
                                                    })}">
                                                        <div class="subBt ps-0 ms-n2">
                                                            ${dd.toogle ? `<i class="fa-sharp fa-regular fa-chevron-down"></i>` : `  <i class="fa-regular fa-angle-right hoverBtn "></i>`}
                                                        </div>
                                                        ${dd.title}
                                                        <div class="flex-fill"></div>
                                                    </div>
                                                    <ul class="ps-2 ${dd.toogle ? `` : `d-none`}">
                                                        ${convertF(dd.array, indt)}
                                                    </ul>
                                                </li>`
                                        } else {
                                            return html`
                                                <li class="btn-group d-flex flex-column"
                                                    style="margin-top:1px;margin-bottom:1px;">
                                                    <div class="editor_item d-flex   pe-2 my-0 hi  "
                                                         style="" onclick="${
                                                            gvc.event(() => {
                                                                if (postMD.collection.find((dd) => {
                                                                    return dd === indt
                                                                })) {
                                                                    alert('已有此標籤。')
                                                                    return
                                                                }
                                                                callback({
                                                                    select: indt,
                                                                    gvc: gvc
                                                                })
                                                            })
                                                    }">

                                                        ${dd.title}
                                                        <div class="flex-fill"></div>

                                                        <div class="subBt ">
                                                            <i class="fa-duotone fa-check d-flex align-items-center justify-content-center subBt "
                                                               style="width:15px;height:15px;"></i>
                                                        </div>
                                                    </div>

                                                </li>`
                                        }
                                    }).join('')
                                }

                                return gvc.bindView(() => {
                                    const id = gvc.glitter.getUUID()
                                    return {
                                        bind: id,
                                        view: () => {
                                            return convertF(res.response.value, '')
                                        },
                                        divCreate: {
                                            class: `ms-n3 me-1`
                                        }
                                    }
                                })
                            }, () => {
                            }, 400)
                        })
                    }

                    return {
                        bind: id,
                        view: () => {
                            return [
                                EditorElem.h3('商品系列'),
                                `<div class="mx-n3">${EditorElem.arrayItem({
                                    gvc: obj.gvc,
                                    title: '',
                                    array: () => {
                                        return postMD.collection.map((dd, index) => {
                                            return {
                                                title: dd || "尚未設定分類名稱",
                                                innerHtml: (gvc: GVC) => {
                                                    selectCollection((cf) => {
                                                        postMD.collection[index] = cf.select
                                                        refresh()
                                                        cf.gvc.closeDialog()
                                                    })
                                                    return ``
                                                },
                                                editTitle: `編輯分類`
                                            }
                                        })
                                    },
                                    height: 38,
                                    originalArray: postMD.collection,
                                    expand: true,
                                    copyable: false,
                                    customEditor: true,
                                    plus: {
                                        title: '添加商品分類',
                                        event: obj.gvc.event(() => {
                                            selectCollection((cb) => {
                                                postMD.collection.push(cb.select)
                                                obj.gvc.notifyDataChange(id)
                                                cb.gvc.closeDialog()
                                            })
                                        })
                                    },
                                    refreshComponent: () => {
                                        obj.gvc.notifyDataChange(id)
                                    }
                                })}</div>`,
                            ].join('')
                        },
                        divCreate: {}
                    }
                }))}
         <div class="d-flex align-items-center justify-content-end">
            <button class="btn btn-danger mt-3 ${(obj.type === 'replace') ? `` : `d-none`}  ms-auto px-2" style="height:30px;width:100px;" onclick="${
                        obj.gvc.event(() => {
                            const dialog = new ShareDialog(obj.gvc.glitter)
                            dialog.checkYesOrNot({
                                text: "是否確認刪除商品?",
                                callback: (response) => {
                                    if (response) {
                                        dialog.dataLoading({visible: true})
                                        ApiShop.delete({
                                            id: postMD.id!
                                        }).then((res) => {
                                            dialog.dataLoading({visible: false})
                                            if (res.result) {
                                                obj.vm.status = 'list'
                                            } else {
                                                dialog.errorMessage({text: "刪除失敗"})
                                            }
                                        })
                                    }
                                }
                            })
                        })
                }">刪除商品</button>
</div>
         </div>
         <div></div>
</div>
`, 1100)}
            </div>`
    }

    public static postEvent(postMD: any, gvc: GVC, vm: any) {
        const dialog = new ShareDialog(gvc.glitter)
        dialog.dataLoading({text: '商品上傳中...', visible: true})
        postMD.type = 'product'
        ApiPost.post({
            postData: postMD,
            token: GlobalUser.token,
            type: 'manager'
        }).then((re) => {
            dialog.dataLoading({visible: false})
            if (re.result) {
                vm.status = 'list'
                dialog.successMessage({text: `上傳成功...`})
            } else {
                dialog.errorMessage({text: `上傳失敗...`})
            }
        })
    }

    public static putEvent(postMD: any, gvc: GVC, vm: any) {
        const dialog = new ShareDialog(gvc.glitter)
        dialog.dataLoading({text: '商品上傳中...', visible: true})
        postMD.type = 'product'
        ApiPost.put({
            postData: postMD,
            token: GlobalUser.token,
            type: 'manager'
        }).then((re) => {
            dialog.dataLoading({visible: false})
            if (re.result) {
                dialog.successMessage({text: `更改成功...`})
            } else {
                dialog.errorMessage({text: `上傳失敗...`})
            }
        })
    }


    public static setFinanceWay(gvc: GVC) {
        const saasConfig: {
            config: any,
            api: any
        } = (window as any).saasConfig
        const html = String.raw
        const dialog = new ShareDialog(gvc.glitter)
        let keyData: {
            MERCHANT_ID: string;
            HASH_KEY: string;
            HASH_IV: string;
            ActionURL: string;
            TYPE?: 'newWebPay' | 'ecPay'
        } = {
            MERCHANT_ID: 'MS350015371',
            HASH_KEY: 'yP9K0sXy1P2WcWfcbhcZDfHASdREcCz1',
            HASH_IV: 'C4AlT6GjEEr1Z9VP',
            ActionURL: "https://core.newebpay.com/MPG/mpg_gateway",
            TYPE: 'newWebPay'
        }

        function save(next: () => void) {
            const dialog = new ShareDialog(gvc.glitter)
            dialog.dataLoading({text: '設定中', visible: true})
            saasConfig.api.setPrivateConfig(saasConfig.config.appName, `glitter_finance`, keyData).then((r: { response: any, result: boolean }) => {
                dialog.dataLoading({visible: false})
                if (r.response) {
                    next()
                } else {
                    dialog.errorMessage({text: "設定失敗"})
                }
            })
        }

        return BgWidget.container(html`
            <div class="d-flex w-100 align-items-center mb-3 ">
                ${BgWidget.title(`金流設定`)}
                <div class="flex-fill"></div>
                <button class="btn btn-primary-c" style="height:38px;font-size: 14px;" onclick="${gvc.event(() => {
                    save(() => {
                        dialog.successMessage({
                            text: '設定成功'
                        })
                    })
                })}">儲存金流設定
                </button>
            </div>
            ${gvc.bindView(() => {
                const id = gvc.glitter.getUUID()
                return {
                    bind: id,
                    view: () => {
                        return new Promise(async (resolve, reject) => {
                            const data = await saasConfig.api.getPrivateConfig(saasConfig.config.appName, `glitter_finance`)
                            if (data.response.result[0]) {
                                keyData = data.response.result[0].value
                            }
                            keyData.TYPE = keyData.TYPE || 'newWebPay'
                            resolve(gvc.bindView(() => {
                                const id = gvc.glitter.getUUID()
                                return {
                                    bind: id,
                                    view: () => {
                                        return BgWidget.card([
                                            EditorElem.select({
                                                title: '金流選擇',
                                                gvc: gvc,
                                                def: keyData.TYPE as string,
                                                array: [
                                                    {title: '藍新金流', value: 'newWebPay'},
                                                    {title: '綠界金流', value: 'ecPay'},
                                                    {title: '線下付款', value: 'off_line'}
                                                ],
                                                callback: (text: any) => {
                                                    keyData.TYPE = text
                                                    if (keyData.TYPE === 'newWebPay') {
                                                        keyData.ActionURL = 'https://ccore.newebpay.com/MPG/mpg_gateway'
                                                    } else {
                                                        keyData.ActionURL = 'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5'
                                                    }
                                                    gvc.notifyDataChange(id)
                                                }
                                            }),
                                            (() => {
                                                if ((keyData.TYPE as any) === 'off_line') {
                                                    return [].join('')
                                                } else {
                                                    return [
                                                        EditorElem.select({
                                                            title: '金流站點',
                                                            gvc: gvc,
                                                            def: keyData.ActionURL,
                                                            array: (() => {
                                                                if (keyData.TYPE === 'newWebPay') {
                                                                    return [{
                                                                        title: '正式站',
                                                                        value: "https://core.newebpay.com/MPG/mpg_gateway"
                                                                    },
                                                                        {
                                                                            title: '測試站',
                                                                            value: "https://ccore.newebpay.com/MPG/mpg_gateway"
                                                                        }]
                                                                } else {
                                                                    return [{
                                                                        title: '正式站',
                                                                        value: "https://payment.ecpay.com.tw/Cashier/AioCheckOut/V5"
                                                                    },
                                                                        {
                                                                            title: '測試站',
                                                                            value: "https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5"
                                                                        }]
                                                                }
                                                            })(),
                                                            callback: (text: any) => {
                                                                keyData.ActionURL = text
                                                            }
                                                        }),
                                                        EditorElem.editeInput({
                                                            gvc: gvc,
                                                            title: '特店編號',
                                                            default: keyData.MERCHANT_ID,
                                                            callback: (text) => {
                                                                keyData.MERCHANT_ID = text
                                                            },
                                                            placeHolder: '請輸入特店編號'
                                                        }),
                                                        EditorElem.editeInput({
                                                            gvc: gvc,
                                                            title: 'HASH_KEY',
                                                            default: keyData.HASH_KEY,
                                                            callback: (text) => {
                                                                keyData.HASH_KEY = text
                                                            },
                                                            placeHolder: '請輸入HASH_KEY'
                                                        }),
                                                        EditorElem.editeInput({
                                                            gvc: gvc,
                                                            title: 'HASH_IV',
                                                            default: keyData.HASH_IV,
                                                            callback: (text) => {
                                                                keyData.HASH_IV = text
                                                            },
                                                            placeHolder: '請輸入HASH_IV'
                                                        })
                                                    ].join('')
                                                }
                                            })()
                                        ].join('<div class="my-2"></div>'))
                                    },
                                    divCreate: {
                                        style: `width:900px;max-width:100%;`
                                    }
                                }
                            }))
                        })
                    },
                    divCreate: {class: `d-flex flex-column flex-column-reverse  flex-md-row`, style: `gap:10px;`}
                }
            })}
        `,undefined,'width:calc(100% - 56px);')
    }

    public static invoice_setting(gvc: GVC) {
        const saasConfig: {
            config: any,
            api: any
        } = (window as any).saasConfig
        const id = gvc.glitter.getUUID()
        const vm: {
            loading: boolean,
            data: any
        } = {
            loading: true,
            data: {}
        }
        saasConfig.api.getPrivateConfig(saasConfig.config.appName, "invoice_setting").then((r: { response: any, result: boolean }) => {
            if (r.response.result[0]) {
                vm.data = r.response.result[0].value
            }
            vm.loading = false
            gvc.notifyDataChange(id)
        })
        const html = String.raw
        const dialog = new ShareDialog(gvc.glitter)
        return gvc.bindView(() => {
            return {
                bind: id,
                view: () => {
                    if (vm.loading) {
                        return html`
                            <div class="w-100 d-flex align-items-center justify-content-center">
                                <div class="spinner-border"></div>
                            </div>`
                    }
                    return BgWidget.container(html`
                        <div class="d-flex w-100 align-items-center mb-3 ">
                            ${BgWidget.title(`電子發票設定`)}
                            <div class="flex-fill"></div>
                            <button class="btn btn-primary-c" style="height:38px;font-size: 14px;"
                                    onclick="${gvc.event(() => {
                                        dialog.dataLoading({text: '設定中', visible: true})
                                        saasConfig.api.setPrivateConfig(saasConfig.config.appName, "invoice_setting", vm.data).then((r: { response: any, result: boolean }) => {
                                            setTimeout(() => {
                                                dialog.dataLoading({visible: false})
                                                if (r.response) {
                                                    dialog.successMessage({text: "設定成功"})
                                                } else {
                                                    dialog.errorMessage({text: "設定失敗"})
                                                }
                                            }, 1000)
                                        })
                                    })}">儲存發票設定
                            </button>
                        </div>
                        ${BgWidget.card(`
            ${(() => {
                            vm.data.fincial = vm.data.fincial ?? "ezpay";
                            vm.data.point = vm.data.point ?? "beta";
                            return gvc.map([
                                EditorElem.select({
                                    title: "選擇開立方式",
                                    gvc: gvc,
                                    def: vm.data.fincial,
                                    array: [
                                        {title: "藍新發票", value: "ezpay"},
                                        {title: "綠界發票", value: "ecpay"},
                                        {title: "不開立電子發票", value: "nouse"}
                                    ],
                                    callback: (text) => {
                                        vm.data.fincial = text
                                    }
                                }),
                                EditorElem.select({
                                    title: "站點",
                                    gvc: gvc,
                                    def: vm.data.point,
                                    array: [
                                        {title: "測試區", value: "beta"},
                                        {title: "正式區", value: "official"},
                                    ],
                                    callback: (text) => {
                                        vm.data.point = text
                                        if (vm.data.point == 'beta') {
                                            vm.data.hashkey = vm.data.bhashkey
                                            vm.data.hashiv = vm.data.bhashiv
                                        } else {
                                            vm.data.hashkey = vm.data.ohashkey
                                            vm.data.hashiv = vm.data.ohashiv
                                        }
                                        gvc.notifyDataChange(id)
                                    }
                                }),
                                (() => {
                                    let html = ``
                                    if (vm.data.point === 'beta') {
                                        vm.data.whiteList = vm.data.whiteList ?? []
                                        vm.data.whiteListExpand = vm.data.whiteListExpand ?? {}
                                    }

                                    return [
                                        EditorElem.editeInput({
                                            gvc: gvc,
                                            title: '特店編號',
                                            default: vm.data.merchNO ?? "",
                                            type: "text",
                                            placeHolder: "請輸入特店編號",
                                            callback: (text) => {
                                                vm.data.merchNO = text
                                            }
                                        }),
                                        EditorElem.editeInput({
                                            gvc: gvc,
                                            title: 'HashKey',
                                            default: vm.data.hashkey ?? "",
                                            type: "text",
                                            placeHolder: "請輸入HashKey",
                                            callback: (text) => {
                                                vm.data.hashkey = text
                                                if (vm.data.point == 'beta') {
                                                    vm.data.bhashkey = text
                                                } else {
                                                    vm.data.ohashkey = text
                                                }
                                            }
                                        }),
                                        EditorElem.editeInput({
                                            gvc: gvc,
                                            title: 'HashIV',
                                            default: vm.data.hashiv ?? "",
                                            type: "text",
                                            placeHolder: "請輸入HashIV",
                                            callback: (text) => {
                                                vm.data.hashiv = text
                                                if (vm.data.point == 'beta') {
                                                    vm.data.bhashiv = text
                                                } else {
                                                    vm.data.ohashiv = text
                                                }
                                            }
                                        }),
                                        html
                                    ].join('');
                                })()
                            ])
                        })()}`)}
                    `, 900)
                },
                divCreate: {
                    class: `d-flex justify-content-center w-100 flex-column align-items-center `
                }
            }
        })
    }

    public static logistics_setting(gvc: GVC) {
        const saasConfig: {
            config: any,
            api: any
        } = (window as any).saasConfig
        const id = gvc.glitter.getUUID()
        const vm: {
            loading: boolean,
            data: any
        } = {
            loading: true,
            data: {}
        }
        saasConfig.api.getPrivateConfig(saasConfig.config.appName, "logistics_setting").then((r: { response: any, result: boolean }) => {
            if (r.response.result[0]) {
                vm.data = r.response.result[0].value
            }
            vm.loading = false
            gvc.notifyDataChange(id)
        })
        const html = String.raw
        const dialog = new ShareDialog(gvc.glitter)
        return gvc.bindView(() => {
            return {
                bind: id,
                view: () => {
                    if (vm.loading) {
                        return html`
                            <div class="w-100 d-flex align-items-center justify-content-center">
                                <div class="spinner-border"></div>
                            </div>`
                    }
                    return BgWidget.container(html`
                        <div class="d-flex w-100 align-items-center mb-3 ">
                            ${BgWidget.title(`物流設定`)}
                            <div class="flex-fill"></div>
                            <button class="btn btn-primary-c" style="height:38px;font-size: 14px;"
                                    onclick="${gvc.event(() => {
                                        dialog.dataLoading({text: '設定中', visible: true})
                                        saasConfig.api.setPrivateConfig(saasConfig.config.appName, "logistics_setting", vm.data).then((r: { response: any, result: boolean }) => {
                                            setTimeout(() => {
                                                dialog.dataLoading({visible: false})
                                                if (r.response) {
                                                    dialog.successMessage({text: "設定成功"})
                                                } else {
                                                    dialog.errorMessage({text: "設定失敗"})
                                                }
                                            }, 1000)
                                        })
                                    })}">儲存物流設定
                            </button>
                        </div>
                        ${BgWidget.card(`
            ${(() => {
                            return gvc.bindView(() => {
                                const id = gvc.glitter.getUUID()
                                return {
                                    bind: id,
                                    view: () => {
                                        return EditorElem.checkBox({
                                            title: '選擇支援配送方式',
                                            gvc: gvc,
                                            def: vm.data.support ?? [],
                                            array: [
                                                {
                                                    title: '一般宅配', value: 'normal'
                                                },
                                                {
                                                    title: '全家店到店', value: 'FAMIC2C'
                                                },
                                                {
                                                    title: '萊爾富店到店', value: 'HILIFEC2C'
                                                }, {
                                                    title: 'OK超商店到店', value: 'OKMARTC2C'
                                                }, {
                                                    title: '7-ELEVEN超商交貨便', value: 'UNIMARTC2C'
                                                }
                                            ],
                                            callback: (text) => {
                                                vm.data.support = text;
                                            },
                                            type: 'multiple'
                                        })
                                    },
                                    divCreate: {}
                                }
                            })
                        })()}`)}
                    `, 900)
                },
                divCreate: {
                    class: `d-flex justify-content-center w-100 flex-column align-items-center `
                }
            }
        })
    }

    public static setShipment(gvc: GVC) {
        const saasConfig: {
            config: any,
            api: any
        } = (window as any).saasConfig
        const html = String.raw
        const dialog = new ShareDialog(gvc.glitter)
        let keyData: {
            basic_fee: number;
            weight: number,
        } = {
            basic_fee: 0,
            weight: 0
        }

        function save(next: () => void) {
            const dialog = new ShareDialog(gvc.glitter)
            dialog.dataLoading({text: '設定中', visible: true})
            saasConfig.api.setPrivateConfig(saasConfig.config.appName, `glitter_shipment`, keyData).then((r: { response: any, result: boolean }) => {
                dialog.dataLoading({visible: false})
                if (r.response) {
                    next()
                } else {
                    dialog.errorMessage({text: "設定失敗"})
                }
            })
        }

        return BgWidget.container(html`
            <div class="d-flex w-100 align-items-center mb-3 ">
                ${BgWidget.title(`運費設定`)}
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
                return {
                    bind: id,
                    view: () => {
                        return new Promise(async (resolve, reject) => {
                            const data = await saasConfig.api.getPrivateConfig(saasConfig.config.appName, `glitter_shipment`)
                            if (data.response.result[0]) {
                                keyData = data.response.result[0].value
                            }
                            resolve(` <div style="width:900px;max-width:100%;"> ${BgWidget.card([
                                `<div class="alert alert-info">
總運費金額為 = 基本運費 + ( 商品運費權重*每單位費用 )
</div>`,
                                EditorElem.editeInput({
                                    gvc: gvc,
                                    title: '基本運費',
                                    default: `${keyData.basic_fee || 0}`,
                                    callback: (text) => {
                                        keyData.basic_fee = parseInt(text)
                                    },
                                    placeHolder: '請輸入基本運費'
                                }),
                                EditorElem.editeInput({
                                    gvc: gvc,
                                    title: '每單位費用',
                                    default: `${keyData.weight || 0}`,
                                    callback: (text) => {
                                        keyData.weight = parseInt(text)
                                    },
                                    placeHolder: '請輸入每單位費用'
                                })
                            ].join('<div class="my-2"></div>'))}
                </div>`)
                        })
                    },
                    divCreate: {class: `d-flex flex-column flex-column-reverse  flex-md-row`, style: `gap:10px;`}
                }
            })}
        `, 900)
    }

}

(window as any).glitter.setModule(import.meta.url, BgShopping)