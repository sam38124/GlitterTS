var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class Plugin {
    constructor() {
    }
    static create(url, fun) {
        const glitter = window.glitter;
        glitter.share.htmlExtension[url] = fun(glitter, isEditMode());
        return glitter.share.htmlExtension[url];
    }
    static createComponent(url, fun) {
        const glitter = window.glitter;
        const val = fun(glitter, isEditMode());
        glitter.share.htmlExtension[url] = val;
        return val;
    }
    static createViewComponent(url, fun) {
        const glitter = window.glitter;
        const val = fun(glitter, isEditMode());
        glitter.share.htmlExtension[url] = val;
        return val;
    }
    static setComponent(original, url) {
        const glitter = window.glitter;
        const fun = (gvc, widget, setting, hoverID, subData, htmlGenerate) => {
            return {
                view: () => {
                    return gvc.bindView(() => {
                        const tempView = glitter.getUUID();
                        return {
                            bind: tempView,
                            view: () => {
                                return ``;
                            },
                            divCreate: {
                                class: ``
                            },
                            onCreate: () => {
                                glitter.htmlGenerate.loadScript(glitter, [
                                    {
                                        src: url.href,
                                        callback: (dd) => {
                                            const target = document.querySelector(`[gvc-id="${gvc.id(tempView)}"]`);
                                            const view = dd.render(gvc, widget, setting, hoverID, subData, htmlGenerate).view();
                                            if (typeof view === 'string') {
                                                target.outerHTML = view;
                                            }
                                            else {
                                                view.then((dd) => {
                                                    target.outerHTML = dd;
                                                });
                                            }
                                        }
                                    }
                                ]);
                            },
                            onDestroy: () => {
                            },
                        };
                    });
                },
                editor: () => {
                    const tempView = glitter.getUUID();
                    return gvc.bindView(() => {
                        return {
                            bind: tempView,
                            view: () => {
                                return ``;
                            },
                            divCreate: {
                                class: ``
                            },
                            onCreate: () => {
                                glitter.htmlGenerate.loadScript(glitter, [
                                    {
                                        src: url.href,
                                        callback: (dd) => {
                                            const target = document.querySelector(`[gvc-id="${gvc.id(tempView)}"]`);
                                            const view = dd.render(gvc, widget, setting, hoverID, subData, htmlGenerate).editor();
                                            if (typeof view === 'string') {
                                                target.outerHTML = view;
                                            }
                                            else {
                                                view.then((dd) => {
                                                    target.outerHTML = dd;
                                                });
                                            }
                                        }
                                    }
                                ]);
                            },
                            onDestroy: () => {
                            },
                        };
                    });
                },
                user_editor: () => {
                    return gvc.bindView(() => {
                        const tempView = glitter.getUUID();
                        return {
                            bind: tempView,
                            view: () => {
                                return ``;
                            },
                            divCreate: {
                                class: ``
                            },
                            onCreate: () => {
                                glitter.htmlGenerate.loadScript(glitter, [
                                    {
                                        src: url.href,
                                        callback: (dd) => {
                                            const target = document.querySelector(`[gvc-id="${gvc.id(tempView)}"]`);
                                            let user_editor = dd.render(gvc, widget, setting, hoverID, subData, htmlGenerate).user_editor;
                                            const editor = dd.render(gvc, widget, setting, hoverID, subData, htmlGenerate).editor;
                                            function loopValue(view, first) {
                                                if (!view) {
                                                    if (first) {
                                                        loopValue(editor, true);
                                                    }
                                                    else {
                                                        target.outerHTML = '';
                                                    }
                                                }
                                                else {
                                                    view = view();
                                                    if (typeof view === 'string') {
                                                        if (view) {
                                                            target.outerHTML = view;
                                                        }
                                                        else {
                                                            if (first) {
                                                                loopValue(editor, true);
                                                            }
                                                            else {
                                                                target.outerHTML = view;
                                                            }
                                                        }
                                                    }
                                                    else {
                                                        view.then((dd) => {
                                                            if (dd) {
                                                                target.outerHTML = dd;
                                                            }
                                                            else {
                                                                if (first) {
                                                                    loopValue(editor, true);
                                                                }
                                                                else {
                                                                    target.outerHTML = dd;
                                                                }
                                                            }
                                                        });
                                                    }
                                                }
                                            }
                                            loopValue(user_editor, true);
                                        }
                                    }
                                ]);
                            },
                            onDestroy: () => {
                            },
                        };
                    });
                }
            };
        };
        fun.version = 'v1';
        return fun;
    }
    static setViewComponent(url) {
        const glitter = window.glitter;
        const fun = (cf) => {
            return {
                view: () => {
                    const tempView = glitter.getUUID();
                    return cf.gvc.bindView(() => {
                        return {
                            bind: tempView,
                            view: () => {
                                return ``;
                            },
                            divCreate: {
                                class: ``
                            },
                            onCreate: () => {
                                glitter.htmlGenerate.loadScript(glitter, [
                                    {
                                        src: url.href,
                                        callback: (widget) => {
                                            const target = document.querySelector(`[gvc-id="${cf.gvc.id(tempView)}"]`);
                                            const view = widget.render(cf).view();
                                            if (typeof view === 'string') {
                                                target.outerHTML = view;
                                            }
                                            else {
                                                view.then((dd) => {
                                                    target.outerHTML = dd;
                                                });
                                            }
                                        }
                                    }
                                ]);
                            },
                            onDestroy: () => {
                            },
                        };
                    });
                },
                editor: () => {
                    const tempView = glitter.getUUID();
                    return cf.gvc.bindView(() => {
                        return {
                            bind: tempView,
                            view: () => {
                                return ``;
                            },
                            divCreate: {
                                class: ``
                            },
                            onCreate: () => {
                                glitter.htmlGenerate.loadScript(glitter, [
                                    {
                                        src: url.href,
                                        callback: (widget) => {
                                            const target = document.querySelector(`[gvc-id="${cf.gvc.id(tempView)}"]`);
                                            const view = widget.render(cf).editor();
                                            if (typeof view === 'string') {
                                                target.outerHTML = view;
                                            }
                                            else {
                                                view.then((dd) => {
                                                    target.outerHTML = dd;
                                                });
                                            }
                                        }
                                    }
                                ]);
                            },
                            onDestroy: () => {
                            },
                        };
                    });
                },
                user_editor: () => {
                    return cf.gvc.bindView(() => {
                        const tempView = glitter.getUUID();
                        return {
                            bind: tempView,
                            view: () => {
                                return ``;
                            },
                            divCreate: {
                                class: ``
                            },
                            onCreate: () => {
                                glitter.htmlGenerate.loadScript(glitter, [
                                    {
                                        src: url.href,
                                        callback: (widget) => {
                                            const target = document.querySelector(`[gvc-id="${cf.gvc.id(tempView)}"]`);
                                            let user_editor = widget.render(cf).user_editor;
                                            const editor = widget.render(cf).editor;
                                            function loopValue(view, first) {
                                                if (!view) {
                                                    if (first) {
                                                        loopValue(editor, true);
                                                    }
                                                    else {
                                                        target.outerHTML = '';
                                                    }
                                                }
                                                else {
                                                    view = view();
                                                    if (typeof view === 'string') {
                                                        if (view) {
                                                            target.outerHTML = view;
                                                        }
                                                        else {
                                                            if (first) {
                                                                loopValue(editor, true);
                                                            }
                                                            else {
                                                                target.outerHTML = view;
                                                            }
                                                        }
                                                    }
                                                    else {
                                                        view.then((dd) => {
                                                            if (dd) {
                                                                target.outerHTML = dd;
                                                            }
                                                            else {
                                                                if (first) {
                                                                    loopValue(editor, true);
                                                                }
                                                                else {
                                                                    target.outerHTML = dd;
                                                                }
                                                            }
                                                        });
                                                    }
                                                }
                                            }
                                            loopValue(user_editor, true);
                                        }
                                    }
                                ]);
                            },
                            onDestroy: () => {
                            },
                        };
                    });
                }
            };
        };
        fun.version = 'v2';
        return fun;
    }
    static initial(gvc, set) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const a of set) {
                if (!gvc.glitter.share.htmlExtension[a.js]) {
                    yield new Promise((resolve, reject) => {
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
                    yield Plugin.initial(gvc, a.data.setting);
                }
            }
            return true;
        });
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
function isEditMode() {
    try {
        return window.parent.editerData !== undefined;
    }
    catch (e) {
        return false;
    }
}
