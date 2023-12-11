import {GVC} from '../GVController.js';
import {Glitter} from '../Glitter.js';
import {EditorElem} from '../plugins/editor-elem.js';
//@ts-ignore
import autosize from '../plugins/autosize.js'
import {widgetComponent} from "../html-component/widget.js";
import {codeComponent} from "../html-component/code.js";
import {response} from "express";
import {TriggerEvent} from "../plugins/trigger-event.js";

export interface HtmlJson {
    route: string;
    type: string;
    id: string;
    hashTag: string;
    label: string;
    data: any;
    js: string;
    layoutMode?: string;
    class?: string;
    style?: string;
    css: {
        class: any;
        style: any;
    };
    refreshAll?: () => void;
    refreshComponent?: () => void;
    refreshComponentParameter?: { view1: () => void; view2: () => void };
    refreshAllParameter?: { view1: () => void; view2: () => void };
    expand?: boolean;
    expandStyle?: boolean;

    styleManager?: {
        get: (obj: { title: string; tag: string; def: string }) => string;
        editor: (gvc: GVC, array: { [name: string]: { title: string; tag: string; def: string } }, title?: string) => string;
    };
    selectStyle: string;
    formData:any;
    gCount:'multiple'|'single';
    arrayData:any
}

export class HtmlGenerate {
    public static share: any = {};

    public static isEditMode = isEditMode

    public static resourceHook: (src: string) => string = (src) => {
        return src;
    };

    public static configureCDN(src: string) {
        return src
        // return src.replace(`https://liondesign-prd.s3.amazonaws.com`,`https://d3jnmi1tfjgtti.cloudfront.net`);
    }

    public render: (gvc: GVC, option?: {
        class: string; style: string; divCreate?: boolean, jsFinish?: () => void, containerID?: string, onCreate?: () => void, attribute?: { key: string, value: string }[],
        childContainer?: boolean
    }, createOption?: any) => string;
    public exportJson: (setting: HtmlJson[]) => any;
    public editor: (gvc: GVC, option?: { return_: boolean; refreshAll: () => void; setting?: any[]; deleteEvent?: () => void, hideInfo?: boolean }) => string;
    public static saveEvent = (boolean?: boolean) => {
        alert('save');
    };

    public static getResourceLink(url: string) {
        const glitter = (window as any).glitter
        url = glitter.htmlGenerate.resourceHook(url)
        if (!url.startsWith('http') && !url.startsWith('https')) {
            url = new URL(`./${url}`, new URL('../../', import.meta.url).href).href
        }
        return url
    }

    public static loadScript = (glitter: Glitter, js: { src: string, callback?: (widget: any) => void }[]) => {
        glitter.share.htmlExtension = glitter.share.htmlExtension ?? {}
        js.map((dd) => {
            dd.src = HtmlGenerate.reDefineJsResource(dd.src)
            let key = glitter.htmlGenerate.resourceHook(dd.src)
            if (!key.includes('http')) {
                key = new URL(key, new URL('../../', import.meta.url).href).href
            }

            function checkStore() {
                const result = glitter.share.htmlExtension[key]
                if (result) {
                    dd.callback && dd.callback(glitter.share.htmlExtension[key])
                }
                return result
            }

            if (!checkStore()) {
                glitter.share.htmlExtensionResourceCallback = glitter.share.htmlExtensionResourceCallback ?? {}
                glitter.share.htmlExtensionResourceCallback[key] = glitter.share.htmlExtensionResourceCallback[key] ?? []
                glitter.share.htmlExtensionResourceCallback[key].push(dd.callback)
                if (!glitter.share.htmlExtension[`_init_${key}`]) {
                    glitter.share.htmlExtension[`_init_${key}`] = true
                    Object.defineProperty(glitter.share.htmlExtension, key, {
                        // getter 函数返回属性的值
                        get() {
                            return glitter.share.htmlExtension[`_${key}`];
                        },
                        // setter 函数设置属性的值，并触发监听事件
                        set(newValue) {
                            glitter.share.htmlExtension[`_${key}`] = newValue
                            glitter.share.htmlExtensionResourceCallback[key].map((callback: any) => {
                                callback && callback(newValue)
                            })
                        },
                        // 可选：指定属性是否可枚举
                        enumerable: true,
                        // 可选：指定属性是否可配置
                        configurable: true
                    });
                }

            }
        })
        glitter.addMtScript(
            js.map((dd) => {
                let key = glitter.htmlGenerate.configureCDN(glitter.htmlGenerate.resourceHook(dd.src))
                if (!key.includes('http')) {
                    key = new URL(key, new URL('../../', import.meta.url).href).href
                }
                return {
                    type: 'module',
                    src: key
                }
            }),
            () => {
            },
            () => {
            },
            [
                {key: "async", value: "true"}
            ]
        );
    }

