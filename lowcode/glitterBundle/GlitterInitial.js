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
        try {
            $(element).html(glitter.elementCallback[$(element).attr('gvc-id')].getView());
        }
        catch (e) {
        }
        try {
            glitter.elementCallback[$(element).attr('gvc-id')].updateAttribute();
        }
        catch (e) {
        }
        try {
            glitter.elementCallback[$(element).attr('gvc-id')].onInitial();
        }
        catch (e) {
        }
        try {
            glitter.elementCallback[$(element).attr('gvc-id')].onCreate();
        }
        catch (e) {
        }
    }
    return result;
}
glitter.$(document).ready(function () {
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
});
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
