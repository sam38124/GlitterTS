'use strict';
import { Entry } from '../Entry.js';
import { Glitter } from './Glitter.js';
const glitter = new Glitter(window);
window.glitter = glitter;
window.rootGlitter = glitter;
function listenElementChange(query) {
    const targetElement = document.querySelector(query);
    const observer = new MutationObserver(function (mutationsList) {
        Object.keys(glitter.elementCallback).map((dd) => {
            if (glitter.elementCallback[dd].rendered && (document.querySelector(`[gvc-id="${dd}"]`))) {
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
    var _a;
    let result = {};
    result.tag = element.tagName;
    var attributes = (_a = element.attributes) !== null && _a !== void 0 ? _a : [];
    if (attributes.length > 0) {
        result.attributes = {};
        for (var i = 0; i < attributes.length; i++) {
            result.attributes[attributes[i].name] = attributes[i].value;
        }
    }
    let children = element.children;
    if (children && children.length > 0) {
        result.children = [];
        for (let j = 0; j < children.length; j++) {
            result.children.push(traverseHTML(children[j], document));
        }
    }
    if (element && element.getAttribute && (element.getAttribute('glem') === 'bindView')) {
        const id = element.getAttribute('gvc-id');
        function renderBindView() {
            glitter.consoleLog(`renderBindView`);
            function notifyLifeCycle() {
                try {
                    glitter.elementCallback[element.getAttribute('gvc-id')].updateAttribute();
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
                    glitter.elementCallback[element.getAttribute('gvc-id')].rendered = true;
                    if (!document.querySelector(`[gvc-id="${id}"]`).wasRender) {
                        let view = glitter.elementCallback[id].getView();
                        if (typeof view === 'string') {
                            element.innerHTML = glitter.renderView.replaceGlobalValue(view);
                            notifyLifeCycle();
                        }
                        else {
                            view.then((data) => {
                                element.innerHTML = glitter.renderView.replaceGlobalValue(data);
                                notifyLifeCycle();
                            });
                        }
                    }
                    else {
                        console.log(`wasRender`);
                    }
                    if (document.querySelector(`[gvc-id="${id}"]`)) {
                        document.querySelector(`[gvc-id="${id}"]`).recreateView = (() => {
                            document.querySelector(`[gvc-id="${id}"]`).wasRender = false;
                            renderBindView();
                        });
                        document.querySelector(`[gvc-id="${id}"]`).wasRender = true;
                    }
                }
            }
            catch (e) {
                glitter.deBugMessage(e);
            }
        }
        glitter.elementCallback[element.getAttribute('gvc-id')].document = document;
        glitter.elementCallback[element.getAttribute('gvc-id')].recreateView = () => {
            document.querySelector(`[gvc-id="${id}"]`).wasRender = false;
            renderBindView();
        };
        renderBindView();
    }
    else {
        for (let i = 0; i < attributes.length; i++) {
            try {
                glitter.renderView.replaceAttributeValue({
                    key: attributes[i].name,
                    value: attributes[i].value
                }, element);
            }
            catch (e) {
                console.log(e);
            }
        }
    }
    if (!(glitter.share.EditorMode === true)) {
        const inputString = element.innerHTML || element.innerText || element.textContent;
        inputString != glitter.renderView.replaceGlobalValue(inputString) && (element.innerHTML = glitter.renderView.replaceGlobalValue(inputString));
    }
    return result;
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
    console.log(`linsMessage`);
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
    }
    setView(cf) {
        const html = String.raw;
        this.glitter = cf.gvc.glitter;
        this.listenElementChange();
        this.shadowRoot.innerHTML = cf.view;
    }
    listenElementChange() {
        const glitter = (this.glitter);
        const doc = this.shadowRoot;
        const observer = new MutationObserver(function (mutationsList) {
            Object.keys(glitter.elementCallback).map((dd) => {
                if (glitter.elementCallback[dd].rendered && (document.querySelector(`[gvc-id="${dd}"]`))) {
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
