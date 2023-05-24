import {Animation, AnimationConfig} from './Animation.js';
import {Glitter} from '../Glitter.js';

export class DefaultSetting {
    public pageBgColor: string;
    public pageAnimation: AnimationConfig;
    public dialogAnimation: AnimationConfig;

    public pageLoading = () => {
    };
    public pageLoadingFinish = () => {
    };

    constructor(obj: {
        pageBgColor: string,
        pageAnimation: AnimationConfig,
        dialogAnimation: AnimationConfig,
        pageLoading: () => void,
        pageLoadingFinish: () => void
    }) {
        this.pageLoading = obj.pageLoading;
        this.pageLoadingFinish = obj.pageLoadingFinish;
        this.pageBgColor = obj.pageBgColor;
        this.pageAnimation = obj.pageAnimation;
        this.dialogAnimation = obj.dialogAnimation;
    }
}

export enum GVCType {
    Page,
    Dialog
}

export class PageConfig {
    public id: string;
    public obj: any;
    public goBack: boolean;
    public src: string;
    public tag: string;
    public createResource: () => void;
    public deleteResource: () => void;
    public type: GVCType;
    public animation: AnimationConfig;
    public backGroundColor: string;
    public scrollTop: number=0;

    public getElement(): any {
        return Glitter.glitter.$(`#page${this.id}`);
    }

    constructor(par: {
        id: string, obj: any, goBack: boolean, src: string, tag: string, createResource: () => void, deleteResource: () => void,
        type: GVCType, animation: AnimationConfig, backGroundColor: string
    }) {
        this.tag = par.tag;
        this.id = par.id;
        this.obj = par.obj;
        this.goBack = par.goBack;
        this.src = par.src;
        this.createResource = par.createResource;
        this.deleteResource = par.deleteResource;
        this.type = par.type;
        this.animation = par.animation;
        this.backGroundColor = par.backGroundColor;
    }
}

export class PageManager {

    public static hidePageView(id: string, del: boolean = false) {
        const glitter = Glitter.glitter;
        try {
            const index = glitter.pageConfig.map((data) => {
                return data.id;
            }).indexOf(id);
            if (del) {
                glitter.pageConfig[index].deleteResource();
                glitter.$(`#page` + glitter.pageConfig[index].id).remove();
                glitter.$(`#` + glitter.pageConfig[index].id).remove();
                glitter.pageConfig.splice(index, 1);
            } else {
                glitter.$(`#page` + glitter.pageConfig[index].id).hide();
                glitter.$(`#` + glitter.pageConfig[index].id).hide();
            }
        } catch (e) {
        }
    }

    public static showPageView(id: string) {
        const glitter = Glitter.glitter;
        try {
            const index = glitter.pageConfig.map((data) => {
                return data.id;
            }).indexOf(id);
            glitter.$(`#page` + glitter.pageConfig[index].id).show();
            glitter.$(`#` + glitter.pageConfig[index].id).show();
            glitter.pageConfig[index].createResource();
            glitter.setUrlParameter('page', glitter.pageConfig[index].tag);
            if(glitter.pageConfig[index].type === GVCType.Page){
                Glitter.glitter.$('html').stop().animate({scrollTop:glitter.pageConfig[index].scrollTop});
            }
            //
            //
            // console.log('scrollTop'+glitter.pageConfig[index].scrollTop)
        } catch (e) {
        }
    }

    public static hideLoadingView() {
        Glitter.glitter.$('#loadingView').hide();
    }

    public static setHome(url: string, tag: string, obj: any, option: { animation?: AnimationConfig, backGroundColor?: string } = {}) {
        const glitter = Glitter.glitter;
        if (glitter.waitChangePage || PageManager.clock.stop() < 300) {
            setTimeout(() => {
                glitter.setHome(url, tag, obj, option);
            }, 100);
        } else {
            glitter.defaultSetting.pageLoading();
            PageManager.clock.zeroing();
            glitter.waitChangePage = true;
            for (let a = glitter.pageConfig.length - 1; a >= 0; a--) {
                if (glitter.pageConfig[a].type !== GVCType.Dialog) {
                    glitter.hidePageView(glitter.pageConfig[a].id, true);
                }
            }
            const config = new PageConfig(
                {
                    id: glitter.getUUID(),
                    obj: obj,
                    goBack: true,
                    src: url,
                    tag: tag,
                    deleteResource: () => {
                    },
                    createResource: () => {
                    },
                    backGroundColor: option.backGroundColor ?? 'white',
                    type: GVCType.Page,
                    animation: option.animation ?? glitter.animation.none
                }
            );
            $('#glitterPage').append(`<div id="page${config!.id}" style="min-width: 100vw;min-height: 100vh;left: 0;top: 0;
background: ${config!.backGroundColor};display: none;z-index: 999999;overflow: hidden;">
</div>`)
            glitter.nowPageConfig = config;
            let module = glitter.modelJsList.find((dd) => {
                return `${dd.src}` == url;
            });
            if (module) {
                module.create(glitter);
                const search = glitter.setSearchParam(glitter.removeSearchParam(glitter.window.location.search, 'page'), 'page', tag);
                try {
                    glitter.window.history.pushState({}, glitter.document.title, search);
                } catch (e) {
                }
                glitter.pageConfig = [];
                glitter.pageConfig.push(config);
                glitter.setUrlParameter('page', tag);

            } else {
                glitter.addMtScript([{
                    src: url,
                    type: 'module',
                    id: config.id
                }], () => {
                    const search = glitter.setSearchParam(glitter.removeSearchParam(glitter.window.location.search, 'page'), 'page', tag);
                    try {
                        glitter.window.history.pushState({}, glitter.document.title, search);
                    } catch (e) {
                    }
                    glitter.pageConfig = [];
                    glitter.pageConfig.push(config);
                    glitter.setUrlParameter('page', tag);

                }, () => {
                    console.log('can\'t find script src:' + url);
                    glitter.waitChangePage = false;
                }, {multiple: true});
            }
        }
    };

