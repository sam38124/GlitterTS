'use strict';
import { GVC } from '../glitterBundle/GVController.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { Tool } from '../modules/tool.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { ShareDialog } from '../dialog/ShareDialog.js';

const html = String.raw;

export class AutoReply {
    public static maxSize = 160;
    public static longSMS = 153;
    public static ticket = 1.5;

    public static main(gvc: GVC, widget: any) {
        const vm: {
            type: 'list' | 'replace';
            data: any;
            dataList: any;
            query?: string;
            tag: string;
            userData: any;
        } = {
            type: 'list',
            data: {},
            dataList: undefined,
            tag: '',
            query: '',
            userData: {
                userName: '',
                password: '',
            },
        };
        const glitter = gvc.glitter;
        const id = glitter.getUUID();
        return gvc.bindView(() => {
            return {
                bind: id,
                view: () => {
                    if (vm.type === 'replace') {
                        return AutoReply.autoSendEmail(
                            gvc,
                            vm.tag,
                            () => {
                                vm.type = 'list';
                                gvc.notifyDataChange(id);
                            },
                            widget
                        );
                    }
                    let vmi: any = undefined;

                    function getDatalist() {
                        return vm.dataList.map((dd: any) => {
                            return [
                                {
                                    key: '發送時間',
                                    value: dd.tag_name,
                                },
                                {
                                    key: '標題',
                                    value: Tool.truncateString(dd.title, 40),
                                },
                                {
                                    key: '最後更新時間',
                                    value: dd.updated_time ? gvc.glitter.ut.dateFormat(dd.updated_time, 'yyyy-MM-dd') : '系統預設',
                                },
                                {
                                    key: '狀態',
                                    value: gvc.bindView(() => {
                                        const id2 = gvc.glitter.getUUID();
                                        return {
                                            bind: id2,
                                            view: () => {
                                                return BgWidget.switchTextButton(
                                                    gvc,
                                                    dd.toggle,
                                                    {
                                                        left: dd.toggle ? '啟用' : '關閉',
                                                    },
                                                    () => {
                                                        ApiUser.getPublicConfig(dd.tag, 'manager').then((res) => {
                                                            dd.toggle = !dd.toggle;
                                                            res.response.value = res.response.value || {};
                                                            res.response.value.updated_time = new Date();
                                                            res.response.value.toggle = dd.toggle;
                                                            ApiUser.setPublicConfig({
                                                                key: dd.tag,
                                                                value: res.response.value,
                                                                user_id: 'manager',
                                                            }).then(() => {
                                                                gvc.notifyDataChange(id2);
                                                            });
                                                        });
                                                    }
                                                );
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
                    }

                    return BgWidget.container(
                        html`
                            <div class="title-container">
                                ${BgWidget.title('LINE 自動發送訊息')}
                                <div class="flex-fill"></div>
                            </div>
                            ${BgWidget.container(
                                BgWidget.mainCard(
                                    BgWidget.tableV3({
                                        gvc: gvc,
                                        getData: async (vmk) => {
                                            const appData = await ApiUser.getPublicConfig('store-information', 'manager');
                                            vmi = vmk;
                                            vmi.pageSize = Math.ceil(1);
                                            vm.dataList = [
                                                'auto-line-shipment',
                                                'auto-line-shipment-arrival',
                                                'auto-line-payment-successful',
                                                'auto-line-order-create',
                                                'line-proof-purchase',
                                                'auto-line-birthday',
                                            ];
                                            let index = 0;
                                            for (const b of vm.dataList) {
                                                vm.dataList[index] = await AutoReply.getDefCompare(b);
                                                vm.dataList[index].title = vm.dataList[index].title.replace(
                                                    /@\{\{app_name\}\}/g,
                                                    (appData.response.value && appData.response.value.shop_name) || '商店名稱'
                                                );
                                                index++;
                                            }
                                            vmi.originalData = vm.dataList;
                                            vmi.tableData = getDatalist();
                                            vmi.loading = false;
                                            vmi.callback();
                                        },
                                        rowClick: (data, index) => {
                                            vm.tag = vm.dataList[index].tag;
                                            vm.type = 'replace';
                                            gvc.notifyDataChange(id);
                                        },
                                        filter: [],
                                    })
                                )
                            )}
                            ${BgWidget.mbContainer(240)}
                        `
                    );
                },
            };
        });
    }

    public static autoSendEmail(gvc: GVC, tag: string, back: () => void, widget: any) {
        let vm: {
            data: any;
            loading: boolean;
        } = {
            data: '',
            loading: false,
        };
        const that = this;
        let pointCount = 1;
        return html` ${BgWidget.container(
            [
                html`<div class="title-container">
                    ${BgWidget.goBack(
                        gvc.event(() => {
                            back();
                        })
                    )}${BgWidget.title(
                        (() => {
                            const vm = {
                                id: gvc.glitter.getUUID(),
                                loading: true,
                                name: '簡訊設定',
                            };
                            return gvc.bindView({
                                bind: vm.id,
                                view: () => (vm.loading ? '' : vm.name),
                                divCreate: {},
                                onCreate: () => {
                                    if (vm.loading) {
                                        new Promise((resolve) => {
                                            AutoReply.getDefCompare(tag).then((dd) => resolve(dd));
                                        }).then((res: any) => {
                                            if (res && res.tag_name) {
                                                vm.name = res.tag_name;
                                            }
                                            vm.loading = false;
                                            gvc.notifyDataChange(vm.id);
                                        });
                                    }
                                },
                            });
                        })()
                    )}
                </div>`,
                BgWidget.mbContainer(24),
                BgWidget.alertInfo('可使用模板字串，簡訊將在寄送時自動填入相關數值', ['商家名稱：@{{app_name}}', '訂單號碼：@{{訂單號碼}}', '會員姓名：@{{user_name}}'], {
                    class: 'mb-3',
                    style: '',
                }),
                BgWidget.mainCard(
                    gvc.bindView(() => {
                        const id = gvc.glitter.getUUID();
                        AutoReply.getDefCompare(tag).then((dd) => {
                            vm.data = dd;
                            vm.loading = false;
                            gvc.notifyDataChange(id);
                        });
                        return {
                            bind: id,
                            view: () => {
                                return [
                                    EditorElem.editeInput({
                                        gvc: gvc,
                                        title: '寄件者名稱',
                                        default: vm.data.name || '',
                                        callback: (text) => {
                                            vm.data.name = text;
                                        },
                                        placeHolder: '請輸入寄件者名稱',
                                    }),
                                    html`
                                        <div class="d-flex align-items-center justify-content-between p-0 my-2">
                                            <div class="d-flex align-items-center gap-2">${EditorElem.h3('訊息內容')}</div>
                                            <div>${BgWidget.aiChatButton({ gvc, select: 'writer' })}</div>
                                        </div>
                                    `,
                                    EditorElem.editeText({
                                        gvc: gvc,
                                        title: '',
                                        default: vm.data.content || '',
                                        placeHolder: '',
                                        callback: (text) => {
                                            vm.data.content = text;
                                            let totalSize = 0;

                                            for (let i = 0; i < text.length; i++) {
                                                const char = text[i];
                                                // 判斷是否為中文或全形字符（Unicode範圍包含中文）
                                                if (/[\u4e00-\u9fa5\uFF00-\uFFEF]/.test(char)) {
                                                    totalSize += 2; // 中文或全形字符佔2個單位
                                                } else {
                                                    totalSize += 1; // 英文或半形字符佔1個單位
                                                }
                                            }

                                            if (totalSize < this.maxSize) {
                                                pointCount = 1;
                                            } else {
                                                pointCount = Math.ceil((totalSize /= this.longSMS));
                                            }
                                            gvc.notifyDataChange(id);
                                        },
                                    }),
                                ].join('');
                            },
                        };
                    })
                ),
                BgWidget.mbContainer(240),
                html` <div class="update-bar-container">
                    ${BgWidget.cancel(
                        gvc.event(() => {
                            back();
                        })
                    )}
                    ${BgWidget.save(
                        gvc.event(() => {
                            const dialog = new ShareDialog(gvc.glitter);
                            dialog.checkYesOrNot({
                                callback: (select) => {
                                    if (select) {
                                        widget.event('loading', { title: '儲存中' });
                                        vm.data.updated_time = new Date();
                                        ApiUser.setPublicConfig({
                                            key: tag,
                                            value: vm.data,
                                            user_id: 'manager',
                                        }).then(() => {
                                            setTimeout(() => {
                                                widget.event('loading', { visible: false });
                                                widget.event('success', { title: '儲存成功!' });
                                            }, 1000);
                                        });
                                    }
                                },
                                text: `確認無誤後將儲存。`,
                            });
                        })
                    )}
                </div>`,
            ].join('')
        )}`;
    }

    public static async getDefCompare(tag: string) {
        const dataList: any = [
            {
                tag: 'auto-line-shipment',
                tag_name: '商品出貨',
                name: '@{{app_name}}',
                title: '[@{{app_name}}] #@{{訂單號碼}} 送貨狀態 更新為: 出貨中',
                content: '[@{{app_name}}] #@{{訂單號碼}} 送貨狀態 更新為: 出貨中',
                toggle: true,
            },
            {
                tag: 'auto-line-shipment-arrival',
                tag_name: '商品到貨',
                name: '@{{app_name}}',
                title: '[@{{app_name}}] #@{{訂單號碼}} 送貨狀態 更新為: 已到達',
                content: '[@{{app_name}}] #@{{訂單號碼}} 送貨狀態 更新為: 已到達',
                toggle: true,
            },
            {
                tag: 'auto-line-payment-successful',
                tag_name: '訂單付款成功',
                name: '@{{app_name}}',
                title: '[@{{app_name}}] #@{{訂單號碼}} 付款狀態 更新為: 已付款',
                content: '[@{{app_name}}] #@{{訂單號碼}} 付款狀態 更新為: 已付款',
                toggle: true,
            },
            {
                tag: 'auto-line-order-create',
                tag_name: '訂單成立',
                name: '@{{app_name}}',
                title: '[@{{app_name}}] 您的訂單 #@{{訂單號碼}} 已成立',
                content: '[@{{app_name}}] 您的訂單 #@{{訂單號碼}} 已成立',
                toggle: true,
            },
            {
                tag: 'line-proof-purchase',
                tag_name: '訂單待核款',
                name: '@{{app_name}}',
                title: '[@{{app_name}}] 您的訂單 #@{{訂單號碼}} 已進入待核款',
                content: '[@{{app_name}}] 您的訂單 #@{{訂單號碼}} 已進入待核款',
                toggle: true,
            },
            {
                tag: 'auto-line-order-cancel-success',
                tag_name: '取消訂單成功',
                name: '@{{app_name}}',
                title: '[@{{app_name}}] 您已成功取消訂單 #@{{訂單號碼}}',
                content: '[@{{app_name}}] 您已成功取消訂單 #@{{訂單號碼}}',
                toggle: true,
            },
            {
                tag: 'auto-line-birthday',
                tag_name: '生日祝福',
                name: '@{{app_name}}',
                title: '[@{{app_name}}] [@{{user_name}}] 今天是您一年一度的大日子！祝您生日快樂！',
                content: '[@{{app_name}}] [@{{user_name}}] 今天是您一年一度的大日子！祝您生日快樂！',
                toggle: true,
            },
            {
                tag: 'auto-line-welcome',
                tag_name: '歡迎信件',
                name: '@{{app_name}}',
                title: '[@{{app_name}}] 歡迎您加入@{{app_name}}！ 最豐富的選品商店',
                content: '[@{{app_name}}] 歡迎您加入@{{app_name}}！ 最豐富的選品商店',
                toggle: true,
            },
        ];
        const keyData = await ApiUser.getPublicConfig(tag, 'manager');
        const b = dataList.find((dd: any) => {
            return dd.tag === tag;
        })!;
        if (keyData.response.value) {
            b.title = keyData.response.value.title || b.title;
            b.toggle = keyData.response.value.toggle ?? true;
            b.content = keyData.response.value.content || b.content;
            b.name = keyData.response.value.name || b.name;
            b.updated_time = new Date(keyData.response.value.updated_time);
        }
        return b;
    }
}

(window as any).glitter.setModule(import.meta.url, AutoReply);
