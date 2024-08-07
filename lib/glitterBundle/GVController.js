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
        this.share = {};
        this.recreateView = () => {
        };
    }
    closeDialog() {
        var _a;
        this.glitter.closeDiaLog((_a = this.parameter.pageConfig) === null || _a === void 0 ? void 0 : _a.tag);
    }
    getBundle() {
        var _a, _b;
        this.parameter.pageConfig.obj = (_a = this.parameter.pageConfig.obj) !== null && _a !== void 0 ? _a : {};
        return (_b = this.parameter.pageConfig) === null || _b === void 0 ? void 0 : _b.obj;
    }
    notifyDataChange(id) {
        const gvc = this;
        try {
            const refresh = (id) => {
                var _a, _b, _c;
                if (gvc.getBindViewElem(id).length === 0) {
                    return;
                }
                gvc.parameter.bindViewList[id].divCreate = (_a = gvc.parameter.bindViewList[id].divCreate) !== null && _a !== void 0 ? _a : {};
                const divCreate = (typeof gvc.parameter.bindViewList[id].divCreate === "function") ? gvc.parameter.bindViewList[id].divCreate() : gvc.parameter.bindViewList[id].divCreate;
                $(`[gvc-id="${gvc.id(id)}"]`).attr('class', (_b = divCreate.class) !== null && _b !== void 0 ? _b : "");
                $(`[gvc-id="${gvc.id(id)}"]`).attr('style', (_c = divCreate.style) !== null && _c !== void 0 ? _c : "");
                gvc.glitter.elementCallback[gvc.id(id)].updateAttribute();
                function notifyLifeCycle() {
                    if (gvc.parameter.bindViewList[id].onCreate) {
                        gvc.parameter.bindViewList[id].onCreate();
                    }
                }
                function refreshView() {
                    const view = gvc.glitter.elementCallback[gvc.id(id)].getView();
                    if (typeof view === 'string') {
                        $(`[gvc-id="${gvc.id(id)}"]`).html(view);
                        notifyLifeCycle();
                    }
                    else {
                        view.then((resolve) => {
                            $(`[gvc-id="${gvc.id(id)}"]`).html(resolve);
                            notifyLifeCycle();
                        });
                    }
                }
                refreshView();
            };
            const convID = function () {
                if (typeof id === 'object') {
                    id.map(function (id) {
                        refresh(id);
                    });
                }
                else {
                    refresh(id);
                }
            };
            convID();
        }
        catch (e) {
            if (gvc.glitter.debugMode) {
                console.log(e);
                console.log(e.stack);
                console.log(e.line);
            }
        }
    }
    getBindViewElem(id) {
        const gvc = this;
        return $(`[gvc-id="${gvc.id(id)}"]`);
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
    initialElemCallback(id) {
        var _a;
        const gvc = this;
        gvc.glitter.elementCallback[id] = (_a = gvc.glitter.elementCallback[id]) !== null && _a !== void 0 ? _a : {
            onCreate: () => {
            },
            onInitial: () => {
            },
            notifyDataChange: () => {
            },
            getView: () => {
            },
            updateAttribute: () => {
            }
        };
    }
    bindView(map) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        const gvc = this;
        if (typeof map === "function") {
            map = map();
        }
        gvc.initialElemCallback(gvc.id(map.bind));
        if (map.dataList) {
            map.dataList.map(function (data) {
                function refreshView() {
                    const view = map.view();
                    if (typeof view === 'string') {
                        $(`[gvc-id="${gvc.id(map.bind)}"]`).html(view);
                    }
                    else {
                        view.then((resolve) => {
                            $(`[gvc-id="${gvc.id(map.bind)}"]`).html(resolve);
                        });
                    }
                }
                refreshView();
                gvc.addObserver(data, function () {
                    refreshView();
                    if (map.onCreate()) {
                        map.onCreate();
                    }
                });
            });
        }
        gvc.parameter.bindViewList[map.bind] = map;
        gvc.glitter.elementCallback[gvc.id(map.bind)].onInitial = (_a = map.onInitial) !== null && _a !== void 0 ? _a : (() => { });
        gvc.glitter.elementCallback[gvc.id(map.bind)].onCreate = (_b = map.onCreate) !== null && _b !== void 0 ? _b : (() => { });
        gvc.glitter.elementCallback[gvc.id(map.bind)].onDestroy = (_c = map.onDestroy) !== null && _c !== void 0 ? _c : (() => { });
        gvc.glitter.elementCallback[gvc.id(map.bind)].getView = map.view;
        gvc.glitter.elementCallback[gvc.id(map.bind)].updateAttribute = (() => {
            var _a;
            try {
                const id = gvc.id(map.bind);
                const divCreate2 = (typeof map.divCreate === "function") ? map.divCreate() : map.divCreate;
                ((_a = divCreate2.option) !== null && _a !== void 0 ? _a : []).map((dd) => {
                    try {
                        const element = $(`[gvc-id="${id}"]`);
                        if ((dd.value.includes('clickMap') || dd.value.includes('editorEvent')) && (dd.key.substring(0, 2) === 'on')) {
                            try {
                                const funString = `${dd.value}`;
                                element.get(0).off(dd.key.substring(2));
                                element.get(0).addEventListener(dd.key.substring(2), function () {
                                    if (gvc.glitter.htmlGenerate.isEditMode() && !gvc.glitter.share.EditorMode) {
                                        if (funString.indexOf('editorEvent') !== -1) {
                                            eval(funString.replace('editorEvent', 'clickMap'));
                                        }
                                        else if (dd.key !== 'onclick') {
                                            eval(funString);
                                        }
                                    }
                                    else {
                                        eval(funString);
                                    }
                                });
                            }
                            catch (e) {
                                gvc.glitter.deBugMessage(e);
                            }
                        }
                        else {
                            element.attr(dd.key, dd.value);
                        }
                    }
                    catch (e) {
                        gvc.glitter.deBugMessage(e);
                    }
                });
            }
            catch (e) {
            }
        });
        const divCreate = (_d = ((typeof map.divCreate === "function") ? map.divCreate() : map.divCreate)) !== null && _d !== void 0 ? _d : { elem: 'div' };
        return `<${(_e = divCreate.elem) !== null && _e !== void 0 ? _e : 'div'}  class="${(_f = divCreate.class) !== null && _f !== void 0 ? _f : ""}" style="${(_g = divCreate.style) !== null && _g !== void 0 ? _g : ""}" 
 glem="bindView"  gvc-id="${gvc.id(map.bind)}"
 ${gvc.map(((_h = divCreate.option) !== null && _h !== void 0 ? _h : []).map((dd) => {
            return ` ${dd.key}="${dd.value}"`;
        }))}
></${(_j = divCreate.elem) !== null && _j !== void 0 ? _j : 'div'}>`;
    }
    event(fun, noCycle) {
        const gvc = this;
        if (noCycle === undefined) {
            gvc.parameter.clickID++;
            gvc.parameter.clickMap[`${gvc.parameter.clickID}`] = {
                fun: fun,
                noCycle: false
            };
            return `clickMap['${gvc.parameter.pageConfig.id}']['${gvc.parameter.clickID}'].fun(this,event);`;
        }
        else {
            gvc.parameter.clickMap[noCycle] = {
                fun: fun,
                noCycle: true
            };
            return `clickMap['${gvc.parameter.pageConfig.id}']['${noCycle}'].fun(this,event);`;
        }
    }
    editorEvent(fun, noCycle) {
        const gvc = this;
        if (noCycle === undefined) {
            gvc.parameter.clickID++;
            gvc.parameter.clickMap[`${gvc.parameter.clickID}`] = {
                fun: fun,
                noCycle: false
            };
            return `editorEvent['${gvc.parameter.pageConfig.id}']['${gvc.parameter.clickID}'].fun(this,event);`;
        }
        else {
            gvc.parameter.clickMap[noCycle] = {
                fun: fun,
                noCycle: true
            };
            return `editorEvent['${gvc.parameter.pageConfig.id}']['${noCycle}'].fun(this,event);`;
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
    gvc.parameter.pageConfig.deleteResource = (destroy) => {
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
        if (destroy) {
            lifeCycle.onDestroy();
        }
    };
}
