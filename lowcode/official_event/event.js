import { BaseApi } from "../api/base.js";
import { GlobalUser } from "../glitter-base/global/global-user.js";
import { TriggerEvent } from "../glitterBundle/plugins/trigger-event.js";
import { EditorElem } from "../glitterBundle/plugins/editor-elem.js";
import { component } from "../official_view_component/official/component.js";
export class GlobalData {
}
GlobalData.data = {
    pageList: [],
    isRunning: false,
    run: () => {
        if (GlobalData.data.isRunning) {
            return;
        }
        GlobalData.data.isRunning = true;
        const saasConfig = window.saasConfig;
        saasConfig.api.getPage(saasConfig.config.appName).then((data) => {
            if (data.result) {
                GlobalData.data.pageList = data.response.result.map((dd) => {
                    var _a;
                    dd.page_config = (_a = dd.page_config) !== null && _a !== void 0 ? _a : {};
                    return dd;
                }).sort((a, b) => `${a.group}-${a.name}`.localeCompare(`${b.group}-${b.name}`));
            }
            else {
                GlobalData.data.isRunning = false;
                GlobalData.data.run();
            }
        });
    },
};
TriggerEvent.create(import.meta.url, {
    link: {
        title: '官方事件-畫面-頁面跳轉',
        fun: (gvc, widget, object) => {
            return {
                editor: () => {
                    return gvc.bindView(() => {
                        const id = gvc.glitter.getUUID();
                        function recursive() {
                            if (GlobalData.data.pageList.length === 0) {
                                GlobalData.data.run();
                                setTimeout(() => {
                                    recursive();
                                }, 200);
                            }
                            else {
                                gvc.notifyDataChange(id);
                            }
                        }
                        recursive();
                        setTimeout(() => {
                            gvc.notifyDataChange(id);
                        }, 1000);
                        return {
                            bind: id,
                            view: () => {
                                if (![
                                    { title: '內部連結', value: 'inlink' },
                                    { title: '外部連結', value: 'outlink' },
                                    { title: 'HashTag', value: 'hashTag' },
                                ].find((dd) => {
                                    return dd.value === object.link_change_type;
                                })) {
                                    object.link_change_type = 'inlink';
                                }
                                return ` ${EditorElem.h3('跳轉方式')}
                                    <select
                                        class="form-control form-select"
                                        onchange="${gvc.event((e) => {
                                    object.link_change_type = e.value;
                                    gvc.notifyDataChange(id);
                                })}"
                                    >
                                        ${[
                                    { title: '內部連結', value: 'inlink' },
                                    { title: '外部連結', value: 'outlink' },
                                    { title: 'HashTag', value: 'hashTag' },
                                ]
                                    .map((dd) => {
                                    return `<option value="${dd.value}" ${dd.value == object.link_change_type ? `selected` : ``}>
                                            ${dd.title}
                                        </option>`;
                                })
                                    .join('')}
                                    </select>
                                    ${(() => {
                                    var _a, _b;
                                    if (object.link_change_type === 'inlink') {
                                        object.stackControl = (_a = object.stackControl) !== null && _a !== void 0 ? _a : "home";
                                        return `
${EditorElem.select({
                                            title: '堆棧控制',
                                            gvc: gvc,
                                            def: object.stackControl,
                                            callback: (text) => {
                                                object.stackControl = text;
                                                widget.refreshComponent();
                                            },
                                            array: [{ title: '設為首頁', value: "home" }, {
                                                    title: '頁面跳轉',
                                                    value: "page"
                                                }],
                                        })}
${EditorElem.h3("選擇頁面")}
<select
                                            class="form-select form-control mt-2"
                                            onchange="${gvc.event((e) => {
                                            console.log(window.$(e).val());
                                            object.link = window.$(e).val();
                                        })}"
                                        >
                                            ${GlobalData.data.pageList.map((dd) => {
                                            var _a;
                                            object.link = (_a = object.link) !== null && _a !== void 0 ? _a : dd.tag;
                                            return `<option value="${dd.tag}" ${object.link === dd.tag ? `selected` : ``}>
                                                    ${dd.group}-${dd.name}
                                                </option>`;
                                        })}
                                        </select>`;
                                    }
                                    else if (object.link_change_type === 'outlink') {
                                        return gvc.glitter.htmlGenerate.editeInput({
                                            gvc: gvc,
                                            title: '',
                                            default: object.link,
                                            placeHolder: '輸入跳轉的連結',
                                            callback: (text) => {
                                                object.link = text;
                                                widget.refreshAll();
                                            },
                                        }) + EditorElem.select({
                                            gvc: gvc,
                                            title: '跳轉方式',
                                            def: (_b = object.changeType) !== null && _b !== void 0 ? _b : "location",
                                            array: [
                                                { title: "本地跳轉", value: "location" },
                                                { title: "打開新頁面", value: "newTab" }
                                            ],
                                            callback: (text) => {
                                                object.changeType = text;
                                                widget.refreshAll();
                                            },
                                        });
                                    }
                                    else {
                                        return gvc.glitter.htmlGenerate.editeInput({
                                            gvc: gvc,
                                            title: '',
                                            default: object.link,
                                            placeHolder: '輸入跳轉的HashTag',
                                            callback: (text) => {
                                                object.link = text;
                                                widget.refreshAll();
                                            },
                                        });
                                    }
                                })()}`;
                            },
                            divCreate: {},
                        };
                    });
                },
                event: () => {
                    var _a;
                    object.link_change_type = (_a = object.link_change_type) !== null && _a !== void 0 ? _a : object.type;
                    if (object.link_change_type === 'inlink') {
                        return new Promise(async (resolve, reject) => {
                            const url = new URL('./', location.href);
                            url.searchParams.set('page', object.link);
                            const saasConfig = window.saasConfig;
                            saasConfig.api.getPage(saasConfig.config.appName, object.link).then((data) => {
                                if (data.response.result.length === 0) {
                                    const url = new URL("./", location.href);
                                    url.searchParams.set('page', data.response.redirect);
                                    location.href = url.href;
                                    return;
                                }
                                if (object.stackControl === 'home') {
                                    gvc.glitter.htmlGenerate.setHome({
                                        app_config: saasConfig.appConfig,
                                        page_config: data.response.result[0].page_config,
                                        config: data.response.result[0].config,
                                        data: {},
                                        tag: object.link,
                                        option: {
                                            animation: gvc.glitter.animation.fade,
                                        }
                                    });
                                    resolve(true);
                                }
                                else {
                                    gvc.glitter.htmlGenerate.changePage({
                                        app_config: saasConfig.appConfig,
                                        page_config: data.response.result[0].page_config,
                                        config: data.response.result[0].config,
                                        data: {},
                                        tag: object.link,
                                        goBack: true,
                                        option: {
                                            animation: gvc.glitter.ut.frSize({
                                                sm: gvc.glitter.animation.fade
                                            }, gvc.glitter.animation.rightToLeft)
                                        }
                                    });
                                    resolve(true);
                                }
                            });
                        });
                    }
                    else if (object.link_change_type === 'hashTag') {
                        const yOffset = $("header").length > 0 ? -$("header").height() : 0;
                        const element = document.getElementsByClassName(`glitterTag${object.link}`)[0];
                        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                        window.scrollTo({ top: y, behavior: "smooth" });
                        return true;
                    }
                    else {
                        if (object.changeType === 'newTab') {
                            gvc.glitter.openNewTab(object.link);
                        }
                        else {
                            gvc.glitter.location.href = object.link;
                        }
                        return true;
                    }
                },
            };
        },
    },
    dialog: {
        title: '官方事件-畫面-彈跳視窗',
        fun: (gvc, widget, object, subData, element) => {
            return {
                editor: () => {
                    var _a;
                    const id = gvc.glitter.getUUID();
                    const glitter = gvc.glitter;
                    widget.data.coverData = (_a = widget.data.coverData) !== null && _a !== void 0 ? _a : {};
                    function recursive() {
                        if (GlobalData.data.pageList.length === 0) {
                            GlobalData.data.run();
                            setTimeout(() => {
                                recursive();
                            }, 200);
                        }
                        else {
                            gvc.notifyDataChange(id);
                        }
                    }
                    recursive();
                    return gvc.bindView(() => {
                        return {
                            bind: id,
                            view: () => {
                                return [`<select
                                            class="form-select form-control mt-2"
                                            onchange="${gvc.event((e) => {
                                        object.link = window.$(e).val();
                                    })}"
                                        >
                                            ${GlobalData.data.pageList.map((dd) => {
                                        var _a;
                                        object.link = (_a = object.link) !== null && _a !== void 0 ? _a : dd.tag;
                                        return `<option value="${dd.tag}" ${object.link === dd.tag ? `selected` : ``}>
                                                    ${dd.group}-${dd.name}
                                                </option>`;
                                    })}
                                        </select>`, TriggerEvent.editer(gvc, widget, widget.data.coverData, {
                                        hover: true,
                                        option: [],
                                        title: "夾帶資料-[將存於新頁面的gvc.getBundle().carryData之中]"
                                    })].join('');
                            },
                            divCreate: {}
                        };
                    });
                },
                event: () => {
                    subData = subData !== null && subData !== void 0 ? subData : {};
                    return new Promise(async (resolve, reject) => {
                        const data = await TriggerEvent.trigger({
                            gvc, widget, clickEvent: widget.data.coverData, subData
                        });
                        gvc.glitter.innerDialog((gvc) => {
                            gvc.getBundle().carryData = data;
                            return new Promise(async (resolve, reject) => {
                                const view = await component.render(gvc, {
                                    data: {
                                        tag: object.link
                                    }
                                }, [], [], subData).view();
                                resolve(view);
                            });
                        }, gvc.glitter.getUUID());
                    });
                }
            };
        }
    },
    close_dialog: {
        title: '官方事件-畫面-視窗關閉',
        fun: (gvc, widget, object, subData, element) => {
            return {
                editor: () => {
                    return ``;
                },
                event: () => {
                    gvc.closeDialog();
                    return true;
                }
            };
        }
    },
    drawer: {
        title: '官方事件-畫面-左側導覽列',
        fun: (gvc, widget, object, subData, element) => {
            return {
                editor: () => {
                    const id = gvc.glitter.getUUID();
                    function recursive() {
                        if (GlobalData.data.pageList.length === 0) {
                            GlobalData.data.run();
                            setTimeout(() => {
                                recursive();
                            }, 200);
                        }
                        else {
                            gvc.notifyDataChange(id);
                        }
                    }
                    recursive();
                    return gvc.bindView(() => {
                        return {
                            bind: id,
                            view: () => {
                                return `${EditorElem.h3("選擇頁面")}
                       <select
                                            class="form-select form-control mt-2"
                                            onchange="${gvc.event((e) => {
                                    console.log(window.$(e).val());
                                    object.link = window.$(e).val();
                                })}"
                                        >
                                            ${GlobalData.data.pageList.map((dd) => {
                                    var _a;
                                    object.link = (_a = object.link) !== null && _a !== void 0 ? _a : dd.tag;
                                    return `<option value="${dd.tag}" ${object.link === dd.tag ? `selected` : ``}>
                                                    ${dd.group}-${dd.name}
                                                </option>`;
                                })}
                                        </select>
${gvc.glitter.htmlGenerate.styleEditor(object, gvc).editor(gvc, () => {
                                    widget.refreshComponent();
                                }, "背景樣式")}
`;
                            },
                            divCreate: {}
                        };
                    });
                },
                event: () => {
                    let fal = 0;
                    let data = undefined;
                    async function getData() {
                        return new Promise(async (resolve, reject) => {
                            const saasConfig = window.saasConfig;
                            BaseApi.create({
                                "url": saasConfig.config.url + `/api/v1/template?appName=${saasConfig.config.appName}&tag=${object.link}`,
                                "type": "GET",
                                "timeout": 0,
                                "headers": {
                                    "Content-Type": "application/json"
                                }
                            }).then((d2) => {
                                if (!d2.result) {
                                    fal += 1;
                                    if (fal < 20) {
                                        setTimeout(() => {
                                            getData();
                                        }, 200);
                                    }
                                }
                                else {
                                    data = d2.response.result[0];
                                    resolve(data);
                                }
                            });
                        });
                    }
                    getData().then((data) => {
                        const id = gvc.glitter.getUUID();
                        gvc.glitter.setDrawer(`<div class="w-100 h-100 ${gvc.glitter.htmlGenerate.styleEditor(object, gvc).class()}"
style="${gvc.glitter.htmlGenerate.styleEditor(object, gvc).style()}"
>${gvc.bindView(() => {
                            return {
                                bind: id,
                                view: () => {
                                    if (!data) {
                                        return ``;
                                    }
                                    return new window.glitter.htmlGenerate(data.config, [], subData !== null && subData !== void 0 ? subData : {}).render(gvc);
                                },
                                divCreate: {}
                            };
                        })}</div>`, () => {
                            gvc.glitter.openDrawer();
                        });
                    });
                },
            };
        },
    },
    reload: {
        title: '官方事件-觸發-刷新瀏覽器',
        fun: (gvc, widget, object, subData, element) => {
            return {
                editor: () => {
                    return ``;
                },
                event: () => {
                    location.reload();
                },
            };
        },
    },
    reloadPage: {
        title: '官方事件-觸發-刷新頁面',
        fun: (gvc, widget, object, subData, element) => {
            return {
                editor: () => {
                    return ``;
                },
                event: () => {
                    gvc.recreateView();
                },
            };
        },
    },
    code: {
        title: '官方事件-觸發-代碼區塊',
        fun: (gvc, widget, object, subData, element) => {
            return {
                editor: () => {
                    var _a;
                    return gvc.glitter.htmlGenerate.editeText({
                        gvc: gvc,
                        title: "代碼區塊",
                        default: (_a = object.code) !== null && _a !== void 0 ? _a : "",
                        placeHolder: "請輸入代碼區塊",
                        callback: (text) => {
                            object.code = text;
                        }
                    });
                },
                event: () => {
                    return new Promise(async (resolve, reject) => {
                        var _a;
                        try {
                            const a = (eval(object.code));
                            if (a.then) {
                                a.then((data) => {
                                    resolve(data);
                                });
                            }
                            else {
                                resolve(a);
                            }
                        }
                        catch (e) {
                            resolve((_a = object.errorCode) !== null && _a !== void 0 ? _a : false);
                        }
                    });
                },
            };
        },
    },
    codeArray: {
        title: '官方事件-觸發-多項事件判斷',
        fun: (gvc, widget, object, subData, element) => {
            return {
                editor: () => {
                    return gvc.bindView(() => {
                        const id = gvc.glitter.getUUID();
                        return {
                            bind: id,
                            view: () => {
                                var _a;
                                object.eventList = (_a = object.eventList) !== null && _a !== void 0 ? _a : [];
                                try {
                                    return EditorElem.arrayItem({
                                        originalArray: object.eventList,
                                        gvc: gvc,
                                        title: '事件列表',
                                        array: object.eventList.map((dd, index) => {
                                            var _a, _b;
                                            dd.yesEvent = (_a = dd.yesEvent) !== null && _a !== void 0 ? _a : {};
                                            dd.trigger = (_b = dd.trigger) !== null && _b !== void 0 ? _b : {};
                                            return {
                                                title: dd.title || `事件:${index + 1}`,
                                                expand: dd,
                                                innerHtml: (() => {
                                                    var _a;
                                                    return gvc.map([
                                                        gvc.glitter.htmlGenerate.editeInput({
                                                            gvc: gvc,
                                                            title: '事件標題',
                                                            default: (_a = dd.title) !== null && _a !== void 0 ? _a : "",
                                                            placeHolder: '請輸入事件標題',
                                                            callback: (text) => {
                                                                dd.title = text;
                                                                gvc.notifyDataChange(id);
                                                            },
                                                        }),
                                                        TriggerEvent.editer(gvc, widget, dd.yesEvent, {
                                                            hover: true,
                                                            option: [],
                                                            title: "判斷式-返回true則執行事件"
                                                        }),
                                                        TriggerEvent.editer(gvc, widget, dd.trigger, {
                                                            hover: true,
                                                            option: [],
                                                            title: "執行事件"
                                                        })
                                                    ]);
                                                }),
                                                minus: gvc.event(() => {
                                                    object.eventList.splice(index, 1);
                                                    gvc.notifyDataChange(id);
                                                }),
                                            };
                                        }),
                                        expand: object,
                                        plus: {
                                            title: '添加事件判斷',
                                            event: gvc.event(() => {
                                                object.eventList.push({ yesEvent: {}, trigger: {} });
                                                gvc.notifyDataChange(id);
                                            }),
                                        },
                                        refreshComponent: () => {
                                            gvc.notifyDataChange(id);
                                        }
                                    });
                                }
                                catch (e) {
                                    return ``;
                                }
                            },
                            divCreate: {}
                        };
                    });
                },
                event: () => {
                    return new Promise(async (resolve, reject) => {
                        var _a;
                        try {
                            for (const a of object.eventList) {
                                const result = await TriggerEvent.trigger({
                                    gvc: gvc,
                                    widget: widget,
                                    clickEvent: a.yesEvent,
                                    subData: subData
                                });
                                if (result) {
                                    const response = await TriggerEvent.trigger({
                                        gvc: gvc,
                                        widget: widget,
                                        clickEvent: a.trigger,
                                        subData: subData
                                    });
                                    resolve(response);
                                    break;
                                }
                            }
                            resolve(true);
                        }
                        catch (e) {
                            resolve((_a = object.errorCode) !== null && _a !== void 0 ? _a : false);
                        }
                    });
                },
            };
        },
    },
    registerNotify: {
        title: '官方事件-推播-註冊推播頻道',
        fun: (gvc, widget, object, subData, element) => {
            var _a;
            object.getEvent = (_a = object.getEvent) !== null && _a !== void 0 ? _a : {};
            return {
                editor: () => {
                    return TriggerEvent.editer(gvc, widget, object.getEvent, {
                        option: [],
                        title: "取得推播頻道",
                        hover: false
                    });
                },
                event: () => {
                    return new Promise(async (resolve, reject) => {
                        var _a;
                        try {
                            const topic = await TriggerEvent.trigger({
                                gvc, widget, clickEvent: object.getEvent, subData: subData, element
                            });
                            if (typeof topic != "object") {
                                gvc.glitter.runJsInterFace("regNotification", {
                                    topic: topic
                                }, (response) => {
                                });
                            }
                            else {
                                topic.map((dd) => {
                                    gvc.glitter.runJsInterFace("regNotification", {
                                        topic: dd
                                    }, (response) => {
                                    });
                                });
                            }
                            resolve(true);
                        }
                        catch (e) {
                            resolve((_a = object.errorCode) !== null && _a !== void 0 ? _a : false);
                        }
                    });
                },
            };
        },
    },
    getFcm: {
        title: '官方事件-推播-取得推播ID',
        fun: (gvc, widget, object, subData, element) => {
            return {
                editor: () => {
                    return ``;
                },
                event: () => {
                    return new Promise(async (resolve, reject) => {
                        var _a;
                        try {
                            gvc.glitter.runJsInterFace("getFireBaseToken", {}, (response) => {
                                resolve(response.token);
                            });
                        }
                        catch (e) {
                            resolve((_a = object.errorCode) !== null && _a !== void 0 ? _a : false);
                        }
                    });
                },
            };
        },
    },
    deleteFireBaseToken: {
        title: '官方事件-推播-移除推播註冊',
        fun: (gvc, widget, object, subData, element) => {
            return {
                editor: () => {
                    return ``;
                },
                event: () => {
                    return new Promise(async (resolve, reject) => {
                        var _a;
                        try {
                            gvc.glitter.runJsInterFace("deleteFireBaseToken", {}, (response) => {
                                resolve(true);
                            });
                        }
                        catch (e) {
                            resolve((_a = object.errorCode) !== null && _a !== void 0 ? _a : false);
                        }
                    });
                },
            };
        },
    },
    api: {
        title: "官方事件-Lambda-API",
        fun: (gvc, widget, object, subData, element) => {
            var _a, _b, _c, _d;
            object.postEvent = (_a = object.postEvent) !== null && _a !== void 0 ? _a : {};
            object.postType = (_b = object.postType) !== null && _b !== void 0 ? _b : "POST";
            object.queryParameters = (_c = object.queryParameters) !== null && _c !== void 0 ? _c : [];
            object.queryExpand = (_d = object.queryExpand) !== null && _d !== void 0 ? _d : {};
            return {
                editor: () => {
                    return gvc.bindView(() => {
                        const id = gvc.glitter.getUUID();
                        return {
                            bind: id,
                            view: () => {
                                var _a;
                                return gvc.map([
                                    EditorElem.select({
                                        title: "方法",
                                        gvc: gvc,
                                        def: object.postType,
                                        array: ['GET', 'POST', 'PUT', 'DELETE'],
                                        callback: (text) => {
                                            object.postType = text;
                                            gvc.notifyDataChange(id);
                                        }
                                    }),
                                    gvc.glitter.htmlGenerate.editeInput({
                                        gvc: gvc,
                                        title: "Router路徑",
                                        default: (_a = object.router) !== null && _a !== void 0 ? _a : "",
                                        placeHolder: "",
                                        callback: (text) => {
                                            object.router = text;
                                            gvc.notifyDataChange(id);
                                        }
                                    }),
                                    TriggerEvent.editer(gvc, widget, object.postEvent, {
                                        hover: false,
                                        option: [],
                                        title: "傳送給API的資料"
                                    }),
                                    EditorElem.arrayItem({
                                        originalArray: object.queryParameters,
                                        gvc: gvc,
                                        title: "Query參數",
                                        array: object.queryParameters.map((rowData, rowIndex) => {
                                            var _a;
                                            return {
                                                title: `第${rowIndex + 1}列參數`,
                                                expand: rowData,
                                                innerHtml: gvc.map([
                                                    gvc.glitter.htmlGenerate.editeInput({
                                                        gvc: gvc,
                                                        title: "Key值",
                                                        default: (_a = rowData.key) !== null && _a !== void 0 ? _a : '',
                                                        placeHolder: '請輸入搜索Key值',
                                                        callback: (text) => {
                                                            rowData.key = text;
                                                            gvc.notifyDataChange(id);
                                                        }
                                                    }),
                                                    TriggerEvent.editer(gvc, widget, rowData, {
                                                        hover: false,
                                                        option: [],
                                                        title: "參數取得"
                                                    })
                                                ]),
                                                minus: gvc.event(() => {
                                                    object.queryParameters.splice(rowIndex, 1);
                                                    gvc.notifyDataChange(id);
                                                }),
                                            };
                                        }),
                                        expand: object.queryExpand,
                                        plus: {
                                            title: '添加參數',
                                            event: gvc.event(() => {
                                                object.queryParameters.push({ key: '', value: "" });
                                                gvc.notifyDataChange(id);
                                            }),
                                        },
                                        refreshComponent: () => {
                                            gvc.notifyDataChange(id);
                                        }
                                    })
                                ]);
                            }
                        };
                    });
                },
                event: () => {
                    return new Promise(async (resolve, reject) => {
                        const data = await TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.postEvent,
                            subData: subData,
                            element: element
                        });
                        let query = [];
                        for (const b of object.queryParameters) {
                            query.push({
                                key: b.key,
                                value: (await TriggerEvent.trigger({
                                    gvc: gvc,
                                    widget: widget,
                                    clickEvent: b,
                                    subData: subData,
                                    element: element
                                }))
                            });
                        }
                        let queryString = "";
                        if (query.length > 0) {
                            queryString = '&';
                        }
                        queryString += query.map((dd) => {
                            return `${dd.key}=${dd.value}`;
                        }).join('&');
                        BaseApi.create({
                            "url": (object.postType === 'GET') ? `${getBaseUrl()}/api-public/v1/lambda?data=${(typeof data === 'object') ? JSON.stringify(data) : data}&router=${object.router}${queryString}` :
                                `${getBaseUrl()}/api-public/v1/lambda?1=1${queryString}`,
                            "type": object.postType,
                            "timeout": 0,
                            "headers": {
                                "g-app": getConfig().config.appName,
                                "Content-Type": "application/json",
                                "Authorization": GlobalUser.token
                            },
                            "data": (object.postType === 'GET') ? undefined : JSON.stringify({
                                "router": object.router,
                                "data": data
                            }),
                        }).then((res) => {
                            if (res.result) {
                                resolve(res.response);
                            }
                            else {
                                resolve(undefined);
                            }
                        });
                    });
                }
            };
        }
    }
});
function getConfig() {
    const saasConfig = window.saasConfig;
    return saasConfig;
}
function getBaseUrl() {
    return getConfig().config.url;
}
