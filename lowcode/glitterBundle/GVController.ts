"use strict";
import {Glitter} from './Glitter.js';
import {PageConfig, GVCType, PageManager} from "./module/PageManager.js";

const $: any = (window as any).$;

class LifeCycle {
    public onResume = function () {
    }
    public onPause = function () {
    }
    public onDestroy = function () {
    }
    public onCreate = function () {
    }
    public onCreateView = function (): string {
        return ""
    }
    public cssInitial = function (): string {
        return ''
    }

    public notifyDataChange() {
        $('body').html(this.onCreateView())
    }

    constructor() {
    }
}

export class GVC {
    public get glitter() {
        return (window as any).glitter as Glitter
    }

    public static get glitter() {
        return (window as any).glitter as Glitter
    }

    public parameter: {
        clickMap: any
        pageConfig?: PageConfig,
        bindViewList: any,
        clickID: number,
        styleList: { id: string, style: string }[],
        styleLinks: { id: string, src: string }[],
        jsList: { id: string, src: string }[],
    } = {
        clickMap: {},
        pageConfig: undefined,
        bindViewList: {},
        clickID: 0,
        styleList: [],
        jsList: [],
        styleLinks: [],
    }

    public closeDialog() {
        this.glitter.closeDiaLog(this.parameter.pageConfig?.tag)
    }

    public getBundle() {
        this.parameter.pageConfig!.obj = this.parameter.pageConfig!.obj ?? {}
        return this.parameter.pageConfig?.obj
    }

    public share:any = {}

    public notifyDataChange(id: any) {
        const gvc = this
        try {
            const refresh = (id: string) => {
                if (!gvc.glitter.elementCallback[gvc.id(id)]) {
                    return
                }
                gvc.glitter.elementCallback[gvc.id(id)].recreateView()
            };
            const convID = function () {
                if (typeof id === 'object') {
                    id.map(function (id: string) {
                        refresh(id)
                    })
                } else {

                    refresh(id)
                }
            }
            convID()
        } catch (e: any) {
            if (gvc.glitter.debugMode) {
                console.log(e);
                console.log(e.stack);  // this will work on chrome, FF. will no not work on safari
                console.log(e.line);
            }
        }
    }

    public getBindViewElem(id: string) {
        const gvc = this
        return $(`[gvc-id="${gvc.id(id)}"]`)
    }

    public recreateView = () => {
    }

    public addObserver(obj: any, callback: () => void, viewBind?: string) {
        const gvc = this
        try {
            if (obj.initial) {
                callback()
            }
            var map = obj.obj
            if (!map.GlitterJsonStringConversionGetData) {
                var tMap = {}
                map.GlitterJsonStringConversionGetData = function () {
                    return tMap
                }
            }
            if (!map.GlitterObServerCallBack) {
                var callba: any = []
                map.GlitterObServerCallBack = function () {
                    return callba
                }
            }
            if (viewBind) {
                if (map.GlitterObServerCallBack().filter(function (it: any) {
                    return it.viewBind === viewBind
                }).length === 0) {
                    map.GlitterObServerCallBack().push({key: obj.key, callback: callback, viewBind: viewBind});
                }
            } else {
                map.GlitterObServerCallBack().push({key: obj.key, callback: callback});
            }
            var keys = Object.keys(map);
            for (var a = 0; a < keys.length; a++) {
                let keyVa = keys[a];
                if (keyVa !== 'GlitterJsonStringConversionGetData' && (keyVa !== 'GlitterObServerCallBack') && (keyVa === obj.key)) {
                    gvc.glitter.deBugMessage("add-" + obj.key)
                    if (!map.GlitterJsonStringConversionGetData()[keyVa]) {
                        map.GlitterJsonStringConversionGetData()[keyVa] = map[keyVa];
                    }
                    Object.defineProperty(map, keyVa, {
                        get: function () {
                            return map.GlitterJsonStringConversionGetData()[keyVa];
                        },

                        set(v) {
                            map.GlitterJsonStringConversionGetData()[keyVa] = v;
                            map.GlitterObServerCallBack().map(function (it: any) {
                                try {
                                    if (it.key === keyVa) {
                                        it.callback({key: it.key, value: v})
                                    }
                                } catch (e: any) {
                                    gvc.glitter.deBugMessage(e)
                                    gvc.glitter.deBugMessage(e.stack)  // this will work on chrome, FF. will no not work on safari
                                    gvc.glitter.deBugMessage(e.line)  // this will work on safari but not on IPhone
                                }
                            });
                        }
                    });
                }
            }
            if (map[obj.key] === undefined) {
                map[obj.key] = ''
                Object.defineProperty(map, obj.key, {
                    get: function () {
                        return map.GlitterJsonStringConversionGetData()[obj.key];
                    },
                    set(v) {
                        map.GlitterJsonStringConversionGetData()[obj.key] = v;
                        map.GlitterObServerCallBack().map(function (it: any) {
                            try {
                                if (it.key === obj.key) {
                                    it.callback({key: it.key, value: v})
                                }
                            } catch (e: any) {
                                gvc.glitter.deBugMessage(e)
                                gvc.glitter.deBugMessage(e.stack)  // this will work on chrome, FF. will no not work on safari
                                gvc.glitter.deBugMessage(e.line)  // this will work on safari but not on IPhone
                            }
                        });
                    }
                });
            }
        } catch (e: any) {
            gvc.glitter.deBugMessage(e)
            gvc.glitter.deBugMessage(e.stack)  // this will work on chrome, FF. will no not work on safari
            gvc.glitter.deBugMessage(e.line)  // this will work on safari but not on IPhone
        }
    }

