'use strict';
import {Entry} from '../Entry.js';
import {Glitter} from './Glitter.js';
import {GVC} from './GVController.js';
import {GVCType} from './module/PageManager.js';
import {ApiUser} from "../glitter-base/route/user.js";

const glitter = new Glitter(window); // glitter變數
(window as any).glitter = glitter;
(window as any).rootGlitter = glitter;

function listenElementChange(query: string) {
    const targetElement: any = document.querySelector(query);
    // 建立 Mutation Observer
    const observer = new MutationObserver(function (mutationsList) {
        // 判斷BindView是否被銷毀了
        Object.keys(glitter.elementCallback).map((dd) => {
            if (glitter.elementCallback[dd].rendered && !glitter.elementCallback[dd].doc.querySelector(`[gvc-id="${dd}"]`)) {
                glitter.elementCallback[dd].rendered = false;
                glitter.elementCallback[dd].onDestroy();
            }
        });
        // 檢查每個突變（變化）
        for (let mutation of mutationsList) {
            // 檢查是否是目標元素的子節點被插入
            if (mutation.addedNodes.length > 0) {
                // 在這裡編寫對元素插入內容的處理程式碼
                //@ts-ignore
                for (const b of mutation.addedNodes) {
                    traverseHTML(b, document);
                }
            }
        }
    });
    // 開始觀察目標元素的變化
    observer.observe(targetElement, {childList: true, subtree: true});
}

