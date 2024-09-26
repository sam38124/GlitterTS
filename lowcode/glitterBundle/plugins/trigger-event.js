var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DynamicCode } from "../../official_event/glitter-util/eval-code-event.js";
export class TriggerEvent {
    static getUrlParameter(url, sParam) {
        try {
            let sPageURL = url.split("?")[1], sURLVariables = sPageURL.split('&'), sParameterName, i;
            for (i = 0; i < sURLVariables.length; i++) {
                sParameterName = sURLVariables[i].split('=');
                if (sParameterName[0] === sParam) {
                    return sParameterName[1] === undefined ? undefined : decodeURIComponent(sParameterName[1]);
                }
            }
            return undefined;
        }
        catch (e) {
            return undefined;
        }
    }
    static setEventRouter(original, relative) {
        const glitter = window.glitter;
        const url = new URL(relative, original).href;
        return (gvc, widget, obj, subData, element) => {
            return {
                event: () => {
                    const event_stack = glitter.htmlGenerate.checkEventStore(glitter, url);
                    if (event_stack) {
                        const data = event_stack.fun(gvc, widget, obj, subData, element).event();
                        return data;
                    }
                    else {
                        return new Promise((resolve, reject) => {
                            glitter.htmlGenerate.loadEvent(glitter, [
                                {
                                    src: url,
                                    callback: (data) => {
                                        const response = data.fun(gvc, widget, obj, subData, element).event();
                                        if (response instanceof Promise) {
                                            response.then((data2) => {
                                                resolve(data2);
                                            });
                                        }
                                        else {
                                            console.log(`setEventRouter-end-now-${new Date().getTime()}`, response);
                                            resolve(response);
                                        }
                                    }
                                }
                            ]);
                        });
                    }
                },
                editor: () => {
                    return gvc.bindView(() => {
                        const editViewId = glitter.getUUID();
                        glitter.htmlGenerate.loadEvent(glitter, [
                            {
                                src: url,
                                callback: (data) => {
                                    gvc.notifyDataChange(editViewId);
                                }
                            }
                        ]);
                        return {
                            bind: editViewId,
                            view: () => {
                                if (!glitter.share.componentData[url]) {
                                    return ``;
                                }
                                else {
                                    return glitter.share.componentData[url].fun(gvc, widget, obj, subData, element).editor();
                                }
                            },
                            divCreate: {}
                        };
                    });
                },
                preload: () => {
                    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                        glitter.htmlGenerate.loadEvent(glitter, [
                            {
                                src: url,
                                callback: (data) => __awaiter(this, void 0, void 0, function* () {
                                })
                            }
                        ]);
                    }));
                }
            };
        };
    }
    static createSingleEvent(url, fun) {
        var _a;
        const glitter = window.glitter;
        glitter.share.componentData = (_a = glitter.share.componentData) !== null && _a !== void 0 ? _a : {};
        const val = fun(glitter);
        glitter.share.componentData[url] = val;
        return val;
    }
    static create(url, event) {
        var _a;
        const glitter = window.glitter;
        glitter.share.clickEvent = (_a = glitter.share.clickEvent) !== null && _a !== void 0 ? _a : {};
        glitter.share.clickEvent[url] = event;
    }
    static trigger(oj) {
        const glitter = window.glitter;
        let arrayEvent = [];
        let returnData = false;
        function run(event) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!event || !event.clickEvent || !event.clickEvent.src) {
                    return false;
                }
                const event_router = oj.gvc.glitter.htmlGenerate.checkJsEventStore(glitter, TriggerEvent.getLink(event.clickEvent.src), 'clickEvent');
                if (event_router) {
                    let response = event_router[event.clickEvent.route].fun(oj.gvc, oj.widget, event, oj.subData, oj.element).event();
                    if (response instanceof Promise) {
                        response = yield response;
                    }
                    oj.subData = response;
                    returnData = response;
                    return true;
                }
                else {
                    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                        function pass(inter) {
                            return __awaiter(this, void 0, void 0, function* () {
                                try {
                                    let response = inter[event.clickEvent.route].fun(oj.gvc, oj.widget, event, oj.subData, oj.element).event();
                                    if (response instanceof Promise) {
                                        response = yield response;
                                    }
                                    console.log(`returnData-end-${new Date().getTime()}-`, response);
                                    oj.subData = response;
                                    returnData = response;
                                    resolve(true);
                                }
                                catch (e) {
                                    resolve(true);
                                }
                            });
                        }
                        try {
                            oj.gvc.glitter.htmlGenerate.loadScript(oj.gvc.glitter, [{
                                    src: TriggerEvent.getLink(event.clickEvent.src),
                                    callback: (data) => {
                                        pass(data);
                                    }
                                }], 'clickEvent');
                        }
                        catch (e) {
                            resolve(false);
                        }
                    }));
                }
            });
        }
        if (oj.clickEvent !== undefined && Array.isArray(oj.clickEvent.clickEvent)) {
            arrayEvent = oj.clickEvent.clickEvent;
        }
        else if (oj.clickEvent !== undefined) {
            arrayEvent = [JSON.parse(JSON.stringify(oj.clickEvent))];
        }
        let eventText = JSON.stringify(arrayEvent).replace(/location.href=/g, `(window.glitter).href=`).replace(/`console.log`/g, `glitter.deBugMessage`);
        arrayEvent = JSON.parse(eventText);
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let result = true;
            for (const a of arrayEvent) {
                if (a && a.clickEvent && a.clickEvent.route === 'code') {
                    let response = DynamicCode.fun(oj.gvc, oj.widget, a, oj.subData, oj.element);
                    if (response instanceof Promise) {
                        response = yield response;
                    }
                    oj.subData = response;
                    returnData = response;
                }
                else {
                    result = yield run(a);
                    if (!result) {
                        break;
                    }
                }
            }
            oj.callback && oj.callback(returnData);
            resolve(returnData);
        }));
    }
    static editer(gvc, widget, obj, option = { hover: false, option: [] }) {
        var _a, _b;
        option.hover = (_a = option.hover) !== null && _a !== void 0 ? _a : false;
        option.option = (_b = option.option) !== null && _b !== void 0 ? _b : [];
        const glitter = window.glitter;
        if (TriggerEvent.isEditMode()) {
            if (!glitter.share.editorBridge) {
                return window.parent.glitter.share.editorBridge['TriggerEventBridge'].editer(gvc, widget, obj, option);
            }
            else {
                return glitter.share.editorBridge['TriggerEventBridge'].editer(gvc, widget, obj, option);
            }
        }
        else {
            return ``;
        }
    }
    static getLink(url) {
        if (window.glitter.htmlGenerate.getResourceLink) {
            return window.glitter.htmlGenerate.getResourceLink(url);
        }
        else {
            const glitter = window.glitter;
            url = glitter.htmlGenerate.resourceHook(url);
            if (!url.startsWith('http') && !url.startsWith('https')) {
                if (TriggerEvent.isEditMode()) {
                    url = new URL(`./${url}`, location.href).href;
                }
                else {
                    url = new URL(`./${url}`, location.href).href;
                }
            }
            return url;
        }
    }
    static isEditMode() {
        try {
            return window.parent.editerData !== undefined;
        }
        catch (e) {
            return false;
        }
    }
}
const interval = setInterval(() => {
    if (window.glitter) {
        window.glitter.setModule(import.meta.url, TriggerEvent);
        clearInterval(interval);
    }
}, 100);
