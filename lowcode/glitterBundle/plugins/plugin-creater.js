export class Plugin {
    constructor() {
    }
    static create(url, fun) {
        const glitter = window.glitter;
        glitter.share.htmlExtension[url] = fun(glitter, window.parent.editerData !== undefined);
    }
    static createComponent(url, fun) {
        const glitter = window.glitter;
        const val = fun(glitter, window.parent.editerData !== undefined);
        glitter.share.componentCallback[url](val);
    }
    static setComponent(original, url) {
        const glitter = window.glitter;
        url.searchParams.set("original", original);
        return (gvc, widget, setting, hoverID) => {
            var _a, _b;
            glitter.share.componentData = (_a = glitter.share.componentData) !== null && _a !== void 0 ? _a : {};
            let val = glitter.share.componentData[url.href];
            glitter.share.componentCallback = (_b = glitter.share.componentCallback) !== null && _b !== void 0 ? _b : {};
            glitter.share.componentCallback[url.href] = (dd) => {
                glitter.share.componentData[url.href] = dd;
                widget.refreshComponent();
            };
            gvc.glitter.addMtScript([
                {
                    src: url,
                    type: 'module'
                }
            ], () => { }, () => { });
            return {
                view: () => {
                    if (!val) {
                        return `<h3 style="color: black;">asdsadm</h3>`;
                    }
                    return val.render(gvc, widget, setting, hoverID)
                        .view();
                },
                editor: () => {
                    if (!val) {
                        return ``;
                    }
                    return val.render(gvc, widget, setting, hoverID)
                        .editor();
                }
            };
        };
    }
    static async initial(gvc, set) {
        for (const a of set) {
            if (!gvc.glitter.share.htmlExtension[a.js]) {
                await new Promise((resolve, reject) => {
                    gvc.glitter.addMtScript([
                        { src: `${a.js}`, type: 'module' }
                    ], () => {
                        resolve(true);
                    }, () => {
                        resolve(false);
                    });
                });
            }
            if (a.type === 'container') {
                await Plugin.initial(gvc, a.data.setting);
            }
        }
        return true;
    }
    static initialConfig(name) {
        var _a, _b, _c;
        const glitter = window.glitter;
        glitter.lowCodeAPP = (_a = glitter.lowCodeAPP) !== null && _a !== void 0 ? _a : {};
        glitter.lowCodeAPP[name] = (_b = glitter.lowCodeAPP[name]) !== null && _b !== void 0 ? _b : {};
        glitter.lowCodeAPP[name].config = (_c = glitter.lowCodeAPP[name].config) !== null && _c !== void 0 ? _c : {};
    }
    static getAppConfig(name, defaultData) {
        const glitter = window.glitter;
        Plugin.initialConfig(name);
        Object.keys(defaultData).map((dd) => {
            var _a;
            defaultData[dd] = (_a = glitter.lowCodeAPP[name].config[dd]) !== null && _a !== void 0 ? _a : defaultData[dd];
        });
        return defaultData;
    }
    static setAppConfig(name, setData) {
        const glitter = window.glitter;
        Plugin.initialConfig(name);
        Object.keys(setData).map((dd) => {
            glitter.lowCodeAPP[name].config[dd] = setData[dd];
        });
    }
}
function getUrlParameter(url, sParam) {
    let sPageURL = url.split("?")[1], sURLVariables = sPageURL.split('&'), sParameterName, i;
    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
}