    public initialElemCallback(id: any) {
        const gvc = this
        gvc.glitter.elementCallback[id] = gvc.glitter.elementCallback[id] ?? {
            onCreate: () => {
            },
            onInitial: () => {
            },
            notifyDataChange: () => {

            },
            getView: () => {

            },
            updateAttribute: () => {

            }
        }
    }

    public bindView(map: (
        () =>
            { view: () => (string) | Promise<string>, bind: string, divCreate?: { elem?: string, style?: string, class?: string, option?: { key: string, value: string }[] } | (() => ({ elem?: string, style?: string, class?: string, option?: { key: string, value: string }[] })), dataList?: { obj: any, key: string }[], onCreate?: () => void, onInitial?: () => void, onDestroy?: () => void }) |
        { view: () => (string) | Promise<string>, bind: string, divCreate?: { elem?: string, style?: string, class?: string, option?: { key: string, value: string }[] } | (() => ({ elem?: string, style?: string, class?: string, option?: { key: string, value: string }[] })), dataList?: { obj: any, key: string }[], onCreate?: () => void, onInitial?: () => void, onDestroy?: () => void }
    ): string {
        const gvc = this;
        if (typeof map === "function") {
            map = map()
        }
        gvc.initialElemCallback(gvc.id(map.bind));
        if (map.dataList) {
            map.dataList.map(function (data) {
                function refreshView() {
                    if (!gvc.glitter.elementCallback[gvc.id((map as any).bind)] || !gvc.glitter.elementCallback[gvc.id((map as any).bind)].recreateView) {
                        return
                    }
                    gvc.glitter.elementCallback[gvc.id((map as any).bind)].recreateView()
                }

                refreshView()
                gvc.addObserver(data, function () {
                    refreshView()
                    if ((map as any).onCreate()) {
                        (map as any).onCreate()
                    }
                })
            })
        }

        gvc.parameter.bindViewList[map.bind] = map
        gvc.glitter.elementCallback[gvc.id(map.bind)].onInitial = (map as any).onInitial ?? (() => {
        })
        gvc.glitter.elementCallback[gvc.id(map.bind)].onCreate = (map as any).onCreate ?? (() => {
        })
        gvc.glitter.elementCallback[gvc.id(map.bind)].onDestroy = (map as any).onDestroy ?? (() => {
        })
        gvc.glitter.elementCallback[gvc.id(map.bind)].getView = (map as any).view
        gvc.glitter.elementCallback[gvc.id(map.bind)].updateAttribute = (() => {
            try {
                const id = gvc.id(map.bind as string)
                const divCreate2 = (typeof (map as any).divCreate === "function") ? (map as any).divCreate() : (map as any).divCreate;
                if (divCreate2) {
                    (divCreate2.option ?? []).concat(
                        {key: 'class', value: divCreate2.class},
                        {key: 'style', value: divCreate2.style}
                    ).map((dd: any) => {
                        try {
                            gvc.glitter.renderView.replaceAttributeValue(dd, gvc.glitter.elementCallback[id].document.querySelector(`[gvc-id="${id}"]`)!)
                        } catch (e) {
                            gvc.glitter.deBugMessage(e)
                        }
                    })
                }
            } catch (e) {
                console.log(e)
            }

        })

        const divCreate = ((typeof (map as any).divCreate === "function") ? (map as any).divCreate() : (map as any).divCreate) ?? {elem: 'div'};
        // const data = map.view()
        return `<${divCreate.elem ?? 'div'}  class="${divCreate.class ?? ""}" style="${divCreate.style ?? ""}" 
 glem="bindView"  gvc-id="${gvc.id(map.bind)}"
 ${gvc.map((divCreate.option ?? []).map((dd: any) => {
            return ` ${dd.key}="${dd.value}"`
        }))}
></${divCreate.elem ?? 'div'}>`

    }

