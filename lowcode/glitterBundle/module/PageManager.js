import { Glitter } from '../Glitter.js';
import { GVC } from "../GVController.js";
import { Language } from "../../glitter-base/global/language.js";
export class DefaultSetting {
    constructor(obj) {
        this.pageLoading = () => {
        };
        this.pageLoadingFinish = () => {
        };
        this.pageLoading = obj.pageLoading;
        this.pageLoadingFinish = obj.pageLoadingFinish;
        this.pageBgColor = obj.pageBgColor;
        this.pageAnimation = obj.pageAnimation;
        this.dialogAnimation = obj.dialogAnimation;
    }
}
export var GVCType;
(function (GVCType) {
    GVCType[GVCType["Page"] = 0] = "Page";
    GVCType[GVCType["Dialog"] = 1] = "Dialog";
})(GVCType || (GVCType = {}));
export class PageConfig {
    constructor(par) {
        this.scrollTop = 0;
        this.push_stack = par.push_stack;
        this.carry_search = par.carry_search || [];
        this.initial = false;
        this.search = par.search || '';
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
        this.dismiss = par.dismiss;
        this.renderFinish = par.renderFinish;
    }
    getElement() {
        return Glitter.glitter.$(`#page${this.id}`);
    }
}
PageConfig.rootPath = '';
export class PageManager {
    static hidePageView(id, del = false) {
        const glitter = Glitter.glitter;
        try {
            const pageConfig = glitter.pageConfig.find((dd) => {
                return dd.id === id;
            });
            if (pageConfig) {
                if (del) {
                    pageConfig.dismiss();
                    pageConfig.deleteResource(true);
                    glitter.$(`#page` + pageConfig.id).remove();
                    glitter.$(`#` + pageConfig.id).remove();
                    PageManager.hiddenElement[`page${pageConfig.id}`] = undefined;
                    PageManager.hiddenElement[`${pageConfig.id}`] = undefined;
                    glitter.pageConfig = glitter.pageConfig.filter((dd) => {
                        return dd.id !== pageConfig.id;
                    });
                }
                else {
                    const pageElement = document.getElementById(`page${pageConfig.id}`);
                    const dialogElement = document.getElementById(`${pageConfig.id}`);
                    if (pageElement) {
                        PageManager.hiddenElement[`page` + pageConfig.id] = pageElement;
                        pageElement.remove();
                    }
                    else if (dialogElement) {
                        PageManager.hiddenElement[`${pageConfig.id}`] = dialogElement;
                        dialogElement.remove();
                    }
                }
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    static showPageView(id) {
        const glitter = Glitter.glitter;
        try {
            const index = glitter.pageConfig.map((data) => {
                return data.id;
            }).indexOf(id);
            (PageManager.hiddenElement[`page` + glitter.pageConfig[index].id] &&
                document.getElementById('glitterPage').appendChild(PageManager.hiddenElement[`page` + glitter.pageConfig[index].id]));
            (PageManager.hiddenElement[glitter.pageConfig[index].id] &&
                document.getElementById('glitterPage').appendChild(PageManager.hiddenElement[glitter.pageConfig[index].id]));
            glitter.pageConfig[index].createResource();
            if (glitter.pageConfig[index].type === GVCType.Page) {
                window.history.replaceState({}, document.title, glitter.pageConfig[index].search);
            }
        }
        catch (e) {
        }
    }
    static hideLoadingView() {
        Glitter.glitter.$('#loadingView').hide();
    }
    static getRelativeUrl(url) {
        if (typeof url === 'string') {
            url = `${url}`;
        }
        if (!url.startsWith('http')) {
            return new URL(url, new URL('../../', import.meta.url).href).href;
        }
        else {
            return url;
        }
    }
    static setHome(url, tag, obj, option = {}) {
        const glitter = Glitter.glitter;
        const now_page = glitter.pageConfig.filter((dd) => {
            return dd.type === GVCType.Page;
        }).reverse()[1];
        glitter.htmlGenerate.loadScript(glitter, [
            {
                src: PageManager.getRelativeUrl(url),
                callback: (gvFunction) => {
                    const original = new URL(glitter.root_path + Language.getLanguageLinkPrefix() + tag + location.hash + window.location.search);
                    function switchFunction() {
                        var _a, _b;
                        glitter.page = tag;
                        try {
                            window.history.replaceState({}, document.title, original.href);
                        }
                        catch (e) {
                        }
                        const pageConfig = new PageConfig({
                            id: glitter.getUUID(),
                            obj: obj,
                            goBack: true,
                            push_stack: false,
                            src: url,
                            tag: tag,
                            carry_search: option.carry_search,
                            deleteResource: () => {
                            },
                            createResource: () => {
                            },
                            backGroundColor: (_a = option.backGroundColor) !== null && _a !== void 0 ? _a : 'transparent',
                            type: GVCType.Page,
                            animation: option.animation || glitter.defaultSetting.pageAnimation || glitter.animation.none,
                            dismiss: (_b = option.dismiss) !== null && _b !== void 0 ? _b : (() => {
                            }),
                            renderFinish: () => {
                                glitter.pageConfig = glitter.pageConfig.filter((dd) => {
                                    const isHome = (dd.id === pageConfig.id);
                                    if (!isHome) {
                                        glitter.hidePageView(dd.id, true);
                                    }
                                    return isHome || (dd.type === GVCType.Dialog);
                                });
                            }
                        });
                        glitter.pageConfig.push(pageConfig);
                        glitter.defaultSetting.pageLoading();
                        if (window.gtag && GVC.initial) {
                            window.gtag('event', 'page_view', {
                                'page_title': document.title,
                                page_location: document.location.href
                            });
                        }
                        GVC.initial = true;
                        gvFunction({
                            pageConfig: pageConfig,
                            c_type: 'home'
                        });
                    }
                    if (now_page) {
                        glitter.goMenu();
                        glitter.share.menu_switch = setTimeout(() => {
                            switchFunction();
                        }, 100);
                    }
                    else {
                        switchFunction();
                    }
                }
            }
        ], 'GVControllerList');
    }
    ;
    static setLoadingView(link) {
        const glitter = Glitter.glitter;
        glitter.$('#loadingView').hide();
        glitter.$('#loadingView').append('<iframe  src="' + link + '" style="width: 100%;height: 100%;background-color: rgba(0, 0, 0, 0.5);"></iframe>');
    }
    static changePageListener(tag) {
        const glitter = Glitter.glitter;
        for (const data of glitter.changePageCallback) {
            try {
                data(tag);
            }
            catch (e) {
            }
        }
    }
    static showLoadingView() {
        Glitter.glitter.$('#loadingView').show();
    }
    ;
    static setAnimation(page) {
        const glitter = Glitter.glitter;
        function closePreviousPage() {
            console.log(`closePreviousPage`);
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
            page.renderFinish();
            setTimeout(() => {
                if (page.type === GVCType.Page) {
                    window.scrollTo({
                        top: 0,
                        behavior: 'auto'
                    });
                }
            }, 100);
        });
    }
    static setHistory(tag, type) {
        const glitter = Glitter.glitter;
        try {
            if (['home', 'page'].find((dd) => {
                return dd === type;
            })) {
                if (glitter.waiting_push_state) {
                    glitter.waiting_push_state();
                    glitter.waiting_push_state = undefined;
                }
                else {
                    window.history.pushState({}, glitter.document.title, (glitter.root_path + Language.getLanguageLinkPrefix() + tag + glitter.window.location.search));
                }
                glitter.pageConfig[glitter.pageConfig.length - 1].search = glitter.root_path + Language.getLanguageLinkPrefix() + tag + glitter.window.location.search;
            }
        }
        catch (e) {
        }
    }
    static changePage(url, tag, goBack, obj, option = {}) {
        const glitter = Glitter.glitter;
        console.log(`changePage-time:`, window.renderClock.stop());
        const now_page = glitter.pageConfig.filter((dd) => {
            return dd.type === GVCType.Page;
        }).reverse()[0];
        now_page.search = location.href;
        now_page && (now_page.scrollTop = window.scrollY);
        glitter.window.history.replaceState({}, glitter.document.title, location.href);
        setTimeout(() => {
            var _a, _b;
            const pageConfig = new PageConfig({
                id: glitter.getUUID(),
                obj: obj,
                goBack: goBack,
                src: url,
                tag: tag,
                push_stack: true,
                deleteResource: () => {
                },
                createResource: () => {
                },
                backGroundColor: (_a = option.backGroundColor) !== null && _a !== void 0 ? _a : 'transparent',
                type: GVCType.Page,
                animation: option.animation || glitter.defaultSetting.pageAnimation || glitter.animation.none,
                dismiss: (_b = option.dismiss) !== null && _b !== void 0 ? _b : (() => {
                }),
                renderFinish: () => {
                },
                carry_search: option.carry_search
            });
            glitter.pageConfig.push(pageConfig);
            glitter.defaultSetting.pageLoading();
            glitter.htmlGenerate.loadScript(glitter, [
                {
                    src: PageManager.getRelativeUrl(url),
                    callback: (gvFunction) => {
                        if (glitter.pageConfig.find((dd) => {
                            return dd === pageConfig;
                        })) {
                            glitter.page = tag;
                            gvFunction({
                                pageConfig: pageConfig,
                                c_type: 'page'
                            });
                        }
                        if (window.gtag) {
                            window.gtag('event', 'page_view', {
                                'page_title': document.title,
                                page_location: document.location.href
                            });
                        }
                    }
                }
            ], 'GVControllerList');
        });
    }
    static removePage(tag) {
        const pg = Glitter.glitter.pageConfig.find((dd) => {
            return dd.tag === tag;
        });
        if (pg) {
            this.hidePageView(pg.id, true);
        }
    }
    ;
    static openDiaLog(url, tag, obj, option = {}) {
        var _a, _b, _c;
        const glitter = Glitter.glitter;
        console.log(`openDiaLog-time:`, window.renderClock.stop());
        const pageConfig = new PageConfig({
            id: glitter.getUUID(),
            obj: obj,
            goBack: true,
            src: url,
            tag: tag,
            push_stack: false,
            deleteResource: () => {
            },
            createResource: () => {
            },
            backGroundColor: (_a = option.backGroundColor) !== null && _a !== void 0 ? _a : 'transparent',
            type: GVCType.Dialog,
            animation: (_b = option.animation) !== null && _b !== void 0 ? _b : glitter.defaultSetting.dialogAnimation,
            dismiss: (_c = option.dismiss) !== null && _c !== void 0 ? _c : (() => {
            }),
            renderFinish: () => {
            }
        });
        glitter.pageConfig.push(pageConfig);
        glitter.defaultSetting.pageLoading();
        glitter.htmlGenerate.loadScript(glitter, [
            {
                src: PageManager.getRelativeUrl(url),
                callback: (gvFunction) => {
                    if (glitter.pageConfig.find((dd) => {
                        return dd === pageConfig;
                    })) {
                        gvFunction({
                            pageConfig: pageConfig
                        });
                    }
                }
            }
        ], 'GVControllerList');
    }
    ;
    static closeDiaLog(tag) {
        const glitter = Glitter.glitter;
        for (let a = glitter.pageConfig.length - 1; a >= 0; a--) {
            if (glitter.pageConfig[a].type === GVCType.Dialog && ((glitter.pageConfig[a].tag === tag) || tag === undefined)) {
                glitter.pageConfig[a].animation.outView(glitter.pageConfig[a], () => {
                    try {
                        this.hidePageView(glitter.pageConfig[a].id, true);
                    }
                    catch (e) {
                    }
                });
            }
        }
    }
    static goBack(tag = undefined) {
        const glitter = Glitter.glitter;
        if (tag === undefined && glitter.pageConfig.length > 1) {
            const pageHide = glitter.pageConfig[glitter.pageConfig.length - 1];
            const pageShow = glitter.pageConfig[glitter.pageConfig.length - 2];
            if (pageHide.type === GVCType.Dialog) {
                this.hidePageView(pageHide.id, true);
                this.showPageView(pageShow.id);
            }
            else {
                this.showPageView(pageShow.id);
                pageHide.animation.outView(pageHide, () => {
                    this.hidePageView(pageHide.id, true);
                });
            }
        }
        else if (glitter.pageConfig.find((dd) => {
            return dd.tag === tag;
        })) {
            const pageHide = glitter.pageConfig[glitter.pageConfig.length - 1];
            let pageShow = undefined;
            for (let a = glitter.pageConfig.length - 1; a >= 0; a--) {
                if (glitter.pageConfig[a].tag == tag) {
                    pageShow = glitter.pageConfig[a];
                    break;
                }
                else if (glitter.pageConfig[a].id !== pageHide.id) {
                    this.hidePageView(glitter.pageConfig[a].id, true);
                }
            }
            if (pageHide.type === GVCType.Dialog) {
                this.hidePageView(pageHide.id, true);
                this.showPageView(pageShow.id);
            }
            else {
                this.showPageView(pageShow.id);
                pageHide.animation.outView(pageHide, () => {
                    this.hidePageView(pageHide.id, true);
                });
            }
        }
    }
    ;
    static goMenu() {
        window.glitter.share.to_menu = true;
        window.history.back();
    }
    static addChangePageListener(callback) {
        Glitter.glitter.changePageCallback.push(callback);
    }
}
PageManager.hiddenElement = {};
PageManager.changeWait = function () {
};
PageManager.clock = {
    start: new Date(),
    stop: function () {
        return ((new Date()).getTime() - (this.start).getTime());
    },
    zeroing: function () {
        this.start = new Date();
    }
};
PageManager.innerDialog = (html, tag, option = {}) => {
    const glitter = Glitter.glitter;
    glitter.openDiaLog(new URL('../dialog/dialog_inner.js', import.meta.url).href, tag, {
        getView: html
    }, option);
};
