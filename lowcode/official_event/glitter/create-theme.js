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
            var _a, _b, _c, _d;
            object.comefrom = (_a = object.comefrom) !== null && _a !== void 0 ? _a : {};
            object.appName = (_b = object.appName) !== null && _b !== void 0 ? _b : {};
            object.theme = (_c = object.theme) !== null && _c !== void 0 ? _c : {};
            object.name = (_d = object.name) !== null && _d !== void 0 ? _d : {};
            return {
                editor: () => {
                    return [TriggerEvent.editer(gvc, widget, object.comefrom, {
                            hover: false,
                            option: [],
                            title: '複製專案來源'
                        }),
                        TriggerEvent.editer(gvc, widget, object.name, {
                            hover: false,
                            option: [],
                            title: '主題名稱'
                        }),
                        TriggerEvent.editer(gvc, widget, object.appName, {
                            hover: false,
                            option: [],
                            title: '主題標籤'
                        }),
                        TriggerEvent.editer(gvc, widget, object.theme, {
                            hover: false,
                            option: [],
                            title: 'APP來源'
                        })
                    ].join(`<div class="my-2"></div>`);
                },
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        const createAPP = yield TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.comefrom,
                            subData: subData,
                        });
                        const appName = yield TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.appName,
                            subData: subData,
                        });
                        const name = yield TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.name,
                            subData: subData,
                        });
                        const theme = yield TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.theme,
                            subData: subData,
                        });
                        const glitter = window.glitter;
                        const shareDialog = new ShareDialog(glitter);
                        const html = String.raw;
                        if (gvc.glitter.getCookieByName('glitterToken') === undefined) {
                            shareDialog.errorMessage({ text: "請先登入" });
                            return;
                        }
                        else {
                            if (!appName) {
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
                                    "Authorization": GlobalUser.saas_token
                                },
                                "data": JSON.stringify({
                                    "sub_domain": `tem-${new Date().getTime()}`,
                                    "appName": appName,
                                    "copyApp": createAPP,
                                    "brand": window.parent.glitterBase,
                                    "theme": theme,
                                    "name": name,
                                    "copyWith": []
                                })
                            }).then((d2) => {
                                shareDialog.dataLoading({ visible: false });
                                if (d2.result) {
                                    resolve(true);
                                }
                                else {
                                    shareDialog.errorMessage({ text: "創建失敗，此名稱已被使用!" });
                                    resolve(false);
                                }
                            });
                        }
                    }));
                }
            };
        }
    };
});
