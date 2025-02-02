import { ApiPos } from "../glitter-base/route/pos.js";
import { ShareDialog } from "../glitterBundle/dialog/ShareDialog.js";
import { POSSetting } from "./POS-setting.js";
const html = String.raw;
export class PosWidget {
    static bigTitle(text, style) {
        return html `
            <div style="font-size: ${((document.body.offsetWidth < 800)) ? `24px` : `28px`};font-style: normal;font-weight: 700;letter-spacing: 3.2px;color:#393939;${style || ''}">
                ${text}
            </div>`;
    }
    static bigTextItem(text, style) {
        return html `
            <div style="
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    letter-spacing: 2.16px;${style || ''}">
                ${text}
            </div>`;
    }
    static fontBold(text) {
        return html `
            <div style="
        font-size: 18px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;">
                ${text}
            </div>`;
    }
    static fontLight(text) {
        return html `
            <div style="
        font-size: 18px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;">
                ${text}
            </div>`;
    }
    static buttonSnow(text, event) {
        return html `
            <div style="display: flex;
    border-radius: 10px;
    background: #F6F6F6;
    height: 44px;
    padding: 12px 24px;
    justify-content: center;
    width:100%;
    cursor:pointer;;
    align-items: center;
    gap: 8px;
    align-self: stretch;" onclick="${event}">${text}
            </div>`;
    }
    static buttonBlack(text, event) {
        return html `
            <div style="display: flex;
    border-radius: 10px;
    background: #393939;
    color:white;
    height: 44px;
    padding: 12px 24px;
    justify-content: center;
    width:100%;
    cursor:pointer;;
    align-items: center;
    gap: 8px;
    align-self: stretch;" onclick="${event}">${text}
            </div>`;
    }
    static checkInView(gvc) {
        return gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    return html `
                        <div class="vw-100  d-flex flex-column align-items-center justify-content-center"
                             style="gap:20px;${document.body.clientWidth < 800 ? `height:calc(100vh - 180px);` : `height:calc(100vh - 120px);padding-right:100px;`}">
                            <img src="${gvc.glitter.root_path}img/check_in.jpg" class="rounded-circle"
                                 style="width:400px;max-width: 90%;">
                            <div>${PosWidget.buttonBlack('點我打卡上班', gvc.event(() => {
                        const dialog = new ShareDialog(gvc.glitter);
                        dialog.dataLoading({ visible: true });
                        ApiPos.setWorkStatus({
                            status: 'on_work',
                            store: POSSetting.config.where_store
                        }).then((res) => {
                            dialog.dataLoading({ visible: false });
                            if (!res.result) {
                                dialog.errorMessage({ text: '打卡異常' });
                            }
                            else {
                                gvc.recreateView();
                            }
                        });
                    }))}
                            </div>
                        </div>`;
                }
            };
        });
    }
}
