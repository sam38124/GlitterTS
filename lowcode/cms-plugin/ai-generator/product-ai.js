import { BgWidget } from "../../backend-manager/bg-widget.js";
import { ShareDialog } from "../../glitterBundle/dialog/ShareDialog.js";
import { AiChat } from "../../glitter-base/route/ai-chat.js";
export class ProductAi {
    static setProduct(gvc, product_data, refresh) {
        const dialog = new ShareDialog(gvc.glitter);
        const html = String.raw;
        const language = window.parent.store_info.language_setting.def;
        let message = '商品標題為Adidas衣服，規格有顏色和尺寸，其中有紅藍黃三種顏色，尺寸有S,M,L三種尺寸，紅色S號的販售價格為2000，紅色M號的價格為1500，其餘販售價格為1000元。';
        return html `
            <div >
                ${[
            html `
                        <lottie-player src="${gvc.glitter.root_path}lottie/ai.json" class="mx-auto my-n4"
                                       speed="1"
                                       style="max-width: 100%;width: 250px;height:250px;" loop
                                       autoplay></lottie-player>`,
            `<div class="w-100 d-flex align-items-center justify-content-center my-3">${BgWidget.grayNote('透過 AI 可以幫你快速新增商品', `font-weight: 500;`)}</div>`,
            html `
                        <div class="w-100" ">
                        ${BgWidget.textArea({
                gvc: gvc,
                title: '',
                default: message,
                placeHolder: html `商品標題為Adidas衣服，規格有顏色和尺寸，其中有紅藍黃三種顏色，尺寸有S,M,L三種尺寸，紅色S號的販售價格為2000，紅色M號的價格為1500，其餘販售價格為1000元。`,
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
                    format: ProductAi.schema,
                    assistant: `你是後台商品上架小幫手，幫我過濾出要調整的項目和內容，另外一點請你非常注意，variants中的規格標題不要包含規格單位，像是『顏色:灰色，尺寸:XS』這樣是錯誤的，請顯示成這樣這樣就好["灰色","XS"]`,
                    token: window.parent.saasConfig.config.token
                }).then((res) => {
                    dialog.dataLoading({ visible: false });
                    const obj = res.response.data && res.response.data.obj;
                    if (obj) {
                        const usage = res.response.data.usage;
                        if (usage) {
                            const language_data = (product_data.language_data[language]);
                            (obj.name) && (language_data.title = obj.name);
                            (obj.content) && (language_data.content = obj.content);
                            if (obj.spec_define && obj.spec_define.length > 1) {
                                product_data.specs = obj.spec_define.map((dd) => {
                                    return {
                                        "title": dd.value,
                                        "option": dd.spec_define.map((dd) => {
                                            return {
                                                "title": dd.value
                                            };
                                        })
                                    };
                                });
                            }
                            if (obj.spec && obj.spec.length) {
                                product_data.variants = obj.spec.map((dd) => {
                                    return {
                                        "sku": "",
                                        "cost": 0,
                                        "spec": (obj.spec.length === 1) ? [] : dd.value.map((dd) => {
                                            if (dd.value.includes(':')) {
                                                return dd.value.split(':')[1];
                                            }
                                            return dd.value;
                                        }),
                                        "type": "variants",
                                        "stock": 0,
                                        "profit": 0,
                                        "weight": "1",
                                        "barcode": "",
                                        "v_width": 0,
                                        "editable": false,
                                        "v_height": 0,
                                        "v_length": 0,
                                        "sale_price": dd.sale_price,
                                        "compare_price": (dd.original_price === dd.sale_price) ? 0 : dd.original_price,
                                        "preview_image": "",
                                        "shipment_type": "weight",
                                        "shipment_weight": 0,
                                        "show_understocking": "false"
                                    };
                                });
                            }
                            (obj.seo_title) && (language_data.seo.title = obj.seo_title);
                            (obj.seo_content) && (language_data.seo.content = obj.seo_content);
                            obj.ai_description && (product_data.ai_description = obj.ai_description);
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
                    <div >
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
ProductAi.schema = {
    "name": "html_element_modification",
    "strict": true,
    "schema": {
        "type": "object",
        "properties": {
            "name": {
                "type": "string",
                "description": "商品名稱"
            },
            "spec_define": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "value": {
                            "type": "string",
                            "description": "規格單位"
                        },
                        "spec_define": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "value": {
                                        "type": "string",
                                        "description": "規格標題"
                                    }
                                },
                                "additionalProperties": false,
                                "required": [
                                    "value"
                                ]
                            },
                            "description": "規格標題"
                        }
                    },
                    "additionalProperties": false,
                    "required": [
                        "value",
                        "spec_define"
                    ]
                },
                "description": "定義的規格列表"
            },
            "spec": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "value": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "value": {
                                        "type": "string",
                                        "description": "規格標題"
                                    }
                                },
                                "additionalProperties": false,
                                "required": [
                                    "value"
                                ]
                            },
                            "description": "對應到規格列表裡的規格標題組合，並依據位置進行排序"
                        },
                        "original_price": {
                            "type": "number",
                            "description": "商品原價，預設為商品售價"
                        },
                        "sale_price": {
                            "type": "number",
                            "description": "商品售價"
                        }
                    },
                    "additionalProperties": false,
                    "required": [
                        "value",
                        "original_price",
                        "sale_price"
                    ]
                },
                "description": "代表規格列表裡所有組合的variants"
            },
            "content": {
                "type": "string",
                "description": "商品內文，至少200字"
            },
            "seo_title": {
                "type": "string",
                "description": "SEO標題"
            },
            "seo_content": {
                "type": "string",
                "description": "SEO中繼描述"
            }
        },
        "required": [
            "name",
            "spec",
            "spec_define",
            "content",
            "seo_title",
            "seo_content"
        ],
        "additionalProperties": false
    }
};
