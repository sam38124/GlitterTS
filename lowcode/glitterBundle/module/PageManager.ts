import {Animation, AnimationConfig} from './Animation.js';
import {Glitter} from '../Glitter.js';
import {GVC} from "../GVController.js";

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
    public initial:boolean;
    public search:string;
    public id: string;
    public obj: any;
    public goBack: boolean;
    public src: string;
    public tag: string;
    public createResource: () => void;
    public deleteResource: (destroy: boolean) => void;
    public type: GVCType;
    public animation: AnimationConfig;
    public backGroundColor: string;
    public scrollTop: number = 0;
    public dismiss: () => void;
    public renderFinish:()=> void
    public static rootPath=''

    public getElement(): any {
        return Glitter.glitter.$(`#page${this.id}`);
    }

    public gvc?:GVC
    constructor(par: {
        id: string, obj: any, goBack: boolean, src: string, tag: string, createResource: () => void, deleteResource: (destroy: boolean) => void,
        type: GVCType, animation: AnimationConfig, backGroundColor: string, dismiss: () => void,renderFinish:()=>void,
        search?:string
    }) {
        this.initial=false
        this.search=par.search || '';
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
        this.dismiss = par.dismiss
        this.renderFinish= par.renderFinish
    }
}

export class PageManager {
    public static hiddenElement: any = {}

    public static hidePageView(id: string, del: boolean = false) {
        const glitter = Glitter.glitter;
        try {
            const pageConfig=glitter.pageConfig.find((dd)=>{
                return dd.id===id
            })
            if(pageConfig){
                if(del){
                    pageConfig.dismiss()
                    pageConfig.deleteResource(true)
                    glitter.$(`#page` + pageConfig.id).remove();
                    glitter.$(`#` + pageConfig.id).remove();
                    PageManager.hiddenElement[`page${pageConfig.id}`] = undefined
                    PageManager.hiddenElement[`${pageConfig.id}`] = undefined
                    glitter.pageConfig=glitter.pageConfig.filter((dd)=>{
                        return dd.id!==pageConfig.id
                    })
                }else{
                    const pageElement = document.getElementById(`page${pageConfig.id}`)
                    const dialogElement = document.getElementById(`${pageConfig.id}`)
                    if (pageElement) {
                        PageManager.hiddenElement[`page` + pageConfig.id] = pageElement
                        pageElement.remove()
                    } else if (dialogElement) {
                        PageManager.hiddenElement[`${pageConfig.id}`] = dialogElement
                        dialogElement.remove()
                    }
                }
            }
        } catch (e) {
            console.log(e)
        }
    }


    public static showPageView(id: string) {
        const glitter = Glitter.glitter;
        try {
            const index = glitter.pageConfig.map((data) => {
                return data.id;
            }).indexOf(id);
            (PageManager.hiddenElement[`page` + glitter.pageConfig[index].id] &&
            document.getElementById('glitterPage')!.appendChild(PageManager.hiddenElement[`page` + glitter.pageConfig[index].id]));
            (PageManager.hiddenElement[glitter.pageConfig[index].id] &&
                document.getElementById('glitterPage')!.appendChild(PageManager.hiddenElement[glitter.pageConfig[index].id]));

            glitter.pageConfig[index].createResource();
            glitter.setUrlParameter('page', glitter.pageConfig[index].tag);
        } catch (e) {
        }
    }

    public static hideLoadingView() {
        Glitter.glitter.$('#loadingView').hide();
    }

    public static getRelativeUrl(url: string | any) {
        if (typeof url === 'string') {
            url = `${url}`
        }
        if (!url.startsWith('http')) {
            return new URL(url, new URL('../../', import.meta.url).href).href
        } else {
            return url
        }
    }

