import {Animation,AnimationConfig} from "./Animation.js";
import {Glitter} from "../Glitter.js";

export class DefaultSetting {
    public pageBgColor: string
    public defaultAnimation: AnimationConfig

    constructor(pageBgColor: string, defaultAnimation: AnimationConfig) {
        this.pageBgColor = pageBgColor
        this.defaultAnimation = defaultAnimation
    }
}

export enum GVCType {
    Page,
    Dialog
}
export class PageConfig {
    public id: string
    public obj: any
    public goBack: boolean
    public src: string
    public tag: string
    public createResource: () => void
    public deleteResource: () => void
    public type: GVCType
    public animation: AnimationConfig

    public getElement(): any {
        return Glitter.glitter.$(`#page${this.id}`)
    }

    constructor(id: string, obj: any, goBack: boolean, src: string, tag: string, createResource: () => void, deleteResource: () => void,
                type: GVCType, animation: AnimationConfig) {
        this.tag = tag
        this.id = id
        this.obj = obj
        this.goBack = goBack
        this.src = src
        this.createResource = createResource
        this.deleteResource = deleteResource
        this.type = type
        this.animation = animation
    }
}

export class PageManager{
    public static hidePageView(id: string, del: boolean = false) {
        const glitter = Glitter.glitter;
        try {
            const index = glitter.pageConfig.map((data) => {
                return data.id
            }).indexOf(id)
            glitter.pageConfig[index].deleteResource()
            if (del) {
                    glitter.$(`#page` + glitter.pageConfig[index].id).remove()
                    glitter.$(`#` + glitter.pageConfig[index].id).remove()
                    glitter.pageConfig.splice(index, 1)
            } else {
                glitter.$(`#page` + glitter.pageConfig[index].id).hide()
                glitter.$(`#` + glitter.pageConfig[index].id).hide()
            }
        } catch (e) {
        }
    }

    public static showPageView(id: string) {
        const glitter = Glitter.glitter;
        try {
            const index = glitter.pageConfig.map((data) => {
                return data.id
            }).indexOf(id)
            glitter.$(`#page` + glitter.pageConfig[index].id).show()
            glitter.$(`#` + glitter.pageConfig[index].id).show()
            glitter.pageConfig[index].createResource()
            glitter.setUrlParameter('page', glitter.pageConfig[index].tag)
        } catch (e) {
        }
    }

    public static hideLoadingView(){
        Glitter.glitter.$('#loadingView').hide();
    }

    public static setHome(url: string, tag: string, obj: any, option: { animation?: AnimationConfig } = {}) {
        const glitter = Glitter.glitter;
        if (glitter.waitChangePage) {
            setTimeout(() => {
                glitter.setHome(url, tag, obj, option)
            }, 100)
        } else {
            glitter.waitChangePage = true
            for (let a = glitter.pageConfig.length - 1; a >= 0; a--) {
                if (glitter.pageConfig[a].type !== GVCType.Dialog) {
                    glitter.hidePageView(glitter.pageConfig[a].id, true)
                }
            }
            const config = new PageConfig(
                glitter.getUUID(),
                obj,
                true,
                url,
                tag,
                () => {
                },
                () => {
                },
                GVCType.Page,
                option.animation ?? glitter.animation.none
            )
            glitter.nowPageConfig = config
            let module = glitter.modelJsList.find((dd) => {
                return dd.src === url
            })
            if (module) {
                module.create(glitter)
                const search = glitter.setSearchParam(glitter.removeSearchParam(glitter.window.location.search, "page"), "page", tag)
                try {
                    glitter.window.history.pushState({}, glitter.document.title, search);
                } catch (e) {
                }
                glitter.pageConfig = []
                glitter.pageConfig.push(config)
                glitter.setUrlParameter('page', tag)
                glitter.waitChangePage = false
            } else {
                glitter.addMtScript([{
                    src: url,
                    type: 'module',
                    id: config.id
                }], () => {
                    const search = glitter.setSearchParam(glitter.removeSearchParam(glitter.window.location.search, "page"), "page", tag)
                    try {
                        glitter.window.history.pushState({}, glitter.document.title, search);
                    } catch (e) {
                    }
                    glitter.pageConfig = []
                    glitter.pageConfig.push(config)
                    glitter.setUrlParameter('page', tag)
                    glitter.waitChangePage = false
                }, () => {
                    console.log("can't find script src:" + url)
                    glitter.waitChangePage = false
                }, {multiple: true})
            }
        }
    };

    public static setLoadingView(link: string) {
        const glitter = Glitter.glitter;
        glitter.$('#loadingView').hide();
        glitter.$('#loadingView').append('<iframe  src="' + link + '" style="width: 100%;height: 100%;background-color: rgba(0, 0, 0, 0.5);"></iframe>');
    }

    public static changePageListener(tag: string){
        const glitter=Glitter.glitter
        for (const data of glitter.changePageCallback) {
            try {
                data(tag)
            } catch (e) {
            }
        }
    }

    public static showLoadingView() {
        Glitter.glitter.$('#loadingView').show();
    };

    public static changeWait = function () {
    };

    public static setAnimation(page: PageConfig) {
        const glitter = Glitter.glitter
        function closePreviousPage() {
            //Only remove page view
            if(page.type === GVCType.Page){
                glitter.pageConfig.map((a) => {
                    if (a.id !== page.id && a.type !== GVCType.Dialog) {
                        glitter.hidePageView(a.id)
                    }
                })
            }
        }
        page.getElement().addClass(`position-absolute`)
        page.getElement().show()
        page.animation.inView(page,()=>{
            closePreviousPage()
            page.getElement().removeClass('position-absolute')
        })
    }

