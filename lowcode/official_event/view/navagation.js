var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { TriggerEvent } from "../../glitterBundle/plugins/trigger-event.js";
import { EditorElem } from "../../glitterBundle/plugins/editor-elem.js";
import { BaseApi } from "../../glitterBundle/api/base.js";
import { GlobalData } from "../event.js";
TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            var _a;
            widget.data.action = (_a = widget.data.action) !== null && _a !== void 0 ? _a : "auto";
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
                       ${[
                                    `<select
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
                                        </select>`,
                                    gvc.glitter.htmlGenerate.styleEditor(object, gvc).editor(gvc, () => {
                                        widget.refreshComponent();
                                    }, "背景樣式"),
                                    EditorElem.select({
                                        title: '行為',
                                        gvc: gvc,
                                        def: widget.data.action,
                                        array: [{
                                                title: "設置導覽列",
                                                value: "manual"
                                            }, {
                                                title: "設置並開啟導覽列",
                                                value: "auto"
                                            }],
                                        callback: (text) => {
                                            widget.data.action = text;
                                            widget.refreshComponent();
                                        }
                                    })
                                ].join(`<div class="my-2"></div>`)}
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
                        gvc.glitter.setDrawer(`  <!-- tag=${object.link} -->
  <div class="w-100 h-100 ${gvc.glitter.htmlGenerate.styleEditor(object, gvc).class()}"
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
                            if (widget.data.action === 'auto') {
                                gvc.glitter.openDrawer();
                            }
                        });
                    });
                },
            };
        }
    };
});
