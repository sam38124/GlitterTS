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
TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData) => {
            var _a, _b;
            object.theme = (_a = object.theme) !== null && _a !== void 0 ? _a : {};
            object.app_name = (_b = object.app_name) !== null && _b !== void 0 ? _b : {};
            return {
                editor: () => {
                    return [TriggerEvent.editer(gvc, widget, object.theme, {
                            hover: false,
                            option: [],
                            title: '主題來源'
                        }),
                        TriggerEvent.editer(gvc, widget, object.app_name, {
                            hover: false,
                            option: [],
                            title: 'APP名稱'
                        })
                    ].join(`<div class="my-2"></div>`);
                },
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        const saasConfig = window.saasConfig;
                        const theme = yield TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.theme,
                            subData: subData,
                        });
                        const app_name = yield TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.app_name,
                            subData: subData,
                        });
                        BaseApi.create({
                            "url": saasConfig.config.url + `/api/v1/app/theme`,
                            "type": "PUT",
                            "timeout": 0,
                            "headers": {
                                "Content-Type": "application/json",
                                "Authorization": GlobalUser.saas_token
                            },
                            "data": JSON.stringify({
                                "theme": theme,
                                "app_name": app_name
                            })
                        }).then((d2) => {
                            resolve(true);
                        });
                    }));
                }
            };
        }
    };
});
