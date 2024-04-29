import {TriggerEvent} from "../../glitterBundle/plugins/trigger-event.js";
import {ShareDialog} from "../../glitterBundle/dialog/ShareDialog.js";
import {BaseApi} from "../../glitterBundle/api/base.js";
import {EditorElem} from "../../glitterBundle/plugins/editor-elem.js";
import {GlobalUser} from "../../glitter-base/global/global-user.js";

TriggerEvent.createSingleEvent(import.meta.url, (glitter) => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            object.postEvent = object.postEvent ?? {};
            object.postType = object.postType ?? "POST";
            object.query = object.query ?? {};
            object.tokenType= object.tokenType ?? 'user'
            object.queryExpand = object.queryExpand ?? {};
            return {
                editor: () => {
                    return gvc.bindView(() => {
                        const id = gvc.glitter.getUUID()
                        return {
                            bind: id,
                            view: () => {
                                return [
                                    EditorElem.select({
                                        title: "方法",
                                        gvc: gvc,
                                        def: object.postType,
                                        array: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
                                        callback: (text) => {
                                            object.postType = text
                                            gvc.notifyDataChange(id)
                                        }
                                    }),
                                    EditorElem.select({
                                        title: "夾帶Token類型",
                                        gvc: gvc,
                                        def: object.tokenType,
                                        array: ['user','manager'],
                                        callback: (text) => {
                                            object.tokenType = text
                                            gvc.notifyDataChange(id)
                                        }
                                    }),
                                    gvc.glitter.htmlGenerate.editeInput({
                                        gvc: gvc,
                                        title: "Router路徑",
                                        default: object.router ?? "",
                                        placeHolder: "請輸入路徑",
                                        callback: (text) => {
                                            object.router = text
                                            gvc.notifyDataChange(id)
                                        }
                                    }),
                                    TriggerEvent.editer(gvc, widget, object.query, {
                                        hover: false,
                                        option: [],
                                        title: "QueryParameters"
                                    }),
                                    (object.postType === 'GET') ? ``:
                                    TriggerEvent.editer(gvc, widget, object.postEvent, {
                                        hover: false,
                                        option: [],
                                        title: "BODY"
                                    })
                                ].join(`<div class="my-2"></div>`)
                            }
                        }
                    })
                },
                event: () => {
                    return new Promise(async (resolve, reject) => {
                        const data = (await TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.postEvent,
                            subData: subData,
                            element: element
                        }));
                        const query = (await TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.query,
                            subData: subData,
                            element: element
                        }));

                        BaseApi.create({
                            "url": `${getBaseUrl()}/api-public/v1/graph_api?route=${object.router}&${query}` ,
                            "type": object.postType,
                            "timeout": 0,
                            "headers": {
                                "g-app": getConfig().config.appName,
                                "Content-Type": "application/json",
                                "Authorization": (object.tokenType === 'user') ? GlobalUser.token:getConfig().config.token
                            },
                            "data": (object.postType === 'GET') ? undefined : JSON.stringify({
                                "router": object.router,
                                "data": data
                            }),
                        }).then((res) => {
                            if (res.result) {
                                resolve(res.response)
                            } else {
                                resolve(false)
                            }
                        })
                    })
                }
            }
        }
    }
})

function getConfig() {
    const saasConfig: { config: any; api: any } = (window as any).saasConfig;
    return saasConfig
}

function getBaseUrl() {
    return getConfig().config.url
}