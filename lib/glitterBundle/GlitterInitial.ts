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
function listenElementChange(query:string){
    const targetElement:any = document.querySelector(query);
    // 建立 Mutation Observer
    const observer = new MutationObserver(function(mutationsList) {
        // 檢查每個突變（變化）
        for (let mutation of mutationsList) {
            // 檢查是否是目標元素的子節點被插入
            if (mutation.addedNodes.length > 0) {
                // 在這裡編寫對元素插入內容的處理程式碼
                for (const b of mutation.addedNodes){
                    traverseHTML($(b).get(0))
                }

            }
        }
    });
    // 開始觀察目標元素的變化
    observer.observe(targetElement, { childList: true,subtree: true  });
}
function traverseHTML(element: any) {
    let result: any = {};
    // console.log(`tagName:${element.tagName}`)
    // 取得元素的標籤名稱
    result.tag = element.tagName;

    // 取得元素的屬性
    var attributes = element.attributes ?? [];
    if (attributes.length > 0) {
        result.attributes = {};
        for (var i = 0; i < attributes.length; i++) {
            result.attributes[attributes[i].name] = attributes[i].value;
        }
    }
    // 取得元素的子元素
    let children = element.children;
    if (children&&children.length > 0) {
        result.children = [];
        for (let j = 0; j < children.length; j++) {
            result.children.push(traverseHTML(children[j]));
        }
    }
    if($(element).attr('glem')==='bindView'){
        try { $(element).html(glitter.elementCallback[$(element).attr('gvc-id') as string].getView())}catch (e) {
        }
        try {  glitter.elementCallback[$(element).attr('gvc-id') as string].updateAttribute()}catch (e) {
        }
        try {glitter.elementCallback[$(element).attr('gvc-id') as string].onInitial()}catch (e) {
        }
        try {  glitter.elementCallback[$(element).attr('gvc-id') as string].onCreate()}catch (e) {
        }
    }
    // 返回 JSON 結果
    return result;
}
glitter.$(document).ready(function () {
    if ((window as any).GL !== undefined) {
        glitter.deviceType = glitter.deviceTypeEnum.Android;
    } else if (navigator.userAgent === 'iosGlitter') {
        glitter.deviceType = glitter.deviceTypeEnum.Ios;
    }
    listenElementChange(`#glitterPage`)
    listenElementChange(`#Navigation`)
    listenElementChange(`head`)
    glitter.closeDrawer()
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
