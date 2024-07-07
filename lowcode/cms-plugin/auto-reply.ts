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
                        return vm.dataList.map((dd: any) => {
                            return [
                                {
                                    key: '發送時間',
                                    value: dd.tag_name,
                                },
                                {
                                    key: '標題',
                                    value: dd.title,
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
                            <div class="d-flex w-100 align-items-center">
                                ${BgWidget.title('自動寄件')}
                                <div class="flex-fill"></div>
                            </div>
                            ${BgWidget.container(
                                BgWidget.mainCard(
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
                                                  'get-customer-message'
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
                                )
                            )}
                            ${BgWidget.mbContainer(120)}
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
        return html` ${BgWidget.container(
            [
                html`<div class="d-flex align-items-center w-100">
                    ${BgWidget.goBack(
                        gvc.event(() => {
                            back();
                        })
                    )}${BgWidget.title('信件設定')}
                </div>`,
                BgWidget.mbContainer(24),
                BgWidget.mainCard(
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
                        };
                    })
                ),
                BgWidget.mb240(),
                html` <div class="update-bar-container">
                    ${BgWidget.cancel(
                        gvc.event(() => {
                            back();
                        })
                    )}
                    ${BgWidget.save(
                        gvc.event(() => {
                            widget.event('loading', { title: '儲存中' });
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
            ].join(''),
            BgWidget.getContainerWidth()
        )}`;
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
            },{
                tag: 'get-customer-message',
                tag_name: '客服訊息',
                content: ` <table width="100%" border="0" cellpadding="0" cellspacing="0"
                       style="box-sizing: border-box; caption-side: bottom; border-collapse: collapse; -webkit-font-smoothing: antialiased; border: none; empty-cells: show; max-width: 100%; color: rgb(65, 65, 65); font-family: sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; background-color: rgb(255, 255, 255);"
                       id="isPasted">
                    <tbody style="box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;">
                    <tr style="box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;">
                        <td style="box-sizing: border-box; border: 0px solid rgb(221, 221, 221); -webkit-font-smoothing: antialiased; user-select: text; min-width: 5px;">

                            <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
                                   style="box-sizing: border-box; caption-side: bottom; border-collapse: collapse; -webkit-font-smoothing: antialiased; --bs-gutter-x: 1.5rem; --bs-gutter-y: 0; display: flex; flex-wrap: wrap; margin-top: calc(-1 * var(--bs-gutter-y)); margin-right: calc(-0.5 * var(--bs-gutter-x)); margin-left: calc(-0.5 * var(--bs-gutter-x)); border: none; empty-cells: show; max-width: 100%;">
                                <tbody style="box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased; flex-shrink: 0; width: 1055.59px; max-width: 100%; padding-right: calc(var(--bs-gutter-x) * 0.5); padding-left: calc(var(--bs-gutter-x) * 0.5); margin-top: var(--bs-gutter-y);">
                                <tr style="box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;">
                                    <td style="box-sizing: border-box; border: 0px solid rgb(221, 221, 221); -webkit-font-smoothing: antialiased; user-select: text; min-width: 5px;">

                                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"
                                               style="box-sizing: border-box; caption-side: bottom; border-collapse: collapse; -webkit-font-smoothing: antialiased; border: none; empty-cells: show; max-width: 100%; color: rgb(0, 0, 0); width: 600px; margin: 0px auto;">
                                            <tbody style="box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;">
                                            <tr style="box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;">
                                                <td width="100%"
                                                    style="box-sizing: border-box; border: 0px; -webkit-font-smoothing: antialiased; user-select: text; min-width: 5px; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top;">

                                                    <table width="100%" border="0" cellpadding="0" cellspacing="0"
                                                           style="box-sizing: border-box; caption-side: bottom; border-collapse: collapse; -webkit-font-smoothing: antialiased; border: none; empty-cells: show; max-width: 100%;">
                                                        <tbody style="box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;">
                                                        <tr style="box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;">
                                                            <td style="box-sizing: border-box; border: 1px solid rgb(221, 221, 221); -webkit-font-smoothing: antialiased; user-select: text; min-width: 5px; width: 599px;">
                                                                <div align="center"
                                                                     style="box-sizing: border-box; -webkit-font-smoothing: antialiased; line-height: 10px;">
                                                                    <div style="box-sizing: border-box; -webkit-font-smoothing: antialiased; max-width: 600px;">
                                                                        <img src="https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1719903595261-s3s4scs3s7sfsfs7.png"
                                                                             class="fr-fic fr-dii"
                                                                             style="width: 100%;">
                                                                        <br>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        </tbody>
                                                    </table>

                                                    <table width="100%" border="0" cellpadding="0" cellspacing="0"
                                                           style="box-sizing: border-box; caption-side: bottom; border-collapse: collapse; -webkit-font-smoothing: antialiased; border: none; empty-cells: show; max-width: 100%;">
                                                        <tbody style="box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;">
                                                        <tr style="box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;">
                                                            <td style="box-sizing: border-box; border: 1px solid rgb(221, 221, 221); -webkit-font-smoothing: antialiased; user-select: text; min-width: 5px; padding: 60px 45px 30px; text-align: left; width: 599px;">

                                                                <h1 style="box-sizing: border-box; margin: 0px; font-weight: 700; line-height: 33.6px; color: rgb(54, 54, 54); font-size: 28px; -webkit-font-smoothing: antialiased; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; letter-spacing: normal; orphans: 2; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; direction: ltr; font-family: Arial, Helvetica, sans-serif; text-align: left;"
                                                                    id="isPasted">客服訊息</h1>
                                                                <br>
                                                                <div style="width: 100%;text-align: start;"> @{{text}}</div>
                                                                <br>
                                                                <br><span
                                                                    style="color: rgb(16, 17, 18); font-family: Arial, Helvetica, sans-serif; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;"><a
                                                                    href="@{{link}}"
                                                                    target="_blank"
                                                                    style="box-sizing: border-box; color: rgb(255, 255, 255); text-decoration: none; -webkit-font-smoothing: antialiased; transition: color 0.2s ease-in-out 0s; user-select: auto; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 148, 2); border-width: 0px; border-style: solid; border-color: transparent; border-radius: 5px; display: inline-block; font-family: Arial, Helvetica, sans-serif; font-size: 24px; padding-bottom: 15px; padding-top: 15px; text-align: center; width: auto; word-break: keep-all;"
                                                                    id="isPasted"><span
                                                                    style="box-sizing: border-box; -webkit-font-smoothing: antialiased; padding-left: 30px; padding-right: 30px; font-size: 24px; display: inline-block; letter-spacing: normal;"><span
                                                                    style="box-sizing: border-box; -webkit-font-smoothing: antialiased; word-break: break-word; line-height: 48px;"><strong
                                                                    style="box-sizing: border-box; font-weight: 700; -webkit-font-smoothing: antialiased;">前往商店</strong></span></span></a></span>
                                                                <br>
                                                            </td>
                                                        </tr>
                                                        </tbody>
                                                    </table>

                                                

                                                    <table width="100%" border="0" cellpadding="0" cellspacing="0"
                                                           style="box-sizing: border-box; caption-side: bottom; border-collapse: collapse; -webkit-font-smoothing: antialiased; border: none; empty-cells: show; max-width: 100%; word-break: break-word; background-color: rgb(247, 247, 247);">
                                                        <tbody style="box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;">
                                                        <tr style="box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;">
                                                            <td style="box-sizing: border-box; border: 1px solid rgb(221, 221, 221); -webkit-font-smoothing: antialiased; user-select: text; min-width: 5px; padding: 28px 45px 10px;">
                                                                <div style="box-sizing: border-box; -webkit-font-smoothing: antialiased; color: rgb(16, 17, 18); direction: ltr; font-family: Arial, Helvetica, sans-serif; font-size: 16px; font-weight: 400; letter-spacing: 0px; line-height: 19.2px; text-align: left;">

                                                                    <p style="box-sizing: border-box; margin-top: 0px; margin-bottom: 1.25rem; -webkit-font-smoothing: antialiased;">
                                                                        如果您有任何疑問或需要幫助，我們的團隊隨時在這裡為您提供支持。</p>

                                                                    <p style="box-sizing: border-box; margin-top: 0px; margin-bottom: 1.25rem; -webkit-font-smoothing: antialiased;">
                                                                        服務電話：+886 978-028-730</p>

                                                                    <p style="box-sizing: border-box; margin-top: 0px; margin-bottom: 1.25rem; -webkit-font-smoothing: antialiased;">
                                                                        電子郵件：mk@ncdesign.info</p>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        </tbody>
                                                    </table>

                                                    <table width="100%" border="0" cellpadding="0" cellspacing="0"
                                                           style="box-sizing: border-box; caption-side: bottom; border-collapse: collapse; -webkit-font-smoothing: antialiased; border: none; empty-cells: show; max-width: 100%; word-break: break-word; background-color: rgb(247, 247, 247);">
                                                        <tbody style="box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;">
                                                        <tr style="box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;">
                                                            <td style="box-sizing: border-box; border: 1px solid rgb(221, 221, 221); -webkit-font-smoothing: antialiased; user-select: text; min-width: 5px; padding: 20px 10px 10px;">
                                                                <div style="box-sizing: border-box; -webkit-font-smoothing: antialiased; color: rgb(16, 17, 18); direction: ltr; font-family: Arial, Helvetica, sans-serif; font-size: 14px; font-weight: 400; letter-spacing: 0px; line-height: 16.8px; text-align: center;">

                                                                    <p style="box-sizing: border-box; margin-top: 0px; margin-bottom: 1.25rem; -webkit-font-smoothing: antialiased;">
                                                                        <a href="https://shopnex.cc/?article=termsofservice&page=blog_detail"
                                                                           target="_blank" rel="noopener"
                                                                           style="box-sizing: border-box; color: rgb(28, 28, 28); text-decoration: underline; -webkit-font-smoothing: antialiased; transition: color 0.2s ease-in-out 0s; user-select: auto;">服務條款</a>&nbsp;
                                                                        &nbsp; &nbsp; &nbsp; &nbsp; <a
                                                                            href="https://shopnex.cc/?article=privacyterms&page=blog_detail"
                                                                            target="_blank" rel="noopener"
                                                                            style="box-sizing: border-box; color: rgb(28, 28, 28); text-decoration: underline; -webkit-font-smoothing: antialiased; transition: color 0.2s ease-in-out 0s; user-select: auto;">隱私條款</a>&nbsp;
                                                                        &nbsp; &nbsp; &nbsp; &nbsp; <a
                                                                            href="https://shopnex.cc/?article=privacyterms&page=e-commerce-blog"
                                                                            target="_blank" rel="noopener"
                                                                            style="box-sizing: border-box; color: rgb(28, 28, 28); text-decoration: underline; -webkit-font-smoothing: antialiased; transition: color 0.2s ease-in-out 0s; user-select: auto;">開店教學</a>
                                                                    </p>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                    
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    </tbody>
                </table>`,
                title: '[@{{app_name}}] 收到客服訊息',
                name: '@{{app_name}}',
                toggle: true,
            }
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
