var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Glitter } from '../Glitter.js';
import autosize from '../plugins/autosize.js';
import { widgetComponent } from "../html-component/widget.js";
import { codeComponent } from "../html-component/code.js";
import { TriggerEvent } from "../plugins/trigger-event.js";
import { EditorElem } from "../plugins/editor-elem.js";
import { Storage } from "../helper/storage.js";
import { GlobalEvent } from "../api/global-event.js";
export class HtmlGenerate {
    constructor(setting, hover = [], subData, root) {
        this.initialFunction = () => {
        };
        const editContainer = window.glitter.getUUID();
        this.setting = setting;
        this.initialFunction = () => {
            var _a;
            hover = [Storage.lastSelect];
            const formData = setting.formData;
            subData = subData !== null && subData !== void 0 ? subData : {};
            let share = {};
            HtmlGenerate.share.false = (_a = HtmlGenerate.share.false) !== null && _a !== void 0 ? _a : {};
            setting.map((dd) => {
                var _a, _b, _c, _d, _e, _f;
                dd.css = (_a = dd.css) !== null && _a !== void 0 ? _a : {};
                dd.css.style = (_b = dd.css.style) !== null && _b !== void 0 ? _b : {};
                dd.css.class = (_c = dd.css.class) !== null && _c !== void 0 ? _c : {};
                dd.refreshAllParameter = (_d = dd.refreshAllParameter) !== null && _d !== void 0 ? _d : {
                    view1: () => {
                    },
                    view2: () => {
                    },
                };
                dd.refreshComponentParameter = (_e = dd.refreshComponentParameter) !== null && _e !== void 0 ? _e : {
                    view1: () => {
                    },
                    view2: () => {
                    },
                };
                dd.refreshAll = () => {
                    dd.refreshAllParameter.view1();
                    dd.refreshAllParameter.view2();
                };
                dd.refreshComponent = () => {
                    try {
                        dd.refreshComponentParameter.view1();
                        dd.refreshComponentParameter.view2();
                    }
                    catch (e) {
                        window.glitter.deBugMessage(`${e.message}<br>${e.stack}<br>${e.line}`);
                    }
                };
                dd.formData = (_f = dd.formData) !== null && _f !== void 0 ? _f : formData;
                dd.event = (key, subData) => {
                    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                        GlobalEvent.getGlobalEvent({
                            tag: key
                        }).then((d2) => __awaiter(this, void 0, void 0, function* () {
                            try {
                                const event = d2.response.result[0];
                                const response = yield TriggerEvent.trigger({
                                    gvc: dd.global.gvc,
                                    widget: dd,
                                    clickEvent: event.json,
                                    subData: subData
                                });
                                resolve(response);
                            }
                            catch (e) {
                                resolve(false);
                            }
                        }));
                    }));
                };
                return dd;
            });
            function loop(array) {
                array.map((dd) => {
                    var _a;
                    if (dd.type === 'container') {
                        loop((_a = dd.data.setting) !== null && _a !== void 0 ? _a : []);
                    }
                    if (!dd.storage) {
                        let storage = {};
                        Object.defineProperty(dd, "storage", {
                            get: function () {
                                return storage;
                            },
                            set(v) {
                                storage = v;
                            }
                        });
                    }
                    if (!dd.share) {
                        Object.defineProperty(dd, "share", {
                            get: function () {
                                return share;
                            },
                            set(v) {
                                share = v;
                            }
                        });
                    }
                    if (!dd.bundle) {
                        Object.defineProperty(dd, "bundle", {
                            get: function () {
                                return subData !== null && subData !== void 0 ? subData : {};
                            },
                            set(v) {
                                subData = v;
                            }
                        });
                    }
                });
            }
            loop(setting);
        };
        this.initialFunction();
        this.render = (gvc, option = {
            class: ``,
            style: ``,
            containerID: gvc.glitter.getUUID(),
            jsFinish: () => {
            },
            onCreate: () => {
            }
        }, createOption) => {
            var _a, _b;
            const document = (_a = option.document) !== null && _a !== void 0 ? _a : (gvc.glitter.document);
            const childContainer = option.childContainer;
            const renderStart = window.renderClock.stop();
            option = option !== null && option !== void 0 ? option : {};
            const container = (_b = option.containerID) !== null && _b !== void 0 ? _b : gvc.glitter.getUUID();
            return gvc.bindView(() => {
                return {
                    bind: container,
                    view: () => {
                        return new Promise((resolve, reject) => {
                            let waitAddScript = [];
                            gvc.glitter.defaultSetting.pageLoading();
                            function startRender() {
                                const start = new Date().getTime();
                                new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                                    function initialComponent(set) {
                                        let waitAdd = [];
                                        for (const a of set) {
                                            if (['code'].indexOf(a.type) === -1) {
                                                if ((a.type !== 'widget') && (a.type !== 'container') && !gvc.glitter.share.htmlExtension[gvc.glitter.htmlGenerate.configureCDN(gvc.glitter.htmlGenerate.configureCDN(gvc.glitter.htmlGenerate.resourceHook(a.js)))]) {
                                                    waitAdd.push({
                                                        src: `${gvc.glitter.htmlGenerate.configureCDN(gvc.glitter.htmlGenerate.resourceHook(a.js))}`,
                                                        type: 'module'
                                                    });
                                                }
                                                if (a.type === 'container') {
                                                    waitAdd = waitAdd.concat(initialComponent(a.data.setting));
                                                }
                                            }
                                        }
                                        return waitAdd;
                                    }
                                    gvc.glitter.htmlGenerate.loadScript(gvc.glitter, initialComponent(setting));
                                    function initialScript() {
                                        return __awaiter(this, void 0, void 0, function* () {
                                            for (const script of setting.filter((dd) => {
                                                return dd.type === 'code' && dd.data.triggerTime === 'async';
                                            })) {
                                                codeComponent.render(gvc, script, setting, [], subData).view();
                                            }
                                            for (const script of setting.filter((dd) => {
                                                return dd.type === 'code' && dd.data.triggerTime === 'first';
                                            })) {
                                                yield codeComponent.render(gvc, script, setting, [], subData).view();
                                            }
                                        });
                                    }
                                    yield initialScript();
                                    for (const b of setting) {
                                        if (b.preloadEvenet) {
                                            yield TriggerEvent.trigger({
                                                gvc,
                                                widget: b,
                                                clickEvent: b.preloadEvenet
                                            });
                                        }
                                        if (b.hiddenEvent) {
                                            const hidden = yield TriggerEvent.trigger({
                                                gvc,
                                                widget: b,
                                                clickEvent: b.hiddenEvent,
                                                subData: subData
                                            });
                                            if (hidden) {
                                                const formData = setting.formData;
                                                setting = setting.filter((dd) => {
                                                    return dd !== b;
                                                });
                                                setting.formData = formData;
                                            }
                                        }
                                    }
                                    const html = setting.map((dd) => {
                                        var _a;
                                        dd.formData = dd.formData || setting.formData;
                                        dd.global = (_a = dd.global) !== null && _a !== void 0 ? _a : [];
                                        dd.global.gvc = gvc;
                                        dd.global.pageConfig = option.page_config;
                                        dd.global.appConfig = option.app_config;
                                        dd.refreshAllParameter.view1 = () => {
                                            gvc.notifyDataChange(container);
                                        };
                                        function loadResource() {
                                            if ((dd.data.elem === 'link') && (dd.data.attr.find((dd) => {
                                                return dd.attr === 'rel' && dd.value === 'stylesheet';
                                            }))) {
                                                gvc.glitter.addStyleLink(dd.data.attr.find((dd) => {
                                                    return dd.attr === 'href';
                                                }).value, document);
                                            }
                                            else if (((dd.data.elem === 'script')) && dd.data.attr.find((dd) => {
                                                return dd.attr === 'src';
                                            })) {
                                                waitAddScript.push(dd.data.attr.find((dd) => {
                                                    return dd.attr === 'src';
                                                }).value);
                                            }
                                        }
                                        loadResource();
                                        function getHtml() {
                                            if (((dd.data.elem === 'link') && (dd.data.attr.find((dd) => {
                                                return dd.attr === 'rel' && dd.value === 'stylesheet';
                                            }))) || (((dd.data.elem === 'script')) && dd.data.attr.find((dd) => {
                                                return dd.attr === 'src';
                                            }))) {
                                                return ``;
                                            }
                                            if (['code'].indexOf(dd.type) === -1) {
                                                if ((dd.type === 'widget') || (dd.type === 'container')) {
                                                    return gvc.bindView(() => {
                                                        const tempView = gvc.glitter.getUUID();
                                                        return {
                                                            bind: tempView,
                                                            view: () => {
                                                                return ``;
                                                            },
                                                            divCreate: {
                                                                class: ``
                                                            },
                                                            onCreate: () => {
                                                                dd.refreshComponentParameter.view1 = () => {
                                                                    gvc.notifyDataChange(container);
                                                                };
                                                                function addCreateOption(option, widgetComponentID) {
                                                                    if (isEditMode() && !childContainer) {
                                                                        option.push({
                                                                            key: "onclick", value: (() => {
                                                                                function selectEvent(event) {
                                                                                    try {
                                                                                        if (dd.selectEditEvent && dd.selectEditEvent()) {
                                                                                            gvc.glitter.$('.selectComponentHover').removeClass('selectComponentHover');
                                                                                            gvc.glitter.$(`[gvc-id="${gvc.id(widgetComponentID)}"]`).addClass('selectComponentHover');
                                                                                            hover = [dd.id];
                                                                                            scrollToHover(gvc.glitter.window.document.querySelector('.selectComponentHover'));
                                                                                            event && event.stopPropagation && event.stopPropagation();
                                                                                        }
                                                                                    }
                                                                                    catch (e) {
                                                                                        console.log(e);
                                                                                    }
                                                                                }
                                                                                dd.editorEvent = () => {
                                                                                    selectEvent(document.querySelector(`[gvc-id="${gvc.id(widgetComponentID)}"]`));
                                                                                };
                                                                                return gvc.editorEvent((e, event) => {
                                                                                    selectEvent(event);
                                                                                });
                                                                            })()
                                                                        });
                                                                    }
                                                                }
                                                                const target = document.querySelector(`[gvc-id="${gvc.id(tempView)}"]`);
                                                                if (dd.gCount === 'multiple') {
                                                                    new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                                                                        let data = (yield TriggerEvent.trigger({
                                                                            gvc,
                                                                            widget: dd,
                                                                            clickEvent: dd.arrayData,
                                                                            subData: subData
                                                                        }));
                                                                        if (!Array.isArray(data) && data) {
                                                                            data = [data];
                                                                        }
                                                                        if (!data) {
                                                                            data = [];
                                                                        }
                                                                        target.outerHTML = data.map((subData) => {
                                                                            let option = [];
                                                                            const widgetComponentID = gvc.glitter.getUUID();
                                                                            addCreateOption(option, widgetComponentID);
                                                                            return widgetComponent.render(gvc, dd, setting, hover, subData, {
                                                                                option: option,
                                                                                widgetComponentID: widgetComponentID
                                                                            }, document)
                                                                                .view();
                                                                        }).join('');
                                                                    }));
                                                                }
                                                                else {
                                                                    let option = [];
                                                                    const widgetComponentID = gvc.glitter.getUUID();
                                                                    addCreateOption(option, widgetComponentID);
                                                                    target.outerHTML = widgetComponent.render(gvc, dd, setting, hover, dd.subData || subData, {
                                                                        option: option,
                                                                        widgetComponentID: widgetComponentID
                                                                    }, document)
                                                                        .view();
                                                                }
                                                            },
                                                            onDestroy: () => {
                                                            },
                                                        };
                                                    });
                                                }
                                                else {
                                                    return gvc.bindView(() => {
                                                        const tempView = gvc.glitter.getUUID();
                                                        return {
                                                            bind: tempView,
                                                            view: () => {
                                                                return ``;
                                                            },
                                                            divCreate: {
                                                                class: ``
                                                            },
                                                            onCreate: () => {
                                                                dd.refreshComponentParameter.view1 = () => {
                                                                    gvc.notifyDataChange(container);
                                                                };
                                                                const option = [];
                                                                if (isEditMode() && !childContainer) {
                                                                    option.push({
                                                                        key: "onclick", value: (() => {
                                                                            function selectEvent(event) {
                                                                                try {
                                                                                    if (dd.selectEditEvent && dd.selectEditEvent()) {
                                                                                        gvc.glitter.$('.selectComponentHover').removeClass('selectComponentHover');
                                                                                        gvc.glitter.$(`[gvc-id="${gvc.id(dd.id)}"]`).addClass('selectComponentHover');
                                                                                        hover = [dd.id];
                                                                                        scrollToHover(gvc.glitter.window.document.querySelector('.selectComponentHover'));
                                                                                        event && event.stopPropagation && event.stopPropagation();
                                                                                    }
                                                                                }
                                                                                catch (e) {
                                                                                    console.log(e);
                                                                                }
                                                                            }
                                                                            dd.editorEvent = () => {
                                                                                selectEvent(document.querySelector(`[gvc-id="${gvc.id(dd.id)}"]`));
                                                                            };
                                                                            return gvc.editorEvent((e, event) => {
                                                                                selectEvent(event);
                                                                            });
                                                                        })()
                                                                    });
                                                                }
                                                                const target = document.querySelector(`[gvc-id="${gvc.id(tempView)}"]`);
                                                                function render(subData) {
                                                                    return gvc.bindView(() => {
                                                                        var _a;
                                                                        const component = gvc.glitter.getUUID();
                                                                        dd.refreshComponentParameter.view1 = () => {
                                                                            gvc.notifyDataChange(component);
                                                                        };
                                                                        let option = [];
                                                                        if (isEditMode() && !childContainer) {
                                                                            option.push({
                                                                                key: "onclick", value: (() => {
                                                                                    function selectEvent(event) {
                                                                                        try {
                                                                                            if (dd.selectEditEvent && dd.selectEditEvent()) {
                                                                                                gvc.glitter.$('.selectComponentHover').removeClass('selectComponentHover');
                                                                                                gvc.glitter.$(`[gvc-id="${gvc.id(component)}"]`).addClass('selectComponentHover');
                                                                                                hover = [dd.id];
                                                                                                scrollToHover(gvc.glitter.window.document.querySelector('.selectComponentHover'));
                                                                                                event && event.stopPropagation && event.stopPropagation();
                                                                                            }
                                                                                        }
                                                                                        catch (e) {
                                                                                            console.log(e);
                                                                                        }
                                                                                    }
                                                                                    dd.editorEvent = () => {
                                                                                        selectEvent(document.querySelector(`[gvc-id="${gvc.id(component)}"]`));
                                                                                    };
                                                                                    return gvc.editorEvent((e, event) => {
                                                                                        selectEvent(event);
                                                                                    });
                                                                                })()
                                                                            });
                                                                        }
                                                                        return {
                                                                            bind: component,
                                                                            view: () => {
                                                                                return new Promise((resolve, reject) => {
                                                                                    gvc.glitter.htmlGenerate.loadScript(gvc.glitter, [{
                                                                                            src: dd.js,
                                                                                            callback: (data) => {
                                                                                                if (data[dd.type].render.version === 'v2') {
                                                                                                    data = data[dd.type].render({
                                                                                                        gvc: gvc,
                                                                                                        widget: dd,
                                                                                                        widgetList: setting,
                                                                                                        hoverID: hover,
                                                                                                        subData: subData,
                                                                                                        formData: dd.formData
                                                                                                    })
                                                                                                        .view();
                                                                                                }
                                                                                                else {
                                                                                                    data = data[dd.type].render(gvc, dd, setting, hover, subData)
                                                                                                        .view();
                                                                                                }
                                                                                                if (typeof data === 'string') {
                                                                                                    resolve(data);
                                                                                                }
                                                                                                else {
                                                                                                    data.then((dd) => {
                                                                                                        resolve(dd);
                                                                                                    });
                                                                                                }
                                                                                            }
                                                                                        }]);
                                                                                });
                                                                            },
                                                                            divCreate: {
                                                                                style: `position: relative;${gvc.glitter.htmlGenerate.styleEditor(dd, gvc, dd, {}).style()}`,
                                                                                class: `${(_a = dd.class) !== null && _a !== void 0 ? _a : ''} ${(dd.hashTag) ? `glitterTag${dd.hashTag}` : ''} ${(hover.indexOf(dd.id) !== -1) && isEditMode() ? ` selectComponentHover` : ``}
                                                                ${gvc.glitter.htmlGenerate.styleEditor(dd, gvc, dd, {}).class()}`,
                                                                                option: option
                                                                            },
                                                                            onCreate: () => {
                                                                                TriggerEvent.trigger({
                                                                                    gvc,
                                                                                    widget: dd,
                                                                                    clickEvent: dd.onCreateEvent,
                                                                                    subData: subData
                                                                                });
                                                                                gvc.glitter.document.querySelector(`[gvc-id="${gvc.id(component)}"]`).onResumeEvent = () => {
                                                                                    TriggerEvent.trigger({
                                                                                        gvc,
                                                                                        widget: dd,
                                                                                        clickEvent: dd.onResumtEvent,
                                                                                        subData: subData
                                                                                    });
                                                                                    console.log(`onResume`);
                                                                                };
                                                                            },
                                                                            onInitial: () => {
                                                                                TriggerEvent.trigger({
                                                                                    gvc,
                                                                                    widget: dd,
                                                                                    clickEvent: dd.onInitialEvent,
                                                                                    subData: subData
                                                                                });
                                                                            },
                                                                            onDestroy: () => {
                                                                                TriggerEvent.trigger({
                                                                                    gvc,
                                                                                    widget: dd,
                                                                                    clickEvent: dd.onDestoryEvent,
                                                                                    subData: subData
                                                                                });
                                                                            }
                                                                        };
                                                                    });
                                                                }
                                                                if (dd.gCount === 'multiple') {
                                                                    new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                                                                        let data = (yield TriggerEvent.trigger({
                                                                            gvc,
                                                                            widget: dd,
                                                                            clickEvent: dd.arrayData,
                                                                            subData: subData
                                                                        }));
                                                                        if (!Array.isArray(data) && data) {
                                                                            data = [data];
                                                                        }
                                                                        if (!data) {
                                                                            console.log(`isNull`, dd);
                                                                            data = [];
                                                                        }
                                                                        target.outerHTML = data.map((subData) => {
                                                                            return render(subData);
                                                                        }).join('');
                                                                    }));
                                                                }
                                                                else {
                                                                    target.outerHTML = render(dd.subData || subData);
                                                                }
                                                            },
                                                            onDestroy: () => {
                                                            },
                                                        };
                                                    });
                                                }
                                            }
                                            else {
                                                return ``;
                                            }
                                        }
                                        return getHtml();
                                    }).join('');
                                    resolve(html);
                                })).then((html) => {
                                    resolve(html);
                                    new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                                        for (const script of setting.filter((dd) => {
                                            return dd.type === 'code' && dd.data.triggerTime === 'last';
                                        })) {
                                            yield codeComponent.render(gvc, script, setting, [], subData).view();
                                        }
                                        for (const a of waitAddScript) {
                                            yield new Promise((resolve, reject) => {
                                                gvc.glitter.addMtScript([{
                                                        src: a
                                                    }], () => {
                                                    setTimeout(() => {
                                                        resolve(true);
                                                    }, 10);
                                                }, () => {
                                                    resolve(false);
                                                });
                                                resolve(true);
                                            });
                                        }
                                        resolve(true);
                                    })).then(() => {
                                        gvc.glitter.consoleLog(`renderFinish-${(new Date().getTime() - start) / 1000}`);
                                        gvc.glitter.defaultSetting.pageLoadingFinish();
                                        option.jsFinish && option.jsFinish();
                                    });
                                });
                            }
                            startRender();
                        });
                    },
                    divCreate: createOption !== null && createOption !== void 0 ? createOption : {
                        class: option.class, style: option.style, option: [{
                                key: `gl_type`,
                                value: "container"
                            }]
                    },
                    onInitial: () => {
                        option.onInitial && option.onInitial();
                    },
                    onCreate: () => {
                        gvc.glitter.deBugMessage(`RenderFinishID:${option.containerID}`);
                        gvc.glitter.deBugMessage(`RenderFinish-time:(start:${renderStart})-(end:${window.renderClock.stop()})`);
                        option.onCreate && option.onCreate();
                    },
                    onDestroy: () => {
                        option.onDestroy && option.onDestroy();
                    }
                };
            });
        };
        this.editor = (gvc, option = {
            return_: false,
            refreshAll: () => {
            },
            setting: setting,
            deleteEvent: () => {
            },
            hideInfo: false
        }) => {
            var loading = true;
            const oset = this.setting;
            function getData() {
                var _a;
                function initialComponent(set) {
                    let waitAdd = [];
                    for (const a of set) {
                        if (['code'].indexOf(a.type) === -1) {
                            if ((a.type !== 'widget') && (a.type !== 'container') && !gvc.glitter.share.htmlExtension[gvc.glitter.htmlGenerate.configureCDN(gvc.glitter.htmlGenerate.configureCDN(gvc.glitter.htmlGenerate.resourceHook(a.js)))]) {
                                waitAdd.push({
                                    src: `${gvc.glitter.htmlGenerate.configureCDN(gvc.glitter.htmlGenerate.resourceHook(a.js))}`,
                                    type: 'module'
                                });
                            }
                            if (a.type === 'container') {
                                waitAdd = waitAdd.concat(initialComponent(a.data.setting));
                            }
                        }
                    }
                    return waitAdd;
                }
                gvc.glitter.htmlGenerate.loadScript(gvc.glitter, initialComponent((_a = option.setting) !== null && _a !== void 0 ? _a : setting));
                loading = false;
                gvc.notifyDataChange(editContainer);
            }
            getData();
            return gvc.bindView({
                bind: editContainer,
                view: () => {
                    var _a;
                    if (loading) {
                        return ``;
                    }
                    else {
                        return ((_a = option.setting) !== null && _a !== void 0 ? _a : setting).map((dd, index) => {
                            var _a, _b, _c;
                            try {
                                const component = gvc.glitter.getUUID();
                                dd.refreshAllParameter = (_a = dd.refreshAllParameter) !== null && _a !== void 0 ? _a : {
                                    view1: () => {
                                    },
                                    view2: () => {
                                    },
                                };
                                dd.refreshComponent = () => {
                                    try {
                                        dd.refreshComponentParameter.view2();
                                        dd.refreshComponentParameter.view1();
                                    }
                                    catch (e) {
                                        window.glitter.deBugMessage(`${e.message}<br>${e.stack}<br>${e.line}`);
                                    }
                                };
                                dd.refreshComponentParameter = (_b = dd.refreshComponentParameter) !== null && _b !== void 0 ? _b : {
                                    view1: () => {
                                    },
                                    view2: () => {
                                    },
                                };
                                dd.refreshAllParameter.view2 = () => {
                                    gvc.notifyDataChange(editContainer);
                                };
                                dd.refreshAll = () => {
                                    dd.refreshAllParameter.view1();
                                    dd.refreshAllParameter.view2();
                                    option.refreshAll();
                                };
                                const toggleView = gvc.glitter.getUUID();
                                const toggleEvent = gvc.event(() => {
                                    dd.expand = !dd.expand;
                                    gvc.notifyDataChange([toggleView, component]);
                                });
                                return `<div style=" ${option.return_
                                    ? `padding: 10px;`
                                    : ``}" class="
${option.return_ ? `w-100 border rounded bg-dark mt-2` : ``} " >
${(() => {
                                    return gvc.bindView(() => {
                                        const id = gvc.glitter.getUUID();
                                        return {
                                            bind: id,
                                            view: () => {
                                                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                                                    let haveUserMode = false;
                                                    let mode = Storage.editor_mode;
                                                    if ((dd.type !== 'code') && !((dd.type === 'widget') || (dd.type === 'container'))) {
                                                        haveUserMode = yield new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                                                            gvc.glitter.htmlGenerate.loadScript(gvc.glitter, [{
                                                                    src: gvc.glitter.htmlGenerate.resourceHook(dd.js),
                                                                    callback: (data2) => {
                                                                        if (data2[dd.type].render.version === 'v2') {
                                                                            if (data2[dd.type].render({
                                                                                gvc: gvc,
                                                                                widget: dd,
                                                                                widgetList: setting,
                                                                                hoverID: hover,
                                                                                subData: subData,
                                                                                formData: dd.formData
                                                                            }).user_editor) {
                                                                                resolve(true);
                                                                            }
                                                                            else {
                                                                                resolve(false);
                                                                            }
                                                                        }
                                                                        else {
                                                                            if (data2[dd.type].render({
                                                                                gvc: gvc,
                                                                                widget: dd,
                                                                                widgetList: setting,
                                                                                hoverID: hover,
                                                                                subData: subData,
                                                                                formData: dd.formData
                                                                            }).user_editor) {
                                                                                resolve(true);
                                                                            }
                                                                            else {
                                                                                resolve(false);
                                                                            }
                                                                        }
                                                                    }
                                                                }]);
                                                        }));
                                                    }
                                                    if (haveUserMode && mode === 'user') {
                                                        resolve([
                                                            gvc.bindView(() => {
                                                                let loading = true;
                                                                let data = '';
                                                                function getData() {
                                                                    loading = true;
                                                                    gvc.glitter.htmlGenerate.loadScript(gvc.glitter, [{
                                                                            src: gvc.glitter.htmlGenerate.resourceHook(dd.js),
                                                                            callback: (data2) => {
                                                                                if (data2[dd.type].render.version === 'v2') {
                                                                                    data = data2[dd.type].render({
                                                                                        gvc: gvc,
                                                                                        widget: dd,
                                                                                        widgetList: setting,
                                                                                        hoverID: hover,
                                                                                        subData: subData,
                                                                                        formData: dd.formData
                                                                                    })
                                                                                        .user_editor();
                                                                                }
                                                                                else {
                                                                                    data = data2[dd.type].render(gvc, dd, setting, hover, subData)
                                                                                        .user_editor();
                                                                                }
                                                                                if (typeof data === 'string') {
                                                                                    loading = false;
                                                                                    gvc.notifyDataChange(component);
                                                                                }
                                                                                else {
                                                                                    data2.then((dd) => {
                                                                                        data = dd;
                                                                                        loading = false;
                                                                                        gvc.notifyDataChange(component);
                                                                                    });
                                                                                }
                                                                            }
                                                                        }]);
                                                                }
                                                                dd.refreshComponentParameter.view2 = () => {
                                                                    getData();
                                                                };
                                                                getData();
                                                                return {
                                                                    bind: component,
                                                                    view: () => {
                                                                        if (option.return_ && !dd.expand) {
                                                                            return ``;
                                                                        }
                                                                        try {
                                                                            return gvc.map([
                                                                                (() => {
                                                                                    if (loading) {
                                                                                        return ``;
                                                                                    }
                                                                                    else {
                                                                                        return [
                                                                                            data
                                                                                        ].join(`<div class="my-1"></div>`);
                                                                                    }
                                                                                })()
                                                                            ]);
                                                                        }
                                                                        catch (e) {
                                                                            return `<div class="alert alert-danger mt-2" role="alert" style="word-break: break-word;white-space: normal;">
  <i class="fa-duotone fa-triangle-exclamation"></i>
  <br>
解析錯誤:${e.message}
<br>
${e.stack}
<br>
${e.line}
</div>`;
                                                                        }
                                                                    },
                                                                    divCreate: {},
                                                                };
                                                            })
                                                        ].join(''));
                                                    }
                                                    else {
                                                        resolve([
                                                            gvc.bindView(() => {
                                                                const vm = {
                                                                    id: gvc.glitter.getUUID(),
                                                                    type: "preview"
                                                                };
                                                                return {
                                                                    bind: vm.id,
                                                                    view: () => {
                                                                        if (vm.type === 'edit') {
                                                                            return `<i class="fa-solid fa-check me-2" style="color:#295ed1;cursor:pointer;" onclick="${gvc.event(() => {
                                                                                vm.type = 'preview';
                                                                                gvc.notifyDataChange(vm.id);
                                                                            })}"></i>
${EditorElem.editeInput({
                                                                                gvc: gvc,
                                                                                title: '',
                                                                                default: dd.label,
                                                                                placeHolder: '請輸入自定義模塊名稱',
                                                                                callback: (text) => {
                                                                                    dd.label = text;
                                                                                    gvc.notifyDataChange(['right_NAV', 'MainEditorLeft']);
                                                                                },
                                                                            })}`;
                                                                        }
                                                                        else {
                                                                            return `<i class="fa-solid fa-pencil me-2" style="color:black;cursor:pointer;" onclick="${gvc.event(() => {
                                                                                vm.type = 'edit';
                                                                                gvc.notifyDataChange(vm.id);
                                                                            })}"></i>
<span class="fw-bold" style="color:black;text-overflow: ellipsis;max-width:120px;overflow: hidden;">${dd.label}</span>
<div class="flex-fill"></div>
<button class="btn ms-2 btn-outline-secondary-c d-flex align-items-center justify-content-center p-0
${(dd.data.elem === 'script' || dd.data.elem === 'style' || dd.data.elem === 'link' || dd.type === 'code') ? `d-none` : ``}
" style="height: 30px;width: 70px;gap:5px;"
onclick="${gvc.event(() => {
                                                                                EditorElem.openEditorDialog(gvc, (gvc) => {
                                                                                    const html = String.raw;
                                                                                    const id = gvc.glitter.getUUID();
                                                                                    let vm = {
                                                                                        select: 'info'
                                                                                    };
                                                                                    return [
                                                                                        gvc.bindView(() => {
                                                                                            const selectID = gvc.glitter.getUUID();
                                                                                            return {
                                                                                                bind: selectID,
                                                                                                view: () => {
                                                                                                    return html `
                                                                                                        <div class="w-100 "
                                                                                                             style="">
                                                                                                            <div class="d-flex align-items-center justify-content-around w-100 p-2">
                                                                                                                ${[
                                                                                                        {
                                                                                                            title: '模塊資訊',
                                                                                                            value: 'info',
                                                                                                            icon: 'fa-solid fa-info'
                                                                                                        },
                                                                                                        {
                                                                                                            title: '加載設定',
                                                                                                            value: 'loading',
                                                                                                            icon: 'fa-regular fa-loader'
                                                                                                        },
                                                                                                        {
                                                                                                            title: '生命週期',
                                                                                                            value: 'lifecycle',
                                                                                                            icon: 'fa-regular fa-wave-pulse'
                                                                                                        }
                                                                                                    ].map((dd) => {
                                                                                                        return html `
                                                                                                                        <div class=" d-flex align-items-center justify-content-center ${(dd.value === vm.select) ? `border` : ``} rounded-3"
                                                                                                                             style="height:36px;width:36px;cursor:pointer;
${(dd.value === vm.select) ? `background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);background:-webkit-linear-gradient(135deg, #667eea 0%, #764ba2 100%);color:white;` : `color:#151515;`}
"
                                                                                                                             onclick="${gvc.event(() => {
                                                                                                            vm.select = dd.value;
                                                                                                            gvc.notifyDataChange([id, selectID]);
                                                                                                        })}"
                                                                                                                             data-bs-toggle="tooltip"
                                                                                                                             data-bs-placement="top"
                                                                                                                             data-bs-custom-class="custom-tooltip"
                                                                                                                             data-bs-title="${dd.title}">
                                                                                                                            <i class="${dd.icon}"
                                                                                                                               aria-hidden="true"></i>
                                                                                                                        </div>`;
                                                                                                    }).join(``)}
                                                                                                            </div>
                                                                                                        </div>`;
                                                                                                },
                                                                                                divCreate: {
                                                                                                    class: `d-flex bg-white mx-n3 border-bottom`,
                                                                                                },
                                                                                                onCreate: () => {
                                                                                                    $('.tooltip').remove();
                                                                                                    $('[data-bs-toggle="tooltip"]').tooltip();
                                                                                                }
                                                                                            };
                                                                                        }),
                                                                                        gvc.bindView(() => {
                                                                                            return {
                                                                                                bind: id,
                                                                                                view: () => {
                                                                                                    var _a, _b, _c, _d;
                                                                                                    switch (vm.select) {
                                                                                                        case "info":
                                                                                                            return html `
                                                                                                                <div class="alert-warning alert mt-0  p-2 mb-0" 
                                                                                                                     style="border-bottom-right-radius:8px;border-bottom-left-radius:8px;border:none;max-width: 350px;white-space: normal;">
                                                                                                                    <h3 class="text-dark  m-1"
                                                                                                                        style="font-size: 16px;">
                                                                                                                        模塊路徑</h3>
                                                                                                                    <h3 class="text-primary  alert-primary m-1 fw-500 rounded p-2"
                                                                                                                        style="font-size: 14px;color:black;">
                                                                                                                        ${HtmlGenerate.reDefineJsResource(dd.js)}</h3>
                                                                                                                    <h3 class="text-dark  m-1 mt-2"
                                                                                                                        style="font-size: 16px;">
                                                                                                                        函式路徑</h3>
                                                                                                                    <h3 class="text-primary  alert-primary m-1 fw-500 rounded p-2"
                                                                                                                        style="font-size: 14px;">
                                                                                                                        ${dd.type}</h3>
                                                                                                                </div>`;
                                                                                                        case 'loading':
                                                                                                            return html `<div class="px-2">${(() => {
                                                                                                                var _a, _b;
                                                                                                                const array = [];
                                                                                                                if (dd.data.elem !== 'style' && dd.data.elem !== 'script') {
                                                                                                                    array.push(EditorElem.select({
                                                                                                                        title: '生成方式',
                                                                                                                        gvc: gvc,
                                                                                                                        def: (_a = dd.gCount) !== null && _a !== void 0 ? _a : 'single',
                                                                                                                        array: [{
                                                                                                                                title: '靜態',
                                                                                                                                value: 'single'
                                                                                                                            }, {
                                                                                                                                title: '程式碼',
                                                                                                                                value: 'multiple'
                                                                                                                            }],
                                                                                                                        callback: (text) => {
                                                                                                                            dd.gCount = text;
                                                                                                                            gvc.notifyDataChange(id);
                                                                                                                            gvc.notifyDataChange('HtmlEditorContainer');
                                                                                                                        }
                                                                                                                    }));
                                                                                                                }
                                                                                                                if (dd.gCount === 'multiple') {
                                                                                                                    dd.arrayData = (_b = dd.arrayData) !== null && _b !== void 0 ? _b : {};
                                                                                                                    array.push(TriggerEvent.editer(gvc, dd, dd.arrayData, {
                                                                                                                        hover: false,
                                                                                                                        option: [],
                                                                                                                        title: "設定資料來源"
                                                                                                                    }));
                                                                                                                }
                                                                                                                else {
                                                                                                                    dd.arrayData = undefined;
                                                                                                                }
                                                                                                                return array.join(`<div class="my-2"></div>`);
                                                                                                            })()}
                                                                                                                ${gvc.bindView(() => {
                                                                                                                const uid = gvc.glitter.getUUID();
                                                                                                                return {
                                                                                                                    bind: uid,
                                                                                                                    view: () => {
                                                                                                                        var _a, _b;
                                                                                                                        dd.preloadEvenet = (_a = dd.preloadEvenet) !== null && _a !== void 0 ? _a : {};
                                                                                                                        dd.hiddenEvent = (_b = dd.hiddenEvent) !== null && _b !== void 0 ? _b : {};
                                                                                                                        let view = [TriggerEvent.editer(gvc, dd, dd.preloadEvenet, {
                                                                                                                                title: "模塊預載事件",
                                                                                                                                option: [],
                                                                                                                                hover: false
                                                                                                                            }),
                                                                                                                            TriggerEvent.editer(gvc, dd, dd.hiddenEvent, {
                                                                                                                                title: "模塊隱藏事件",
                                                                                                                                option: [],
                                                                                                                                hover: false
                                                                                                                            })];
                                                                                                                        if ((dd.type !== 'widget') && (dd.type !== 'container')) {
                                                                                                                            view.push(gvc.glitter.htmlGenerate.styleEditor(dd, gvc, dd, {}).editor(gvc, () => {
                                                                                                                                gvc.notifyDataChange('showView');
                                                                                                                            }, '模塊容器樣式'));
                                                                                                                        }
                                                                                                                        return view.join(`<div class="my-2"></div>`);
                                                                                                                    },
                                                                                                                    divCreate: {
                                                                                                                        class: 'mt-2 mb-2 '
                                                                                                                    },
                                                                                                                };
                                                                                                            })}</div>`;
                                                                                                        case "lifecycle":
                                                                                                            if (dd.data && dd.data.onCreateEvent) {
                                                                                                                dd.onCreateEvent = dd.data.onCreateEvent;
                                                                                                                dd.data.onCreateEvent = undefined;
                                                                                                            }
                                                                                                            dd.onInitialEvent = (_a = dd.onInitialEvent) !== null && _a !== void 0 ? _a : {};
                                                                                                            dd.onCreateEvent = (_b = dd.onCreateEvent) !== null && _b !== void 0 ? _b : {};
                                                                                                            dd.onResumtEvent = (_c = dd.onResumtEvent) !== null && _c !== void 0 ? _c : {};
                                                                                                            dd.onDestoryEvent = (_d = dd.onDestoryEvent) !== null && _d !== void 0 ? _d : {};
                                                                                                            return `<div class="p-2 pt-1">${[
                                                                                                                html `<div class="alert alert-warning  p-2   m-n2 border-bottom fw-500" style="border-radius: 0px;color:black !important;">
                                                                                                                    <strong>onInitial事件:</strong><br>模塊初次加載所執行事件。<br>
                                                                                                                    <strong>onCreate事件:</strong><br>模塊被建立時所執行事件。<br>
                                                                                                                    <strong>onResume事件:</strong><br>模塊重新渲染至畫面時所執行事件。<br>
                                                                                                                    <strong>onDestroy事件:</strong><br>模塊被銷毀所執行的事件。<br>
</div>`,
                                                                                                                `<div class="my-4"></div>`,
                                                                                                                TriggerEvent.editer(gvc, dd, dd.onInitialEvent, {
                                                                                                                    title: "onInitial事件",
                                                                                                                    option: [],
                                                                                                                    hover: false
                                                                                                                }),
                                                                                                                TriggerEvent.editer(gvc, dd, dd.onCreateEvent, {
                                                                                                                    title: "onCreate事件",
                                                                                                                    option: [],
                                                                                                                    hover: false
                                                                                                                }),
                                                                                                                TriggerEvent.editer(gvc, dd, dd.onResumtEvent, {
                                                                                                                    title: "onResume事件",
                                                                                                                    option: [],
                                                                                                                    hover: false
                                                                                                                }),
                                                                                                                TriggerEvent.editer(gvc, dd, dd.onDestoryEvent, {
                                                                                                                    title: "onDestroy事件",
                                                                                                                    option: [],
                                                                                                                    hover: false
                                                                                                                })
                                                                                                            ].join(`<div class="my-2"></div>`)}</div>`;
                                                                                                        default:
                                                                                                            return ``;
                                                                                                    }
                                                                                                },
                                                                                            };
                                                                                        })
                                                                                    ].join('');
                                                                                }, () => {
                                                                                }, 350, '進階設定');
                                                                            })}">
