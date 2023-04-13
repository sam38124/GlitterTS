import {GVC} from '../GVController.js';
import {Glitter} from '../Glitter.js';
import {EditorElem} from "../plugins/editor-elem.js";

export interface HtmlJson {
    route: string,
    type: string,
    id: string,
    label: string,
    data: any,
    js: string,
    layoutMode?: string,
    class?: string,
    style?: string,
    css: {
        class: any,
        style: any
    },
    refreshAll?: () => void,
    refreshComponent?: () => void,
    refreshComponentParameter?: { view1: () => void, view2: () => void }
    refreshAllParameter?: { view1: () => void, view2: () => void },
    expand?: boolean,
    expandStyle?: boolean,

    styleManager?: {
        get: (obj:{title: string, tag: string ,def:string}) => string
        editor: (gvc: GVC, array: { [name:string]:{title: string, tag: string ,def:string}},title?:string) => string
    }
    selectStyle: string
}

export class HtmlGenerate {

    public static share: any = {};

    public static resourceHook: (src: string) => string = (src) => {
        return src;
    };
    public render: (gvc: GVC, option?: { class: string, style: string, divCreate?: boolean }) => string;
    public exportJson: (setting: HtmlJson[]) => any;
    public editor: (gvc: GVC, option?: { return_: boolean; refreshAll: (() => void); setting?: any[]; deleteEvent?: (() => void) }) => string;
    public static saveEvent = () => {
        alert('save');
    };
    public static styleEditor(data:any){
        return {
            editor:(gvc:GVC,widget:HtmlJson | (()=>void),title?:string )=>{
               const glitter= (window as any).glitter
                return `
<button type="button" class="btn btn-dark w-100 mt-2" onclick="${
                    gvc.event(()=>{
                        glitter.openDiaLog("glitterBundle/plugins/dialog-style-editor.js","dialog-style-editor",{
                            callback:()=>{
                                if(typeof widget === 'function'){
                                    widget()
                                }else{
                                    (widget as any).refreshComponent()
                                }
                            },
                            data:data
                        })
                    })
                }">${title ?? "設計樣式"}</button>`
            },
            class:()=>{
               return data.class ?? ""
            },
            style:()=>{
                let styleString:string[]=[(data.style as string)];
                (data.styleList ?? []).map((dd:any)=>{
                    Object.keys(dd.data).map((d2)=>{
                        styleString.push([d2,dd.data[d2]].join(":"))
                    })
                })
                return styleString.join(';')
            }
        }
    }
    public static setHome = (obj: {
        page_config?:any
        config: any, editMode?: any, data: any
        tag: string, option?: any
    }) => {
        const glitter = Glitter.glitter;
        glitter.setHome('glitterBundle/plugins/html-render.js', obj.tag, {
            page_config:obj.page_config??{},
            config: obj.config,
            editMode: obj.editMode,
            data: obj.data
        }, obj.option ?? {});
    };
    public static changePage = (obj: {
        config: any, editMode?: any, data: any
        tag: string,
        goBack: boolean, option?: any
    }) => {
        const glitter = Glitter.glitter;
        glitter.changePage('glitterBundle/plugins/html-render.js', obj.tag, obj.goBack, {
            config: obj.config,
            editMode: obj.editMode,
            data: obj.data
        }, obj.option ?? {});
    };

    public static editeInput(obj: {
        gvc: GVC, title: string, default: string, placeHolder: string, callback: (text: string) => void
    }) {
        return `<h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">${obj.title}</h3>
<input class="form-control" placeholder="${obj.placeHolder}" onchange="${obj.gvc.event((e) => {
            obj.callback(e.value);
        })}" value="${obj.default ?? ''}">`;
    };

    public static editeText(obj: {
        gvc: GVC, title: string, default: string, placeHolder: string, callback: (text: string) => void
    }) {
        return `<h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">${obj.title}</h3>
<textarea class="form-control" placeholder="${obj.placeHolder}" onchange="${obj.gvc.event((e) => {
            obj.callback(e.value);
        })}" style="height: 100px;">${obj.default ?? ''}</textarea>`;
    };

    public setting: HtmlJson[];

