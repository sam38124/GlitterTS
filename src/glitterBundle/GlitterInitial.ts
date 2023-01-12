'use strict';
import {Entry} from '../Entry.js';
import {Glitter} from './Glitter.js';

var glitter = new Glitter(window); //glitter變數
(window as any).glitter = glitter;
(window as any).rootGlitter = glitter;
window.addEventListener('resize', function () {
    for (var a = 0; a < glitter.windowUtil.windowHeightChangeListener.length; a++) {
        try {
            (glitter.windowUtil.windowHeightChangeListener[a] as any)(window.innerHeight);
        } catch (e) {
        }
    }
});

glitter.$(document).ready(function () {
    if ((window as any).GL !== undefined) {
        glitter.deviceType = glitter.deviceTypeEnum.Android;
    } else if (navigator.userAgent === 'iosGlitter') {
        glitter.deviceType = glitter.deviceTypeEnum.Ios;
    }
    Entry.onCreate(glitter);
});

function glitterInitial() {
    if (glitter.deviceType !== glitter.deviceTypeEnum.Android) {
        window.addEventListener('popstate', function (e) {
            glitter.goBack();
        });
    }

    if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) {
        /* iOS hides Safari address bar */
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
        if ((css as any).styleSheet)
            (css as any).styleSheet.cssText = style;
        else
            css.appendChild(document.createTextNode(style));
        /* Append style to the tag name */
        document.getElementsByTagName('head')[0].appendChild(css);

    }
}

glitterInitial();