function traverseHTML(element: any, document: any) {
    try {
        if (element.classList.contains('page-box')) {
            const pageConfig = glitter.pageConfig.find((dd) => {
                return `page${dd.id}` === element.getAttribute('id');
            });
            if (
                (window as any).glitter.share.to_menu &&
                glitter.pageConfig.filter((dd) => {
                    return dd.type === GVCType.Page;
                }).length > 1
            ) {
                element.style.display = 'none';
                (window as any).glitter.share.time_back = setTimeout(() => {
                    window.history.back();
                });
                return;
            }
            (window as any).glitter.share.to_menu = false;
            if (pageConfig && pageConfig.initial) {
                const scroll_top = pageConfig.scrollTop;
                [0, 100, 200, 300, 400, 500, 600, 700].map((dd) => {
                    setTimeout(() => {
                        (document.querySelector('html') as any).scrollTop = scroll_top;
                    }, dd);
                })

                function loop(element: any) {
                    if (element && element.onResumeEvent) {
                        element && element.onResumeEvent && element.onResumeEvent();
                    }
                    // 取得元素的子元素
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
    } catch (e) {
    }
    // 取得元素的子元素
    let children = element.children;
    if (children && children.length > 0) {
        for (let j = 0; j < children.length; j++) {
            traverseHTML(children[j], document);
        }
    }
    if((element.tagName || '').toLowerCase() === 'img' ){
        const src=element.getAttribute('src');
        if(src){
            try {
                const tag=glitter.generateCheckSum(src,9)
                setTimeout(()=>{
                    if(element){
                        ApiUser.getPublicConfig(`alt_`+tag,'manager').then((res)=>{
                            if(res && res.response.value){
                                setTimeout(()=>{
                                    element.setAttribute('alt', res.response.value.alt || '');
                                },10)
                            }
                        })
                    }
                },10)
            }catch (e) {

            }
        }

    }
    if (element && element.getAttribute && element.getAttribute('glem') === 'bindView') {
        const id = element.getAttribute('gvc-id') as string;
        glitter.elementCallback[id].element = element;
        (glitter.elementCallback[id] as any).first_paint = (glitter.elementCallback[id] as any).first_paint ?? true;

        function renderBindView() {
            glitter.consoleLog(`renderBindView`);

            function notifyLifeCycle() {
                try {
                    setTimeout(() => {
                        glitter.elementCallback[element.getAttribute('gvc-id') as string].updateAttribute();
                    });
                } catch (e) {
                    glitter.deBugMessage(e);
                }
                try {
                    glitter.elementCallback[element.getAttribute('gvc-id') as string].onInitial();
                } catch (e) {
                    glitter.deBugMessage(e);
                }
                try {
                    glitter.elementCallback[element.getAttribute('gvc-id') as string].onCreate();
                } catch (e) {
                    glitter.deBugMessage(e);
                }
            }

            try {
                if (document.querySelector(`[gvc-id="${id}"]`)) {
                    glitter.elementCallback[id].doc = document;
                    glitter.elementCallback[id].rendered = true;
                    if (!document.querySelector(`[gvc-id="${id}"]`).wasRender) {
                        if (typeof glitter.elementCallback[id].initial_view === 'string') {
                            glitter.elementCallback[id].initial_view = undefined
                            notifyLifeCycle();
                        } else {
                            let view = glitter.elementCallback[id].getView();

                            function _start() {
                                if (typeof view === 'string') {
                                    const html = glitter.renderView.replaceGlobalValue(view);
                                    try {
                                        $(document.querySelector(`[gvc-id="${id}"]`)).html(html);
                                    } catch (e: any) {
                                        $(document.querySelector(`[gvc-id="${id}"]`)).html(e);
                                    }
                                    notifyLifeCycle();
                                } else {
                                    view.then((data) => {
                                        const html = glitter.renderView.replaceGlobalValue(data);
                                        try {
                                            $(document.querySelector(`[gvc-id="${id}"]`)).html(html);
                                        } catch (e: any) {
                                            $(document.querySelector(`[gvc-id="${id}"]`)).html(e);
                                        }
                                        notifyLifeCycle();
                                    });
                                }
                            }

                            _start()
                        }

                        // glitter.share.render_stack=glitter.share.render_stack ?? []
                        // glitter.share.render_stack.push(_start)
                        // if(!glitter.share._render_stack_running){
                        //     glitter.share._render_stack_running=true
                        //     setTimeout(()=>{
                        //         glitter.share.render_stack.map((fun:any)=>{fun()})
                        //         glitter.share.render_stack=[]
                        //         glitter.share._render_stack_running=false
                        //     },100)
                        // }

                    } else if (document.querySelector(`[gvc-id="${id}"]`).onResumeEvent) {
                        setTimeout(() => {
                            document.querySelector(`[gvc-id="${id}"]`).onResumeEvent();
                        });
                    }
                    if (document.querySelector(`[gvc-id="${id}"]`)) {
                        document.querySelector(`[gvc-id="${id}"]`).recreateView = () => {
                            if (document.querySelector(`[gvc-id="${id}"]`) !== null) {
                                document.querySelector(`[gvc-id="${id}"]`).wasRecreate = true;
                                document.querySelector(`[gvc-id="${id}"]`).wasRender = false;
                                if(!document.querySelector(`[gvc-id="${id}"]`).style.height){
                                    const height = document.querySelector(`[gvc-id="${id}"]`).offsetHeight;
                                    if (height) {
                                        document.querySelector(`[gvc-id="${id}"]`).style.height = height + 'px';
                                    }
                                    setTimeout(() => {
                                        if (document.querySelector(`[gvc-id="${id}"]`) !== null && document.querySelector(`[gvc-id="${id}"]`).style.height === height + 'px') {
                                            document.querySelector(`[gvc-id="${id}"]`).style.removeProperty('height');
                                        }
                                    }, 10);
                                }
                                renderBindView();
                            }
                        };
                        document.querySelector(`[gvc-id="${id}"]`).wasRender = true;
                    }
                }
            } catch (e) {
                glitter.deBugMessage(e);
            }
        }

        let wasRecreate = false;
        for (const b of $(element).parents()) {
            if (b.getAttribute('glem') === 'bindView') {
                wasRecreate = (b as any).wasRecreate;
                break;
            }
        }
        if (wasRecreate) {
            element.wasRecreate = true;
        }
        renderBindView();

    } else {
        for (const b of element.attributes ?? []) {
            glitter.renderView.replaceAttributeValue(
                {
                    key: b.name,
                    value: b.value,
                },
                element
            );
        }
    }
    if (!(glitter.share.EditorMode === true)) {
        const inputString = element.innerHTML || element.innerText || element.textContent;
        inputString != glitter.renderView.replaceGlobalValue(inputString) && (element.innerHTML = glitter.renderView.replaceGlobalValue(inputString));
    }
}

glitter.share.traverseHTML = traverseHTML;
if ((window as any).GL !== undefined) {
    glitter.deviceType = glitter.deviceTypeEnum.Android;
} else if (navigator.userAgent === 'iosGlitter') {
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
            console.log(`popstate=>>`)
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
        if ((css as any).styleSheet) (css as any).styleSheet.cssText = style;
        else css.appendChild(document.createTextNode(style));
        // Append style to the tag name
        document.getElementsByTagName('head')[0].appendChild(css);
    }
}

glitterInitial();

(window as any).glitter.share.postMessageCallback = [];
window.addEventListener('message', (event: any) => {
    (window as any).glitter.share.postMessageCallback = (window as any).glitter.share.postMessageCallback.filter(function (obj: any, index: number, array: any) {
        return array.findIndex((item: any) => item.id === obj.id) === index;
    });

    (window as any).glitter.share.postMessageCallback.map((dd: any) => {
        dd.fun(event);
    });
});

class GlitterWebComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        (this.shadowRoot! as any).isCompoment = true;
        (this.shadowRoot! as any).innerHTML = `<div id="cp-container"></div>`;
    }

    public glitter?: Glitter;

    setView(cf: { gvc: GVC; view: string; id: string }) {
        this.glitter = cf.gvc.glitter;
        this.listenElementChange();
        this.shadowRoot!.querySelector('#cp-container')!.innerHTML = cf.view;
    }

    addStyleLink(filePath: string) {
        const link = document.createElement('link');
        link.type = 'text/css';
        link.rel = 'stylesheet';
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
        const glitter = this.glitter!;
        const doc = this.shadowRoot!;
        const observer = new MutationObserver(function (mutationsList) {
            // 判斷BindView是否被銷毀了
            Object.keys(glitter.elementCallback).map((dd) => {
                if (glitter.elementCallback[dd].rendered && !glitter.elementCallback[dd].doc.querySelector(`[gvc-id="${dd}"]`)) {
                    glitter.elementCallback[dd].rendered = false;
                    glitter.elementCallback[dd].onDestroy();
                }
            });
            // 檢查每個突變（變化）
            for (let mutation of mutationsList) {
                // 檢查是否是目標元素的子節點被插入
                if (mutation.addedNodes.length > 0) {
                    // 在這裡編寫對元素插入內容的處理程式碼
                    //@ts-ignore
                    for (const b of mutation.addedNodes) {
                        glitter.share.traverseHTML(b, doc);
                        console.log(`traverseHTML(b)`);
                    }
                }
            }
        });
        // 開始觀察目標元素的變化
        observer.observe(this.shadowRoot!, {childList: true, subtree: true});
    }
}

customElements.define('web-component', GlitterWebComponent);

// window.addEventListener('scroll', function (event) {
//     if (glitter.pageConfig.length - 1 >= 0) {
//         glitter.pageConfig[glitter.pageConfig.length - 1].scrollTop = window.scrollY;
//     }
// });