    constructor(setting: HtmlJson[], hover: string[] = []) {
        this.setting = setting;

        const editContainer = (window as any).glitter.getUUID();
        let lastIndex:any=undefined
        setting.map((dd) => {
            dd.css = dd.css ?? {};
            dd.css.style = dd.css.style ?? {};
            dd.css.class = dd.css.class ?? {};
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
                dd.refreshAllParameter!.view1();
                dd.refreshAllParameter!.view2();
            };
            dd.refreshComponent = () => {
                try {
                    dd.refreshComponentParameter!.view1();
                    dd.refreshComponentParameter!.view2();
                } catch (e: any) {
                    console.log(`${e.message}<br>${e.stack}<br>${e.line}`);
                }

            };
            return dd;
        });
        this.render = (gvc: GVC, option: { class: string, style: string } = {class: ``, style: ``}) => {
            gvc.glitter.share.loaginR = (gvc.glitter.share.loaginR ?? 0) + 1;
            var loading = true;
            const container = gvc.glitter.getUUID();
            gvc.glitter.defaultSetting.pageLoading();
            function getData() {
                async function add(set: any[]) {
                    for (const a of set) {
                        if (!gvc.glitter.share.htmlExtension[gvc.glitter.htmlGenerate.resourceHook(a.js)]) {
                            await new Promise((resolve, reject) => {
                                gvc.glitter.addMtScript([
                                    {src: `${gvc.glitter.htmlGenerate.resourceHook(a.js)}`, type: 'module'}
                                ], () => {
                                    resolve(true);
                                }, () => {
                                    resolve(false);
                                });
                            });
                        }
                        if (a.type === 'container') {
                            await add(a.data.setting);
                        }
                    }
                    return true;
                }

                add(setting).then((data) => {
                    loading = false;
                    gvc.glitter.defaultSetting.pageLoadingFinish();
                    gvc.notifyDataChange(container);
                    gvc.glitter.share.loaginfC = (gvc.glitter.share.loaginfC ?? 0) + 1;
                    console.log('loaging:' + gvc.glitter.share.loaginfC);
                });
            }
            getData();
            return gvc.bindView({
                bind: container,
                view: () => {
                    if (loading) {
                        return ``;
                    } else {
                        return gvc.map(setting.map((dd) => {
                            const component = gvc.glitter.getUUID();
                            dd.refreshAllParameter!.view1 = () => {
                                gvc.notifyDataChange(container);
                            };
                            dd.refreshComponentParameter!.view1 = () => {
                                gvc.notifyDataChange(component);
                            };
                            return gvc.bindView({
                                bind: component,
                                view: () => {
                                    return `${(() => {
                                        try {
                                            return gvc.glitter.share.htmlExtension[gvc.glitter.htmlGenerate.resourceHook(dd.js)][dd.type].render(gvc, dd, setting, hover).view();
                                        } catch (e: any) {
                                            return `解析錯誤:${e.message}<br>${e.stack}<br>${e.line}`;
                                        }
                                    })()}
                                    `;
                                },
                                divCreate: {
                                    style: `
                                    ${gvc.map(['paddingT', 'paddingB', 'paddingL', 'paddingR'].map((d2, index) => {
                                        let k = ['padding-top', 'padding-bottom', 'padding-left', 'padding-right'];
                                        return `${k[index]}:${(dd.data[d2] && dd.data[d2] !== '') ? dd.data[d2] : '0'};`;
                                    }))} 
                                    ${gvc.map(['marginT', 'marginB', 'marginL', 'marginR'].map((d2, index) => {
                                        let k = ['margin-top', 'margin-bottom', 'margin-left', 'margin-right'];
                                        return `${k[index]}:${(dd.data[d2] && dd.data[d2] !== '') ? dd.data[d2] : '0'};`;
                                    }))} ${dd.style ?? ''} ${(hover.indexOf(dd.id) !== -1) ? `border: 4px solid dodgerblue;border-radius: 5px;box-sizing: border-box;` : ``}
                                    `,
                                    class: `position-relative ${dd.class ?? ''}`
                                },
                                onCreate: () => {
                                    if (hover.indexOf(dd.id) !== -1 && lastIndex!==dd.id) {
                                        lastIndex=dd.id
                                        console.log('hover');
                                        gvc.glitter.$('html').get(0).scrollTo({
                                            top: 0,
                                            left: 0,
                                            behavior: 'instant'
                                        });
                                        const scrollTOP = (gvc.glitter.$('#' + gvc.id(component)).offset().top) - (gvc.glitter.$('html').offset().top) + (gvc.glitter.$('html').scrollTop());
                                        gvc.glitter.$('html').get(0).scrollTo({
                                            top: scrollTOP - gvc.glitter.$('html').height() / 2,
                                            left: 0,
                                            behavior: 'instant'
                                        });
                                    }
                                    console.log('onCreate');
                                }
                            });

                        }));
                    }
                },
                divCreate: {class: option.class, style: option.style},
                onCreate: () => {

                }
            });
        };
        this.editor = (gvc: GVC, option = {
            return_: false,
            refreshAll: () => {
            },
            setting: setting,
            deleteEvent: () => {
            }
        }) => {
            var loading = true;
            const oset = this.setting;

            function getData() {
                async function add(set: any[]) {
                    for (const a of set) {
                        if (!gvc.glitter.share.htmlExtension[gvc.glitter.htmlGenerate.resourceHook(a.js)]) {
                            await new Promise((resolve, reject) => {
                                gvc.glitter.addMtScript([
                                    {src: `${gvc.glitter.htmlGenerate.resourceHook(a.js)}`, type: 'module'}
                                ], () => {
                                    resolve(true);
                                }, () => {
                                    resolve(false);
                                });
                            });
                        }
                        if (a.type === 'container') {
                            await add(a.data.setting);
                        }
                    }
                    if (!HtmlGenerate.share.styleEditor) {
                        const glitter=(window as any).glitter
                        await new Promise((resolve, reject) => {
                            glitter.addMtScript([{
                                src: 'glitterBundle/plugins/style-editor.js',
                                type: 'module',
                                id: glitter.getUUID()
                            }
                            ], () => {
                                resolve(true);
                            }, () => {
                                resolve(true);
                            });
                        });

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
                        return gvc.map((option.setting ?? setting).map((dd, index) => {
                            try {
                                const component = gvc.glitter.getUUID();
                                dd.refreshAllParameter = dd.refreshAllParameter ?? {
                                    view1: () => {
                                    }, view2: () => {
                                    }
                                };
                                dd.refreshComponent = () => {
                                    try {

                                        dd.refreshComponentParameter!.view1();
                                        dd.refreshComponentParameter!.view2();
                                    } catch (e: any) {
                                        console.log(`${e.message}<br>${e.stack}<br>${e.line}`);
                                    }

                                };
                                dd.refreshComponentParameter = dd.refreshComponentParameter ?? {
                                    view1: () => {
                                    }, view2: () => {
                                    }
                                };

                                dd.refreshAllParameter!.view2 = () => {
                                    gvc.notifyDataChange(editContainer);
                                };
                                dd.refreshComponentParameter!.view2 = () => {
                                    gvc.notifyDataChange(component);
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
                                return `<div style=" ${(option.return_) ? `padding: 10px;` : `padding-bottom: 10px;margin-bottom: 10px;border-bottom: 1px solid lightgrey;`}" class="
${(option.return_) ? `w-100 border rounded bg-dark mt-2` : ``} " >
${gvc.bindView({
                                    bind: toggleView,
                                    view: () => {
                                        return `<div class="d-flex align-items-center" style="${(option.return_ && !dd.expand) ? `` : `margin-bottom: 10px;`};cursor: pointer;" >
<i class="fa-regular fa-circle-minus text-danger me-2" style="font-size: 20px;cursor: pointer;" onclick="${gvc.event(() => {
                                            function checkDelete(setting: any) {
                                                const index = setting.findIndex((x: any) => x.id === dd.id);
                                                if (index !== -1) {
                                                    setting.splice(index, 1);
                                                } else {
                                                    setting.map((d2: any) => {
                                                        if (d2.type === 'container') {
                                                            checkDelete(d2.data.setting);
                                                        }
                                                    });
                                                }

                                            }

                                            checkDelete(oset);
                                            option.refreshAll!();
                                            dd.refreshAll!();
                                            option.deleteEvent!();
                                        })}"></i>
<h3 style="color: white;font-size: 16px;" class="m-0">${dd.label}</h3>
<div class="flex-fill"></div>
${(option.return_) ? (dd.expand ? `<div style="cursor: pointer;" onclick="${toggleEvent}">收合<i class="fa-solid fa-up ms-2 text-white"></i></div>` : `<div style="cursor: pointer;" onclick="${toggleEvent}">展開<i class="fa-solid fa-down ms-2 text-white"></i></div>\``) : ``}
</div>
${(false) ? HtmlGenerate.editeInput({
                                            gvc: gvc,
                                            title: '模塊資源路徑',
                                            default: dd.js,
                                            placeHolder: '請輸入模塊路徑',
                                            callback: (text) => {
                                                dd.js = text;
                                                option.refreshAll!();
                                                dd.refreshAll!();
                                            }
                                        }) : ``}
`;
                                    },
                                    divCreate: {}
                                })}
${
                                    gvc.bindView({
                                        bind: component!,
                                        view: () => {
                                            if (option.return_ && !dd.expand) {
                                                return ``;
                                            }
                                            try {
                                                return gvc.map([`<div class="alert-dark alert">
<h3 class="text-white  m-1" style="font-size: 16px;">模塊路徑</h3>
<h3 class="text-warning alert-primary  m-1" style="font-size: 14px;">${dd.js}</h3>
<h3 class="text-white  m-1 mt-2" style="font-size: 16px;">函式路徑</h3>
<h3 class="text-warning alert-primary m-1" style="font-size: 14px;">${dd.type}</h3>
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
                                                        }
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
                                                                return   gvc.glitter.htmlGenerate.styleEditor(dd).editor(gvc,()=>{
                                                                    option.refreshAll()
                                                                },"容器設計樣式");
                                                            },
                                                            divCreate: {class: "mt-2"}
                                                        };
                                                    }),
                                                    , gvc.glitter.share.htmlExtension[gvc.glitter.htmlGenerate.resourceHook(dd.js)][dd.type].render(gvc, dd, setting, hover).editor()
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
                                        divCreate: {}
                                    })
                                }</div>`;
                            } catch (e: any) {
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


                        }));
                    }
                },
                divCreate: {},
                onCreate: () => {

                }
            });
        };
        this.exportJson = (setting: HtmlJson[]) => {
            return JSON.stringify(setting);
        };
    }
}

