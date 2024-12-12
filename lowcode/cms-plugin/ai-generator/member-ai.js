import { BgWidget } from "../../backend-manager/bg-widget.js";
import { ShareDialog } from "../../glitterBundle/dialog/ShareDialog.js";
import { AiChat } from "../../glitter-base/route/ai-chat.js";
export class MemberAi {
    static addMember(gvc, member_data, refresh) {
        const dialog = new ShareDialog(gvc.glitter);
        const html = String.raw;
        const language = window.parent.store_info.language_setting.def;
        let place_holder = '顧客姓名是王小明，電子信箱是sam12345@gmail.com，電話號碼是0912345678，生日是民國83年11月5日，地址是台北市大安區望安路10號，備註來自Facebook的消費用戶。';
        let message = place_holder;
        return html `
            <div class="">
                ${[
            html `
                        <lottie-player src="${gvc.glitter.root_path}lottie/ai.json" class="mx-auto my-n4"
                                       speed="1"
                                       style="max-width: 100%;width: 250px;height:250px;" loop
                                       autoplay></lottie-player>`,
            `<div class="w-100 d-flex align-items-center justify-content-center my-3">${BgWidget.grayNote('透過 AI 可以幫你快速新增會員資料', `font-weight: 500;`)}</div>`,
            html `
                        <div class="w-100" ">
                        ${BgWidget.textArea({
                gvc: gvc,
                title: '',
                default: message,
                placeHolder: place_holder,
                callback: (text) => {
                    message = text;
                },
                style: `min-height:100px;`
            })}
                        </div>`,
            `<div class="w-100 d-flex align-items-center justify-content-end">
${BgWidget.save(gvc.event(() => {
                const dialog = new ShareDialog(gvc.glitter);
                dialog.dataLoading({ visible: true });
                AiChat.editorHtml({
                    text: message,
                    format: MemberAi.schema,
                    assistant: `你是後台小幫手，幫我新增對應的會員資料`,
                    token: window.parent.saasConfig.config.token
                }).then((res) => {
                    dialog.dataLoading({ visible: false });
                    const obj = res.response.data && res.response.data.obj;
                    if (obj) {
                        const usage = res.response.data.usage;
                        if (usage) {
                            (obj.name) && (member_data.name = obj.name);
                            (obj.email) && (member_data.email = obj.email);
                            (obj.phone) && (member_data.phone = obj.phone);
                            (obj.birth) && (member_data.birth = obj.birth);
                            (obj.address) && (member_data.address = obj.address);
                            (obj.managerNote) && (member_data.managerNote = obj.managerNote);
                            dialog.successMessage({ text: `生成成功，消耗了『${usage}』點 AI-Points` });
                            refresh();
                            gvc.closeDialog();
                        }
                        else {
                            dialog.errorMessage({ text: 'AI Points 點數不足' });
                        }
                    }
                    else {
                        dialog.errorMessage({ text: '發生錯誤' });
                    }
                });
            }), "確認生成", "w-100 mt-3 py-4 fs-6")}
</div>`
        ].join('<div class="my-2"></div>')}
            </div>`;
    }
    static generateRichText(gvc, callback) {
        const dialog = new ShareDialog(gvc.glitter);
        BgWidget.settingDialog({
            gvc: gvc,
            title: 'AI 內容生成',
            innerHTML: (gvc) => {
                const html = String.raw;
                let message = '';
                return html `
                    <div class="">
                        ${[
                    html `
                                <lottie-player src="${gvc.glitter.root_path}lottie/ai.json" class="mx-auto my-n4"
                                               speed="1"
                                               style="max-width: 100%;width: 250px;height:250px;" loop
                                               autoplay></lottie-player>`,
                    `<div class="w-100 d-flex align-items-center justify-content-center my-3">${BgWidget.grayNote('透過 AI 可以快速幫您生成內文', `font-weight: 500;`)}</div>`,
                    html `
                                <div class="w-100" ">
                                ${BgWidget.textArea({
                        gvc: gvc,
                        title: '',
                        default: message,
                        placeHolder: `幫我生成一個4*3的說明表格，內容是針對健康保健。`,
                        callback: (text) => {
                            message = text;
                        },
                        style: `min-height:100px;`
                    })}
                                </div>`,
                    html `
                                <div class="w-100 d-flex align-items-center justify-content-end">
                                    ${BgWidget.save(gvc.event(() => {
                        const dialog = new ShareDialog(gvc.glitter);
                        dialog.dataLoading({ visible: true });
                        AiChat.generateHtml({
                            token: window.parent.saasConfig.config.token,
                            app_name: window.parent.appName,
                            text: message
                        }).then((res) => {
                            if (res.result && res.response.data.usage === 0) {
                                dialog.dataLoading({ visible: false });
                                dialog.errorMessage({ text: `很抱歉你的AI代幣不足，請先前往加值` });
                            }
                            else if (res.result && (!res.response.data.obj.result)) {
                                dialog.dataLoading({ visible: false });
                                dialog.errorMessage({ text: `AI無法理解你的需求，請給出具體一點的描述` });
                            }
                            else if (!res.result) {
                                dialog.dataLoading({ visible: false });
                                dialog.errorMessage({ text: `發生錯誤` });
                            }
                            else {
                                callback(res.response.data.obj.html);
                                dialog.dataLoading({ visible: false });
                                dialog.successMessage({ text: `AI生成完畢，使用了『${res.response.data.usage}』點 AI Points.` });
                                gvc.closeDialog();
                            }
                        });
                    }), "確認生成", "w-100 mt-3 py-2")}
                                </div>`
                ].join('<div class="my-2"></div>')}
                    </div>`;
            },
            footer_html: (gvc) => {
                return ``;
            },
            width: 500
        });
    }
}
MemberAi.schema = {
    "name": "customer_data",
    "strict": true,
    "schema": {
        "type": "object",
        "properties": {
            "name": {
                "type": "string",
                "description": "顧客的姓名"
            },
            "email": {
                "type": "string",
                "description": "顧客的電子信箱"
            },
            "phone": {
                "type": "string",
                "description": "顧客的電話"
            },
            "birth": {
                "type": "string",
                "description": "顧客的西元出生日期，範例19981223"
            },
            "address": {
                "type": "string",
                "description": "顧客的地址"
            },
            "managerNote": {
                "type": "string",
                "description": "顧客的備註"
            }
        },
        "required": [
            "name",
            "email",
            "phone",
            "birth",
            "address",
            "managerNote"
        ],
        "additionalProperties": false
    }
};
