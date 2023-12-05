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

function listenElementChange(query: string) {
    const targetElement: any = document.querySelector(query);
    // 建立 Mutation Observer
    const observer = new MutationObserver(function (mutationsList) {
        //判斷BindView是否被銷毀了
        Object.keys(glitter.elementCallback).map((dd) => {
            if (glitter.elementCallback[dd].rendered && ($(`[gvc-id="${dd}"]`).length === 0)) {
                glitter.elementCallback[dd].rendered = false
                glitter.elementCallback[dd].onDestroy()
            }
        })
        // 檢查每個突變（變化）
        for (let mutation of mutationsList) {
            // 檢查是否是目標元素的子節點被插入
            if (mutation.addedNodes.length > 0) {
                // 在這裡編寫對元素插入內容的處理程式碼
                //@ts-ignore
                for (const b of mutation.addedNodes) {
                    traverseHTML($(b).get(0))
                }

            }
        }
    });
    // 開始觀察目標元素的變化
    observer.observe(targetElement, {childList: true, subtree: true});
}

function traverseHTML(element: any) {
    let result: any = {};
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
    if (children && children.length > 0) {
        result.children = [];
        for (let j = 0; j < children.length; j++) {
            result.children.push(traverseHTML(children[j]));
        }
    }

    function replaceGlobalValue(inputString: string) {
        if ((glitter.share.EditorMode === true)) {
            return inputString
        }
        const pattern = /@{{(.*?)}}/g;
        // 使用正则表达式的 exec 方法来提取匹配项
        let match;
        let convert = inputString
        while ((match = pattern.exec(inputString)) !== null) {
            const placeholder = match[0]; // 完整的匹配项，例如 "@{{value}}"
            const value = match[1]; // 提取的值，例如 "value"
            if (glitter.share.globalValue && glitter.share.globalValue[value]) {
                convert = (convert.replace(placeholder, glitter.share.globalValue[value]));
            }
        }
        return convert
    }

    if ($(element).attr('glem') === 'bindView') {
        function renderBindView() {
            function notifyLiseCycle() {
                try {
                    glitter.elementCallback[$(element).attr('gvc-id') as string].updateAttribute()
                } catch (e) {
                    glitter.deBugMessage(e)
                }
                try {
                    glitter.elementCallback[$(element).attr('gvc-id') as string].onInitial()
                } catch (e) {
                    glitter.deBugMessage(e)
                }
                try {
                    glitter.elementCallback[$(element).attr('gvc-id') as string].onCreate()
                } catch (e) {
                    glitter.deBugMessage(e)
                }
            }

            try {
                const id = $(element).attr('gvc-id') as string
                let view = glitter.elementCallback[id].getView()
                glitter.elementCallback[$(element).attr('gvc-id') as string].rendered = true
                if (typeof view === 'string') {
                    $(`[gvc-id="${id}"]`).html(replaceGlobalValue(view))
                    notifyLiseCycle()
                } else {
                    view.then((data) => {
                        $(`[gvc-id="${id}"]`).html(replaceGlobalValue(data))
                        notifyLiseCycle()
                    })
                }
                (document.querySelector(`[gvc-id="${id}"]`) as any).recreateView = renderBindView
            } catch (e) {
                glitter.deBugMessage(e)
            }
        }

        renderBindView()


    }
    for (let i = 0; i < attributes.length; i++) {
        if ((attributes[i].value.includes('clickMap') || attributes[i].value.includes('editorEvent')) && (attributes[i].name.substring(0, 2) === 'on')) {
            try {
                const funString = `${attributes[i].value}`
                $(element).off(attributes[i].name.substring(2));
                const name=attributes[i].name
                element.addEventListener(attributes[i].name.substring(2), function () {
                    if (glitter.htmlGenerate.isEditMode()&&!glitter.share.EditorMode) {
                        if (funString.indexOf('editorEvent') !== -1) {
                            eval(funString.replace('editorEvent', 'clickMap'))
                        } else if (name.substring(2) !== 'click') {
                            eval(funString)
                        }
                    } else {
                        eval(funString)
                    }
                });
                element.removeAttribute(attributes[i].name);
            } catch (e) {
                glitter.deBugMessage(e)
            }
        } else if (!(glitter.share.EditorMode === true)) {
            const inputString = attributes[i].value;
            // 正则表达式模式
            const pattern = /@{{(.*?)}}/g;
            // 使用正则表达式的 exec 方法来提取匹配项
            let match;
            while ((match = pattern.exec(inputString)) !== null) {
                const placeholder = match[0]; // 完整的匹配项，例如 "@{{value}}"
                const value = match[1]; // 提取的值，例如 "value"
                if (glitter.share.globalValue && glitter.share.globalValue[value]) {
                    attributes[i].value = attributes[i].value.replace(placeholder, glitter.share.globalValue[value])
                }
            }
        }
    }
    if (!(glitter.share.EditorMode === true)) {

        const inputString = $(element).html();
        // 正则表达式模式
        inputString != replaceGlobalValue(inputString) && $(element).html(replaceGlobalValue(inputString))
    }
    // 返回 JSON 結果
    return result;
}


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