    public static setLoadingView(link: string) {
        const glitter = Glitter.glitter;
        glitter.$('#loadingView').hide();
        glitter.$('#loadingView').append('<iframe  src="' + link + '" style="width: 100%;height: 100%;background-color: rgba(0, 0, 0, 0.5);"></iframe>');
    }

    public static changePageListener(tag: string) {
        const glitter = Glitter.glitter;
        for (const data of glitter.changePageCallback) {
            try {
                data(tag);
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
        const glitter = Glitter.glitter;

        // glitter.$('html').scrollTop(0);
        function closePreviousPage() {
            //Only remove page view
            if (page.type === GVCType.Page) {
                glitter.pageConfig.map((a) => {
                    if (a.id !== page.id && a.type !== GVCType.Dialog) {
                        glitter.hidePageView(a.id);
                    }
                });
            }
        }
        page.getElement().addClass(`position-fixed`);
        page.getElement().show();
        glitter.defaultSetting.pageLoadingFinish();
        // page.scrollTop = glitter.$('html').get(0).scrollTop;
        page.animation.inView(page, () => {
            closePreviousPage();
            page.getElement().removeClass('position-fixed');
            glitter.waitChangePage = true;
            setTimeout(() => {
                glitter.waitChangePage = false;
                if(page.type===GVCType.Page){
                    let lastPage:any=glitter.pageConfig.filter((a) => {
                        return a.type !== GVCType.Dialog
                    });
                    lastPage=lastPage[lastPage.length-2]
                    if(lastPage){
                        lastPage.scrollTop = glitter.$('html').get(0).scrollTop;
                        console.log('lastPage.scrollTop:'+lastPage.scrollTop)
                    }
                    console.log('scrollTop--'+page)
                    glitter.$('html').stop().animate({scrollTop: 0 }, 0);
                }
            }, 100);
        });
    }

    public static clock = {
        start: new Date(),
        stop: function () {
            return ((new Date()).getTime() - (this.start).getTime());
        },
        zeroing: function () {
            this.start = new Date();
        }
    };

    public static changePage(url: string, tag: string, goBack: boolean, obj: any, option: { animation?: AnimationConfig, backGroundColor?: string } = {}) {
        const glitter = Glitter.glitter;

        if (glitter.waitChangePage || PageManager.clock.stop() < 300) {
            setTimeout(() => {
                glitter.changePage(url, tag, goBack, obj, option);
            }, 100);
        } else {
            glitter.defaultSetting.pageLoading();
            PageManager.clock.zeroing();
            glitter.waitChangePage = true;
            const config = new PageConfig(
                {
                    id: glitter.getUUID(),
                    obj: obj,
                    goBack: goBack,
                    src: url,
                    tag: tag,
                    deleteResource: () => {
                    },
                    createResource: () => {
                    },
                    backGroundColor: option.backGroundColor ?? 'white',
                    type: GVCType.Page,
                    animation: option.animation ?? glitter.defaultSetting.pageAnimation
                }
            );
            $('#glitterPage').append(`<div  id="page${config.id}" style="width:100vw;height:100vh;
background: transparent;background: ${config!.backGroundColor};display: none;position: absolute;top: 0;left: 0;z-index: 999999;overflow: hidden;">
</div>`)
            config.scrollTop=glitter.$('html').get(0).scrollTop
            glitter.nowPageConfig = config;
            let module = glitter.modelJsList.find((dd) => {
                return `${dd.src}` == url;
            });
            if (module) {
                const search = glitter.setSearchParam(glitter.removeSearchParam(glitter.window.location.search, 'page'), 'page', tag);
                glitter.window.history.pushState({}, glitter.document.title, search);
                glitter.pageConfig.push(config);
                glitter.setUrlParameter('page', tag);
                module.create(glitter);
            } else {
                glitter.addMtScript([{
                    src: url,
                    type: 'module',
                    id: config.id
                }], () => {
                    const search = glitter.setSearchParam(glitter.removeSearchParam(glitter.window.location.search, 'page'), 'page', tag);
                    glitter.window.history.pushState({}, glitter.document.title, search);
                    glitter.pageConfig.push(config);
                }, () => {
                    console.log('can\'t find script src:' + url);
                    glitter.waitChangePage = false;
                }, {multiple: true});
            }
        }
    }

    public static removePage(tag: string) {
        const pg = Glitter.glitter.pageConfig.find((dd) => {
            return dd.tag === tag;
        });
        if (pg) {
            this.hidePageView(pg.id, true);
        }
    };

    public static openDiaLog(url: string, tag: string, obj: any, option: { animation?: AnimationConfig, backGroundColor?: string } = {}) {
        const glitter = Glitter.glitter;
        if (glitter.waitChangePage || PageManager.clock.stop() < 300) {
            setTimeout(() => {
                glitter.openDiaLog(url, tag, obj, option);
            }, 100);
        } else {
            PageManager.clock.zeroing();
            glitter.waitChangePage = true;
            const config = new PageConfig(
                {
                    id: glitter.getUUID(),
                    obj: obj,
                    goBack: true,
                    src: url,
                    tag: tag,
                    deleteResource: () => {
                    },
                    createResource: () => {
                    },
                    backGroundColor: option.backGroundColor ?? 'transparent',
                    type: GVCType.Dialog,
                    animation: option.animation ?? glitter.defaultSetting.dialogAnimation
                }
            );
            $('#glitterPage').append(`<div id="page${config!.id}" style="min-width: 100vw;min-height: 100vh;left: 0;top: 0;
background: ${config!.backGroundColor};display: none;z-index: 999999;overflow: hidden;position: fixed;width:100vw;height: 100vh;" >
</div>`)
            glitter.nowPageConfig = config;

            let module = glitter.modelJsList.find((dd) => {
                return `${dd.src}` == url;
            });
            if (module) {
                module.create(glitter);
                glitter.pageConfig.push(config);
                glitter.setUrlParameter('dialog', tag);
            } else {
                glitter.addMtScript([{
                    src: url,
                    type: 'module',
                    id: config.id
                }], () => {
                    glitter.pageConfig.push(config);
                    glitter.setUrlParameter('dialog', tag);

                }, () => {
                    console.log('can\'t find script src:' + url);
                    glitter.waitChangePage = false;
                }, {multiple: true});

            }
        }

    };

    public static closeDiaLog(tag?: string) {
        const glitter = Glitter.glitter;
        if (glitter.waitChangePage || PageManager.clock.stop() < 300) {
            setTimeout(() => {
                glitter.closeDiaLog(tag);
            }, 100);
        } else {
            PageManager.clock.zeroing();
            glitter.waitChangePage = true;
            for (let a = glitter.pageConfig.length - 1; a >= 0; a--) {
                if (glitter.pageConfig[a].type === GVCType.Dialog && ((glitter.pageConfig[a].tag === tag) || tag === undefined)) {
                    glitter.pageConfig[a].animation.outView(glitter.pageConfig[a], () => {
                        this.hidePageView(glitter.pageConfig[a].id, true);
                    });
                }
            }
            glitter.waitChangePage = false;

        }
    }

    public static goBack(tag: string | undefined = undefined) {
        const glitter = Glitter.glitter;
        if (tag === undefined && glitter.pageConfig.length > 1) {
            const pageHide = glitter.pageConfig[glitter.pageConfig.length - 1];
            const pageShow = glitter.pageConfig[glitter.pageConfig.length - 2];
            if (pageHide.type === GVCType.Dialog) {
                this.hidePageView(pageHide.id, true);
                this.showPageView(pageShow.id);
            } else {
                this.showPageView(pageShow.id);
                pageHide.animation.outView(pageHide, () => {
                    this.hidePageView(pageHide.id, true);
                });
            }
        } else if (glitter.pageConfig.find((dd) => {
            return dd.tag === tag;
        })) {
            const pageHide: PageConfig = glitter.pageConfig[glitter.pageConfig.length - 1];
            let pageShow: any = undefined;
            for (let a = glitter.pageConfig.length - 1; a >= 0; a--) {
                if (glitter.pageConfig[a].tag == tag) {
                    pageShow = glitter.pageConfig[a];
                    break;
                } else if (glitter.pageConfig[a].id !== pageHide.id) {
                    this.hidePageView(glitter.pageConfig[a].id, true);
                }
            }
            if (pageHide.type === GVCType.Dialog) {
                this.hidePageView(pageHide.id, true);
                this.showPageView(pageShow.id);
            } else {
                this.showPageView(pageShow.id);
                pageHide.animation.outView(pageHide, () => {
                    this.hidePageView(pageHide.id, true);
                });
            }
        }
    };

    public static goMenu() {
        const glitter = Glitter.glitter;
        for (let a = glitter.pageConfig.length - 1; a >= 0; a--) {
            if (a == 0) {
                this.showPageView(glitter.pageConfig[a].id);
                break;
            } else {
                this.hidePageView(glitter.pageConfig[a].id, true);
            }
        }
    }

    public static addChangePageListener(callback: (data: string) => void) {
        Glitter.glitter.changePageCallback.push(callback);
    }
}