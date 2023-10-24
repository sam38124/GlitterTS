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
        const url = new URL(relative, original);
        url.searchParams.set("original", original);
        return (gvc, widget, obj, subData, element) => {
            var _a, _b, _c;
            const editViewId = glitter.getUUID();
            glitter.share.componentData = (_a = glitter.share.componentData) !== null && _a !== void 0 ? _a : {};
            let val = glitter.share.componentData[url.href];
            glitter.share.componentCallback = (_b = glitter.share.componentCallback) !== null && _b !== void 0 ? _b : {};
            glitter.share.componentCallback[url.href] = (_c = glitter.share.componentCallback[url.href]) !== null && _c !== void 0 ? _c : [];
            glitter.share.componentCallback[url.href].push((dd) => {
                glitter.share.componentData[url.href] = dd;
                gvc.notifyDataChange(editViewId);
            });
            gvc.glitter.addMtScript([
                {
                    src: url,
                    type: 'module'
                }
            ], () => {
                val = glitter.share.componentData[url.href];
                console.log('setComponent-->' + url);
            }, () => {
            });
            return {
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                        const event = yield (new Promise((resolve, reject) => {
                            const timer = setInterval(() => {
                                if (val) {
                                    resolve(val);
                                    clearInterval(timer);
                                }
                            }, 20);
                            setTimeout(() => {
                                clearInterval(timer);
                                resolve(false);
                            }, 3000);
                        }));
                        if (event) {
                            resolve((yield val.fun(gvc, widget, obj, subData, element).event()));
                        }
                        else {
                            resolve(false);
                        }
                    }));
                },
                editor: () => {
                    return gvc.bindView(() => {
                        return {
                            bind: editViewId,
                            view: () => {
                                if (!val) {
                                    return ``;
                                }
                                else {
                                    return val.fun(gvc, widget, obj, subData, element).editor();
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
        let fal = 0;
        function tryLoop() {
            try {
                let delete2 = 0;
                glitter.share.componentCallback[url].map((dd, index) => {
                    dd(val);
                    delete2 = index;
                });
                glitter.share.componentCallback[url].splice(0, delete2);
            }
            catch (e) {
                if (fal < 10) {
                    setTimeout(() => {
                        tryLoop();
                    }, 100);
                }
                fal += 1;
            }
        }
        tryLoop();
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
                    let hasRun = false;
                    function pass() {
                        var _a;
                        return __awaiter(this, void 0, void 0, function* () {
                            if (hasRun) {
                                return;
                            }
                            else {
                                hasRun = true;
                            }
                            try {
                                const time = new Date();
                                const gvc = oj.gvc;
                                const subData = oj.subData;
                                const widget = oj.widget;
                                let passCommand = false;
                                setTimeout(() => {
                                    resolve(true);
                                }, 4000);
                                returnData = yield oj.gvc.glitter.share.clickEvent[TriggerEvent.getLink(event.clickEvent.src)][event.clickEvent.route].fun(oj.gvc, oj.widget, event, oj.subData, oj.element).event();
                                const response = returnData;
                                if (event.dataPlace) {
                                    eval(event.dataPlace);
                                }
                                if (event.blockCommand) {
                                    try {
                                        passCommand = eval(event.blockCommand);
                                    }
                                    catch (e) {
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
                    let timeOut = new Date();
                    let interval = 0;
                    function checkModule() {
                        var _a;
                        try {
                            oj.gvc.glitter.share.clickEvent = (_a = oj.gvc.glitter.share.clickEvent) !== null && _a !== void 0 ? _a : {};
                            if (!oj.gvc.glitter.share.clickEvent[TriggerEvent.getLink(event.clickEvent.src)]) {
                                oj.gvc.glitter.addMtScript([
                                    { src: `${TriggerEvent.getLink(event.clickEvent.src)}`, type: 'module' }
                                ], () => { }, () => {
                                    clearInterval(interval);
                                    resolve(false);
                                });
                            }
                            else {
                                clearInterval(interval);
                                pass();
                            }
                        }
                        catch (e) {
                            clearInterval(interval);
                            resolve(false);
                        }
                    }
                    checkModule();
                    interval = setInterval(() => {
                        checkModule();
                        if (((new Date().getTime()) - timeOut.getTime()) / 1000 > 4) {
                            clearInterval(interval);
                        }
                    }, 50);
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