    public static reDefineJsResource(js: string) {
        return js.replace('http://127.0.0.1:4000/glitter/official_view_component/official.js', new URL('official_view_component/official.js', new URL('../../', import.meta.url).href).href)

    }

    public static loadEvent = (glitter: Glitter, js: { src: string, callback?: (widget: any) => void }[]) => {
        glitter.share.componentData = glitter.share.componentData ?? {}
        js.map((dd) => {
            let key = glitter.htmlGenerate.resourceHook(dd.src)
            if (!key.includes('http')) {
                key = new URL(key, new URL('../../', import.meta.url).href).href
            }

            function checkStore() {
                const result = glitter.share.componentData[key]
                if (result) {
                    dd.callback && dd.callback(glitter.share.componentData[key])
                }
                return result
            }

            if (!checkStore()) {
                glitter.share.componentDataResourceCallback = glitter.share.componentDataResourceCallback ?? {}
                glitter.share.componentDataResourceCallback[key] = glitter.share.componentDataResourceCallback[key] ?? []
                glitter.share.componentDataResourceCallback[key].push(dd.callback)
                if (!glitter.share.componentData[`_init_${key}`]) {
                    glitter.share.componentData[`_init_${key}`] = true
                    Object.defineProperty(glitter.share.componentData, key, {
                        // getter 函数返回属性的值
                        get() {
                            return glitter.share.componentData[`_${key}`];
                        },
                        // setter 函数设置属性的值，并触发监听事件
                        set(newValue) {
                            glitter.share.componentData[`_${key}`] = newValue
                            glitter.share.componentDataResourceCallback[key].map((callback: any) => {
                                callback && callback(newValue)
                            })
                        },
                        // 可选：指定属性是否可枚举
                        enumerable: true,
                        // 可选：指定属性是否可配置
                        configurable: true
                    });
                }

            }
        })
        glitter.addMtScript(
            js.map((dd) => {
                let key = glitter.htmlGenerate.configureCDN(glitter.htmlGenerate.resourceHook(dd.src))
                if (!key.includes('http')) {
                    key = new URL(key, new URL('../../', import.meta.url).href).href
                }
                return {
                    type: 'module',
                    src: key
                }
            }),
            () => {
            },
            () => {
            },
            [
                {key: "async", value: "true"}
            ]
        );
    }
    public static getKey = (js: string) => {
        let key = (window as any).glitter.htmlGenerate.resourceHook(js)
        if (!key.includes('http')) {
            key = new URL(key, location.href).href
        }
        return key
    }
    public static renameWidgetID = (dd: any) => {
        dd.id = (window as any).glitter.getUUID()
        if (dd.type === 'container') {
            dd.data.setting.map((d2: any) => {
                HtmlGenerate.renameWidgetID(d2)
            })
        }
        return dd
    }

    public static scrollToCenter(gvc: GVC, elementId: string) {
        // 找到要滚动到的元素
        var element = gvc.getBindViewElem(elementId).get(0);
        if (element) {

            // 获取元素的位置信息
            var elementRect = element.getBoundingClientRect();
            var elementTop = elementRect.top;
            var elementHeight = elementRect.height;

            // 获取窗口的高度
            var windowHeight = window.innerHeight || document.documentElement.clientHeight;

            // 计算滚动位置，以使元素的中心位于窗口的垂直中心
            var scrollTo = elementTop - (windowHeight - elementHeight) / 2;

            // 滚动页面
            gvc.glitter
                .$('html')
                .get(0).scrollTo({
                top: scrollTo,
                left: 0,
                behavior: 'instant' // 使用平滑滚动效果，如果需要的话
            });

        }
    }

