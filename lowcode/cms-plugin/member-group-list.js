var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BgWidget } from '../backend-manager/bg-widget.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { UserList } from './user-list.js';
export class MemberTypeList {
    static main(gvc, widget) {
        const html = String.raw;
        const glitter = gvc.glitter;
        let callback = (data) => { };
        const vm = {
            id: glitter.getUUID(),
            type: 'groupList',
            group: { type: '', title: '', count: 0 },
            index: 0,
            dataList: [],
        };
        let vmi = undefined;
        function getDatalist() {
            return vm.dataList.map((dd) => {
                return [
                    {
                        key: '分群名稱',
                        value: `<span class="fs-7">${dd.title}</span>`,
                    },
                    {
                        key: '顧客數',
                        value: `<span class="fs-7">${dd.count}</span>`,
                    },
                    {
                        key: '',
                        value: BgWidget.grayButton('查閱名單', gvc.event(() => {
                            vm.type = 'list';
                            vm.group = dd;
                            gvc.notifyDataChange(vm.id);
                        }), { textStyle: 'font-weight: normal; font-size: 14px;' }),
                    },
                ];
            });
        }
        return gvc.bindView(() => {
            return {
                bind: vm.id,
                dataList: [{ obj: vm, key: 'type' }],
                view: () => {
                    if (vm.type === 'groupList') {
                        return BgWidget.container(html `
                                <div class="d-flex w-100 align-items-center">
                                    ${BgWidget.title('顧客分群')}
                                    <div class="flex-fill"></div>
                                </div>
                                ${BgWidget.container(BgWidget.mainCard(BgWidget.tableV2({
                            gvc: gvc,
                            getData: (vd) => __awaiter(this, void 0, void 0, function* () {
                                vmi = vd;
                                ApiUser.getUserGroupList().then((dd) => {
                                    vm.dataList = dd.response.data;
                                    vmi.pageSize = 1;
                                    vmi.data = getDatalist();
                                    vmi.loading = false;
                                    vmi.callback();
                                });
                            }),
                        })))}
                            `, BgWidget.getContainerWidth());
                    }
                    else {
                        return UserList.main(gvc, {
                            group: vm.group,
                            backButtonEvent: gvc.event(() => {
                                vm.type = 'groupList';
                            }),
                        });
                    }
                },
                divCreate: {
                    class: `mx-auto`,
                    style: `max-width:100%;width:960px;`,
                },
            };
        });
    }
}
window.glitter.setModule(import.meta.url, MemberTypeList);
