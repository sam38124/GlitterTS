import {Glitter} from "../Glitter.js";
import {GVC} from "../GVController.js";

export interface HtmlJson {
    clickEvent?: {
        src: string,
        route: string
    },
    hashTag: string;
    rout: string,
    type: string,
    id: string,
    label: string,
    data: any,
    js: string,
    refreshAll: () => void,
    refreshComponent: () => void
    styleManager?: (tag: string) => { value: string, editor: (gvc: GVC, title: string) => string }
    refreshView?: () => void,
    refreshEditor?: () => void
    formData?:any
    pageConfig:any;
    appConfig:any,
    global:any
}

export class Plugin {
    constructor() {
    }

    public static create(url: string, fun: (
        glitter: Glitter, editMode: boolean) => {
        [name: string]: {
            defaultData?: any, render: ((gvc: GVC, widget: HtmlJson, setting: any, hoverID: string[], subData?: any, htmlGenerate?: any) => {
                view: () => (Promise<string> | string),
                editor: () => Promise<string> | string
            }) | ((cf: any) => {
                view: () => (Promise<string> | string),
                editor: () => Promise<string> | string
            })
        }
    }): ({
        [name: string]: {
            defaultData?: any, render: ((gvc: GVC, widget: HtmlJson, setting: any, hoverID: string[], subData?: any, htmlGenerate?: any) => {
                view: () => (Promise<string> | string),
                editor: () => Promise<string> | string
            })
        }
    }) {
        const glitter = (window as any).glitter
        glitter.share.htmlExtension[url] = fun(glitter, isEditMode())
        return glitter.share.htmlExtension[url]
    }

    //V1
    public static createComponent(url: string, fun: (
        glitter: Glitter, editMode: boolean) => {
        defaultData?: any, render: ((gvc: GVC, widget: HtmlJson, setting: any, hoverID: string[], subData?: any, htmlGenerate?: any) => {
            view: () => (Promise<string> | string),
            editor: () => Promise<string> | string
        })
    }) {
        const glitter = (window as any).glitter
        const val = fun(glitter, isEditMode())
        glitter.share.htmlExtension[url]=val
        return val;
    }

    public static createViewComponent(url: string, fun: (
        glitter: Glitter, editMode: boolean) => {
        defaultData?: any, render: ((cf: {
            gvc: GVC, widget: HtmlJson, widgetList: HtmlJson[], hoverID: string[], subData?: any, htmlGenerate?: any,formData:any
        }) => {
            view: () => (Promise<string> | string),
            editor: () => Promise<string> | string
        })
    }) {

        const glitter = (window as any).glitter
        const val = fun(glitter, isEditMode())
        glitter.share.htmlExtension[url]=val
        return val;
    }

    public static setComponent(original: string, url: URL): (gvc: GVC, widget: HtmlJson, setting: HtmlJson[], hoverID: string[], subData?: any, htmlGenerate?: any) => {
        view: () => (Promise<string> | string),
        editor: () => Promise<string> | string
    } {
        const glitter = (window as any).glitter
        const fun = (gvc: GVC, widget: HtmlJson, setting: HtmlJson[], hoverID: string[], subData?: any, htmlGenerate?: any) => {
            return {
                view: () => {
                    return gvc.bindView(() => {
                        const tempView = glitter.getUUID()
                        return {
                            bind: tempView,
                            view: () => {
                                return ``
                            },
                            divCreate: {
                                class: ``
                            },
                            onCreate: () => {
                                glitter.htmlGenerate.loadScript(glitter,[
                                    {
                                        src: url.href,
                                        callback:(dd:any)=>{
                                            const target = document.querySelector(`[gvc-id="${gvc.id(tempView)}"]`)
                                            const view = dd.render(gvc, widget, setting, hoverID, subData,htmlGenerate).view()
                                            if (typeof view === 'string') {
                                                target!.outerHTML = view;
                                            } else {
                                                view.then((dd: any) => {
                                                    target!.outerHTML = dd;
                                                })
                                            }
                                        }
                                    }
                                ] )
                            },
                            onDestroy: () => {
                            },
                        }
                    })
                },
                editor: () => {
                    const tempView = glitter.getUUID()
                    return gvc.bindView(() => {
                        return {
                            bind: tempView,
                            view: () => {
                                return ``
                            },
                            divCreate: {
                                class: ``
                            },
                            onCreate: () => {
                                glitter.htmlGenerate.loadScript(glitter,[
                                    {
                                        src: url.href,
                                        callback:(dd:any)=>{
                                            const target = document.querySelector(`[gvc-id="${gvc.id(tempView)}"]`)
                                            const view = dd.render(gvc, widget, setting, hoverID, subData,htmlGenerate).editor()
                                            if (typeof view === 'string') {
                                                target!.outerHTML = view;
                                            } else {
                                                view.then((dd: any) => {
                                                    target!.outerHTML = dd;
                                                })
                                            }
                                        }
                                    }
                                ] )
                            },
                            onDestroy: () => {
                            },
                        }
                    })
                }
            }
        }
        (fun as any).version = 'v1'
        return fun
    }

