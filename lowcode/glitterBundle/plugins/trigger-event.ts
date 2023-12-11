import {HtmlJson} from "./plugin-creater.js"
import {GVC} from "../GVController.js";
import {Glitter} from "../Glitter.js";
import {Editor} from "./editor.js";

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
                    return new Promise(async (resolve, reject) => {
                        glitter.htmlGenerate.loadEvent(glitter, [
                            {
                                src: url,
                                callback: async (data: any) => {
                                    resolve((await data.fun(gvc, widget, obj, subData, element).event()))
                                }
                            }
                        ])
                    })
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
        const glitter = (window as any).glitter
        const val = fun(glitter)
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
        gvc: GVC, widget: HtmlJson, clickEvent: any, subData?: any, element?: { e: any, event: any }
    }) {
        const glitter = (window as any).glitter
        // const event: { src: string, route: string } = oj.clickEvent.clickEvent
        let arrayEvent: any = []
        let returnData = ''

        async function run(event: any) {
            return new Promise<any>(async (resolve, reject) => {
                let hasRun = false

                async function pass() {
                    if (hasRun) {
                        return
                    } else {
                        hasRun = true
                    }
                    try {
                        const time = new Date()
                        const gvc = oj.gvc
                        const subData = oj.subData
                        const widget = oj.widget
                        let passCommand = false
                        setTimeout(() => {
                            resolve(true)
                        }, 4000)
                        returnData = await oj.gvc.glitter.share.clickEvent[TriggerEvent.getLink(event.clickEvent.src)][event.clickEvent.route].fun(oj.gvc, oj.widget, event, oj.subData, oj.element).event()
                        const response = returnData
                        if (event.dataPlace) {
                            eval(event.dataPlace)
                        }
                        oj.subData=response
                        if (event.blockCommand) {
                            try {
                                if(event.blockCommandV2){
                                    passCommand = eval(`(()=>{
    ${event.blockCommand}
                                    })()`)
                                }else{
                                    passCommand = eval(event.blockCommand)
                                }

                            } catch (e) {
                                alert(event.blockCommandV2)
console.log(e)
                            }
                        }
                        if (passCommand) {
                            resolve("blockCommand")
                        } else {
                            resolve(true)
                        }
                    } catch (e) {
                        returnData = event.errorCode ?? ""
                        resolve(true)
                    }
                }

                let timeOut = new Date()
                let interval: any = 0

                function checkModule() {
                    try {
                        oj.gvc.glitter.share.clickEvent = oj.gvc.glitter.share.clickEvent ?? {}
                        if (!oj.gvc.glitter.share.clickEvent[TriggerEvent.getLink(event.clickEvent.src)]) {
                            oj.gvc.glitter.addMtScript([
                                {src: `${TriggerEvent.getLink(event.clickEvent.src)}`, type: 'module'}
                            ], () => {
                            }, () => {
                                clearInterval(interval)
                                resolve(false)
                            })
                        } else {
                            clearInterval(interval)
                            pass()

                        }
                    } catch (e) {
                        clearInterval(interval)
                        resolve(false)
                    }
                }

                checkModule()
                interval = setInterval(() => {
                    checkModule()
                    //Time out with 4 sec.
                    if (((new Date().getTime()) - timeOut.getTime()) / 1000 > 4) {
                        clearInterval(interval)
                    }
                }, 50)
            })
        }

        if (oj.clickEvent !== undefined && Array.isArray(oj.clickEvent.clickEvent)) {
            // alert('array')
            arrayEvent = oj.clickEvent.clickEvent;
        } else if (oj.clickEvent !== undefined) {

            arrayEvent = [JSON.parse(JSON.stringify(oj.clickEvent))]
        }

        return new Promise(async (resolve, reject) => {
            let result = true
            for (const a of arrayEvent) {
                let blockCommand = false
                result = await new Promise<boolean>((resolve, reject) => {
                    function check() {
                        run(a).then((res) => {
                            if (res === 'blockCommand') {
                                blockCommand = true
                                resolve(true)
                            } else {
                                resolve(res)
                            }

                        })
                    }

                    check()
                })
                if (!result || blockCommand) {
                    break
                }
            }
            resolve(returnData)
        })
    }

    public static editer(gvc: GVC, widget: HtmlJson, obj: any, option: {
        hover: boolean,
        option: string[],
        title?: string
    } = {hover: false, option: []}) {
        const glitter = (window as any).glitter
        if (TriggerEvent.isEditMode()) {
            return glitter.share.editorBridge['TriggerEventBridge'].editer(gvc, widget, obj, option)
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