<i class="fa-regular fa-gear" style="font-size:16px"></i>進階</button>
`;
                                                                        }
                                                                    },
                                                                    divCreate: {
                                                                        class: `d-flex align-items-center mx-n2 mt-n2 p-3 py-2 shadow border-bottom`,
                                                                        style: `background: #f6f6f6;height:48px;`
                                                                    }
                                                                };
                                                            }),
                                                            gvc.bindView(() => {
                                                                let loading = true;
                                                                let data = '';
                                                                function getData() {
                                                                    if (dd.type === 'code') {
                                                                        data = codeComponent.render(gvc, dd, setting, hover, subData, {
                                                                            widgetComponentID: gvc.glitter.getUUID()
                                                                        })
                                                                            .editor();
                                                                        loading = false;
                                                                        gvc.notifyDataChange(component);
                                                                    }
                                                                    else if ((dd.type === 'widget') || (dd.type === 'container')) {
                                                                        data = widgetComponent.render(gvc, dd, setting, hover, subData, {
                                                                            widgetComponentID: gvc.glitter.getUUID()
                                                                        })
                                                                            .editor();
                                                                        loading = false;
                                                                        gvc.notifyDataChange(component);
                                                                    }
                                                                    else {
                                                                        loading = true;
                                                                        gvc.glitter.htmlGenerate.loadScript(gvc.glitter, [{
                                                                                src: gvc.glitter.htmlGenerate.resourceHook(dd.js),
                                                                                callback: (data2) => {
                                                                                    if (data2[dd.type].render.version === 'v2') {
                                                                                        data = data2[dd.type].render({
                                                                                            gvc: gvc,
                                                                                            widget: dd,
                                                                                            widgetList: setting,
                                                                                            hoverID: hover,
                                                                                            subData: subData,
                                                                                            formData: dd.formData
                                                                                        })
                                                                                            .editor();
                                                                                    }
                                                                                    else {
                                                                                        data = data2[dd.type].render(gvc, dd, setting, hover, subData)
                                                                                            .editor();
                                                                                    }
                                                                                    if (typeof data === 'string') {
                                                                                        loading = false;
                                                                                        gvc.notifyDataChange(component);
                                                                                    }
                                                                                    else {
                                                                                        data2.then((dd) => {
                                                                                            data = dd;
                                                                                            loading = false;
                                                                                            gvc.notifyDataChange(component);
                                                                                        });
                                                                                    }
                                                                                }
                                                                            }]);
                                                                    }
                                                                }
                                                                dd.refreshComponentParameter.view2 = () => {
                                                                    getData();
                                                                };
                                                                getData();
                                                                return {
                                                                    bind: component,
                                                                    view: () => {
                                                                        if (option.return_ && !dd.expand) {
                                                                            return ``;
                                                                        }
                                                                        try {
                                                                            return gvc.map([
                                                                                (() => {
                                                                                    if (loading) {
                                                                                        return ``;
                                                                                    }
                                                                                    else {
                                                                                        return [
                                                                                            gvc.bindView(() => {
                                                                                                const uid = gvc.glitter.getUUID();
                                                                                                return {
                                                                                                    bind: uid,
                                                                                                    view: () => {
                                                                                                        var _a;
                                                                                                        dd.preloadEvenet = (_a = dd.preloadEvenet) !== null && _a !== void 0 ? _a : {};
                                                                                                        return ``;
                                                                                                    },
                                                                                                    divCreate: {
                                                                                                        class: 'mt-2 mb-2 '
                                                                                                    },
                                                                                                };
                                                                                            }),
                                                                                            data
                                                                                        ].join(`<div class="my-1"></div>`);
                                                                                    }
                                                                                })()
                                                                            ]);
                                                                        }
                                                                        catch (e) {
                                                                            return `<div class="alert alert-danger mt-2" role="alert" style="word-break: break-word;white-space: normal;">
  <i class="fa-duotone fa-triangle-exclamation"></i>
  <br>
解析錯誤:${e.message}
<br>
${e.stack}
<br>
${e.line}
</div>`;
                                                                        }
                                                                    },
                                                                    divCreate: {},
                                                                };
                                                            })
                                                        ].join(''));
                                                    }
                                                }));
                                            }
                                        };
                                    });
                                })()}</div>`;
                            }
                            catch (e) {
                                HtmlGenerate.share.false[dd.js] = ((_c = HtmlGenerate.share.false[dd.js]) !== null && _c !== void 0 ? _c : 0) + 1;
                                gvc.glitter.deBugMessage(`解析錯誤:${e.message}<br>${e.stack}<br>${e.line}`);
                                if (HtmlGenerate.share.false[dd.js] < 80) {
                                    setTimeout(() => {
                                        getData();
                                    }, 100);
                                }
                                return `
