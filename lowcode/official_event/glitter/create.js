var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { GlobalUser } from "../../glitter-base/global/global-user.js";
import { TriggerEvent } from "../../glitterBundle/plugins/trigger-event.js";
import { BaseApi } from "../../glitterBundle/api/base.js";
import { ShareDialog } from "../../dialog/ShareDialog.js";
TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData) => {
            return {
                editor: () => {
                    var _a;
                    object.comefrom = (_a = object.comefrom) !== null && _a !== void 0 ? _a : {};
                    return TriggerEvent.editer(gvc, widget, object.comefrom, {
                        hover: false,
                        option: [],
                        title: '複製專案來源'
                    });
                },
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        const createAPP = yield TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.comefrom,
                            subData: subData,
                        });
                        const glitter = window.glitter;
                        const shareDialog = new ShareDialog(glitter);
                        const html = String.raw;
                        function run() {
                            if (!widget.data.createAPP) {
                                shareDialog.errorMessage({ text: "請輸入APP名稱" });
                                return;
                            }
                            const saasConfig = window.saasConfig;
                            shareDialog.dataLoading({
                                visible: true
                            });
                            BaseApi.create({
                                "url": saasConfig.config.url + `/api/v1/app`,
                                "type": "POST",
                                "timeout": 0,
                                "headers": {
                                    "Content-Type": "application/json",
                                    "Authorization": GlobalUser.token
                                },
                                "data": JSON.stringify({
                                    "domain": '',
                                    "appName": widget.data.createAPP,
                                    "copyApp": createAPP,
                                    "copyWith": ["checkout", "manager_post", "user_post", "user", "public_config"]
                                })
                            }).then((d2) => {
                                shareDialog.dataLoading({ visible: false });
                                if (d2.result) {
                                    const url = new URL(location.href);
                                    url.searchParams.set("type", "editor");
                                    url.searchParams.set("page", "");
                                    url.searchParams.set("appName", widget.data.createAPP);
                                    location.href = url.href;
                                }
                                else {
                                    shareDialog.errorMessage({ text: "創建失敗，此名稱已被使用!" });
                                }
                            });
                        }
                        if (gvc.glitter.getCookieByName('glitterToken') === undefined) {
                            shareDialog.errorMessage({ text: "請先登入" });
                            return;
                        }
                        gvc.glitter.innerDialog((gvc) => {
                            return html `
                            <div class="modal-content bg-white rounded-3 p-3" style="max-width:90%;width:400px;">
                                <div class="modal-body">
                                    <div class="ps-1 pe-1">
                                        <div class="mb-3">
                                            <label for="username" class="form-label">APP名稱</label>
                                            <input class="form-control" type="text" id="userName" required=""
                                                   placeholder="請輸入APP名稱" onchange="${gvc.event((e) => {
                                widget.data.createAPP = e.value;
                            })}">
                                        </div>
                                    </div>
                                    <div class="modal-footer mb-0 pb-0">
                                        <button type="button" class="btn btn-outline-dark me-2" onclick="${gvc.event(() => {
                                gvc.closeDialog();
                            })}">取消
                                        </button>
                                        <button type="button" class="btn btn-primary-c" onclick="${gvc.event(() => {
                                run();
                            })}">確認添加
                                        </button>
                                    </div>
                                </div>
                            </div>`;
                        }, "Add");
                        resolve(true);
                    }));
                }
            };
        }
    };
});
