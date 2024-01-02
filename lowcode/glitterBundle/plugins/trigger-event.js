var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
                    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                        glitter.htmlGenerate.loadEvent(glitter, [
                            {
                                src: url,
                                callback: (data) => __awaiter(this, void 0, void 0, function* () {
                                    resolve((yield data.fun(gvc, widget, obj, subData, element).event()));
                                })
                            }
                        ]);
                    }));
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
                }
            };
        };
    }
    static createSingleEvent(url, fun) {
        const glitter = window.glitter;
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
        let returnData = '';
        function run(event) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    function pass(inter) {
                        var _a;
                        return __awaiter(this, void 0, void 0, function* () {
                            try {
                                const time = new Date();
                                const gvc = oj.gvc;
                                const subData = oj.subData;
                                const widget = oj.widget;
                                let passCommand = false;
                                returnData = yield inter[event.clickEvent.route].fun(oj.gvc, oj.widget, event, oj.subData, oj.element).event();
                                const response = returnData;
                                if (event.dataPlace) {
                                    eval(event.dataPlace);
                                }
                                oj.subData = response;
                                if (event.blockCommand) {
                                    try {
                                        if (event.blockCommandV2) {
                                            passCommand = eval(`(() => {
                                        ${event.blockCommand}
                                    })()`);
                                        }
                                        else {
                                            passCommand = eval(event.blockCommand);
                                        }
                                    }
                                    catch (e) {
                                        alert(event.blockCommandV2);
                                        console.log(e);
                                    }
                                }
                                if (passCommand) {
                                    resolve("blockCommand");
                                }
                                else {
                                    resolve(true);
                                }
                            }
                            catch (e) {
                                returnData = (_a = event.errorCode) !== null && _a !== void 0 ? _a : "";
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
            });
        }
        if (oj.clickEvent !== undefined && Array.isArray(oj.clickEvent.clickEvent)) {
            arrayEvent = oj.clickEvent.clickEvent;
        }
        else if (oj.clickEvent !== undefined) {
            arrayEvent = [JSON.parse(JSON.stringify(oj.clickEvent))];
        }
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let result = true;
            for (const a of arrayEvent) {
                let blockCommand = false;
                result = yield new Promise((resolve, reject) => {
                    function check() {
                        run(a).then((res) => {
                            if (res === 'blockCommand') {
                                blockCommand = true;
                                resolve(true);
                            }
                            else {
                                resolve(res);
                            }
                        });
                    }
                    check();
                });
                if (!result || blockCommand) {
                    break;
                }
            }
            resolve(returnData);
        }));
    }
    static editer(gvc, widget, obj, option = { hover: false, option: [] }) {
        const glitter = window.glitter;
        if (TriggerEvent.isEditMode()) {
            return glitter.share.editorBridge['TriggerEventBridge'].editer(gvc, widget, obj, option);
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
