import {GVC} from "../glitterBundle/GVController.js";
import {BgWidget} from "../backend-manager/bg-widget.js";
import {SmsPointsApi} from "../glitter-base/route/sms-points-api.js";
import {ShareDialog} from "../glitterBundle/dialog/ShareDialog.js";
import {ApiUser} from "../glitter-base/route/user.js";


const html = String.raw

export class SmsPoints {
    public static main(gvc: GVC) {
        return [BgWidget.container([
            BgWidget.mainCard([
                BgWidget.title('SMS Points'),
                BgWidget.grayNote([`*透過SMS Points來進行手機簡訊發送`, `*1塊台幣可以換取10點SMS Points`, `*最少儲值金額500元`, `*SMS Points購買後無法退費，請購買前瞭解會員權益需知`].map((dd) => {
                    return `<div style="letter-spacing: 1.2px;">${dd}</div>`
                }).join('')),
                html`
                    <div class="d-flex align-items-center rounded-3" style="height:35px;width:100%;max-width: 500px;">
                        <div style="height:100%;background:var(--main-black-hover)"
                             class="d-flex align-items-center justify-content-center text-white px-3">目前 AI Points
                        </div>
                        <div class="bgf6 d-flex align-items-center flex-fill h-100 ps-3 pe-2">${gvc.bindView(()=>{
                    const id=gvc.glitter.getUUID()
                    const vm={
                        loading:true,
                        sum:0
                    }
                    SmsPointsApi.getSum({}).then((res:any)=>{
                        vm.sum=parseInt(res.response.sum,10)
                        vm.loading=false

                        gvc.notifyDataChange(id)
                    })
                    return {
                        bind:id,
                        view:()=>{
                            if(vm.loading){
                                return `<div class="h-100 d-flex align-items-center"><div class="spinner-border" style="height:20px;width: 20px;"></div></div>`
                            }else{
                                return  `${vm.sum.toLocaleString()}`
                            }
                        }
                    }
                })}
                            <div class="flex-fill"></div>
                            ${BgWidget.blueNote('儲值', gvc.event(() => {
                    SmsPoints.store(gvc)
                }))}
                        </div>
                    </div>`
            ].join(`<div class="my-2"></div>`))
        ].join(''), BgWidget.getContainerWidth()),SmsPoints.walletList(gvc)].join('')
    }
    //紀錄列表
    public static walletList(gvc: GVC) {
        const glitter = gvc.glitter;
        const vm: {
            type: 'list' | 'add' | 'replace';
            data: any;
            dataList: any;
            query?: string;
            select:'all'|'cost'|'income'
        } = {
            type: 'list',
            data: {},
            dataList: undefined,
            query: '',
            select:'all'
        };
        const filterID = gvc.glitter.getUUID();

        return gvc.bindView(() => {
            const id = glitter.getUUID();
            const dialog = new ShareDialog(gvc.glitter);

            function refresh() {
                gvc.notifyDataChange(id);
            }

            return {
                bind: id,
                dataList: [{ obj: vm, key: 'type' }],
                view: () => {
                    if (vm.type === 'list') {
                        return BgWidget.container(BgWidget.card(html`
                            ${BgWidget.tab([
                                {title:'紀錄總覽',key:'all'},
                                {title:'使用紀錄',key:'cost'},
                                {title:'儲值紀錄',key:'income'}
                            ],gvc,vm.select,(text)=>{
                                vm.select=text as any
                                gvc.notifyDataChange(id)
                            })}
                            <div class="border-bottom mb-2 w-100"></div>
                            ${BgWidget.tableV2({
                            gvc: gvc,
                            getData: (vmi) => {
                                SmsPointsApi.get({
                                    page: vmi.page - 1,
                                    limit: 20,
                                    search: vm.query || undefined,
                                    type:(()=>{
                                        switch (vm.select){
                                            case "all":
                                                return undefined
                                            case "cost":
                                                return 'minus'
                                            case "income":
                                                return 'plus'
                                        }
                                    })()
                                }).then((data:any) => {
                                    vmi.pageSize = Math.ceil(data.response.total / 20);
                                    vm.dataList = data.response.data;
                                    function getDatalist() {
                                        return data.response.data.map((dd: any) => {
                                            return [
                                                {
                                                    key: '用戶名稱',
                                                    value: `<span class="fs-7">${(dd.userData && dd.userData.name) ?? '資料異常'}</span>`,
                                                },
                                                {
                                                    key: '金流單號',
                                                    value: `<span class="fs-7">${dd.status === 2 ? `手動新增` : dd.orderID}</span>`,
                                                },
                                                {
                                                    key: '異動金額',
                                                    value: `${dd.money > 0 ? `<span class="fs-7 text-success">+ ${dd.money}</span>` : `<span class="fs-7 text-danger">- ${dd.money * -1}</span>`}`,
                                                },
                                                {
                                                    key: '異動原因',
                                                    value: `${dd.money > 0 ? `加值服務`:`使用AI智能助手`}`,
                                                },
                                                {
                                                    key: '異動時間',
                                                    value: `<span class="fs-7">${glitter.ut.dateFormat(new Date(dd.created_time), 'yyyy-MM-dd hh:mm')}</span>`,
                                                },
                                            ];
                                        });
                                    }
                                    vmi.data = getDatalist();
                                    vmi.loading = false;
                                    vmi.callback();
                                });
                            },
                            rowClick: (data, index) => {
                               
                            },
                            filter:``
                        })}
                        `),BgWidget.getContainerWidth());
                    } else if (vm.type == 'replace') {
                        return ``
                    } else {
                        return ``;
                    }
                },
                divCreate:{
                    class:`mt-n4`
                }
            };
        });
    }
    //儲值
    public static async store(gvc: GVC) {
        const dialog = new ShareDialog(gvc.glitter)
         dialog.dataLoading({visible:true})
        const vm: {
            total: number,
            note: any,
            return_url: string,
            user_info: {
                email: string,
                invoice_type: 'me' | 'company' | 'donate',
                company: string,
                gui_number: string
            }
        } = {
            total: 500,
            note: {},
            return_url: (window.parent as any).location.href,
            user_info: {
                email: '',
                invoice_type: 'me',
                company: '',
                gui_number: ''
            }
        }
        vm.user_info.email = vm.user_info.email || '';
        const dd = (await ApiUser.getPublicConfig('ai-points-store', 'manager'))
        if (dd.response.value) {
            vm.user_info = dd.response.value
        }
         dialog.dataLoading({visible:false});
        BgWidget.settingDialog({
            gvc: gvc,
            title: '設定儲值金額',
            innerHTML: (gvc: GVC) => {
                return `<div class="mt-n2">${[
                    BgWidget.editeInput({
                        gvc: gvc,
                        title: `<div class="d-flex flex-column">${[`儲值金額`, BgWidget.grayNote('*最低儲值金額500元')].join('')}</div>`,
                        placeHolder: '請輸入儲值金額',
                        callback: (text) => {
                            
                            if(parseInt(text,10)<500){
                                dialog.errorMessage({text:'最低儲值金額500元'})
                            }else{
                                vm.total = parseInt(text)
                            }
                            gvc.recreateView()
                        },
                        type: 'number',
                        default: `${vm.total}`
                    }),
                    ...(()=>{
                        if(vm.total){
                            return  [BgWidget.greenNote(`此次儲值可獲得AI Points『 ${(vm.total * 10).toLocaleString()} 』`)]
                        }else{
                            return []
                        }
                    })(),
                    BgWidget.editeInput({
                        gvc: gvc,
                        title: `發票寄送電子信箱`,
                        placeHolder: '請輸入發票寄送電子信箱',
                        callback: (text) => {
                            vm.user_info.email = text
                        },
                        type: 'email',
                        default: vm.user_info.email
                    }),
                    `<div class="tx_normal fw-normal" >發票開立方式</div>`,
                    BgWidget.select({
                        gvc: gvc, callback: (text) => {
                            vm.user_info.invoice_type = text
                            gvc.recreateView()
                        }, options: [
                            {key: 'me', value: '個人單位'},
                            {key: 'company', value: '公司行號'}
                        ], default: vm.user_info.invoice_type
                    }),
                    ...(() => {
                        if (vm.user_info.invoice_type === 'company') {
                            return [
                                BgWidget.editeInput({
                                    gvc: gvc, title: `發票抬頭`, placeHolder: '請輸入發票抬頭', callback: (text) => {
                                        vm.user_info.company = text
                                    }, type: 'text', default: `${vm.user_info.company}`
                                }),
                                BgWidget.editeInput({
                                    gvc: gvc,
                                    title: `公司統一編號`,
                                    placeHolder: '請輸入統一編號',
                                    callback: (text) => {
                                        vm.user_info.gui_number = text
                                    },
                                    type: 'number',
                                    default: `${vm.user_info.gui_number}`
                                })
                            ]
                        } else {
                            return []
                        }
                    })()
                ].join(`<div class="my-2"></div>`)}</div>`
            },
            footer_html: (gvc: GVC) => {
                return [BgWidget.cancel(gvc.event(()=>{
                    gvc.closeDialog()
                })),BgWidget.save(gvc.event(async () => {
                    if(vm.user_info.invoice_type !== 'company'){
                        vm.user_info.company=''
                        vm.user_info.gui_number=''
                    }
                    if (vm.user_info.invoice_type === 'company' && !vm.user_info.company) {
                        dialog.errorMessage({text: '請確實填寫發票抬頭'})
                        return
                    } else if (vm.user_info.invoice_type === 'company' && !vm.user_info.gui_number) {
                        dialog.errorMessage({text: '請確實填寫統一編號'})
                        return
                    } else if (!vm.user_info.email) {
                        dialog.errorMessage({text: '請確實填寫信箱'})
                        return
                    } else if (!BgWidget.isValidEmail(vm.user_info.email)) {
                        dialog.errorMessage({text: '請輸入有效信箱'})
                        return
                    } else if (vm.user_info.invoice_type === 'company' && !BgWidget.isValidNumbers(vm.user_info.gui_number)) {
                        dialog.errorMessage({text: '請輸入有效統一編號'})
                        return
                    }
                    dialog.dataLoading({visible: true})
                    await ApiUser.setPublicConfig({
                        key: 'ai-points-store',
                        value: vm.user_info,
                        user_id: 'manager',
                    })
                    vm.note={
                        invoice_data:vm.user_info
                    }
                    SmsPointsApi.store(vm).then(async (res:any) => {
                        dialog.dataLoading({visible: false})
                        if (res.response.form) {
                            const id = gvc.glitter.getUUID()
                            if (gvc.glitter.deviceType === gvc.glitter.deviceTypeEnum.Ios) {
                                gvc.glitter.runJsInterFace("toCheckout", {
                                    form: res.response.form
                                }, () => {
                                })
                            } else {
                                (window.parent as any).$('body').append(`<div id="${id}" style="display: none;">${res.response.form}</div>`);
                                (window.parent as any).document.querySelector(`#${id} #submit`).click();
                            }

                        } else {
                            dialog.errorMessage({text: '發生錯誤'})
                        }
                    })
                }))].join('')
            }
        })
        return

    }
}


(window as any).glitter.setModule(import.meta.url, SmsPoints);