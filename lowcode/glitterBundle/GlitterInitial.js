'use strict';
import { Entry } from '../Entry.js';
import { Glitter } from './Glitter.js';
var glitter = new Glitter(window);
window.glitter = glitter;
window.rootGlitter = glitter;
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
    function replaceGlobalValue(inputString) {
        if ((glitter.share.EditorMode === true)) {
            return inputString;
        }
        const pattern = /@{{(.*?)}}/g;
        let match;
        let convert = inputString;
        while ((match = pattern.exec(inputString)) !== null) {
            const placeholder = match[0];
            const value = match[1];
            if (glitter.share.globalValue && glitter.share.globalValue[value]) {
                convert = (convert.replace(placeholder, glitter.share.globalValue[value]));
            }
        }
        return convert;
    }
    if ($(element).attr('glem') === 'bindView') {
        function renderBindView() {
            function notifyLiseCycle() {
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
                if (typeof view === 'string') {
                    $(`[gvc-id="${id}"]`).html(replaceGlobalValue(view));
                    notifyLiseCycle();
                }
                else {
                    view.then((data) => {
                        $(`[gvc-id="${id}"]`).html(replaceGlobalValue(data));
                        notifyLiseCycle();
                    });
                }
                document.querySelector(`[gvc-id="${id}"]`).recreateView = renderBindView;
            }
            catch (e) {
                glitter.deBugMessage(e);
            }
        }
        renderBindView();
    }
    for (let i = 0; i < attributes.length; i++) {
        if ((attributes[i].value.includes('clickMap') || attributes[i].value.includes('editorEvent')) && (attributes[i].name.substring(0, 2) === 'on')) {
            try {
                const funString = `${attributes[i].value}`;
                $(element).off(attributes[i].name.substring(2));
                const name = attributes[i].name;
                element.addEventListener(attributes[i].name.substring(2), function () {
                    if (glitter.htmlGenerate.isEditMode() && !glitter.share.EditorMode) {
                        if (funString.indexOf('editorEvent') !== -1) {
                            eval(funString.replace('editorEvent', 'clickMap'));
                        }
                        else if (name.substring(2) !== 'click') {
                            eval(funString);
                        }
                    }
                    else {
                        eval(funString);
                    }
                });
                element.removeAttribute(attributes[i].name);
            }
            catch (e) {
                glitter.deBugMessage(e);
            }
        }
        else if (!(glitter.share.EditorMode === true)) {
            const inputString = attributes[i].value;
            const pattern = /@{{(.*?)}}/g;
            let match;
            while ((match = pattern.exec(inputString)) !== null) {
                const placeholder = match[0];
                const value = match[1];
                if (glitter.share.globalValue && glitter.share.globalValue[value]) {
                    attributes[i].value = attributes[i].value.replace(placeholder, glitter.share.globalValue[value]);
                }
            }
        }
    }
    if (!(glitter.share.EditorMode === true)) {
        const inputString = $(element).html();
        inputString != replaceGlobalValue(inputString) && $(element).html(replaceGlobalValue(inputString));
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
