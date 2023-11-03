var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
        title: '官方事件 / 畫面 / 頁面跳轉',
        subContent: questionText([
            {
                title: "內部連結跳轉",
                content: `使用此事件可以跳轉至GLITTER內部頁面，採用SPA的開發技術，來降低頁面延遲，使轉場的效果更加順暢。`
            },
            {
                title: "外連結跳轉",
                content: `使用此事件可以跳轉至外部頁面。`
            },
            {
                title: "HashTag",
                content: `使用此事件可以滾動至此標籤的位置。`
            }
        ]),
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
                        return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
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
                        }));
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
        title: '官方事件 / 畫面 / 彈跳視窗',
        subContent: questionText([
            {
                title: "打開彈跳視窗",
                content: `使用此事件可以開啟彈跳視窗，可以實現 表單 / 加載動畫 / 錯誤提醒 ....等效果都可以透過頁面彈窗來進行實現。`
            },
            {
                title: "關閉彈跳視窗",
                content: `於跳轉的頁面執行 <span style="color:#295ed1;">gvc.closeDialog()</span> 即可關閉彈跳視窗。`
            },
            {
                title: "夾帶資料",
                content: `返回要挾帶的資料並且於彈跳視窗的頁面中，透過 <span style="color:#295ed1;">gvc.getBundle().carryData</span>  ，來取得夾帶內容。`
            }
        ]),
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
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        const data = yield TriggerEvent.trigger({
                            gvc, widget, clickEvent: widget.data.coverData, subData
                        });
                        gvc.glitter.innerDialog((gvc) => {
                            gvc.getBundle().carryData = data;
                            return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                                const view = yield component.render(gvc, {
                                    data: {
                                        tag: object.link
                                    }
                                }, [], [], subData).view();
                                resolve(view);
                            }));
                        }, gvc.glitter.getUUID());
                    }));
                }
            };
        }
    },
    close_dialog: {
        title: '官方事件 / 畫面 / 視窗關閉',
        subContent: questionText([
            {
                title: "當前視窗",
                content: `僅關閉當前的彈跳視窗。`
            },
            {
                title: "所有視窗",
                content: `關閉所有彈跳視窗。`
            },
            {
                title: "標籤",
                content: `關閉具有此標籤的視窗。`
            }
        ]),
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
        title: '官方事件 / 畫面 / 左側導覽列',
        subContent: `<div class="d-flex flex-column w-100 align-items-center justify-content-center"
                                             style="height:400px;">
<video src="video/open_navagation.mov" class="mx-auto " style="max-width: 100%;height: 300px;" loop
                                                           autoplay>
                                                           
</video>
                                            <h3 class=" text-center px-4 mt-2" style="font-size:18px;">
                                                選擇頁面並嵌入來實現導覽列的效果。
                                            </h3>
                                        </div>`,
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
                    function getData() {
                        return __awaiter(this, void 0, void 0, function* () {
                            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
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
                            }));
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
        title: '官方事件 / 觸發 / 刷新瀏覽器',
        subContent: `<div class="w-100 alert alert-light" style="white-space: normal;word-break: break-word;">透過<span class="mx-2" style="color:#295ed1;">location.reload()</span>來刷新整個瀏覽器。</div>`,
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
        title: '官方事件 / 觸發 / 刷新頁面',
        subContent: `<div class="w-100 alert alert-light" style="white-space: normal;word-break: break-word;">透過<span class="mx-2" style="color:#295ed1;">gvc.recreateView()</span>來刷新當前頁面。</div>`,
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
        title: '官方事件 / 觸發 / 代碼區塊',
        subContent: `<div class="w-100 alert alert-light" style="white-space: normal;word-break: break-word;">於內容編輯器中，直接輸入代碼來執行事件。</div>`,
        fun: (gvc, widget, object, subData, element) => {
            return {
                editor: () => {
                    object.codeVersion = 'v2';
                    const html = String.raw;
                    return html `<div style="width:600px;">
${EditorElem.codeEditor({
                        gvc: gvc,
                        height: 300,
                        initial: object.code,
                        title: "代碼區塊",
                        callback: (text) => {
                            object.code = text;
                        }
                    })}
</div>`;
                },
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        var _a;
                        try {
                            const a = (object.codeVersion == 'v2') ? (eval(`(()=>{
    ${object.code}
                            })()`)) : (eval(object.code));
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
                    }));
                },
            };
        },
    },
    codeArray: {
        title: '官方事件 / 觸發 / 多項事件判斷',
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
                                        title: '',
                                        array: (() => {
                                            return object.eventList.map((dd, index) => {
                                                var _a, _b;
                                                dd.yesEvent = (_a = dd.yesEvent) !== null && _a !== void 0 ? _a : {};
                                                dd.trigger = (_b = dd.trigger) !== null && _b !== void 0 ? _b : {};
                                                return {
                                                    title: dd.title || `事件:${index + 1}`,
                                                    expand: dd,
                                                    innerHtml: ((gvc) => {
                                                        var _a;
                                                        return [
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
                                                            `<div class="mt-2"></div>`,
                                                            TriggerEvent.editer(gvc, widget, dd.trigger, {
                                                                hover: true,
                                                                option: [],
                                                                title: "執行事件"
                                                            })
                                                        ].join('');
                                                    }),
                                                    minus: gvc.event(() => {
                                                        object.eventList.splice(index, 1);
                                                        gvc.notifyDataChange(id);
                                                    }),
                                                };
                                            });
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
                                        },
                                        customEditor: false
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
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        var _a;
                        try {
                            for (const a of object.eventList) {
                                const result = yield TriggerEvent.trigger({
                                    gvc: gvc,
                                    widget: widget,
                                    clickEvent: a.yesEvent,
                                    subData: subData
                                });
                                if (result) {
                                    const response = yield TriggerEvent.trigger({
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
                    }));
                },
            };
        },
    },
    registerNotify: {
        title: '官方事件 / 推播 / 註冊推播頻道',
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
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        var _a;
                        try {
                            const topic = yield TriggerEvent.trigger({
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
                    }));
                },
            };
        },
    },
    getFcm: {
        title: '官方事件 / 推播 / 取得推播ID',
        fun: (gvc, widget, object, subData, element) => {
            return {
                editor: () => {
                    return ``;
                },
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        var _a;
                        try {
                            gvc.glitter.runJsInterFace("getFireBaseToken", {}, (response) => {
                                resolve(response.token);
                            });
                        }
                        catch (e) {
                            resolve((_a = object.errorCode) !== null && _a !== void 0 ? _a : false);
                        }
                    }));
                },
            };
        },
    },
    deleteFireBaseToken: {
        title: '官方事件 / 推播 / 移除推播註冊',
        fun: (gvc, widget, object, subData, element) => {
            return {
                editor: () => {
                    return ``;
                },
                event: () => {
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        var _a;
                        try {
                            gvc.glitter.runJsInterFace("deleteFireBaseToken", {}, (response) => {
                                resolve(true);
                            });
                        }
                        catch (e) {
                            resolve((_a = object.errorCode) !== null && _a !== void 0 ? _a : false);
                        }
                    }));
                },
            };
        },
    },
    api: {
        title: "官方事件 / Lambda / API",
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
                    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        const data = yield TriggerEvent.trigger({
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
                                value: (yield TriggerEvent.trigger({
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
                    }));
                }
            };
        }
    }
});
function questionText(data) {
    return `<div class="bg-secondary rounded-3 py-2 px-2 ">
          <h2 class="text-center my-3 mt-2" style="font-size:22px;">使用方法說明</h2>
             <div class="accordion mx-2" id="faq">
                ${data.map((dd, index) => {
        return ` <div class="accordion-item border-0 rounded-3 shadow-sm mb-3">
                  <h3 class="accordion-header">
                    <button class="accordion-button shadow-none rounded-3 ${(index === 0) ? '' : 'collapsed'}" type="button" data-bs-toggle="collapse" data-bs-target="#q-${index}" aria-expanded="false" aria-controls="q-1">${dd.title}</button>
                  </h3>
                  <div class="accordion-collapse collapse ${(index === 0) ? 'show' : ''}" id="q-${index}" data-bs-parent="#faq" style="">
                    <div class="accordion-body fs-sm pt-0">
                     ${dd.content}
                    </div>
                  </div>
                </div>`;
    }).join('')}
              
              </div>
        </div>`;
}
function getConfig() {
    const saasConfig = window.saasConfig;
    return saasConfig;
}
function getBaseUrl() {
    return getConfig().config.url;
}