    public event(fun: (e: any, event: any) => void, noCycle?: string) {
        const gvc = this;
        if (noCycle === undefined) {
            gvc.parameter.clickID++
            gvc.parameter.clickMap[`${gvc.parameter.clickID}`] = {
                fun: fun,
                noCycle: false
            }
            return `clickMap['${gvc.parameter.pageConfig!.id}']['${gvc.parameter.clickID}'].fun(this,event);`
        } else {
            gvc.parameter.clickMap[noCycle] = {
                fun: fun,
                noCycle: true
            }
            return `clickMap['${gvc.parameter.pageConfig!.id}']['${noCycle}'].fun(this,event);`
        }
    }

    public editorEvent(fun: (e: any, event: any) => void, noCycle?: string) {
        const gvc = this;
        if (noCycle === undefined) {
            gvc.parameter.clickID++
            gvc.parameter.clickMap[`${gvc.parameter.clickID}`] = {
                fun: fun,
                noCycle: false
            }
            return `editorEvent['${gvc.parameter.pageConfig!.id}']['${gvc.parameter.clickID}'].fun(this,event);`
        } else {
            gvc.parameter.clickMap[noCycle] = {
                fun: fun,
                noCycle: true
            }
            return `editorEvent['${gvc.parameter.pageConfig!.id}']['${noCycle}'].fun(this,event);`
        }
    }

    public addStyle(style: string) {
        this.glitter.addStyle(style)
    }

    public async addStyleLink(fs: string | string[]) {
        const gvc = this;
        gvc.glitter.addStyleLink(fs);

    }

    public addMtScript(urlArray: any[], success: () => void, error: (message: string) => void) {
        const glitter = this.glitter;
        const that = this;
        let index = 0

        function addScript() {
            if (index === urlArray.length) {
                success()
                return
            }
            var scritem: any = urlArray[index]
            scritem.id = glitter.getUUID()
            if (that.parameter.jsList.find((dd: any) => {
                return dd.src === scritem.src
            })) {
                index++
                addScript()
                return;
            }
            (that.parameter.jsList as any).push(scritem)
            let script: any = document.createElement('script');
            try {
                if (script.readyState) {  //IE
                    script.onreadystatechange = () => {
                        if (script.readyState === "loaded" || script.readyState === "complete") {
                            script.onreadystatechange = null;
                            index++
                            addScript()
                        }
                    }
                } else {
                    //其餘瀏覽器支援onload
                    script.onload = () => {
                        if (success !== undefined) {
                            index++
                            addScript()
                        }
                    }
                }
                if (scritem.type === 'text/babel') {
                    glitter.$('body').append(`<script type="text/babel" src="${scritem.src}"></script>`)
                } else if (scritem.type !== undefined) {
                    script.setAttribute('type', scritem.type);
                    script.setAttribute('src', scritem.src ?? scritem);
                    script.setAttribute('id', scritem.id ?? undefined);
                    document.getElementsByTagName("head")[0].appendChild(script);
                } else {
                    script.setAttribute('src', scritem.src ?? scritem);
                    script.setAttribute('id', scritem.id ?? undefined);
                    document.getElementsByTagName("head")[0].appendChild(script);
                }

            } catch (e) {
                error(`Add ${urlArray[index]} ERROR!!`);
            }
        }

        addScript()
    }

