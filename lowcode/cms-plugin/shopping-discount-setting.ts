import {GVC} from "../glitterBundle/GVController.js";
import {BgWidget} from "../backend-manager/bg-widget.js";
import {ApiShop} from "../glitter-base/route/shopping.js";
import {EditorElem} from "../glitterBundle/plugins/editor-elem.js";
import {ShareDialog} from "../dialog/ShareDialog.js";
import {ApiPost} from "../glitter-base/route/post.js";


export class ShoppingDiscountSetting {
    public static main(gvc: GVC) {
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
        const html = String.raw
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
        const html = String.raw
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
                                    token: (window.parent as any).saasConfig.config.token,
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
                                    token: (window.parent as any).saasConfig.config.token,
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
}

(window as any).glitter.setModule(import.meta.url, ShoppingDiscountSetting)