    public static setViewComponent( url: URL): (cf: any) => {
        view: () => (Promise<string> | string),
        editor: () => Promise<string> | string
    } {
        const glitter = (window as any).glitter
        const fun = (cf: {
            gvc: GVC, widget: HtmlJson, widgetList: HtmlJson[], hoverID: string[], subData?: any, htmlGenerate?: any
        }) => {
            return {
                view: () => {
                    const tempView = glitter.getUUID()
                    return cf.gvc.bindView(() => {
                        return {
                            bind: tempView,
                            view: () => {
                                return ``
                            },
                            divCreate: {
                                class: ``
                            },
                            onCreate: () => {
                                glitter.htmlGenerate.loadScript(glitter,[
                                    {
                                        src: url.href,
                                        callback:(widget:any)=>{
                                            const target = document.querySelector(`[gvc-id="${cf.gvc.id(tempView)}"]`)
                                            const view = widget.render(cf).view()
                                            if (typeof view === 'string') {
                                                target!.outerHTML = view;
                                            } else {
                                                view.then((dd: any) => {
                                                    target!.outerHTML = dd;
                                                })
                                            }
                                        }
                                    }
                                ] )
                            },
                            onDestroy: () => {
                            },
                        }
                    })
                },
                editor: () => {
                    const tempView = glitter.getUUID()
                    return cf.gvc.bindView(() => {
                        return {
                            bind: tempView,
                            view: () => {
                                return ``
                            },
                            divCreate: {
                                class: ``
                            },
                            onCreate: () => {
                                glitter.htmlGenerate.loadScript(glitter,[
                                    {
                                        src: url.href,
                                        callback:(widget:any)=>{
                                            const target = document.querySelector(`[gvc-id="${cf.gvc.id(tempView)}"]`)
                                            const view = widget.render(cf).editor()
                                            if (typeof view === 'string') {
                                                target!.outerHTML = view;
                                            } else {
                                                view.then((dd: any) => {
                                                    target!.outerHTML = dd;
                                                })
                                            }
                                        }
                                    }
                                ] )
                            },
                            onDestroy: () => {
                            },
                        }
                    })
                }
            }
        }
        (fun as any).version = 'v2'
        return fun
    }

    public static async initial(gvc: GVC, set: any[]) {
        for (const a of set) {
            if (!gvc.glitter.share.htmlExtension[a.js]) {
                await new Promise((resolve, reject) => {
                    gvc.glitter.addMtScript([
                        {src: `${a.js}`, type: 'module'}
                    ], () => {
                        resolve(true)
                    }, () => {
                        resolve(false)
                    })
                })
            }
            if (a.type === 'container') {
                await Plugin.initial(gvc, a.data.setting)
            }
        }
        return true
    }

    public static initialConfig(name: string) {
        const glitter = (window as any).glitter
        glitter.lowCodeAPP = glitter.lowCodeAPP ?? {}
        glitter.lowCodeAPP[name] = glitter.lowCodeAPP[name] ?? {}
        glitter.lowCodeAPP[name].config = glitter.lowCodeAPP[name].config ?? {}
    }

    public static getAppConfig(name: string, defaultData: any) {
        const glitter = (window as any).glitter
        Plugin.initialConfig(name)
        Object.keys(defaultData).map((dd) => {
            defaultData[dd] = glitter.lowCodeAPP[name].config[dd] ?? defaultData[dd]
        })
        return defaultData
    }

    public static setAppConfig(name: string, setData: any) {
        const glitter = (window as any).glitter
        Plugin.initialConfig(name)
        Object.keys(setData).map((dd) => {
            glitter.lowCodeAPP[name].config[dd] = setData[dd]
        })
    }


}

function getUrlParameter(url: string, sParam: string): any {
    let sPageURL = url.split("?")[1],
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
}

function isEditMode() {
    try {
        return (window.parent as any).editerData !== undefined
    } catch (e) {
        return false
    }

}