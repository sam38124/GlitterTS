import {GVC} from "../../glitterBundle/GVController.js";
import {BgWidget} from "../../backend-manager/bg-widget.js";
import {ApiUser} from "../../glitter-base/route/user.js";
import {AiPointsApi} from "../../glitter-base/route/ai-points-api.js";
import {ShareDialog} from "../../glitterBundle/dialog/ShareDialog.js";
import {AiChat} from "../../glitter-base/route/ai-chat.js";
import {AddComponent} from "../../editor/add-component.js";

export class ProductAi {
    public static schema = {
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
    }

    public static setProduct(gvc: GVC, product_data: any, refresh: () => void) {
        const dialog = new ShareDialog(gvc.glitter)
        BgWidget.settingDialog({
            gvc: gvc,
            title: 'AI 商品生成',
            innerHTML: (gvc: GVC) => {
                const html = String.raw
                let message = '商品標題為Adidas衣服，規格有顏色和尺寸，其中有紅藍黃三種顏色，尺寸有S,M,L三種尺寸，紅色S號的販售價格為2000，紅色M號的價格為1500，其餘販售價格為1000元。'
                return html`
                    <div class="">
                        ${[
                            html`
                                <lottie-player src="${gvc.glitter.root_path}lottie/ai.json" class="mx-auto my-n4"
                                               speed="1"
                                               style="max-width: 100%;width: 250px;height:250px;" loop
                                               autoplay></lottie-player>`,
                            `<div class="w-100 d-flex align-items-center justify-content-center my-3">${BgWidget.grayNote('透過 AI 可以幫你新增或調整商品內容', `font-weight: 500;`)}</div>`,
                            html`
                                <div class="w-100" ">
                                ${BgWidget.textArea({
                                    gvc: gvc,
                                    title: '',
                                    default: message,
                                    placeHolder: `商品標題為Adidas衣服，規格有顏色和尺寸，其中有紅藍黃三種顏色，尺寸有S,M,L三種尺寸，紅色S號的販售價格為2000，紅色M號的價格為1500，其餘販售價格為1000元。`,
                                    callback: (text) => {
                                        message = text;
                                    },
                                    style: `min-height:100px;`
                                })}
                                </div>`,
                            `<div class="w-100 d-flex align-items-center justify-content-end">
${BgWidget.save(gvc.event(() => {
                                const dialog = new ShareDialog(gvc.glitter)
                                dialog.dataLoading({visible: true})
                                AiChat.editorHtml({
                                    text: message,
                                    format: ProductAi.schema,
                                    assistant: `你是後台商品上架小幫手，幫我過濾出要調整的項目和內容，另外一點請你非常注意，variants中的規格標題不要包含規格單位，像是『顏色:灰色，尺寸:XS』這樣是錯誤的，請顯示成這樣這樣就好["灰色","XS"]`,
                                    token: (window.parent as any).saasConfig.config.token
                                }).then((res) => {
                                    dialog.dataLoading({visible: false})
                                    const obj = res.response.data && res.response.data.obj
                                    if (obj) {
                                        const usage = res.response.data.usage
                                        if (usage) {
                                            //替換標題
                                            (obj.name) && (product_data.title = obj.name);
                                            //替換內文
                                            (obj.content) && (product_data.content = obj.content);
                                            //替換規格列表
                                            if (obj.spec_define && obj.spec_define.length > 1) {
                                                product_data.specs = obj.spec_define.map((dd: any) => {
                                                    return {
                                                        "title": dd.value,
                                                        "option": dd.spec_define.map((dd: any) => {
                                                            return {
                                                                "title": dd.value
                                                            }
                                                        })
                                                    }
                                                })

                                            }
                                            //變體列表
                                            if (obj.spec && obj.spec.length) {
                                                product_data.variants = obj.spec.map((dd: any) => {
                                                    return {
                                                        "sku": "",
                                                        "cost": 0,
                                                        "spec": (obj.spec.length === 1) ? [] : dd.value.map((dd: any) => {
                                                            if (dd.value.includes(':')) {
                                                                return dd.value.split(':')[1]
                                                            }
                                                            return dd.value
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
                                                    }
                                                })
                                            }
                                            //seo_title
                                            (obj.seo_title) && (product_data.seo.title = obj.seo_title);
                                            //seo_content
                                            (obj.seo_content) && (product_data.seo.content = obj.seo_content);
                                            //ai描述語句
                                            obj.ai_description && (product_data.ai_description = obj.ai_description);
                                            //
                                            console.log(`obj.ai_description==>`, obj.ai_description)
                                            dialog.successMessage({text: `生成成功，消耗了『${usage}』點 AI-Points`})
                                            refresh()
                                            gvc.closeDialog()
                                        } else {
                                            dialog.errorMessage({text: 'AI Points 點數不足'})
                                        }
                                    } else {
                                        dialog.errorMessage({text: '發生錯誤'})
                                    }
                                })
                            }), "確認生成", "w-100 mt-3 py-2")}
</div>`
                        ].join('<div class="my-2"></div>')}
                    </div>`
            },
            footer_html: (gvc: GVC) => {
                return ``
            },
            width: 500
        });
    }

    public static generateRichText(gvc: GVC, callback: (text:string) => void) {
        const dialog = new ShareDialog(gvc.glitter)
        BgWidget.settingDialog({
            gvc: gvc,
            title: 'AI 商品生成',
            innerHTML: (gvc: GVC) => {
                const html = String.raw
                let message = ''
                return html`
                    <div class="">
                        ${[
                            html`
                                <lottie-player src="${gvc.glitter.root_path}lottie/ai.json" class="mx-auto my-n4"
                                               speed="1"
                                               style="max-width: 100%;width: 250px;height:250px;" loop
                                               autoplay></lottie-player>`,
                            `<div class="w-100 d-flex align-items-center justify-content-center my-3">${BgWidget.grayNote('透過 AI 可以幫你生成商品描述', `font-weight: 500;`)}</div>`,
                            html`
                                <div class="w-100" ">
                                ${BgWidget.textArea({
                                    gvc: gvc,
                                    title: '',
                                    default: message,
                                    placeHolder: `幫我生成一個有關保健食品4*3的表格`,
                                    callback: (text) => {
                                        message = text;
                                    },
                                    style: `min-height:100px;`
                                })}
                                </div>`,
                            html`
                                <div class="w-100 d-flex align-items-center justify-content-end">
                                    ${BgWidget.save(gvc.event(() => {
                                        const dialog = new ShareDialog(gvc.glitter)
                                        dialog.dataLoading({visible: true})
                                        AiChat.generateHtml({
                                            token:(window.parent as any).saasConfig.config.token,
                                            app_name: (window.parent as any).appName,
                                            text: message
                                        }).then((res) => {
                                            if (res.result && res.response.data.usage === 0) {
                                                dialog.dataLoading({visible: false})
                                                dialog.errorMessage({text: `很抱歉你的AI代幣不足，請先前往加值`})
                                            } else if (res.result && (!res.response.data.obj.result)) {
                                                dialog.dataLoading({visible: false})
                                                dialog.errorMessage({text: `AI無法理解你的需求，請給出具體一點的描述`})
                                            } else if (!res.result) {
                                                dialog.dataLoading({visible: false})
                                                dialog.errorMessage({text: `發生錯誤`})
                                            } else {
                                                callback(res.response.data.obj.html)
                                                dialog.dataLoading({visible: false})
                                                dialog.successMessage({text: `AI生成完畢，使用了『${res.response.data.usage}』點 AI Points.`})
                                                gvc.closeDialog()

                                            }
                                        })
                                    }), "確認生成", "w-100 mt-3 py-2")}
                                </div>`
                        ].join('<div class="my-2"></div>')}
                    </div>`
            },
            footer_html: (gvc: GVC) => {
                return ``
            },
            width: 500
        });
    }
}