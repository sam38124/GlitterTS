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
import { BaseApi } from "../../api/base.js";
import { TriggerEvent } from "../../glitterBundle/plugins/trigger-event.js";
import { EditorElem } from "../../glitterBundle/plugins/editor-elem.js";
export const component = Plugin.createComponent(import.meta.url, (glitter, editMode) => {
    return {
        render: (gvc, widget, setting, hoverID, subData, htmlGenerate) => {
            var _a;
            widget.data.list = (_a = widget.data.list) !== null && _a !== void 0 ? _a : [];
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
                            onInitial: () => {
                                const target = document.querySelector(`[gvc-id="${gvc.id(tempView)}"]`);
                                let data = undefined;
                                const saasConfig = window.saasConfig;
                                let fal = 0;
                                let tag = widget.data.tag;
                                let carryData = widget.data.carryData;
                                function getData() {
                                    var _a;
                                    return __awaiter(this, void 0, void 0, function* () {
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
                                                    if (b.codeVersion === 'v2') {
                                                        if ((yield eval(`(()=>{
                                              ${b.code}
                                                })()`)) === true) {
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
                                            }
                                            catch (e) { }
                                        }
                                        let sub = JSON.parse(JSON.stringify(subData));
                                        try {
                                            sub.carryData = yield TriggerEvent.trigger({
                                                gvc: gvc,
                                                clickEvent: carryData,
                                                widget: widget,
                                                subData: subData
                                            });
                                        }
                                        catch (e) {
                                        }
                                        BaseApi.create({
                                            "url": saasConfig.config.url + `/api/v1/template?appName=${saasConfig.config.appName}&tag=${encodeURIComponent(tag)}`,
                                            "type": "GET",
                                            "timeout": 0,
                                            "headers": {
                                                "Content-Type": "application/json"
                                            }
                                        }).then((d2) => {
                                            var _a;
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
                                                    data = d2.response.result[0];
                                                    data.config.map((dd) => {
                                                        glitter.htmlGenerate.renameWidgetID(dd);
                                                    });
                                                    let createOption = (_a = (htmlGenerate !== null && htmlGenerate !== void 0 ? htmlGenerate : {}).createOption) !== null && _a !== void 0 ? _a : {};
                                                    target.outerHTML = new glitter.htmlGenerate(data.config, [], sub).render(gvc, undefined, createOption !== null && createOption !== void 0 ? createOption : {});
                                                }
                                            }
                                            catch (e) {
                                            }
                                        });
                                    });
                                }
                                getData();
                            },
                            onDestroy: () => {
                            },
                        };
                    });
                },
                editor: () => {
                    const id = glitter.getUUID();
                    const data = {
                        dataList: undefined
                    };
                    const saasConfig = window.saasConfig;
                    function getData() {
                        BaseApi.create({
                            "url": saasConfig.config.url + `/api/v1/template?appName=${saasConfig.config.appName}`,
                            "type": "GET",
                            "timeout": 0,
                            "headers": {
                                "Content-Type": "application/json"
                            }
                        }).then((d2) => {
                            data.dataList = d2.response.result;
                            gvc.notifyDataChange(id);
                        });
                    }
                    function setPage(pd) {
                        var _a;
                        let group = [];
                        let selectGroup = '';
                        pd.carryData = (_a = pd.carryData) !== null && _a !== void 0 ? _a : {};
                        let id = glitter.getUUID();
                        data.dataList.map((dd) => {
                            if (dd.tag === pd.tag) {
                                selectGroup = dd.group;
                            }
                            if (group.indexOf(dd.group) === -1) {
                                group.push(dd.group);
                            }
                        });
                        let data2 = undefined;
                        let fal = 0;
                        return gvc.bindView(() => {
                            return {
                                bind: id,
                                view: () => {
                                    var _a;
                                    return [EditorElem.select({
                                            title: "選擇嵌入頁面",
                                            gvc: gvc,
                                            def: (_a = pd.tag) !== null && _a !== void 0 ? _a : "",
                                            array: [
                                                {
                                                    title: '選擇嵌入頁面', value: ''
                                                }
                                            ].concat(data.dataList.sort((function (a, b) {
                                                if (a.group.toUpperCase() < b.group.toUpperCase()) {
                                                    return -1;
                                                }
                                                if (a.group.toUpperCase() > b.group.toUpperCase()) {
                                                    return 1;
                                                }
                                                return 0;
                                            })).map((dd) => {
                                                return {
                                                    title: `${dd.group}-${dd.name}`, value: dd.tag
                                                };
                                            })),
                                            callback: (text) => {
                                                pd.tag = text;
                                            },
                                        }), (() => {
                                            return TriggerEvent.editer(gvc, widget, pd.carryData, {
                                                hover: true,
                                                option: [],
                                                title: "夾帶資料<[ subData.carryData ]>"
                                            });
                                        })()].join(`<div class="my-2"></div>`);
                                },
                                divCreate: {
                                    class: `mb-2`
                                }
                            };
                        });
                    }
                    const html = String.raw;
                    return gvc.bindView(() => {
                        return {
                            bind: id,
                            view: () => {
                                if (data.dataList) {
                                    return html `
                                        ${EditorElem.editerDialog({
                                        gvc: gvc,
                                        dialog: (gvc) => {
                                            return setPage(widget.data) + `<div class="d-flex w-100 p-2 border-top ">
                                                             <div class="flex-fill"></div>
                                                             <div class="btn btn-primary-c ms-2"
                                                                  style="height:40px;width:80px;"
                                                                  onclick="${gvc.event(() => {
                                                gvc.closeDialog();
                                                widget.refreshComponent();
                                            })}"><i class="fa-solid fa-floppy-disk me-2"></i>儲存
                                                             </div>
                                                         </div>`;
                                        },
                                        editTitle: `預設嵌入頁面`
                                    })}
                                        <div class="my-2"></div>
                                        ${EditorElem.editerDialog({
                                        gvc: gvc,
                                        dialog: (gvc) => {
                                            return gvc.bindView(() => {
                                                const diaId = glitter.getUUID();
                                                return {
                                                    bind: diaId,
                                                    view: () => {
                                                        return EditorElem.arrayItem({
                                                            gvc: gvc,
                                                            title: "",
                                                            array: () => {
                                                                return widget.data.list.map((dd, index) => {
                                                                    return {
                                                                        title: dd.name || `判斷式:${index + 1}`,
                                                                        expand: dd,
                                                                        innerHtml: ((gvc) => {
                                                                            return glitter.htmlGenerate.editeInput({
                                                                                gvc: gvc,
                                                                                title: `判斷式名稱`,
                                                                                default: dd.name,
                                                                                placeHolder: "輸入判斷式名稱",
                                                                                callback: (text) => {
                                                                                    dd.name = text;
                                                                                    gvc.notifyDataChange(id);
                                                                                }
                                                                            }) +
                                                                                EditorElem.select({
                                                                                    title: '類型',
                                                                                    gvc: gvc,
                                                                                    def: dd.triggerType,
                                                                                    array: [{
                                                                                            title: '程式碼',
                                                                                            value: 'manual'
                                                                                        }, {
                                                                                            title: '觸發事件',
                                                                                            value: 'trigger'
                                                                                        }],
                                                                                    callback: (text) => {
                                                                                        dd.triggerType = text;
                                                                                        gvc.notifyDataChange(id);
                                                                                    }
                                                                                }) +
                                                                                (() => {
                                                                                    var _a;
                                                                                    if (dd.triggerType === 'trigger') {
                                                                                        dd.evenet = (_a = dd.evenet) !== null && _a !== void 0 ? _a : {};
                                                                                        return TriggerEvent.editer(gvc, widget, dd.evenet, {
                                                                                            hover: false,
                                                                                            option: [],
                                                                                            title: "觸發事件"
                                                                                        });
                                                                                    }
                                                                                    else {
                                                                                        return EditorElem.codeEditor({
                                                                                            gvc: gvc,
                                                                                            title: `判斷式內容`,
                                                                                            initial: dd.code,
                                                                                            callback: (text) => {
                                                                                                dd.codeVersion = 'v2';
                                                                                                dd.code = text;
                                                                                                gvc.notifyDataChange(id);
                                                                                            },
                                                                                            height: 400
                                                                                        });
                                                                                    }
                                                                                })() + `
 ${setPage(dd)}`;
                                                                        }),
                                                                        saveEvent: () => {
                                                                            gvc.notifyDataChange(diaId);
                                                                        },
                                                                        minus: gvc.event(() => {
                                                                            widget.data.list.splice(index, 1);
                                                                            widget.refreshComponent();
                                                                        }),
                                                                        width: '600px'
                                                                    };
                                                                });
                                                            },
                                                            expand: widget.data,
                                                            plus: {
                                                                title: "添加判斷",
                                                                event: gvc.event(() => {
                                                                    widget.data.list.push({ code: '' });
                                                                    gvc.notifyDataChange(diaId);
                                                                })
                                                            },
                                                            refreshComponent: () => {
                                                                widget.refreshComponent();
                                                            },
                                                            originalArray: widget.data.list
                                                        });
                                                    },
                                                    divCreate: {}
                                                };
                                            }) + `<div class="d-flex w-100 p-2 border-top ">
                                                             <div class="flex-fill"></div>
                                                             <div class="btn btn-primary-c ms-2"
                                                                  style="height:40px;width:80px;"
                                                                  onclick="${gvc.event(() => {
                                                widget.refreshAll();
                                                gvc.closeDialog();
                                            })}"><i class="fa-solid fa-floppy-disk me-2"></i>儲存
                                                             </div>
                                                         </div>`;
                                        },
                                        width: "400px",
                                        editTitle: `判斷式頁面嵌入`
                                    })}
                                    `;
                                }
                                else {
                                    return ``;
                                }
                            },
                            divCreate: {},
                            onCreate: () => {
                                if (!data.dataList) {
                                    setTimeout(() => {
                                        getData();
                                    }, 100);
                                }
                            }
                        };
                    });
                }
            };
        }
    };
});
