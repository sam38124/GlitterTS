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
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { UserList } from './user-list.js';
import { BgNotify } from '../backend-manager/bg-notify.js';
export class MemberTypeList {
    static main(gvc, widget) {
        const html = String.raw;
        const glitter = gvc.glitter;
        const vm = {
            id: glitter.getUUID(),
            type: 'groupList',
            group: { type: '', title: '' },
            index: 0,
            dataList: [],
            tabs: [],
        };
        let vmi = undefined;
        function getDatalist() {
            return vm.dataList
                .filter((dd) => {
                return dd.type !== 'level';
            })
                .map((dd) => {
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
                            if (dd.type === 'subscriber') {
                                vm.type = 'subscriber';
                            }
                            else {
                                vm.type = 'list';
                            }
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
                    else if (vm.type === 'subscriber') {
                        return MemberTypeList.subscriberTable(gvc, {
                            group: vm.group,
                            backButtonEvent: gvc.event(() => {
                                vm.type = 'groupList';
                            }),
                        });
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
    static subscriberTable(gvc, obj) {
        const html = String.raw;
        const glitter = gvc.glitter;
        const dialog = new ShareDialog(glitter);
        const vm = {
            id: glitter.getUUID(),
            type: 'registered',
        };
        return gvc.bindView({
            bind: vm.id,
            view: () => {
                return BgWidget.container([
                    html `<div class="d-flex w-100 align-items-center">
                            ${BgWidget.goBack(obj.backButtonEvent) + BgWidget.title(obj.group.title)}
                            <div class="flex-fill"></div>
                            ${BgWidget.darkButton('新增', gvc.event(() => {
                        gvc.glitter.innerDialog((gvc2) => {
                            let mail = '';
                            let tag = '';
                            return html `<div class="modal-content bg-white rounded-3 p-2" style="max-width:90%;width:400px;">
                                            <div class="border-bottom ms-1 my-2 pb-2">
                                                <span class="tx_700">新增推播信箱</span>
                                            </div>
                                            <div class="">
                                                <div class="ps-1 pe-1">
                                                    <div class="mb-3">
                                                        <label for="username" class="form-label">信箱</label>
                                                        <input
                                                            class="form-control"
                                                            type="text"
                                                            id="userName"
                                                            required=""
                                                            placeholder="請輸入推播信箱"
                                                            onchange="${gvc.event((e, event) => {
                                mail = e.value;
                            })}"
                                                        />
                                                    </div>
                                                    <div class="mb-3">
                                                        <label for="username" class="form-label">標籤</label>
                                                        <input
                                                            class="form-control"
                                                            type="text"
                                                            id="userName"
                                                            required=""
                                                            placeholder="請輸入註冊標籤"
                                                            onchange="${gvc.event((e, event) => {
                                tag = e.value;
                            })}"
                                                        />
                                                    </div>
                                                </div>
                                                <div class="modal-footer mb-0 pb-0">
                                                    <button
                                                        type="button"
                                                        class="btn btn-outline-dark me-2"
                                                        onclick="${gvc.event(() => {
                                gvc2.closeDialog();
                            })}"
                                                    >
                                                        取消
                                                    </button>
                                                    <button
                                                        type="button"
                                                        class="btn btn-primary-c"
                                                        onclick="${gvc.event(() => {
                                dialog.dataLoading({ visible: true });
                                ApiUser.subScribe(mail, tag).then((response) => {
                                    dialog.dataLoading({ visible: false });
                                    if (!response.result) {
                                        dialog.errorMessage({ text: '伺服器錯誤!' });
                                    }
                                    else {
                                        dialog.successMessage({ text: '更新成功!' });
                                        gvc.notifyDataChange(vm.id);
                                        gvc2.closeDialog();
                                    }
                                });
                            })}"
                                                    >
                                                        確認添加
                                                    </button>
                                                </div>
                                            </div>
                                        </div>`;
                        }, 'add');
                    }))}
                        </div>`,
                    BgWidget.tab([
                        { title: '已註冊', key: 'registered' },
                        { title: '未註冊', key: 'notRegistered' },
                    ], gvc, vm.type, (text) => {
                        vm.type = text;
                        gvc.notifyDataChange(vm.id);
                    }, 'margin-bottom: 0;'),
                    vm.type === 'registered'
                        ? UserList.main(gvc, {
                            group: obj.group,
                            backButtonEvent: obj.backButtonEvent,
                            hiddenHeader: true,
                        })
                        : BgNotify.email(gvc, 'list', () => {
                            return obj.backButtonEvent;
                        }, {
                            hiddenHeader: true,
                        }),
                ].join(''));
            },
        });
    }
}
window.glitter.setModule(import.meta.url, MemberTypeList);
