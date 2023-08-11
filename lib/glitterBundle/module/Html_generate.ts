import {GVC} from '../GVController.js';
import {Glitter} from '../Glitter.js';
import {EditorElem} from '../plugins/editor-elem.js';
//@ts-ignore
import autosize from '../plugins/autosize.js'
import {widgetComponent} from "../html-component/widget.js";
import {codeComponent} from "../html-component/code.js";
import {response} from "express";

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
}

export class HtmlGenerate {
    public static share: any = {};

    public static resourceHook: (src: string) => string = (src) => {
        return src;
    };
    public render: (gvc: GVC, option?: { class: string; style: string; divCreate?: boolean,jsFinish?:()=>void }, createOption?: any) => string;
    public exportJson: (setting: HtmlJson[]) => any;
    public editor: (gvc: GVC, option?: { return_: boolean; refreshAll: () => void; setting?: any[]; deleteEvent?: () => void }) => string;
    public static saveEvent = () => {
        alert('save');
    };

    public static styleEditor(data: any, gvc?: GVC, widget?: HtmlJson, subData?: any) {
        const glitter = (gvc ?? (window as any)).glitter
        return {
            editor: (gvc: GVC, widget: HtmlJson | (() => void), title?: string, option?: any) => {
                const glitter = (window as any).glitter;
                return `
<button type="button" class="btn  w-100  shadow ${(option ?? {}).class ?? "mt-2"}" style="background-image: linear-gradient(135deg, #667eea 0%, #764ba2 100%);" onclick="${
                    gvc.event(() => {
                        glitter.openDiaLog("glitterBundle/plugins/dialog-style-editor.js", "dialog-style-editor", {
                            callback: () => {
                                if (typeof widget === 'function') {
                                    widget()
                                } else {
                                    (widget as any).refreshComponent()
                                }
                            },
                            data: data
                        })
                    })
                }">${title ?? "設計樣式"}</button>`;
            },
            class: () => {
                let classs = ''
                try {
                    classs = eval(data.class)
                } catch (e) {
                    classs = data.class
                }
                return classs;
            },
            style: () => {
                let styles = ''
                try {
                    styles = eval(data.style)
                } catch (e) {
                    styles = data.style
                }
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
    public static changePage = (obj: { page_config?: any; config: any; editMode?: any; data: any; tag: string; goBack: boolean; option?: any,app_config?:any }) => {
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
        return `<h3 class="fw-500 mt-2" style="font-size: 15px;margin-bottom: 10px;color:#151515;" >${obj.title}</h3>
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
                style: `max-height:400px!important;min-height:100px;`,
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
        this.render = (gvc: GVC, option: { class: string; style: string,jsFinish?:()=>void } = {
            class: ``,
            style: ``,
            jsFinish:()=>{}
        }, createOption?: any) => {
            gvc.glitter.share.loaginR = (gvc.glitter.share.loaginR ?? 0) + 1;
            const container = `` + gvc.glitter.getUUID();
            gvc.glitter.defaultSetting.pageLoading();
            let htmlList: ({ view?: string, fun: () => string })[] = []
            let waitAddScript: string[] = []

            function getPageData() {
                htmlList = []
                const subData2 = subdata

                async function add(set: any[]) {
                    for (const a of set) {
                        if (['code'].indexOf(a.type) === -1) {
                            if ((a.type !== 'widget') && !gvc.glitter.share.htmlExtension[gvc.glitter.htmlGenerate.resourceHook(a.js)]) {
                                await new Promise((resolve, reject) => {
                                    gvc.glitter.addMtScript(
                                        [{src: `${gvc.glitter.htmlGenerate.resourceHook(a.js)}`, type: 'module'}],
                                        () => {
                                            resolve(true);
                                        },
                                        () => {
                                            resolve(false);
                                        },
                                        [
                                            {key: "async", value: "true"}
                                        ]
                                    );
                                });
                            }
                            if (a.type === 'container') {
                                await add(a.data.setting);
                            }
                        }

                    }
                    return true;
                }

                add(setting).then(async (data) => {
                    new Promise<void>(async (resolve, reject) => {
                        let index = 0
                        for (const script of setting.filter((dd) => {
                            return dd.type === 'code' && dd.data.triggerTime === 'first'
                        })) {
                            await codeComponent.render(gvc, script as any, setting as any, [], subdata).view()
                        }
                        for (const dd of setting) {
                            (await new Promise<boolean>(async (resolve, reject) => {
                                const component = dd.id;

                                function getHtml(callback: (data: string) => void) {
                                    let data: string | Promise<string> = ''
                                    try {
                                        data = gvc.glitter.share.htmlExtension[gvc.glitter.htmlGenerate.resourceHook(dd.js)][dd.type]
                                            .render(gvc, dd, setting, hover, subdata)
                                            .view()
                                    } catch (e: any) {
                                        HtmlGenerate.share.false[dd.js] = (HtmlGenerate.share.false[dd.js] ?? 0) + 1
                                        console.log(`解析錯誤:${e.message}<br>${e.stack}<br>${e.line}`)
                                        if (HtmlGenerate.share.false[dd.js] < 80) {
                                            setTimeout(() => {
                                                getHtml(callback)
                                            }, 100)
                                        }
                                        return ``;
                                    }
                                    if (typeof data === 'string') {
                                        callback(data as string)
                                    } else {
                                        data.then((dd) => {
                                            callback(dd as string)
                                        })
                                    }
                                }


                                dd.refreshAllParameter!.view1 = () => {
                                    getPageData()
                                };

                                async function loadingFinish() {
                                    await new Promise((resolve, reject) => {
                                        if (dd.data.elem === 'style') {
                                            gvc.addStyle(dd.data.inner)
                                            resolve(true)
                                        } else if ((dd.data.elem === 'link') && (dd.data.attr.find((dd: any) => {
                                            return dd.attr === 'rel' && dd.value === 'stylesheet'
                                        }))) {
                                            gvc.addStyleLink(dd.data.attr.find((dd: any) => {
                                                return dd.attr === 'href'
                                            }).value)
                                            resolve(true)
                                        } else if (((dd.data.elem === 'script')) && dd.data.attr.find((dd: any) => {
                                            return dd.attr === 'src'
                                        })) {
                                            waitAddScript.push(dd.data.attr.find((dd: any) => {
                                                return dd.attr === 'src'
                                            }).value)
                                            resolve(true)
                                        } else {
                                            resolve(true)
                                        }
                                    })
                                    const getHt = (() => {
                                        if ((dd.data.elem === 'style') || ((dd.data.elem === 'link') && (dd.data.attr.find((dd: any) => {
                                            return dd.attr === 'rel' && dd.value === 'stylesheet'
                                        }))) || (((dd.data.elem === 'script')) && dd.data.attr.find((dd: any) => {
                                            return dd.attr === 'src'
                                        }))) {
                                            return ``
                                        }
                                        if (['code'].indexOf(dd.type) === -1) {
                                            if ((dd.type === 'widget') || (dd.type === 'container')) {
                                                dd.refreshComponentParameter!.view1 = () => {
                                                    getPageData()
                                                };
                                                const option: any = []

                                                if (isEditMode()) {
                                                    option.push({
                                                        key: "onclick", value: (() => {
                                                            return gvc.event((e, event) => {
                                                                try {
                                                                    (dd as any).selectEditEvent()
                                                                    hover = [dd.id];
                                                                    gvc.glitter.$('.selectComponentHover').removeClass('selectComponentHover');
                                                                    gvc.glitter.$(e).addClass('selectComponentHover');
                                                                } catch {
                                                                }
                                                                event.stopPropagation()
                                                            })
                                                        })()
                                                    })
                                                }

                                                return (widgetComponent.render(gvc, dd as any, setting as any, hover, subdata, {
                                                    option: option,
                                                    widgetComponentID: gvc.glitter.getUUID()
                                                })
                                                    .view() as string)
                                            } else {
                                                return gvc.bindView(() => {
                                                    let innerText = ''

                                                    function getdd() {
                                                        getHtml((data) => {
                                                            innerText = data
                                                            gvc.notifyDataChange(component)
                                                        })
                                                    }

                                                    dd.refreshComponentParameter!.view1 = () => {
                                                        getdd()
                                                    };
                                                    getdd();
                                                    let option: any = []
                                                    if (isEditMode()) {
                                                        option.push({
                                                            key: "onclick", value: (() => {
                                                                return gvc.event((e, event) => {
                                                                    if (!root) {
                                                                        return
                                                                    }
                                                                    try {
                                                                        const hoverID = (gvc.glitter.$(e).attr('gvc-id') as string).replace(gvc.parameter.pageConfig!.id, '');
                                                                        (dd as any).selectEditEvent()
                                                                        hover = [dd.id];
                                                                        hover = [hoverID];
                                                                        gvc.glitter.$('.selectComponentHover').removeClass('selectComponentHover');
                                                                        gvc.glitter.$(e).addClass('selectComponentHover');
                                                                    } catch {
                                                                    }
                                                                    event.stopPropagation()
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
                                                            style: `${HtmlGenerate.styleEditor(dd).style()} `,
                                                            class: `position-relative ${dd.class ?? ''} glitterTag${dd.hashTag} ${hover.indexOf(component) !== -1 ? ` selectComponentHover` : ``}
                                                        ${HtmlGenerate.styleEditor(dd).class()}`,
                                                            option: option
                                                        },
                                                        onCreate: () => {
                                                            setTimeout(() => {
                                                                if (hover.indexOf(component) !== -1) {
                                                                    gvc.glitter.$('html').get(0).scrollTo({
                                                                        top: 0,
                                                                        left: 0,
                                                                        behavior: 'instant',
                                                                    });
                                                                    const scrollTOP =
                                                                        gvc.getBindViewElem(component).offset().top -
                                                                        gvc.glitter.$('html').offset().top +
                                                                        gvc.glitter.$('html').scrollTop() + (
                                                                            gvc.getBindViewElem(component).height() / 2
                                                                        );
                                                                    gvc.glitter
                                                                        .$('html')
                                                                        .get(0)
                                                                        .scrollTo({
                                                                            top: scrollTOP - gvc.glitter.$('html').height() / 2,
                                                                            left: 0,
                                                                            behavior: 'instant',
                                                                        });
                                                                }
                                                            }, 200)
                                                        },
                                                    }
                                                })
                                            }
                                        } else {
                                            return ``
                                        }

                                    })
                                    htmlList.push({
                                        fun: getHt,
                                        view: getHt()
                                    })
                                    resolve(true)
                                }

                                function getResource() {
                                    if ((dd.type === 'widget') || (dd.type === 'container') || (dd.type === 'code')) {
                                        loadingFinish()
                                        return
                                    }
                                    try {
                                        gvc.glitter.share.htmlExtension[gvc.glitter.htmlGenerate.resourceHook(dd.js)][dd.type]
                                            .render(gvc, dd, setting, hover, subData2)
                                        loadingFinish()
                                    } catch (e: any) {
                                        // alert(gvc.glitter.htmlGenerate.resourceHook(dd.js))

                                        // console.log(`解析錯誤:${e.message}<br>${ gvc.glitter.getCookieByName('beta')}<br>${gvc.glitter.htmlGenerate.resourceHook(dd.js}<br>${dd.type}<br>${e.stack}<br>${e.line}<br>`)
                                        HtmlGenerate.share.false[dd.js] = (HtmlGenerate.share.false[dd.js] ?? 0) + 1

                                        if (HtmlGenerate.share.false[dd.js] < 80) {
                                            setTimeout(() => {
                                                getResource()
                                            }, 100)
                                        }
                                        return ``;
                                    }
                                }

                                getResource()
                            }))
                            index = index + 1
                        }
                        gvc.glitter.defaultSetting.pageLoadingFinish();
                        gvc.notifyDataChange(container);
                        gvc.glitter.share.loaginfC = (gvc.glitter.share.loaginfC ?? 0) + 1;
                    })

                });
            }

            getPageData();

            return gvc.bindView({
                bind: container,
                view: () => {
                    return htmlList.map((dd) => {
                        return dd.view!
                    }).join('')
                },
                divCreate: createOption ?? {
                    class: option.class, style: option.style, option: [{
                        key: `gl_type`,
                        value: "container"
                    }]
                },
                onCreate: () => {
                    async function loadScript() {
                        for (const script of setting.filter((dd) => {
                            return dd.type === 'code' && dd.data.triggerTime === 'last'
                        })) {
                            await codeComponent.render(gvc, script as any, setting as any, [], subdata).view()
                        }
                        for (const a of waitAddScript) {

                            // console.log(`loadScript:` + a)
                            await new Promise((resolve, reject) => {
                                gvc.addMtScript([{
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
                    }
                    loadScript().then(() => {
                        option.jsFinish && option.jsFinish()
                    })
                },
            });
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
            }
        ) => {
            var loading = true;
            const oset = this.setting;

            function getData() {
                async function add(set: any[]) {
                    for (const a of set) {
                        if (['code'].indexOf(a.type) === -1) {
                            let falseArray: any[] = []
                            if (!gvc.glitter.share.htmlExtension[gvc.glitter.htmlGenerate.resourceHook(a.js)]) {
                                await new Promise((resolve, reject) => {
                                    gvc.glitter.addMtScript(
                                        [{src: `${gvc.glitter.htmlGenerate.resourceHook(a.js)}`, type: 'module'}],
                                        () => {
                                            resolve(true);
                                        },
                                        () => {
                                            falseArray.push(gvc.glitter.htmlGenerate.resourceHook(a.js))
                                            resolve(false);
                                        },
                                        [
                                            {key: "async", value: "true"}
                                        ]
                                    );
                                });
                            }
                            if (a.type === 'container') {
                                await add(a.data.setting);
                            }
                            if (falseArray.length > 0) {
                                await add(falseArray)
                            }
                        }
                    }
                    return true;
                }

                add(option.setting ?? setting).then((data) => {
                    loading = false;
                    setTimeout(() => {
                        gvc.notifyDataChange(editContainer);
                    }, 100);
                });
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
                                    const component = gvc.glitter.getUUID();
                                    dd.refreshAllParameter = dd.refreshAllParameter ?? {
                                        view1: () => {
                                        },
                                        view2: () => {
                                        },
                                    };
                                    dd.refreshComponent = () => {
                                        try {
                                            dd.refreshComponentParameter!.view1();
                                            dd.refreshComponentParameter!.view2();

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
                                                try {
                                                    data = gvc.glitter.share.htmlExtension[gvc.glitter.htmlGenerate.resourceHook(dd.js)][dd.type]
                                                        .render(gvc, dd, setting, hover, subdata)
                                                        .editor()
                                                } catch (e: any) {
                                                    HtmlGenerate.share.false[dd.js] = (HtmlGenerate.share.false[dd.js] ?? 0) + 1
                                                    console.log(`解析錯誤:${e.message}<br>${e.stack}<br>${e.line}`)
                                                    if (HtmlGenerate.share.false[dd.js] < 80) {
                                                        setTimeout(() => {
                                                            getData()
                                                        }, 100)
                                                    }
                                                }
                                                if (typeof data === 'string') {
                                                    loading = false
                                                    gvc.notifyDataChange(component)
                                                } else {
                                                    data.then((dd) => {
                                                        data = dd
                                                        loading = false
                                                        gvc.notifyDataChange(component)
                                                    })
                                                }
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
                                                        `<div class="alert-warning alert">
<h3 class="text-dark  m-1" style="font-size: 16px;">模塊路徑</h3>
<h3 class="text-primary alert-primary  m-1 fw-bold rounded p2-" style="font-size: 16px;">${dd.js}</h3>
<h3 class="text-dark  m-1 mt-2" style="font-size: 16px;">函式路徑</h3>
<h3 class="text-primary alert-primary m-1 fw-bold rounded p2-" style="font-size: 16px;">${dd.type}</h3>
</div>`,
                                                        HtmlGenerate.editeInput({
                                                            gvc: gvc,
                                                            title: '模塊名稱',
                                                            default: dd.label,
                                                            placeHolder: '請輸入自定義模塊名稱',
                                                            callback: (text) => {
                                                                dd.label = text;
                                                                option.refreshAll!();
                                                                dd.refreshAll!();
                                                            },
                                                        }),
                                                        `<div class="mb-2"></div>`,
                                                        HtmlGenerate.editeInput({
                                                            gvc: gvc,
                                                            title: '輸入HashTag標籤',
                                                            default: dd.hashTag,
                                                            placeHolder: 'hashtag標籤',
                                                            callback: (text) => {
                                                                dd.hashTag = text;
                                                                option.refreshAll!();
                                                                dd.refreshAll!();
                                                            },
                                                        }),
                                                        gvc.bindView(() => {
                                                            const uid = gvc.glitter.getUUID();
                                                            const toggleEvent = gvc.event(() => {
                                                                dd.expandStyle = !dd.expandStyle;
                                                                gvc.notifyDataChange(uid);
                                                            });

                                                            return {
                                                                bind: uid,
                                                                view: () => {
                                                                    if ((dd.type === 'widget') || (dd.type === 'container')) {
                                                                        return ``
                                                                    }
                                                                    return gvc.glitter.htmlGenerate.styleEditor(dd).editor(
                                                                        gvc,
                                                                        () => {
                                                                            option.refreshAll();
                                                                        },
                                                                        '父層設計樣式'
                                                                    );
                                                                },
                                                                divCreate: {
                                                                    class: 'mt-2 mb-2 '
                                                                },
                                                            };
                                                        }),
                                                        (() => {
                                                            if (loading) {
                                                                return ``
                                                            } else {
                                                                return data as string
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
                                    console.log(`解析錯誤:${e.message}<br>${e.stack}<br>${e.line}`)
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