import { Glitter } from '../Glitter.js';
import { GVC } from "../GVController.js";
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
            glitter.setUrlParameter('page', glitter.pageConfig[index].tag);
            if (glitter.pageConfig[index].type === GVCType.Page) {
                const clock = glitter.ut.clock();
                function scroll() {
                    try {
                        const scroll = JSON.parse(localStorage.getItem('g_l_top'));
                        if (scroll.id === id) {
                            console.log(`scrollTO->`, scroll.y);
                            window.scrollTo({
                                top: scroll.y,
                                behavior: 'auto'
                            });
                        }
                    }
                    catch (e) {
                    }
                    if (clock.stop() < 250) {
                        setTimeout(() => {
                            scroll();
                        }, 10);
                    }
                }
                setTimeout(() => { scroll(); });
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
        console.log(`setHome-time:`, window.renderClock.stop());
        glitter.htmlGenerate.loadScript(glitter, [
            {
                src: PageManager.getRelativeUrl(url),
                callback: (gvFunction) => {
                    var _a, _b, _c;
                    glitter.setUrlParameter('page', tag);
                    const pageConfig = new PageConfig({
                        id: glitter.getUUID(),
                        obj: obj,
                        goBack: true,
                        src: url,
                        tag: tag,
                        deleteResource: () => {
                        },
                        createResource: () => {
                        },
                        backGroundColor: (_a = option.backGroundColor) !== null && _a !== void 0 ? _a : 'white',
                        type: GVCType.Page,
                        animation: (_b = option.animation) !== null && _b !== void 0 ? _b : glitter.animation.none,
                        dismiss: (_c = option.dismiss) !== null && _c !== void 0 ? _c : (() => {
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
                    gvFunction({
                        pageConfig: pageConfig
                    });
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
    static setHistory(tag) {
        const glitter = Glitter.glitter;
        const search = glitter.setSearchParam(glitter.removeSearchParam(glitter.window.location.search, 'page'), 'page', tag);
        try {
            if (GVC.initial) {
                GVC.initial = false;
            }
            else {
                glitter.window.history.pushState({}, glitter.document.title, search);
            }
        }
        catch (e) {
        }
        glitter.setUrlParameter('page', tag);
    }
    static changePage(url, tag, goBack, obj, option = {}) {
        var _a, _b;
        const glitter = Glitter.glitter;
        console.log(`changePage-time:`, window.renderClock.stop());
        const pageConfig = new PageConfig({
            id: glitter.getUUID(),
            obj: obj,
            goBack: goBack,
            src: url,
            tag: tag,
            deleteResource: () => {
            },
            createResource: () => {
            },
            backGroundColor: (_a = option.backGroundColor) !== null && _a !== void 0 ? _a : 'white',
            type: GVCType.Page,
            animation: option.animation || glitter.defaultSetting.pageAnimation || glitter.animation.none,
            dismiss: (_b = option.dismiss) !== null && _b !== void 0 ? _b : (() => {
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
                    glitter.setUrlParameter('page', tag);
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
            deleteResource: () => {
            },
            createResource: () => {
            },
            backGroundColor: (_a = option.backGroundColor) !== null && _a !== void 0 ? _a : 'transparent',
            type: GVCType.Dialog,
            animation: (_b = option.animation) !== null && _b !== void 0 ? _b : glitter.defaultSetting.dialogAnimation,
            dismiss: (_c = option.dismiss) !== null && _c !== void 0 ? _c : (() => {
            }),
            renderFinish: () => { }
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
                    this.hidePageView(glitter.pageConfig[a].id, true);
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
        const glitter = Glitter.glitter;
        for (let a = glitter.pageConfig.length - 1; a >= 0; a--) {
            if (a == 0) {
                this.showPageView(glitter.pageConfig[a].id);
                break;
            }
            else {
                this.hidePageView(glitter.pageConfig[a].id, true);
            }
        }
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
