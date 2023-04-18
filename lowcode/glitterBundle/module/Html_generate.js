import { Glitter } from '../Glitter.js';
import autosize from '../plugins/autosize.js';
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
                view1: () => { },
                view2: () => { },
            };
            dd.refreshComponentParameter = (_e = dd.refreshComponentParameter) !== null && _e !== void 0 ? _e : {
                view1: () => { },
                view2: () => { },
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
                    console.log(`${e.message}<br>${e.stack}<br>${e.line}`);
                }
            };
            return dd;
        });
        this.render = (gvc, option = { class: ``, style: `` }) => {
            var _a;
            gvc.glitter.share.loaginR = ((_a = gvc.glitter.share.loaginR) !== null && _a !== void 0 ? _a : 0) + 1;
            var loading = true;
            const container = gvc.glitter.getUUID();
            gvc.glitter.defaultSetting.pageLoading();
            function getData() {
                async function add(set) {
                    for (const a of set) {
                        if (!gvc.glitter.share.htmlExtension[gvc.glitter.htmlGenerate.resourceHook(a.js)]) {
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
                add(setting).then((data) => {
                    var _a;
                    loading = false;
                    gvc.glitter.defaultSetting.pageLoadingFinish();
                    gvc.notifyDataChange(container);
                    gvc.glitter.share.loaginfC = ((_a = gvc.glitter.share.loaginfC) !== null && _a !== void 0 ? _a : 0) + 1;
                    console.log('loaging:' + gvc.glitter.share.loaginfC);
                });
            }
            getData();
            return gvc.bindView({
                bind: container,
                view: () => {
                    if (loading) {
                        return ``;
                    }
                    else {
                        return gvc.map(setting.map((dd) => {
                            var _a;
                            const component = gvc.glitter.getUUID();
                            dd.refreshAllParameter.view1 = () => {
                                gvc.notifyDataChange(container);
                            };
                            let loading = true;
                            let data = '';
                            function getData() {
                                var _a;
                                loading = true;
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
                                            getData();
                                        }, 500);
                                    }
                                    return ``;
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
                            getData();
                            dd.refreshComponentParameter.view1 = () => {
                                getData();
                            };
                            return gvc.bindView({
                                bind: component,
                                view: () => {
                                    if (loading) {
                                        return ``;
                                    }
                                    else {
                                        return data;
                                    }
                                },
                                divCreate: {
                                    style: `
                                         ${hover.indexOf(dd.id) !== -1
                                        ? `border: 4px solid dodgerblue;border-radius: 5px;box-sizing: border-box;`
                                        : ``}
                                        ${HtmlGenerate.styleEditor(dd).style()}
                                    `,
                                    class: `position-relative ${(_a = dd.class) !== null && _a !== void 0 ? _a : ''} glitterTag${dd.hashTag}`,
                                },
                                onCreate: () => {
                                    if (hover.indexOf(dd.id) !== -1 && lastIndex !== dd.id) {
                                        lastIndex = dd.id;
                                        console.log('hover');
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
                                    console.log('onCreate');
                                },
                            });
                        }));
                    }
                },
                divCreate: { class: option.class, style: option.style },
                onCreate: () => { },
            });
        };
        this.editor = (gvc, option = {
            return_: false,
            refreshAll: () => { },
            setting: setting,
            deleteEvent: () => { },
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
                                    view1: () => { },
                                    view2: () => { },
                                };
                                dd.refreshComponent = () => {
                                    try {
                                        dd.refreshComponentParameter.view1();
                                        dd.refreshComponentParameter.view2();
                                    }
                                    catch (e) {
                                        console.log(`${e.message}<br>${e.stack}<br>${e.line}`);
                                    }
                                };
                                dd.refreshComponentParameter = (_b = dd.refreshComponentParameter) !== null && _b !== void 0 ? _b : {
                                    view1: () => { },
                                    view2: () => { },
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
<i class="fa-regular fa-circle-minus text-danger me-2" style="font-size: 20px;cursor: pointer;" onclick="${gvc.event(() => {
                                            function checkDelete(setting) {
                                                const index = setting.findIndex((x) => x.id === dd.id);
                                                if (index !== -1) {
                                                    setting.splice(index, 1);
                                                }
                                                else {
                                                    setting.map((d2) => {
                                                        if (d2.type === 'container') {
                                                            checkDelete(d2.data.setting);
                                                        }
                                                    });
                                                }
                                            }
                                            checkDelete(oset);
                                            option.refreshAll();
                                            dd.refreshAll();
                                            option.deleteEvent();
                                        })}"></i>
<h3 style="color: white;font-size: 16px;" class="m-0">${dd.label}</h3>
<div class="flex-fill"></div>
${option.return_
                                            ? dd.expand
                                                ? `<div style="cursor: pointer;" onclick="${toggleEvent}">收合<i class="fa-solid fa-up ms-2 text-white"></i></div>`
                                                : `<div style="cursor: pointer;" onclick="${toggleEvent}">展開<i class="fa-solid fa-down ms-2 text-white"></i></div>\``
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
                                                }, 500);
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
                                                    `<div class="alert-dark alert">
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
                                                            option.refreshAll();
                                                            dd.refreshAll();
                                                        },
                                                    }),
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
                                                                return gvc.glitter.htmlGenerate.styleEditor(dd).editor(gvc, () => {
                                                                    option.refreshAll();
                                                                }, '容器設計樣式');
                                                            },
                                                            divCreate: { class: 'mt-2' },
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
                onCreate: () => { },
            });
        };
        this.exportJson = (setting) => {
            return JSON.stringify(setting);
        };
    }
    static styleEditor(data) {
        return {
            editor: (gvc, widget, title) => {
                const glitter = window.glitter;
                return `
<button type="button" class="btn  w-100 mt-2" style="background-image: linear-gradient(135deg, #667eea 0%, #764ba2 100%);" onclick="${gvc.event(() => {
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
                var _a;
                return (_a = data.class) !== null && _a !== void 0 ? _a : '';
            },
            style: () => {
                var _a;
                let styleString = [data.style];
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
        var _a;
        return `<h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">${obj.title}</h3>
<input class="form-control" placeholder="${obj.placeHolder}" onchange="${obj.gvc.event((e) => {
            obj.callback(e.value);
        })}" value="${(_a = obj.default) !== null && _a !== void 0 ? _a : ''}">`;
    }
    static editeText(obj) {
        const id = obj.gvc.glitter.getUUID();
        return `<h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">${obj.title}</h3>
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
                    { key: 'onchange', value: obj.gvc.event((e) => {
                            obj.callback(e.value);
                        }) }
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
    var _a;
    const glitter = Glitter.glitter;
    glitter.changePage('glitterBundle/plugins/html-render.js', obj.tag, obj.goBack, {
        config: obj.config,
        editMode: obj.editMode,
        data: obj.data,
    }, (_a = obj.option) !== null && _a !== void 0 ? _a : {});
};
