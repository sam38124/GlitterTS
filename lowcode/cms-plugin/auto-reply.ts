import { GVC } from '../glitterBundle/GVController.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { ShareDialog } from '../dialog/ShareDialog.js';

const html = String.raw;

export class AutoReply {
    public static main(gvc: GVC, widget: any) {
        const vm: {
            type: 'list' | 'replace';
            data: any;
            dataList: any;
            query?: string;
            tag: string;
        } = {
            type: 'list',
            data: {
                id: 61,
                userID: 549313940,
                account: 'jianzhi.wang@homee.ai',
                userData: { name: '王建智', email: 'jianzhi.wang@homee.ai', phone: '0978028739' },
                created_time: '2023-11-26T02:14:09.000Z',
                role: 0,
                company: null,
                status: 1,
            },
            dataList: undefined,
            tag: '',
            query: '',
        };
        const glitter = gvc.glitter;
        const filterID = glitter.getUUID();
        const id = glitter.getUUID();
        const dialog = new ShareDialog(gvc.glitter);
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
                        console.log(`getDatalist->`);
                        return vm.dataList.map((dd: any) => {
                            return [
                                {
                                    key: '發送時間',
                                    value: dd.tag_name,
                                },
                                {
                                    key: '標題',
                                    value: html`<div style="max-width: calc(100vw - 650px);text-overflow: ellipsis;white-space: nowrap;position: relative;overflow: hidden;">${dd.title}</div>`,
                                },
                                {
                                    key: '最後更新時間',
                                    value: dd.updated_time ? gvc.glitter.ut.dateFormat(dd.updated_time, 'yyyy-MM-dd') : '無',
                                },
                                {
                                    key: '狀態',
                                    value: gvc.bindView(() => {
                                        const id2 = gvc.glitter.getUUID();
                                        return {
                                            bind: id2,
                                            view: () => {
                                                console.log(`id2=>`, id2);
                                                return html` <div class="tx_normal">啟用</div>
                                                    <div class="cursor_pointer form-check form-switch ms-1" style=" ">
                                                        <input
                                                            class=" form-check-input form-check-input-success"
                                                            type="checkbox"
                                                            onclick="${gvc.event((e, event) => {
                                                                event.stopPropagation();
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
                                                            })}"
                                                            ${dd.toggle ? `checked` : ``}
                                                        />
                                                    </div>`;
                                            },
                                            divCreate: { elem: `div`, style: `gap:4px;`, class: `d-flex` },
                                        };
                                    }),
                                },
                            ];
                        });
                    }

