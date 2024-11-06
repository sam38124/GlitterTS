import { ShareDialog } from "../../glitterBundle/dialog/ShareDialog.js";
import { AiChat } from "../../glitter-base/route/ai-chat.js";
const html = String.raw;
export class AiSearch {
    static searchProduct(gvc) {
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
}`);
        const glitter = gvc.glitter;
        glitter.addMtScript([
            'https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js',
        ], () => {
        }, () => {
        });
        const dialog = new ShareDialog(gvc.glitter);
        AiSearch.settingDialog({
            gvc: gvc,
            title: `<div class="fw-500">AI 商品搜索</div>`,
            innerHTML: (gvc) => {
                const html = String.raw;
                let message = '';
                return html `
                    <div class="p-3">
                        ${[
                    html `
                                <lottie-player src="${gvc.glitter.root_path}lottie/ai.json" class="mx-auto my-n4"
                                               speed="1"
                                               style="max-width: 100%;width: 250px;height:250px;" loop
                                               autoplay></lottie-player>`,
                    `<div class="w-100 d-flex align-items-center justify-content-center my-3">${AiSearch.grayNote('透過 AI 可以協助你快速找到喜歡的商品', `font-weight: 500;`)}</div>`,
                    html `
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
                    html `
                                <div class="w-100 d-flex align-items-center justify-content-end">
                                    ${AiSearch.save(gvc.event(() => {
                        const dialog = new ShareDialog(gvc.glitter);
                        dialog.dataLoading({ visible: true });
                        AiChat.searchProduct({
                            text: message,
                            app_name: window.appName
                        }).then((res) => {
                            dialog.dataLoading({ visible: false });
                            if (res.result) {
                                if (!res.response.data.usage) {
                                    dialog.errorMessage({ text: '發生錯誤' });
                                }
                                else if (res.response.data.obj.products.length === 0) {
                                    dialog.errorMessage({ text: '查無相關商品' });
                                }
                                else {
                                    gvc.glitter.setUrlParameter('ai-search', res.response.data.obj.products.map((dd) => {
                                        return dd.product_id;
                                    }).join(','));
                                    gvc.glitter.href = '/all-product' + location.search;
                                    gvc.closeDialog();
                                }
                            }
                            else {
                                dialog.errorMessage({ text: '發生錯誤' });
                            }
                        });
                    }), "開始搜索", "w-100 mt-3 py-2")}
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
    static settingDialog(obj) {
        const glitter = (() => {
            let glitter = obj.gvc.glitter;
            if (glitter.getUrlParameter('cms') === 'true' || glitter.getUrlParameter('type') === 'htmlEditor') {
                glitter = window.parent.glitter || obj.gvc.glitter;
            }
            return glitter;
        })();
        return glitter.innerDialog((gvc) => {
            var _a;
            const vm = {
                id: obj.gvc.glitter.getUUID(),
                loading: false,
            };
            return html `
                <div
                        class="bg-white shadow rounded-3"
                        style="overflow-y: auto; ${document.body.clientWidth > 768 ? `min-width: 400px; width: ${(_a = obj.width) !== null && _a !== void 0 ? _a : 600}px;` : 'min-width: 90vw; max-width: 92.5vw;'}"
                >
                    ${gvc.bindView({
                bind: vm.id,
                view: () => {
                    var _a, _b, _c;
                    const footer = (_a = obj.footer_html(gvc)) !== null && _a !== void 0 ? _a : '';
                    if (vm.loading) {
                        return html `<div class="my-4 d-flex w-100 align-items-center justify-content-center">
                                        <div class="spinner-border"></div>
                                    </div>`;
                    }
                    return html `<div class="bg-white shadow rounded-3" style="width: 100%; overflow-y: auto;">
                                    <div class="w-100 d-flex align-items-center p-3 border-bottom">
                                        <div class="tx_700">${(_b = obj.title) !== null && _b !== void 0 ? _b : '產品列表'}</div>
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
                                                ${(_c = obj.innerHTML(gvc)) !== null && _c !== void 0 ? _c : ''}
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
    static grayNote(text, style = '') {
        return html `<span
                style="white-space: normal;word-break: break-all;color: #8D8D8D; font-size: 14px; font-weight: 400; ${style}">${text}</span>`;
    }
    static textArea(obj) {
        var _a, _b, _c;
        obj.title = (_a = obj.title) !== null && _a !== void 0 ? _a : '';
        return html `${obj.title ? html `
            <div class="tx_normal fw-normal">${obj.title}</div>` : ''}
        <div class="w-100 px-1" style="margin-top:8px;">
                <textarea
                        class="form-control border rounded"
                        style="font-size: 16px; color: #393939;"
                        rows="4"
                        onchange="${obj.gvc.event((e) => {
            obj.callback(e.value);
        })}"
                        placeholder="${(_b = obj.placeHolder) !== null && _b !== void 0 ? _b : ''}"
                        ${obj.readonly ? `readonly` : ``}
                >
${(_c = obj.default) !== null && _c !== void 0 ? _c : ''}</textarea
                >
        </div>`;
    }
    static save(event, text = '儲存', customClass) {
        return html `
            <button class="btn btn-black ${customClass !== null && customClass !== void 0 ? customClass : ``}" type="button" onclick="${event}">
                <span class="tx_700_white">${text}</span>
            </button>`;
    }
}
