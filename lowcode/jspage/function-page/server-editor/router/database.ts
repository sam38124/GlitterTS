import {BgWidget} from "../../../../backend-manager/bg-widget.js";
import {EditorElem} from "../../../../glitterBundle/plugins/editor-elem.js";
import {BackendServer} from "../../../../api/backend-server.js";
import {GVC} from "../../../../glitterBundle/GVController.js";

(window as any).glitter.setModule(import.meta.url, (gvc: GVC) => {
    return gvc.bindView(() => {
        const id = gvc.glitter.getUUID()
        return {
            bind: id,
            view: () => {
                return new Promise(async (resolve, reject) => {
                    const response = (await BackendServer.getDatabaseAddress()).response
                    resolve(BgWidget.container([
                        BgWidget.title('資料庫管理'),
                        BgWidget.card([
                                EditorElem.h3('支援資料庫'),
                                `<input class="form-control"  value="MYSQL" readonly>`,
                                EditorElem.h3('資料庫路徑'),
                                `<input class="form-control"  value="${response.sql_ip}" readonly>`,
                                EditorElem.h3('資料庫帳號'),
                                `<input class="form-control"  value="${response.sql_admin}" readonly>`,
                                EditorElem.h3('資料庫密碼'),
                                gvc.bindView(() => {
                                    const id = gvc.glitter.getUUID()
                                    let vm: {
                                        visible: boolean
                                    } = {
                                        visible: false
                                    }
                                    return {
                                        bind: id,
                                        view: () => {
                                            return `<div class="d-flex">
${(() => {
                                                if (vm.visible) {
                                                    return `<input class="form-control"  value="${response.sql_pwd}" type="text" readonly>`
                                                } else {
                                                    return `<input class="form-control"  value="${response.sql_pwd}" type="password" readonly>`
                                                }
                                            })()}
<button class="btn btn-secondary ms-2" style="width:20px;" onclick="${gvc.event(() => {
                                                vm.visible = !vm.visible
                                                gvc.notifyDataChange(id)
                                            })}">
<i class="fa-regular fa-eye" ></i>
</button>
</div>`
                                        },
                                        divCreate: {}
                                    }
                                }),
                            ].join(''),
                        )
                    ].join('<div class="my-3"></div>'), 600))
                })
            }
        }
    })
})