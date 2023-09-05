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
                    return new Promise(async (resolve, reject) => {
                        const id = glitter.getUUID();
                        const loading = await component.render(gvc, widget.data.loading, setting, hoverID, subData).view();
                        let views = undefined;
                        new Promise(async (resolve, reject) => {
                            let view = [];
                            let createOption = (() => {
                                return {
                                    class: glitter.htmlGenerate.styleEditor(widget.data).class(),
                                    style: glitter.htmlGenerate.styleEditor(widget.data).style()
                                };
                            });
                            const data = (await TriggerEvent.trigger({
                                gvc, widget, clickEvent: widget.data, subData: subData
                            }));
                            async function getView() {
                                let cfMap = {};
                                for (const a of data) {
                                    await new Promise(async (resolve, reject) => {
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
                                                    const result = await new Promise((resolve, reject) => {
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
                                                    if ((await eval(b.code)) === true) {
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
                                            subData.carryData = await TriggerEvent.trigger({
                                                gvc: gvc,
                                                clickEvent: carryData,
                                                widget: widget,
                                                subData: subData
                                            });
                                        }
                                        catch (e) {
                                        }
                                        if (!cfMap[tag]) {
                                            cfMap[tag] = await new Promise((resolve, reject) => {
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
                                        view.push(new glitter.htmlGenerate(JSON.parse(JSON.stringify(cfMap[tag].config)), [], subData).render(gvc, undefined, createOption));
                                        resolve(true);
                                    });
                                }
                                const data2 = view.join('') || (await component.render(gvc, widget.data.empty, setting, hoverID, subData, {
                                    createOption: {}
                                }).view());
                                resolve(data2);
                            }
                            getView().then(r => {
                            });
                        }).then((data) => {
                            views = data;
                            gvc.notifyDataChange(id);
                        });
                        resolve(gvc.bindView(() => {
                            return {
                                bind: id,
                                view: () => {
                                    if (views) {
                                        return views;
                                    }
                                    try {
                                        return loading;
                                    }
                                    catch (e) {
                                        return ``;
                                    }
                                },
                                onCreate: () => {
                                },
                                divCreate: {
                                    class: glitter.htmlGenerate.styleEditor(widget.data.container).class(),
                                    style: glitter.htmlGenerate.styleEditor(widget.data.container).style()
                                }
                            };
                        }));
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