    public static changePage(url: string, tag: string, goBack: boolean, obj: any, option: { animation?: AnimationConfig } = {}) {
        const glitter = Glitter.glitter;
        if (glitter.waitChangePage) {
            setTimeout(() => {
                glitter.changePage(url, tag, goBack, obj, option)
            }, 100)
        } else {
            glitter.waitChangePage = true
            const config = new PageConfig(
                glitter.getUUID(),
                obj,
                true,
                url,
                tag,
                () => {
                },
                () => {
                },
                GVCType.Page,
                option.animation ?? glitter.defaultSetting.defaultAnimation
            )
            glitter.nowPageConfig = config
            let module = glitter.modelJsList.find((dd) => {
                return dd.src === url
            })
            if (module) {
                module.create(glitter)
                const search = glitter.setSearchParam(glitter.removeSearchParam(glitter.window.location.search, "page"), "page", tag)
                glitter.window.history.pushState({}, glitter.document.title, search);
                glitter.pageConfig.push(config)
                glitter.setUrlParameter('page', tag)
                glitter.waitChangePage = false
            } else {
                glitter.addMtScript([{
                    src: url,
                    type: 'module',
                    id: config.id
                }], () => {
                    const search = glitter.setSearchParam(glitter.removeSearchParam(glitter.window.location.search, "page"), "page", tag)
                    glitter.window.history.pushState({}, glitter.document.title, search);
                    glitter.pageConfig.push(config)
                    glitter.waitChangePage = false
                }, () => {
                    console.log("can't find script src:" + url)
                    glitter.waitChangePage = false
                }, {multiple: true})
            }
        }
    }

    public static removePage(tag: string) {
        const pg = Glitter.glitter.pageConfig.find((dd) => {
            return dd.tag === tag
        })
        if (pg) {
            this.hidePageView(pg.id, true)
        }
    };

    public static openDiaLog(url: string, tag: string, obj: any, option: { animation?: AnimationConfig } = {}) {
        const glitter = Glitter.glitter;
        if (glitter.waitChangePage) {
            setTimeout(() => {
                glitter.openDiaLog(url, tag, obj, option)
            }, 100)
        } else {
            glitter.waitChangePage = true
            const config = new PageConfig(
                glitter.getUUID(),
                obj,
                true,
                url,
                tag,
                () => {
                },
                () => {
                },
                GVCType.Dialog,
                option.animation ?? glitter.animation.none
            )
            glitter.nowPageConfig = config
            let module = glitter.modelJsList.find((dd) => {
                return dd.src === url
            })
            if (module) {
                module.create(glitter)
                glitter.pageConfig.push(config)
                glitter.setUrlParameter('dialog', tag)
                glitter.waitChangePage = false
            } else {
                glitter.addMtScript([{
                    src: url,
                    type: 'module',
                    id: config.id
                }], () => {
                    glitter.pageConfig.push(config)
                    glitter.setUrlParameter('dialog', tag)
                    glitter.waitChangePage = false
                }, () => {
                    console.log("can't find script src:" + url)
                    glitter.waitChangePage = false
                }, {multiple: true})

            }
        }

    };

    public static closeDiaLog(tag?: string) {
        const glitter = Glitter.glitter
        if (glitter.waitChangePage) {
            setTimeout(() => {
                glitter.closeDiaLog(tag)
            }, 100)
        } else {
            glitter.waitChangePage = true
            for (let a = glitter.pageConfig.length - 1; a >= 0; a--) {
                if (glitter.pageConfig[a].type === GVCType.Dialog && ((glitter.pageConfig[a].tag === tag) || tag === undefined)) {
                    glitter.hidePageView(glitter.pageConfig[a].id, true)
                }
            }
            glitter.waitChangePage = false
        }
    }

    public static goBack(tag: string | undefined = undefined) {
        const glitter=Glitter.glitter
        if (tag === undefined && glitter.pageConfig.length > 1) {
            const pageHide = glitter.pageConfig[glitter.pageConfig.length - 1]
            const pageShow = glitter.pageConfig[glitter.pageConfig.length - 2]
            if(pageHide.type === GVCType.Dialog){
                this.hidePageView(pageHide.id, true)
                this.showPageView(pageShow.id)
            }else{
                this.showPageView(pageShow.id)
                pageHide.animation.outView(pageHide,()=>{
                    this.hidePageView(pageHide.id, true)
                })
            }
        } else if (glitter.pageConfig.find((dd) => {
            return dd.tag === tag
        })) {
            const pageHide:PageConfig = glitter.pageConfig[glitter.pageConfig.length - 1]
            let pageShow:any =undefined
            for (let a = glitter.pageConfig.length - 1; a >= 0; a--) {
                if (glitter.pageConfig[a].tag == tag) {
                    pageShow=glitter.pageConfig[a]
                    break
                } else if(glitter.pageConfig[a].id !== pageHide.id){
                    this.hidePageView(glitter.pageConfig[a].id , true)
                }
            }
            if(pageHide.type === GVCType.Dialog){
                this.hidePageView(pageHide.id, true)
                this.showPageView(pageShow.id)
            }else{
                this.showPageView(pageShow.id)
                pageHide.animation.outView(pageHide,()=>{
                    this.hidePageView(pageHide.id, true)
                })
            }
        }
    };

    public static goMenu() {
        const glitter=Glitter.glitter
        for (let a = glitter.pageConfig.length - 1; a >= 0; a--) {
            if (a == 0) {
                this.showPageView(glitter.pageConfig[a].id)
                break
            } else {
                this.hidePageView(glitter.pageConfig[a].id, true)
            }
        }
    }

    public static addChangePageListener(callback: (data: string) => void){
        Glitter.glitter.changePageCallback.push(callback)
    }
}