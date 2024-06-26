'use strict';
import {Entry} from '../Entry.js';
import {Glitter} from './Glitter.js';
import {GVC} from "./GVController.js";
import {GVCType} from "./module/PageManager.js";

const glitter = new Glitter(window); //glitter變數
(window as any).glitter = glitter;
(window as any).rootGlitter = glitter;

function listenElementChange(query: string) {
    // document.querySelector(`[gvc-id="${id}"]`)
    const targetElement: any = document.querySelector(query);
    // 建立 Mutation Observer
    const observer = new MutationObserver(function (mutationsList) {
        //判斷BindView是否被銷毀了
        Object.keys(glitter.elementCallback).map((dd) => {
            if (glitter.elementCallback[dd].rendered && !(glitter.elementCallback[dd].doc.querySelector(`[gvc-id="${dd}"]`))) {
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
                    traverseHTML(b, document)
                }

            }
        }
    });
    // 開始觀察目標元素的變化
    observer.observe(targetElement, {childList: true, subtree: true});
}

let scrollInterval: any = undefined

function traverseHTML(element: any, document: any) {

    try {
        if ((element.tagName.toLowerCase() === 'page-box')) {
            const pageConfig = glitter.pageConfig.find((dd) => {
                return `page${dd.id}` === element.getAttribute('id')
            });
            console.log(`show_page->`, glitter.pageConfig.filter((dd) => {
                return dd.type === GVCType.Page
            }))
            if (((window as any).glitter.share.to_menu) && glitter.pageConfig.filter((dd) => {
                return dd.type === GVCType.Page
            }).length > 1) {
                element.style.display = "none";
                (window as any).glitter.share.time_back = setTimeout(() => {
                    window.history.back()
                });
                return;
            }
            (window as any).glitter.share.to_menu = false
            if (pageConfig && pageConfig.initial) {
                const scroll_top = pageConfig.scrollTop;
                (document.querySelector('html') as any).scrollTop = scroll_top;
                let count = 0
                const loopScroll = setInterval(() => {
                    count++
                    if (count < 100) {
                        (document.querySelector('html') as any).scrollTop = scroll_top;
                    } else {
                        clearInterval(loopScroll)
                    }
                })

                function loop(element: any) {
                    if (element && element.onResumeEvent) {
                        element && element.onResumeEvent && element.onResumeEvent();
                    }
                    // 取得元素的子元素
                    let children = element.children;
                    if (children && children.length > 0) {
                        for (let j = 0; j < children.length; j++) {
                            loop(children[j])
                        }
                    }
                }

                loop(element)

                return
            }
            (pageConfig) && (pageConfig.initial = true)

        }
    } catch (e) {

    }

    // 取得元素的子元素
    let children = element.children;
    if (children && children.length > 0) {
        for (let j = 0; j < children.length; j++) {
            traverseHTML(children[j], document)
        }
    }

    if (element && element.getAttribute && (element.getAttribute('glem') === 'bindView')) {
        const id = element.getAttribute('gvc-id') as string
        glitter.elementCallback[id].element = element;
        (glitter.elementCallback[id] as any).first_paint = (glitter.elementCallback[id] as any).first_paint ?? true

        function renderBindView() {
            glitter.consoleLog(`renderBindView`)

            function notifyLifeCycle() {
                try {
                    setTimeout(() => {
                        glitter.elementCallback[element.getAttribute('gvc-id') as string].updateAttribute()
                    })
                } catch (e) {
                    glitter.deBugMessage(e)
                }
                try {
                    glitter.elementCallback[element.getAttribute('gvc-id') as string].onInitial()
                } catch (e) {
                    glitter.deBugMessage(e)
                }
                try {
                    glitter.elementCallback[element.getAttribute('gvc-id') as string].onCreate()
                } catch (e) {
                    glitter.deBugMessage(e)
                }
            }

            try {
                if ((document.querySelector(`[gvc-id="${id}"]`) as any)) {
                    glitter.elementCallback[id].doc = document;
                    glitter.elementCallback[id].rendered = true;
                    if (element.tagName.toLowerCase() === 'header') {
                        console.log(`Header-start-time:`, (window as any).renderClock.stop());
                    }
                    if (!(document.querySelector(`[gvc-id="${id}"]`) as any).wasRender) {
                        let view = glitter.elementCallback[id].getView()
                        if (typeof view === 'string') {
                            const html = glitter.renderView.replaceGlobalValue(view);
                            try {
                                $(document.querySelector(`[gvc-id="${id}"]`)).html(html);
                            } catch (e: any) {
                                $(document.querySelector(`[gvc-id="${id}"]`)).html(e);
                            }

                            notifyLifeCycle()
                        } else {
                            view.then((data) => {
                                const html = glitter.renderView.replaceGlobalValue(data);
                                try {
                                    $(document.querySelector(`[gvc-id="${id}"]`)).html(html);
                                } catch (e: any) {
                                    $(document.querySelector(`[gvc-id="${id}"]`)).html(e);
                                }
                                notifyLifeCycle()
                            })
                        }
                    } else if ((document.querySelector(`[gvc-id="${id}"]`) as any).onResumeEvent) {
                        setTimeout(() => {
                            (document.querySelector(`[gvc-id="${id}"]`) as any).onResumeEvent()
                        })

                    }
                    if ((document.querySelector(`[gvc-id="${id}"]`) as any)) {
                        (document.querySelector(`[gvc-id="${id}"]`) as any).recreateView = (() => {
                            (document.querySelector(`[gvc-id="${id}"]`) as any).wasRecreate = true;
                            (document.querySelector(`[gvc-id="${id}"]`) as any).wasRender = false;
                            const height = (document.querySelector(`[gvc-id="${id}"]`) as any).offsetHeight;
                            glitter.addStyle(`.hc_${height}{
                                height:${height}px !important;
                                }`);
                            (document.querySelector(`[gvc-id="${id}"]`) as any).classList.add(`hc_${height}`);
                            renderBindView();
                            setTimeout(() => {
                                (document.querySelector(`[gvc-id="${id}"]`) as any).classList.remove(`hc_${height}`);
                            }, 10)
                        });
                        (document.querySelector(`[gvc-id="${id}"]`) as any).wasRender = true
                    }
                }
            } catch (e) {
                glitter.deBugMessage(e)
            }
        }

        let wasRecreate = false
        for (const b of $(element).parents()) {
            if (b.getAttribute('glem') === 'bindView') {
                wasRecreate = (b as any).wasRecreate;
                break
            }
        }
        if (!wasRecreate) {
            renderBindView()
        } else {
            element.wasRecreate = true;
            renderBindView()
        }
    } else {
        for (const b of (element.attributes ?? [])) {
            glitter.renderView.replaceAttributeValue({
                key: b.name,
                value: b.value
            }, element)
        }
    }

    if (!(glitter.share.EditorMode === true)) {
        const inputString = element.innerHTML || element.innerText || element.textContent
        // 正则表达式模式
        inputString != glitter.renderView.replaceGlobalValue(inputString) && (element.innerHTML = glitter.renderView.replaceGlobalValue(inputString))
    }
}