    public static setHome(url: string, tag: string, obj: any, option: { animation?: AnimationConfig, backGroundColor?: string, dismiss?: () => void } = {}) {
        const glitter = Glitter.glitter;
        //當頁面有第二頁時則先返回首頁在做跳轉。
        const now_page=glitter.pageConfig.filter((dd)=>{return dd.type===GVCType.Page}).reverse()[1];
        glitter.htmlGenerate.loadScript(glitter,[
            {
                src:PageManager.getRelativeUrl(url),
                callback:(gvFunction)=>{
                    const original = new URL(glitter.root_path + tag + window.location.search)
                    function switchFunction(){
                        glitter.page=tag
                        window.history.replaceState({}, document.title, original.href);
                        const pageConfig=new PageConfig({
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
                            type: GVCType.Page,
                            animation: option.animation ?? glitter.animation.none,
                            dismiss: option.dismiss ?? (() => {
                            }),
                            renderFinish:()=>{
                                //僅保留首頁和彈跳視窗。
                                glitter.pageConfig=glitter.pageConfig.filter((dd)=>{
                                    const isHome=(dd.id===pageConfig.id)
                                    if(!isHome){
                                        glitter.hidePageView(dd.id, true);
                                    }
                                    return isHome || (dd.type===GVCType.Dialog)
                                })
                            }
                        })
                        glitter.pageConfig.push(pageConfig)
                        glitter.defaultSetting.pageLoading();
                        if((window as any).gtag && GVC.initial){
                            (window as any).gtag('event', 'page_view', {'page_title': document.title, page_location: document.location.href});
                        }
                        GVC.initial=true
                        gvFunction({
                            pageConfig:pageConfig,
                            c_type:'home'
                        })
                    }
                    if(now_page){
                        glitter.goMenu()
                        glitter.share.menu_switch=setTimeout(()=>{
                            switchFunction()
                        },100)
                    }else{
                        switchFunction()
                    }

                }
            }
        ],'GVControllerList')

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
        function closePreviousPage() {
            console.log(`closePreviousPage`)
            //Only hidden page view
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
        page.animation.inView(page, () => {
            closePreviousPage();
            page.getElement().removeClass('position-fixed');
            page.renderFinish()
            setTimeout(() => {
                if (page.type === GVCType.Page) {
                    window.scrollTo({
                        top: 0,
                        behavior: 'auto' // 'auto' 表示无滚动动画
                    });
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

    public static setHistory(tag:string,type:string){
        const glitter = Glitter.glitter;
        const search = glitter.root_path+tag+glitter.window.location.search;
        try {

            if(['home','page'].find((dd)=>{
                return dd===type
            })){
                window.history.pushState({}, glitter.document.title, search);
                glitter.pageConfig[glitter.pageConfig.length-1].search=search
            }
        } catch (e) {
        }
    }
    public static changePage(url: string, tag: string, goBack: boolean, obj: any, option: { animation?: AnimationConfig, backGroundColor?: string, dismiss?: () => void } = {}) {
        const glitter = Glitter.glitter;
        console.log(`changePage-time:`, (window as any).renderClock.stop());
        const now_page=glitter.pageConfig.filter((dd)=>{return dd.type===GVCType.Page}).reverse()[0];
        now_page && (now_page.scrollTop=window.scrollY);
        glitter.window.history.replaceState({}, glitter.document.title, location.href);
        setTimeout(()=>{

            const pageConfig=new PageConfig({
                id: glitter.getUUID(),
                obj: obj,
                goBack: goBack,
                src: url,
                tag: tag,
                deleteResource: () => {
                },
                createResource: () => {
                },
                backGroundColor: option.backGroundColor ?? 'transparent',
                type: GVCType.Page,
                animation: option.animation || glitter.defaultSetting.pageAnimation || glitter.animation.none,
                dismiss: option.dismiss ?? (() => {
                }),
                renderFinish:()=>{

                }
            })
            glitter.pageConfig.push(pageConfig);
            glitter.defaultSetting.pageLoading();
            glitter.htmlGenerate.loadScript(glitter,[
                {
                    src:PageManager.getRelativeUrl(url),
                    callback:(gvFunction)=>{
                        glitter.setUrlParameter('page',tag)
                        if(glitter.pageConfig.find((dd)=>{
                            return dd===pageConfig
                        })){
                            glitter.page=tag
                            gvFunction({
                                pageConfig:pageConfig,
                                c_type:'page'
                            })
                        }
                        if((window as any).gtag){
                            (window as any).gtag('event', 'page_view', {'page_title': document.title, page_location: document.location.href});
                        }

                    }
                }
            ],'GVControllerList')
        })

    }

    public static removePage(tag: string) {
        const pg = Glitter.glitter.pageConfig.find((dd) => {
            return dd.tag === tag;
        });
        if (pg) {
            this.hidePageView(pg.id, true);
        }
    };
    public static innerDialog = (html: (gvc: GVC) => string | Promise<string>, tag: string, option: { animation?: AnimationConfig, backGroundColor?: string, dismiss?: () => void } = {}) => {
        const glitter = Glitter.glitter;
        glitter.openDiaLog(new URL('../dialog/dialog_inner.js', import.meta.url).href, tag, {
            getView: html
        }, option)
    }

    public static openDiaLog(url: string, tag: string, obj: any, option: { animation?: AnimationConfig, backGroundColor?: string, dismiss?: () => void } = {}) {
        const glitter = Glitter.glitter;
        console.log(`openDiaLog-time:`, (window as any).renderClock.stop());
        const pageConfig=new PageConfig({
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
            animation: option.animation ?? glitter.defaultSetting.dialogAnimation,
            dismiss: option.dismiss ?? (() => {
            }),
            renderFinish:()=>{}
        })
        glitter.pageConfig.push(pageConfig);
        glitter.defaultSetting.pageLoading();
        glitter.htmlGenerate.loadScript(glitter,[
            {
                src:PageManager.getRelativeUrl(url),
                callback:(gvFunction)=>{
                    if(glitter.pageConfig.find((dd)=>{
                        return dd===pageConfig
                    })){
                        gvFunction({
                            pageConfig:pageConfig
                        })
                    }
                }
            }
        ],'GVControllerList')
    };

    public static closeDiaLog(tag?: string) {
        const glitter = Glitter.glitter;
        for (let a = glitter.pageConfig.length - 1; a >= 0; a--) {
            if (glitter.pageConfig[a].type === GVCType.Dialog && ((glitter.pageConfig[a].tag === tag) || tag === undefined)) {
                glitter.pageConfig[a].animation.outView(glitter.pageConfig[a], () => {
                    this.hidePageView(glitter.pageConfig[a].id, true);
                });
            }
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
        (window as any).glitter.share.to_menu=true;
        window.history.back()

        // const glitter = Glitter.glitter;
        // for (let a = glitter.pageConfig.length - 1; a >= 0; a--) {
        //     if (a == 0) {
        //         this.showPageView(glitter.pageConfig[a].id);
        //         break;
        //     } else {
        //         this.hidePageView(glitter.pageConfig[a].id, true);
        //     }
        // }
    }

    public static addChangePageListener(callback: (data: string) => void) {
        Glitter.glitter.changePageCallback.push(callback);
    }
}