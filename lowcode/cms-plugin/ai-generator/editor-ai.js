import { BgWidget } from "../../backend-manager/bg-widget.js";
import { EditorElem } from "../../glitterBundle/plugins/editor-elem.js";
import { ShareDialog } from "../../glitterBundle/dialog/ShareDialog.js";
export class EditorAi {
    static view(gvc) {
        const html = String.raw;
        let message = '';
        return html `
            <div class="p-2">
                ${[
            html `
                        <lottie-player src="${gvc.glitter.root_path}lottie/ai.json"
                                       class="mx-auto my-n4" speed="1"
                                       style="max-width: 100%;width: 250px;height:250px;" loop
                                       autoplay></lottie-player>`,
            `<div class="w-100 d-flex align-items-center justify-content-center my-3">${BgWidget.grayNote('點擊想要調整的元件之後，在輸入 AI 語句進行調整', `font-weight: 500;`)}</div>`,
            html `
                        <div class="w-100" onclick="${gvc.event(() => {
                if (!gvc.glitter.share.editorViewModel.selectItem) {
                    const dialog = new ShareDialog(gvc.glitter);
                    dialog.errorMessage({ text: '請先點擊要編輯的元件' });
                }
            })}">
                            ${EditorElem.editeText({
                gvc: gvc,
                title: '',
                default: '',
                placeHolder: `字體大小20px，距離左邊20px，背景顏色黃色，字體顏色藍色，標題為歡迎來到SHOPNEX開店平台.`,
                callback: (text) => {
                    message = text;
                },
                min_height: 100
            })}
                        </div>`,
            html `
                        <div class="w-100 d-flex align-items-center justify-content-end">
                            ${BgWidget.save(gvc.event(() => {
                const dialog = new ShareDialog(gvc.glitter);
                if (!message) {
                    dialog.errorMessage({ text: '請輸入描述語句' });
                    return;
                }
                dialog.dataLoading({ visible: true });
                gvc.glitter.getModule(new URL('./editor/ai-editor.js', gvc.glitter.root_path).href, (AiEditor) => {
                    AiEditor.editView(message, gvc.glitter.share.editorViewModel.selectItem, (result) => {
                        dialog.dataLoading({ visible: false });
                        if (result) {
                            dialog.successMessage({ text: `已為你調整元件『${result}』` });
                            gvc.glitter.share.editorViewModel.selectItem.refreshComponent();
                            gvc.glitter.closeDrawer();
                        }
                        else {
                            dialog.errorMessage({ text: 'AI無法理解你的意思，請輸入更確切的需求' });
                        }
                    });
                });
            }), "調整元素", "w-100 mt-3 py-2")}
                        </div>`
        ].join('<div class="my-2"></div>')}
            </div>`;
    }
}
window.glitter.setModule(import.meta.url, EditorAi);
