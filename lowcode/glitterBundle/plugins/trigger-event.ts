import {HtmlJson} from "./plugin-creater.js"
import {GVC} from "../GVController.js";
import {ShareDialog} from "../../dialog/ShareDialog.js";
import {Glitter} from "../Glitter.js";

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

    public static setEventRouter(original: string, relative:string): (gvc: GVC, widget: HtmlJson, obj: any, subData?: any, element?: { e: any, event: any }) => {
        editor: () => string,
        event: (() => void) | Promise<any>
    } {
        const glitter = (window as any).glitter
        const url=new URL(relative,original)
        url.searchParams.set("original", original)
        return (gvc: GVC, widget: HtmlJson, obj: any, subData?: any, element?: { e: any, event: any }) => {
            const editViewId = glitter.getUUID()
            glitter.share.componentData = glitter.share.componentData ?? {}
            let val: any = glitter.share.componentData[url.href]
            glitter.share.componentCallback = glitter.share.componentCallback ?? {}
            glitter.share.componentCallback[url.href] = glitter.share.componentCallback[url.href] ?? []
            glitter.share.componentCallback[url.href].push((dd: any) => {
                glitter.share.componentData[url.href] = dd
                gvc.notifyDataChange(editViewId)

            })
            gvc.glitter.addMtScript([
                {
                    src: url,
                    type: 'module'
                }
            ], () => {
                val = glitter.share.componentData[url.href]
                console.log('setComponent-->' + url)
            }, () => {
            })
            return {
                event: () => {
                    return new Promise(async (resolve, reject) => {
                        const event = await (new Promise((resolve, reject) => {
                            const timer = setInterval(() => {
                                if (val) {
                                    resolve(val)
                                    clearInterval(timer)
                                }
                            }, 20);
                            setTimeout(() => {
                                clearInterval(timer)
                                resolve(false)
                            }, 3000)
                        }));
                        if (event) {
                            resolve((await val.fun(gvc, widget, obj, subData, element).event()))
                        } else {
                            resolve(false)
                        }
                    })
                },
                editor: () => {
                    return gvc.bindView(() => {
                        return {
                            bind: editViewId,
                            view: () => {
                                if (!val) {
                                    return ``
                                } else {
                                    return val.fun(gvc, widget, obj, subData, element).editor()
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
        const val=fun(glitter)
        let fal=0
        function tryLoop(){
            try{
                let delete2=0;
                glitter.share.componentCallback[url].map((dd:any,index:number)=>{
                    dd(val)
                    delete2=index
                })
                glitter.share.componentCallback[url].splice(0,delete2)
            }catch (e){
                if(fal<10){
                    setTimeout(()=>{
                        tryLoop()
                    },100)
                }
                fal+=1
                console.log('error'+url)
            }
        }
        tryLoop()
        return val;
    }
    public static create(url: string, event: {
        [name: string]: {
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
        const event: { src: string, route: string } = oj.clickEvent.clickEvent
        let returnData = ''

        async function run() {
           return new Promise<boolean>(async (resolve, reject)=>{
               async function pass(){
                   try {
                       setTimeout(()=>{
                           resolve(true)
                       },4000)
                       returnData = await oj.gvc.glitter.share.clickEvent[glitter.htmlGenerate.resourceHook(event.src)][event.route].fun(oj.gvc, oj.widget, oj.clickEvent, oj.subData, oj.element).event()
                       resolve(true)
                   }catch (e){
                       resolve(false)
                   }
               }
               oj.gvc.glitter.share.clickEvent = oj.gvc.glitter.share.clickEvent ?? {}
               if (!oj.gvc.glitter.share.clickEvent[event.src]) {
                   await new Promise((resolve, reject) => {
                       oj.gvc.glitter.addMtScript([
                           {src: `${glitter.htmlGenerate.resourceHook(event.src)}`, type: 'module'}
                       ], () => {
                           pass()
                       }, () => {
                           resolve(false)
                       })
                   })
               }else {
                   pass()
               }
           })
        }


        return new Promise(async (resolve, reject) => {
            let fal=10
            function check(){
                run().then((res)=>{
                    if(res||(fal===0)){
                        resolve(returnData)
                    }else{
                        setTimeout(()=>{
                            fal-=1
                            check()
                        },100)
                    }
                })
            }
           check()

        })
    }

    public static editer(gvc: GVC, widget: HtmlJson, obj: any, option: {
        hover: boolean,
        option: string[],
        title?: string
    } = {hover: false, option: []}) {
        gvc.glitter.share.clickEvent = gvc.glitter.share.clickEvent ?? {}
        const glitter = gvc.glitter
        const selectID = glitter.getUUID()
        return `<div class="mt-2 ${(option.hover) ? `alert alert-primary` : ``}">
 <h3 class="m-0" style="font-size: 16px;">${option.title ?? "點擊事件"}</h3>
 ${
            gvc.bindView(() => {
                return {
                    bind: selectID,
                    view: () => {
                        var select = false
                        return `<select class="form-select m-0 mt-2" onchange="${gvc.event((e) => {
                            if (e.value === 'undefined') {
                                obj.clickEvent = undefined
                            } else {
                                obj.clickEvent = JSON.parse(e.value)
                                obj.clickEvent.src = TriggerEvent.getUrlParameter(obj.clickEvent.src, 'resource') ?? obj.clickEvent.src
                            }
                            gvc.notifyDataChange(selectID)
                        })}">
                        
                        ${gvc.map(Object.keys(glitter.share?.clickEvent || {}).filter((dd) => {
                            return TriggerEvent.getUrlParameter(dd, "resource") !== undefined
                        }).map((key) => {
                            const value = glitter.share.clickEvent[key]
                            return gvc.map(Object.keys(value).map((v2) => {
                                if (option.option.length > 0) {
                                    if (option.option.indexOf(v2) === -1) {
                                        return ``
                                    }
                                }
                                const value2 = value[v2]
                                const selected = JSON.stringify({
                                    src: TriggerEvent.getUrlParameter(key, 'resource') ?? obj.clickEvent.src,
                                    route: v2
                                }) === JSON.stringify(obj.clickEvent)
                                select = selected || select
                                return `<option value='${JSON.stringify({
                                    src: key,
                                    route: v2
                                })}' ${(selected) ? `selected` : ``}>${value2.title}</option>`
                            }))
                        }))
                        }
<option value="undefined"  ${(!select) ? `selected` : ``}>未定義</option>
</select>
${gvc.bindView(() => {
                            const id = glitter.getUUID()
                            setTimeout(()=>{
                                gvc.notifyDataChange(id)
                            },200)
                            return {
                                bind: id,
                                view: () => {
                                    try {
                                        if (!glitter.share.clickEvent[glitter.htmlGenerate.resourceHook(obj.clickEvent.src)]) {
                                            return ``
                                        }
                                        return glitter.share.clickEvent[glitter.htmlGenerate.resourceHook(obj.clickEvent.src)][obj.clickEvent.route].fun(gvc, widget, obj).editor()
                                    } catch (e) {
                                        return ``
                                    }
                                },
                                divCreate: {},
                                onCreate: () => {
                                    glitter.share.clickEvent = glitter.share.clickEvent ?? {}
                                    try {
                                        if (!glitter.share.clickEvent[glitter.htmlGenerate.resourceHook(obj.clickEvent.src)]) {-
                                            glitter.addMtScript([
                                                {
                                                    src: glitter.htmlGenerate.resourceHook(obj.clickEvent.src),
                                                    type: 'module'
                                                }
                                            ], () => {
                                                setTimeout(()=>{
                                                    gvc.notifyDataChange(id)
                                                },200)
                                               
                                            }, () => {
                                                console.log(`loadingError:` + obj.clickEvent.src)
                                            })
                                        }
                                    } catch (e) {
                                    }

                                }
                            }
                        })}
`
                    },
                    divCreate: {}
                }
            })
        }
</div> `
    }
}