    public id(id: String) {
        const gvc = this;
        return `${gvc.parameter.pageConfig!.id}${id}`
    }

    public map(array: string[]) {
        let html = ''
        array.map((d) => {
            html += d
        })
        return html
    }
}


export function init(metaURL: string, fun: (gvc: GVC, glitter: Glitter, gBundle: any) => {
    onCreateView: () => string, onResume?: () => void, onPause?: () => void, onDestroy?: () => void, onCreate?: () => void, cssInitial?: () => string
}) {
    GVC.glitter.share.GVControllerList = GVC.glitter.share.GVControllerList ?? {}
    GVC.glitter.share.GVControllerList[metaURL] = (cf: {
        pageConfig: PageConfig
    }) => {
        const gvc = new GVC()
        gvc.parameter.pageConfig = cf.pageConfig;
        (window as any).clickMap =(window as any).clickMap ?? {};
        (window as any).clickMap[cf.pageConfig.id]=gvc.parameter.clickMap;
        const lifeCycle: LifeCycle = new LifeCycle()
        const pageData = fun(gvc, GVC.glitter, cf.pageConfig.obj)
        lifeCycle.onResume = pageData.onResume ?? lifeCycle.onResume;
        lifeCycle.onPause = pageData.onPause ?? lifeCycle.onPause;
        lifeCycle.onDestroy = pageData.onDestroy ?? lifeCycle.onDestroy;
        lifeCycle.onCreate = pageData.onCreate ?? lifeCycle.onCreate;
        lifeCycle.onCreateView = pageData.onCreateView;
        lifeCycle.cssInitial = pageData.cssInitial ?? lifeCycle.cssInitial
        gvc.recreateView = () => {
            $(`#page${cf.pageConfig.id}`).html(lifeCycle.onCreateView())
        }
        if ($('.page-loading').length > 0) {
            $('.page-loading').remove();
        }
        cf.pageConfig.createResource = () => {
            (window as any).clickMap[cf.pageConfig.id]=gvc.parameter.clickMap
            lifeCycle.onResume()
            lifeCycle.onCreate()
        }
        cf.pageConfig.deleteResource = (destroy: Boolean) => {
            (window as any).clickMap[cf.pageConfig.id] = undefined
            lifeCycle.onPause()
            gvc.parameter.styleLinks.map((dd) => {
                $(`#${dd.id}`).remove()
            })
            gvc.parameter.styleList.map((dd) => {
                $(`#${dd.id}`).remove()
            })
            gvc.parameter.jsList.map((dd) => {
                $(`#${dd.id}`).remove()
            })
            if (destroy) {
                lifeCycle.onDestroy()
            }
        }
        if (cf.pageConfig.type === GVCType.Page) {
            $('#glitterPage').append(`<page-box id="page${cf.pageConfig.id}" style="min-width: 100vw;min-height: 100vh;left: 0;top: 0;width:100vw;
background: ${cf.pageConfig!.backGroundColor};z-index: 9999;overflow: hidden;display:none;">
${lifeCycle.onCreateView()}
</page-box>`)
        } else {

            $('#glitterPage').append(`<page-box id="page${cf.pageConfig.id}" style="min-width: 100vw;min-height: 100vh;left: 0;top: 0;
background: ${cf.pageConfig!.backGroundColor};display: none;z-index:99999;overflow: hidden;position: fixed;width:100vw;height: 100vh;">
${lifeCycle.onCreateView()}
</page-box>`)
        }
        gvc.glitter.setAnimation(cf.pageConfig)
        lifeCycle.onCreate()
        gvc.glitter.defaultSetting.pageLoadingFinish()
        PageManager.setHistory(GVC.glitter.getUrlParameter('page'))
    }
}