                    return BgWidget.container(
                        html`
                            <div class="d-flex w-100 align-items-center" style="margin-bottom: 24px;">
                                ${BgWidget.title('自動寄件')}
                                <div class="flex-fill"></div>
                            </div>
                            ${BgWidget.mainCard(
                                BgWidget.tableV2({
                                    gvc: gvc,
                                    editable: true,
                                    getData: async (vmk) => {
                                        const appData = await ApiUser.getPublicConfig('store-information', 'manager');
                                        vmi = vmk;
                                        vmi.pageSize = Math.ceil(1);
                                        vm.dataList = [
                                            'auto-email-shipment-arrival',
                                            'auto-email-shipment',
                                            'auto-email-payment-successful',
                                            'auto-email-order-create',
                                            'auto-email-order-cancel-success',
                                            'auto-email-order-cancel-false',
                                            'auto-email-birthday',
                                            'auto-email-welcome',
                                            'auto-email-verify',
                                            'auto-email-forget',
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
                                        vmi.data = getDatalist();
                                        vmi.loading = false;
                                        setTimeout(() => {
                                            vmi.callback();
                                        });
                                    },
                                    rowClick: (data, index) => {
                                        vm.tag = vm.dataList[index].tag;
                                        vm.type = 'replace';
                                        gvc.notifyDataChange(id);
                                    },
                                    filter: ``,
                                })
                            )}
                        `,
                        BgWidget.getContainerWidth()
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
        return [
            [
                html`<div class="d-flex align-items-center">
                    ${BgWidget.goBack(
                        gvc.event(() => {
                            back();
                        })
                    )}${BgWidget.title('信件設定')}
                </div>`,
            ],
            html`<div style="height: 10px;"></div>`,
            BgWidget.card(
                gvc.bindView(() => {
                    const id = gvc.glitter.getUUID();

                    const keyData = AutoReply.getDefCompare(tag).then((dd) => {
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
                                EditorElem.editeInput({
                                    gvc: gvc,
                                    title: '信件標題',
                                    default: vm.data.title || '',
                                    callback: (text) => {
                                        vm.data.title = text;
                                    },
                                    placeHolder: '請輸入信件標題',
                                }),
                                EditorElem.h3('信件內容'),
                                EditorElem.richText({
                                    gvc: gvc,
                                    def: vm.data.content || '',
                                    callback: (text) => {
                                        vm.data.content = text;
                                    },
                                }),
                            ].join('');
                        },
                        divCreate: {
                            class: `px-3`,
                            style: ``,
                        },
                    };
                })
            ),
            html`<div style="height: 70px;"></div>`,
            html`<div
                class="position-fixed bottom-0 left-0 w-100 d-flex align-items-center justify-content-end p-3 border-top bg-white border"
                style="z-index:999;gap:10px;left: 0;background: #FFF;box-shadow: 0px 1px 10px 0px rgba(0, 0, 0, 0.15);"
            >
                ${BgWidget.cancel(
                    gvc.event(() => {
                        back();
                    })
                )}
                ${BgWidget.save(
                    gvc.event(() => {
                        widget.event('loading', { title: '儲存中' });
                        console.log(`saveData->`, vm.data);
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
                    })
                )}
            </div>`,
        ].join('');
    }

    public static async getDefCompare(tag: string) {
        const dataList: any = [
            {
                tag: 'auto-email-shipment-arrival',
                tag_name: '商品到貨',
                title: `[@{{app_name}}] #@{{訂單號碼}} 送貨狀態 更新為: 已到達`,
                content: `[@{{app_name}}] #@{{訂單號碼}} 送貨狀態 更新為: 已到達`,
                name: '@{{app_name}}',
                toggle: true,
            },
            {
                tag: 'auto-email-shipment',
                tag_name: '商品出貨',
                title: `[@{{app_name}}] #@{{訂單號碼}} 送貨狀態 更新為: 出貨中`,
                content: '[@{{app_name}}] #@{{訂單號碼}} 送貨狀態 更新為: 出貨中',
                name: '@{{app_name}}',
                toggle: true,
            },
            {
                tag: 'auto-email-payment-successful',
                tag_name: '訂單付款成功',
                title: `[@{{app_name}}] #@{{訂單號碼}} 付款狀態 更新為: 已付款`,
                content: '[@{{app_name}}] #@{{訂單號碼}} 付款狀態 更新為: 已付款',
                name: '@{{app_name}}',
                toggle: true,
            },
            {
                tag: 'auto-email-order-create',
                tag_name: '訂單成立',
                title: `[@{{app_name}}]  你的訂單 #@{{訂單號碼}} 已成立 `,
                content: '[@{{app_name}}]  你的訂單 #@{{訂單號碼}} 已成立',
                name: '@{{app_name}}',
                toggle: true,
            },
            {
                tag: 'auto-email-order-cancel-success',
                tag_name: '取消訂單成功',
                content: '[@{{app_name}}] 您已成功取消訂單 #@{{訂單號碼}}',
                title: `[@{{app_name}}] 您已成功取消訂單 #@{{訂單號碼}} `,
                name: '@{{app_name}}',
                toggle: true,
            },
            {
                tag: 'auto-email-order-cancel-false',
                tag_name: '取消訂單失敗',
                content: '[@{{app_name}}] 取消訂單申請 #@{{訂單號碼}} 已失敗',
                title: `[@{{app_name}}] 取消訂單申請 #@{{訂單號碼}} 已失敗`,
                name: '@{{app_name}}',
                toggle: true,
            },
            {
                tag: 'auto-email-birthday',
                tag_name: '生日祝福',
                content: '[@{{app_name}}] [@{{user_name}}] 今天是您一年一度的大日子！祝您生日快樂！',
                title: `[@{{app_name}}] [@{{user_name}}] 今天是您一年一度的大日子！祝您生日快樂！`,
                name: '@{{app_name}}',
                toggle: true,
            },
            {
                tag: 'auto-email-welcome',
                tag_name: '歡迎信件',
                content: '[@{{app_name}}] 歡迎您加入@{{app_name}}！ 最豐富的選品商店',
                title: `[@{{app_name}}] 歡迎您加入@{{app_name}}！ 最豐富的選品商店`,
                name: '@{{app_name}}',
                toggle: true,
            },
            {
                tag: 'auto-email-verify',
                tag_name: '信箱驗證',
                content: '嗨！歡迎加入 @{{app_name}}，請輸入驗證碼「 @{{code}}  」。請於1分鐘內輸入並完成驗證。',
                title: '[@{{app_name}}] 帳號認證通知',
                name: '@{{app_name}}',
                toggle: true,
            },
            {
                tag: 'auto-email-forget',
                tag_name: '忘記密碼',
                content: '[@{{app_name}}]，請輸入驗證碼「 @{{code}} 」。請於1分鐘內輸入並完成驗證。',
                title: '[@{{app_name}}] 重設密碼',
                name: '@{{app_name}}',
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
