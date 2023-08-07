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
        const url = new URL(relative, original)
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
        const val = fun(glitter)
        let fal = 0

        function tryLoop() {
            try {
                let delete2 = 0;
                glitter.share.componentCallback[url].map((dd: any, index: number) => {
                    dd(val)
                    delete2 = index
                })
                glitter.share.componentCallback[url].splice(0, delete2)
            } catch (e) {
                if (fal < 10) {
                    setTimeout(() => {
                        tryLoop()
                    }, 100)
                }
                fal += 1
                // console.log('error' + url)
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
        // const event: { src: string, route: string } = oj.clickEvent.clickEvent
        let arrayEvent: any = []
        let returnData = ''

        async function run(event: any) {
            return new Promise<any>(async (resolve, reject) => {
                async function pass() {
                    try {
                        const gvc = oj.gvc
                        const subData = oj.subData
                        const widget = oj.widget
                        let passCommand = false
                        setTimeout(() => {
                            resolve(true)
                        }, 4000)
                        returnData = await oj.gvc.glitter.share.clickEvent[glitter.htmlGenerate.resourceHook(event.clickEvent.src)][event.clickEvent.route].fun(oj.gvc, oj.widget, event, oj.subData, oj.element).event()
                        const response = returnData
                        if (event.dataPlace) {
                            eval(event.dataPlace)
                        }
                        if (event.blockCommand) {
                            try {
                                passCommand = eval(event.blockCommand)
                            } catch (e) {
                            }
                        }
                        if(passCommand){
                            resolve("blockCommand")
                        }else{
                            resolve(true)
                        }

                    } catch (e) {
                        returnData = event.errorCode ?? ""
                        resolve(true)
                    }
                }

                try {
                    oj.gvc.glitter.share.clickEvent = oj.gvc.glitter.share.clickEvent ?? {}
                    if (!oj.gvc.glitter.share.clickEvent[event.clickEvent.src]) {
                        await new Promise((resolve, reject) => {
                            oj.gvc.glitter.addMtScript([
                                {src: `${glitter.htmlGenerate.resourceHook(event.clickEvent.src)}`, type: 'module'}
                            ], () => {
                                pass()
                            }, () => {
                                resolve(false)
                            })
                        })
                    } else {
                        pass()
                    }
                } catch (e) {
                    pass()
                }

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
                let blockCommand=false
                result = await new Promise<boolean>((resolve, reject) => {
                    let fal = 10
                    function check() {
                        run(a).then((res) => {
                            if(res==='blockCommand'){
                                blockCommand=true
                                resolve(true)
                            }else{
                                if (res || (fal === 0)) {
                                    resolve(res)
                                } else {
                                    setTimeout(() => {
                                        fal -= 1
                                        check()
                                    }, 100)
                                }
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
        // return ``
        return `
<div class="w-100">
<button class="btn btn-warning border-white mt-2 w-100 text-dark" onclick="${gvc.event(() => {
            const tag = gvc.glitter.getUUID();
            gvc.glitter.share.clickEvent = gvc.glitter.share.clickEvent ?? {}
            const glitter = gvc.glitter
            let arrayEvent: any[] = []
            if (obj.clickEvent !== undefined && Array.isArray(obj.clickEvent)) {
                arrayEvent = obj.clickEvent
            } else if (obj.clickEvent !== undefined) {
                arrayEvent = [JSON.parse(JSON.stringify(obj))]
            }
            obj.clickEvent = arrayEvent;
            (window as any).glitter.innerDialog((gvc: GVC) => {
                return gvc.bindView(() => {
                    const did = glitter.getUUID()
                    return {
                        bind: did,
                        view: () => {
                            return ` <div class="w-100 d-flex align-items-center border-bottom justify-content-center position-relative" style="height: 68px;">
        <h3 class="modal-title fs-4">事件叢集設定</h3>
        <i class="fa-solid fa-xmark text-dark position-absolute " style="font-size:20px;transform: translateY(-50%);right: 20px;top: 50%;cursor: pointer;"
        onclick="${gvc.event(() => {
                                glitter.closeDiaLog(tag);
                            })}"></i>
</div>    

<div class="mt-2 border border-white p-2">
<div class="alert alert-info " style="white-space:normal;">
透過事件來為您的元件添加觸發事件，包含連結跳轉/內容取得/資料儲存/頁面渲染/動畫事件/內容發布....等，都能透過事件來完成．
</div>
${Editor.arrayItem({
                                originalArray: arrayEvent,
                                gvc: gvc,
                                title: '事件集',
                                array: arrayEvent.map((obj: any, index: number) => {
                                    return {
                                        title: `第${index + 1}個觸發事件`,
                                        expand: obj,
                                        innerHtml: () => {
                                            const selectID = glitter.getUUID()
                                            return gvc.bindView(() => {
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
<div class="mt-2">${(() => {
                                                            obj.pluginExpand = obj.pluginExpand ?? {}
                                                            return Editor.toggleExpand({
                                                                gvc: gvc,
                                                                title: "<span class='text-black' style=''>插件拓展項目</span>",
                                                                data: obj.pluginExpand,
                                                                innerText: () => {
                                                                    return gvc.bindView(() => {
                                                                        const id = glitter.getUUID()
                                                                        setTimeout(() => {
                                                                            gvc.notifyDataChange(id)
                                                                        }, 200)
                                                                        return {
                                                                            bind: id,
                                                                            view: () => {
                                                                                try {
                                                                                    let text = ``
                                                                                    if (!glitter.share.clickEvent[glitter.htmlGenerate.resourceHook(obj.clickEvent.src)]) {
                                                                                        text = ``
                                                                                    } else {
                                                                                        text = glitter.share.clickEvent[glitter.htmlGenerate.resourceHook(obj.clickEvent.src)][obj.clickEvent.route].fun(gvc, widget, obj).editor()
                                                                                    }
                                                                                    if (text.replace(/ /g, '') === '') {
                                                                                        return `<span>此事件無設定拓展項目</span>`
                                                                                    }
                                                                                    return text
                                                                                } catch (e) {
                                                                                    return ``
                                                                                }
                                                                            },
                                                                            divCreate: {},
                                                                            onCreate: () => {
                                                                                glitter.share.clickEvent = glitter.share.clickEvent ?? {}
                                                                                try {
                                                                                    if (!glitter.share.clickEvent[glitter.htmlGenerate.resourceHook(obj.clickEvent.src)]) {
                                                                                        -
                                                                                            glitter.addMtScript([
                                                                                                {
                                                                                                    src: glitter.htmlGenerate.resourceHook(obj.clickEvent.src),
                                                                                                    type: 'module'
                                                                                                }
                                                                                            ], () => {
                                                                                                setTimeout(() => {
                                                                                                    gvc.notifyDataChange(id)
                                                                                                }, 200)

                                                                                            }, () => {
                                                                                                console.log(`loadingError:` + obj.clickEvent.src)
                                                                                            })
                                                                                    }
                                                                                } catch (e) {
                                                                                }

                                                                            }
                                                                        }
                                                                    })
                                                                },
                                                                class: ` `,
                                                                style: `background:#65379B;border:2px solid white;`,
                                                            })
                                                        })()}</div>
${(() => {
                                                            obj.dataPlaceExpand = obj.dataPlaceExpand ?? {}
                                                            obj.errorPlaceExpand = obj.errorPlaceExpand ?? {}
                                                            obj.blockExpand = obj.blockExpand ?? {}
                                                            return `<div class="mt-2 border-white rounded" style="border-width:3px;">
${Editor.toggleExpand({
                                                                gvc: gvc,
                                                                title: "<span class='text-black' style=''>返回事件</span>",
                                                                data: obj.dataPlaceExpand,
                                                                innerText: () => {
                                                                    return glitter.htmlGenerate.editeText({
                                                                        gvc: gvc,
                                                                        title: "",
                                                                        default: obj.dataPlace ?? "",
                                                                        placeHolder: `執行事件或儲存返回資料:
範例:
 (()=>{
   //將資料儲存於當前頁面．
   gvc.saveData=response;
   //將資料儲存於全域變數中
   glitter.share.saveData=response
     })()`,
                                                                        callback: (text: string) => {
                                                                            obj.dataPlace = text
                                                                            widget.refreshComponent()
                                                                        }
                                                                    })
                                                                },
                                                                class: ` `,
                                                                style: `background:#65379B;border:2px solid white;`,
                                                            })}
</div>` + `<div class="mt-2 border-white rounded" style="border-width:3px;">${Editor.toggleExpand({
                                                                gvc: gvc,
                                                                title: "<span class='text-black' style=''>異常返回值</span>",
                                                                data: obj.errorPlaceExpand,
                                                                innerText: () => {
                                                                    return glitter.htmlGenerate.editeInput({
                                                                        gvc: gvc,
                                                                        title: "",
                                                                        default: obj.errorCode ?? "",
                                                                        placeHolder: `請輸入參數值`,
                                                                        callback: (text: string) => {
                                                                            obj.errorCode = text
                                                                            widget.refreshComponent()
                                                                        }
                                                                    })
                                                                },
                                                                class: ` `,
                                                                style: `background:#65379B;border:2px solid white;`,
                                                            })}</div>` + `<div class="mt-2 border-white rounded" style="border-width:3px;">
${Editor.toggleExpand({
                                                                gvc: gvc,
                                                                title: "<span class='text-black' style=''>中斷指令</span>",
                                                                data: obj.blockExpand,
                                                                innerText: () => {
                                                                    return glitter.htmlGenerate.editeText({
                                                                        gvc: gvc,
                                                                        title: "",
                                                                        default: obj.blockCommand ?? "",
                                                                        placeHolder: `返回true則中斷指令不往下繼續執行:
範例:
 (()=>{
  return gvc.getBundle()['identify']==='';
     })()`,
                                                                        callback: (text: string) => {
                                                                            obj.blockCommand = text
                                                                            widget.refreshComponent()
                                                                        }
                                                                    })
                                                                },
                                                                class: ` `,
                                                                style: `background:#65379B;border:2px solid white;`,
                                                            })}
</div>`
                                                        })()}

`
                                                    },
                                                    divCreate: {}
                                                }
                                            })
                                        },
                                        minus: gvc.event(() => {
                                            arrayEvent.splice(index, 1);
                                            gvc.notifyDataChange(did)
                                        }),
                                    };
                                }),
                                expand: {expand: true},
                                plus: {
                                    title: '添加事件',
                                    event: gvc.event(() => {
                                        arrayEvent.push({});
                                        gvc.notifyDataChange(did)
                                    }),
                                },
                                refreshComponent: () => {
                                    gvc.recreateView()
                                }
                            })}
</div>
<div class="d-flex border-top py-2 px-2 justify-content-end">
<button class="btn btn-warning d-flex align-items-center text-dark" onclick="${gvc.event(() => {
                                glitter.closeDiaLog(tag);
                            })}"><i class="fa-solid fa-floppy-disk me-2"></i>儲存</button>
</div>
`
                        },
                        divCreate: {
                            class: `m-auto bg-white shadow rounded overflow-auto`,
                            style: `max-width: 100%;max-height: calc(100% - 20px);width:700px;`
                        }
                    }
                })

            }, tag)
        })}">${option.title ?? "觸發事件"}</button>
</div>

`
    }
}
