import { GVC } from '../GVController.js';
import { Glitter } from '../Glitter.js';
//@ts-ignore
import autosize from '../plugins/autosize.js';
import { widgetComponent } from '../html-component/widget.js';
import { codeComponent } from '../html-component/code.js';
import { TriggerEvent } from '../plugins/trigger-event.js';
import { EditorElem } from '../plugins/editor-elem.js';
import { Storage } from '../helper/storage.js';
import { GlobalEvent } from '../api/global-event.js';
import { NormalPageEditor } from '../../editor/normal-page-editor.js';
import { StyleEditor } from '../plugins/style-editor.js';
import * as module from 'module';
import { component } from '../../official_view_component/official/component.js';
import { ShareDialog } from '../dialog/ShareDialog.js';

export interface HtmlJson {
    route: string;
    tag?: string;
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
    arrayData: any;
    editorEvent: any;
    pageConfig: any;
    appConfig: any;
    global: any;
    share: any;
    bundle: any;
    event: any;
}

const html = String.raw;

export class HtmlGenerate {
    public static share: any = {};

    public static isEditMode = isEditMode;

    public static resourceHook: (src: string) => string = (src) => {
        if (Storage.develop_mode === 'true') {
            (window as any).saasConfig.appConfig.initialList.map((dd: any) => {
                src = src.replace(`$${dd.tag}`, dd.staging);
            });
        } else {
            (window as any).saasConfig.appConfig.initialList.map((dd: any) => {
                src = src.replace(`$${dd.tag}`, dd.official);
            });
        }
        return src;
    };

    public static configureCDN(src: string) {
        return src;
        // return src.replace(`https://liondesign-prd.s3.amazonaws.com`,`https://d3jnmi1tfjgtti.cloudfront.net`);
    }

    public render: (
        gvc: GVC,
        option?: {
            class: string;
            style: string;
            jsFinish?: () => void;
            containerID?: string;
            onCreate?: () => void;
            onInitial?: () => void;
            onDestroy?: () => void;
            tag?: string;
            attribute?: { key: string; value: string }[];
            childContainer?: boolean;
            page_config?: any;
            app_config?: any;
            document?: any;
            is_page?: boolean;
            editorSection?: string;
        },
        createOption?: any
    ) => string;
    public exportJson: (setting: HtmlJson[]) => any;
    public editor: (gvc: GVC, option?: { return_: boolean; refreshAll: () => void; setting?: any[]; deleteEvent?: () => void; hideInfo?: boolean }) => string;
    public static saveEvent = (boolean?: boolean, callback?: () => void) => {
        alert('save');
    };

    public static getResourceLink(url: string) {
        const glitter = (window as any).glitter;
        url = glitter.htmlGenerate.resourceHook(url);
        if (!url.startsWith('http') && !url.startsWith('https')) {
            url = new URL(`./${url}`, new URL('../../', import.meta.url).href).href;
        }
        return url;
    }

    public static loadScript = (glitter: Glitter, js: { src: string; callback?: (widget: any) => void }[], where: string = 'htmlExtension') => {
        glitter.share[where] = glitter.share[where] ?? {};
        js.map((dd) => {
            dd.src = HtmlGenerate.reDefineJsResource(dd.src);
            let key = glitter.htmlGenerate.resourceHook(dd.src);
            if (!key.includes('http')) {
                key = new URL(key, new URL('../../', import.meta.url).href).href;
            }

            function checkStore() {
                const result = glitter.share[where][key];
                if (result) {
                    dd.callback && dd.callback(glitter.share[where][key]);
                }
                return result;
            }

            if (!checkStore()) {
                glitter.share.htmlExtensionResourceCallback = glitter.share.htmlExtensionResourceCallback ?? {};
                glitter.share.htmlExtensionResourceCallback[key] = glitter.share.htmlExtensionResourceCallback[key] ?? [];
                glitter.share.htmlExtensionResourceCallback[key].push(dd.callback);
                if (!glitter.share[where][`_init_${key}`]) {
                    glitter.share[where][`_init_${key}`] = true;
                    Object.defineProperty(glitter.share[where], key, {
                        // getter 函数返回属性的值
                        get() {
                            return glitter.share[where][`_${key}`];
                        },
                        // setter 函数设置属性的值，并触发监听事件
                        set(newValue) {
                            glitter.share[where][`_${key}`] = newValue;
                            glitter.share.htmlExtensionResourceCallback[key].map((callback: any) => {
                                callback && callback(newValue);
                            });
                            glitter.share.htmlExtensionResourceCallback[key] = [];
                        },
                        // 可选：指定属性是否可枚举
                        enumerable: true,
                        // 可选：指定属性是否可配置
                        configurable: true,
                    });
                }
            }
        });
        glitter.addMtScript(
            js.map((dd) => {
                let key = glitter.htmlGenerate.configureCDN(glitter.htmlGenerate.resourceHook(dd.src));
                if (!key.includes('http')) {
                    key = new URL(key, new URL('../../', import.meta.url).href).href;
                }
                return {
                    type: 'module',
                    src: key,
                };
            }),
            () => {},
            () => {},
            [{ key: 'async', value: 'true' }]
        );
    };

    public static reDefineJsResource(js: string) {
        if (js.includes('official_view_component/official.js')) {
            return new URL('official_view_component/official.js', new URL('../../', import.meta.url).href).href;
        }
        return js;
    }

    public static checkEventStore(glitter: Glitter, src: string) {
        glitter.share.componentData = glitter.share.componentData ?? {};
        let key = glitter.htmlGenerate.resourceHook(src);
        return glitter.share.componentData[key];
    }

    public static checkJsEventStore(glitter: Glitter, src: string, where: string) {
        let key = glitter.htmlGenerate.resourceHook(src);
        glitter.share[where] = glitter.share[where] ?? {};
        return glitter.share[where][key];
    }

    public static loadEvent = (glitter: Glitter, js: { src: string; callback?: (widget: any) => void }[]) => {
        glitter.share.componentData = glitter.share.componentData ?? {};
        let addJsList: any = [];
        js.map((dd) => {
            let key = glitter.htmlGenerate.resourceHook(dd.src);
            if (!key.includes('http')) {
                key = new URL(key, new URL('../../', import.meta.url).href).href;
            }

            function checkStore() {
                const result = glitter.share.componentData[key];
                if (result) {
                    dd.callback && dd.callback(glitter.share.componentData[key]);
                }
                return result;
            }

            if (!checkStore()) {
                glitter.share.componentDataResourceCallback = glitter.share.componentDataResourceCallback ?? {};
                glitter.share.componentDataResourceCallback[key] = glitter.share.componentDataResourceCallback[key] ?? [];
                glitter.share.componentDataResourceCallback[key].push(dd.callback);
                if (!glitter.share.componentData[`_init_${key}`]) {
                    glitter.share.componentData[`_init_${key}`] = true;
                    Object.defineProperty(glitter.share.componentData, key, {
                        // getter 函数返回属性的值
                        get() {
                            return glitter.share.componentData[`_${key}`];
                        },
                        // setter 函数设置属性的值，并触发监听事件
                        set(newValue) {
                            glitter.share.componentData[`_${key}`] = newValue;
                            glitter.share.componentDataResourceCallback[key].map((callback: any) => {
                                callback && callback(newValue);
                            });
                            glitter.share.componentDataResourceCallback[key] = [];
                        },
                        // 可选：指定属性是否可枚举
                        enumerable: true,
                        // 可选：指定属性是否可配置
                        configurable: true,
                    });
                }
                addJsList.push(dd);
            }
        });
        glitter.addMtScript(
            addJsList.map((dd: any) => {
                let key = glitter.htmlGenerate.configureCDN(glitter.htmlGenerate.resourceHook(dd.src));
                if (!key.includes('http')) {
                    key = new URL(key, new URL('../../', import.meta.url).href).href;
                }
                return {
                    type: 'module',
                    src: key,
                };
            }),
            () => {},
            () => {},
            [{ key: 'async', value: 'true' }]
        );
    };
    public static getKey = (js: string) => {
        let key = (window as any).glitter.htmlGenerate.resourceHook(js);
        if (!key.includes('http')) {
            key = new URL(key, location.href).href;
        }
        return key;
    };
    public static renameWidgetID = (dd: any) => {
        dd.id = (window as any).glitter.getUUID();
        if (dd.type === 'container') {
            dd.data.setting.map((d2: any) => {
                HtmlGenerate.renameWidgetID(d2);
            });
        }
        return dd;
    };