    public static styleEditor(data: any, gvc?: GVC, widget?: HtmlJson, subData?: any) {
        const glitter = (gvc ?? (window as any)).glitter

        function getStyleData() {
            const globalStyle = glitter.share.globalStyle
            if (data.style_from === 'tag') {
                if (globalStyle[data.tag]) {
                    return globalStyle[data.tag]
                } else {
                    return data
                }
            } else {
                return data
            }
        }

        return {
            editor: (gvc: GVC, widget: HtmlJson | (() => void), title?: string, option?: any) => {
                const glitter = (window as any).glitter;
                return `
<div type="button" class="btn  w-100 " style="background:white;width:calc(100%);border-radius:8px;
                    min-height:45px;border:1px solid black;color:#151515;" onclick="${
                    gvc.event(() => {
                        glitter.openDiaLog("glitterBundle/plugins/dialog-style-editor.js", "dialog-style-editor", {
                            callback: () => {
                                if (typeof widget === 'function') {
                                    widget()
                                } else {
                                    (widget as any).refreshComponent()
                                }
                            },
                            data: data,
                            option: option
                        })
                    })
                }">${title ?? "設計樣式"}</div><br>`;
            },
            class: () => {
                const data = getStyleData()

                function getClass(data: any) {
                    let classs = ''
                    if (data.classDataType === 'static') {
                        return data.class
                    } else {
                        try {
                            if (data.classDataType === 'code') {
                                classs = eval(`(() => {
                                    ${data.class}
                                })()`)
                            } else {
                                classs = eval(data.class)
                            }

                        } catch (e) {
                            classs = data.class
                        }
                        return classs
                    }
                }

                const tempMap: any = {};
                (data.stylist ?? []).map((dd: any) => {
                    tempMap[dd.size] = (() => {
                        return getClass(dd)
                    })
                })

                return glitter.ut.frSize(tempMap, (() => {
                    return getClass(data)
                }))()
            },
            style: () => {
                const data = getStyleData()
                let styles = ''

                function getStyle(data: any) {

                    let style = ''
                    if (data.dataType === 'static') {
                        return data.style
                    } else {

                        try {
                            if (data.dataType === 'code') {
                                style = eval(`(() => {
                                    ${data.style}
                                })()`)
                            } else {
                                style = eval(data.style)
                            }
                        } catch (e) {
                            style = data.style
                        }
                        return style
                    }
                }

                const tempMap: any = {};
                (data.stylist ?? []).map((dd: any) => {
                    tempMap[dd.size] = (() => {
                        return getStyle(dd)
                    })
                })
                styles = glitter.ut.frSize(tempMap, (() => {
                    return getStyle(data)
                }))()
                let styleString: string[] = [styles];
                (data.styleList ?? []).map((dd: any) => {
                    Object.keys(dd.data).map((d2) => {
                        styleString.push([d2, dd.data[d2]].join(':'));
                    });
                });
                return styleString.join(';');
            },
        };
    }

    public static editor_component(data: any, gvc?: GVC, widget?: HtmlJson, subData?: any): {
        [name: string]: any,
        editor: (gvc: GVC, widget: HtmlJson | (() => void), title?: string, option?: any) => string,
        class: () => string,
        style: () => string
    } {
        const glitter = (gvc ?? (window as any)).glitter
        const response = glitter.htmlGenerate.styleEditor(data, gvc, widget, subData)
        Object.keys(data).map((dd: string) => {
            if (['styleList', 'class', 'style'].indexOf(dd) === -1) {
                Object.defineProperty(response, dd, {
                    get: function () {
                        return data[dd]
                    },
                    set(v) {
                        data[dd] = v
                    }
                })
            }
        })
        return response;
    }

    public static setHome = (obj: { page_config?: any; app_config?: any, config: any; editMode?: any; data: any; tag: string; option?: any }) => {
        const glitter = Glitter.glitter;
        glitter.setHome(
            'glitterBundle/plugins/html-render.js',
            obj.tag,
            {
                app_config: obj.app_config,
                page_config: obj.page_config ?? {},
                config: obj.config,
                editMode: obj.editMode,
                data: obj.data,
            },
            obj.option ?? {}
        );
    };
    public static changePage = (obj: { page_config?: any; config: any; editMode?: any; data: any; tag: string; goBack: boolean; option?: any, app_config?: any }) => {
        const glitter = Glitter.glitter;
        glitter.changePage(
            'glitterBundle/plugins/html-render.js',
            obj.tag,
            obj.goBack,
            {
                app_config: obj.app_config,
                page_config: obj.page_config ?? {},
                config: obj.config,
                editMode: obj.editMode,
                data: obj.data,
            },
            obj.option ?? {}
        );
    };

