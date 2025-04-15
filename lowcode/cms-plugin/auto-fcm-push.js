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
const html = String.raw;
export class AutoFcmPush {
    static main(gvc) {
        return [
            (() => {
                const vm = {
                    type: 'list',
                    data: {},
                    dataList: undefined,
                    tag: '',
                    query: '',
                };
                const glitter = gvc.glitter;
                const id = glitter.getUUID();
                return gvc.bindView(() => {
                    return {
                        bind: id,
                        view: () => {
                            if (vm.type === 'replace') {
                                return AutoFcmPush.autoSendFcm(gvc, vm.tag, () => {
                                    vm.type = 'list';
                                    gvc.notifyDataChange(id);
                                });
                            }
                            let vmi = undefined;
                            return [
                                `<div class="title-container">
                ${BgWidget.title(`自動推播訊息`)}
              </div>`,
                                BgWidget.mainCard(BgWidget.tableV3({
                                    gvc: gvc,
                                    getData: (vmk) => __awaiter(this, void 0, void 0, function* () {
                                        const appData = yield ApiUser.getPublicConfig('store-information', 'manager');
                                        const auto_fcm = (yield ApiUser.getPublicConfig('auto_fcm', 'manager')).response.value;
                                        vmi = vmk;
                                        vmi.pageSize = Math.ceil(1);
                                        vm.dataList = AutoFcmPush.keyIndex.map((dd) => {
                                            return [
                                                {
                                                    key: '發送時機',
                                                    value: dd.name,
                                                },
                                                {
                                                    key: '標題',
                                                    value: (auto_fcm[dd.tag]).title,
                                                },
                                                {
                                                    key: '最後更新時間',
                                                    value: auto_fcm[dd.tag].updated_time ? gvc.glitter.ut.dateFormat(auto_fcm[dd.tag].updated_time, 'yyyy-MM-dd') : '系統預設',
                                                },
                                                {
                                                    key: '狀態',
                                                    value: gvc.bindView(() => {
                                                        const id2 = gvc.glitter.getUUID();
                                                        return {
                                                            bind: id2,
                                                            view: () => {
                                                                return BgWidget.switchTextButton(gvc, auto_fcm[dd.tag].toggle, {
                                                                    left: auto_fcm[dd.tag].toggle ? '啟用' : '關閉',
                                                                }, () => {
                                                                    auto_fcm[dd.tag].toggle = !auto_fcm[dd.tag].toggle;
                                                                    ApiUser.setPublicConfig({
                                                                        key: 'auto_fcm',
                                                                        value: auto_fcm,
                                                                        user_id: 'manager',
                                                                    }).then(() => {
                                                                        gvc.notifyDataChange(id2);
                                                                    });
                                                                });
                                                            },
                                                            divCreate: {
                                                                elem: 'div',
                                                                style: 'gap:4px;',
                                                                class: 'd-flex',
                                                                option: [
                                                                    {
                                                                        key: 'onclick',
                                                                        value: gvc.event((e, event) => {
                                                                            event.stopPropagation();
                                                                        }),
                                                                    },
                                                                ],
                                                            },
                                                        };
                                                    }),
                                                },
                                            ];
                                        });
                                        vmi.originalData = vm.dataList;
                                        vmi.tableData = vm.dataList;
                                        vmi.loading = false;
                                        vmi.callback();
                                    }),
                                    rowClick: (data, index) => {
                                        vm.tag = AutoFcmPush.keyIndex[index].tag;
                                        vm.type = 'replace';
                                        gvc.notifyDataChange(id);
                                    },
                                    filter: [],
                                })),
                                BgWidget.mbContainer(240)
                            ].join(`<div class="my-3"></div>`);
                        },
                    };
                });
            })()
        ].join(`<div class="my-3"></div>`);
    }
    static autoSendFcm(gvc, tag, back) {
        return gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            return {
                bind: id,
                view: () => __awaiter(this, void 0, void 0, function* () {
                    const saveData = (yield ApiUser.getPublicConfig('auto_fcm', 'manager')).response.value;
                    const auto_fcm = saveData[tag];
                    return [
                        html `<div class="title-container">
              ${BgWidget.goBack(gvc.event(() => {
                            back();
                        }))}${BgWidget.title(AutoFcmPush.keyIndex.find((dd) => { return dd.tag === tag; }).name)}
            </div>`,
                        BgWidget.mbContainer(24),
                        BgWidget.alertInfo('可使用模板字串，將在推播時自動填入相關數值', ['商家名稱：@{{app_name}}', '訂單號碼：@{{訂單號碼}}', '會員姓名：@{{user_name}}'], {
                            class: 'mb-3',
                            style: '',
                        }),
                        BgWidget.mainCard(gvc.bindView(() => {
                            const id = gvc.glitter.getUUID();
                            return {
                                bind: id,
                                view: () => {
                                    return [
                                        BgWidget.editeInput({
                                            gvc: gvc,
                                            title: '推播標題',
                                            default: auto_fcm.title || '',
                                            placeHolder: '',
                                            callback: (text) => {
                                                auto_fcm.title = text;
                                                gvc.notifyDataChange(id);
                                            },
                                            global_language: true
                                        }),
                                        BgWidget.editeInput({
                                            gvc: gvc,
                                            title: '推播內文',
                                            default: auto_fcm.content || '',
                                            placeHolder: '',
                                            callback: (text) => {
                                                auto_fcm.title = text;
                                                gvc.notifyDataChange(id);
                                            },
                                            global_language: true
                                        })
                                    ].join('');
                                },
                            };
                        })),
                        BgWidget.mbContainer(240),
                        html ` <div class="update-bar-container">
                    ${BgWidget.cancel(gvc.event(() => {
                            back();
                        }))}
                    ${BgWidget.save(gvc.event(() => {
                            const dialog = new ShareDialog(gvc.glitter);
                            dialog.checkYesOrNot({
                                callback: (select) => {
                                    if (select) {
                                        dialog.dataLoading({ visible: true, text: '儲存中' });
                                        ApiUser.setPublicConfig({
                                            key: 'auto_fcm',
                                            value: saveData,
                                            user_id: 'manager'
                                        }).then((res) => {
                                            dialog.dataLoading({ visible: false, text: '儲存中' });
                                            dialog.successMessage({ text: '儲存成功' });
                                        });
                                    }
                                },
                                text: `確認無誤後將儲存`,
                            });
                        }))}
                </div>`,
                    ].join('');
                })
            };
        });
    }
}
AutoFcmPush.keyIndex = [
    {
        tag: 'shipment',
        name: '商品已出貨',
    },
    {
        tag: 'arrival',
        name: '商品到達',
    },
    {
        tag: 'order-create',
        name: '訂單成立',
    },
    {
        tag: 'payment-successful',
        name: '訂單付款成功',
    },
    {
        tag: 'proof-purchase',
        name: '訂單待核款',
    },
    {
        tag: 'order-cancel-success',
        name: '取消訂單',
    },
    {
        tag: 'birthday',
        name: '生日祝福',
    },
    {
        tag: 'get-customer-message',
        name: '客服訊息',
    },
];
window.glitter.setModule(import.meta.url, AutoFcmPush);
