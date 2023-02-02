import {GVC} from '../GVController.js';

interface HtmlJson {
    route: string,
    type: string,
    id: string,
    label: string,
    data: any,
    js: string,
    layoutMode?: string,
    class?: string,
    style?: string,
    refreshAll?: () => void,
    refreshComponent?: () => void,
    refreshComponentParameter?: { view1: () => void, view2: () => void }
    refreshAllParameter?: { view1: () => void, view2: () => void },
    expand?: boolean,
    expandStyle?: boolean,
}

export class HtmlGenerate {
    public render: (gvc: GVC, option: { class: string, style: string, divCreate: boolean }) => string;
    public exportJson: (setting: HtmlJson[]) => any;
    public editor: (gvc: GVC, option?: { return_: boolean; refreshAll: (() => void) }) => string;
    public static saveEvent=()=>{
        alert('save')
    }
    public static editeInput(obj: {
        gvc: GVC, title: string,default:string, placeHolder: string, callback: (text: string) => void
    }) {
        return `<h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">${obj.title}</h3>
<input class="form-control" placeholder="${obj.placeHolder}" onchange="${obj.gvc.event((e) => {
            obj.callback(e.value)
        })}" value="${obj.default ?? ""}">`;
    };

    public static editeText(obj: {
        gvc: GVC, title: string,default:string, placeHolder: string, callback: (text: string) => void
    }) {
        return `<h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">${obj.title}</h3>
<textarea class="form-control" placeholder="${obj.placeHolder}" onchange="${obj.gvc.event((e) => {
            obj.callback(e.value)
        })}" style="height: 200px;">${obj.default ?? ""}</textarea>`;
    };