<div class="alert alert-danger" role="alert" style="word-break: break-word;white-space: normal;">
  <i class="fa-duotone fa-triangle-exclamation"></i>
<br>
解析錯誤:${e.message}
<br>
${e.stack}
<br>
${e.line}
</div>`;
                            }
                        }).join('');
                    }
                },
                divCreate: {},
                onCreate: () => {
                },
            });
        };
        this.exportJson = (setting) => {
            return JSON.stringify(setting);
        };
    }
    static configureCDN(src) {
        return src;
    }
    static getResourceLink(url) {
        const glitter = window.glitter;
        url = glitter.htmlGenerate.resourceHook(url);
        if (!url.startsWith('http') && !url.startsWith('https')) {
            url = new URL(`./${url}`, new URL('../../', import.meta.url).href).href;
        }
        return url;
    }
    static reDefineJsResource(js) {
        if (js.includes("official_view_component/official.js")) {
            return new URL('official_view_component/official.js', new URL('../../', import.meta.url).href).href;
        }
        return js;
    }
    static scrollToCenter(gvc, elementId) {
        var element = gvc.getBindViewElem(elementId);
        if (element) {
            var elementRect = element.getBoundingClientRect();
            var elementTop = elementRect.top;
            var elementHeight = elementRect.height;
            var windowHeight = window.innerHeight || document.documentElement.clientHeight;
            var scrollTo = elementTop - (windowHeight - elementHeight) / 2;
            gvc.glitter
                .$('html')
                .get(0).scrollTo({
                top: scrollTo,
                left: 0,
                behavior: 'instant'
            });
        }
    }
    static styleEditor(data, gvc, widget, subData) {
        const glitter = (gvc !== null && gvc !== void 0 ? gvc : window).glitter;
        function getStyleData() {
            var _a;
            const response = (() => {
                const globalStyle = glitter.share.globalStyle;
                if (data.style_from === 'tag') {
                    if (globalStyle[data.tag]) {
                        return globalStyle[data.tag];
                    }
                    else {
                        return data;
                    }
                }
                else {
                    return data;
                }
            })();
            response.list = (_a = response.list) !== null && _a !== void 0 ? _a : [];
            response.version = 'v2';
            return response;
        }
        return {
            editor: (gvc, widget, title, option) => {
                const glitter = window.glitter;
                return `
