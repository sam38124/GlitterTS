import {GVC} from '../GVController.js';
import {Glitter} from '../Glitter.js';
//@ts-ignore
import autosize from '../plugins/autosize.js'
import {widgetComponent} from "../html-component/widget.js";
import {codeComponent} from "../html-component/code.js";
import {TriggerEvent} from "../plugins/trigger-event.js";
import {EditorElem} from "../plugins/editor-elem.js";
import {Storage} from "../helper/storage.js";
import {GlobalEvent} from "../api/global-event.js";
import {ShareDialog} from "../dialog/ShareDialog.js";
import {NormalPageEditor} from "../../editor/normal-page-editor.js";
import {StyleEditor} from "../plugins/style-editor.js";
import {AddComponent} from "../../editor/add-component.js";

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
    formData: any;
    gCount: 'multiple' | 'single';
    arrayData: any,
    editorEvent: any;
    pageConfig: any;
    appConfig: any;
    global: any;
    share: any;
    bundle: any;
    event: any
}

const html = String.raw

export class HtmlGenerate {
    public static share: any = {};

    public static isEditMode = isEditMode

    public static resourceHook: (src: string) => string = (src) => {
        if (Storage.develop_mode === 'true') {
            (window as any).saasConfig.appConfig.initialList.map((dd: any) => {
                src = src.replace(`$${dd.tag}`, dd.staging)
            })
        } else {
            (window as any).saasConfig.appConfig.initialList.map((dd: any) => {
                src = src.replace(`$${dd.tag}`, dd.official)
            })
        }
        return src;
    };

    public static configureCDN(src: string) {
        return src
        // return src.replace(`https://liondesign-prd.s3.amazonaws.com`,`https://d3jnmi1tfjgtti.cloudfront.net`);
    }

