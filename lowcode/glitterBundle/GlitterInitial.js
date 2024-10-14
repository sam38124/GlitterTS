'use strict';
import { Entry } from '../Entry.js';
import { Glitter } from './Glitter.js';
import { GVCType } from './module/PageManager.js';
const glitter = new Glitter(window);
window.glitter = glitter;
window.rootGlitter = glitter;
function listenElementChange(query) {
    const targetElement = document.querySelector(query);
    const observer = new MutationObserver(function (mutationsList) {
        Object.keys(glitter.elementCallback).map((dd) => {
            if (glitter.elementCallback[dd].rendered && !glitter.elementCallback[dd].doc.querySelector(`[gvc-id="${dd}"]`)) {
                glitter.elementCallback[dd].rendered = false;
                glitter.elementCallback[dd].onDestroy();
            }
        });
        for (let mutation of mutationsList) {
            if (mutation.addedNodes.length > 0) {
                for (const b of mutation.addedNodes) {
                    traverseHTML(b, document);
                }
            }
        }
    });
    observer.observe(targetElement, { childList: true, subtree: true });
}
function traverseHTML(element, document) {
    var _a, _b;
    try {
        if (element.classList.contains('page-box')) {
            const pageConfig = glitter.pageConfig.find((dd) => {
                return `page${dd.id}` === element.getAttribute('id');
            });
            if (window.glitter.share.to_menu &&
                glitter.pageConfig.filter((dd) => {
                    return dd.type === GVCType.Page;
                }).length > 1) {
                element.style.display = 'none';
                window.glitter.share.time_back = setTimeout(() => {
                    window.history.back();
                });
                return;
            }
            window.glitter.share.to_menu = false;
            if (pageConfig && pageConfig.initial) {
                const scroll_top = pageConfig.scrollTop;
                [0, 100, 200, 300, 400, 500, 600, 700].map((dd) => {
                    setTimeout(() => {
                        document.querySelector('html').scrollTop = scroll_top;
                    }, dd);
                });
                function loop(element) {
                    if (element && element.onResumeEvent) {
                        element && element.onResumeEvent && element.onResumeEvent();
                    }
                    let children = element.children;
                    if (children && children.length > 0) {
                        for (let j = 0; j < children.length; j++) {
                            loop(children[j]);
                        }
                    }
                }
                loop(element);
                return;
            }
            pageConfig && (pageConfig.initial = true);
        }
    }
    catch (e) {
    }
    let children = element.children;
    if (children && children.length > 0) {
        for (let j = 0; j < children.length; j++) {
            traverseHTML(children[j], document);
        }
    }
    if (element && element.getAttribute && element.getAttribute('glem') === 'bindView') {
        const id = element.getAttribute('gvc-id');
        glitter.elementCallback[id].element = element;
        glitter.elementCallback[id].first_paint = (_a = glitter.elementCallback[id].first_paint) !== null && _a !== void 0 ? _a : true;
        function renderBindView() {
            glitter.consoleLog(`renderBindView`);
            function notifyLifeCycle() {
                try {
                    setTimeout(() => {
                        glitter.elementCallback[element.getAttribute('gvc-id')].updateAttribute();
                    });
                }
                catch (e) {
                    glitter.deBugMessage(e);
                }
                try {
                    glitter.elementCallback[element.getAttribute('gvc-id')].onInitial();
                }
                catch (e) {
                    glitter.deBugMessage(e);
                }
                try {
                    glitter.elementCallback[element.getAttribute('gvc-id')].onCreate();
                }
                catch (e) {
                    glitter.deBugMessage(e);
                }
            }
            try {
                if (document.querySelector(`[gvc-id="${id}"]`)) {
                    glitter.elementCallback[id].doc = document;
                    glitter.elementCallback[id].rendered = true;
                    if (!document.querySelector(`[gvc-id="${id}"]`).wasRender) {
                        if (typeof glitter.elementCallback[id].initial_view === 'string') {
                            glitter.elementCallback[id].initial_view = undefined;
                            notifyLifeCycle();
                        }
                        else {
                            let view = glitter.elementCallback[id].getView();
                            function _start() {
                                if (typeof view === 'string') {
                                    const html = glitter.renderView.replaceGlobalValue(view);
                                    try {
                                        $(document.querySelector(`[gvc-id="${id}"]`)).html(html);
                                    }
                                    catch (e) {
                                        $(document.querySelector(`[gvc-id="${id}"]`)).html(e);
                                    }
                                    notifyLifeCycle();
                                }
                                else {
                                    view.then((data) => {
                                        const html = glitter.renderView.replaceGlobalValue(data);
                                        try {
                                            $(document.querySelector(`[gvc-id="${id}"]`)).html(html);
                                        }
                                        catch (e) {
                                            $(document.querySelector(`[gvc-id="${id}"]`)).html(e);
                                        }
                                        notifyLifeCycle();
                                    });
                                }
                            }
                            _start();
                        }
                    }
                    else if (document.querySelector(`[gvc-id="${id}"]`).onResumeEvent) {
                        setTimeout(() => {
                            document.querySelector(`[gvc-id="${id}"]`).onResumeEvent();
                        });
                    }
                    if (document.querySelector(`[gvc-id="${id}"]`)) {
                        document.querySelector(`[gvc-id="${id}"]`).recreateView = () => {
                            if (document.querySelector(`[gvc-id="${id}"]`) !== null) {
                                document.querySelector(`[gvc-id="${id}"]`).wasRecreate = true;
                                document.querySelector(`[gvc-id="${id}"]`).wasRender = false;
                                const height = document.querySelector(`[gvc-id="${id}"]`).offsetHeight;
                                if (height) {
                                    document.querySelector(`[gvc-id="${id}"]`).style.height = height + 'px';
                                }
                                renderBindView();
                                setTimeout(() => {
                                    if (document.querySelector(`[gvc-id="${id}"]`) !== null && document.querySelector(`[gvc-id="${id}"]`).style.height === height + 'px') {
                                        document.querySelector(`[gvc-id="${id}"]`).style.height = 'auto';
                                    }
                                }, 10);
                            }
                        };
                        document.querySelector(`[gvc-id="${id}"]`).wasRender = true;
                    }
                }
            }
            catch (e) {
                glitter.deBugMessage(e);
            }
        }
        let wasRecreate = false;
        for (const b of $(element).parents()) {
            if (b.getAttribute('glem') === 'bindView') {
                wasRecreate = b.wasRecreate;
                break;
            }
        }
        if (wasRecreate) {
            element.wasRecreate = true;
        }
        renderBindView();
    }
    else {
        for (const b of (_b = element.attributes) !== null && _b !== void 0 ? _b : []) {
            glitter.renderView.replaceAttributeValue({
                key: b.name,
                value: b.value,
            }, element);
        }
    }
    if (!(glitter.share.EditorMode === true)) {
        const inputString = element.innerHTML || element.innerText || element.textContent;
        inputString != glitter.renderView.replaceGlobalValue(inputString) && (element.innerHTML = glitter.renderView.replaceGlobalValue(inputString));
    }
}
glitter.share.traverseHTML = traverseHTML;
if (window.GL !== undefined) {
    glitter.deviceType = glitter.deviceTypeEnum.Android;
}
else if (navigator.userAgent === 'iosGlitter') {
    glitter.deviceType = glitter.deviceTypeEnum.Ios;
}
listenElementChange(`#glitterPage`);
listenElementChange(`#Navigation`);
listenElementChange(`head`);
glitter.closeDrawer();
Entry.onCreate(glitter);
function glitterInitial() {
    if (glitter.deviceType !== glitter.deviceTypeEnum.Android) {
        window.addEventListener('popstate', function (e) {
            glitter.goBack();
        });
    }
    glitter.getBoundingClientRect = document.querySelector('html').getBoundingClientRect();
    if (glitter.deviceType !== glitter.deviceTypeEnum.Web) {
        var css = document.createElement('style');
        css.type = 'text/css';
        var style = ` -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;`;
        if (css.styleSheet)
            css.styleSheet.cssText = style;
        else
            css.appendChild(document.createTextNode(style));
        document.getElementsByTagName('head')[0].appendChild(css);
    }
}
glitterInitial();
window.glitter.share.postMessageCallback = [];
window.addEventListener('message', (event) => {
    window.glitter.share.postMessageCallback = window.glitter.share.postMessageCallback.filter(function (obj, index, array) {
        return array.findIndex((item) => item.id === obj.id) === index;
    });
    window.glitter.share.postMessageCallback.map((dd) => {
        dd.fun(event);
    });
});
class GlitterWebComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.isCompoment = true;
        this.shadowRoot.innerHTML = `<div id="cp-container"></div>`;
    }
    setView(cf) {
        this.glitter = cf.gvc.glitter;
        this.listenElementChange();
        this.shadowRoot.querySelector('#cp-container').innerHTML = cf.view;
    }
    addStyleLink(filePath) {
        const link = document.createElement('link');
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.href = filePath;
        this.shadowRoot.appendChild(link);
    }
    addStyle(text) {
        var css = document.createElement('style');
        css.type = 'text/css';
        css.innerText = text;
        this.shadowRoot.appendChild(css);
    }
    addScript(filePath) {
        const link = document.createElement('script');
        link.setAttribute('src', filePath);
        this.shadowRoot.appendChild(link);
    }
    listenElementChange() {
        const glitter = this.glitter;
        const doc = this.shadowRoot;
        const observer = new MutationObserver(function (mutationsList) {
            Object.keys(glitter.elementCallback).map((dd) => {
                if (glitter.elementCallback[dd].rendered && !glitter.elementCallback[dd].doc.querySelector(`[gvc-id="${dd}"]`)) {
                    glitter.elementCallback[dd].rendered = false;
                    glitter.elementCallback[dd].onDestroy();
                }
            });
            for (let mutation of mutationsList) {
                if (mutation.addedNodes.length > 0) {
                    for (const b of mutation.addedNodes) {
                        glitter.share.traverseHTML(b, doc);
                        console.log(`traverseHTML(b)`);
                    }
                }
            }
        });
        observer.observe(this.shadowRoot, { childList: true, subtree: true });
    }
}
customElements.define('web-component', GlitterWebComponent);
