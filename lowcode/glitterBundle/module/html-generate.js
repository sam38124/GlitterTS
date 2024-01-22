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
export class HtmlGenerate {
    constructor(setting, hover = [], subdata, root) {
        var _a;
        const formData = setting.formData;
        const share = {};
        this.setting = setting;
        subdata = subdata !== null && subdata !== void 0 ? subdata : {};
        HtmlGenerate.share.false = (_a = HtmlGenerate.share.false) !== null && _a !== void 0 ? _a : {};
        const editContainer = window.glitter.getUUID();
        let lastIndex = undefined;
        setting.map((dd) => {
            var _a, _b, _c, _d, _e;
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
            return dd;
        });
        function loop(array) {
            array.map((dd) => {
                var _a, _b;
                if (dd.type === 'container') {
                    loop((_a = dd.data.setting) !== null && _a !== void 0 ? _a : []);
                }
                dd.share = (_b = dd.share) !== null && _b !== void 0 ? _b : share;
            });
        }
        loop(setting);
        this.render = (gvc, option = {
            class: ``,
            style: ``,
            containerID: gvc.glitter.getUUID(),
            jsFinish: () => {
            },
            onCreate: () => {
            }
        }, createOption) => {
            var _a;
            const childContainer = option.childContainer;
            option = option !== null && option !== void 0 ? option : {};
            const container = (_a = option.containerID) !== null && _a !== void 0 ? _a : gvc.glitter.getUUID();
            let timerTask = [];
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
                                                codeComponent.render(gvc, script, setting, [], subdata).view();
                                            }
                                            for (const script of setting.filter((dd) => {
                                                return dd.type === 'code' && dd.data.triggerTime === 'first';
                                            })) {
                                                yield codeComponent.render(gvc, script, setting, [], subdata).view();
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
                                                subData: subdata
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
                                        dd.formData = setting.formData;
                                        dd.global = (_a = dd.global) !== null && _a !== void 0 ? _a : [];
                                        dd.global.pageConfig = option.page_config;
                                        dd.global.appConfig = option.app_config;
                                        dd.refreshAllParameter.view1 = () => {
                                            gvc.notifyDataChange(container);
                                        };
                                        const tempUiID = gvc.glitter.getUUID();
                                        function loadResource() {
                                            if (dd.data.elem === 'style') {
                                                gvc.addStyle(dd.data.inner);
                                            }
                                            else if ((dd.data.elem === 'link') && (dd.data.attr.find((dd) => {
                                                return dd.attr === 'rel' && dd.value === 'stylesheet';
                                            }))) {
                                                gvc.addStyleLink(dd.data.attr.find((dd) => {
                                                    return dd.attr === 'href';
                                                }).value);
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
                                            if ((dd.data.elem === 'style') || ((dd.data.elem === 'link') && (dd.data.attr.find((dd) => {
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
                                                                                    console.log(`addCreateOption-->`, widgetComponentID);
                                                                                    try {
                                                                                        gvc.glitter.$('.selectComponentHover').removeClass('selectComponentHover');
                                                                                        gvc.glitter.$(`[gvc-id="${gvc.id(widgetComponentID)}"]`).addClass('selectComponentHover');
                                                                                        if (dd.selectEditEvent()) {
                                                                                            hover = [dd.id];
                                                                                        }
                                                                                        scrollToHover();
                                                                                        event && event.stopPropagation();
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
                                                                const target = gvc.glitter.document.querySelector(`[gvc-id="${gvc.id(tempView)}"]`);
                                                                if (dd.gCount === 'multiple') {
                                                                    new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                                                                        const data = (yield TriggerEvent.trigger({
                                                                            gvc,
                                                                            widget: dd,
                                                                            clickEvent: dd.arrayData,
                                                                            subData: subdata
                                                                        }));
                                                                        target.outerHTML = data.map((subData) => {
                                                                            let option = [];
                                                                            dd.formData = formData;
                                                                            const widgetComponentID = gvc.glitter.getUUID();
                                                                            addCreateOption(option, widgetComponentID);
                                                                            return widgetComponent.render(gvc, dd, setting, hover, subData, {
                                                                                option: option,
                                                                                widgetComponentID: widgetComponentID
                                                                            })
                                                                                .view();
                                                                        }).join('');
                                                                    }));
                                                                }
                                                                else {
                                                                    let option = [];
                                                                    const widgetComponentID = gvc.glitter.getUUID();
                                                                    addCreateOption(option, widgetComponentID);
                                                                    target.outerHTML = widgetComponent.render(gvc, dd, setting, hover, subdata, {
                                                                        option: option,
                                                                        widgetComponentID: widgetComponentID
                                                                    })
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
                                                                                    gvc.glitter.$('.selectComponentHover').removeClass('selectComponentHover');
                                                                                    gvc.glitter.$(`[gvc-id="${gvc.id(dd.id)}"]`).addClass('selectComponentHover');
                                                                                    if (dd.selectEditEvent()) {
                                                                                        hover = [dd.id];
                                                                                    }
                                                                                    scrollToHover();
                                                                                    event && event.stopPropagation();
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
                                                                const target = gvc.glitter.document.querySelector(`[gvc-id="${gvc.id(tempView)}"]`);
                                                                function render(subdata) {
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
                                                                                            gvc.glitter.$('.selectComponentHover').removeClass('selectComponentHover');
                                                                                            gvc.glitter.$(`[gvc-id="${gvc.id(component)}"]`).addClass('selectComponentHover');
                                                                                            if (dd.selectEditEvent()) {
                                                                                                hover = [dd.id];
                                                                                            }
                                                                                            scrollToHover();
                                                                                            event && event.stopPropagation();
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
                                                                                                        subData: subdata,
                                                                                                        formData: setting.formData
                                                                                                    })
                                                                                                        .view();
                                                                                                }
                                                                                                else {
                                                                                                    data = data[dd.type].render(gvc, dd, setting, hover, subdata)
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
                                                                                style: `${gvc.glitter.htmlGenerate.styleEditor(dd, gvc, dd, {}).style()} `,
                                                                                class: `position-relative ${(_a = dd.class) !== null && _a !== void 0 ? _a : ''} ${(dd.hashTag) ? `glitterTag${dd.hashTag}` : ''} ${hover.indexOf(component) !== -1 ? ` selectComponentHover` : ``}
                                                                ${gvc.glitter.htmlGenerate.styleEditor(dd, gvc, dd, {}).class()}`,
                                                                                option: option
                                                                            },
                                                                            onCreate: () => {
                                                                            },
                                                                        };
                                                                    });
                                                                }
                                                                if (dd.gCount === 'multiple') {
                                                                    new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                                                                        const data = (yield TriggerEvent.trigger({
                                                                            gvc,
                                                                            widget: dd,
                                                                            clickEvent: dd.arrayData,
                                                                            subData: subdata
                                                                        }));
                                                                        target.outerHTML = data.map((subData) => {
                                                                            return render(subData);
                                                                        }).join('');
                                                                    }));
                                                                }
                                                                else {
                                                                    target.outerHTML = render(subdata);
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
                                            yield codeComponent.render(gvc, script, setting, [], subdata).view();
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
                    },
                    onCreate: () => {
                        console.log(`RenderFinish-time:`, window.renderClock.stop());
                        option.onCreate && option.onCreate();
                        for (const script of setting.filter((dd) => {
                            return dd.type === 'code' && dd.data.triggerTime === 'timer';
                        })) {
                            timerTask.push((() => {
                                let vm = {
                                    toggle: true
                                };
                                function execute() {
                                    codeComponent.render(gvc, script, setting, [], subdata).view().then(() => {
                                        setTimeout(() => {
                                            if (vm.toggle) {
                                                execute();
                                            }
                                        }, parseInt(script.data.timer, 10));
                                    });
                                }
                                execute();
                                return vm;
                            })());
                        }
                    },
                    onDestroy: () => {
                        timerTask.map((dd) => {
                            dd.toggle = false;
                        });
                        timerTask = [];
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
                                dd.formData = setting.formData;
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
                                    : `padding-bottom: 10px;margin-bottom: 10px;border-bottom: 1px solid lightgrey;`}" class="
