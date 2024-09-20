import {GVC} from "../../glitterBundle/GVController.js";
import {BgWidget} from "../../backend-manager/bg-widget.js";
import {ShareDialog} from "../../glitterBundle/dialog/ShareDialog.js";
import {PosBasicSetting} from "../pos-basic-setting.js";
import {ApiUser} from "../../glitter-base/route/user.js";
import {TableSet} from "../table-set.js";
import {CheckoutSetting} from "../checkout-setting.js";
const html=String.raw
export class PosSetting {
    public static main(obj: {
        gvc: GVC,
        vm: any
    }) {
        const gvc = obj.gvc
        return gvc.bindView(() => {
            const vm: {
                view: string,
                id: string,
                page: 'detail' | 'list'
            } = {
                id: gvc.glitter.getUUID(),
                view: ``,
                page: 'list'
            }

            function toSettingPage() {

            }

            const dialog = new ShareDialog(gvc.glitter)
            return {
                bind: vm.id,
                view: () => {
                    if (vm.page === 'list') {
                        $('.pos-footer-menu').removeClass('d-none')
                        return  (async()=>{
                            const appData = ((await ApiUser.getPublicConfig('store-information', 'manager')).response.value) ?? {};
                            return BgWidget.container(BgWidget.mainCard([
                                {
                                    title: '商店基本設定',
                                    event: () => {
                                        dialog.dataLoading({visible:true})
                                        gvc.glitter.getModule(gvc.glitter.root_path+'cms-plugin/pos-basic-setting.js', (PosBasicSetting) => {
                                            dialog.dataLoading({visible:false})
                                            vm.view=PosBasicSetting.main(gvc)
                                            vm.page='detail'
                                            gvc.notifyDataChange(vm.id)
                                        })
                                    }
                                },
                                {
                                    title: '發票開立設定',
                                    event: () => {
                                        dialog.dataLoading({visible:true})
                                        gvc.glitter.getModule(gvc.glitter.root_path+'cms-plugin/pos-checkout-setting.js', (PosCheckoutSetting) => {
                                            dialog.dataLoading({visible:false})
                                            vm.view=PosCheckoutSetting.main(gvc,'pos')
                                            vm.page='detail'
                                            gvc.notifyDataChange(vm.id)
                                        })
                                    }
                                },
                                ...(()=>{
                                    if(appData.pos_type==='eat'){
                                        return [ {
                                            title: '結帳資訊設定',
                                            event: async () => {
                                                dialog.dataLoading({visible:true})
                                                gvc.glitter.getModule(gvc.glitter.root_path+'cms-plugin/checkout-setting.js', (CheckoutSetting) => {
                                                    dialog.dataLoading({visible:false})
                                                    vm.view=CheckoutSetting.main(gvc)
                                                    vm.page='detail'
                                                    gvc.notifyDataChange(vm.id)
                                                })
                                            }
                                        },{
                                            title: '桌位設定',
                                            event: async () => {
                                                dialog.dataLoading({visible:true})
                                                gvc.glitter.getModule(gvc.glitter.root_path+'cms-plugin/table-set.js', (TableSet) => {
                                                    dialog.dataLoading({visible:false})
                                                    vm.view=TableSet.main(gvc)
                                                    vm.page='detail'
                                                    gvc.notifyDataChange(vm.id)
                                                })
                                            }
                                        }]
                                    }else{
                                        return []
                                    }
                                })(),
                                {
                                    title: '員工管理',
                                    event: async () => {
                                        dialog.dataLoading({visible:true})
                                        gvc.glitter.getModule(gvc.glitter.root_path+'cms-plugin/permission-setting.js', (PermissionSetting) => {
                                            dialog.dataLoading({visible:false})
                                            vm.view=PermissionSetting.main(gvc,'pos')
                                            vm.page='detail'
                                            gvc.notifyDataChange(vm.id)
                                        })
                                    }
                                },
                                {
                                    title: '商品管理',
                                    event: () => {
                                        dialog.dataLoading({visible:true})
                                        gvc.glitter.getModule(gvc.glitter.root_path+'cms-plugin/shopping-product-setting.js', (module) => {
                                            dialog.dataLoading({visible:false})
                                            vm.view=module.main(gvc,'product')
                                            vm.page='detail'
                                            gvc.notifyDataChange(vm.id)
                                        })
                                    }
                                },
                                {
                                    title: '商品分類',
                                    event: () => {
                                        dialog.dataLoading({visible:true})
                                        gvc.glitter.getModule(gvc.glitter.root_path+'cms-plugin/shopping-collections.js', (module) => {
                                            dialog.dataLoading({visible:false})
                                            vm.view=module.main(gvc,'product')
                                            vm.page='detail'
                                            gvc.notifyDataChange(vm.id)
                                        })
                                    }
                                },
                                {
                                    title: '庫存管理',
                                    event: () => {
                                        dialog.dataLoading({visible:true})
                                        gvc.glitter.getModule(gvc.glitter.root_path+'cms-plugin/shopping-product-stock.js', (module) => {
                                            dialog.dataLoading({visible:false})
                                            vm.view=module.main(gvc)
                                            vm.page='detail'
                                            gvc.notifyDataChange(vm.id)
                                        })
                                    }
                                },
                                {
                                    title: '贈品管理',
                                    event: () => {
                                        dialog.dataLoading({visible:true})
                                        gvc.glitter.getModule(gvc.glitter.root_path+'cms-plugin/shopping-product-setting.js', (module) => {
                                            dialog.dataLoading({visible:false})
                                            vm.view=module.main(gvc,'giveaway')
                                            vm.page='detail'
                                            gvc.notifyDataChange(vm.id)
                                        })
                                    }
                                },
                                {
                                    title: '加購品管理',
                                    event: () => {
                                        dialog.dataLoading({visible:true})
                                        gvc.glitter.getModule(gvc.glitter.root_path+'cms-plugin/shopping-product-setting.js', (module) => {
                                            dialog.dataLoading({visible:false})
                                            vm.view=module.main(gvc,'addProduct')
                                            vm.page='detail'
                                            gvc.notifyDataChange(vm.id)
                                        })
                                    }
                                },
                                {
                                    title: '顧客列表',
                                    event: () => {
                                        dialog.dataLoading({visible:true})
                                        gvc.glitter.getModule(gvc.glitter.root_path+'cms-plugin/user-list.js', (module) => {
                                            dialog.dataLoading({visible:false})
                                            vm.view=module.main(gvc)
                                            vm.page='detail'
                                            gvc.notifyDataChange(vm.id)
                                        })
                                    }
                                },
                                {
                                    title: '顧客分群',
                                    event: () => {
                                        dialog.dataLoading({visible:true})
                                        gvc.glitter.getModule(gvc.glitter.root_path+'cms-plugin/member-group-list.js', (module) => {
                                            dialog.dataLoading({visible:false})
                                            vm.view=module.main(gvc)
                                            vm.page='detail'
                                            gvc.notifyDataChange(vm.id)
                                        })
                                    }
                                },
                                {
                                    title: '會員等級',
                                    event: () => {
                                        dialog.dataLoading({visible:true})
                                        gvc.glitter.getModule(gvc.glitter.root_path+'cms-plugin/member-type-list.js', (module) => {
                                            dialog.dataLoading({visible:false})
                                            vm.view=module.main(gvc)
                                            vm.page='detail'
                                            gvc.notifyDataChange(vm.id)
                                        })
                                    }
                                },
                                {
                                    title: '折扣活動',
                                    event: () => {
                                        dialog.dataLoading({visible:true})
                                        gvc.glitter.getModule(gvc.glitter.root_path+'cms-plugin/shopping-discount-setting.js', (module) => {
                                            dialog.dataLoading({visible:false})
                                            vm.view=module.main(gvc,'discount')
                                            vm.page='detail'
                                            gvc.notifyDataChange(vm.id)
                                        })
                                    }
                                },
                                {
                                    title: '購物金活動',
                                    event: () => {
                                        dialog.dataLoading({visible:true})
                                        gvc.glitter.getModule(gvc.glitter.root_path+'cms-plugin/shopping-discount-setting.js', (module) => {
                                            dialog.dataLoading({visible:false})
                                            vm.view=module.main(gvc,'rebate')
                                            vm.page='detail'
                                            gvc.notifyDataChange(vm.id)
                                        })
                                    }
                                },
                                {
                                    title: '加購活動',
                                    event: () => {
                                        dialog.dataLoading({visible:true})
                                        gvc.glitter.getModule(gvc.glitter.root_path+'cms-plugin/shopping-discount-setting.js', (module) => {
                                            dialog.dataLoading({visible:false})
                                            vm.view=module.main(gvc,'add_on_items')
                                            vm.page='detail'
                                            gvc.notifyDataChange(vm.id)
                                        })
                                    }
                                }
                            ].map((value, index, array) => {
                                return `<div class="d-flex justify-content-between hoverBtn" style="width:100% height: 39px; padding: 6px 12px; border-radius: 10px; justify-content: flex-start; align-items: center; gap: 24px; display: inline-flex;
cursor: pointer;" onclick="${gvc.event(() => {
                                    value.event()
                                })}">
  <div style="flex: 1 1 0; color: #393939; font-size: 20px;  font-weight: 700; text-transform: uppercase; letter-spacing: 2px; word-wrap: break-word">${value.title}</div>
  <i class="fa-solid fa-angle-right"></i>
</div>`
                            }).join('')))
                        })()
                    } else {
                        if(document.body.clientWidth<800){
                            $('.pos-footer-menu').addClass('d-none');
                            (document.querySelector('.POS-logo') as any).innerHTML=html`
                        <div class="d-flex align-items-center w-100 fw-500 fs-5 ps-3" style="gap:10px;" onclick="${
                                gvc.event(()=>{
                                    obj.vm.type='setting'
                                })
                            }">
                            <i class="fa-regular fa-gear"></i>返回設定
                        </div>
                        `
                        }

                        return vm.view
                    }

                },
                divCreate: {
                    class: `mx-auto `, style: `width:1000px;max-width:calc(100%);`
                }
            }
        })
    }
}