    public static scrollToCenter(gvc: GVC, elementId: string) {
        // 找到要滚动到的元素
        var element = gvc.getBindViewElem(elementId);
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
            gvc.glitter.$('html').get(0).scrollTo({
                top: scrollTo,
                left: 0,
                behavior: 'instant', // 使用平滑滚动效果，如果需要的话
            });
        }
    }

    public static styleEditor(data: any, gvc?: GVC, widget?: HtmlJson, subData?: any) {
        const glitter = (gvc ?? (window as any)).glitter;

        function getStyleData() {
            const response = (() => {
                const globalStyle = glitter.share.globalStyle;
                if (data.style_from === 'tag') {
                    if (globalStyle[data.tag]) {
                        return globalStyle[data.tag];
                    } else {
                        return data;
                    }
                } else {
                    return data;
                }
            })();
            response.list = response.list ?? [];
            response.version = 'v2';
            return response;
        }
        function getCheckSum(message: string) {
            return window.CryptoJS.SHA256(message).toString(CryptoJS.enc.Hex);
        }

        function getStyleString() {
            function styleString(data: any) {
                let styles = '';

                function getStyle(data: any) {
                    let style = '';
                    if (data.dataType === 'static') {
                        return data.style;
                    } else {
                        try {
                            if (data.dataType === 'code') {
                                style = eval(`(() => {
                                    ${data.style}
                                })()`);
                            } else if (data.dataType === 'triggerEvent') {
                                return glitter.promiseValue(
                                    new Promise(async (resolve, reject) => {
                                        resolve(
                                            await TriggerEvent.trigger({
                                                gvc: gvc!,
                                                widget: widget as any,
                                                clickEvent: data.triggerStyle,
                                                subData: subData,
                                            })
                                        );
                                    })
                                );
                            } else {
                                style = eval(data.style);
                            }
                        } catch (e) {
                            style = data.style;
                        }
                        return style;
                    }
                }

                const tempMap: any = {};
                (data.stylist ?? []).map((dd: any) => {
                    tempMap[dd.size] = () => {
                        return getStyle(dd);
                    };
                });
                styles = glitter.ut.frSize(tempMap, () => {
                    return getStyle(data);
                })();
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
                    let have = false;
                    while ((match = pattern.exec(styleStringJoin)) !== null) {
                        const placeholder = match[0]; // 完整的匹配项，例如 "@{{value}}"
                        const value = match[1]; // 提取的值，例如 "value"
                        if (glitter.share.globalValue && glitter.share.globalValue[value]) {
                            styleStringJoin = styleStringJoin.replace(placeholder, glitter.share.globalValue[value]);
                            have = true;
                        }
                    }
                    if (have) {
                        replaceString(pattern);
                    }
                }

                replaceString(/\/\**@{{(.*?)}}\*\//g);
                replaceString(/@{{(.*?)}}/g);
                return styleStringJoin;
            }

            const style_string =
                (data.basic_style || '') +
                [getStyleData()]
                    .concat(getStyleData().list ?? [])
                    .map((dd) => {
                        const data = styleString(dd);
                        return data && ` ${data}`;
                    })
                    .join('');
            // glitter.share.style_class = glitter.share.style_class ?? {}
            // const class_string=getCheckSum(style_string)
            // if(!glitter.share.style_class[class_string]){
            //     glitter.share.style_class[class_string]=true
            //     glitter.share.style_class_string=glitter.share.style_class_string ?? ''
            //     glitter.share.style_class_string+=`.${class_string}{
            //     ${style_string}
            //     }\n\n`
            //     clearInterval(glitter.share.style_interval)
            //     glitter.share.style_interval=setTimeout(()=>{
            //         gvc!.addStyle(glitter.share.style_class_string)
            //         glitter.share.style_class_string=''
            //     },100)
            //
            // }
            return style_string;
        }

        return {
            editor: (gvc: GVC, widget: HtmlJson | (() => void), title?: string, option?: any) => {
                const glitter = (window as any).glitter;
                return `
<div type="button" class="btn  w-100 " style="background:white;width:calc(100%);border-radius:8px;
                    min-height:45px;border:1px solid black;color:#151515;" onclick="${gvc.event(() => {
                        NormalPageEditor.closeEvent = () => {
                            if (typeof widget === 'function') {
                                widget();
                            } else {
                                (widget as any).refreshComponent();
                            }
                        };
                        NormalPageEditor.toggle({
                            visible: true,
                            title: title || '設計樣式編輯',
                            view: StyleEditor.main(gvc, {
                                callback: () => {
                                    if (typeof widget === 'function') {
                                        widget();
                                    } else {
                                        (widget as any).refreshComponent();
                                    }
                                },
                                data: data,
                                option: option,
                            }),
                        });
                    })}">${title ?? '設計樣式'}</div><br>`;
            },
            class: () => {
                const glitter = (window as any).glitter;

                function classString(data: any) {
                    function getClass(data: any) {
                        let classs = '';
                        if (data.classDataType === 'static') {
                            return data.class;
                        } else if (data.classDataType === 'triggerEvent') {
                            return glitter.promiseValue(
                                new Promise(async (resolve, reject) => {
                                    resolve(
                                        await TriggerEvent.trigger({
                                            gvc: gvc!,
                                            widget: widget as any,
                                            clickEvent: data.trigger,
                                            subData: subData,
                                        })
                                    );
                                })
                            );
                        } else {
                            try {
                                if (data.classDataType === 'code') {
                                    classs = eval(`(() => {
                                        ${data.class}
                                    })()`);
                                } else {
                                    classs = eval(data.class);
                                }
                            } catch (e) {
                                classs = data.class;
                            }
                            return classs;
                        }
                    }

                    const tempMap: any = {};
                    (data.stylist ?? []).map((dd: any) => {
                        tempMap[dd.size] = () => {
                            return getClass(dd);
                        };
                    });

                    return glitter.ut.frSize(tempMap, () => {
                        return getClass(data);
                    })();
                }

                return [getStyleData()]
                    .concat(getStyleData().list ?? [])
                    .map((dd) => {
                        const data = classString(dd);
                        return data && ` ${data}`;
                    })
                    .join('');
            },
            style: () => {
                // return ``
                return getStyleString();
            },
        };
    }

    public static editor_component(
        data: any,
        gvc?: GVC,
        widget?: HtmlJson,
        subData?: any
    ): {
        [name: string]: any;
        editor: (gvc: GVC, widget: HtmlJson | (() => void), title?: string, option?: any) => string;
        class: () => string;
        style: () => string;
    } {
        const glitter = (gvc ?? (window as any)).glitter;
        const response = glitter.htmlGenerate.styleEditor(data, gvc, widget, subData);
        Object.keys(data).map((dd: string) => {
            if (['styleList', 'class', 'style'].indexOf(dd) === -1) {
                Object.defineProperty(response, dd, {
                    get: function () {
                        return data[dd];
                    },
                    set(v) {
                        data[dd] = v;
                    },
                });
            }
        });
        return response;
    }

    public static setHome = (obj: { page_config?: any; app_config?: any; config: any; editMode?: any; data: any; tag: string; option?: any }) => {
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
    public static changePage = (obj: { page_config?: any; config: any; editMode?: any; data: any; tag: string; goBack: boolean; option?: any; app_config?: any }) => {
        const glitter = Glitter.glitter;
        console.log(`changePage-time:`, (window as any).renderClock.stop());
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

    public static editeInput(obj: { gvc: GVC; title: string; default: string; placeHolder: string; callback: (text: string) => void; type?: string }) {
        obj.title = obj.title ?? '';
        return `<h3 class="fw-500 mt-2 " style="font-size: 15px;margin-bottom: 10px;color:#151515;" >${obj.title}</h3>
<input class="form-control mb-2" type="${obj.type ?? 'text'}" placeholder="${obj.placeHolder}" onchange="${obj.gvc.event((e) => {
            obj.callback(e.value);
        })}" value="${obj.default ?? ''}">`;
    }

    public static editeText(obj: { gvc: GVC; title: string; default: string; placeHolder: string; callback: (text: string) => void }) {
        obj.title = obj.title ?? '';
        const id = obj.gvc.glitter.getUUID();
        return `<h3 style="font-size: 15px;margin-bottom: 10px;color:#151515;" class="mt-2 fw-500 d-flex align-items-center  ${!obj.title ? `d-none` : ``}">${obj.title}</h3>

${obj.gvc.bindView({
    bind: id,
    view: () => {
        return obj.default ?? '';
    },
    divCreate: {
        elem: `textArea`,
        style: `max-height:400px!important;min-height:170px;`,
        class: `form-control`,
        option: [
            { key: 'placeholder', value: obj.placeHolder },
            {
                key: 'onchange',
                value: obj.gvc.event((e) => {
                    obj.callback(e.value);
                }),
            },
        ],
    },
    onCreate: () => {
        //@ts-ignore
        autosize(obj.gvc.getBindViewElem(id));
    },
})}`;
    }

    public setting: HtmlJson[];

    public initialFunction = () => {};

    public static hover_items: string[] = [];

    constructor(container: HtmlJson[], hoverInitial: string[] = [], subData?: any, root?: boolean) {
        //如果是頁面的話，預載所有事件。
        if (root) {
            (window as any).glitter.htmlGenerate.preloadEvent(container);
        }
        const editContainer = (window as any).glitter.getUUID();
        this.setting = container;
        this.initialFunction = () => {
            HtmlGenerate.hover_items = [Storage.lastSelect];
            const formData = (container as any).formData;
            subData = subData ?? {};
            let share: any = {};
            HtmlGenerate.share.false = HtmlGenerate.share.false ?? {};
            container.map((dd) => {
                dd.css = dd.css ?? {};
                dd.css.style = dd.css.style ?? {};
                dd.css.class = dd.css.class ?? {};
                dd.refreshAllParameter = dd.refreshAllParameter ?? {
                    view1: () => {},
                    view2: () => {},
                };
                dd.refreshComponentParameter = dd.refreshComponentParameter ?? {
                    view1: () => {},
                    view2: () => {},
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
                        (window as any).glitter.deBugMessage(`${e.message}<br>${e.stack}<br>${e.line}`);
                    }
                };
                dd.formData = dd.formData ?? formData;
                dd.event = (key: string, subData: any) => {
                    return new Promise(async (resolve, reject) => {
                        GlobalEvent.getGlobalEvent({
                            tag: key,
                        }).then(async (d2) => {
                            try {
                                const event = d2.response.result[0];
                                const response = await TriggerEvent.trigger({
                                    gvc: (dd as any).global.gvc,
                                    widget: dd as any,
                                    clickEvent: event.json,
                                    subData: subData,
                                });
                                resolve(response);
                            } catch (e) {
                                resolve(false);
                            }
                        });
                    });
                };
                return dd;
            });

            function loop(array: any) {
                array.map((dd: any) => {
                    if (dd.type === 'container') {
                        loop(dd.data.setting ?? []);
                    }
                    if (!dd.storage) {
                        let storage: any = {};
                        Object.defineProperty(dd, 'storage', {
                            get: function () {
                                return storage;
                            },

                            set(v) {
                                storage = v;
                            },
                        });
                    }
                    if (!dd.share) {
                        Object.defineProperty(dd, 'share', {
                            get: function () {
                                return share;
                            },

                            set(v) {
                                share = v;
                            },
                        });
                    }
                    dd.globalColor = function (key: string, index: any) {
                        if (`${index}`.split('-')[0] === 'custom') {
                            return dd.formData[`${index}`.split('-')[1]][key];
                        } else {
                            return `@{{theme_color.${index}.${key}}}`;
                        }
                    };

                    if (!dd.bundle) {
                        try {
                            Object.defineProperty(dd, 'bundle', {
                                get: function () {
                                    return subData ?? {};
                                },

                                set(v) {
                                    subData = v;
                                },
                            });
                        } catch (e) {}
                    }
                });
            }

            loop(container);
        };
        this.initialFunction();

        this.render = (
            gvc: GVC,
            option: {
                class: string;
                style: string;
                jsFinish?: () => void;
                containerID?: string;
                onCreate?: () => void;
                onInitial?: () => void;
                onDestroy?: () => void;
                tag?: string;
                attribute?: { key: string; value: string }[];
                childContainer?: boolean;
                page_config?: any;
                app_config?: any;
                document?: any;
                is_page?: boolean;
                editorSection?: string;
            } = {
                class: ``,
                style: ``,
                containerID: gvc.glitter.getUUID(),
                jsFinish: () => {},
                onCreate: () => {},
            },
            createOption?: any
        ) => {
            const document = option.document ?? gvc.glitter.document;
            const child_container = option.childContainer;
            const renderStart = (window as any).renderClock.stop();
            option = option ?? {};
            const container_id = option.containerID ?? gvc.glitter.getUUID();
            if (isEditMode()) {
                (container as any).container_config = {
                    gvc: gvc,
                    option: option,
                    container: container,
                    container_id: container_id,
                    child_container: child_container,
                    root: root,
                    sub_data: subData,
                    getElement: () => {
                        return document.querySelector('.editor_it_' + container_id);
                    },
                };
            }
            return gvc.bindView(() => {
                return {
                    bind: container_id,
                    view: () => {
                        return new Promise(async (resolve, reject) => {
                            const view = [
                                await new Promise((resolve, reject) => {
                                    let waitAddScript: string[] = [];
                                    gvc.glitter.defaultSetting.pageLoading();

                                    function startRender() {
                                        const start = new Date().getTime();
                                        new Promise(async (resolve, reject) => {
                                            //先下載Container中所有Widget的JS資源檔案。
                                            function initialComponent(set: any[]) {
                                                let waitAdd: any = [];
                                                for (const a of set) {
                                                    if (['code'].indexOf(a.type) === -1) {
                                                        if (
                                                            a.type !== 'widget' &&
                                                            a.type !== 'container' &&
                                                            !gvc.glitter.share.htmlExtension[
                                                                gvc.glitter.htmlGenerate.configureCDN(gvc.glitter.htmlGenerate.configureCDN(gvc.glitter.htmlGenerate.resourceHook(a.js)))
                                                            ]
                                                        ) {
                                                            waitAdd.push({
                                                                src: `${gvc.glitter.htmlGenerate.configureCDN(gvc.glitter.htmlGenerate.resourceHook(a.js))}`,
                                                                type: 'module',
                                                            });
                                                        }
                                                        if (a.type === 'container') {
                                                            waitAdd = waitAdd.concat(initialComponent(a.data.setting));
                                                        }
                                                    }
                                                }
                                                return waitAdd;
                                            }

                                            gvc.glitter.htmlGenerate.loadScript(gvc.glitter, initialComponent(container));

                                            //在頁面被渲染之前，所需執行的代碼事件。
                                            async function initialScript() {
                                                //異步執行的事件
                                                for (const script of container.filter((dd) => {
                                                    return dd.type === 'code' && dd.data.triggerTime === 'async';
                                                })) {
                                                    codeComponent.render(gvc, script as any, container as any, [], subData).view();
                                                }
                                                //同步渲染前需執行
                                                for (const script of container.filter((dd) => {
                                                    return dd.type === 'code' && dd.data.triggerTime === 'first';
                                                })) {
                                                    await codeComponent.render(gvc, script as any, container as any, [], subData).view();
                                                }
                                            }

                                            await initialScript();
                                            if (option && option.is_page) {
                                                console.log(`initialScriptFinish-time:`, (window as any).renderClock.stop());
                                            }
                                            for (const b of container) {
                                                if ((b as any).preloadEvenet) {
                                                    await TriggerEvent.trigger({
                                                        gvc,
                                                        widget: b as any,
                                                        clickEvent: (b as any).preloadEvenet,
                                                    });
                                                }
                                                if ((b as any).hiddenEvent) {
                                                    const hidden = await TriggerEvent.trigger({
                                                        gvc,
                                                        widget: b as any,
                                                        clickEvent: (b as any).hiddenEvent,
                                                        subData: subData,
                                                    });
                                                    if (hidden) {
                                                        const formData = (container as any).formData;
                                                        container = container.filter((dd) => {
                                                            return dd !== b;
                                                        });
                                                        (container as any).formData = formData;
                                                    }
                                                }
                                            }
                                            if (isEditMode()) {
                                                //渲染Widget中的元件;
                                                if (container_id === 'MainView') {
                                                    (window.parent as any).glitter.share.editorViewModel.data.config.container_config = (container as any).container_config;
                                                }
                                            }
                                            if (option && option.is_page) {
                                                console.log(`start-loop-widget-time:`, (window as any).renderClock.stop());
                                            }

                                            resolve(
                                                container
                                                    .map((widget, index) => {
                                                        function loadWebResource() {
                                                            try {
                                                                if (
                                                                    widget.data.elem === 'link' &&
                                                                    widget.data.attr.find((dd: any) => {
                                                                        return dd.attr === 'rel' && dd.value === 'stylesheet';
                                                                    })
                                                                ) {
                                                                    setTimeout(() => {
                                                                        gvc.glitter.addStyleLink(
                                                                            widget.data.attr.find((dd: any) => {
                                                                                return dd.attr === 'href';
                                                                            }).value,
                                                                            document
                                                                        );
                                                                    });
                                                                    return true;
                                                                } else if (
                                                                    widget.data.elem === 'script' &&
                                                                    widget.data.attr.find((dd: any) => {
                                                                        return dd.attr === 'src';
                                                                    })
                                                                ) {
                                                                    waitAddScript.push(
                                                                        widget.data.attr.find((dd: any) => {
                                                                            return dd.attr === 'src';
                                                                        }).value
                                                                    );
                                                                    return true;
                                                                } else if (widget.data.elem === 'style') {
                                                                    gvc.addStyle(widget.data.inner);
                                                                    return true;
                                                                }
                                                            } catch (e) {
                                                                return false;
                                                            }
                                                        }

                                                        //判斷如果是資源檔案，直接返回空字串。
                                                        if (loadWebResource()) {
                                                            return ``;
                                                        }
                                                        if (widget.data.elem === 'header') {
                                                            console.log(`Header-renderWidgetSingle-time:`, (window as any).renderClock.stop());
                                                        }
                                                        return HtmlGenerate.renderWidgetSingle({
                                                            widget: widget,
                                                            gvc: gvc,
                                                            option: option,
                                                            container: container,
                                                            container_id: container_id,
                                                            child_container: child_container,
                                                            root: root,
                                                            sub_data: subData,
                                                        });
                                                    }).
                                                    concat((container as any).replace_elem)
                                                    .join('')
                                            );
                                        }).then((html) => {
                                            if (option && option.is_page) {
                                                console.log(`htmlResolve-time:`, (window as any).renderClock.stop());
                                            }
                                            resolve(html as string);
                                            //Need exe function when render finish.
                                            new Promise(async (resolve, reject) => {
                                                for (const script of container.filter((dd) => {
                                                    return dd.type === 'code' && dd.data.triggerTime === 'last';
                                                })) {
                                                    await codeComponent.render(gvc, script as any, container as any, [], subData).view();
                                                }
                                                for (const a of waitAddScript) {
                                                    // console.log(`loadScript:` + a)
                                                    await new Promise((resolve, reject) => {
                                                        gvc.glitter.addMtScript(
                                                            [
                                                                {
                                                                    src: a,
                                                                },
                                                            ],
                                                            () => {
                                                                setTimeout(() => {
                                                                    resolve(true);
                                                                }, 10);
                                                            },
                                                            () => {
                                                                resolve(false);
                                                            }
                                                        );
                                                        resolve(true);
                                                    });
                                                }
                                                resolve(true);
                                            }).then(() => {
                                                if (option && option.is_page) {
                                                    console.log(`renderFinish-time:`, (window as any).renderClock.stop());
                                                }
                                                gvc.glitter.defaultSetting.pageLoadingFinish();
                                                option.jsFinish && option.jsFinish();
                                            });
                                        });
                                    }

                                    startRender();
                                }),
                            ];
                            if (isEditMode() && option && option.editorSection) {
                                view.push(
                                    HtmlGenerate.getEditorSelectSection({
                                        id: option.editorSection,
                                        gvc: gvc,
                                        label: '容器',
                                    })
                                );
                            }
                            resolve(view.join(''));
                        });
                    },
                    divCreate: () => {
                        const elem_ = JSON.parse(
                            JSON.stringify(
                                (() => {
                                    if (createOption) {
                                        if (typeof createOption === 'function') {
                                            return createOption();
                                        } else {
                                            return createOption;
                                        }
                                    } else {
                                        return {
                                            class: option.class,
                                            style: option.style,
                                            option: [
                                                {
                                                    key: `gl_type`,
                                                    value: 'container',
                                                },
                                            ],
                                        };
                                    }
                                })()
                            )
                        );
                        if (isEditMode()) {
                            elem_.class = `${elem_.class} editor_it_${container_id} `;
                        }

                        return elem_;
                    },
                    onInitial: () => {
                        option.onInitial && option.onInitial();
                    },
                    onCreate: () => {
                        gvc.glitter.deBugMessage(`RenderFinishID:${option.containerID}`);
                        if (option && option.is_page) {
                            console.log(`onCreateFinish-time:`, (window as any).renderClock.stop());
                        }

                        gvc.glitter.deBugMessage(`RenderFinish-time:(start:${renderStart})-(end:${(window as any).renderClock.stop()})`);
                        option.onCreate && option.onCreate();
                    },
                    onDestroy: () => {
                        option.onDestroy && option.onDestroy();
                    },
                };
            });
        };

        this.editor = (
            gvc: GVC,
            option = {
                return_: false,
                refreshAll: () => {},
                setting: container,
                deleteEvent: () => {},
                hideInfo: false,
            }
        ) => {
            var loading = true;
            const oset = this.setting;

            function getData() {
                function initialComponent(set: any[]) {
                    let waitAdd: any = [];
                    for (const a of set) {
                        if (['code'].indexOf(a.type) === -1) {
                            if (
                                a.type !== 'widget' &&
                                a.type !== 'container' &&
                                !gvc.glitter.share.htmlExtension[gvc.glitter.htmlGenerate.configureCDN(gvc.glitter.htmlGenerate.configureCDN(gvc.glitter.htmlGenerate.resourceHook(a.js)))]
                            ) {
                                waitAdd.push({
                                    src: `${gvc.glitter.htmlGenerate.configureCDN(gvc.glitter.htmlGenerate.resourceHook(a.js))}`,
                                    type: 'module',
                                });
                            }
                            if (a.type === 'container') {
                                waitAdd = waitAdd.concat(initialComponent(a.data.setting));
                            }
                        }
                    }
                    return waitAdd;
                }

                gvc.glitter.htmlGenerate.loadScript(gvc.glitter, initialComponent(option.setting ?? container));
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
                        return (option.setting ?? container)
                            .map((dd, index) => {
                                try {
                                    const component = gvc.glitter.getUUID();
                                    dd.refreshAllParameter = dd.refreshAllParameter ?? {
                                        view1: () => {},
                                        view2: () => {},
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
                                        view1: () => {},
                                        view2: () => {},
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
                                    return `<div style=" ${option.return_ ? `padding: 10px;` : ``}" class="
${option.return_ ? `w-100 border rounded bg-dark mt-2` : ``} " >
${(() => {
    return gvc.bindView(() => {
        const id = gvc.glitter.getUUID();
        return {
            bind: id,
            view: () => {
                return new Promise(async (resolve, reject) => {
                    let haveUserMode = false;
                    let mode: 'user' | 'dev' = Storage.editor_mode;
                    if (dd.type !== 'code' && !(dd.type === 'widget' || dd.type === 'container')) {
                        haveUserMode = await new Promise(async (resolve, reject) => {
                            gvc.glitter.htmlGenerate.loadScript(gvc.glitter, [
                                {
                                    src: gvc.glitter.htmlGenerate.resourceHook(dd.js),
                                    callback: (data2: any) => {
                                        if (data2[dd.type].render.version === 'v2') {
                                            if (
                                                data2[dd.type].render({
                                                    gvc: gvc,
                                                    widget: dd,
                                                    widgetList: container,
                                                    hoverID: HtmlGenerate.hover_items,
                                                    subData: subData,
                                                    formData: dd.formData,
                                                }).user_editor
                                            ) {
                                                resolve(true);
                                            } else {
                                                resolve(false);
                                            }
                                        } else {
                                            if (
                                                data2[dd.type].render({
                                                    gvc: gvc,
                                                    widget: dd,
                                                    widgetList: container,
                                                    hoverID: HtmlGenerate.hover_items,
                                                    subData: subData,
                                                    formData: dd.formData,
                                                }).user_editor
                                            ) {
                                                resolve(true);
                                            } else {
                                                resolve(false);
                                            }
                                        }
                                    },
                                },
                            ]);
                        });
                    }
                    if (haveUserMode && mode === 'user') {
                        resolve(
                            [
                                gvc.bindView(() => {
                                    let loading = true;
                                    let data: string | Promise<string> = '';

                                    function getData() {
                                        loading = true;
                                        gvc.glitter.htmlGenerate.loadScript(gvc.glitter, [
                                            {
                                                src: gvc.glitter.htmlGenerate.resourceHook(dd.js),
                                                callback: (data2: any) => {
                                                    if (data2[dd.type].render.version === 'v2') {
                                                        data = data2[dd.type]
                                                            .render({
                                                                gvc: gvc,
                                                                widget: dd,
                                                                widgetList: container,
                                                                hoverID: HtmlGenerate.hover_items,
                                                                subData: subData,
                                                                formData: dd.formData,
                                                            })
                                                            .user_editor();
                                                    } else {
                                                        data = data2[dd.type].render(gvc, dd, container, HtmlGenerate.hover_items, subData).user_editor();
                                                    }
                                                    if (typeof data === 'string') {
                                                        loading = false;
                                                        gvc.notifyDataChange(component);
                                                    } else {
                                                        data2.then((dd: any) => {
                                                            data = dd;
                                                            loading = false;
                                                            gvc.notifyDataChange(component);
                                                        });
                                                    }
                                                },
                                            },
                                        ]);
                                    }

                                    dd.refreshComponentParameter!.view2 = () => {
                                        getData();
                                    };
                                    getData();
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
                                                            return ``;
                                                        } else {
                                                            return [data as string].join(`<div class="my-1"></div>`);
                                                        }
                                                    })(),
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
                                    };
                                }),
                            ].join('')
                        );
                    } else {
                        resolve(
                            [
                                Storage.select_function === 'user-editor'
                                    ? ``
                                    : gvc.bindView(() => {
                                          const vm: {
                                              id: string;
                                              type: 'edit' | 'preview';
                                          } = {
                                              id: gvc.glitter.getUUID(),
                                              type: 'preview',
                                          };

                                          return {
                                              bind: vm.id,
                                              view: () => {
                                                  if (vm.type === 'edit') {
                                                      return `<i class="fa-solid fa-check me-2" style="color:#295ed1;cursor:pointer;" onclick="${gvc.event(() => {
                                                          vm.type = 'preview';
                                                          gvc.notifyDataChange(vm.id);
                                                      })}"></i>
${EditorElem.editeInput({
    gvc: gvc,
    title: '',
    default: dd.label,
    placeHolder: '請輸入自定義模塊名稱',
    callback: (text) => {
        dd.label = text;
        gvc.notifyDataChange(['right_NAV', 'MainEditorLeft']);
    },
})}`;
                                                  } else {
                                                      return `<i class="fa-solid fa-pencil me-2" style="color:black;cursor:pointer;" onclick="${gvc.event(() => {
                                                          vm.type = 'edit';
                                                          gvc.notifyDataChange(vm.id);
                                                      })}"></i>
<span class="fw-bold" style="color:black;text-overflow: ellipsis;max-width:120px;overflow: hidden;">${dd.label}</span>
<div class="flex-fill"></div>
<button class="btn ms-2 btn-outline-secondary-c d-flex align-items-center justify-content-center p-0
${dd.data.elem === 'script' || dd.data.elem === 'style' || dd.data.elem === 'link' || dd.type === 'code' ? `d-none` : ``}
" style="height: 30px;width: 70px;gap:5px;"
onclick="${gvc.event(() => {
                                                          NormalPageEditor.toggle({
                                                              visible: true,
                                                              title: '進階設定',
                                                              view: (() => {
                                                                  const html = String.raw;
                                                                  const id = gvc.glitter.getUUID();
                                                                  let vm: {
                                                                      select: 'info' | 'loading' | 'lifecycle';
                                                                  } = {
                                                                      select: 'info',
                                                                  };
                                                                  return [
                                                                      gvc.bindView(() => {
                                                                          const selectID = gvc.glitter.getUUID();
                                                                          return {
                                                                              bind: selectID,
                                                                              view: () => {
                                                                                  return html` <div class="w-100 " style="">
                                                                                      <div class="d-flex align-items-center justify-content-around w-100 p-2">
                                                                                          ${[
                                                                                              {
                                                                                                  title: '模塊資訊',
                                                                                                  value: 'info',
                                                                                                  icon: 'fa-solid fa-info',
                                                                                              },
                                                                                              {
                                                                                                  title: '載入設定',
                                                                                                  value: 'loading',
                                                                                                  icon: 'fa-regular fa-loader',
                                                                                              },
                                                                                              {
                                                                                                  title: '生命週期',
                                                                                                  value: 'lifecycle',
                                                                                                  icon: 'fa-regular fa-wave-pulse',
                                                                                              },
                                                                                              // {
                                                                                              //     title: '檔案上傳',
                                                                                              //     value: 'file',
                                                                                              //     icon: 'fa-solid fa-upload'
                                                                                              // },
                                                                                          ]
                                                                                              .map((dd) => {
                                                                                                  return html` <div
                                                                                                      class=" d-flex align-items-center justify-content-center ${dd.value === vm.select
                                                                                                          ? `border`
                                                                                                          : ``} rounded-3"
                                                                                                      style="height:36px;width:36px;cursor:pointer;
${dd.value === vm.select ? `background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);background:-webkit-linear-gradient(135deg, #667eea 0%, #764ba2 100%);color:white;` : `color:#151515;`}
"
                                                                                                      onclick="${gvc.event(() => {
                                                                                                          vm.select = dd.value as any;
                                                                                                          gvc.notifyDataChange([id, selectID]);
                                                                                                      })}"
                                                                                                      data-bs-toggle="tooltip"
                                                                                                      data-bs-placement="top"
                                                                                                      data-bs-custom-class="custom-tooltip"
                                                                                                      data-bs-title="${dd.title}"
                                                                                                  >
                                                                                                      <i class="${dd.icon}" aria-hidden="true"></i>
                                                                                                  </div>`;
                                                                                              })
                                                                                              .join(``)}
                                                                                      </div>
                                                                                  </div>`;
                                                                              },
                                                                              divCreate: {
                                                                                  class: `d-flex bg-white mx-n3 border-bottom`,
                                                                              },
                                                                              onCreate: () => {
                                                                                  $('.tooltip')!.remove();
                                                                                  ($('[data-bs-toggle="tooltip"]') as any).tooltip();
                                                                              },
                                                                          };
                                                                      }),
                                                                      gvc.bindView(() => {
                                                                          return {
                                                                              bind: id,
                                                                              view: () => {
                                                                                  switch (vm.select) {
                                                                                      case 'info':
                                                                                          return html` <div
                                                                                              class="alert-warning alert mt-0  p-2 mb-0"
                                                                                              style="border-bottom-right-radius:8px;border-bottom-left-radius:8px;border:none;max-width: 350px;white-space: normal;"
                                                                                          >
                                                                                              <h3 class="text-dark  m-1" style="font-size: 16px;">模塊路徑</h3>
                                                                                              <h3 class="text-primary  alert-primary m-1 fw-500 rounded p-2" style="font-size: 14px;color:black;">
                                                                                                  ${HtmlGenerate.reDefineJsResource(dd.js)}
                                                                                              </h3>
                                                                                              <h3 class="text-dark  m-1 mt-2" style="font-size: 16px;">函式路徑</h3>
                                                                                              <h3 class="text-primary  alert-primary m-1 fw-500 rounded p-2" style="font-size: 14px;">${dd.type}</h3>
                                                                                          </div>`;
                                                                                      case 'loading':
                                                                                          return html` <div class="px-2">
                                                                                              ${(() => {
                                                                                                  const array: any = [];
                                                                                                  if (dd.data.elem !== 'style' && dd.data.elem !== 'script') {
                                                                                                      array.push(
                                                                                                          EditorElem.select({
                                                                                                              title: '開放刪除',
                                                                                                              gvc: gvc,
                                                                                                              def: dd.deletable ?? '',
                                                                                                              array: [
                                                                                                                  {
                                                                                                                      title: '是',
                                                                                                                      value: 'true',
                                                                                                                  },
                                                                                                                  {
                                                                                                                      title: '否',
                                                                                                                      value: 'false',
                                                                                                                  },
                                                                                                              ],
                                                                                                              callback: (text) => {
                                                                                                                  dd.deletable = text;
                                                                                                                  gvc.notifyDataChange(id);
                                                                                                              },
                                                                                                          })
                                                                                                      );
                                                                                                      array.push(
                                                                                                          EditorElem.select({
                                                                                                              title: '生成方式',
                                                                                                              gvc: gvc,
                                                                                                              def: dd.gCount ?? 'single',
                                                                                                              array: [
                                                                                                                  {
                                                                                                                      title: '靜態',
                                                                                                                      value: 'single',
                                                                                                                  },
                                                                                                                  {
                                                                                                                      title: '程式碼',
                                                                                                                      value: 'multiple',
                                                                                                                  },
                                                                                                              ],
                                                                                                              callback: (text) => {
                                                                                                                  dd.gCount = text;
                                                                                                                  gvc.notifyDataChange(id);
                                                                                                              },
                                                                                                          })
                                                                                                      );
                                                                                                  }

                                                                                                  if (dd.gCount === 'multiple') {
                                                                                                      dd.arrayData = dd.arrayData ?? {};
                                                                                                      array.push(
                                                                                                          TriggerEvent.editer(gvc, dd, dd.arrayData, {
                                                                                                              hover: false,
                                                                                                              option: [],
                                                                                                              title: '設定資料來源',
                                                                                                          })
                                                                                                      );
                                                                                                  } else {
                                                                                                      dd.arrayData = undefined;
                                                                                                  }
                                                                                                  return array.join(`<div class="my-2"></div>`);
                                                                                              })()}
                                                                                              ${gvc.bindView(() => {
                                                                                                  const uid = gvc.glitter.getUUID();
                                                                                                  return {
                                                                                                      bind: uid,
                                                                                                      view: () => {
                                                                                                          dd.preloadEvenet = dd.preloadEvenet ?? {};
                                                                                                          dd.hiddenEvent = dd.hiddenEvent ?? {};
                                                                                                          let view: any = [
                                                                                                              TriggerEvent.editer(gvc, dd, dd.preloadEvenet, {
                                                                                                                  title: '模塊預載事件',
                                                                                                                  option: [],
                                                                                                                  hover: false,
                                                                                                              }),
                                                                                                              TriggerEvent.editer(gvc, dd, dd.hiddenEvent, {
                                                                                                                  title: '模塊隱藏事件',
                                                                                                                  option: [],
                                                                                                                  hover: false,
                                                                                                              }),
                                                                                                          ];
                                                                                                          if (dd.type !== 'widget' && dd.type !== 'container') {
                                                                                                              view.push(
                                                                                                                  gvc.glitter.htmlGenerate.styleEditor(dd, gvc, dd, {}).editor(
                                                                                                                      gvc,
                                                                                                                      () => {
                                                                                                                          gvc.notifyDataChange('showView');
                                                                                                                      },
                                                                                                                      '模塊容器樣式'
                                                                                                                  )
                                                                                                              );
                                                                                                          }
                                                                                                          return view.join(`<div class="my-2"></div>`);
                                                                                                      },
                                                                                                      divCreate: {
                                                                                                          class: 'mt-2 mb-2 ',
                                                                                                      },
                                                                                                  };
                                                                                              })}
                                                                                          </div>`;
                                                                                      case 'lifecycle':
                                                                                          if (dd.data && dd.data.onCreateEvent) {
                                                                                              dd.onCreateEvent = dd.data.onCreateEvent;
                                                                                              dd.data.onCreateEvent = undefined;
                                                                                          }
                                                                                          dd.onInitialEvent = dd.onInitialEvent ?? {};
                                                                                          dd.onCreateEvent = dd.onCreateEvent ?? {};
                                                                                          dd.onResumtEvent = dd.onResumtEvent ?? {};
                                                                                          dd.onDestoryEvent = dd.onDestoryEvent ?? {};
                                                                                          return `<div class="p-2 pt-1">${[
                                                                                              html` <div
                                                                                                  class="alert alert-warning  p-2   m-n2 border-bottom fw-500"
                                                                                                  style="border-radius: 0px;color:black !important;"
                                                                                              >
                                                                                                  <strong>onInitial事件:</strong><br />模塊初次載入所執行事件。<br />
                                                                                                  <strong>onCreate事件:</strong><br />模塊被建立時所執行事件。<br />
                                                                                                  <strong>onResume事件:</strong><br />模塊重新渲染至畫面時所執行事件。<br />
                                                                                                  <strong>onDestroy事件:</strong><br />模塊被銷毀所執行的事件。<br />
                                                                                              </div>`,
                                                                                              `<div class="my-4"></div>`,
                                                                                              TriggerEvent.editer(gvc, dd, dd.onInitialEvent, {
                                                                                                  title: 'onInitial事件',
                                                                                                  option: [],
                                                                                                  hover: false,
                                                                                              }),
                                                                                              TriggerEvent.editer(gvc, dd, dd.onCreateEvent, {
                                                                                                  title: 'onCreate事件',
                                                                                                  option: [],
                                                                                                  hover: false,
                                                                                              }),
                                                                                              TriggerEvent.editer(gvc, dd, dd.onResumtEvent, {
                                                                                                  title: 'onResume事件',
                                                                                                  option: [],
                                                                                                  hover: false,
                                                                                              }),
                                                                                              TriggerEvent.editer(gvc, dd, dd.onDestoryEvent, {
                                                                                                  title: 'onDestroy事件',
                                                                                                  option: [],
                                                                                                  hover: false,
                                                                                              }),
                                                                                          ].join(`<div class="my-2"></div>`)}</div>`;
                                                                                      default:
                                                                                          return ``;
                                                                                  }
                                                                              },
                                                                          };
                                                                      }),
                                                                  ].join('');
                                                              })(),
                                                              width: 350,
                                                          });
                                                      })}">
