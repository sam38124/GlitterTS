import {HtmlJson} from "./plugin-creater.js"
import {GVC} from "../GVController.js";
import {Glitter} from "../Glitter.js";
import {DynamicCode} from "../../official_event/glitter-util/eval-code-event.js";


export class TriggerEvent {
    public static getUrlParameter(url: string, sParam: string) {
        try {
            let sPageURL = url.split("?")[1], sURLVariables = sPageURL.split('&'), sParameterName, i;
            for (i = 0; i < sURLVariables.length; i++) {
                sParameterName = sURLVariables[i].split('=');
                if (sParameterName[0] === sParam) {
                    return sParameterName[1] === undefined ? undefined : decodeURIComponent(sParameterName[1]);
                }
            }
            return undefined
        } catch (e) {
            return undefined
        }

    }

    public static setEventRouter(original: string, relative: string): (gvc: GVC, widget: HtmlJson, obj: any, subData?: any, element?: { e: any, event: any }) => {
        editor: () => string,
        event: (() => void) | Promise<any>
    } {
        const glitter = (window as any).glitter
        const url = new URL(relative, original).href
        return (gvc: GVC, widget: HtmlJson, obj: any, subData?: any, element?: { e: any, event: any }) => {
            return {
                event: () => {
                    const event_stack = glitter.htmlGenerate.checkEventStore(glitter, url)
                    if (event_stack) {
                        const data = event_stack.fun(gvc, widget, obj, subData, element).event()
                        return data
                    } else {
                        return new Promise((resolve, reject) => {
                            glitter.htmlGenerate.loadEvent(glitter, [
                                {
                                    src: url,
                                    callback: (data: any) => {
                                        const response = data.fun(gvc, widget, obj, subData, element).event()
                                        if (response instanceof Promise) {
                                            response.then((data2: any) => {
                                                resolve(data2)
                                            })
                                        } else {
                                            console.log(`setEventRouter-end-now-${new Date().getTime()}`, response)
                                            resolve(response)
                                        }

                                    }
                                }
                            ])
                        })
                    }

                },
                editor: () => {
                    return gvc.bindView(() => {
                        const editViewId = glitter.getUUID()
                        glitter.htmlGenerate.loadEvent(glitter, [
                            {
                                src: url,
                                callback: (data: any) => {
                                    gvc.notifyDataChange(editViewId)
                                }
                            }
                        ])
                        return {
                            bind: editViewId,
                            view: () => {
                                if (!glitter.share.componentData[url]) {
                                    return ``
                                } else {
                                    return glitter.share.componentData[url].fun(gvc, widget, obj, subData, element).editor()
                                }
                            },
                            divCreate: {}
                        }
                    })
                },
                preload: () => {
                    return new Promise(async (resolve, reject) => {
                        glitter.htmlGenerate.loadEvent(glitter, [
                            {
                                src: url,
                                callback: async (data: any) => {

                                }
                            }
                        ])
                    })
                }
            }
        }

    }

    public static createSingleEvent(url: string, fun: (
        glitter: Glitter) => {
        fun: (gvc: GVC, widget: HtmlJson, obj: any, subData?: any, element?: { e: any, event: any }) => {
            editor: () => string,
            event: (() => void) | Promise<any>
        }
    }) {
        const glitter = (window as any).glitter;
        glitter.share.componentData = glitter.share.componentData ?? {};
        const val = fun(glitter);
        glitter.share.componentData[url] = val
        return val;
    }


    public static create(url: string, event: {
        [name: string]: {
            subContent?: string,
            title: string, fun: (gvc: GVC, widget: HtmlJson, obj: any, subData?: any, element?: { e: any, event: any }) => {
                editor: () => string,
                event: (() => void) | Promise<any>
            }
        }
    }) {
        const glitter = (window as any).glitter
        glitter.share.clickEvent = glitter.share.clickEvent ?? {}
        glitter.share.clickEvent[url] = event
    }