${option.return_ ? `w-100 border rounded bg-dark mt-2` : ``} " >
${EditorElem.editeInput({
                                    gvc: gvc,
                                    title: '區段名稱',
                                    default: dd.label,
                                    placeHolder: '請輸入自定義模塊名稱',
                                    callback: (text) => {
                                        dd.label = text;
                                        gvc.notifyDataChange(['HtmlEditorContainer']);
                                    },
                                })}
${gvc.bindView(() => {
                                    let loading = true;
                                    let data = '';
                                    function getData() {
                                        if (dd.type === 'code') {
                                            data = codeComponent.render(gvc, dd, setting, hover, subdata, {
                                                widgetComponentID: gvc.glitter.getUUID()
                                            })
                                                .editor();
                                            loading = false;
                                            gvc.notifyDataChange(component);
                                        }
                                        else if ((dd.type === 'widget') || (dd.type === 'container')) {
                                            data = widgetComponent.render(gvc, dd, setting, hover, subdata, {
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
                                                                subData: subdata,
                                                                formData: setting.formData
                                                            })
                                                                .editor();
                                                        }
                                                        else {
                                                            data = data2[dd.type].render(gvc, dd, setting, hover, subdata)
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
                                                                            if (dd.type !== 'container' && dd.type !== 'widget') {
                                                                                return [gvc.glitter.htmlGenerate.styleEditor(dd, gvc, dd, {}).editor(gvc, () => {
                                                                                        gvc.notifyDataChange('showView');
                                                                                    }, '模塊容器樣式')].join(`<div class="my-2"></div>`);
                                                                            }
                                                                            else {
                                                                                return ``;
                                                                            }
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
                                })}</div>`;
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
        return js.replace('http://127.0.0.1:4000/glitter/official_view_component/official.js', new URL('official_view_component/official.js', new URL('../../', import.meta.url).href).href)
            .replace('http://127.0.0.1:4000/Glitter/official_view_component/official.js', new URL('official_view_component/official.js', new URL('../../', import.meta.url).href).href);
    }
    static scrollToCenter(gvc, elementId) {
        var element = gvc.getBindViewElem(elementId).get(0);
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
                const data = getStyleData();
                function getClass(data) {
                    let classs = '';
                    if (data.classDataType === 'static') {
                        return data.class;
                    }
                    else if (data.classDataType === 'triggerEvent') {
                        return glitter.promiseValue(new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                            resolve((yield TriggerEvent.trigger({
                                gvc: gvc, widget: data, clickEvent: data.trigger, subData: subData,
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
            },
            style: () => {
                var _a, _b;
                const data = getStyleData();
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
                                        gvc: gvc, widget: data, clickEvent: data.triggerStyle, subData: subData,
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
                return styleString.join(';');
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
    return src;
};
HtmlGenerate.saveEvent = (boolean) => {
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
function scrollToHover() {
    function scrollToItem(element) {
        if (element) {
            element.scrollIntoView({
                behavior: 'auto',
                block: 'center',
            });
        }
    }
    setTimeout(() => {
        scrollToItem(document.querySelector('.selectComponentHover'));
    }, 100);
}