<i class="fa-regular fa-gear" style="font-size:16px"></i>進階</button>
`;
                                                  }
                                              },
                                              divCreate: {
                                                  class: `d-flex align-items-center mx-n2 mt-n2 p-3 py-2 shadow border-bottom`,
                                                  style: `background: #f6f6f6;height:48px;`,
                                              },
                                          };
                                      }),
                                gvc.bindView(() => {
                                    let loading = true;
                                    let data: string | Promise<string> = '';
                                    function getData() {
                                        if (dd.type === 'code') {
                                            data = codeComponent
                                                .render(gvc, dd, container as any, HtmlGenerate.hover_items, subData, {
                                                    widgetComponentID: gvc.glitter.getUUID(),
                                                })
                                                .editor();
                                            loading = false;
                                            gvc.notifyDataChange(component);
                                        } else if (dd.type === 'widget' || dd.type === 'container') {
                                            data = widgetComponent
                                                .render(gvc, dd, container as any, HtmlGenerate.hover_items, subData, {
                                                    widgetComponentID: gvc.glitter.getUUID(),
                                                    root: root,
                                                })
                                                .editor();
                                            loading = false;
                                            gvc.notifyDataChange(component);
                                        } else {
                                            loading = true;
                                            gvc.glitter.htmlGenerate.loadScript(gvc.glitter, [
                                                {
                                                    src: gvc.glitter.htmlGenerate.resourceHook(dd.js),
                                                    callback: (data2: any) => {
                                                        if (data2[dd.type].render.version === 'v2') {
                                                            data = data2[dd.type]
                                                                .render({
                                                                    gvc: gvc,
                                                                    widget: dd,
                                                                    widgetList: container,
                                                                    hoverID: HtmlGenerate.hover_items,
                                                                    subData: subData,
                                                                    formData: dd.formData,
                                                                })
                                                                .editor();
                                                        } else {
                                                            data = data2[dd.type].render(gvc, dd, container, HtmlGenerate.hover_items, subData).editor();
                                                        }
                                                        if (typeof data === 'string') {
                                                            loading = false;
                                                            gvc.notifyDataChange(component);
                                                        } else {
                                                            data2.then((dd: any) => {
                                                                data = dd;
                                                                loading = false;
                                                                gvc.notifyDataChange(component);
                                                            });
                                                        }
                                                    },
                                                },
                                            ]);
                                        }
                                    }

                                    dd.refreshComponentParameter!.view2 = () => {
                                        getData();
                                    };
                                    getData();
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
                                                            return ``;
                                                        } else {
                                                            return [
                                                                gvc.bindView(() => {
                                                                    const uid = gvc.glitter.getUUID();
                                                                    return {
                                                                        bind: uid,
                                                                        view: () => {
                                                                            dd.preloadEvenet = dd.preloadEvenet ?? {};

                                                                            return ``;
                                                                        },
                                                                        divCreate: {
                                                                            class: 'mt-2 mb-2 ',
                                                                        },
                                                                    };
                                                                }),
                                                                data as string,
                                                            ].join(`<div class="my-1"></div>`);
                                                        }
                                                    })(),
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
                                    };
                                }),
                            ].join('')
                        );
                    }
                });
            },
        };
    });
})()}</div>`;
                                } catch (e: any) {
                                    HtmlGenerate.share.false[dd.js] = (HtmlGenerate.share.false[dd.js] ?? 0) + 1;
                                    gvc.glitter.deBugMessage(`解析錯誤:${e.message}<br>${e.stack}<br>${e.line}`);
                                    if (HtmlGenerate.share.false[dd.js] < 80) {
                                        setTimeout(() => {
                                            getData();
                                        }, 100);
                                    }
                                    return `<div class="alert alert-danger" role="alert" style="word-break: break-word;white-space: normal;">
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
                            .join('');
                    }
                },
                divCreate: {},
                onCreate: () => {},
            });
        };
        this.exportJson = (setting: HtmlJson[]) => {
            return JSON.stringify(setting);
        };
    }

    public static renderWidgetSingle(cf: { widget: any; gvc: GVC; option: any; container: any; container_id: string; child_container: any; root?: boolean; sub_data: any }) {
        const gvc = cf.gvc;
        //父容器
        const container = cf.container;
        //容器ID
        const container_id = cf.container_id;
        //元件配置
        const option = cf.option;
        //單一元件
        const widget = cf.widget;
        //是否是最上層容器
        const root = cf.root;
        //是否是子容器
        const child_container = cf.child_container;
        //夾帶資料
        const sub_data = cf.sub_data;
        //對應的Document
        const document = option.document ?? gvc.glitter.document;
        cf.widget.tag = option.tag;
        cf.widget.formData = cf.widget.formData || (container as any).formData;
        cf.widget.global = cf.widget.global ?? [];
        cf.widget.global.gvc = gvc;
        cf.widget.global.pageConfig = option.page_config;
        cf.widget.global.appConfig = option.app_config;
        cf.widget.refreshAllParameter = cf.widget.refreshAllParameter ?? {};
        cf.widget.refreshAllParameter!.view1 = () => {
            gvc.notifyDataChange(container_id);
        };
        cf.widget.editor_bridge = undefined;
        //Editor操作元件
        Object.defineProperty(cf.widget, 'editor_bridge', {
            get: function () {
                return {
                    scrollWithHover: () => {
                        gvc.glitter.$(`.editor_it_${cf.widget.id}`).addClass('editorItemActive');
                        gvc.glitter.$(`.editor_it_${cf.widget.id}`).get(0).scrollIntoView({
                            behavior: 'smooth', // 使用平滑滾動效果
                            block: 'center', // 將元素置中
                        });
                    },
                    cancelHover: () => {
                        gvc.glitter.$(`.editor_it_${cf.widget.id}`).removeClass('editorItemActive');
                    },
                    element: () => {
                        return gvc.glitter.$(`.editor_it_${cf.widget.id}`).get(0);
                    },
                };
            },
            set(v: any) {},
        });

        //Get the html content for this component
        function getHtml() {
            if (
                (cf.widget.data.elem === 'link' &&
                    cf.widget.data.attr.find((dd: any) => {
                        return cf.widget.attr === 'rel' && cf.widget.value === 'stylesheet';
                    })) ||
                (cf.widget.data.elem === 'script' &&
                    cf.widget.data.attr.find((dd: any) => {
                        return cf.widget.attr === 'src';
                    }))
            ) {
                return ``;
            }
            if (!isEditMode() && (widget as any).visible === false) {
                return ``;
            } else if (['code'].indexOf(cf.widget.type) === -1) {
                cf.widget.refreshComponentParameter = cf.widget.refreshComponentParameter ?? {};
                if (cf.widget.type === 'widget' || cf.widget.type === 'container') {
                    if (cf.widget.data.elem === 'header') {
                        console.log(`Header-wait-render-time:`, (window as any).renderClock.stop());
                    }
                    return gvc.bindView(() => {
                        const tempView = gvc.glitter.getUUID();
                        const vm = {
                            loading: true,
                            html: '',
                        };

                        function getHtml() {
                            return new Promise(async (resolve, reject) => {
                                cf.widget.refreshComponentParameter!.view1 = () => {
                                    gvc.notifyDataChange(container_id);
                                };

                                function addCreateOption(option: any, widgetComponentID: string) {
                                    if (isEditMode() && !child_container && root) {
                                        option.push({
                                            key: 'onclick',
                                            value: (() => {
                                                cf.widget.editorEvent = () => {
                                                    HtmlGenerate.selectWidget({
                                                        gvc: gvc,
                                                        widget: widget,
                                                        widgetComponentID: cf.widget.id,
                                                        event: document.querySelector(`[gvc-id="${gvc.id(cf.widget.id)}"]`),
                                                        glitter: (window.parent as any).glitter,
                                                    });
                                                    scrollToHover(gvc.glitter.$(`.editor_it_${cf.widget.id}`).get(0));
                                                };
                                                return gvc.editorEvent((e, event) => {
                                                    HtmlGenerate.selectWidget({
                                                        gvc: gvc,
                                                        widget: widget,
                                                        widgetComponentID: cf.widget.id,
                                                        event: event,
                                                        glitter: (window.parent as any).glitter,
                                                    });
                                                });
                                            })(),
                                        });
                                    }
                                }

                                if (cf.widget.gCount === 'multiple') {
                                    TriggerEvent.trigger({
                                        gvc,
                                        widget: widget as any,
                                        clickEvent: cf.widget.arrayData,
                                        subData: sub_data,
                                        callback: (data) => {
                                            if (!Array.isArray(data) && data) {
                                                data = [data];
                                            }
                                            if (!data) {
                                                data = [];
                                            }
                                            resolve(
                                                data
                                                    .map((subData: any) => {
                                                        let option: any = [];
                                                        const widgetComponentID = gvc.glitter.getUUID();
                                                        addCreateOption(option, widgetComponentID);
                                                        return widgetComponent
                                                            .render(
                                                                gvc,
                                                                widget as any,
                                                                container as any,
                                                                HtmlGenerate.hover_items,
                                                                subData,
                                                                {
                                                                    option: option,
                                                                    widgetComponentID: widgetComponentID,
                                                                    root: root,
                                                                },
                                                                document
                                                            )
                                                            .view() as string;
                                                    })
                                                    .join('')
                                            );
                                        },
                                    });
                                } else {
                                    let option: any = [];
                                    const widgetComponentID = gvc.glitter.getUUID();
                                    addCreateOption(option, widgetComponentID);
                                    resolve(
                                        widgetComponent
                                            .render(
                                                gvc,
                                                widget as any,
                                                container as any,
                                                HtmlGenerate.hover_items,
                                                (widget as any).subData || sub_data,
                                                {
                                                    option: option,
                                                    widgetComponentID: widgetComponentID,
                                                    root: root,
                                                },
                                                document
                                            )
                                            .view() as string
                                    );
                                }
                            });
                        }

                        getHtml().then((dd: any) => {
                            vm.html = dd;
                            vm.loading = false;
                            gvc.notifyDataChange(tempView);
                        });
                        return {
                            bind: tempView,
                            view: () => {
                                return ``;
                            },
                            divCreate: {
                                class: ``,
                            },
                            onCreate: () => {
                                if (!vm.loading) {
                                    const target: any = (document as any).querySelector(`[gvc-id="${gvc.id(tempView)}"]`);
                                    target.outerHTML = vm.html;
                                }
                            },
                            onDestroy: () => {},
                        };
                    });
                } else {
                    return gvc.bindView(() => {
                        const tempView = gvc.glitter.getUUID();
                        return {
                            bind: tempView,
                            view: () => {
                                return ``;
                            },
                            divCreate: {
                                class: ``,
                            },
                            onCreate: () => {
                                const target = document.querySelector(`[gvc-id="${gvc.id(tempView)}"]`);

                                function render(subData: any) {
                                    return gvc.bindView(() => {
                                        const component_id = gvc.glitter.getUUID();
                                        cf.widget.refreshComponentParameter!.view1 = () => {
                                            gvc.notifyDataChange(component_id);
                                        };
                                        let option: any = [];
                                        if (isEditMode() && !child_container && root) {
                                            option.push({
                                                key: 'onclick',
                                                value: (() => {
                                                    cf.widget.editorEvent = () => {
                                                        HtmlGenerate.selectWidget({
                                                            gvc: gvc,
                                                            widget: widget,
                                                            widgetComponentID: cf.widget.id,
                                                            event: document.querySelector(`[gvc-id="${gvc.id(component_id)}"]`),
                                                            glitter: (window.parent as any).glitter,
                                                        });
                                                        scrollToHover(gvc.glitter.$(`.editor_it_${cf.widget.id}`).get(0));
                                                    };
                                                    return gvc.editorEvent((e, event) => {
                                                        HtmlGenerate.selectWidget({
                                                            gvc: gvc,
                                                            widget: widget,
                                                            widgetComponentID: cf.widget.id,
                                                            event: event,
                                                            glitter: (window.parent as any).glitter,
                                                        });
                                                    });
                                                })(),
                                            });
                                        }

                                        return {
                                            bind: component_id!,
                                            view: () => {
                                                if (cf.widget.type === 'component') {
                                                    const view = [component.render(gvc, widget, container, HtmlGenerate.hover_items, subData, {}, document).view() as string];
                                                    if (root && isEditMode()) {
                                                        view.push(
                                                            HtmlGenerate.getEditorSelectSection({
                                                                id: cf.widget.id,
                                                                gvc: gvc,
                                                                label: cf.widget.label,
                                                            })
                                                        );
                                                    }
                                                    return view.join('');
                                                }
                                                return new Promise(async (resolve, reject) => {
                                                    const view = [
                                                        await new Promise((resolve, reject) => {
                                                            gvc.glitter.htmlGenerate.loadScript(gvc.glitter, [
                                                                {
                                                                    src: cf.widget.js,
                                                                    callback: (data: any) => {
                                                                        if (data[cf.widget.type].render.version === 'v2') {
                                                                            data = data[cf.widget.type]
                                                                                .render({
                                                                                    gvc: gvc,
                                                                                    widget: widget,
                                                                                    widgetList: container,
                                                                                    hoverID: HtmlGenerate.hover_items,
                                                                                    subData: subData,
                                                                                    formData: cf.widget.formData,
                                                                                })
                                                                                .view();
                                                                        } else {
                                                                            data = data[cf.widget.type].render(gvc, widget, container, HtmlGenerate.hover_items, subData).view();
                                                                        }
                                                                        if (typeof data === 'string') {
                                                                            resolve(data);
                                                                        } else {
                                                                            data.then((dd: any) => {
                                                                                resolve(dd as string);
                                                                            });
                                                                        }
                                                                    },
                                                                },
                                                            ]);
                                                        }),
                                                    ];
                                                    if (root && isEditMode()) {
                                                        const html = String.raw;
                                                        view.push(
                                                            HtmlGenerate.getEditorSelectSection({
                                                                id: cf.widget.id,
                                                                gvc: gvc,
                                                                label: cf.widget.label,
                                                            })
                                                        );
                                                    }
                                                    resolve(view.join(''));
                                                });
                                            },
                                            divCreate: {
                                                style: `position: relative;${gvc.glitter.htmlGenerate.styleEditor(widget, gvc, widget, {}).style()};${
                                                    (widget as any).visible === false ? `display:none;` : ``
                                                }`,
                                                class: `${cf.widget.class ?? ''} ${cf.widget.hashTag ? `glitterTag${cf.widget.hashTag}` : ''} 
                                                                                ${isEditMode() ? `editorParent` : ``}
                                                                ${gvc.glitter.htmlGenerate.styleEditor(widget, gvc, widget, {}).class()}`,
                                                option: option.concat(
                                                    (() => {
                                                        if (root && isEditMode()) {
                                                            return [
                                                                {
                                                                    key: 'onmouseover',
                                                                    value: gvc.event((e, event) => {
                                                                        ($(e).children('.editorChild').get(0) as any).style.background =
                                                                            'linear-gradient(143deg, rgba(255, 180, 0, 0.2) -22.7%, rgba(255, 108, 2, 0.2) 114.57%)';
                                                                        //漸層
                                                                        // background: linear-gradient(143deg, rgba(255, 180, 0, 0.2) -22.7%, rgba(255, 108, 2, 0.2) 114.57%);
                                                                    }),
                                                                },
                                                                {
                                                                    key: 'onmouseout',
                                                                    value: gvc.event((e, event) => {
                                                                        ($(e).children('.editorChild').get(0) as any).style.background = 'none';
                                                                        //漸層
                                                                        // background: linear-gradient(143deg, rgba(255, 180, 0, 0.2) -22.7%, rgba(255, 108, 2, 0.2) 114.57%);
                                                                    }),
                                                                },
                                                            ];
                                                        } else {
                                                            return [];
                                                        }
                                                    })()
                                                ),
                                            },
                                            onCreate: () => {
                                                TriggerEvent.trigger({
                                                    gvc,
                                                    widget: widget as any,
                                                    clickEvent: (widget as any).onCreateEvent,
                                                    subData: subData,
                                                });
                                                gvc.glitter.document.querySelector(`[gvc-id="${gvc.id(component_id)}"]`).onResumeEvent = () => {
                                                    TriggerEvent.trigger({
                                                        gvc,
                                                        widget: widget as any,
                                                        clickEvent: (widget as any).onResumtEvent,
                                                        subData: subData,
                                                    });
                                                };
                                            },
                                            onInitial: () => {
                                                TriggerEvent.trigger({
                                                    gvc,
                                                    widget: widget as any,
                                                    clickEvent: (widget as any).onInitialEvent,
                                                    subData: subData,
                                                });
                                            },
                                            onDestroy: () => {
                                                TriggerEvent.trigger({
                                                    gvc,
                                                    widget: widget as any,
                                                    clickEvent: (widget as any).onDestoryEvent,
                                                    subData: subData,
                                                });
                                            },
                                        };
                                    });
                                }

                                if (cf.widget.gCount === 'multiple') {
                                    TriggerEvent.trigger({
                                        gvc,
                                        widget: widget as any,
                                        clickEvent: cf.widget.arrayData,
                                        subData: sub_data,
                                        callback: (data) => {
                                            if (!Array.isArray(data) && data) {
                                                data = [data];
                                            }
                                            if (!data) {
                                                console.log(`isNull`, widget);
                                                data = [];
                                            }
                                            const view = data
                                                .map((subData: any) => {
                                                    return render(subData);
                                                })
                                                .join('');
                                            target!.outerHTML = view;
                                        },
                                    });
                                } else {
                                    target!.outerHTML = render((widget as any).subData || sub_data);
                                }
                            },
                            onDestroy: () => {},
                        };
                    });
                }
            } else {
                return ``;
            }
        }

        return getHtml();
    }

    public static block_timer = 0;

    public static selectWidget(cf: { widget: any; gvc: GVC; widgetComponentID: string; event?: any; scroll_to_hover?: boolean; glitter: Glitter }) {
        const dd = cf.widget;
        const gvc = cf.gvc;
        const widgetComponentID = cf.widgetComponentID;
        const event = cf.event;
        let glitter = (window as any).glitter;
        while (!glitter.share.editorViewModel) {
            glitter = (window.parent as any).glitter;
        }
        function active() {
            try {
                Storage.page_setting_item = 'layout';
                (glitter.pageConfig[gvc.glitter.pageConfig.length - 1] as any).gvc.notifyDataChange('left_sm_bar');
                gvc.glitter.$('.editorItemActive').removeClass('editorItemActive');
                gvc.glitter.$(`.editor_it_${widgetComponentID}`).addClass('editorItemActive');
                glitter.share.editorViewModel.selectItem = dd;
                Storage.lastSelect = dd.id;
                glitter.share.selectEditorItem();
                if (cf.scroll_to_hover) {
                    setTimeout(() => {
                        scrollToHover(gvc.glitter.$(`.editor_it_${widgetComponentID}`).get(0));
                    });
                }
                if (document.body.clientWidth < 768) {
                    glitter.openDrawer();
                }
                event && event.stopPropagation && event.stopPropagation();
            } catch (e) {
                console.log(e);
            }
        }

        if (new Date().getTime() - HtmlGenerate.block_timer > 500) {
            active();
        }
    }

    public static getEditorSelectSection(cf: { id: string; gvc: GVC; label: string }) {
        if (cf.gvc.glitter.getUrlParameter('type') !== 'htmlEditor') {
            return ``;
        }
        let glitter = (window as any).glitter;
        while (!glitter.share.editorViewModel) {
            glitter = (window.parent as any).glitter;
        }
        const gvc = cf.gvc;
        const widget = glitter.share.findWidgetIndex(cf.id).widget;
        return [
            (() => {
                return  ``
                if (widget && widget.type === 'container' && widget.data.setting && widget.data.setting.length === 0) {
                    const addID = gvc.glitter.getUUID();
                    return html` <div class="${addID}" style="min-height: 250px;"></div>
                        <div
                            class="d-flex align-items-center justify-content-center flex-column rounded-3 position-absolute ${addID}"
                            style="background: lightgrey;color: #393939;cursor: pointer;min-height: 250px;left: 0px;top:0px;width: 100%;height: 100%;"
                            onmousedown="${gvc.event(() => {
                                glitter.getModule(new URL(gvc.glitter.root_path + 'editor/add-component.js').href, (AddComponent: any) => {
                                    glitter.share.editorViewModel.selectContainer = widget.data.setting;
                                    AddComponent.toggle(true);
                                    AddComponent.addWidget = (gvc: GVC, cf: any) => {
                                        (window.parent as any).glitter.share.editorViewModel.selectContainer = widget.data.setting;
                                        (window.parent as any).glitter.share.addComponent(cf);
                                        cf.gvc.glitter.document.querySelector('#' + addID).remove();
                                    };
                                    AddComponent.addEvent = (gvc: GVC, tdata: any) => {
                                        (window.parent as any).glitter.share.editorViewModel.selectContainer = widget.data.setting;
                                        (window.parent as any).glitter.share.addComponent({
                                            id: gvc.glitter.getUUID(),
                                            js: './official_view_component/official.js',
                                            css: {
                                                class: {},
                                                style: {},
                                            },
                                            data: {
                                                refer_app: tdata.copyApp,
                                                tag: tdata.copy,
                                                list: [],
                                                carryData: {},
                                                _style_refer_global: {
                                                    index: `0`,
                                                },
                                            },
                                            type: 'component',
                                            class: 'w-100',
                                            index: 0,
                                            label: tdata.title,
                                            style: '',
                                            bundle: {},
                                            global: [],
                                            toggle: false,
                                            stylist: [],
                                            dataType: 'static',
                                            style_from: 'code',
                                            classDataType: 'static',
                                            preloadEvenet: {},
                                            share: {},
                                        });
                                        cf.gvc.glitter.document.querySelector('#' + addID).remove();
                                    };
                                });
                            })}"
                        >
                            <i class="fa-regular fa-circle-plus text-black" style="font-size: 80px;"></i>
                            <span class="fw-500 fs-5 mt-3">添加元件</span>
                        </div>`;
                } else {
                    return ``;
                }
            })(),
            cf.gvc.bindView(() => {
                const id = cf.gvc.glitter.getUUID();
                return {
                    bind: id,
                    view: () => {
                        return html` <div
                                class="position-absolute align-items-center justify-content-center px-3 fw-500 fs-6 badge_it"
                                style="height:22px;left:-2px;top:-22px;background: linear-gradient(143deg, #FFB400 -22.7%, #FF6C02 114.57%);color:white;white-space: nowrap;"
                            >
                                ${cf.label}
                            </div>
                            <div
                                class="position-absolute fs-1 plus_btn"
                                style="left:50%;transform: translateX(-50%);height:20px;width:20px;top:${Storage.view_type === 'mobile'
                                    ? `-30px`
                                    : `-40px`};z-index:99999;cursor: pointer;pointer-events:all;"
                                onmousedown="${cf.gvc.event((e, event) => {
                                    HtmlGenerate.block_timer = new Date().getTime();
                                    glitter.getModule(new URL('../.././editor/add-component.js', import.meta.url).href, (AddComponent: any) => {
                                        AddComponent.toggle(true);
                                        AddComponent.addWidget = (gvc: GVC, tdata: any) => {
                                            glitter.share.addWithIndex({
                                                data: tdata,
                                                index: cf.id,
                                                direction: -1,
                                            });
                                        };
                                        AddComponent.addEvent = (gvc: GVC, tdata: any) => {
                                            glitter.share.addWithIndex({
                                                data: {
                                                    id: gvc.glitter.getUUID(),
                                                    js: './official_view_component/official.js',
                                                    css: {
                                                        class: {},
                                                        style: {},
                                                    },
                                                    data: {
                                                        refer_app: tdata.copyApp,
                                                        tag: tdata.copy,
                                                        list: [],
                                                        carryData: {},
                                                        _style_refer_global: {
                                                            index: `0`,
                                                        },
                                                    },
                                                    type: 'component',
                                                    class: 'w-100',
                                                    index: 0,
                                                    label: tdata.title,
                                                    style: '',
                                                    bundle: {},
                                                    global: [],
                                                    toggle: false,
                                                    stylist: [],
                                                    dataType: 'static',
                                                    style_from: 'code',
                                                    classDataType: 'static',
                                                    preloadEvenet: {},
                                                    share: {},
                                                },
                                                index: cf.id,
                                                direction: -1,
                                            });
                                        };
                                    });
                                    event.stopPropagation();
                                    event.preventDefault();
                                })}"
                            >
                                <img src="https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1714376322616-Frame 3137.svg" class="w-100 h-100" />
                            </div>
                            <div
                                class="position-absolute fs-1 plus_btn"
                                style="left:50%;transform: translateX(-50%);height:20px;width:20px;bottom:${Storage.view_type === 'mobile'
                                    ? `10px`
                                    : `20px`};z-index:99999;cursor: pointer;pointer-events:all;"
                                onmousedown="${cf.gvc.event((e, event) => {
                                    HtmlGenerate.block_timer = new Date().getTime();
                                    glitter.getModule(new URL('../.././editor/add-component.js', import.meta.url).href, (AddComponent: any) => {
                                        AddComponent.toggle(true);
                                        AddComponent.addWidget = (gvc: GVC, tdata: any) => {
                                            glitter.share.addWithIndex({
                                                data: tdata,
                                                index: cf.id,
                                                direction: 1,
                                            });
                                        };
                                        AddComponent.addEvent = (gvc: GVC, tdata: any) => {
                                            glitter.share.addWithIndex({
                                                data: {
                                                    id: gvc.glitter.getUUID(),
                                                    js: './official_view_component/official.js',
                                                    css: {
                                                        class: {},
                                                        style: {},
                                                    },
                                                    data: {
                                                        refer_app: tdata.copyApp,
                                                        tag: tdata.copy,
                                                        list: [],
                                                        carryData: {},
                                                        _style_refer_global: {
                                                            index: `0`,
                                                        },
                                                    },
                                                    type: 'component',
                                                    class: 'w-100',
                                                    index: 0,
                                                    label: tdata.title,
                                                    style: '',
                                                    bundle: {},
                                                    global: [],
                                                    toggle: false,
                                                    stylist: [],
                                                    dataType: 'static',
                                                    style_from: 'code',
                                                    classDataType: 'static',
                                                    preloadEvenet: {},
                                                    share: {},
                                                },
                                                index: cf.id,
                                                direction: 1,
                                            });
                                        };
                                    });
                                    event.stopPropagation();
                                    event.preventDefault();
                                })}"
                            >
                                <img src="https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1714376322616-Frame 3137.svg" class="w-100 h-100" />
                            </div>`;
                    },
                    divCreate: {
                        class: `editorChild editor_it_${cf.id} ${cf.gvc.glitter.htmlGenerate.hover_items.indexOf(cf.id) !== -1 ? `editorItemActive` : ``}`,
                        style: `z-index: 99999;top:0px;left:0px;`,
                        option: [],
                    },
                    onCreate: () => {
                        // setTimeout(()=>{
                        // const parentHeight=(cf.gvc.glitter.document.querySelector(`.editor_it_${cf.id}`) as any).parentNode.offsetHeight
                        // const parentWidth=(cf.gvc.glitter.document.querySelector(`.editor_it_${cf.id}`) as any).parentNode.offsetWidth
                        // if(parentHeight<60 && parentWidth<60){
                        //     cf.gvc.glitter.$(`.editor_it_${cf.id} .plus_btn`).remove()
                        // }
                        // },2000)
                        // if((cf.gvc.glitter.htmlGenerate.hover_items.indexOf(cf.id) !== -1)){
                        //     setTimeout(()=>{
                        //         (cf.gvc.glitter).$('.editorItemActive').width( (cf.gvc.glitter).$('.editorItemActive').parent().width() as any);
                        //         (cf.gvc.glitter).$('.editorItemActive').height( (cf.gvc.glitter).$('.editorItemActive').parent().height() as any);
                        //     },10)
                        // }
                    },
                };
            }),
        ].join('');
    }

    public static deleteWidget(container_items: any, item: any, callback: () => void) {
        const dialog = new ShareDialog((window as any).glitter);
        dialog.checkYesOrNot({
            callback: (response) => {
                if (response) {
                    let glitter = (window as any).glitter;
                    while (!glitter.share.editorViewModel) {
                        glitter = (window.parent as any).glitter;
                    }
                    const gvc = glitter.pageConfig[0].gvc;
                    const document = glitter.document;
                    const container = (document.querySelector('#editerCenter iframe') as any).contentWindow.glitter.$(`.editor_it_${item.id}`).parent().parent().get(0);
                    for (let a = 0; a < container_items.length; a++) {
                        if (container_items[a] == item) {
                            container_items.splice(a, 1);
                        }
                    }
                    if ((document.querySelector('#editerCenter iframe') as any).contentWindow.document.querySelector(`.editor_it_${item.id}`)) {
                        (document.querySelector('#editerCenter iframe') as any).contentWindow.glitter.$(`.editor_it_${item.id}`).parent().remove();
                    }
                    if (container_items.length === 0) {
                        if (!(container as any).className.includes('editor_it_MainView')) {
                            container.recreateView();
                        } else {
                            glitter.share.editorViewModel.data.config = [];
                            gvc.notifyDataChange(['HtmlEditorContainer']);
                        }
                    }
                    if(container_items.rerenderReplaceElem){
                        container_items.rerenderReplaceElem()
                        // .append(`<div
                        //                             class="d-flex align-items-center justify-content-center flex-column rounded-3 w-100 py-3"
                        //                             id="${id}"
                        //                             style="background: lightgrey;color: #393939;cursor: pointer;min-height: 100px;left: 0px;top:0px;width: 100%;height: 100%;"
                        //                             onmousedown="${gvc.event(() => {
                        //     glitter.getModule(new URL(gvc.glitter.root_path + 'editor/add-component.js').href, (AddComponent: any) => {
                        //         glitter.share.editorViewModel.selectContainer = widget.data.setting;
                        //         AddComponent.toggle(true);
                        //         AddComponent.addWidget = (gvc: GVC, cf: any) => {
                        //             (window.parent as any).glitter.share.editorViewModel.selectContainer = widget.data.setting;
                        //             (window.parent as any).glitter.share.addComponent(cf);
                        //             AddComponent.toggle(false);
                        //             document.querySelector('#' +id).remove();
                        //         };
                        //         AddComponent.addEvent = (gvc: GVC, tdata: any) => {
                        //             (window.parent as any).glitter.share.editorViewModel.selectContainer = widget.data.setting;
                        //             (window.parent as any).glitter.share.addComponent({
                        //                 id: gvc.glitter.getUUID(),
                        //                 js: './official_view_component/official.js',
                        //                 css: {
                        //                     class: {},
                        //                     style: {},
                        //                 },
                        //                 data: {
                        //                     refer_app: tdata.copyApp,
                        //                     tag: tdata.copy,
                        //                     list: [],
                        //                     carryData: {},
                        //                     _style_refer_global: {
                        //                         index: `0`,
                        //                     },
                        //                 },
                        //                 type: 'component',
                        //                 class: 'w-100',
                        //                 index: 0,
                        //                 label: tdata.title,
                        //                 style: '',
                        //                 bundle: {},
                        //                 global: [],
                        //                 toggle: false,
                        //                 stylist: [],
                        //                 dataType: 'static',
                        //                 style_from: 'code',
                        //                 classDataType: 'static',
                        //                 preloadEvenet: {},
                        //                 share: {},
                        //             });
                        //             AddComponent.toggle(false);
                        //             console.log(` gvc.glitter.document.querySelector('#${id}').remove();`)
                        //             document.querySelector('#' +id).remove();
                        //         };
                        //     });
                        // })}"
                        //                     >
                        //                         <i class="fa-regular fa-circle-plus text-black"
                        //                            style="font-size: 60px;"></i>
                        //                         <span class="fw-500 fs-5 mt-3">添加元件</span>
                        //                     </div>`)
                    }
                    glitter.share.editorViewModel.selectItem = undefined;
                    gvc.notifyDataChange(['right_NAV', 'MainEditorLeft']);
                    callback();
                }
            },
            text: '是否確認刪除此元件?',
        });
    }

    public static preloadEvent(data: any) {
        setTimeout(() => {
            const glitter = (window as any).glitter;
            let preloadJS: any = [];
            if (Array.isArray(data)) {
                for (const b of data) {
                    this.preloadEvent(b);
                }
            } else if (data && typeof data === 'object') {
                if (data.type === 'component') {
                    (window as any).glitterInitialHelper.getPageData(
                        {
                            tag: data.data.tag,
                            appName: data.data.refer_app || (window as any).appName,
                        },
                        (d2: any) => {
                            glitter.htmlGenerate.preloadEvent(d2.response.result[0] ?? {});
                        }
                    );
                } else {
                    Object.keys(data).map((dd) => {
                        if (dd === 'src' && data['route'] && data['src'].includes('official_event')) {
                            preloadJS.push({
                                src: new URL('./official_event/event.js', glitter.root_path).href,
                                callback: async (dd: any) => {
                                    dd[data['route']].fun().preload && dd[data['route']].fun().preload();
                                },
                            });
                            // console.log(`src:${data[dd]} - route:${data['route']}`)
                        }
                        this.preloadEvent(data[dd]);
                    });
                }
            }
            glitter.htmlGenerate.loadScript(glitter, preloadJS, 'clickEvent');
        });
    }
}

function isEditMode() {
    try {
        return (window as any).editerData !== undefined || (window.parent as any).editerData !== undefined;
    } catch (e) {
        return false;
    }
}

function scrollToHover(element: any) {
    function scrollToItem(element: any) {
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth', // 使用平滑滾動效果
                block: 'center', // 將元素置中
            });
        }
    }

    setTimeout(() => {
        scrollToItem(element);
    }, 500);
}
