import {GVC} from "../../glitterBundle/GVController.js";
import {ShareDialog} from "../../glitterBundle/dialog/ShareDialog.js";
import {AiChat} from "../../glitter-base/route/ai-chat.js";

const html = String.raw

export class AiSearch {
    public static searchProduct(gvc: GVC) {
        gvc.addStyle(`.btn-black {
    display: flex;
    padding: 8px 14px;
    max-height: 36px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    border: 0;
    border-radius: 10px;
    background:#393939;
    cursor: pointer;
}

.btn-black:hover {
    background: #393939 !important;
    color:white;
}`)
        const glitter = gvc.glitter
        glitter.addMtScript(
            [
                'https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js',
            ],
            () => {
            },
            () => {
            }
        );
        const dialog = new ShareDialog(gvc.glitter)
        AiSearch.settingDialog({
            gvc: gvc,
            title: `<div class="fw-500">AI 商品搜索</div>`,
            innerHTML: (gvc: GVC) => {
                const html = String.raw
                let message = ''
                return html`
                    <div class="p-3">
                        ${[
                            html`
                                <lottie-player src="${gvc.glitter.root_path}lottie/ai.json" class="mx-auto my-n4"
                                               speed="1"
                                               style="max-width: 100%;width: 250px;height:250px;" loop
                                               autoplay></lottie-player>`,
                            `<div class="w-100 d-flex align-items-center justify-content-center my-3">${AiSearch.grayNote('透過 AI 可以協助你快速找到喜歡的商品', `font-weight: 500;`)}</div>`,
                            html`
                                <div class="w-100" ">
                                ${AiSearch.textArea({
                                    gvc: gvc,
                                    title: '',
                                    default: '',
                                    placeHolder: `*深色風格的三人座沙發\n*140公分以內的茶几\n*木質的桌子*價格落在2000以內的桌子`,
                                    callback: (text) => {
                                        message = text;
                                    },
                                    style: `min-height:100px;`
                                })}
                                </div>`,
                            html`
                                <div class="w-100 d-flex align-items-center justify-content-end">
                                    ${AiSearch.save(gvc.event(() => {
                                        const dialog = new ShareDialog(gvc.glitter)
                                        dialog.dataLoading({visible: true})
                                        AiChat.searchProduct({
                                            text: message,
                                            app_name: (window as any).appName
                                        }).then((res) => {
                                            dialog.dataLoading({visible: false})
                                            if (res.result) {
                                                if (!res.response.data.usage) {
                                                    dialog.errorMessage({text: '發生錯誤'})
                                                } else if (res.response.data.obj.products.length === 0) {
                                                    dialog.errorMessage({text: '查無相關商品'})
                                                } else {
                                                    gvc.glitter.setUrlParameter('ai-search', res.response.data.obj.products.map((dd: any) => {
                                                        return dd.product_id
                                                    }).join(','))
                                                    gvc.glitter.href = '/all-product'+location.search
                                                    gvc.closeDialog()
                                                }
                                            } else {
                                                dialog.errorMessage({text: '發生錯誤'})
                                            }

                                          
                                        })
                                        // AiChat.editorHtml({
                                        //     text: message,
                                        //     format: ProductAi.schema,
                                        //     assistant: `你是後台商品上架小幫手，幫我過濾出要調整的項目和內容，另外一點請你非常注意，variants中的規格標題不要包含規格單位，像是『顏色:灰色，尺寸:XS』這樣是錯誤的，請顯示成這樣這樣就好["灰色","XS"]`,
                                        //     token: (window.parent as any).saasConfig.config.token
                                        // }).then((res) => {
                                        //     dialog.dataLoading({visible: false})
                                        //     const obj = res.response.data && res.response.data.obj
                                        //     if (obj) {
                                        //         const usage = res.response.data.usage
                                        //         if (usage) {
                                        //             //替換標題
                                        //             (obj.name) && (product_data.title = obj.name);
                                        //             //替換內文
                                        //             (obj.content) && (product_data.content = obj.content);
                                        //             //替換規格列表
                                        //             if (obj.spec_define && obj.spec_define.length > 1) {
                                        //                 product_data.specs = obj.spec_define.map((dd: any) => {
                                        //                     return {
                                        //                         "title": dd.value,
                                        //                         "option": dd.spec_define.map((dd: any) => {
                                        //                             return {
                                        //                                 "title": dd.value
                                        //                             }
                                        //                         })
                                        //                     }
                                        //                 })
                                        //
                                        //             }
                                        //             //變體列表
                                        //             if (obj.spec && obj.spec.length) {
                                        //                 product_data.variants = obj.spec.map((dd: any) => {
                                        //                     return {
                                        //                         "sku": "",
                                        //                         "cost": 0,
                                        //                         "spec": (obj.spec.length === 1) ? [] : dd.value.map((dd: any) => {
                                        //                             return dd.value
                                        //                         }),
                                        //                         "type": "variants",
                                        //                         "stock": 0,
                                        //                         "profit": 0,
                                        //                         "weight": "1",
                                        //                         "barcode": "",
                                        //                         "v_width": 0,
                                        //                         "editable": false,
                                        //                         "v_height": 0,
                                        //                         "v_length": 0,
                                        //                         "sale_price": dd.sale_price,
                                        //                         "compare_price": (dd.original_price === dd.sale_price) ? 0 : dd.original_price,
                                        //                         "preview_image": "",
                                        //                         "shipment_type": "weight",
                                        //                         "shipment_weight": 0,
                                        //                         "show_understocking": "false"
                                        //                     }
                                        //                 })
                                        //             }
                                        //             //seo_title
                                        //             (obj.seo_title) && (product_data.seo.title = obj.seo_title);
                                        //             //seo_content
                                        //             (obj.seo_content) && (product_data.seo.content = obj.seo_content)
                                        //             dialog.successMessage({text: `生成成功，消耗了『${usage}』點 AI-Points`})
                                        //             refresh()
                                        //             gvc.closeDialog()
                                        //         } else {
                                        //             dialog.errorMessage({text: 'AI Points 點數不足'})
                                        //         }
                                        //     } else {
                                        //         dialog.errorMessage({text: '發生錯誤'})
                                        //     }
                                        // })
                                    }), "開始搜索", "w-100 mt-3 py-2")}
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

    static settingDialog(obj: {
        gvc: GVC;
        title: string;
        width?: number;
        height?: number;
        innerHTML: (gvc: GVC) => string;
        footer_html: (gvc: GVC) => string;
        closeCallback?: () => void
    }) {
        const glitter = (() => {
            let glitter = obj.gvc.glitter;
            if (glitter.getUrlParameter('cms') === 'true' || glitter.getUrlParameter('type') === 'htmlEditor') {
                glitter = (window.parent as any).glitter || obj.gvc.glitter;
            }
            return glitter;
        })();
        return (glitter as any).innerDialog((gvc: GVC) => {
            const vm = {
                id: obj.gvc.glitter.getUUID(),
                loading: false,
            };

            return html`
                <div
                        class="bg-white shadow rounded-3"
                        style="overflow-y: auto; ${document.body.clientWidth > 768 ? `min-width: 400px; width: ${obj.width ?? 600}px;` : 'min-width: 90vw; max-width: 92.5vw;'}"
                >
                    ${gvc.bindView({
                        bind: vm.id,
                        view: () => {
                            const footer = obj.footer_html(gvc) ?? ''
                            if (vm.loading) {
                                return html`<div class="my-4 d-flex w-100 align-items-center justify-content-center">
                                        <div class="spinner-border"></div>
                                    </div>`;
                            }
                            return html`<div class="bg-white shadow rounded-3" style="width: 100%; overflow-y: auto;">
                                    <div class="w-100 d-flex align-items-center p-3 border-bottom">
                                        <div class="tx_700">${obj.title ?? '產品列表'}</div>
                                        <div class="flex-fill"></div>
                                        <i
                                                class="fa-regular fa-circle-xmark fs-5 text-dark cursor_pointer"
                                                onclick="${gvc.event(() => {
                                                    if (obj.closeCallback) {
                                                        obj.closeCallback();
                                                    }
                                                    gvc.closeDialog();
                                                })}"
                                        ></i>
                                    </div>
                                    <div class="c_dialog">
                                        <div class="c_dialog_body">
                                            <div class="c_dialog_main"
                                                 style="gap: 24px; height: ${obj.height ? `${obj.height}px` : 'auto'}; max-height: 500px;">
                                                ${obj.innerHTML(gvc) ?? ''}
                                            </div>
                                            ${footer ? `<div class="c_dialog_bar">${footer}</div>` : ``}
                                        </div>
                                    </div>
                                </div>`;
                        },
                        onCreate: () => {
                        },
                    })}
                </div>`;
        }, obj.gvc.glitter.getUUID());
    }

    static grayNote(text: string, style: string = ''): string {
        return html`<span
                style="white-space: normal;word-break: break-all;color: #8D8D8D; font-size: 14px; font-weight: 400; ${style}">${text}</span>`;
    }

    static textArea(obj: {
        gvc: GVC;
        title: string;
        default: string;
        placeHolder: string;
        callback: (text: string) => void;
        style?: string;
        type?: string;
        readonly?: boolean;
        pattern?: string
    }) {
        obj.title = obj.title ?? '';
        return html`${obj.title ? html`
            <div class="tx_normal fw-normal">${obj.title}</div>` : ''}
        <div class="w-100 px-1" style="margin-top:8px;">
                <textarea
                        class="form-control border rounded"
                        style="font-size: 16px; color: #393939;"
                        rows="4"
                        onchange="${obj.gvc.event((e) => {
                            obj.callback(e.value);
                        })}"
                        placeholder="${obj.placeHolder ?? ''}"
                        ${obj.readonly ? `readonly` : ``}
                >
${obj.default ?? ''}</textarea
                >
        </div>`;
    }

    static save(event: string, text: string = '儲存', customClass?: string) {
        return html`
            <button class="btn btn-black ${customClass ?? ``}" type="button" onclick="${event}">
                <span class="tx_700_white">${text}</span>
            </button>`;
    }
}