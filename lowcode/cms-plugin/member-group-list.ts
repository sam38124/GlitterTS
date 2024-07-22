import { GVC } from '../glitterBundle/GVController.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { UserList } from './user-list.js';

export class MemberTypeList {
    public static main(gvc: GVC, widget: any) {
        const html = String.raw;
        const glitter = gvc.glitter;

        const vm: {
            id: string;
            type: 'groupList' | 'list' | 'replace';
            index: number;
            group: { type: string; title: string };
            dataList: any;
        } = {
            id: glitter.getUUID(),
            type: 'groupList',
            group: { type: '', title: '' },
            index: 0,
            dataList: [],
        };
        let vmi: any = undefined;

        function getDatalist() {
            return vm.dataList
                .filter((dd: any) => {
                    return dd.type !== 'level';
                })
                .map((dd: any) => {
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
                            value: BgWidget.grayButton(
                                '查閱名單',
                                gvc.event(() => {
                                    vm.type = 'list';
                                    vm.group = dd;
                                    gvc.notifyDataChange(vm.id);
                                }),
                                { textStyle: 'font-weight: normal; font-size: 14px;' }
                            ),
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
                        return BgWidget.container(
                            html`
                                <div class="d-flex w-100 align-items-center">
                                    ${BgWidget.title('顧客分群')}
                                    <div class="flex-fill"></div>
                                </div>
                                ${BgWidget.container(
                                    BgWidget.mainCard(
                                        BgWidget.tableV2({
                                            gvc: gvc,
                                            getData: async (vd) => {
                                                vmi = vd;
                                                ApiUser.getUserGroupList().then((dd: any) => {
                                                    vm.dataList = dd.response.data;
                                                    vmi.pageSize = 1;
                                                    vmi.data = getDatalist();
                                                    vmi.loading = false;
                                                    vmi.callback();
                                                });
                                            },
                                        })
                                    )
                                )}
                            `,
                            BgWidget.getContainerWidth()
                        );
                    } else {
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

(window as any).glitter.setModule(import.meta.url, MemberTypeList);
