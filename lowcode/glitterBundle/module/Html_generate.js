import { Glitter } from '../Glitter.js';
import autosize from '../plugins/autosize.js';
import { widgetComponent } from "../html-component/widget.js";
export class HtmlGenerate {
    constructor(setting, hover = [], subdata) {
        var _a;
        this.setting = setting;
        subdata = subdata !== null && subdata !== void 0 ? subdata : {};
        HtmlGenerate.share.false = (_a = HtmlGenerate.share.false) !== null && _a !== void 0 ? _a : {};
        const editContainer = window.glitter.getUUID();
        let lastIndex = undefined;
        setting.map((dd) => {
            var _a, _b, _c, _d, _e;
            dd.css = (_a = dd.css) !== null && _a !== void 0 ? _a : {};
            dd.css.style = (_b = dd.css.style) !== null && _b !== void 0 ? _b : {};
            dd.css.class = (_c = dd.css.class) !== null && _c !== void 0 ? _c : {};
            dd.refreshAllParameter = (_d = dd.refreshAllParameter) !== null && _d !== void 0 ? _d : {
                view1: () => {
                },
                view2: () => {
                },
            };
            dd.refreshComponentParameter = (_e = dd.refreshComponentParameter) !== null && _e !== void 0 ? _e : {
                view1: () => {
                },
                view2: () => {
                },
            };
            dd.refreshAll = () => {
                dd.refreshAllParameter.view1();
                dd.refreshAllParameter.view2();
            };
            dd.refreshComponent = () => {
                try {
                    dd.refreshComponentParameter.view1();
                    dd.refreshComponentParameter.view2();
                }
                catch (e) {
                }
            };
            return dd;
        });
        this.render = (gvc, option = {
            class: ``,
            style: ``
        }, createOption) => {
            var _a;
            gvc.glitter.share.loaginR = ((_a = gvc.glitter.share.loaginR) !== null && _a !== void 0 ? _a : 0) + 1;
            const container = gvc.glitter.getUUID();
            gvc.glitter.defaultSetting.pageLoading();
            let htmlList = [];
            function getPageData() {
                htmlList = [];
                async function add(set) {
                    for (const a of set) {
                        if ((a.type !== 'widget') && !gvc.glitter.share.htmlExtension[gvc.glitter.htmlGenerate.resourceHook(a.js)]) {
                            await new Promise((resolve, reject) => {
                                gvc.glitter.addMtScript([{ src: `${gvc.glitter.htmlGenerate.resourceHook(a.js)}`, type: 'module' }], () => {
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
                add(setting).then(async (data) => {
                    new Promise(async (resolve, reject) => {
                        var _a;
                        let index = 0;
                        for (const dd of setting) {
                            (await new Promise(async (resolve, reject) => {
                                const component = gvc.glitter.getUUID();
                                function getHtml(callback) {
                                    var _a;
                                    let data = '';
                                    try {
                                        data = gvc.glitter.share.htmlExtension[gvc.glitter.htmlGenerate.resourceHook(dd.js)][dd.type]
                                            .render(gvc, dd, setting, hover, subdata)
                                            .view();
                                    }
                                    catch (e) {
                                        HtmlGenerate.share.false[dd.js] = ((_a = HtmlGenerate.share.false[dd.js]) !== null && _a !== void 0 ? _a : 0) + 1;
                                        console.log(`解析錯誤:${e.message}<br>${e.stack}<br>${e.line}`);
                                        if (HtmlGenerate.share.false[dd.js] < 10) {
                                            setTimeout(() => {
                                                getHtml(callback);
                                            }, 200);
                                        }
                                        return ``;
                                    }
                                    if (typeof data === 'string') {
                                        callback(data);
                                    }
                                    else {
                                        data.then((dd) => {
                                            callback(dd);
                                            gvc.notifyDataChange(component);
                                        });
                                    }
                                }
                                dd.refreshAllParameter.view1 = () => {
                                    getPageData();
                                };
                                async function loadingFinish() {
                                    await new Promise((resolve, reject) => {
                                        if (dd.data.elem === 'style') {
                                            gvc.addStyle(dd.data.inner);
                                            resolve(true);
                                        }
                                        else if ((dd.data.elem === 'link') && (dd.data.attr.find((dd) => {
                                            return dd.attr === 'rel' && dd.value === 'stylesheet';
                                        }))) {
                                            gvc.addStyleLink(dd.data.attr.find((dd) => {
                                                return dd.attr === 'href';
                                            }).value);
                                            resolve(true);
                                        }
                                        else if (((dd.data.elem === 'script')) && dd.data.attr.find((dd) => {
                                            return dd.attr === 'src';
                                        })) {
                                            gvc.addMtScript([{
                                                    src: dd.data.attr.find((dd) => {
                                                        return dd.attr === 'src';
                                                    }).value
                                                }], () => {
                                                resolve(true);
                                            }, () => {
                                                resolve(false);
                                            });
                                        }
                                        else {
                                            resolve(true);
                                        }
                                    });
                                    const getHt = (() => {
                                        if ((dd.type === 'widget') || (dd.type === 'container')) {
                                            subdata.widgetComponentID = component;
                                            dd.refreshComponentParameter.view1 = () => {
                                                getPageData();
                                            };
                                            const option = [];
                                            subdata.option = option;
                                            if (window.parent.editerData !== undefined) {
                                                option.push({
                                                    key: "onclick", value: gvc.event((e, event) => {
                                                        try {
                                                            window.parent.glitter.setCookie('lastSelect', dd.id);
                                                            window.parent.glitter.share.refreshAllContainer();
                                                        }
                                                        catch (_a) {
                                                        }
                                                        event.stopPropagation();
                                                    })
                                                });
                                            }
                                            return widgetComponent.render(gvc, dd, setting, hover, subdata)
                                                .view();
                                        }
                                        else {
                                            return gvc.bindView(() => {
                                                var _a;
                                                let innerText = '';
                                                function getdd() {
                                                    getHtml((data) => {
                                                        innerText = data;
                                                        gvc.notifyDataChange(component);
                                                    });
                                                }
                                                dd.refreshComponentParameter.view1 = () => {
                                                    getdd();
                                                };
                                                getdd();
                                                let option = [];
                                                return {
                                                    bind: component,
                                                    view: () => {
                                                        return innerText;
                                                    },
                                                    divCreate: {
                                                        style: `
                                        ${hover.indexOf(dd.id) !== -1 ? `border: 4px solid dodgerblue;border-radius: 5px;box-sizing: border-box;` : ``}
                                        ${HtmlGenerate.styleEditor(dd).style()}
                                    `,
                                                        class: `position-relative ${(_a = dd.class) !== null && _a !== void 0 ? _a : ''} glitterTag${dd.hashTag}`,
                                                        option: option
                                                    },
                                                    onCreate: () => {
                                                        if (hover.indexOf(dd.id) !== -1 && lastIndex !== dd.id) {
                                                            lastIndex = dd.id;
                                                            gvc.glitter.$('html').get(0).scrollTo({
                                                                top: 0,
                                                                left: 0,
                                                                behavior: 'instant',
                                                            });
                                                            const scrollTOP = gvc.glitter.$('#' + gvc.id(component)).offset().top -
                                                                gvc.glitter.$('html').offset().top +
                                                                gvc.glitter.$('html').scrollTop();
                                                            gvc.glitter
                                                                .$('html')
                                                                .get(0)
                                                                .scrollTo({
                                                                top: scrollTOP - gvc.glitter.$('html').height() / 2,
                                                                left: 0,
                                                                behavior: 'instant',
                                                            });
                                                        }
                                                    },
                                                };
                                            });
                                        }
                                    });
                                    htmlList.push({
                                        fun: getHt
                                    });
                                    resolve(true);
                                }
                                function getResource() {
                                    var _a;
                                    if ((dd.type === 'widget') || (dd.type === 'container')) {
                                        loadingFinish();
                                        return;
                                    }
                                    try {
                                        gvc.glitter.share.htmlExtension[gvc.glitter.htmlGenerate.resourceHook(dd.js)][dd.type]
                                            .render(gvc, dd, setting, hover, subdata);
                                        loadingFinish();
                                    }
                                    catch (e) {
                                        HtmlGenerate.share.false[dd.js] = ((_a = HtmlGenerate.share.false[dd.js]) !== null && _a !== void 0 ? _a : 0) + 1;
                                        console.log(`解析錯誤:${e.message}<br>${e.stack}<br>${e.line}`);
                                        if (HtmlGenerate.share.false[dd.js] < 10) {
                                            setTimeout(() => {
                                                getResource();
                                            }, 100);
                                        }
                                        return ``;
                                    }
                                }
                                getResource();
                            }));
                            index = index + 1;
                        }
                        gvc.glitter.defaultSetting.pageLoadingFinish();
                        gvc.notifyDataChange(container);
                        gvc.glitter.share.loaginfC = ((_a = gvc.glitter.share.loaginfC) !== null && _a !== void 0 ? _a : 0) + 1;
                    });
                });
            }
            getPageData();
            return gvc.bindView({
                bind: container,
                view: () => {
                    const text = htmlList.map((dd) => {
                        return dd.fun();
                    }).join('');
                    return text;
                },
                divCreate: createOption !== null && createOption !== void 0 ? createOption : {
                    class: option.class, style: option.style, option: [{
                            key: `gl_type`,
                            value: "container"
                        }]
                },
                onCreate: () => {
                },
            });
        };
        this.editor = (gvc, option = {
            return_: false,
            refreshAll: () => {
            },
            setting: setting,
            deleteEvent: () => {
            },
        }) => {
            var loading = true;
            const oset = this.setting;
            function getData() {
                var _a;
                async function add(set) {
                    for (const a of set) {
                        let falseArray = [];
                        if (!gvc.glitter.share.htmlExtension[gvc.glitter.htmlGenerate.resourceHook(a.js)]) {
                            await new Promise((resolve, reject) => {
                                gvc.glitter.addMtScript([{ src: `${gvc.glitter.htmlGenerate.resourceHook(a.js)}`, type: 'module' }], () => {
                                    resolve(true);
                                }, () => {
                                    falseArray.push(gvc.glitter.htmlGenerate.resourceHook(a.js));
                                    resolve(false);
                                });
                            });
                        }
                        if (a.type === 'container') {
                            await add(a.data.setting);
                        }
                        if (falseArray.length > 0) {
                            await add(falseArray);
                        }
                    }
                    return true;
                }
                add((_a = option.setting) !== null && _a !== void 0 ? _a : setting).then((data) => {
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
                    var _a;
                    if (loading) {
                        return ``;
                    }
                    else {
                        return gvc.map(((_a = option.setting) !== null && _a !== void 0 ? _a : setting).map((dd, index) => {
                            var _a, _b, _c;
                            try {
                                const component = gvc.glitter.getUUID();
                                dd.refreshAllParameter = (_a = dd.refreshAllParameter) !== null && _a !== void 0 ? _a : {
                                    view1: () => {
                                    },
                                    view2: () => {
                                    },
                                };
                                dd.refreshComponent = () => {
                                    try {
                                        dd.refreshComponentParameter.view1();
                                        dd.refreshComponentParameter.view2();
                                    }
                                    catch (e) {
                                    }
                                };
                                dd.refreshComponentParameter = (_b = dd.refreshComponentParameter) !== null && _b !== void 0 ? _b : {
                                    view1: () => {
                                    },
                                    view2: () => {
                                    },
                                };
                                dd.refreshAllParameter.view2 = () => {
                                    gvc.notifyDataChange(editContainer);
                                };
                                dd.refreshAll = () => {
                                    dd.refreshAllParameter.view1();
                                    dd.refreshAllParameter.view2();
                                    option.refreshAll();
                                };
                                const toggleView = gvc.glitter.getUUID();
                                const toggleEvent = gvc.event(() => {
                                    dd.expand = !dd.expand;
                                    gvc.notifyDataChange([toggleView, component]);
                                });
                                return `<div style=" ${option.return_
                                    ? `padding: 10px;`
                                    : `padding-bottom: 10px;margin-bottom: 10px;border-bottom: 1px solid lightgrey;`}" class="
${option.return_ ? `w-100 border rounded bg-dark mt-2` : ``} " >
${gvc.bindView({
                                    bind: toggleView,
                                    view: () => {
                                        return `<div class="d-flex align-items-center" style="${option.return_ && !dd.expand ? `` : `margin-bottom: 10px;`};cursor: pointer;" >

<h3 style="font-size: 16px;" class="m-0">${dd.label}</h3>
<div class="flex-fill"></div>
${option.return_
                                            ? dd.expand
                                                ? `<div class="text-white" style="cursor: pointer;" onclick="${toggleEvent}">收合<i class="fa-solid fa-up ms-2 text-white"></i></div>`
                                                : `<div class="text-white" style="cursor: pointer;" onclick="${toggleEvent}">展開<i class="fa-solid fa-down ms-2 text-white"></i></div>\``
                                            : ``}
</div>
${false
                                            ? HtmlGenerate.editeInput({
                                                gvc: gvc,
                                                title: '模塊資源路徑',
                                                default: dd.js,
                                                placeHolder: '請輸入模塊路徑',
                                                callback: (text) => {
                                                    dd.js = text;
                                                    option.refreshAll();
                                                    dd.refreshAll();
                                                },
                                            })
                                            : ``}
`;
                                    },
                                    divCreate: {},
                                })}
${gvc.bindView(() => {
                                    let loading = true;
                                    let data = '';
                                    function getData() {
                                        var _a;
                                        if ((dd.type === 'widget') || (dd.type === 'container')) {
                                            data = widgetComponent.render(gvc, dd, setting, hover, subdata)
                                                .editor();
                                            loading = false;
                                            gvc.notifyDataChange(component);
                                            return;
                                        }
                                        loading = true;
                                        try {
                                            data = gvc.glitter.share.htmlExtension[gvc.glitter.htmlGenerate.resourceHook(dd.js)][dd.type]
                                                .render(gvc, dd, setting, hover, subdata)
                                                .editor();
                                        }
                                        catch (e) {
                                            HtmlGenerate.share.false[dd.js] = ((_a = HtmlGenerate.share.false[dd.js]) !== null && _a !== void 0 ? _a : 0) + 1;
                                            console.log(`解析錯誤:${e.message}<br>${e.stack}<br>${e.line}`);
                                            if (HtmlGenerate.share.false[dd.js] < 10) {
                                                setTimeout(() => {
                                                    getData();
                                                }, 100);
                                            }
                                        }
                                        if (typeof data === 'string') {
                                            loading = false;
                                            gvc.notifyDataChange(component);
                                        }
                                        else {
                                            data.then((dd) => {
                                                data = dd;
                                                loading = false;
                                                gvc.notifyDataChange(component);
                                            });
                                        }
                                    }
                                    dd.refreshComponentParameter.view2 = () => {
                                        getData();
                                    };
                                    getData();
                                    return {
                                        bind: component,
                                        view: () => {
                                            if (option.return_ && !dd.expand) {
                                                return ``;
                                            }
                                            try {
                                                return gvc.map([
                                                    `<div class="alert-warning alert">
<h3 class="text-dark  m-1" style="font-size: 16px;">模塊路徑</h3>
<h3 class="text-primary alert-primary  m-1 fw-bold rounded p2-" style="font-size: 16px;">${dd.js}</h3>
<h3 class="text-dark  m-1 mt-2" style="font-size: 16px;">函式路徑</h3>
<h3 class="text-primary alert-primary m-1 fw-bold rounded p2-" style="font-size: 16px;">${dd.type}</h3>
</div>`,
                                                    HtmlGenerate.editeInput({
                                                        gvc: gvc,
                                                        title: '模塊名稱',
                                                        default: dd.label,
                                                        placeHolder: '請輸入自定義模塊名稱',
                                                        callback: (text) => {
                                                            dd.label = text;
                                                            option.refreshAll();
                                                            dd.refreshAll();
                                                        },
                                                    }),
                                                    `<div class="mb-2"></div>`,
                                                    HtmlGenerate.editeInput({
                                                        gvc: gvc,
                                                        title: '輸入HashTag標籤',
                                                        default: dd.hashTag,
                                                        placeHolder: 'hashtag標籤',
                                                        callback: (text) => {
                                                            dd.hashTag = text;
                                                            option.refreshAll();
                                                            dd.refreshAll();
                                                        },
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
                                                                if ((dd.type === 'widget') || (dd.type === 'container')) {
                                                                    return ``;
                                                                }
                                                                return gvc.glitter.htmlGenerate.styleEditor(dd).editor(gvc, () => {
                                                                    option.refreshAll();
                                                                }, '父層設計樣式');
                                                            },
                                                            divCreate: {
                                                                class: 'mt-2 mb-2 '
                                                            },
                                                        };
                                                    }),
                                                    (() => {
                                                        if (loading) {
                                                            return ``;
                                                        }
                                                        else {
                                                            return data;
                                                        }
                                                    })()
                                                ]);
                                            }
                                            catch (e) {
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
                                        divCreate: {},
                                    };
                                })}</div>`;
                            }
                            catch (e) {
                                HtmlGenerate.share.false[dd.js] = ((_c = HtmlGenerate.share.false[dd.js]) !== null && _c !== void 0 ? _c : 0) + 1;
                                console.log(`解析錯誤:${e.message}<br>${e.stack}<br>${e.line}`);
                                if (HtmlGenerate.share.false[dd.js] < 10) {
                                    setTimeout(() => {
                                        getData();
                                    }, 500);
                                }
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
                },
            });
        };
        this.exportJson = (setting) => {
            return JSON.stringify(setting);
        };
    }
    static styleEditor(data, gvc, widget, subData) {
        const glitter = (gvc !== null && gvc !== void 0 ? gvc : window).glitter;
        return {
            editor: (gvc, widget, title, option) => {
                var _a;
                const glitter = window.glitter;
                return `
<button type="button" class="btn  w-100  shadow ${(_a = (option !== null && option !== void 0 ? option : {}).class) !== null && _a !== void 0 ? _a : "mt-2"}" style="background-image: linear-gradient(135deg, #667eea 0%, #764ba2 100%);" onclick="${gvc.event(() => {
                    glitter.openDiaLog("glitterBundle/plugins/dialog-style-editor.js", "dialog-style-editor", {
                        callback: () => {
                            if (typeof widget === 'function') {
                                widget();
                            }
                            else {
                                widget.refreshComponent();
                            }
                        },
                        data: data
                    });
                })}">${title !== null && title !== void 0 ? title : "設計樣式"}</button>`;
            },
            class: () => {
                let classs = '';
                try {
                    classs = eval(data.class);
                }
                catch (e) {
                    classs = data.class;
                }
                return classs;
            },
            style: () => {
                var _a;
                let styles = '';
                try {
                    styles = eval(data.style);
                }
                catch (e) {
                    styles = data.style;
                }
                let styleString = [styles];
                ((_a = data.styleList) !== null && _a !== void 0 ? _a : []).map((dd) => {
                    Object.keys(dd.data).map((d2) => {
                        styleString.push([d2, dd.data[d2]].join(':'));
                    });
                });
                return styleString.join(';');
            },
        };
    }
    static editeInput(obj) {
        var _a, _b, _c;
        obj.title = (_a = obj.title) !== null && _a !== void 0 ? _a : "";
        return `<h3 class="text-dark mt-2" style="font-size: 16px;margin-bottom: 10px;" >${obj.title}</h3>
<input class="form-control mb-2" type="${(_b = obj.type) !== null && _b !== void 0 ? _b : 'text'}" placeholder="${obj.placeHolder}" onchange="${obj.gvc.event((e) => {
            obj.callback(e.value);
        })}" value="${(_c = obj.default) !== null && _c !== void 0 ? _c : ''}">`;
    }
    static editeText(obj) {
        var _a;
        obj.title = (_a = obj.title) !== null && _a !== void 0 ? _a : "";
        const id = obj.gvc.glitter.getUUID();
        return `<h3 style="font-size: 16px;margin-bottom: 10px;" class="mt-2 text-dark d-flex align-items-center  ${(!obj.title) ? `d-none` : ``}">${obj.title}</h3>

${obj.gvc.bindView({
            bind: id,
            view: () => {
                var _a;
                return (_a = obj.default) !== null && _a !== void 0 ? _a : '';
            },
            divCreate: {
                elem: `textArea`,
                style: `max-height:400px!important;min-height:100px;`,
                class: `form-control`, option: [
                    { key: 'placeholder', value: obj.placeHolder },
                    {
                        key: 'onchange', value: obj.gvc.event((e) => {
                            obj.callback(e.value);
                        })
                    }
                ]
            },
            onCreate: () => {
                autosize($('#' + obj.gvc.id(id)));
            }
        })}`;
    }
}
HtmlGenerate.share = {};
HtmlGenerate.resourceHook = (src) => {
    return src;
};
HtmlGenerate.saveEvent = () => {
    alert('save');
};
HtmlGenerate.setHome = (obj) => {
    var _a, _b;
    const glitter = Glitter.glitter;
    glitter.setHome('glitterBundle/plugins/html-render.js', obj.tag, {
        page_config: (_a = obj.page_config) !== null && _a !== void 0 ? _a : {},
        config: obj.config,
        editMode: obj.editMode,
        data: obj.data,
    }, (_b = obj.option) !== null && _b !== void 0 ? _b : {});
};
HtmlGenerate.changePage = (obj) => {
    var _a, _b;
    const glitter = Glitter.glitter;
    glitter.changePage('glitterBundle/plugins/html-render.js', obj.tag, obj.goBack, {
        page_config: (_a = obj.page_config) !== null && _a !== void 0 ? _a : {},
        config: obj.config,
        editMode: obj.editMode,
        data: obj.data,
    }, (_b = obj.option) !== null && _b !== void 0 ? _b : {});
};