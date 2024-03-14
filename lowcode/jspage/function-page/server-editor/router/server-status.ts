import {GVC} from "../../../../glitterBundle/GVController.js";
import {BgWidget} from "../../../../backend-manager/bg-widget.js";
import {EditorElem} from "../../../../glitterBundle/plugins/editor-elem.js";
import {BackendServer} from "../../../../api/backend-server.js";
import {ShareDialog} from "../../../../dialog/ShareDialog.js";

(window as any).glitter.setModule(import.meta.url, (gvc: GVC) => {
    const html = String.raw
    return gvc.bindView(() => {
        const id = gvc.glitter.getUUID()
        return {
            bind: id,
            view: () => {
                return new Promise(async (resolve, reject) => {
                    const serverINFO = await BackendServer.serverINFO()
                    resolve(BgWidget.container([
                        BgWidget.title('主機狀態管理'),
                        BgWidget.card([
                                EditorElem.h3('支援主機'),
                                `<input class="form-control"  value="AWS-EC2" readonly>`,
                                EditorElem.h3('主機狀態'),
                                `<div class="d-flex align-items-center" >
<input class="form-control fw-bold ${(serverINFO.response.id) ? `text-success` : `text-danger`}"  style="border-bottom-right-radius: 0px;border-top-right-radius: 0px;" value="
${(serverINFO.response.id) ? `已啟用` : `已停止`}
" readonly>
${gvc.bindView(() => {
                                    const id = gvc.glitter.getUUID()
                                    const vm: {
                                        visible: boolean
                                    } = {
                                        visible: false
                                    }
                                    return {
                                        bind: id,
                                        view: () => {
                                            const html = String.raw
                                            return new Promise((resolve, reject) => {
                                                resolve(html`
                                                    <div class="btn-group dropstart">
                                                        <button type="button"
                                                                class="btn btn-outline-secondary dropdown-toggle"
                                                                style="border-bottom-left-radius: 0px;border-top-left-radius: 0px;"
                                                                onclick="${gvc.event(() => {
                                                                    vm.visible = !vm.visible
                                                                    gvc.notifyDataChange(id)
                                                                })}">
                                                            調整
                                                        </button>
                                                        <div class="dropdown-menu mx-1 dropdown-menu-end  end-0 ${(vm.visible) ? `show` : ``}"
                                                             style="left: -90px;bottom: -90px;">
                                                            <a class="dropdown-item" onclick="${gvc.event(async () => {
                                                                const dialog = new ShareDialog(gvc.glitter)
                                                                dialog.dataLoading({visible: true});
                                                                (await BackendServer.stopServer());
                                                                dialog.dataLoading({visible: false})
                                                                location.reload()
                                                            })}">停止主機服務</a>
                                                            <a class="dropdown-item" onclick="${gvc.event(async () => {
                                                                const dialog = new ShareDialog(gvc.glitter)
                                                                dialog.dataLoading({visible: true});
                                                                (await BackendServer.startServer());
                                                                dialog.dataLoading({visible: false})
                                                                location.reload()
                                                            })}">啟用主機服務</a>
                                                        </div>
                                                    </div>`)
                                            })
                                        }
                                    }
                                })}
</div>`,
                                (serverINFO.response.id) ? html`
                                    ${EditorElem.h3('主機IP')}
                                    <input class="form-control" value="${serverINFO.response.ip}" readonly>
                                ` : ``,
                                (serverINFO.response.type) ? html`
                                    ${EditorElem.h3('主機類型')}
                                    <input class="form-control" value="${serverINFO.response.type}" readonly>
                                ` : ``
                            ].join(''),
                        )
                    ].join('<div class="my-3"></div>'), 600))
                })
            },
            divCreate: {}
        }
    })
})