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
import { GVCType, PageManager } from "./module/PageManager.js";
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
        this.parameter = {
            clickMap: {},
            pageConfig: undefined,
            bindViewList: {},
            clickID: 0,
            styleList: [],
            jsList: [],
            styleLinks: [],
        };
        this.style_list = {};
        this.share = {};
        this.recreateView = () => {
        };
    }
    get glitter() {
        return window.glitter;
    }
    static get glitter() {
        return window.glitter;
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
                gvc.glitter.elementCallback[gvc.id(id)] && gvc.glitter.elementCallback[gvc.id(id)].element && gvc.glitter.elementCallback[gvc.id(id)].element.recreateView && gvc.glitter.elementCallback[gvc.id(id)].element.recreateView();
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
        return $(gvc.glitter.elementCallback[gvc.id(id)].element);
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
    getStyleCheckSum(style) {
        var _a, _b;
        const gvc = this;
        const style_check_sum = gvc.glitter.generateCheckSum(style);
        if (!GVC.add_style_string.find((dd) => {
            return dd === style_check_sum;
        })) {
            gvc.glitter.share._style_string = (_a = gvc.glitter.share._style_string) !== null && _a !== void 0 ? _a : '';
            gvc.glitter.share._style_get_running = (_b = gvc.glitter.share._style_get_running) !== null && _b !== void 0 ? _b : false;
            GVC.add_style_string.push(style_check_sum);
            gvc.glitter.share._style_string += `\n.s${style_check_sum} {
                        ${style || ''}
                        }\n`;
            if (!gvc.glitter.share._style_get_running) {
                gvc.glitter.share._style_get_running = true;
                setTimeout(() => {
                    gvc.addStyle(gvc.glitter.share._style_string);
                    gvc.glitter.share._style_string = '';
                    gvc.glitter.share._style_get_running = false;
                }, 5);
            }
        }
        return `s${style_check_sum}`;
    }
    bindView(map) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
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
        const bind_id = gvc.id(map.bind);
        gvc.glitter.elementCallback[bind_id].onInitial = (_a = map.onInitial) !== null && _a !== void 0 ? _a : (() => {
        });
        gvc.glitter.elementCallback[bind_id].onCreate = (_b = map.onCreate) !== null && _b !== void 0 ? _b : (() => {
        });
        gvc.glitter.elementCallback[bind_id].onDestroy = (_c = map.onDestroy) !== null && _c !== void 0 ? _c : (() => {
        });
        gvc.glitter.elementCallback[bind_id].getView = map.view;
        gvc.glitter.elementCallback[bind_id].updateAttribute = (() => {
            var _a, _b;
            try {
                const id = gvc.id(map.bind);
                const divCreate2 = (typeof map.divCreate === "function") ? map.divCreate() : map.divCreate;
                if (divCreate2) {
                    ((_a = divCreate2.option) !== null && _a !== void 0 ? _a : []).concat({ key: 'class', value: ((_b = divCreate2.class) !== null && _b !== void 0 ? _b : '').split(' ').filter((dd) => { return dd; }).join(' ').replace(/\n/g, '') + ` ${this.getStyleCheckSum(divCreate2.style || '')}` }).map((dd) => {
                        try {
                            gvc.glitter.renderView.replaceAttributeValue(dd, document.querySelector(`[gvc-id="${id}"]`));
                        }
                        catch (e) {
                            gvc.glitter.deBugMessage(e);
                        }
                    });
                }
            }
            catch (e) {
                console.log(e);
            }
        });
        if ((typeof gvc.glitter.elementCallback[bind_id].initial_view === 'string')) {
        }
        const divCreate = (_d = ((typeof map.divCreate === "function") ? map.divCreate() : map.divCreate)) !== null && _d !== void 0 ? _d : { elem: 'div' };
        return `<${(_e = divCreate.elem) !== null && _e !== void 0 ? _e : 'div'}  class="${((_f = divCreate.class) !== null && _f !== void 0 ? _f : "").split(' ').filter((dd) => { return dd; }).join(' ').replace(/\n/g, '')} ${this.getStyleCheckSum(divCreate.style || '')}" 
 glem="bindView"  gvc-id="${bind_id}"
 ${gvc.map(((_g = divCreate.option) !== null && _g !== void 0 ? _g : []).map((dd) => {
            return ` ${dd.key}="${dd.value}"`;
        }))}
>
${(typeof gvc.glitter.elementCallback[bind_id].initial_view === 'string') ? gvc.glitter.elementCallback[bind_id].initial_view : ``}
</${(_h = divCreate.elem) !== null && _h !== void 0 ? _h : 'div'}>`;
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
        this.glitter.addStyle(style);
    }
    addStyleLink(fs) {
        return __awaiter(this, void 0, void 0, function* () {
            const gvc = this;
            gvc.glitter.addStyleLink(fs);
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
GVC.initial = false;
GVC.add_style_string = [];
export function init(metaURL, fun) {
    var _a;
    GVC.glitter.share.GVControllerList = (_a = GVC.glitter.share.GVControllerList) !== null && _a !== void 0 ? _a : {};
    GVC.glitter.share.GVControllerList[metaURL] = (cf) => {
        var _a, _b, _c, _d, _e, _f;
        const gvc = new GVC();
        cf.pageConfig.gvc = gvc;
        gvc.parameter.pageConfig = cf.pageConfig;
        window.clickMap = (_a = window.clickMap) !== null && _a !== void 0 ? _a : {};
        window.clickMap[cf.pageConfig.id] = gvc.parameter.clickMap;
        const lifeCycle = new LifeCycle();
        const pageData = fun(gvc, GVC.glitter, cf.pageConfig.obj);
        lifeCycle.onResume = (_b = pageData.onResume) !== null && _b !== void 0 ? _b : lifeCycle.onResume;
        lifeCycle.onPause = (_c = pageData.onPause) !== null && _c !== void 0 ? _c : lifeCycle.onPause;
        lifeCycle.onDestroy = (_d = pageData.onDestroy) !== null && _d !== void 0 ? _d : lifeCycle.onDestroy;
        lifeCycle.onCreate = (_e = pageData.onCreate) !== null && _e !== void 0 ? _e : lifeCycle.onCreate;
        lifeCycle.onCreateView = pageData.onCreateView;
        lifeCycle.cssInitial = (_f = pageData.cssInitial) !== null && _f !== void 0 ? _f : lifeCycle.cssInitial;
        gvc.recreateView = () => {
            $(`#page${cf.pageConfig.id}`).html(lifeCycle.onCreateView());
        };
        if ($('.page-loading').length > 0) {
            $('.page-loading').remove();
        }
        cf.pageConfig.createResource = () => {
            window.clickMap[cf.pageConfig.id] = gvc.parameter.clickMap;
            lifeCycle.onResume();
            lifeCycle.onCreate();
        };
        cf.pageConfig.deleteResource = (destroy) => {
            window.clickMap[cf.pageConfig.id] = undefined;
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
        if (cf.pageConfig.type === GVCType.Page) {
            if (cf.pageConfig.push_stack) {
                PageManager.setHistory(cf.pageConfig.tag, cf.c_type);
            }
            cf.pageConfig.carry_search.map((dd) => {
                gvc.glitter.setUrlParameter(dd.key, dd.value);
            });
            gvc.glitter.setUrlParameter('page', cf.pageConfig.tag);
            $('#glitterPage').append(`<div id="page${cf.pageConfig.id}" style="min-width: 100vw;min-height: 100vh;left: 0;top: 0;width:100vw;
background: ${cf.pageConfig.backGroundColor};z-index: 9999;overflow: hidden;display:none;" class="page-box">
${lifeCycle.onCreateView()}
</div>`);
        }
        else {
            $('#glitterPage').append(`<div id="page${cf.pageConfig.id}" style="min-width: 100vw;min-height: 100vh;left: 0;top: 0;
background: ${cf.pageConfig.backGroundColor};display: none;z-index:99999;overflow: hidden;position: fixed;width:100vw;height: 100vh;" class="page-box">
${lifeCycle.onCreateView()}
</div>`);
        }
        gvc.glitter.setAnimation(cf.pageConfig);
        lifeCycle.onCreate();
        gvc.glitter.defaultSetting.pageLoadingFinish();
    };
}
