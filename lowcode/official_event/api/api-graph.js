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
import { BaseApi } from "../../glitterBundle/api/base.js";
import { EditorElem } from "../../glitterBundle/plugins/editor-elem.js";
import { GlobalUser } from "../../glitter-base/global/global-user.js";
TriggerEvent.createSingleEvent(import.meta.url, (glitter) => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            var _a, _b, _c, _d, _e;
            object.postEvent = (_a = object.postEvent) !== null && _a !== void 0 ? _a : {};
            object.postType = (_b = object.postType) !== null && _b !== void 0 ? _b : "POST";
            object.query = (_c = object.query) !== null && _c !== void 0 ? _c : {};
            object.tokenType = (_d = object.tokenType) !== null && _d !== void 0 ? _d : 'user';
            object.queryExpand = (_e = object.queryExpand) !== null && _e !== void 0 ? _e : {};
            return {
                editor: () => {
                    return gvc.bindView(() => {
                        const id = gvc.glitter.getUUID();
                        return {
                            bind: id,
                            view: () => {
                                var _a;
                                return [
                                    EditorElem.select({
                                        title: "方法",
                                        gvc: gvc,
                                        def: object.postType,
                                        array: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
                                        callback: (text) => {
                                            object.postType = text;
                                            gvc.notifyDataChange(id);
                                        }
                                    }),
                                    EditorElem.select({
                                        title: "夾帶Token類型",
                                        gvc: gvc,
                                        def: object.tokenType,
                                        array: ['user', 'manager'],
                                        callback: (text) => {
                                            object.tokenType = text;
                                            gvc.notifyDataChange(id);
                                        }
                                    }),
                                    gvc.glitter.htmlGenerate.editeInput({
                                        gvc: gvc,
                                        title: "Router路徑",
                                        default: (_a = object.router) !== null && _a !== void 0 ? _a : "",
                                        placeHolder: "請輸入路徑",
                                        callback: (text) => {
                                            object.router = text;
                                            gvc.notifyDataChange(id);
                                        }
                                    }),
                                    TriggerEvent.editer(gvc, widget, object.query, {
                                        hover: false,
                                        option: [],
                                        title: "QueryParameters"
                                    }),
                                    (object.postType === 'GET') ? `` :
                                        TriggerEvent.editer(gvc, widget, object.postEvent, {
                                            hover: false,
                                            option: [],
                                            title: "BODY"
                                        })
                                ].join(`<div class="my-2"></div>`);
                            }
                        };
                    });
                },
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        const data = (yield TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.postEvent,
                            subData: subData,
                            element: element
                        }));
                        const query = (yield TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.query,
                            subData: subData,
                            element: element
                        }));
                        BaseApi.create({
                            "url": `${getBaseUrl()}/api-public/v1/graph_api?route=${object.router}&${query}`,
                            "type": object.postType,
                            "timeout": 0,
                            "headers": {
                                "g-app": getConfig().config.appName,
                                "Content-Type": "application/json",
                                "Authorization": (object.tokenType === 'user') ? GlobalUser.token : getConfig().config.token
                            },
                            "data": (object.postType === 'GET') ? undefined : JSON.stringify({
                                "router": object.router,
                                "data": data
                            }),
                        }).then((res) => {
                            if (res.result) {
                                resolve(res.response);
                            }
                            else {
                                resolve(false);
                            }
                        });
                    }));
                }
            };
        }
    };
});
function getConfig() {
    const saasConfig = window.saasConfig;
    return saasConfig;
}
function getBaseUrl() {
    return getConfig().config.url;
}
