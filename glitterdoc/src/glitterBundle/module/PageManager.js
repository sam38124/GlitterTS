import { Glitter } from "../Glitter.js";
export class DefaultSetting {
    constructor(obj) {
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
    getElement() {
        return Glitter.glitter.$(`#page${this.id}`);
    }
}
export class PageManager {
    static hidePageView(id, del = false) {
        const glitter = Glitter.glitter;
        try {
            const index = glitter.pageConfig.map((data) => {
                return data.id;
            }).indexOf(id);
            glitter.pageConfig[index].deleteResource();
            if (del) {
                glitter.$(`#page` + glitter.pageConfig[index].id).remove();
                glitter.$(`#` + glitter.pageConfig[index].id).remove();
                glitter.pageConfig.splice(index, 1);
            }
            else {
                glitter.$(`#page` + glitter.pageConfig[index].id).hide();
                glitter.$(`#` + glitter.pageConfig[index].id).hide();
            }
        }
        catch (e) {
        }
    }
    static showPageView(id) {
        const glitter = Glitter.glitter;
        try {
            const index = glitter.pageConfig.map((data) => {
                return data.id;
            }).indexOf(id);
            glitter.$(`#page` + glitter.pageConfig[index].id).show();
            glitter.$(`#` + glitter.pageConfig[index].id).show();
            glitter.pageConfig[index].createResource();
            glitter.setUrlParameter('page', glitter.pageConfig[index].tag);
        }
        catch (e) {
        }
    }
    static hideLoadingView() {
        Glitter.glitter.$('#loadingView').hide();
    }
    static setHome(url, tag, obj, option = {}) {
        var _a, _b;
        const glitter = Glitter.glitter;
        if (glitter.waitChangePage) {
            setTimeout(() => {
                glitter.setHome(url, tag, obj, option);
            }, 100);
        }
        else {
            glitter.waitChangePage = true;
            for (let a = glitter.pageConfig.length - 1; a >= 0; a--) {
                if (glitter.pageConfig[a].type !== GVCType.Dialog) {
                    glitter.hidePageView(glitter.pageConfig[a].id, true);
                }
            }
            const config = new PageConfig({
                id: glitter.getUUID(),
                obj: obj,
                goBack: true,
                src: url,
                tag: tag,
                deleteResource: () => { },
                createResource: () => { },
                backGroundColor: (_a = option.backGroundColor) !== null && _a !== void 0 ? _a : "white",
                type: GVCType.Page,
                animation: (_b = option.animation) !== null && _b !== void 0 ? _b : glitter.animation.none
            });
            glitter.nowPageConfig = config;
            let module = glitter.modelJsList.find((dd) => {
                return dd.src === url;
            });
            if (module) {
                module.create(glitter);
                const search = glitter.setSearchParam(glitter.removeSearchParam(glitter.window.location.search, "page"), "page", tag);
                try {
                    glitter.window.history.pushState({}, glitter.document.title, search);
                }
                catch (e) {
                }
                glitter.pageConfig = [];
                glitter.pageConfig.push(config);
                glitter.setUrlParameter('page', tag);
                glitter.waitChangePage = false;
            }
            else {
                glitter.addMtScript([{
                        src: url,
                        type: 'module',
                        id: config.id
                    }], () => {
                    const search = glitter.setSearchParam(glitter.removeSearchParam(glitter.window.location.search, "page"), "page", tag);
                    try {
                        glitter.window.history.pushState({}, glitter.document.title, search);
                    }
                    catch (e) {
                    }
                    glitter.pageConfig = [];
                    glitter.pageConfig.push(config);
                    glitter.setUrlParameter('page', tag);
                    glitter.waitChangePage = false;
                }, () => {
                    console.log("can't find script src:" + url);
                    glitter.waitChangePage = false;
                }, { multiple: true });
            }
        }
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
            if (page.type === GVCType.Page) {
                glitter.pageConfig.map((a) => {
                    if (a.id !== page.id && a.type !== GVCType.Dialog) {
                        glitter.hidePageView(a.id);
                    }
                });
            }
        }
        page.getElement().addClass(`position-absolute`);
        page.getElement().show();
        page.animation.inView(page, () => {
            closePreviousPage();
            page.getElement().removeClass('position-absolute');
        });
    }
    static changePage(url, tag, goBack, obj, option = {}) {
        var _a, _b;
        const glitter = Glitter.glitter;
        if (glitter.waitChangePage) {
            setTimeout(() => {
                glitter.changePage(url, tag, goBack, obj, option);
            }, 100);
        }
        else {
            glitter.waitChangePage = true;
            const config = new PageConfig({
                id: glitter.getUUID(),
                obj: obj,
                goBack: goBack,
                src: url,
                tag: tag,
                deleteResource: () => { },
                createResource: () => { },
                backGroundColor: (_a = option.backGroundColor) !== null && _a !== void 0 ? _a : "white",
                type: GVCType.Page,
                animation: (_b = option.animation) !== null && _b !== void 0 ? _b : glitter.defaultSetting.pageAnimation
            });
            glitter.nowPageConfig = config;
            let module = glitter.modelJsList.find((dd) => {
                return dd.src === url;
            });
            if (module) {
                module.create(glitter);
                const search = glitter.setSearchParam(glitter.removeSearchParam(glitter.window.location.search, "page"), "page", tag);
                glitter.window.history.pushState({}, glitter.document.title, search);
                glitter.pageConfig.push(config);
                glitter.setUrlParameter('page', tag);
                glitter.waitChangePage = false;
            }
            else {
                glitter.addMtScript([{
                        src: url,
                        type: 'module',
                        id: config.id
                    }], () => {
                    const search = glitter.setSearchParam(glitter.removeSearchParam(glitter.window.location.search, "page"), "page", tag);
                    glitter.window.history.pushState({}, glitter.document.title, search);
                    glitter.pageConfig.push(config);
                    glitter.waitChangePage = false;
                }, () => {
                    console.log("can't find script src:" + url);
                    glitter.waitChangePage = false;
                }, { multiple: true });
            }
        }
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
        var _a, _b;
        const glitter = Glitter.glitter;
        if (glitter.waitChangePage) {
            setTimeout(() => {
                glitter.openDiaLog(url, tag, obj, option);
            }, 100);
        }
        else {
            glitter.waitChangePage = true;
            const config = new PageConfig({
                id: glitter.getUUID(),
                obj: obj,
                goBack: true,
                src: url,
                tag: tag,
                deleteResource: () => { },
                createResource: () => { },
                backGroundColor: (_a = option.backGroundColor) !== null && _a !== void 0 ? _a : "transparent",
                type: GVCType.Dialog,
                animation: (_b = option.animation) !== null && _b !== void 0 ? _b : glitter.defaultSetting.dialogAnimation
            });
            glitter.nowPageConfig = config;
            let module = glitter.modelJsList.find((dd) => {
                return dd.src === url;
            });
            if (module) {
                module.create(glitter);
                glitter.pageConfig.push(config);
                glitter.setUrlParameter('dialog', tag);
                glitter.waitChangePage = false;
            }
            else {
                glitter.addMtScript([{
                        src: url,
                        type: 'module',
                        id: config.id
                    }], () => {
                    glitter.pageConfig.push(config);
                    glitter.setUrlParameter('dialog', tag);
                    glitter.waitChangePage = false;
                }, () => {
                    console.log("can't find script src:" + url);
                    glitter.waitChangePage = false;
                }, { multiple: true });
            }
        }
    }
    ;
    static closeDiaLog(tag) {
        const glitter = Glitter.glitter;
        if (glitter.waitChangePage) {
            setTimeout(() => {
                glitter.closeDiaLog(tag);
            }, 100);
        }
        else {
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
PageManager.changeWait = function () {
};
