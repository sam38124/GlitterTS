import {GVC} from "../../glitterBundle/GVController.js";
import {BgWidget} from "../../backend-manager/bg-widget.js";
import {ApiPos} from "../../glitter-base/route/pos.js";
import {ApiUser} from "../../glitter-base/route/user.js";
import {POSSetting} from "../POS-setting.js";
import {ApiRecommend} from "../../glitter-base/route/recommend.js";

export class WorkStatus {
    public static main(obj: {
        gvc: GVC
    }) {
        const gvc = obj.gvc
        return BgWidget.container(gvc.bindView(() => {

            const vm: {
                loading: boolean,
                store_list: any,
                member_auth:any,
                id:string,
                select_store:string
            } = {
                loading: false,
                store_list: {},
                member_auth:{},
                id:gvc.glitter.getUUID(),
                select_store:''
            }

            async function initialData() {
                const [store_d, member_auth] = await Promise.all([
                    ApiUser.getPublicConfig('store_manager', 'manager'),
                    ApiUser.getPermission({
                        page: 0,
                        limit: 100
                    })
                ])
                vm.store_list = (store_d.response.value.list ?? []).filter((dd: any) => {
                    return dd.is_shop
                });
                vm.select_store=vm.store_list[0] && vm.store_list[0].id
                vm.member_auth=member_auth.response.data.filter((dd: any) => {
                    return dd.invited && dd.status
                });
                vm.loading=true
                gvc.notifyDataChange(vm.id)
            }

            initialData()

            return {
                bind: vm.id,
                view: () => {
                    if(!vm.loading){
                        return  BgWidget.spinner()
                    }
                    return [BgWidget.title('打卡紀錄'),
                        BgWidget.tab(vm.store_list.map((dd:any)=>{
                            return {
                                title:dd.name,
                                key:dd.id
                            }
                        }), gvc, vm.select_store, (dd) => {
                            vm.select_store=dd
                            gvc.notifyDataChange(vm.id)
                        }),
                        BgWidget.mainCard(
                            BgWidget.tableV3({
                                gvc: gvc,
                                getData: async (vmi) => {
                                    const limit = 15;
                                    ApiPos.getWorkStatusList({
                                        limit:limit,
                                        page:vmi.page-1,
                                        store:vm.select_store
                                    }).then((data) => {
                                        vmi.pageSize = Math.ceil(data.response.total / limit);
                                        vmi.originalData =data.response.data;
                                        vmi.tableData  =data.response.data.map((dd:any)=>{
                                            try {
                                                return [
                                                    {
                                                        key: '員工',
                                                        value: `<span class="fs-7">${vm.member_auth.find((d1:any)=>{
                                                            return d1.user===dd.staff
                                                        }).config.name}</span>`,
                                                    },
                                                    {
                                                        key: '職稱',
                                                        value: `<span class="fs-7">${vm.member_auth.find((d1:any)=>{
                                                            return d1.user===dd.staff
                                                        }).config.title}</span>`,
                                                    },
                                                    {
                                                        key: '行為',
                                                        value: `<span class="fs-7">${dd.execute==="on_work" ? BgWidget.warningInsignia('上班打卡'): BgWidget.successInsignia('下班打卡')}</span>`,
                                                    },
                                                    {
                                                        key: '時間',
                                                        value:gvc.glitter.ut.dateFormat(new Date(dd.create_time),'yyyy-MM-dd hh:mm')
                                                    }
                                                ]
                                            }catch (e) {
                                                return null
                                            }

                                        }).filter((dd:any)=>{return dd});
                                        vmi.loading = false;
                                        vmi.callback();
                                    })
                                },
                                rowClick: (data, index) => {

                                },
                                filter: [
                                ],
                            })
                        )
                    ].join('')
                }
            }
        }))
    }
}


(window as any).glitter.setModule(import.meta.url, WorkStatus)