<div type="button" class="btn  w-100 " style="background:white;width:calc(100%);border-radius:8px;
                    min-height:45px;border:1px solid black;color:#151515;" onclick="${gvc.event(() => {
                    glitter.openDiaLog("glitterBundle/plugins/dialog-style-editor.js", "dialog-style-editor", {
                        callback: () => {
                            if (typeof widget === 'function') {
                                widget();
                            }
                            else {
                                widget.refreshComponent();
                            }
                        },
                        data: data,
                        option: option
                    });
                })}">${title !== null && title !== void 0 ? title : "設計樣式"}</div><br>`;
            },
            class: () => {
                var _a;
                function classString(data) {
                    var _a;
                    function getClass(data) {
                        let classs = '';
                        if (data.classDataType === 'static') {
                            return data.class;
                        }
                        else if (data.classDataType === 'triggerEvent') {
                            return glitter.promiseValue(new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                                resolve((yield TriggerEvent.trigger({
                                    gvc: gvc, widget: widget, clickEvent: data.trigger, subData: subData,
                                })));
                            })));
                        }
                        else {
                            try {
                                if (data.classDataType === 'code') {
                                    classs = eval(`(() => {
                                        ${data.class}
                                    })()`);
                                }
                                else {
                                    classs = eval(data.class);
                                }
                            }
                            catch (e) {
                                classs = data.class;
                            }
                            return classs;
                        }
                    }
                    const tempMap = {};
                    ((_a = data.stylist) !== null && _a !== void 0 ? _a : []).map((dd) => {
                        tempMap[dd.size] = (() => {
                            return getClass(dd);
                        });
                    });
                    return glitter.ut.frSize(tempMap, (() => {
                        return getClass(data);
                    }))();
                }
                return [getStyleData()].concat((_a = getStyleData().list) !== null && _a !== void 0 ? _a : []).map((dd) => {
                    const data = classString(dd);
                    return data && ` ${data}`;
                }).join('');
            },
            style: () => {
                var _a;
                function styleString(data) {
                    var _a, _b;
                    let styles = '';
                    function getStyle(data) {
                        let style = '';
                        if (data.dataType === 'static') {
                            return data.style;
                        }
                        else {
                            try {
                                if (data.dataType === 'code') {
                                    style = eval(`(() => {
                                        ${data.style}
                                    })()`);
                                }
                                else if (data.dataType === 'triggerEvent') {
                                    return glitter.promiseValue(new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                                        resolve((yield TriggerEvent.trigger({
                                            gvc: gvc,
                                            widget: widget,
                                            clickEvent: data.triggerStyle,
                                            subData: subData,
                                        })));
                                    })));
                                }
                                else {
                                    style = eval(data.style);
                                }
                            }
                            catch (e) {
                                style = data.style;
                            }
                            return style;
                        }
                    }
                    const tempMap = {};
                    ((_a = data.stylist) !== null && _a !== void 0 ? _a : []).map((dd) => {
                        tempMap[dd.size] = (() => {
                            return getStyle(dd);
                        });
                    });
                    styles = glitter.ut.frSize(tempMap, (() => {
                        return getStyle(data);
                    }))();
                    let styleString = [styles];
                    ((_b = data.styleList) !== null && _b !== void 0 ? _b : []).map((dd) => {
                        Object.keys(dd.data).map((d2) => {
                            styleString.push([d2, dd.data[d2]].join(':'));
                        });
                    });
                    let styleStringJoin = styleString.join(';');
                    function replaceString(pattern) {
                        let match;
                        while ((match = pattern.exec(styleStringJoin)) !== null) {
                            const placeholder = match[0];
                            const value = match[1];
                            if (glitter.share.globalValue && glitter.share.globalValue[value]) {
                                styleStringJoin = styleStringJoin.replace(placeholder, glitter.share.globalValue[value]);
                            }
                        }
                    }
                    replaceString(/\/\**@{{(.*?)}}\*\//g);
                    replaceString(/@{{(.*?)}}/g);
                    return styleStringJoin;
                }
                return [getStyleData()].concat((_a = getStyleData().list) !== null && _a !== void 0 ? _a : []).map((dd) => {
                    const data = styleString(dd);
                    return data && ` ${data}`;
                }).join('');
            },
        };
    }
    static editor_component(data, gvc, widget, subData) {
        const glitter = (gvc !== null && gvc !== void 0 ? gvc : window).glitter;
        const response = glitter.htmlGenerate.styleEditor(data, gvc, widget, subData);
        Object.keys(data).map((dd) => {
            if (['styleList', 'class', 'style'].indexOf(dd) === -1) {
                Object.defineProperty(response, dd, {
                    get: function () {
                        return data[dd];
                    },
                    set(v) {
                        data[dd] = v;
                    }
                });
            }
        });
        return response;
    }
    static editeInput(obj) {
        var _a, _b, _c;
        obj.title = (_a = obj.title) !== null && _a !== void 0 ? _a : "";
        return `<h3 class="fw-500 mt-2 " style="font-size: 15px;margin-bottom: 10px;color:#151515;" >${obj.title}</h3>
<input class="form-control mb-2" type="${(_b = obj.type) !== null && _b !== void 0 ? _b : 'text'}" placeholder="${obj.placeHolder}" onchange="${obj.gvc.event((e) => {
            obj.callback(e.value);
        })}" value="${(_c = obj.default) !== null && _c !== void 0 ? _c : ''}">`;
    }
    static editeText(obj) {
        var _a;
        obj.title = (_a = obj.title) !== null && _a !== void 0 ? _a : "";
        const id = obj.gvc.glitter.getUUID();
        return `<h3 style="font-size: 15px;margin-bottom: 10px;color:#151515;" class="mt-2 fw-500 d-flex align-items-center  ${(!obj.title) ? `d-none` : ``}">${obj.title}</h3>

${obj.gvc.bindView({
            bind: id,
            view: () => {
                var _a;
                return (_a = obj.default) !== null && _a !== void 0 ? _a : '';
            },
            divCreate: {
                elem: `textArea`,
                style: `max-height:400px!important;min-height:170px;`,
                class: `form-control`, option: [
                    { key: 'placeholder', value: obj.placeHolder },
                    {
                        key: 'onchange', value: obj.gvc.event((e) => {
                            obj.callback(e.value);
                        })
                    }
                ]
            },
            onCreate: () => {
                autosize(obj.gvc.getBindViewElem(id));
            }
        })}`;
    }
}
HtmlGenerate.share = {};
HtmlGenerate.isEditMode = isEditMode;
HtmlGenerate.resourceHook = (src) => {
    if (Storage.develop_mode === 'true') {
        window.saasConfig.appConfig.initialList.map((dd) => {
            src = src.replace(`$${dd.tag}`, dd.staging);
        });
    }
    else {
        window.saasConfig.appConfig.initialList.map((dd) => {
            src = src.replace(`$${dd.tag}`, dd.official);
        });
    }
    return src;
};
HtmlGenerate.saveEvent = (boolean, callback) => {
    alert('save');
};
HtmlGenerate.loadScript = (glitter, js, where = 'htmlExtension') => {
    var _a;
    glitter.share[where] = (_a = glitter.share[where]) !== null && _a !== void 0 ? _a : {};
    js.map((dd) => {
        var _a, _b;
        dd.src = HtmlGenerate.reDefineJsResource(dd.src);
        let key = glitter.htmlGenerate.resourceHook(dd.src);
        if (!key.includes('http')) {
            key = new URL(key, new URL('../../', import.meta.url).href).href;
        }
        function checkStore() {
            const result = glitter.share[where][key];
            if (result) {
                dd.callback && dd.callback(glitter.share[where][key]);
            }
            return result;
        }
        if (!checkStore()) {
            glitter.share.htmlExtensionResourceCallback = (_a = glitter.share.htmlExtensionResourceCallback) !== null && _a !== void 0 ? _a : {};
            glitter.share.htmlExtensionResourceCallback[key] = (_b = glitter.share.htmlExtensionResourceCallback[key]) !== null && _b !== void 0 ? _b : [];
            glitter.share.htmlExtensionResourceCallback[key].push(dd.callback);
            if (!glitter.share[where][`_init_${key}`]) {
                glitter.share[where][`_init_${key}`] = true;
                Object.defineProperty(glitter.share[where], key, {
                    get() {
                        return glitter.share[where][`_${key}`];
                    },
                    set(newValue) {
                        glitter.share[where][`_${key}`] = newValue;
                        glitter.share.htmlExtensionResourceCallback[key].map((callback) => {
                            callback && callback(newValue);
                        });
                        glitter.share.htmlExtensionResourceCallback[key] = [];
                    },
                    enumerable: true,
                    configurable: true
                });
            }
        }
    });
    glitter.addMtScript(js.map((dd) => {
        let key = glitter.htmlGenerate.configureCDN(glitter.htmlGenerate.resourceHook(dd.src));
        if (!key.includes('http')) {
            key = new URL(key, new URL('../../', import.meta.url).href).href;
        }
        return {
            type: 'module',
            src: key
        };
    }), () => {
    }, () => {
    }, [
        { key: "async", value: "true" }
    ]);
};
HtmlGenerate.loadEvent = (glitter, js) => {
    var _a;
    glitter.share.componentData = (_a = glitter.share.componentData) !== null && _a !== void 0 ? _a : {};
    js.map((dd) => {
        var _a, _b;
        let key = glitter.htmlGenerate.resourceHook(dd.src);
        if (!key.includes('http')) {
            key = new URL(key, new URL('../../', import.meta.url).href).href;
        }
        function checkStore() {
            const result = glitter.share.componentData[key];
            if (result) {
                dd.callback && dd.callback(glitter.share.componentData[key]);
            }
            return result;
        }
        if (!checkStore()) {
            glitter.share.componentDataResourceCallback = (_a = glitter.share.componentDataResourceCallback) !== null && _a !== void 0 ? _a : {};
            glitter.share.componentDataResourceCallback[key] = (_b = glitter.share.componentDataResourceCallback[key]) !== null && _b !== void 0 ? _b : [];
            glitter.share.componentDataResourceCallback[key].push(dd.callback);
            if (!glitter.share.componentData[`_init_${key}`]) {
                glitter.share.componentData[`_init_${key}`] = true;
                Object.defineProperty(glitter.share.componentData, key, {
                    get() {
                        return glitter.share.componentData[`_${key}`];
                    },
                    set(newValue) {
                        glitter.share.componentData[`_${key}`] = newValue;
                        glitter.share.componentDataResourceCallback[key].map((callback) => {
                            callback && callback(newValue);
                        });
                        glitter.share.componentDataResourceCallback[key] = [];
                    },
                    enumerable: true,
                    configurable: true
                });
            }
        }
    });
    glitter.addMtScript(js.map((dd) => {
        let key = glitter.htmlGenerate.configureCDN(glitter.htmlGenerate.resourceHook(dd.src));
        if (!key.includes('http')) {
            key = new URL(key, new URL('../../', import.meta.url).href).href;
        }
        return {
            type: 'module',
            src: key
        };
    }), () => {
    }, () => {
    }, [
        { key: "async", value: "true" }
    ]);
};
HtmlGenerate.getKey = (js) => {
    let key = window.glitter.htmlGenerate.resourceHook(js);
    if (!key.includes('http')) {
        key = new URL(key, location.href).href;
    }
    return key;
};
HtmlGenerate.renameWidgetID = (dd) => {
    dd.id = window.glitter.getUUID();
    if (dd.type === 'container') {
        dd.data.setting.map((d2) => {
            HtmlGenerate.renameWidgetID(d2);
        });
    }
    return dd;
};
HtmlGenerate.setHome = (obj) => {
    var _a, _b;
    const glitter = Glitter.glitter;
    glitter.setHome('glitterBundle/plugins/html-render.js', obj.tag, {
        app_config: obj.app_config,
        page_config: (_a = obj.page_config) !== null && _a !== void 0 ? _a : {},
        config: obj.config,
        editMode: obj.editMode,
        data: obj.data,
    }, (_b = obj.option) !== null && _b !== void 0 ? _b : {});
};
HtmlGenerate.changePage = (obj) => {
    var _a, _b;
    const glitter = Glitter.glitter;
    console.log(`changePage-time:`, window.renderClock.stop());
    glitter.changePage('glitterBundle/plugins/html-render.js', obj.tag, obj.goBack, {
        app_config: obj.app_config,
        page_config: (_a = obj.page_config) !== null && _a !== void 0 ? _a : {},
        config: obj.config,
        editMode: obj.editMode,
        data: obj.data,
    }, (_b = obj.option) !== null && _b !== void 0 ? _b : {});
};
function isEditMode() {
    try {
        return window.parent.editerData !== undefined;
    }
    catch (e) {
        return false;
    }
}
function scrollToHover(element) {
    function scrollToItem(element) {
        if (element) {
            element.scrollIntoView({
                behavior: 'auto',
                block: 'center',
            });
        }
    }
    setTimeout(() => {
        scrollToItem(element);
    }, 100);
}