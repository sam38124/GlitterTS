var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BgWidget } from "../../backend-manager/bg-widget.js";
import { ApiPos } from "../../glitter-base/route/pos.js";
import { ApiUser } from "../../glitter-base/route/user.js";
export class WorkStatus {
    static main(obj) {
        const gvc = obj.gvc;
        return BgWidget.container(gvc.bindView(() => {
            const vm = {
                loading: false,
                store_list: {},
                member_auth: {},
                id: gvc.glitter.getUUID(),
                select_store: ''
            };
            function initialData() {
                var _a;
                return __awaiter(this, void 0, void 0, function* () {
                    const [store_d, member_auth] = yield Promise.all([
                        ApiUser.getPublicConfig('store_manager', 'manager'),
                        ApiUser.getPermission({
                            page: 0,
                            limit: 100
                        })
                    ]);
                    vm.store_list = ((_a = store_d.response.value.list) !== null && _a !== void 0 ? _a : []).filter((dd) => {
                        return dd.is_shop;
                    });
                    vm.select_store = vm.store_list[0] && vm.store_list[0].id;
                    vm.member_auth = member_auth.response.data.filter((dd) => {
                        return dd.invited && dd.status;
                    });
                    vm.loading = true;
                    gvc.notifyDataChange(vm.id);
                });
            }
            initialData();
            return {
                bind: vm.id,
                view: () => {
                    if (!vm.loading) {
                        return BgWidget.spinner();
                    }
                    return [BgWidget.title('打卡紀錄'),
                        BgWidget.tab(vm.store_list.map((dd) => {
                            return {
                                title: dd.name,
                                key: dd.id
                            };
                        }), gvc, vm.select_store, (dd) => {
                            vm.select_store = dd;
                            gvc.notifyDataChange(vm.id);
                        }),
                        BgWidget.mainCard(BgWidget.tableV3({
                            gvc: gvc,
                            getData: (vmi) => __awaiter(this, void 0, void 0, function* () {
                                const limit = 15;
                                ApiPos.getWorkStatusList({
                                    limit: limit,
                                    page: vmi.page - 1,
                                    store: vm.select_store
                                }).then((data) => {
                                    vmi.pageSize = Math.ceil(data.response.total / limit);
                                    vmi.originalData = data.response.data;
                                    vmi.tableData = data.response.data.map((dd) => {
                                        try {
                                            return [
                                                {
                                                    key: '員工',
                                                    value: `<span class="fs-7">${vm.member_auth.find((d1) => {
                                                        return d1.user === dd.staff;
                                                    }).config.name}</span>`,
                                                },
                                                {
                                                    key: '職稱',
                                                    value: `<span class="fs-7">${vm.member_auth.find((d1) => {
                                                        return d1.user === dd.staff;
                                                    }).config.title}</span>`,
                                                },
                                                {
                                                    key: '行為',
                                                    value: `<span class="fs-7">${dd.execute === "on_work" ? BgWidget.warningInsignia('上班打卡') : BgWidget.successInsignia('下班打卡')}</span>`,
                                                },
                                                {
                                                    key: '時間',
                                                    value: gvc.glitter.ut.dateFormat(new Date(dd.create_time), 'yyyy-MM-dd hh:mm')
                                                }
                                            ];
                                        }
                                        catch (e) {
                                            return null;
                                        }
                                    }).filter((dd) => { return dd; });
                                    vmi.loading = false;
                                    vmi.callback();
                                });
                            }),
                            rowClick: (data, index) => {
                            },
                            filter: [],
                        }))
                    ].join('');
                }
            };
        }));
    }
}
window.glitter.setModule(import.meta.url, WorkStatus);
