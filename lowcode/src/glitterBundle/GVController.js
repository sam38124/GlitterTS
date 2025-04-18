"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { GVCType } from "./module/PageManager.js";
const $ = window.$;
class LifeCycle {
    constructor() {
        this.onResume = function () {
        };
        this.onPause = function () {
        };
        this.onDestroy = function () {
        };
        this.onCreate = function () {
        };
        this.onCreateView = function () {
            return "";
        };
        this.cssInitial = function () {
            return '';
        };
    }
    notifyDataChange() {
        $('body').html(this.onCreateView());
    }
}
export class GVC {
    constructor() {
        this.glitter = window.glitter;
        this.parameter = {
            clickMap: {},
            pageConfig: undefined,
            bindViewList: {},
            clickID: 0,
            styleList: [],
            jsList: [],
            styleLinks: [],
        };
        this.recreateView = () => {
        };
    }
    notifyDataChange(id) {
        const gvc = this;
        try {
            const refresh = (id) => {
                $(`#${gvc.parameter.pageConfig.id}${id}`).html(gvc.parameter.bindViewList[id].view());
                if (gvc.parameter.bindViewList[id].onCreate) {
                    gvc.parameter.bindViewList[id].onCreate();
                }
            };
            if (typeof id === 'object') {
                id.map(function (id) {
                    refresh(id);
                });
            }
            else {
                refresh(id);
            }
        }
        catch (e) {
            if (gvc.glitter.debugMode) {
                console.log(e);
                console.log(e.stack);
                console.log(e.line);
            }
        }
    }
    addObserver(obj, callback, viewBind) {
        const gvc = this;
        try {
            if (obj.initial) {
                callback();
            }
            var map = obj.obj;
            if (!map.GlitterJsonStringConversionGetData) {
                var tMap = {};
                map.GlitterJsonStringConversionGetData = function () {
                    return tMap;
                };
            }
            if (!map.GlitterObServerCallBack) {
                var callba = [];
                map.GlitterObServerCallBack = function () {
                    return callba;
                };
            }
            if (viewBind) {
                if (map.GlitterObServerCallBack().filter(function (it) {
                    return it.viewBind === viewBind;
                }).length === 0) {
                    map.GlitterObServerCallBack().push({ key: obj.key, callback: callback, viewBind: viewBind });
                }
            }
            else {
                map.GlitterObServerCallBack().push({ key: obj.key, callback: callback });
            }
            var keys = Object.keys(map);
            for (var a = 0; a < keys.length; a++) {
                let keyVa = keys[a];
                if (keyVa !== 'GlitterJsonStringConversionGetData' && (keyVa !== 'GlitterObServerCallBack') && (keyVa === obj.key)) {
                    gvc.glitter.deBugMessage("add-" + obj.key);
                    if (!map.GlitterJsonStringConversionGetData()[keyVa]) {
                        map.GlitterJsonStringConversionGetData()[keyVa] = map[keyVa];
                    }
                    Object.defineProperty(map, keyVa, {
                        get: function () {
                            return map.GlitterJsonStringConversionGetData()[keyVa];
                        },
                        set(v) {
                            map.GlitterJsonStringConversionGetData()[keyVa] = v;
                            map.GlitterObServerCallBack().map(function (it) {
                                try {
                                    if (it.key === keyVa) {
                                        it.callback({ key: it.key, value: v });
                                    }
                                }
                                catch (e) {
                                    gvc.glitter.deBugMessage(e);
                                    gvc.glitter.deBugMessage(e.stack);
                                    gvc.glitter.deBugMessage(e.line);
                                }
                            });
                        }
                    });
                }
            }
            if (map[obj.key] === undefined) {
                map[obj.key] = '';
                Object.defineProperty(map, obj.key, {
                    get: function () {
                        return map.GlitterJsonStringConversionGetData()[obj.key];
                    },
                    set(v) {
                        map.GlitterJsonStringConversionGetData()[obj.key] = v;
                        map.GlitterObServerCallBack().map(function (it) {
                            try {
                                if (it.key === obj.key) {
                                    it.callback({ key: it.key, value: v });
                                }
                            }
                            catch (e) {
                                gvc.glitter.deBugMessage(e);
                                gvc.glitter.deBugMessage(e.stack);
                                gvc.glitter.deBugMessage(e.line);
                            }
                        });
                    }
                });
            }
        }
        catch (e) {
            gvc.glitter.deBugMessage(e);
            gvc.glitter.deBugMessage(e.stack);
            gvc.glitter.deBugMessage(e.line);
        }
    }
    bindView(map) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const gvc = this;
        if (typeof map === "function") {
            map = map();
        }
        if (map.dataList) {
            map.dataList.map(function (data) {
                var _a;
                $(`#${(_a = gvc.parameter.pageConfig) === null || _a === void 0 ? void 0 : _a.id}${map.bind}`).html(map.view());
                gvc.addObserver(data, function () {
                    var _a;
                    $(`#${(_a = gvc.parameter.pageConfig) === null || _a === void 0 ? void 0 : _a.id}${map.bind}`).html(map.view());
                    if (map.onCreate()) {
                        map.onCreate();
                    }
                });
            });
        }
        gvc.parameter.bindViewList[map.bind] = map;
        if (document.getElementById(((_a = gvc.parameter.pageConfig) === null || _a === void 0 ? void 0 : _a.id) + map.bind)) {
            $(`#${(_b = gvc.parameter.pageConfig) === null || _b === void 0 ? void 0 : _b.id}${map.bind}`).html(map.view());
        }
        if (map.onCreate) {
            var timer = setInterval(function () {
                if (document.getElementById(gvc.parameter.pageConfig.id + map.bind)) {
                    map.onCreate();
                    clearInterval(timer);
                }
            }, 100);
        }
        if (map.inital) {
            map.inital();
        }
        if (map.divCreate) {
            return `
<${(_c = map.divCreate.elem) !== null && _c !== void 0 ? _c : 'div'} id="${(_d = gvc.parameter.pageConfig) === null || _d === void 0 ? void 0 : _d.id}${map.bind}" class="${(_e = map.divCreate.class) !== null && _e !== void 0 ? _e : ""}" style="${(_f = map.divCreate.style) !== null && _f !== void 0 ? _f : ""}" 
${gvc.map(((_g = map.divCreate.option) !== null && _g !== void 0 ? _g : []).map((dd) => {
                return ` ${dd.key}="${dd.value}"`;
            }))}
>${map.view()}</${(_h = map.divCreate.elem) !== null && _h !== void 0 ? _h : 'div'}>
`;
        }
        else {
            return map.view();
        }
    }
    event(fun, noCycle) {
        const gvc = this;
        if (noCycle === undefined) {
            gvc.parameter.clickID++;
            gvc.parameter.clickMap[`${gvc.parameter.clickID}`] = {
                fun: fun,
                noCycle: false
            };
            return `clickMap['${gvc.parameter.pageConfig.id}']['${gvc.parameter.clickID}'].fun(this,event);" data-gs-event-${gvc.parameter.clickID}="event`;
        }
        else {
            gvc.parameter.clickMap[noCycle] = {
                fun: fun,
                noCycle: true
            };
            return `clickMap['${gvc.parameter.pageConfig.id}']['${noCycle}'].fun(this,event);"  data-gs-event-${noCycle}="event`;
        }
    }
    addStyle(style) {
        const gvc = this;
        let sl = {
            id: gvc.glitter.getUUID(),
            style: style
        };
        if (!gvc.parameter.styleList.find((dd) => {
            return dd.style === style;
        })) {
            var css = document.createElement('style');
            css.type = 'text/css';
            css.id = sl.id;
            if (css.styleSheet)
                css.styleSheet.cssText = style;
            else
                css.appendChild(document.createTextNode(style));
            document.getElementsByTagName("head")[0].appendChild(css);
            gvc.parameter.styleList.push(sl);
        }
    }
    addStyleLink(fs) {
        return __awaiter(this, void 0, void 0, function* () {
            const gvc = this;
            function add(filePath) {
                var head = document.head;
                const id = gvc.glitter.getUUID();
                var link = document.createElement("link");
                link.type = "text/css";
                link.rel = "stylesheet";
                link.href = filePath;
                link.id = id;
                if (!gvc.parameter.styleLinks.find((dd) => {
                    return dd.src === filePath;
                })) {
                    gvc.parameter.styleLinks.push({
                        id: id,
                        src: filePath
                    });
                    head.appendChild(link);
                }
            }
            if (typeof fs === 'string') {
                add(fs);
            }
            else {
                fs.map((dd) => {
                    add(dd);
                });
            }
        });
    }
    addMtScript(urlArray, success, error) {
        const glitter = this.glitter;
        const that = this;
        let index = 0;
        function addScript() {
            var _a, _b, _c, _d;
            if (index === urlArray.length) {
                success();
                return;
            }
            var scritem = urlArray[index];
            scritem.id = glitter.getUUID();
            if (that.parameter.jsList.find((dd) => {
                return dd.src === scritem.src;
            })) {
                index++;
                addScript();
                return;
            }
            that.parameter.jsList.push(scritem);
            let script = document.createElement('script');
            try {
                if (script.readyState) {
                    script.onreadystatechange = () => {
                        if (script.readyState === "loaded" || script.readyState === "complete") {
                            script.onreadystatechange = null;
                            index++;
                            addScript();
                        }
                    };
                }
                else {
                    script.onload = () => {
                        if (success !== undefined) {
                            index++;
                            addScript();
                        }
                    };
                }
                if (scritem.type === 'text/babel') {
                    glitter.$('body').append(`<script type="text/babel" src="${scritem.src}"></script>`);
                }
                else if (scritem.type !== undefined) {
                    script.setAttribute('type', scritem.type);
                    script.setAttribute('src', (_a = scritem.src) !== null && _a !== void 0 ? _a : scritem);
                    script.setAttribute('id', (_b = scritem.id) !== null && _b !== void 0 ? _b : undefined);
                    document.getElementsByTagName("head")[0].appendChild(script);
                }
                else {
                    script.setAttribute('src', (_c = scritem.src) !== null && _c !== void 0 ? _c : scritem);
                    script.setAttribute('id', (_d = scritem.id) !== null && _d !== void 0 ? _d : undefined);
                    document.getElementsByTagName("head")[0].appendChild(script);
                }
            }
            catch (e) {
                error(`Add ${urlArray[index]} ERROR!!`);
            }
        }
        addScript();
    }
    id(id) {
        const gvc = this;
        return `${gvc.parameter.pageConfig.id}${id}`;
    }
    map(array) {
        let html = '';
        array.map((d) => {
            html += d;
        });
        return html;
    }
}
export function init(fun, gt) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const glitter = (_a = (gt)) !== null && _a !== void 0 ? _a : window.glitter;
    const gvc = new GVC();
    gvc.glitter = glitter;
    gvc.parameter.pageConfig = glitter.nowPageConfig;
    const pageData = fun(gvc, glitter, (_b = glitter.nowPageConfig) === null || _b === void 0 ? void 0 : _b.obj);
    if (!glitter.modelJsList.find((data) => {
        var _a;
        return data.src === ((_a = glitter.nowPageConfig) === null || _a === void 0 ? void 0 : _a.src);
    })) {
        glitter.modelJsList.push({
            src: glitter.nowPageConfig.src,
            create: (glitter) => {
                init(fun, window.glitter);
            }
        });
    }
    console.log(JSON.stringify(glitter.modelJsList));
    const lifeCycle = new LifeCycle();
    lifeCycle.onResume = (_c = pageData.onResume) !== null && _c !== void 0 ? _c : lifeCycle.onResume;
    lifeCycle.onPause = (_d = pageData.onPause) !== null && _d !== void 0 ? _d : lifeCycle.onPause;
    lifeCycle.onDestroy = (_e = pageData.onDestroy) !== null && _e !== void 0 ? _e : lifeCycle.onDestroy;
    lifeCycle.onCreate = (_f = pageData.onCreate) !== null && _f !== void 0 ? _f : lifeCycle.onCreate;
    lifeCycle.onCreateView = pageData.onCreateView;
    lifeCycle.cssInitial = (_g = pageData.cssInitial) !== null && _g !== void 0 ? _g : lifeCycle.cssInitial;
    gvc.recreateView = () => {
        $(`#page${gvc.parameter.pageConfig.id}`).html(lifeCycle.onCreateView());
    };
    if ($('.page-loading').length > 0) {
        $('.page-loading').remove();
    }
    window.clickMap = (_h = window.clickMap) !== null && _h !== void 0 ? _h : {};
    switch ((_j = gvc.parameter.pageConfig) === null || _j === void 0 ? void 0 : _j.type) {
        case GVCType.Dialog:
            $('#page' + gvc.parameter.pageConfig.id).html(lifeCycle.onCreateView());
            glitter.setAnimation(gvc.parameter.pageConfig);
            break;
        case GVCType.Page:
            $('#page' + gvc.parameter.pageConfig.id).html(lifeCycle.onCreateView());
            glitter.setAnimation(gvc.parameter.pageConfig);
            break;
    }
    window.clickMap[gvc.parameter.pageConfig.id] = gvc.parameter.clickMap;
    lifeCycle.onCreate();
    gvc.parameter.pageConfig.deleteResource = () => {
        window.clickMap[gvc.parameter.pageConfig.id] = undefined;
        lifeCycle.onPause();
        gvc.parameter.styleLinks.map((dd) => {
            $(`#${dd.id}`).remove();
        });
        gvc.parameter.styleList.map((dd) => {
            $(`#${dd.id}`).remove();
        });
        gvc.parameter.jsList.map((dd) => {
            $(`#${dd.id}`).remove();
        });
    };
}