    public render: (gvc: GVC, option?: {
        class: string; style: string, jsFinish?: () => void, containerID?: string, onCreate?: () => void,
        onInitial?: () => void,
        onDestroy?: () => void,
        attribute?: { key: string, value: string }[], childContainer?: boolean, page_config?: any, app_config?: any,
        document?: any,
        editorSection?: string
    }, createOption?: any) => string;
    public exportJson: (setting: HtmlJson[]) => any;
    public editor: (gvc: GVC, option?: { return_: boolean; refreshAll: () => void; setting?: any[]; deleteEvent?: () => void, hideInfo?: boolean }) => string;
    public static saveEvent = (boolean?: boolean, callback?: () => void) => {
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

    public static loadScript = (glitter: Glitter, js: { src: string, callback?: (widget: any) => void }[], where: string = 'htmlExtension') => {
        glitter.share[where] = glitter.share[where] ?? {}
        js.map((dd) => {
            dd.src = HtmlGenerate.reDefineJsResource(dd.src)
            let key = glitter.htmlGenerate.resourceHook(dd.src)
            if (!key.includes('http')) {
                key = new URL(key, new URL('../../', import.meta.url).href).href
            }

            function checkStore() {
                const result = glitter.share[where][key]
                if (result) {
                    dd.callback && dd.callback(glitter.share[where][key])
                }
                return result
            }

            if (!checkStore()) {
                glitter.share.htmlExtensionResourceCallback = glitter.share.htmlExtensionResourceCallback ?? {}
                glitter.share.htmlExtensionResourceCallback[key] = glitter.share.htmlExtensionResourceCallback[key] ?? []
                glitter.share.htmlExtensionResourceCallback[key].push(dd.callback)
                if (!glitter.share[where][`_init_${key}`]) {
                    glitter.share[where][`_init_${key}`] = true
                    Object.defineProperty(glitter.share[where], key, {
                        // getter 函数返回属性的值
                        get() {
                            return glitter.share[where][`_${key}`];
                        },
                        // setter 函数设置属性的值，并触发监听事件
                        set(newValue) {
                            glitter.share[where][`_${key}`] = newValue
                            glitter.share.htmlExtensionResourceCallback[key].map((callback: any) => {
                                callback && callback(newValue)
                            })
                            glitter.share.htmlExtensionResourceCallback[key] = []
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
        if (js.includes("official_view_component/official.js")) {
            return new URL('official_view_component/official.js', new URL('../../', import.meta.url).href).href
        }
        return js
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
                            glitter.share.componentDataResourceCallback[key] = []
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
        var element = gvc.getBindViewElem(elementId)
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
            const response = (() => {
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
            })();
            response.list = response.list ?? []
            response.version = 'v2'
            return response
        }

        return {
            editor: (gvc: GVC, widget: HtmlJson | (() => void), title?: string, option?: any) => {
                const glitter = (window as any).glitter;
                return `
<div type="button" class="btn  w-100 " style="background:white;width:calc(100%);border-radius:8px;
                    min-height:45px;border:1px solid black;color:#151515;" onclick="${
                    gvc.event(() => {
                        NormalPageEditor.closeEvent = () => {
                            if (typeof widget === 'function') {
                                widget()
                            } else {
                                (widget as any).refreshComponent()
                            }
                        }
                        NormalPageEditor.toggle({
                            visible: true,
                            title: title || '設計樣式編輯',
                            view: StyleEditor.main(gvc, {
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
                        // glitter.openDiaLog("glitterBundle/plugins/style-editor.js", "dialog-style-editor", {
                        //     callback: () => {
                        //         if (typeof widget === 'function') {
                        //             widget()
                        //         } else {
                        //             (widget as any).refreshComponent()
                        //         }
                        //     },
                        //     data: data,
                        //     option: option
                        // })
                    })
                }">${title ?? "設計樣式"}</div><br>`;
            },
            class: () => {
                function classString(data: any) {
                    function getClass(data: any) {
                        let classs = ''
                        if (data.classDataType === 'static') {
                            return data.class
                        } else if (data.classDataType === 'triggerEvent') {
                            return glitter.promiseValue(new Promise(async (resolve, reject) => {
                                resolve((await TriggerEvent.trigger({
                                    gvc: gvc!, widget: widget as any, clickEvent: data.trigger, subData: subData,
                                })))
                            }))
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
                }

                return [getStyleData()].concat(getStyleData().list ?? []).map((dd) => {
                    const data = classString(dd)
                    return data && ` ${data}`
                }).join('')
            },
            style: () => {
                function styleString(data: any) {
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
                                } else if (data.dataType === 'triggerEvent') {
                                    return glitter.promiseValue(new Promise(async (resolve, reject) => {
                                        resolve((await TriggerEvent.trigger({
                                            gvc: gvc!,
                                            widget: widget as any,
                                            clickEvent: data.triggerStyle,
                                            subData: subData,
                                        })))
                                    }))
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
                    // 正则表达式模式
                    let styleStringJoin = styleString.join(';');

                    // 使用正则表达式的 exec 方法来提取匹配项
                    function replaceString(pattern: any) {
                        let match;
                        while ((match = pattern.exec(styleStringJoin)) !== null) {
                            const placeholder = match[0]; // 完整的匹配项，例如 "@{{value}}"
                            const value = match[1]; // 提取的值，例如 "value"
                            if (glitter.share.globalValue && glitter.share.globalValue[value]) {
                                styleStringJoin = styleStringJoin.replace(placeholder, glitter.share.globalValue[value])
                            }
                        }
                    }

                    replaceString(/\/\**@{{(.*?)}}\*\//g)
                    replaceString(/@{{(.*?)}}/g)
                    return styleStringJoin
                }

                return (data.basic_style || '') + [getStyleData()].concat(getStyleData().list ?? []).map((dd) => {
                    const data = styleString(dd)
                    return data && ` ${data}`
                }).join('')
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
        console.log(`changePage-time:`, (window as any).renderClock.stop())
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

    public initialFunction = () => {
    }

    public static hover_items: string[] = []

    constructor(setting: HtmlJson[], hoverInitial: string[] = [], subData?: any, root?: boolean) {

        const editContainer = (window as any).glitter.getUUID();
        this.setting = setting;
        this.initialFunction = () => {
            HtmlGenerate.hover_items = [Storage.lastSelect]
            const formData = (setting as any).formData;
            subData = subData ?? {}
            let share: any = {}
            HtmlGenerate.share.false = HtmlGenerate.share.false ?? {}
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
                dd.formData = dd.formData ?? formData;
                dd.event = (key: string, subData: any) => {
                    return new Promise(async (resolve, reject) => {
                        GlobalEvent.getGlobalEvent({
                            tag: key
                        }).then(async (d2) => {
                            try {
                                const event = d2.response.result[0]
                                const response = await TriggerEvent.trigger({
                                    gvc: (dd as any).global.gvc,
                                    widget: (dd as any),
                                    clickEvent: event.json,
                                    subData: subData
                                })
                                resolve(response)
                            } catch (e) {
                                resolve(false)
                            }
                        })
                    })
                }
                return dd;
            });

            function loop(array: any) {
                array.map((dd: any) => {
                    if (dd.type === 'container') {
                        loop(dd.data.setting ?? [])
                    }
                    if (!dd.storage) {
                        let storage: any = {}
                        Object.defineProperty(dd, "storage", {
                            get: function () {
                                return storage;
                            },

                            set(v) {
                                storage = v;
                            }
                        })
                    }
                    if (!dd.share) {
                        Object.defineProperty(dd, "share", {
                            get: function () {
                                return share;
                            },

                            set(v) {
                                share = v;
                            }
                        })
                    }

                    if (!dd.bundle) {
                        Object.defineProperty(dd, "bundle", {
                            get: function () {
                                return subData ?? {};
                            },

                            set(v) {
                                subData = v;
                            }
                        })
                    }
                })
            }

            loop(setting)
        }
        this.initialFunction()

        this.render = (gvc: GVC, option: {
            class: string; style: string, jsFinish?: () => void, containerID?: string, onCreate?: () => void,
            onInitial?: () => void,
            onDestroy?: () => void,
            attribute?: { key: string, value: string }[], childContainer?: boolean, page_config?: any, app_config?: any
            document?: any,
            editorSection?: string
        } = {
            class: ``,
            style: ``,
            containerID: gvc.glitter.getUUID(),
            jsFinish: () => {
            },
            onCreate: () => {
            }
        }, createOption?: any) => {
            const document = option.document ?? (gvc.glitter.document)
            // console.log(`document`,document)
            const childContainer = option.childContainer
            const renderStart = (window as any).renderClock.stop()
            option = option ?? {}
            const container = option.containerID ?? gvc.glitter.getUUID();


            return gvc.bindView(() => {
                return {
                    bind: container,
                    view: () => {
                        return new Promise(async (resolve, reject) => {
                            const view = [await new Promise((resolve, reject) => {
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
                                                codeComponent.render(gvc, script as any, setting as any, [], subData).view()
                                            }
                                            //同步渲染前需執行
                                            for (const script of setting.filter((dd) => {
                                                return dd.type === 'code' && dd.data.triggerTime === 'first'
                                            })) {
                                                await codeComponent.render(gvc, script as any, setting as any, [], subData).view()
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
                                            if ((b as any).hiddenEvent) {
                                                const hidden = await TriggerEvent.trigger({
                                                    gvc,
                                                    widget: b as any,
                                                    clickEvent: (b as any).hiddenEvent,
                                                    subData: subData
                                                })
                                                if (hidden) {
                                                    const formData = (setting as any).formData;
                                                    setting = setting.filter((dd) => {
                                                        return dd !== b
                                                    });
                                                    (setting as any).formData = formData
                                                }
                                            }

                                        }
                                        //Set htmlGenerate content.
                                        const html = setting.map((dd,index) => {
                                            dd.formData = dd.formData || (setting as any).formData;
                                            dd.global = dd.global ?? []
                                            dd.global.gvc = gvc
                                            dd.global.pageConfig = option.page_config
                                            dd.global.appConfig = option.app_config
                                            dd.refreshAllParameter!.view1 = () => {
                                                gvc.notifyDataChange(container)
                                            };

                                            //Load resource
                                            function loadResource() {
                                                if ((dd.data.elem === 'link') && (dd.data.attr.find((dd: any) => {
                                                    return dd.attr === 'rel' && dd.value === 'stylesheet'
                                                }))) {
                                                    gvc.glitter.addStyleLink(dd.data.attr.find((dd: any) => {
                                                        return dd.attr === 'href'
                                                    }).value, document)
                                                } else if (((dd.data.elem === 'script')) && dd.data.attr.find((dd: any) => {
                                                    return dd.attr === 'src'
                                                })) {
                                                    waitAddScript.push(dd.data.attr.find((dd: any) => {
                                                        return dd.attr === 'src'
                                                    }).value)
                                                }
                                            }

                                            loadResource()

                                            //Get the html content for this component
                                            function getHtml() {
                                                if (((dd.data.elem === 'link') && (dd.data.attr.find((dd: any) => {
                                                    return dd.attr === 'rel' && dd.value === 'stylesheet'
                                                }))) || (((dd.data.elem === 'script')) && dd.data.attr.find((dd: any) => {
                                                    return dd.attr === 'src'
                                                }))) {
                                                    return ``
                                                }
                                                if (!isEditMode() && ((dd as any).visible === false)) {
                                                    return ``
                                                } else if (['code'].indexOf(dd.type) === -1) {
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

                                                                    function addCreateOption(option: any, widgetComponentID: string) {

                                                                        if (isEditMode() && !childContainer && root) {
                                                                            option.push({
                                                                                key: "onclick", value: (() => {

                                                                                    dd.editorEvent = () => {
                                                                                        HtmlGenerate.selectWidget({
                                                                                            gvc: gvc,
                                                                                            dd: dd,
                                                                                            root: root!,
                                                                                            widgetComponentID: dd.id,
                                                                                            event: document.querySelector(`[gvc-id="${gvc.id(dd.id)}"]`)
                                                                                        })
                                                                                        scrollToHover(gvc.glitter.$(`.editor_it_${dd.id}`).get(0))
                                                                                    }
                                                                                    return gvc.editorEvent((e, event) => {
                                                                                        HtmlGenerate.selectWidget({
                                                                                            gvc: gvc,
                                                                                            dd: dd,
                                                                                            root: root!,
                                                                                            widgetComponentID: dd.id,
                                                                                            event: event
                                                                                        })
                                                                                    })
                                                                                })()
                                                                            })
                                                                        }
                                                                    }

                                                                    const target: any = (document as any).querySelector(`[gvc-id="${gvc.id(tempView)}"]`)

                                                                    if (dd.gCount === 'multiple') {
                                                                        new Promise(async (resolve, reject) => {
                                                                            let data: any = (await TriggerEvent.trigger({
                                                                                gvc,
                                                                                widget: (dd as any),
                                                                                clickEvent: dd.arrayData,
                                                                                subData: subData
                                                                            }));
                                                                            if (!Array.isArray(data) && data) {
                                                                                data = [data]
                                                                            }
                                                                            if (!data) {
                                                                                data = []
                                                                            }
                                                                            target!.outerHTML = data.map((subData: any) => {
                                                                                let option: any = []
                                                                                const widgetComponentID = gvc.glitter.getUUID()
                                                                                addCreateOption(option, widgetComponentID)
                                                                                return (widgetComponent.render(gvc, dd as any, setting as any, HtmlGenerate.hover_items, subData, {
                                                                                    option: option,
                                                                                    widgetComponentID: widgetComponentID,
                                                                                    root: root
                                                                                }, document)
                                                                                    .view() as string)
                                                                            }).join('')
                                                                        })
                                                                    } else {
                                                                        let option: any = []
                                                                        const widgetComponentID = gvc.glitter.getUUID()
                                                                        addCreateOption(option, widgetComponentID)
                                                                        target!.outerHTML = (widgetComponent.render(gvc, dd as any, setting as any, HtmlGenerate.hover_items, (dd as any).subData || subData, {
                                                                            option: option,
                                                                            widgetComponentID: widgetComponentID,
                                                                            root: root
                                                                        }, document)
                                                                            .view() as string)
                                                                    }
                                                                },
                                                                onDestroy: () => {
                                                                },
                                                            }
                                                        })
                                                    } else {
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
                                                                    const target = document.querySelector(`[gvc-id="${gvc.id(tempView)}"]`)

                                                                    function render(subData: any) {
                                                                        return gvc.bindView(() => {
                                                                            const component = gvc.glitter.getUUID()
                                                                            dd.refreshComponentParameter!.view1 = () => {
                                                                                gvc.notifyDataChange(component)
                                                                            };
                                                                            let option: any = []
                                                                            if (isEditMode() && !childContainer && root) {
                                                                                option.push({
                                                                                    key: "onclick", value: (() => {
                                                                                        dd.editorEvent = () => {
                                                                                            HtmlGenerate.selectWidget({
                                                                                                gvc: gvc,
                                                                                                dd: dd,
                                                                                                widgetComponentID: dd.id,
                                                                                                event: document.querySelector(`[gvc-id="${gvc.id(component)}"]`),
                                                                                                root: root!
                                                                                            })
                                                                                            scrollToHover(gvc.glitter.$(`.editor_it_${dd.id}`).get(0))
                                                                                        }
                                                                                        return gvc.editorEvent((e, event) => {
                                                                                            HtmlGenerate.selectWidget({
                                                                                                gvc: gvc,
                                                                                                dd: dd,
                                                                                                widgetComponentID: dd.id,
                                                                                                event: event,
                                                                                                root: root!
                                                                                            })
                                                                                        })
                                                                                    })()
                                                                                })
                                                                            }
                                                                            return {
                                                                                bind: component!,
                                                                                view: () => {
                                                                                    return new Promise(async (resolve, reject) => {
                                                                                        const view = [await new Promise((resolve, reject) => {
                                                                                            gvc.glitter.htmlGenerate.loadScript(gvc.glitter, [{
                                                                                                src: dd.js,
                                                                                                callback: (data: any) => {
                                                                                                    if (data[dd.type].render.version === 'v2') {
                                                                                                        data = data[dd.type].render({
                                                                                                            gvc: gvc,
                                                                                                            widget: dd,
                                                                                                            widgetList: setting,
                                                                                                            hoverID: HtmlGenerate.hover_items,
                                                                                                            subData: subData,
                                                                                                            formData: dd.formData
                                                                                                        })
                                                                                                            .view()
                                                                                                    } else {
                                                                                                        data = data[dd.type].render(gvc, dd, setting, HtmlGenerate.hover_items, subData)
                                                                                                            .view()
                                                                                                    }
                                                                                                    if (typeof data === 'string') {
                                                                                                        resolve(data)
                                                                                                    } else {
                                                                                                        data.then((dd: any) => {
                                                                                                            resolve(dd as string)
                                                                                                        })
                                                                                                    }
                                                                                                }
                                                                                            }])
                                                                                        })];
                                                                                        if (root && isEditMode()) {
                                                                                            const html = String.raw;
                                                                                            view.push(HtmlGenerate.getEditorSelectSection({
                                                                                                id: dd.id,
                                                                                                gvc: gvc,
                                                                                                label: dd.label
                                                                                            }))
                                                                                        }
                                                                                        resolve(view.join(''))
                                                                                    })
                                                                                },
                                                                                divCreate: {
                                                                                    style: `position: relative;${gvc.glitter.htmlGenerate.styleEditor(dd, gvc, dd, {}).style()};${((dd as any).visible === false) ? `display:none;` : ``}`,
                                                                                    class: `${dd.class ?? ''} ${(dd.hashTag) ? `glitterTag${dd.hashTag}` : ''} 
                                                                                ${(isEditMode() ? `editorParent` : ``)}
                                                                ${gvc.glitter.htmlGenerate.styleEditor(dd, gvc, dd, {}).class()}`,
                                                                                    option: option
                                                                                },
                                                                                onCreate: () => {
                                                                                    TriggerEvent.trigger({
                                                                                        gvc,
                                                                                        widget: dd as any,
                                                                                        clickEvent: (dd as any).onCreateEvent,
                                                                                        subData: subData
                                                                                    })
                                                                                    gvc.glitter.document.querySelector(`[gvc-id="${gvc.id(component)}"]`).onResumeEvent = () => {
                                                                                        TriggerEvent.trigger({
                                                                                            gvc,
                                                                                            widget: dd as any,
                                                                                            clickEvent: (dd as any).onResumtEvent,
                                                                                            subData: subData
                                                                                        })
                                                                                    }
                                                                                },
                                                                                onInitial: () => {
                                                                                    TriggerEvent.trigger({
                                                                                        gvc,
                                                                                        widget: dd as any,
                                                                                        clickEvent: (dd as any).onInitialEvent,
                                                                                        subData: subData
                                                                                    })
                                                                                },
                                                                                onDestroy: () => {
                                                                                    TriggerEvent.trigger({
                                                                                        gvc,
                                                                                        widget: dd as any,
                                                                                        clickEvent: (dd as any).onDestoryEvent,
                                                                                        subData: subData
                                                                                    })
                                                                                }
                                                                            }
                                                                        })
                                                                    }

                                                                    if (dd.gCount === 'multiple') {
                                                                        new Promise(async (resolve, reject) => {
                                                                            let data: any = (await TriggerEvent.trigger({
                                                                                gvc,
                                                                                widget: (dd as any),
                                                                                clickEvent: dd.arrayData,
                                                                                subData: subData
                                                                            }))

                                                                            if (!Array.isArray(data) && data) {
                                                                                data = [data]
                                                                            }
                                                                            if (!data) {
                                                                                console.log(`isNull`, dd)
                                                                                data = []
                                                                            }
                                                                            target!.outerHTML = data.map((subData: any) => {
                                                                                return render(subData)
                                                                            }).join('')

                                                                        })
                                                                    } else {
                                                                        target!.outerHTML = render((dd as any).subData || subData)
                                                                    }
                                                                },
                                                                onDestroy: () => {
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
                                                await codeComponent.render(gvc, script as any, setting as any, [], subData).view()
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
                                                    resolve(true)
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
                            })]
                            if (isEditMode() && option && option.editorSection) {
                                view.push(HtmlGenerate.getEditorSelectSection({
                                    id: option.editorSection,
                                    gvc: gvc,
                                    label: '容器'
                                }))
                            }
                            resolve(view.join(''))
                        })
                    },
                    divCreate: createOption ?? {
                        class: option.class, style: option.style, option: [{
                            key: `gl_type`,
                            value: "container"
                        }]
                    },
                    onInitial: () => {
                        option.onInitial && option.onInitial()
                    },
                    onCreate: () => {
                        gvc.glitter.deBugMessage(`RenderFinishID:${option.containerID}`)
                        gvc.glitter.deBugMessage(`RenderFinish-time:(start:${renderStart})-(end:${(window as any).renderClock.stop()})`)
                        option.onCreate && option.onCreate()
                    },
                    onDestroy: () => {
                        option.onDestroy && option.onDestroy()
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

                        return (option.setting ?? setting).map((dd, index) => {
                            try {
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
                                        : ``
                                }" class="
${option.return_ ? `w-100 border rounded bg-dark mt-2` : ``} " >
${(() => {
                                    return gvc.bindView(() => {
                                        const id = gvc.glitter.getUUID()
                                        return {
                                            bind: id,
                                            view: () => {
                                                return new Promise(async (resolve, reject) => {
                                                    let haveUserMode = false
                                                    let mode: 'user' | 'dev' = Storage.editor_mode
                                                    if ((dd.type !== 'code') && !((dd.type === 'widget') || (dd.type === 'container'))) {
                                                        haveUserMode = await new Promise(async (resolve, reject) => {
                                                            gvc.glitter.htmlGenerate.loadScript(gvc.glitter, [{
                                                                src: gvc.glitter.htmlGenerate.resourceHook(dd.js),
                                                                callback: (data2: any) => {
                                                                    if (data2[dd.type].render.version === 'v2') {
                                                                        if (data2[dd.type].render({
                                                                            gvc: gvc,
                                                                            widget: dd,
                                                                            widgetList: setting,
                                                                            hoverID: HtmlGenerate.hover_items,
                                                                            subData: subData,
                                                                            formData: dd.formData
                                                                        }).user_editor) {
                                                                            resolve(true)
                                                                        } else {
                                                                            resolve(false)
                                                                        }
                                                                    } else {
                                                                        if (data2[dd.type].render({
                                                                            gvc: gvc,
                                                                            widget: dd,
                                                                            widgetList: setting,
                                                                            hoverID: HtmlGenerate.hover_items,
                                                                            subData: subData,
                                                                            formData: dd.formData
                                                                        }).user_editor) {
                                                                            resolve(true)
                                                                        } else {
                                                                            resolve(false)
                                                                        }
                                                                    }
                                                                }
                                                            }])
                                                        })
                                                    }
                                                    if (haveUserMode && mode === 'user') {
                                                        resolve([
                                                            gvc.bindView(() => {
                                                                let loading = true
                                                                let data: string | Promise<string> = ''

                                                                function getData() {
                                                                    loading = true
                                                                    gvc.glitter.htmlGenerate.loadScript(gvc.glitter, [{
                                                                        src: gvc.glitter.htmlGenerate.resourceHook(dd.js),
                                                                        callback: (data2: any) => {
                                                                            if (data2[dd.type].render.version === 'v2') {
                                                                                data = data2[dd.type].render({
                                                                                    gvc: gvc,
                                                                                    widget: dd,
                                                                                    widgetList: setting,
                                                                                    hoverID: HtmlGenerate.hover_items,
                                                                                    subData: subData,
                                                                                    formData: dd.formData
                                                                                })
                                                                                    .user_editor()
                                                                            } else {
                                                                                data = data2[dd.type].render(gvc, dd, setting, HtmlGenerate.hover_items, subData)
                                                                                    .user_editor()
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
                                                            })].join(''))
                                                    } else {
                                                        resolve([
                                                            (Storage.select_function === 'user-editor') ? `` : gvc.bindView(() => {
                                                                const vm: {
                                                                    id: string,
                                                                    type: 'edit' | 'preview'
                                                                } = {
                                                                    id: gvc.glitter.getUUID(),
                                                                    type: "preview"
                                                                }

                                                                return {
                                                                    bind: vm.id,
                                                                    view: () => {
                                                                        if (vm.type === 'edit') {
                                                                            return `<i class="fa-solid fa-check me-2" style="color:#295ed1;cursor:pointer;" onclick="${
                                                                                gvc.event(() => {
                                                                                    vm.type = 'preview'
                                                                                    gvc.notifyDataChange(vm.id)
                                                                                })
                                                                            }"></i>
${EditorElem.editeInput({
                                                                                gvc: gvc,
                                                                                title: '',
                                                                                default: dd.label,
                                                                                placeHolder: '請輸入自定義模塊名稱',
                                                                                callback: (text) => {
                                                                                    dd.label = text;
                                                                                    gvc.notifyDataChange(['right_NAV', 'MainEditorLeft'])
                                                                                },
                                                                            })}`
                                                                        } else {
                                                                            return `<i class="fa-solid fa-pencil me-2" style="color:black;cursor:pointer;" onclick="${
                                                                                gvc.event(() => {
                                                                                    vm.type = 'edit'
                                                                                    gvc.notifyDataChange(vm.id)
                                                                                })
                                                                            }"></i>
<span class="fw-bold" style="color:black;text-overflow: ellipsis;max-width:120px;overflow: hidden;">${dd.label}</span>
<div class="flex-fill"></div>
<button class="btn ms-2 btn-outline-secondary-c d-flex align-items-center justify-content-center p-0
${(dd.data.elem === 'script' || dd.data.elem === 'style' || dd.data.elem === 'link' || dd.type === 'code') ? `d-none` : ``}
" style="height: 30px;width: 70px;gap:5px;"
onclick="${gvc.event(() => {
                                                                                NormalPageEditor.toggle({
                                                                                    visible: true,
                                                                                    title: '進階設定',
                                                                                    view: (() => {
                                                                                        const html = String.raw
                                                                                        const id = gvc.glitter.getUUID()
                                                                                        let vm: {
                                                                                            select: 'info' | 'loading' | 'lifecycle'
                                                                                        } = {
                                                                                            select: 'info'
                                                                                        }
                                                                                        return [
                                                                                            gvc.bindView(() => {
                                                                                                const selectID = gvc.glitter.getUUID()
                                                                                                return {
                                                                                                    bind: selectID,
                                                                                                    view: () => {

                                                                                                        return html`
                                                                                                            <div class="w-100 "
                                                                                                                 style="">
                                                                                                                <div class="d-flex align-items-center justify-content-around w-100 p-2">
                                                                                                                    ${[
                                                                                                                        {
                                                                                                                            title: '模塊資訊',
                                                                                                                            value: 'info',
                                                                                                                            icon: 'fa-solid fa-info'
                                                                                                                        },
                                                                                                                        {
                                                                                                                            title: '加載設定',
                                                                                                                            value: 'loading',
                                                                                                                            icon: 'fa-regular fa-loader'
                                                                                                                        },
                                                                                                                        {
                                                                                                                            title: '生命週期',
                                                                                                                            value: 'lifecycle',
                                                                                                                            icon: 'fa-regular fa-wave-pulse'
                                                                                                                        }
                                                                                                                        // {
                                                                                                                        //     title: '檔案上傳',
                                                                                                                        //     value: 'file',
                                                                                                                        //     icon: 'fa-solid fa-upload'
                                                                                                                        // },
                                                                                                                    ].map((dd) => {
                                                                                                                        return html`
                                                                                                                            <div class=" d-flex align-items-center justify-content-center ${(dd.value === vm.select) ? `border` : ``} rounded-3"
                                                                                                                                 style="height:36px;width:36px;cursor:pointer;
${(dd.value === vm.select) ? `background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);background:-webkit-linear-gradient(135deg, #667eea 0%, #764ba2 100%);color:white;` : `color:#151515;`}
"
                                                                                                                                 onclick="${gvc.event(() => {
                                                                                                                                     vm.select = dd.value as any;
                                                                                                                                     gvc.notifyDataChange([id, selectID])
                                                                                                                                 })}"
                                                                                                                                 data-bs-toggle="tooltip"
                                                                                                                                 data-bs-placement="top"
                                                                                                                                 data-bs-custom-class="custom-tooltip"
                                                                                                                                 data-bs-title="${dd.title}">
                                                                                                                                <i class="${dd.icon}"
                                                                                                                                   aria-hidden="true"></i>
                                                                                                                            </div>`
                                                                                                                    }).join(``)}
                                                                                                                </div>
                                                                                                            </div>`
                                                                                                    },
                                                                                                    divCreate: {
                                                                                                        class: `d-flex bg-white mx-n3 border-bottom`,
                                                                                                    },
                                                                                                    onCreate: () => {
                                                                                                        $('.tooltip')!.remove();
                                                                                                        ($('[data-bs-toggle="tooltip"]') as any).tooltip();
                                                                                                    }
                                                                                                }
                                                                                            }),
                                                                                            gvc.bindView(() => {
                                                                                                return {
                                                                                                    bind: id,
                                                                                                    view: () => {
                                                                                                        switch (vm.select) {
                                                                                                            case "info":
                                                                                                                return html`
                                                                                                                    <div class="alert-warning alert mt-0  p-2 mb-0"
                                                                                                                         style="border-bottom-right-radius:8px;border-bottom-left-radius:8px;border:none;max-width: 350px;white-space: normal;">
                                                                                                                        <h3 class="text-dark  m-1"
                                                                                                                            style="font-size: 16px;">
                                                                                                                            模塊路徑</h3>
                                                                                                                        <h3 class="text-primary  alert-primary m-1 fw-500 rounded p-2"
                                                                                                                            style="font-size: 14px;color:black;">
                                                                                                                            ${HtmlGenerate.reDefineJsResource(dd.js)}</h3>
                                                                                                                        <h3 class="text-dark  m-1 mt-2"
                                                                                                                            style="font-size: 16px;">
                                                                                                                            函式路徑</h3>
                                                                                                                        <h3 class="text-primary  alert-primary m-1 fw-500 rounded p-2"
                                                                                                                            style="font-size: 14px;">
                                                                                                                            ${dd.type}</h3>
                                                                                                                    </div>`
                                                                                                            case 'loading':
                                                                                                                return html`
                                                                                                                    <div class="px-2">
                                                                                                                        ${(() => {
                                                                                                                            const array: any = []
                                                                                                                            if (dd.data.elem !== 'style' && dd.data.elem !== 'script') {
                                                                                                                                array.push(
                                                                                                                                        EditorElem.select({
                                                                                                                                            title: '生成方式',
                                                                                                                                            gvc: gvc,
                                                                                                                                            def: dd.gCount ?? 'single',
                                                                                                                                            array: [{
                                                                                                                                                title: '靜態',
                                                                                                                                                value: 'single'
                                                                                                                                            }, {
                                                                                                                                                title: '程式碼',
                                                                                                                                                value: 'multiple'
                                                                                                                                            }],
                                                                                                                                            callback: (text) => {
                                                                                                                                                dd.gCount = text
                                                                                                                                                gvc.notifyDataChange(id)
                                                                                                                                            }
                                                                                                                                        })
                                                                                                                                )
                                                                                                                            }

                                                                                                                            if (dd.gCount === 'multiple') {
                                                                                                                                dd.arrayData = dd.arrayData ?? {}
                                                                                                                                array.push(
                                                                                                                                        TriggerEvent.editer(gvc, dd, dd.arrayData, {
                                                                                                                                            hover: false,
                                                                                                                                            option: [],
                                                                                                                                            title: "設定資料來源"
                                                                                                                                        })
                                                                                                                                )
                                                                                                                            } else {
                                                                                                                                dd.arrayData = undefined
                                                                                                                            }
                                                                                                                            return array.join(`<div class="my-2"></div>`)
                                                                                                                        })()}
                                                                                                                        ${gvc.bindView(() => {
                                                                                                                            const uid = gvc.glitter.getUUID();
                                                                                                                            return {
                                                                                                                                bind: uid,
                                                                                                                                view: () => {
                                                                                                                                    dd.preloadEvenet = dd.preloadEvenet ?? {};
                                                                                                                                    dd.hiddenEvent = dd.hiddenEvent ?? {}
                                                                                                                                    let view: any = [TriggerEvent.editer(gvc, dd, dd.preloadEvenet, {
                                                                                                                                        title: "模塊預載事件",
                                                                                                                                        option: [],
                                                                                                                                        hover: false
                                                                                                                                    }),
                                                                                                                                        TriggerEvent.editer(gvc, dd, dd.hiddenEvent, {
                                                                                                                                            title: "模塊隱藏事件",
                                                                                                                                            option: [],
                                                                                                                                            hover: false
                                                                                                                                        })]
                                                                                                                                    if ((dd.type !== 'widget') && (dd.type !== 'container')) {
                                                                                                                                        view.push(gvc.glitter.htmlGenerate.styleEditor(dd, gvc, dd, {}).editor(
                                                                                                                                                gvc,
                                                                                                                                                () => {
                                                                                                                                                    gvc.notifyDataChange('showView')
                                                                                                                                                },
                                                                                                                                                '模塊容器樣式'
                                                                                                                                        ))
                                                                                                                                    }
                                                                                                                                    return view.join(`<div class="my-2"></div>`)
                                                                                                                                },
                                                                                                                                divCreate: {
                                                                                                                                    class: 'mt-2 mb-2 '
                                                                                                                                },
                                                                                                                            };
                                                                                                                        })}
                                                                                                                    </div>`
                                                                                                            case "lifecycle":
                                                                                                                if (dd.data && dd.data.onCreateEvent) {
                                                                                                                    dd.onCreateEvent = dd.data.onCreateEvent;
                                                                                                                    dd.data.onCreateEvent = undefined;
                                                                                                                }
                                                                                                                dd.onInitialEvent = dd.onInitialEvent ?? {};
                                                                                                                dd.onCreateEvent = dd.onCreateEvent ?? {};
                                                                                                                dd.onResumtEvent = dd.onResumtEvent ?? {};
                                                                                                                dd.onDestoryEvent = dd.onDestoryEvent ?? {};
                                                                                                                return `<div class="p-2 pt-1">${[
                                                                                                                    html`
                                                                                                                        <div class="alert alert-warning  p-2   m-n2 border-bottom fw-500"
                                                                                                                             style="border-radius: 0px;color:black !important;">
                                                                                                                            <strong>onInitial事件:</strong><br>模塊初次加載所執行事件。<br>
                                                                                                                            <strong>onCreate事件:</strong><br>模塊被建立時所執行事件。<br>
                                                                                                                            <strong>onResume事件:</strong><br>模塊重新渲染至畫面時所執行事件。<br>
                                                                                                                            <strong>onDestroy事件:</strong><br>模塊被銷毀所執行的事件。<br>
                                                                                                                        </div>`,
                                                                                                                    `<div class="my-4"></div>`,
                                                                                                                    TriggerEvent.editer(gvc, dd, dd.onInitialEvent, {
                                                                                                                        title: "onInitial事件",
                                                                                                                        option: [],
                                                                                                                        hover: false
                                                                                                                    }),
                                                                                                                    TriggerEvent.editer(gvc, dd, dd.onCreateEvent, {
                                                                                                                        title: "onCreate事件",
                                                                                                                        option: [],
                                                                                                                        hover: false
                                                                                                                    }),
                                                                                                                    TriggerEvent.editer(gvc, dd, dd.onResumtEvent, {
                                                                                                                        title: "onResume事件",
                                                                                                                        option: [],
                                                                                                                        hover: false
                                                                                                                    }),
                                                                                                                    TriggerEvent.editer(gvc, dd, dd.onDestoryEvent, {
                                                                                                                        title: "onDestroy事件",
                                                                                                                        option: [],
                                                                                                                        hover: false
                                                                                                                    })
                                                                                                                ].join(`<div class="my-2"></div>`)}</div>`
                                                                                                            default:
                                                                                                                return ``
                                                                                                        }

                                                                                                    },
                                                                                                }
                                                                                            })
                                                                                        ].join('')
                                                                                    })(),
                                                                                    width: 350
                                                                                })
                                                                            })}">
<i class="fa-regular fa-gear" style="font-size:16px"></i>進階</button>
`
                                                                        }

                                                                    },
                                                                    divCreate: {
                                                                        class: `d-flex align-items-center mx-n2 mt-n2 p-3 py-2 shadow border-bottom`,
                                                                        style: `background: #f6f6f6;height:48px;`
                                                                    }
                                                                }
                                                            }),
                                                            gvc.bindView(() => {
                                                                let loading = true
                                                                let data: string | Promise<string> = ''

                                                                function getData() {
                                                                    if (dd.type === 'code') {
                                                                        data = codeComponent.render(gvc, dd, setting as any, HtmlGenerate.hover_items, subData, {
                                                                            widgetComponentID: gvc.glitter.getUUID()
                                                                        })
                                                                            .editor()
                                                                        loading = false
                                                                        gvc.notifyDataChange(component)
                                                                    } else if ((dd.type === 'widget') || (dd.type === 'container')) {
                                                                        data = widgetComponent.render(gvc, dd, setting as any, HtmlGenerate.hover_items, subData, {
                                                                            widgetComponentID: gvc.glitter.getUUID(),
                                                                            root: root
                                                                        })
                                                                            .editor()
                                                                        loading = false
                                                                        gvc.notifyDataChange(component)
                                                                    } else {
                                                                        loading = true
                                                                        gvc.glitter.htmlGenerate.loadScript(gvc.glitter, [{
                                                                            src: gvc.glitter.htmlGenerate.resourceHook(dd.js),
                                                                            callback: (data2: any) => {
                                                                                if (data2[dd.type].render.version === 'v2') {
                                                                                    data = data2[dd.type].render({
                                                                                        gvc: gvc,
                                                                                        widget: dd,
                                                                                        widgetList: setting,
                                                                                        hoverID: HtmlGenerate.hover_items,
                                                                                        subData: subData,
                                                                                        formData: dd.formData
                                                                                    })
                                                                                        .editor()
                                                                                } else {
                                                                                    data = data2[dd.type].render(gvc, dd, setting, HtmlGenerate.hover_items, subData)
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

                                                                                                        return ``
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
                                                            })
                                                        ].join(''))
                                                    }
                                                })
                                            }
                                        }
                                    });
                                })()}</div>`;
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
                        }).join('')
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

    public static selectWidget(cf: {
        dd: any,
        gvc: GVC,
        widgetComponentID: string,
        event: any,
        root: boolean
    }) {
        const dd = cf.dd;
        const gvc = cf.gvc;
        const widgetComponentID = cf.widgetComponentID;
        const event = cf.event;

        function active() {
            try {
                gvc.glitter.$('.editorItemActive').removeClass('editorItemActive');
                gvc.glitter.$(`.editor_it_${widgetComponentID}`).addClass('editorItemActive');
                (window.parent as any).glitter.share.editorViewModel.selectItem = dd;
                Storage.lastSelect = dd.id;
                (window.parent as any).glitter.share.selectEditorItem();
                event && event.stopPropagation && event.stopPropagation();
            } catch (e) {
                console.log(e)
            }
        }

        active()

    }

    public static getEditorSelectSection(cf: {
        id: string,
        gvc: GVC,
        label: string
    }) {
        if (cf.gvc.glitter.getUrlParameter("type") !== 'htmlEditor') {
            return ``
        }
        return cf.gvc.bindView(() => {
            const id = cf.gvc.glitter.getUUID()
            return {
                bind: id,
                view: () => {
                    return html`
                        <div class="position-absolute align-items-center justify-content-center px-3 fw-500 fs-6 badge_it"
                             style="height:22px;left:-2px;top:-22px;background: linear-gradient(143deg, #FFB400 -22.7%, #FF6C02 114.57%);color:white;white-space: nowrap;">
                            ${cf.label}
                        </div>
                        <div class="position-absolute fs-1 plus_btn"
                             style="left:50%;transform: translateX(-50%);height:28px;width:28px;top:-40px;z-index:99999;cursor: pointer;pointer-events:all;"
                             onmousedown="${cf.gvc.event(() => {         
                                 (window.parent as any).glitter.getModule(new URL('../.././editor/add-component.js', import.meta.url).href, (AddComponent:any) => {
                                     AddComponent.toggle(true);
                                     AddComponent.addEvent=(gvc:GVC,tdata:any)=>{
                                         (window.parent as any).glitter.share.addWithIndex({
                                             data: {
                                                 "id": gvc.glitter.getUUID(),
                                                 "js": "./official_view_component/official.js",
                                                 "css": {
                                                     "class": {},
                                                     "style": {}
                                                 },
                                                 "data": {
                                                     'refer_app':tdata.copyApp,
                                                     "tag": tdata.copy,
                                                     "list": [],
                                                     "carryData": {}
                                                 },
                                                 "type": "component",
                                                 "class": "",
                                                 "index": 0,
                                                 "label": tdata.title,
                                                 "style": "",
                                                 "bundle": {},
                                                 "global": [],
                                                 "toggle": false,
                                                 "stylist": [],
                                                 "dataType": "static",
                                                 "style_from": "code",
                                                 "classDataType": "static",
                                                 "preloadEvenet": {},
                                                 "share": {}
                                             },
                                             index: cf.id,
                                             direction: -1
                                         })
                                     }
                                 })
                             })}">
                            <img src="https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1714376322616-Frame 3137.svg"
                                 class="w-100 h-100">
                        </div>
                        <div class="position-absolute fs-1 plus_btn"
                             style="left:50%;transform: translateX(-50%);height:28px;width:28px;bottom:10px;z-index:99999;cursor: pointer;pointer-events:all;"
                             onclick="${cf.gvc.event(() => {
                                 (window.parent as any).glitter.getModule(new URL('../.././editor/add-component.js', import.meta.url).href, (AddComponent:any) => {
                                     AddComponent.toggle(true);
                                     AddComponent.addEvent=(gvc:GVC,tdata:any)=>{
                                         (window.parent as any).glitter.share.addWithIndex({
                                             data: {
                                                 "id": gvc.glitter.getUUID(),
                                                 "js": "./official_view_component/official.js",
                                                 "css": {
                                                     "class": {},
                                                     "style": {}
                                                 },
                                                 "data": {
                                                     'refer_app':tdata.copyApp,
                                                     "tag": tdata.copy,
                                                     "list": [],
                                                     "carryData": {}
                                                 },
                                                 "type": "component",
                                                 "class": "",
                                                 "index": 0,
                                                 "label": tdata.title,
                                                 "style": "",
                                                 "bundle": {},
                                                 "global": [],
                                                 "toggle": false,
                                                 "stylist": [],
                                                 "dataType": "static",
                                                 "style_from": "code",
                                                 "classDataType": "static",
                                                 "preloadEvenet": {},
                                                 "share": {}
                                             },
                                             index: cf.id,
                                             direction: 1
                                         })
                                     }
                                 })
                             })}">
                            <img src="https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1714376322616-Frame 3137.svg"
                                 class="w-100 h-100">
                        </div>`
                },
                divCreate: {
                    class: `editorChild editor_it_${cf.id} ${(cf.gvc.glitter.htmlGenerate.hover_items.indexOf(cf.id) !== -1) ? `editorItemActive` : ``}`,
                    style: `z-index: 99999;top:0px;left:0px;`
                },
                onCreate: () => {

                    // if((cf.gvc.glitter.htmlGenerate.hover_items.indexOf(cf.id) !== -1)){
                    //     setTimeout(()=>{
                    //         (cf.gvc.glitter).$('.editorItemActive').width( (cf.gvc.glitter).$('.editorItemActive').parent().width() as any);
                    //         (cf.gvc.glitter).$('.editorItemActive').height( (cf.gvc.glitter).$('.editorItemActive').parent().height() as any);
                    //     },10)
                    // }

                }
            }
        })
    }
}

function isEditMode() {
    try {
        return (window.parent as any).editerData !== undefined
    } catch (e) {
        return false
    }

}

function scrollToHover(element: any) {
    function scrollToItem(element: any) {
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth', // 使用平滑滾動效果
                block: 'center', // 將元素置中
            })
        }
    }

    setTimeout(() => {
        scrollToItem(element)
    }, 500)


}