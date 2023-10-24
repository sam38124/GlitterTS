var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Plugin } from "../../glitterBundle/plugins/plugin-creater.js";
import { TriggerEvent } from "../../glitterBundle/plugins/trigger-event.js";
import { EditorElem } from "../../glitterBundle/plugins/editor-elem.js";
import { component } from "./component.js";
import { BaseApi } from "../../api/base.js";
export const array_item = Plugin.createComponent(import.meta.url, (glitter, editMode) => {
    return {
        render: (gvc, widget, setting, hoverID, subData) => {
            var _a, _b, _c;
            widget.data.empty = (_a = widget.data.empty) !== null && _a !== void 0 ? _a : {
                data: {}
            };
            widget.data.empty.refreshComponent = () => {
            };
            widget.data.loading = (_b = widget.data.loading) !== null && _b !== void 0 ? _b : {
                data: {}
            };
            widget.data.container = (_c = widget.data.container) !== null && _c !== void 0 ? _c : {};
            return {
                view: () => {
                    const id = glitter.getUUID();
                    let loading = ``;
                    let views = undefined;
                    const vm = {
                        loading: true
                    };
                    new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                        let view = [];
                        let createOption = (() => {
                            return {
                                class: glitter.htmlGenerate.styleEditor(widget.data).class(),
                                style: glitter.htmlGenerate.styleEditor(widget.data).style()
                            };
                        });
                        const data = (yield TriggerEvent.trigger({
                            gvc, widget, clickEvent: widget.data, subData: subData
                        }));
                        function getView() {
                            return __awaiter(this, void 0, void 0, function* () {
                                let cfMap = {};
                                for (const a of data) {
                                    yield new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                                        var _a;
                                        const saasConfig = window.saasConfig;
                                        let fal = 0;
                                        let tag = widget.data.tag;
                                        let carryData = widget.data.carryData;
                                        let subData = a;
                                        for (const b of widget.data.list) {
                                            b.evenet = (_a = b.evenet) !== null && _a !== void 0 ? _a : {};
                                            try {
                                                if (b.triggerType === 'trigger') {
                                                    const result = yield new Promise((resolve, reject) => {
                                                        (TriggerEvent.trigger({
                                                            gvc: gvc,
                                                            widget: widget,
                                                            clickEvent: b.evenet,
                                                            subData
                                                        })).then((data) => {
                                                            resolve(data);
                                                        });
                                                    });
                                                    if (result) {
                                                        tag = b.tag;
                                                        carryData = b.carryData;
                                                        break;
                                                    }
                                                }
                                                else {
                                                    if ((yield eval(b.code)) === true) {
                                                        tag = b.tag;
                                                        carryData = b.carryData;
                                                        break;
                                                    }
                                                }
                                            }
                                            catch (e) {
                                            }
                                        }
                                        try {
                                            subData.carryData = yield TriggerEvent.trigger({
                                                gvc: gvc,
                                                clickEvent: carryData,
                                                widget: widget,
                                                subData: subData
                                            });
                                        }
                                        catch (e) {
                                        }
                                        if (!cfMap[tag]) {
                                            cfMap[tag] = yield new Promise((resolve, reject) => {
                                                function getData() {
                                                    BaseApi.create({
                                                        "url": saasConfig.config.url + `/api/v1/template?appName=${saasConfig.config.appName}&tag=${tag}`,
                                                        "type": "GET",
                                                        "timeout": 0,
                                                        "headers": {
                                                            "Content-Type": "application/json"
                                                        }
                                                    }).then((d2) => {
                                                        try {
                                                            if (!d2.result) {
                                                                fal += 1;
                                                                if (fal < 20) {
                                                                    setTimeout(() => {
                                                                        getData();
                                                                    }, 200);
                                                                }
                                                            }
                                                            else {
                                                                resolve(d2.response.result[0]);
                                                            }
                                                        }
                                                        catch (e) {
                                                        }
                                                    });
                                                }
                                                getData();
                                            });
                                        }
                                        const config = JSON.parse(JSON.stringify(cfMap[tag].config));
                                        config.map((dd) => {
                                            glitter.htmlGenerate.renameWidgetID(dd);
                                        });
                                        view.push(new glitter.htmlGenerate(config, [], subData).render(gvc, undefined, createOption));
                                        resolve(true);
                                    }));
                                }
                                const data2 = view.join('');
                                resolve(data2);
                            });
                        }
                        getView().then(r => { });
                    })).then((data) => {
                        var _a;
                        vm.loading = false;
                        views = data;
                        glitter.share.notify = (_a = glitter.share.notify) !== null && _a !== void 0 ? _a : {};
                        gvc.notifyDataChange(id);
                    });
                    return gvc.bindView(() => {
                        return {
                            bind: id,
                            view: () => {
                                if (vm.loading) {
                                    return component.render(gvc, widget.data.loading, setting, hoverID, subData).view() || `<span>loading...</span>`;
                                }
                                else if (views) {
                                    return views;
                                }
                                else {
                                    return component.render(gvc, widget.data.empty, setting, hoverID, subData).view();
                                }
                            },
                            onCreate: () => {
                            },
                            divCreate: {
                                class: glitter.htmlGenerate.styleEditor(widget.data.container).class(),
                                style: glitter.htmlGenerate.styleEditor(widget.data.container).style(),
                                option: [{ key: 'arrayItem', value: "true" }]
                            }
                        };
                    });
                },
                editor: () => {
                    return gvc.map([
                        glitter.htmlGenerate.styleEditor(widget.data.container).editor(gvc, () => {
                            widget.refreshComponent();
                        }, "容器樣式"),
                        `<div class="my-2"></div>`,
                        glitter.htmlGenerate.styleEditor(widget.data).editor(gvc, () => {
                            widget.refreshComponent();
                        }, "元件樣式"),
                        `<div class="alert alert-info mt-2" style="white-space:normal;">
透過返回陣列來進行遍歷，並產生元件畫面．
${TriggerEvent.editer(gvc, widget, widget.data, {
                            hover: false,
                            option: [],
                            title: "設定資料來源"
                        })}
</div>`,
                        `<div class="border-white border p-2  mt-3" style="background:#a2d4ed;">
${EditorElem.h3("嵌入模塊")}
${component.render(gvc, widget, setting, hoverID, subData).editor()}
</div>`,
                        `<div class="border-white border p-2  mt-3" style="background:#a2d4ed;">
${EditorElem.h3("空資料顯示")}
${component.render(gvc, widget.data.empty, setting, hoverID, subData).editor()}
</div>`, `<div class="border-white border p-2  mt-3" style="background:#a2d4ed;">
${EditorElem.h3("加載中顯示")}
${component.render(gvc, widget.data.loading, setting, hoverID, subData).editor()}
</div>`,
                    ]);
                },
            };
        }
    };
});
