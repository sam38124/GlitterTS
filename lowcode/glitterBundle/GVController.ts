"use strict";
import {Glitter} from './Glitter.js';
import {PageConfig, GVCType} from "./module/PageManager.js";


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

    constructor() {
    }
}

export class GVC {
    public glitter = (window as any).glitter as Glitter

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


    public notifyDataChange(id: any) {
        const gvc = this
        const component: any = gvc.getBindViewElem(id)
        try {
            gvc.initialElemCallback(gvc.id(id));
            const refresh = (id: string) => {
                if (!component) {
                    return
                }
                gvc.parameter.bindViewList[id].divCreate = gvc.parameter.bindViewList[id].divCreate ?? {}
                const divCreate = (typeof gvc.parameter.bindViewList[id].divCreate === "function") ? gvc.parameter.bindViewList[id].divCreate() : gvc.parameter.bindViewList[id].divCreate
                component.setAttribute('class', divCreate.class ?? "")
                component.setAttribute('style', divCreate.style ?? "")
                gvc.webComponent.elementCallback[gvc.id(id)].updateAttribute()
                const view=gvc.parameter.bindViewList[id].view()
                gvc.glitter.$(component).html(`${view}`)
                if (gvc.parameter.bindViewList[id].onCreate) {
                    gvc.parameter.bindViewList[id].onCreate()
                }
            };

            function convID() {
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
        return gvc.root.querySelector(`[gvc-id="${gvc.id(id)}"]`)! as any
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
        gvc.webComponent.elementCallback[id] = gvc.webComponent.elementCallback[id] ?? {
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
            { view: () => (string), bind: string, divCreate?: { elem?: string, style?: string, class?: string, option?: { key: string, value: string }[] } | (() => ({ elem?: string, style?: string, class?: string, option?: { key: string, value: string }[] })), dataList?: { obj: any, key: string }[], onCreate?: () => void, onInitial?: () => void }) |
        { view: () => (string), bind: string, divCreate?: { elem?: string, style?: string, class?: string, option?: { key: string, value: string }[] } | (() => ({ elem?: string, style?: string, class?: string, option?: { key: string, value: string }[] })), dataList?: { obj: any, key: string }[], onCreate?: () => void, onInitial?: () => void }
    ): string {
        const gvc = this;

        if (typeof map === "function") {
            map = map()
        }
        gvc.initialElemCallback(gvc.id(map.bind));
        if (map.dataList) {
            map.dataList.map(function (data) {
                gvc.addObserver(data, function () {
                    const component: any = gvc.getBindViewElem((map as any).bind)
                    const view= (map as any).view()
                    gvc.glitter.$(component).html(`${view}`)
                    if ((map as any).onCreate()) {
                        (map as any).onCreate()
                    }
                })
            })
        }

        gvc.parameter.bindViewList[map.bind] = map
        gvc.webComponent.elementCallback[gvc.id(map.bind)].onInitial = (map as any).onInitial ?? (() => {
        })
        gvc.webComponent.elementCallback[gvc.id(map.bind)].onCreate = (map as any).onCreate ?? (() => {
        })
        gvc.webComponent.elementCallback[gvc.id(map.bind)].getView = (map as any).view
        gvc.webComponent.elementCallback[gvc.id(map.bind)].updateAttribute = (() => {
            const component: any = gvc.getBindViewElem((map as any).bind)
            const id = gvc.id(map.bind as string)
            const divCreate2 = (typeof (map as any).divCreate === "function") ? (map as any).divCreate() : (map as any).divCreate;
            (divCreate2.option ?? []).map((dd: any) => {
                try {
                    component.setAttribute(dd.key, dd.value)
                } catch (e) {
                }
            })
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

    public addStyle(style: string) {

        const gvc = this;
        let sl = {
            id: gvc.glitter.getUUID(),
            style: style,
            type:'code'
        }
        if (!gvc.parameter.styleList.find((dd) => {
            return dd.style === style
        })) {
            gvc.webComponent.add_style(sl)
            gvc.parameter.styleList.push(sl)
        }
    }

    public async addStyleLink(fs: string | string[]) {
        const gvc = this;

        function add(filePath: string) {
            const id = gvc.glitter.getUUID()
            if (!gvc.parameter.styleLinks.find((dd) => {
                return dd.src === filePath
            })) {
                const link={
                    id: id,
                    src: filePath,
                    type:'link'
                }
                gvc.parameter.styleLinks.push(link)
                gvc.webComponent.add_style(link)
            }
        }
        if (typeof fs === 'string') {
            add(fs)
        } else {
            fs.map((dd) => {
                add(dd)
            })
        }

    }

    public addMtScript= this.glitter.addMtScript

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

    public get root() {
        return document.getElementById('page' + this.parameter.pageConfig!.id)!.shadowRoot!
    }

    public get webComponent(){
        return (document.getElementById('page' + this.parameter.pageConfig!.id)! as any)
    }

}


export function init(fun: (gvc: GVC, glitter: Glitter, gBundle: any) => {
    onCreateView: () => string, onResume?: () => void, onPause?: () => void, onDestroy?: () => void, onCreate?: () => void, cssInitial?: () => string
}, gt?: Glitter) {
    const glitter: Glitter = (gt) ?? ((window as any).glitter as Glitter)
    const gvc = new GVC();
    gvc.glitter = glitter;
    gvc.parameter.pageConfig = glitter.nowPageConfig
    const pageData = fun(gvc, glitter, glitter.nowPageConfig?.obj)
    if (!glitter.modelJsList.find((data) => {
        return data.src === glitter.nowPageConfig?.src
    })) {
        glitter.modelJsList.push({
            src: glitter.nowPageConfig!.src,
            create: (glitter: Glitter) => {
                init(fun, ((window as any).glitter as Glitter))
            }
        })
    }
    const lifeCycle: LifeCycle = new LifeCycle()
    lifeCycle.onResume = pageData.onResume ?? lifeCycle.onResume;
    lifeCycle.onPause = pageData.onPause ?? lifeCycle.onPause;
    lifeCycle.onDestroy = pageData.onDestroy ?? lifeCycle.onDestroy;
    lifeCycle.onCreate = pageData.onCreate ?? lifeCycle.onCreate;
    lifeCycle.onCreateView = pageData.onCreateView;
    lifeCycle.cssInitial = pageData.cssInitial ?? lifeCycle.cssInitial
    const body = document.getElementById('page' + gvc.parameter.pageConfig!.id)!.shadowRoot!.querySelector('body')!
    gvc.recreateView = () => {
        body.innerHTML = lifeCycle.onCreateView()
    }
    if ($('.page-loading').length > 0) {
        $('.page-loading').remove();
    }
    (window as any).clickMap = (window as any).clickMap ?? {}
    switch (gvc.parameter.pageConfig?.type) {
        case GVCType.Dialog:
            $(body).html(lifeCycle.onCreateView())
            glitter.setAnimation(gvc.parameter.pageConfig)
            break
        case GVCType.Page:
            $(body).html(lifeCycle.onCreateView())
            glitter.setAnimation(gvc.parameter.pageConfig)
            break
    }
    (window as any).clickMap[gvc.parameter.pageConfig!.id] = gvc.parameter.clickMap;
    lifeCycle.onCreate();
    gvc.parameter.pageConfig!.deleteResource = (destroy: Boolean) => {
        (window as any).clickMap[gvc.parameter.pageConfig!.id] = undefined
        lifeCycle.onPause()
        if (destroy) {
            lifeCycle.onDestroy()
        }
    }

}