    constructor(setting: HtmlJson[]) {
        setting.map((dd) => {
            dd.refreshAllParameter = dd.refreshAllParameter ?? {
                view1: () => {
                }, view2: () => {
                }
            };
            dd.refreshComponentParameter = dd.refreshComponentParameter ?? {
                view1: () => {
                }, view2: () => {
                }
            };
            dd.refreshAll = () => {
                dd.refreshAllParameter!.view1()
                dd.refreshAllParameter!.view2()
            }
            dd.refreshComponent = () => {
                dd.refreshComponentParameter!.view1()
                dd.refreshComponentParameter!.view2()
            }
            return dd
        })
        this.render = (gvc: GVC, option: { class: string, style: string } = {class: ``, style: ``}) => {
            var loading = true
            const container = gvc.glitter.getUUID()
            gvc.glitter.addMtScript(setting.map((dd) => {
                return dd.js
            }), () => {
                loading = false
                gvc.notifyDataChange(container)
            }, () => {
            })
            return gvc.bindView({
                bind: container,
                view: () => {
                    if (loading) {
                        return ``
                    } else {
                        return gvc.map(setting.map((dd) => {
                            const component = gvc.glitter.getUUID()
                            dd.refreshAllParameter!.view1 = () => {
                                gvc.notifyDataChange(container)
                            }
                            dd.refreshComponentParameter!.view1 = () => {
                                gvc.notifyDataChange(component)
                            }
                            return gvc.bindView({
                                bind: component,
                                view: () => {
                                    return gvc.glitter.share.htmlExtension[dd.route][dd.type](gvc, dd, setting).view
                                },
                                divCreate: {
                                    style: `${gvc.map(["paddingT", "paddingB", "paddingL", "paddingR"].map((d2, index) => {
                                        let k = ["padding-top", "padding-bottom", "padding-left", "padding-right"]
                                        return `${k[index]}:${dd.data[d2] ?? "0"};`
                                    }))}${dd.style ?? ""}`,
                                    class: dd.class ?? ""
                                }
                            })

                        }))
                    }
                },
                divCreate: {class: option.class, style: option.style}
            })
        }
        this.editor = (gvc: GVC, option = {
            return_: false,
            refreshAll: () => {
            }
        }) => {
            var loading = true
            const editContainer = gvc.glitter.getUUID()
            gvc.glitter.addMtScript(setting.map((dd) => {
                return dd.js
            }), () => {
                loading = false
                gvc.notifyDataChange(editContainer)
            }, () => {
            })
            return gvc.bindView({
                bind: editContainer,
                view: () => {
                    if (loading) {
                        return ``
                    } else {
                        return gvc.map(setting.map((dd, index) => {
                            try {
                                const component = gvc.glitter.getUUID()
                                dd.refreshAllParameter!.view2 = () => {
                                    gvc.notifyDataChange(editContainer)
                                }
                                dd.refreshComponentParameter!.view2 = () => {
                                    gvc.notifyDataChange(component)
                                }
                                dd.refreshAll = () => {
                                    dd.refreshAllParameter!.view1()
                                    dd.refreshAllParameter!.view2()
                                    option.refreshAll()
                                }
                                const toggleView = gvc.glitter.getUUID()
                                const toggleEvent = gvc.event(() => {
                                    dd.expand = !dd.expand
                                    gvc.notifyDataChange([toggleView, component])
                                })

                                return `<div style=" ${(option.return_) ? `padding: 10px;` : `padding-bottom: 10px;margin-bottom: 10px;border-bottom: 1px solid lightgrey;`}" class="
${(option.return_) ? `w-100 border rounded bg-dark mt-2` : ``} " >

${gvc.bindView({
                                    bind: toggleView,
                                    view: () => {
                                        return `<div class="d-flex align-items-center" style="${(option.return_ && !dd.expand) ? `` : `margin-bottom: 10px;`};cursor: pointer;" >
<i class="fa-regular fa-circle-minus text-danger me-2" style="font-size: 20px;cursor: pointer;" onclick="${gvc.event(() => {
                                            setting.splice(index, 1)
                                            option.refreshAll()
                                            dd.refreshAll!()
                                        })}"></i>
<h3 style="color: white;font-size: 16px;" class="m-0">${dd.label}</h3>
<div class="flex-fill"></div>
${(option.return_) ? (dd.expand ? `<div style="cursor: pointer;" onclick="${toggleEvent}">收合<i class="fa-solid fa-up ms-2 text-white"></i></div>` : `<div style="cursor: pointer;" onclick="${toggleEvent}">展開<i class="fa-solid fa-down ms-2 text-white"></i></div>\``) : ``}
</div>`
                                    },
                                    divCreate: {}
                                })}

${
                                    gvc.bindView({
                                        bind: component!,
                                        view: () => {
                                            if (option.return_ && !dd.expand) {
                                                return ``
                                            }
                                            return gvc.map([
                                                gvc.bindView(() => {
                                                    const uid = gvc.glitter.getUUID()
                                                    const toggleEvent = gvc.event(() => {
                                                        dd.expandStyle = !dd.expandStyle
                                                        gvc.notifyDataChange(uid)
                                                    })
                                                    return {
                                                        bind: uid,
                                                        view: () => {
                                                            return `<div class="w-100  rounded p-2" style="background-color: #0062c0;">
<div class="w-100 d-flex p-0 align-items-center" onclick="${toggleEvent}" style="cursor: pointer;"><h3 style="font-size: 16px;" class="m-0 p-0">CSS-版面設計</h3>
<div class="flex-fill"></div>
${(dd.expandStyle ? `<div style="cursor: pointer;" >收合<i class="fa-solid fa-up ms-2 text-white"></i></div>` : `<div style="cursor: pointer;">展開<i class="fa-solid fa-down ms-2 text-white"></i></div>\``)}
</div>

<div class="d-flex flex-wrap align-items-center mt-2 ${(dd.expandStyle) ? `` : `d-none`}">
<span class="w-100 mb-2 fw-500" style="color: orange;">間距 [ 單位 : %,PX ]</span>
${
                                                                gvc.map(["上", "下", "左", "右"].map((d2, index) => {
                                                                    let key = ["paddingT", "paddingB", "paddingL", "paddingR"][index]
                                                                    return `<div class="d-flex align-items-center mb-2" style="width: calc(50%);"><span class="mx-2">${d2}</span>
<input class="form-control" value="${dd.data[key] ?? ""}" onchange="${gvc.event((e: any) => {
                                                                        dd.data[key] = e.value
                                                                        option.refreshAll()
                                                                        dd.refreshAll!()
                                                                    })}"></div>`
                                                                }))
                                                            }
<span class="w-100 mb-2 fw-500 mt-2" style="color: orange;">Class</span>
<input class="w-100 form-control" value="${dd.class ?? ""}" onchange="${gvc.event((e) => {
                                                                dd.class = e.value
                                                                option.refreshAll!()
                                                                dd.refreshAll!()
                                                            })}">
<span class="w-100 mb-2 fw-500 mt-2" style="color: orange;">Style</span>
<input class="w-100 form-control"  value="${dd.style ?? ""}" onchange="${gvc.event((e) => {
                                                                dd.style = e.value
                                                                option.refreshAll!()
                                                                dd.refreshAll!()
                                                            })}">
</div></div>`
                                                        },
                                                        divCreate: {}
                                                    }
                                                })
                                                ,
                                                gvc.glitter.share.htmlExtension[dd.route][dd.type](gvc, dd, setting).editor
                                            ])
                                        },
                                        divCreate: {}
                                    })
                                }</div>`
                            } catch (e) {
                                return `資料錯誤`
                            }


                        }))
                    }
                },
                divCreate: {}
            })
        }
        this.exportJson = (setting: HtmlJson[]) => {
            return JSON.stringify(setting)
        }
    }

}