glitter.share.traverseHTML = traverseHTML
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
    glitter.getBoundingClientRect = document.querySelector('html')!.getBoundingClientRect();
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
(window as any).glitter.share.postMessageCallback = []
window.addEventListener('message', (event: any) => {
    (window as any).glitter.share.postMessageCallback = (window as any).glitter.share.postMessageCallback.filter(function (obj: any, index: number, array: any) {
        // 使用 indexOf 来检查当前对象的 ID 在数组中的第一个索引位置
        return array.findIndex((item: any) => item.id === obj.id) === index;
    });

    (window as any).glitter.share.postMessageCallback.map((dd: any) => {
        dd.fun(event)
    })
})


class GlitterWebComponent extends HTMLElement {
    constructor() {
        super();
        // 创建影子 DOM
        this.attachShadow({mode: 'open'});
        (this.shadowRoot! as any).isCompoment = true;
        (this.shadowRoot! as any).innerHTML = `<div id="cp-container"></div>`
    }

    public glitter?: Glitter

    setView(cf: {
        gvc: GVC, view: string, id: string
    }) {
        const html = String.raw
        this.glitter = cf.gvc.glitter;
        this.listenElementChange();
        (this.shadowRoot!).querySelector('#cp-container')!.innerHTML = cf.view;
    }

    addStyleLink(filePath: string) {
        const link = document.createElement('link');
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = filePath;
        this.shadowRoot!.appendChild(link);
    }

    addStyle(text: string) {
        var css = document.createElement('style');
        css.type = 'text/css';
        (css as any).innerText = text;
        this.shadowRoot!.appendChild(css);
    }

    addScript(filePath: string) {
        const link = document.createElement('script');
        link.setAttribute('src', filePath);
        this.shadowRoot!.appendChild(link);
    }

    listenElementChange() {
        const glitter = (this.glitter)!
        const doc = this.shadowRoot!
        const observer = new MutationObserver(function (mutationsList) {
            //判斷BindView是否被銷毀了
            Object.keys(glitter.elementCallback).map((dd) => {
                if (glitter.elementCallback[dd].rendered && !(glitter.elementCallback[dd].doc.querySelector(`[gvc-id="${dd}"]`))) {
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
                        glitter.share.traverseHTML(b, doc)
                        console.log(`traverseHTML(b)`)
                    }

                }
            }
        });
        // 開始觀察目標元素的變化
        observer.observe(this.shadowRoot!, {childList: true, subtree: true});
    }
}

customElements.define('web-component', GlitterWebComponent);

window.addEventListener("scroll", function (event) {
    if (glitter.pageConfig.length - 1 >= 0) {
        // 在此处编写滚动事件的处理代码
        glitter.pageConfig[glitter.pageConfig.length - 1].scrollTop = window.scrollY;
    }
});

function setStyle(element: any, document: any) {
    setTimeout(() => {
        if (element.getAttribute && !document.isCompoment) {
            const style = element.getAttribute('style')
            if (style) {
                const shortCode = `c-${generateShortCode(style)}`;
                glitter.config.style_list = glitter.config.style_list ?? {}
                if (!glitter.config.style_list[shortCode]) {
                    glitter.config.style_list[shortCode] = true
                    const cssText = `.${shortCode}{
                             ${style}
                            }`
                    glitter.addStyle(cssText)
                }
                element.classList.add(shortCode);
                element.setAttribute('style', '');
            }
        }
    })

}

function generateShortCode(str: any) {
    // 使用哈希函数生成哈希值
    const hashCode = hashCodeFromString(str);
    // 将哈希值转换为6位数的形式
    const shortCode = hashCode % 1000000;
    return shortCode.toString().padStart(6, '0'); // 将结果补全到6位数
}

// 简单的哈希函数，仅用于示例目的
function hashCodeFromString(str: any) {
    let hashCode = 0;
    for (let i = 0; i < str.length; i++) {
        hashCode = (hashCode << 5) - hashCode + str.charCodeAt(i);
        hashCode &= hashCode; // Convert to 32bit integer
    }
    return hashCode;
}