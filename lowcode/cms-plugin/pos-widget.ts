import {GVC} from "../glitterBundle/GVController.js";
import {ApiPos} from "../glitter-base/route/pos.js";
import {ShareDialog} from "../glitterBundle/dialog/ShareDialog.js";

const html = String.raw

export class PosWidget {
    public static bigTitle(text: string, style?: string) {
        return html`
            <div style="font-size: ${((document.body.offsetWidth < 800)) ? `24px` : `28px`};font-style: normal;font-weight: 700;letter-spacing: 3.2px;color:#393939;${style || ''}">
                ${text}
            </div>`
    }

    public static bigTextItem(text: string, style?: string) {
        return html`
            <div style="
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    letter-spacing: 2.16px;${style || ''}">
                ${text}
            </div>`
    }

    public static fontBold(text: string) {
        return html`
            <div style="
        font-size: 18px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;">
                ${text}
            </div>`
    }

    public static fontLight(text: string) {
        return html`
            <div style="
        font-size: 18px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;">
                ${text}
            </div>`
    }

    public static buttonSnow(text: string, event: string) {
        return html`
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
            </div>`
    }

    public static buttonBlack(text: string, event: string) {
        return html`
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
            </div>`
    }

    public static checkInView(gvc: GVC) {
        return gvc.bindView(() => {
            const id = gvc.glitter.getUUID()
            return {
                bind: id,
                view: () => {
                    return html`
                        <div class="vw-100  d-flex flex-column align-items-center justify-content-center"
                             style="gap:20px;${document.body.clientWidth < 800 ? `height:calc(100vh - 180px);` : `height:calc(100vh - 120px);padding-right:100px;`}">
                            <img src="${gvc.glitter.root_path}img/check_in.jpg" class="rounded-circle"
                                 style="width:400px;max-width: 90%;">
                            <div>${PosWidget.buttonBlack('點我打卡上班', gvc.event(() => {
                                const dialog = new ShareDialog(gvc.glitter)
                                dialog.dataLoading({visible: true})
                                ApiPos.setWorkStatus({
                                    status: 'on_work'
                                }).then((res) => {
                                    dialog.dataLoading({visible: false})
                                    if (!res.result) {
                                        dialog.errorMessage({text: '打卡異常'})
                                    } else {
                                        gvc.recreateView()
                                    }
                                })
                            }))}
                            </div>
                        </div>`
                }
            }
        })
    }
}