    public static editeInput(obj: {
        gvc: GVC; title: string; default: string; placeHolder: string; callback: (text: string) => void,
        type?: string
    }) {
        obj.title = obj.title ?? ""
        return `<h3 class="fw-500 mt-2 " style="font-size: 15px;margin-bottom: 10px;color:#151515;" >${obj.title}</h3>
<input class="form-control mb-2" type="${obj.type ?? 'text'}" placeholder="${obj.placeHolder}" onchange="${obj.gvc.event((e) => {
            obj.callback(e.value);
        })}" value="${obj.default ?? ''}">`;
    }


    public static editeText(obj: { gvc: GVC; title: string; default: string; placeHolder: string; callback: (text: string) => void }) {
        obj.title = obj.title ?? ""
        const id = obj.gvc.glitter.getUUID()
        return `<h3 style="font-size: 15px;margin-bottom: 10px;color:#151515;" class="mt-2 fw-500 d-flex align-items-center  ${(!obj.title) ? `d-none` : ``}">${obj.title}</h3>

${obj.gvc.bindView({
            bind: id,
            view: () => {
                return obj.default ?? ''
            },
            divCreate: {
                elem: `textArea`,
                style: `max-height:400px!important;min-height:170px;`,
                class: `form-control`, option: [
                    {key: 'placeholder', value: obj.placeHolder},
                    {
                        key: 'onchange', value: obj.gvc.event((e) => {
                            obj.callback(e.value);
                        })
                    }
                ]
            },
            onCreate: () => {
                //@ts-ignore
                autosize(obj.gvc.getBindViewElem(id))
            }
        })}`;
    }

    public setting: HtmlJson[];

