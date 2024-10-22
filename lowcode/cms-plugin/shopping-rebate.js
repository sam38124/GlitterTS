import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { ApiWallet } from '../glitter-base/route/wallet.js';
import { UserList } from './user-list.js';
import { Tool } from '../modules/tool.js';
export class ShoppingRebate {
    static main(gvc) {
        const glitter = gvc.glitter;
        const html = String.raw;
        const vm = {
            id: glitter.getUUID(),
            tableId: glitter.getUUID(),
            filterId: glitter.getUUID(),
            type: 'list',
            data: {
                id: 0,
                userID: 0,
                account: '',
                userData: { name: '', email: '', phone: '' },
                created_time: '',
                role: 0,
                company: null,
                status: 1,
            },
            dataList: undefined,
            query: '',
        };
        return gvc.bindView(() => {
            return {
                bind: vm.id,
                dataList: [{ obj: vm, key: 'type' }],
                view: () => {
                    if (vm.type === 'list') {
                        return BgWidget.container(html `
                                <div class="d-flex w-100 align-items-center">
                                    ${BgWidget.title('購物金紀錄')}
                                    <div class="flex-fill"></div>
                                    ${BgWidget.darkButton('新增紀錄', gvc.event(() => {
                            this.newRebateDialog({
                                gvc: gvc,
                                saveButton: {
                                    event: (obj) => {
                                        gvc.glitter.innerDialog((gvc3) => {
                                            let dataList = [];
                                            return BgWidget.container(BgWidget.mainCard([
                                                html `
                                                                            <div class="d-flex w-100 align-items-center mb-3">
                                                                                ${BgWidget.goBack(gvc.event(() => {
                                                    gvc3.closeDialog();
                                                }))}
                                                                                ${BgWidget.title(`選擇變動對象`)}
                                                                                <div class="flex-fill"></div>
                                                                                ${BgWidget.save(gvc.event(() => {
                                                    const dialog = new ShareDialog(gvc.glitter);
                                                    if (dataList.length > 0) {
                                                        dialog.dataLoading({
                                                            text: '發送中...',
                                                            visible: true,
                                                        });
                                                        ApiWallet.storeRebateByManager({
                                                            userID: dataList.map((dd) => {
                                                                return dd.userID;
                                                            }),
                                                            total: (() => {
                                                                if (obj.type === 'add') {
                                                                    return parseInt(obj.value, 10);
                                                                }
                                                                else {
                                                                    const minus = parseInt(obj.value, 10);
                                                                    return minus ? minus * -1 : minus;
                                                                }
                                                            })(),
                                                            note: obj.note,
                                                            rebateEndDay: obj.rebateEndDay,
                                                        }).then((result) => {
                                                            dialog.dataLoading({ visible: false });
                                                            if (result.response.result) {
                                                                dialog.successMessage({ text: `設定成功` });
                                                                gvc3.closeDialog();
                                                                setTimeout(() => {
                                                                    gvc.notifyDataChange(vm.tableId);
                                                                }, 200);
                                                            }
                                                            else {
                                                                dialog.errorMessage({ text: result.response.msg });
                                                            }
                                                        });
                                                    }
                                                    else {
                                                        dialog.errorMessage({ text: '請選擇變動對象' });
                                                    }
                                                }), '確認並發送')}
                                                                            </div>
                                                                        `,
                                                html `<div class="mx-n2">
                                                                            ${UserList.userManager(gvc, 'select', (data) => {
                                                    dataList = data;
                                                })}
                                                                            <div></div>
                                                                        </div>`,
                                            ].join('')), BgWidget.getContainerWidth(), 'max-height: 80vh; max-width: 92.5vh; overflow-y: auto; padding: 0;');
                                        }, 'email');
                                    },
                                    text: '選擇顧客',
                                },
                            });
                        }))}
                                </div>
                                ${BgWidget.container(BgWidget.mainCard([
                            BgWidget.searchPlace(gvc.event((e, event) => {
                                vm.query = e.value;
                                gvc.notifyDataChange(vm.id);
                            }), vm.query || '', '搜尋顧客信箱、姓名'),
                            gvc.bindView({
                                bind: vm.tableId,
                                view: () => {
                                    return BgWidget.tableV3({
                                        gvc: gvc,
                                        getData: (vmi) => {
                                            const limit = 15;
                                            ApiWallet.getRebate({
                                                page: vmi.page - 1,
                                                limit: limit,
                                                search: vm.query || undefined,
                                            }).then((data) => {
                                                function getDatalist() {
                                                    return data.response.data.map((dd) => {
                                                        var _a, _b;
                                                        return [
                                                            {
                                                                key: '用戶名稱',
                                                                value: `<span class="fs-7">${(_a = dd.name) !== null && _a !== void 0 ? _a : '資料異常'}</span>`,
                                                            },
                                                            {
                                                                key: '購物金來源',
                                                                value: (() => {
                                                                    let text = '';
                                                                    if (dd.content.order_id) {
                                                                        text = `訂單編號：${dd.content.order_id}`;
                                                                    }
                                                                    else {
                                                                        switch (dd.content.type) {
                                                                            case 'manual':
                                                                                text = '手動設定';
                                                                                break;
                                                                            case 'first_regiser':
                                                                                text = '新加入會員';
                                                                                break;
                                                                            case 'birth':
                                                                                text = '生日禮';
                                                                                break;
                                                                            default:
                                                                                text = dd.origin < 0 ? '使用折抵' : '其他';
                                                                                break;
                                                                        }
                                                                    }
                                                                    return html `<span class="fs-7">${text}</span>`;
                                                                })(),
                                                            },
                                                            {
                                                                key: '增減',
                                                                value: (() => {
                                                                    if (dd.origin > 0) {
                                                                        return html `<span class="tx_700 text-success">+ ${dd.origin}</span>`;
                                                                    }
                                                                    return html `<span class="tx_700 text-danger">- ${dd.origin * -1}</span>`;
                                                                })(),
                                                            },
                                                            {
                                                                key: '此筆可使用餘額',
                                                                value: (() => {
                                                                    const now = new Date();
                                                                    if (dd.origin > 0 && dd.remain > 0 && now > new Date(dd.created_at) && now < new Date(dd.deadline)) {
                                                                        return html `<span class="tx_700 text-success">+ ${dd.remain}</span>`;
                                                                    }
                                                                    return html `<span class="tx_700">0</span>`;
                                                                })(),
                                                            },
                                                            {
                                                                key: '備註',
                                                                value: `<span class="fs-7">${typeof dd.note === 'string' ? dd.note : (_b = (dd.note && dd.note.note)) !== null && _b !== void 0 ? _b : '尚未填寫備註'}</span>`,
                                                            },
                                                            {
                                                                key: '建立時間',
                                                                value: `<span class="fs-7">${glitter.ut.dateFormat(new Date(dd.created_at), 'yyyy-MM-dd hh:mm:ss')}</span>`,
                                                            },
                                                        ];
                                                    });
                                                }
                                                vm.dataList = data.response.data;
                                                vmi.pageSize = Math.ceil(data.response.total / limit);
                                                vmi.originalData = vm.dataList;
                                                vmi.tableData = getDatalist();
                                                vmi.loading = false;
                                                vmi.callback();
                                            });
                                        },
                                        rowClick: (data, index) => {
                                            vm.data = vm.dataList[index];
                                            vm.type = 'replace';
                                        },
                                        filter: [],
                                    });
                                },
                            }),
                        ].join('')) + BgWidget.mbContainer(120))}
                            `, BgWidget.getContainerWidth());
                    }
                    else if (vm.type == 'replace') {
                        return UserList.userInformationDetail({
                            userID: vm.data.user_id,
                            callback: () => {
                                vm.type = 'list';
                                gvc.notifyDataChange(vm.id);
                            },
                            gvc: gvc,
                        });
                    }
                    return '';
                },
            };
        });
    }
    static newRebateDialog(obj) {
        const html = String.raw;
        const gvc = obj.gvc;
        return gvc.glitter.innerDialog((gvc2) => {
            const vm = {
                type: 'add',
                value: '0',
                note: '',
                rebateEndDay: '0',
            };
            return html `<div class="modal-content bg-white rounded-3 p-2" style="max-width: 90%; width: 400px;">
                <div>
                    <div style="height: 50px; margin-bottom: 16px" class="d-flex align-items-center border-bottom">
                        <span class="ps-2 tx_700">新增紀錄</span>
                    </div>
                    ${gvc.bindView(() => {
                const id = gvc.glitter.getUUID();
                return {
                    bind: id,
                    view: () => {
                        return [
                            html `<div>
                                        ${EditorElem.radio({
                                title: html `<h6 class="tx_700">類型</h6>`,
                                gvc: gvc,
                                def: vm.type,
                                array: [
                                    { title: '新增', value: 'add' },
                                    { title: '減少', value: 'minus' },
                                ],
                                callback: (text) => {
                                    vm.type = text;
                                    gvc.notifyDataChange(id);
                                },
                            })}
                                    </div>`,
                            html `<div class="row mt-2">
                                        <div class="col-6">
                                            ${EditorElem.editeInput({
                                title: html `<h6 class="tx_700">金額</h6>`,
                                gvc: gvc,
                                default: vm.value,
                                type: 'number',
                                placeHolder: '設定數值',
                                callback: (text) => {
                                    vm.value = text;
                                    gvc.notifyDataChange(id);
                                },
                            })}
                                        </div>
                                        <div class="col-6">
                                            ${EditorElem.editeInput({
                                title: html `<h6 class="tx_700">可使用天數</h6>`,
                                gvc: gvc,
                                default: vm.rebateEndDay,
                                type: 'number',
                                placeHolder: '設定數值',
                                callback: (text) => {
                                    vm.rebateEndDay = text;
                                    gvc.notifyDataChange(id);
                                },
                                unit: '天',
                                readonly: vm.type !== 'add',
                            })}
                                            ${BgWidget.grayNote('輸入0，則為無期限', 'margin-top:6px;')}
                                        </div>
                                    </div>`,
                            html `<div>
                                        ${EditorElem.editeText({
                                title: html `<h6 class="tx_700">備註</h6>`,
                                gvc: gvc,
                                default: vm.note,
                                placeHolder: '輸入備註',
                                callback: (text) => {
                                    vm.note = text;
                                    gvc.notifyDataChange(id);
                                },
                            })}
                                    </div>`,
                        ].join(``);
                    },
                    divCreate: {
                        class: `p-2`,
                        style: `display: flex; flex-direction: column;`,
                    },
                };
            })}
                    <div class="modal-footer mb-0 pb-0 mt-2 pt-1">
                        ${BgWidget.cancel(gvc.event(() => {
                gvc2.closeDialog();
            }))}
                        ${BgWidget.save(gvc.event(() => {
                const dialog = new ShareDialog(gvc.glitter);
                const day = parseInt(`${vm.rebateEndDay}`, 10);
                const value = parseInt(`${vm.value}`, 10);
                if (value <= 0) {
                    dialog.infoMessage({ text: '金額需大於0' });
                    return;
                }
                if (vm.type === 'add' && isNaN(day)) {
                    dialog.infoMessage({ text: '請輸入可使用天數' });
                    return;
                }
                gvc2.closeDialog();
                obj.saveButton.event(vm);
            }), obj.saveButton.text)}
                    </div>
                </div>
            </div>`;
        }, Tool.randomString(5));
    }
}
window.glitter.setModule(import.meta.url, ShoppingRebate);
