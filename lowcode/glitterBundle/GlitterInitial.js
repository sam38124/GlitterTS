'use strict';
import { Entry } from '../Entry.js';
import { Glitter } from './Glitter.js';
const glitter = new Glitter(window);
window.glitter = glitter;
window.rootGlitter = glitter;
console.log(`GlitterInitial-time:`, window.renderClock.stop());
window.addEventListener('resize', function () {
    for (var a = 0; a < glitter.windowUtil.windowHeightChangeListener.length; a++) {
        try {
            glitter.windowUtil.windowHeightChangeListener[a](window.innerHeight);
        }
        catch (e) {
        }
    }
});
function listenElementChange(query) {
    const targetElement = document.querySelector(query);
    const observer = new MutationObserver(function (mutationsList) {
        Object.keys(glitter.elementCallback).map((dd) => {
            if (glitter.elementCallback[dd].rendered && ($(`[gvc-id="${dd}"]`).length === 0)) {
                glitter.elementCallback[dd].rendered = false;
                glitter.elementCallback[dd].onDestroy();
            }
        });
        for (let mutation of mutationsList) {
            if (mutation.addedNodes.length > 0) {
                for (const b of mutation.addedNodes) {
                    traverseHTML($(b).get(0));
                }
            }
        }
    });
    observer.observe(targetElement, { childList: true, subtree: true });
}
function traverseHTML(element) {
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
            result.children.push(traverseHTML(children[j]));
        }
    }
    if ($(element).attr('glem') === 'bindView') {
        function renderBindView() {
            function notifyLifeCycle() {
                try {
                    glitter.elementCallback[$(element).attr('gvc-id')].updateAttribute();
                }
                catch (e) {
                    glitter.deBugMessage(e);
                }
                try {
                    glitter.elementCallback[$(element).attr('gvc-id')].onInitial();
                }
                catch (e) {
                    glitter.deBugMessage(e);
                }
                try {
                    glitter.elementCallback[$(element).attr('gvc-id')].onCreate();
                }
                catch (e) {
                    glitter.deBugMessage(e);
                }
            }
            try {
                const id = $(element).attr('gvc-id');
                let view = glitter.elementCallback[id].getView();
                glitter.elementCallback[$(element).attr('gvc-id')].rendered = true;
                if (!document.querySelector(`[gvc-id="${id}"]`).wasRender) {
                    if (typeof view === 'string') {
                        $(`[gvc-id="${id}"]`).html(glitter.renderView.replaceGlobalValue(view));
                        notifyLifeCycle();
                    }
                    else {
                        view.then((data) => {
                            $(`[gvc-id="${id}"]`).html(glitter.renderView.replaceGlobalValue(data));
                            notifyLifeCycle();
                        });
                    }
                }
                document.querySelector(`[gvc-id="${id}"]`).recreateView = (() => {
                    document.querySelector(`[gvc-id="${id}"]`).wasRender = false;
                    renderBindView();
                });
                document.querySelector(`[gvc-id="${id}"]`).wasRender = true;
            }
            catch (e) {
                glitter.deBugMessage(e);
            }
        }
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
        const inputString = $(element).html();
        inputString != glitter.renderView.replaceGlobalValue(inputString) && $(element).html(glitter.renderView.replaceGlobalValue(inputString));
    }
    return result;
}
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
    if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) {
        window.addEventListener('load', function () {
            setTimeout(function () {
                window.scrollTo(0, 1);
            }, 1000);
        });
    }
    glitter.getBoundingClientRect = glitter.$('html').get(0).getBoundingClientRect();
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