    constructor(setting: HtmlJson[], hover: string[] = [], subdata?: any, root?: boolean) {
        this.setting = setting;
        subdata = subdata ?? {}
        HtmlGenerate.share.false = HtmlGenerate.share.false ?? {}
        const editContainer = (window as any).glitter.getUUID();
        let lastIndex: any = undefined;
        setting.map((dd) => {
            dd.css = dd.css ?? {};
            dd.css.style = dd.css.style ?? {};
            dd.css.class = dd.css.class ?? {};
            dd.refreshAllParameter = dd.refreshAllParameter ?? {
                view1: () => {
                },
                view2: () => {
                },
            };
            dd.refreshComponentParameter = dd.refreshComponentParameter ?? {
                view1: () => {
                },
                view2: () => {
                },
            };
            dd.refreshAll = () => {
                dd.refreshAllParameter!.view1();
                dd.refreshAllParameter!.view2();
            };
            dd.refreshComponent = () => {
                try {
                    dd.refreshComponentParameter!.view1();
                    dd.refreshComponentParameter!.view2();
                } catch (e: any) {
                    (window as any).glitter.deBugMessage(`${e.message}<br>${e.stack}<br>${e.line}`)
                }
            };
            return dd;
        });


        this.render = (gvc: GVC, option: {
            class: string; style: string, jsFinish?: () => void, containerID?: string, onCreate?: () => void,
            attribute?: { key: string, value: string }[], childContainer?: boolean
        } = {
            class: ``,
            style: ``,
            containerID: gvc.glitter.getUUID(),
            jsFinish: () => {
            },
            onCreate: () => {
            }
        }, createOption?: any) => {
            const childContainer = option.childContainer
            option = option ?? {}
            const container = option.containerID ?? gvc.glitter.getUUID();
            return gvc.bindView(() => {
                return {
                    bind: container,
                    view: () => {
                        return new Promise((resolve, reject) => {
                            let waitAddScript: string[] = []
                            gvc.glitter.defaultSetting.pageLoading();

                            function startRender() {
                                const start = new Date().getTime()
                                new Promise(async (resolve, reject) => {
                                    //The component module need to be initial.
                                    function initialComponent(set: any[]) {
                                        let waitAdd: any = []
                                        for (const a of set) {
                                            if (['code'].indexOf(a.type) === -1) {

                                                if ((a.type !== 'widget') && (a.type !== 'container') && !gvc.glitter.share.htmlExtension[gvc.glitter.htmlGenerate.configureCDN(gvc.glitter.htmlGenerate.configureCDN(gvc.glitter.htmlGenerate.resourceHook(a.js)))]) {
                                                    waitAdd.push({
                                                        src: `${gvc.glitter.htmlGenerate.configureCDN(gvc.glitter.htmlGenerate.resourceHook(a.js))}`,
                                                        type: 'module'
                                                    })
                                                }
                                                if (a.type === 'container') {
                                                    waitAdd = waitAdd.concat(initialComponent(a.data.setting))
                                                }
                                            }
                                        }
                                        return waitAdd
                                    }

                                    gvc.glitter.htmlGenerate.loadScript(gvc.glitter, initialComponent(setting))

                                    //The script or trigger function need to be execute first.
                                    async function initialScript() {
                                        //異步執行的事件
                                        for (const script of setting.filter((dd) => {
                                            return dd.type === 'code' && dd.data.triggerTime === 'async'
                                        })) {
                                            codeComponent.render(gvc, script as any, setting as any, [], subdata).view()
                                        }
                                        //同步渲染前需執行
                                        for (const script of setting.filter((dd) => {
                                            return dd.type === 'code' && dd.data.triggerTime === 'first'
                                        })) {
                                            await codeComponent.render(gvc, script as any, setting as any, [], subdata).view()
                                        }
                                    }

                                    await initialScript()
                                    for (const b of setting) {
                                        if ((b as any).preloadEvenet) {
                                            await TriggerEvent.trigger({
                                                gvc,
                                                widget: b as any,
                                                clickEvent: (b as any).preloadEvenet
                                            })
                                        }

                                    }
                                    //Set htmlGenerate content.
                                    const html = setting.map((dd) => {
                                        dd.formData=(setting as any).formData;
                                        dd.refreshAllParameter!.view1 = () => {
                                            gvc.notifyDataChange(container)
                                        };
                                        const tempUiID = gvc.glitter.getUUID()

                                        //Load resource
                                        function loadResource() {
                                            if (dd.data.elem === 'style') {
                                                gvc.addStyle(dd.data.inner)
                                            } else if ((dd.data.elem === 'link') && (dd.data.attr.find((dd: any) => {
                                                return dd.attr === 'rel' && dd.value === 'stylesheet'
                                            }))) {
                                                gvc.addStyleLink(dd.data.attr.find((dd: any) => {
                                                    return dd.attr === 'href'
                                                }).value)
                                            } else if (((dd.data.elem === 'script')) && dd.data.attr.find((dd: any) => {
                                                return dd.attr === 'src'
                                            })) {
                                                waitAddScript.push(dd.data.attr.find((dd: any) => {
                                                    return dd.attr === 'src'
                                                }).value)
                                            }
                                        }

                                        loadResource()

                                        //Render Component
                                        function renderView(callback: (data: string) => void) {
                                            gvc.glitter.htmlGenerate.loadScript(gvc.glitter, [{
                                                src: dd.js,
                                                callback: (data: any) => {
                                                    if(data[dd.type].render.version==='v2'){
                                                        data = data[dd.type].render({
                                                            gvc: gvc, widget: dd, widgetList: setting, hoverID: hover, subData: subdata,
                                                            formData:(setting as any).formData
                                                        })
                                                            .view()
                                                    }else{
                                                        data = data[dd.type].render(gvc, dd, setting, hover, subdata)
                                                            .view()
                                                    }
                                                    if (typeof data === 'string') {
                                                        callback(data as string)
                                                    } else {
                                                        data.then((dd: any) => {
                                                            callback(dd as string)
                                                        })
                                                    }
                                                }
                                            }])
                                        }

                                        //Get the html content for this component
                                        function getHtml() {
                                            if ((dd.data.elem === 'style') || ((dd.data.elem === 'link') && (dd.data.attr.find((dd: any) => {
                                                return dd.attr === 'rel' && dd.value === 'stylesheet'
                                            }))) || (((dd.data.elem === 'script')) && dd.data.attr.find((dd: any) => {
                                                return dd.attr === 'src'
                                            }))) {
                                                return ``
                                            }
                                            if (['code'].indexOf(dd.type) === -1) {
                                                if ((dd.type === 'widget') || (dd.type === 'container')) {
                                                    return gvc.bindView(() => {
                                                        const tempView = gvc.glitter.getUUID()
                                                        return {
                                                            bind: tempView,
                                                            view: () => {
                                                                return ``
                                                            },
                                                            divCreate: {
                                                                class: ``
                                                            },
                                                            onCreate: () => {
                                                                dd.refreshComponentParameter!.view1 = () => {
                                                                    gvc.notifyDataChange(container)
                                                                };
                                                                const option: any = []
                                                                if (isEditMode() && !childContainer) {
                                                                    option.push({
                                                                        key: "onclick", value: (() => {
                                                                            return gvc.editorEvent((e, event) => {
                                                                                try {
                                                                                    if ((dd as any).selectEditEvent()) {
                                                                                        hover = [dd.id];
                                                                                        gvc.glitter.$('.selectComponentHover').removeClass('selectComponentHover');
                                                                                        gvc.glitter.$(e).addClass('selectComponentHover');
                                                                                    }
                                                                                    scrollToHover()
                                                                                    event.stopPropagation()
                                                                                } catch {
                                                                                }

                                                                            })
                                                                        })()
                                                                    })
                                                                }
                                                                const target = gvc.glitter.document.querySelector(`[gvc-id="${gvc.id(tempView)}"]`)
                                                                if(dd.gCount==='multiple'){
                                                                    new Promise(async (resolve,reject)=>{
                                                                        const data: any = (await TriggerEvent.trigger({
                                                                            gvc, widget:(dd as any) , clickEvent: dd.arrayData, subData: subdata
                                                                        }))
                                                                        target!.outerHTML = data.map((subData:any)=>{
                                                                            return (widgetComponent.render(gvc, dd as any, setting as any, hover, subData, {
                                                                                option: option,
                                                                                widgetComponentID: gvc.glitter.getUUID()
                                                                            })
                                                                                .view() as string)
                                                                        }).join('')
                                                                    })
                                                                }else{
                                                                    target!.outerHTML = (widgetComponent.render(gvc, dd as any, setting as any, hover, subdata, {
                                                                        option: option,
                                                                        widgetComponentID: gvc.glitter.getUUID()
                                                                    })
                                                                        .view() as string)
                                                                }

                                                            },
                                                            onDestroy: () => {},
                                                        }
                                                    })
                                                } else {
                                                    return gvc.bindView(() => {
                                                        const component = dd.id
                                                        let innerText = ''

                                                        function getdd() {
                                                            renderView((data) => {
                                                                innerText = data
                                                                gvc.notifyDataChange(component)
                                                            })
                                                        }

                                                        dd.refreshComponentParameter!.view1 = () => {
                                                            getdd()
                                                        };
                                                        getdd();
                                                        let option: any = []
                                                        if (isEditMode() && !childContainer) {
                                                            option.push({
                                                                key: "onclick", value: (() => {
                                                                    return gvc.editorEvent((e, event) => {
                                                                        try {
                                                                            if ((dd as any).selectEditEvent()) {
                                                                                hover = [dd.id];
                                                                                gvc.glitter.$('.selectComponentHover').removeClass('selectComponentHover');
                                                                                gvc.glitter.$(e).addClass('selectComponentHover');
                                                                            }
                                                                            scrollToHover()
                                                                            event.stopPropagation()
                                                                        } catch (e) {
                                                                            console.log(e)
                                                                        }

                                                                    })
                                                                })()
                                                            })
                                                        }
                                                        return {
                                                            bind: component!,
                                                            view: () => {
                                                                return innerText
                                                            },
                                                            divCreate: {
                                                                style: `${gvc.glitter.htmlGenerate.styleEditor(dd, gvc, dd, {}).style()} `,
                                                                class: `position-relative ${dd.class ?? ''} ${(dd.hashTag) ? `glitterTag${dd.hashTag}`:''} ${hover.indexOf(component) !== -1 ? ` selectComponentHover` : ``}
                                                        ${gvc.glitter.htmlGenerate.styleEditor(dd, gvc, dd, {}).class()}`,
                                                                option: option
                                                            },
                                                            onCreate: () => {
                                                            },
                                                        }
                                                    })
                                                }
                                            } else {
                                                return ``
                                            }
                                        }
                                        return getHtml()
                                    }).join('')
                                    resolve(html)
                                }).then((html) => {
                                    resolve(html as string)
                                    //Need exe function when render finish.
                                    new Promise(async (resolve, reject) => {
                                        for (const script of setting.filter((dd) => {
                                            return dd.type === 'code' && dd.data.triggerTime === 'last'
                                        })) {
                                            await codeComponent.render(gvc, script as any, setting as any, [], subdata).view()
                                        }
                                        for (const a of waitAddScript) {
                                            // console.log(`loadScript:` + a)
                                            await new Promise((resolve, reject) => {
                                                gvc.glitter.addMtScript([{
                                                    src: a
                                                }], () => {
                                                    setTimeout(() => {
                                                        resolve(true)
                                                    }, 10)

                                                }, () => {
                                                    resolve(false)
                                                })
                                            })
                                        }
                                        resolve(true)
                                    }).then(() => {
                                        gvc.glitter.consoleLog(`renderFinish-${(new Date().getTime() - start) / 1000}`)
                                        gvc.glitter.defaultSetting.pageLoadingFinish();
                                        option.jsFinish && option.jsFinish()
                                    })
                                })
                            }

                            startRender()

                        })
                    },
                    divCreate: createOption ?? {
                        class: option.class, style: option.style, option: [{
                            key: `gl_type`,
                            value: "container"
                        }]
                    },
                    onInitial: () => {
                    },
                    onCreate: () => {
                        option.onCreate && option.onCreate()
                        // gvc.glitter.deBugMessage(`containerRender:`+container)
                    }
                }
            })
        };

        this.editor = (
            gvc: GVC,
            option = {
                return_: false,
                refreshAll: () => {
                },
                setting: setting,
                deleteEvent: () => {
                },
                hideInfo: false
            }
        ) => {
            var loading = true;
            const oset = this.setting;

            function getData() {
                function initialComponent(set: any[]) {
                    let waitAdd: any = []
                    for (const a of set) {
                        if (['code'].indexOf(a.type) === -1) {

                            if ((a.type !== 'widget') && (a.type !== 'container') && !gvc.glitter.share.htmlExtension[gvc.glitter.htmlGenerate.configureCDN(gvc.glitter.htmlGenerate.configureCDN(gvc.glitter.htmlGenerate.resourceHook(a.js)))]) {
                                waitAdd.push({
                                    src: `${gvc.glitter.htmlGenerate.configureCDN(gvc.glitter.htmlGenerate.resourceHook(a.js))}`,
                                    type: 'module'
                                })
                            }
                            if (a.type === 'container') {
                                waitAdd = waitAdd.concat(initialComponent(a.data.setting))
                            }
                        }
                    }
                    return waitAdd
                }

                gvc.glitter.htmlGenerate.loadScript(gvc.glitter, initialComponent(option.setting ?? setting))
                loading = false;
                gvc.notifyDataChange(editContainer);
            }

            getData();
            return gvc.bindView({
                bind: editContainer,
                view: () => {
                    if (loading) {
                        return ``;
                    } else {
                        return gvc.map(
                            (option.setting ?? setting).map((dd, index) => {
                                try {
                                    dd.formData=(setting as any).formData;
                                    const component = gvc.glitter.getUUID();
                                    dd.refreshAllParameter = dd.refreshAllParameter ?? {
                                        view1: () => {
                                        },
                                        view2: () => {
                                        },
                                    };
                                    dd.refreshComponent = () => {
                                        try {
                                            dd.refreshComponentParameter!.view2();
                                            dd.refreshComponentParameter!.view1();
                                        } catch (e: any) {
                                            (window as any).glitter.deBugMessage(`${e.message}<br>${e.stack}<br>${e.line}`);
                                        }
                                    };
                                    dd.refreshComponentParameter = dd.refreshComponentParameter ?? {
                                        view1: () => {
                                        },
                                        view2: () => {
                                        },
                                    };
                                    dd.refreshAllParameter!.view2 = () => {
                                        gvc.notifyDataChange(editContainer);
                                    };
                                    dd.refreshAll = () => {
                                        dd.refreshAllParameter!.view1();
                                        dd.refreshAllParameter!.view2();
                                        option.refreshAll();
                                    };
                                    const toggleView = gvc.glitter.getUUID();
                                    const toggleEvent = gvc.event(() => {
                                        dd.expand = !dd.expand;
                                        gvc.notifyDataChange([toggleView, component]);
                                    });

                                    return `<div style=" ${
                                        option.return_
                                            ? `padding: 10px;`
                                            : `padding-bottom: 10px;margin-bottom: 10px;border-bottom: 1px solid lightgrey;`
                                    }" class="
${option.return_ ? `w-100 border rounded bg-dark mt-2` : ``} " >
${gvc.bindView(() => {
                                        let loading = true
                                        let data: string | Promise<string> = ''

                                        function getData() {
                                            if (dd.type === 'code') {
                                                data = codeComponent.render(gvc, dd, setting as any, hover, subdata, {
                                                    widgetComponentID: gvc.glitter.getUUID()
                                                })
                                                    .editor()
                                                loading = false
                                                gvc.notifyDataChange(component)
                                            } else if ((dd.type === 'widget') || (dd.type === 'container')) {
                                                data = widgetComponent.render(gvc, dd, setting as any, hover, subdata, {
                                                    widgetComponentID: gvc.glitter.getUUID()
                                                })
                                                    .editor()
                                                loading = false
                                                gvc.notifyDataChange(component)
                                            } else {
                                                loading = true
                                                gvc.glitter.htmlGenerate.loadScript(gvc.glitter, [{
                                                    src: gvc.glitter.htmlGenerate.resourceHook(dd.js),
                                                    callback: (data2: any) => {
                                                        if(data2[dd.type].render.version==='v2'){
                                                            data = data2[dd.type].render({
                                                                gvc: gvc, widget: dd, widgetList: setting, hoverID: hover, subData: subdata,
                                                                formData:(setting as any).formData
                                                            })
                                                                .editor()
                                                        }else{
                                                            data = data2[dd.type].render(gvc, dd, setting, hover, subdata)
                                                                .editor()
                                                        }
                                                        if (typeof data === 'string') {
                                                            loading = false
                                                            gvc.notifyDataChange(component)
                                                        } else {
                                                            data2.then((dd: any) => {
                                                                data = dd
                                                                loading = false
                                                                gvc.notifyDataChange(component)
                                                            })
                                                        }
                                                    }
                                                }])
                                            }
                                        }

                                        dd.refreshComponentParameter!.view2 = () => {
                                            getData();
                                        };
                                        getData()
                                        return {
                                            bind: component!,
                                            view: () => {
                                                if (option.return_ && !dd.expand) {
                                                    return ``;
                                                }
                                                try {

                                                    return gvc.map([
                                                        (() => {
                                                            if (loading) {
                                                                return ``
                                                            } else {
                                                                return [
                                                                    gvc.bindView(() => {
                                                                        const uid = gvc.glitter.getUUID();
                                                                        return {
                                                                            bind: uid,
                                                                            view: () => {
                                                                                dd.preloadEvenet = dd.preloadEvenet ?? {};
                                                                                return [gvc.glitter.htmlGenerate.styleEditor(dd, gvc, dd, {}).editor(
                                                                                    gvc,
                                                                                    () => {
                                                                                        gvc.notifyDataChange('showView')
                                                                                    },
                                                                                    '模塊容器樣式'
                                                                                )].join(`<div class="my-2"></div>`);
                                                                            },
                                                                            divCreate: {
                                                                                class: 'mt-2 mb-2 '
                                                                            },
                                                                        };
                                                                    }),
                                                                    data as string
                                                                ].join(`<div class="my-1"></div>`)
                                                            }
                                                        })()
                                                    ]);
                                                } catch (e: any) {
                                                    return `<div class="alert alert-danger mt-2" role="alert" style="word-break: break-word;white-space: normal;">
  <i class="fa-duotone fa-triangle-exclamation"></i>
  <br>
解析錯誤:${e.message}
<br>
${e.stack}
<br>
${e.line}
</div>`;
                                                }
                                            },
                                            divCreate: {},
                                        }
                                    })}</div>`;
                                } catch (e: any) {

                                    HtmlGenerate.share.false[dd.js] = (HtmlGenerate.share.false[dd.js] ?? 0) + 1
                                    gvc.glitter.deBugMessage(`解析錯誤:${e.message}<br>${e.stack}<br>${e.line}`)
                                    if (HtmlGenerate.share.false[dd.js] < 80) {
                                        setTimeout(() => {
                                            getData()
                                        }, 100)
                                    }
                                    return `
<div class="alert alert-danger" role="alert" style="word-break: break-word;white-space: normal;">
  <i class="fa-duotone fa-triangle-exclamation"></i>
<br>
解析錯誤:${e.message}
<br>
${e.stack}
<br>
${e.line}
</div>`;
                                }
                            })
                        );
                    }
                },
                divCreate: {},
                onCreate: () => {
                },
            });
        };
        this.exportJson = (setting: HtmlJson[]) => {
            return JSON.stringify(setting);
        };


    }
}

function isEditMode() {
    try {
        return (window.parent as any).editerData !== undefined
    } catch (e) {
        return false
    }

}

function scrollToHover() {
    function scrollToItem(element: any) {
        if (element) {
            element.scrollIntoView({
                behavior: 'auto', // 使用平滑滾動效果
                block: 'center', // 將元素置中
            })
        }
    }

    scrollToItem(document.querySelector('.selectComponentHover'))

}