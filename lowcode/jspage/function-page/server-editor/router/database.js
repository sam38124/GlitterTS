var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BgWidget } from "../../../../backend-manager/bg-widget.js";
import { EditorElem } from "../../../../glitterBundle/plugins/editor-elem.js";
import { BackendServer } from "../../../../api/backend-server.js";
window.glitter.setModule(import.meta.url, (gvc) => {
    return gvc.bindView(() => {
        const id = gvc.glitter.getUUID();
        return {
            bind: id,
            view: () => {
                return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                    const response = (yield BackendServer.getDatabaseAddress()).response;
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
                                const id = gvc.glitter.getUUID();
                                let vm = {
                                    visible: false
                                };
                                return {
                                    bind: id,
                                    view: () => {
                                        return `<div class="d-flex">
${(() => {
                                            if (vm.visible) {
                                                return `<input class="form-control"  value="${response.sql_pwd}" type="text" readonly>`;
                                            }
                                            else {
                                                return `<input class="form-control"  value="${response.sql_pwd}" type="password" readonly>`;
                                            }
                                        })()}
<button class="btn btn-secondary ms-2" style="width:20px;" onclick="${gvc.event(() => {
                                            vm.visible = !vm.visible;
                                            gvc.notifyDataChange(id);
                                        })}">
<i class="fa-regular fa-eye" ></i>
</button>
</div>`;
                                    },
                                    divCreate: {}
                                };
                            }),
                        ].join(''))
                    ].join('<div class="my-3"></div>'), 600));
                }));
            }
        };
    });
});