    public static trigger(oj: {
        gvc: GVC, widget: HtmlJson, clickEvent: any, subData?: any, element?: { e: any, event: any },callback?:(data:any)=>void
    }) {

        const glitter = (window as any).glitter
        let arrayEvent: any = []
        let returnData = false

        async function run(event: any) {
            if(!event || !event.clickEvent || !event.clickEvent.src){
                return  false
            }
            const event_router=oj.gvc.glitter.htmlGenerate.checkJsEventStore(glitter,TriggerEvent.getLink(event.clickEvent.src),'clickEvent')
            if(event_router){
                let response = event_router[event.clickEvent.route].fun(oj.gvc, oj.widget, event, oj.subData, oj.element).event()
                if ((response as any) instanceof Promise) {
                    response = await (response as any)
                }
                oj.subData = response
                returnData=response
                return  true
            }else{
                return new Promise<any>(async (resolve, reject) => {
                    async function pass(inter: any) {
                        try {
                            let response = inter[event.clickEvent.route].fun(oj.gvc, oj.widget, event, oj.subData, oj.element).event()
                            if ((response as any) instanceof Promise) {
                                response = await (response as any)
                            }
                            console.log(`returnData-end-${new Date().getTime()}-`, response)
                            oj.subData = response
                            returnData=response
                            resolve(true)
                        } catch (e) {
                            resolve(true)
                        }
                    }

                    try {
                        oj.gvc.glitter.htmlGenerate.loadScript(oj.gvc.glitter, [{
                            src: TriggerEvent.getLink(event.clickEvent.src),
                            callback: (data: any) => {
                                pass(data)
                            }
                        }], 'clickEvent')
                    } catch (e) {
                        resolve(false)
                    }

                })
            }

        }

        if (oj.clickEvent !== undefined && Array.isArray(oj.clickEvent.clickEvent)) {
            // alert('array')
            arrayEvent = oj.clickEvent.clickEvent;
        } else if (oj.clickEvent !== undefined) {

            arrayEvent = [JSON.parse(JSON.stringify(oj.clickEvent))]
        }
        let eventText = JSON.stringify(arrayEvent).replace(/location.href=/g, `(window.glitter).href=`).replace(/`console.log`/g, `glitter.deBugMessage`);
        arrayEvent = JSON.parse(eventText)
        return new Promise(async (resolve, reject) => {
            let result = true
            for (const a of arrayEvent) {
                if(a && a.clickEvent && a.clickEvent.route==='code'){
                    let response=(DynamicCode.fun(oj.gvc, oj.widget, a, oj.subData, oj.element) as any)
                    if ((response as any) instanceof Promise) {
                        response = await (response as any)
                    }
                    oj.subData = response
                    returnData=response
                }else{
                    result = await run(a);
                    if (!result) {
                        break
                    }
                }
            }
            oj.callback && oj.callback(returnData)
            resolve(returnData)
        })
    }

    public static editer(gvc: GVC, widget: HtmlJson, obj: any, option: {
        hover?: boolean,
        option?: string[],
        title?: string
    } = {hover: false, option: []}) {
        option.hover = option.hover ?? false
        option.option = option.option ?? []
        const glitter = (window as any).glitter
        if (TriggerEvent.isEditMode()) {
            if (!glitter.share.editorBridge) {
                return (window.parent as any).glitter.share.editorBridge['TriggerEventBridge'].editer(gvc, widget, obj, option)
            } else {
                return glitter.share.editorBridge['TriggerEventBridge'].editer(gvc, widget, obj, option)
            }

        } else {
            return ``
        }
    }

    public static getLink(url: string) {
        if ((window as any).glitter.htmlGenerate.getResourceLink) {
            return (window as any).glitter.htmlGenerate.getResourceLink(url)
        } else {
            const glitter = (window as any).glitter
            url = glitter.htmlGenerate.resourceHook(url)
            if (!url.startsWith('http') && !url.startsWith('https')) {
                if (TriggerEvent.isEditMode()) {
                    url = new URL(`./${url}`, location.href).href
                } else {
                    url = new URL(`./${url}`, location.href).href
                }
            }
            return url
        }
    }

    public static isEditMode() {
        try {
            return (window.parent as any).editerData !== undefined
        } catch (e) {
            return false
        }

    }
}

const interval = setInterval(() => {
    if ((window as any).glitter) {
        (window as any).glitter.setModule(import.meta.url, TriggerEvent)
        clearInterval(interval)
    }
}, 100)
