var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { TriggerEvent } from "../../glitterBundle/plugins/trigger-event.js";
import { ApiPageConfig } from "../../api/pageConfig.js";
import { ShareDialog } from "../../glitterBundle/dialog/ShareDialog.js";
TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData) => {
            var _a, _b, _c;
            object.deleteApp = (_a = object.deleteApp) !== null && _a !== void 0 ? _a : {};
            object.success = (_b = object.success) !== null && _b !== void 0 ? _b : {};
            object.error = (_c = object.error) !== null && _c !== void 0 ? _c : {};
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.deleteApp, {
                            hover: false,
                            option: [],
                            title: '取得刪除的專案名稱'
                        }),
                        TriggerEvent.editer(gvc, widget, object.success, {
                            hover: false,
                            option: [],
                            title: '刪除成功事件'
                        }),
                        TriggerEvent.editer(gvc, widget, object.error, {
                            hover: false,
                            option: [],
                            title: '刪除失敗事件'
                        })
                    ].join(`<div class="my-2"></div>`);
                },
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        const deleteAPP = yield TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.deleteApp,
                            subData: subData,
                        });
                        const dialog = new ShareDialog(gvc.glitter);
                        dialog.dataLoading({ visible: true });
                        const response = yield ApiPageConfig.deleteApp(deleteAPP);
                        dialog.dataLoading({ visible: false });
                        if (response.result) {
                            yield TriggerEvent.trigger({
                                gvc: gvc,
                                widget: widget,
                                clickEvent: object.success,
                                subData: subData,
                            });
                        }
                        else {
                            yield TriggerEvent.trigger({
                                gvc: gvc,
                                widget: widget,
                                clickEvent: object.error,
                                subData: subData,
                            });
                        }
                        resolve(response.result);
                    }));
                }
            };
        }
    };
});
