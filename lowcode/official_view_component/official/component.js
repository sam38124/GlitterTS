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
import { BaseApi } from "../../glitterBundle/api/base.js";
import { TriggerEvent } from "../../glitterBundle/plugins/trigger-event.js";
import { EditorElem } from "../../glitterBundle/plugins/editor-elem.js";
import { FormWidget } from "./form.js";
import { ApiPageConfig } from "../../api/pageConfig.js";
export const component = Plugin.createComponent(import.meta.url, (glitter, editMode) => {
    return {
        render: (gvc, widget, setting, hoverID, subData, htmlGenerate) => {
            var _a;
            widget.data.list = (_a = widget.data.list) !== null && _a !== void 0 ? _a : [];
            function devEditorView() {
                const id = glitter.getUUID();
                const data = {
                    dataList: undefined
                };
                const saasConfig = window.saasConfig;
                function getData() {
                    BaseApi.create({
                        "url": saasConfig.config.url + `/api/v1/template?appName=${saasConfig.config.appName}&page_type=module`,
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
                                return [
                                    EditorElem.editerDialog({
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
                                    }),
                                    EditorElem.editerDialog({
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
                                                                                    gvc.recreateView();
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
                                                                                        gvc.recreateView();
                                                                                    }
                                                                                }) +
                                                                                (() => {
                                                                                    var _a;
                                                                                    if (dd.triggerType === 'trigger') {
                                                                                        dd.evenet = (_a = dd.evenet) !== null && _a !== void 0 ? _a : {};
                                                                                        return `<div class="mt-2"></div>` + TriggerEvent.editer(gvc, widget, dd.evenet, {
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
                                            }) + html `
                                                <div class="d-flex w-100 p-2 border-top ">
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
                                    }),
                                ].join(` <div class="my-2"></div>`);
                            }
                            else {
                                return `<div class="w-100 d-flex align-items-center justify-content-center p-3">
<div class="spinner-border"></div>
</div>`;
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
            function userEditorView() {
                const saasConfig = window.saasConfig;
                let data = {
                    dataList: []
                };
                return gvc.bindView(() => {
                    const id = glitter.getUUID();
                    let selectTag = '';
                    let vm = {
                        loading: true,
                        data: {}
                    };
                    BaseApi.create({
                        "url": saasConfig.config.url + `/api/v1/template?appName=${saasConfig.config.appName}`,
                        "type": "GET",
                        "timeout": 0,
                        "headers": {
                            "Content-Type": "application/json"
                        }
                    }).then((d2) => {
                        vm.data = d2;
                        vm.loading = false;
                        gvc.notifyDataChange(id);
                    });
                    return {
                        bind: id,
                        view: () => {
                            if (vm.loading) {
                                return `<div class="w-100 d-flex align-items-center justify-content-center">
<div class="spinner-border"></div>
</div>`;
                            }
                            else {
                                const d2 = vm.data;
                                data.dataList = d2.response.result;
                                let valueArray = [];
                                const def = data.dataList.find((dd) => {
                                    return dd.tag === widget.data.tag;
                                });
                                def && valueArray.push({
                                    title: def.name, tag: def.tag
                                });
                                widget.data.list.map((d2) => {
                                    const def = data.dataList.find((dd) => {
                                        return dd.tag === d2.tag;
                                    });
                                    def && valueArray.push({
                                        title: def.name, tag: def.tag
                                    });
                                });
                                valueArray.map((dd) => {
                                    selectTag = selectTag || dd.tag;
                                });
                                let saveEvent = () => {
                                };
                                let interVal = 0;
                                const html = String.raw;
                                return [
                                    html `<div class="d-flex align-items-center mt-2 mb-2">
                                                <select class="form-control form-select "
                                                        style="border-top-right-radius: 0;border-bottom-right-radius: 0;"
                                                        onchange="${gvc.event((e, event) => {
                                        selectTag = e.value;
                                        gvc.notifyDataChange(id);
                                    })}">${valueArray.map((dd) => {
                                        return `<option value="${dd.tag}" ${(dd.tag === selectTag) ? `selected` : ''} >${dd.title}</option>`;
                                    })}</select>
                                                <div class="hoverBtn ms-auto d-flex align-items-center justify-content-center   border"
                                                     style="height:44px;width:44px;cursor:pointer;color:#151515;
                                                         border-left: none;
border-radius: 0px 10px 10px 0px;"
                                                     data-bs-toggle="tooltip" data-bs-placement="top"
                                                     data-bs-custom-class="custom-tooltip"
                                                     data-bs-title="跳轉至模塊" onclick="${gvc.event(() => {
                                        glitter.setUrlParameter('page', selectTag);
                                        glitter.share.reloadEditor();
                                    })}">
                                                    <i class="fa-regular fa-eye"></i>
                                                </div>
                                            </div>
                                        `,
                                    gvc.bindView(() => {
                                        const id = gvc.glitter.getUUID();
                                        return {
                                            bind: id,
                                            view: () => {
                                                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                                                    const page_config = yield (new Promise((resolve, reject) => {
                                                        BaseApi.create({
                                                            "url": saasConfig.config.url + `/api/v1/template?appName=${saasConfig.config.appName}&tag=${encodeURIComponent(selectTag)}`,
                                                            "type": "GET",
                                                            "timeout": 0,
                                                            "headers": {
                                                                "Content-Type": "application/json"
                                                            }
                                                        }).then((res) => {
                                                            saveEvent = () => {
                                                                ApiPageConfig.setPage({
                                                                    id: res.response.result[0].id,
                                                                    appName: res.response.result[0].appName,
                                                                    tag: res.response.result[0].tag,
                                                                    page_config: res.response.result[0].page_config,
                                                                }).then((api) => {
                                                                    gvc.notifyDataChange('showView');
                                                                });
                                                            };
                                                            resolve(res.response.result[0].page_config);
                                                        });
                                                    }));
                                                    if (!page_config.formFormat || page_config.formFormat.length === 0) {
                                                        resolve(`<div class="d-flex align-items-center justify-content-center flex-column w-100"
                                         style="width:100%;">
                                        <lottie-player style="max-width: 100%;width: 200px;"
                                                       src="https://assets10.lottiefiles.com/packages/lf20_rc6CDU.json"
                                                       speed="1" loop="true"
                                                       background="transparent"></lottie-player>
                                        <h3 class="text-dark fs-6 mt-n3 px-2  "
                                            style="line-height: 200%;text-align: center;">
                                            尚未設定編輯表單。</h3>
                                    </div>`);
                                                    }
                                                    else {
                                                        resolve(FormWidget.editorView({
                                                            gvc: gvc,
                                                            array: page_config.formFormat,
                                                            refresh: () => {
                                                                clearInterval(interVal);
                                                                interVal = setTimeout(() => {
                                                                    saveEvent();
                                                                }, 200);
                                                            },
                                                            formData: page_config.formData
                                                        }));
                                                    }
                                                }));
                                            }
                                        };
                                    })
                                ].join('');
                            }
                        },
                        divCreate: {
                            class: 'pb-2'
                        },
                        onCreate: () => {
                            $('.tooltip').remove();
                            $('[data-bs-toggle="tooltip"]').tooltip();
                        }
                    };
                });
            }
            const html = String.raw;
            return {
                view: () => {
                    let data = undefined;
                    const saasConfig = window.saasConfig;
                    let fal = 0;
                    let tag = widget.data.tag;
                    let carryData = widget.data.carryData;
                    function getData(document) {
                        return __awaiter(this, void 0, void 0, function* () {
                            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                                var _a;
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
                                                if ((yield eval(`(() => {
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
                                    catch (e) {
                                    }
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
                                if (!tag) {
                                    resolve(``);
                                }
                                else {
                                    (window.glitterInitialHelper).getPageData(tag, (d2) => {
                                        var _a, _b;
                                        data = d2.response.result[0];
                                        data.config.map((dd) => {
                                            glitter.htmlGenerate.renameWidgetID(dd);
                                        });
                                        let createOption = (_a = (htmlGenerate !== null && htmlGenerate !== void 0 ? htmlGenerate : {}).createOption) !== null && _a !== void 0 ? _a : {};
                                        createOption.option = (_b = createOption.option) !== null && _b !== void 0 ? _b : [];
                                        createOption.childContainer = true;
                                        data.config.formData = data.page_config.formData;
                                        resolve(`
                                                <!-- tag=${tag} -->
                                              ${new glitter.htmlGenerate(data.config, [], sub).render(gvc, {
                                            class: ``,
                                            style: ``,
                                            containerID: gvc.glitter.getUUID(),
                                            jsFinish: () => {
                                            },
                                            onCreate: () => {
                                            },
                                            document: document
                                        }, createOption !== null && createOption !== void 0 ? createOption : {})}
                                                `);
                                    });
                                }
                            }));
                        });
                    }
                    const comp = false;
                    if (comp) {
                        return gvc.bindView(() => {
                            const id = gvc.glitter.getUUID();
                            return {
                                bind: id,
                                view: () => {
                                    return ``;
                                },
                                divCreate: {
                                    elem: 'web-component', option: [
                                        {
                                            key: 'id', value: id
                                        }
                                    ]
                                },
                                onCreate: () => __awaiter(void 0, void 0, void 0, function* () {
                                    const html = yield getData(document.querySelector('#' + id).shadowRoot);
                                    document.querySelector('#' + id).setView({
                                        gvc: gvc, view: html, id: id
                                    });
                                })
                            };
                        });
                    }
                    else {
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
                                onInitial: () => __awaiter(void 0, void 0, void 0, function* () {
                                    const target = document.querySelector(`[gvc-id="${gvc.id(tempView)}"]`);
                                    target.outerHTML = (yield getData(gvc.glitter.document));
                                }),
                                onDestroy: () => {
                                },
                            };
                        });
                    }
                },
                editor: () => {
                    return [
                        gvc.bindView(() => {
                            const id = gvc.glitter.getUUID();
                            let toggle = true;
                            return {
                                bind: id,
                                view: () => {
                                    return `<div class="mx-0 d-flex  px-3 hi fw-bold d-flex align-items-center shadow border-bottom  py-2 bgf6 "
                                 style="color:black;cursor: pointer;font-size:15px;" onclick="${gvc.event(() => {
                                        toggle = !toggle;
                                        gvc.notifyDataChange(id);
                                    })}">
                                內容編輯
                                <div class="flex-fill"></div>
                                ${toggle ? ` <i class="fa-solid fa-chevron-up d-flex align-items-center justify-content-center me-2"
                                   style="cursor:pointer;" aria-hidden="true"></i>` : ` <i class="fa-solid  fa-angle-down d-flex align-items-center justify-content-center me-2"
                                   style="cursor:pointer;" aria-hidden="true"></i>`}
                            </div>
<div class="p-2">
${(toggle) ? userEditorView() : ``}
<div style="height:10px;"></div>
</div>
`;
                                },
                                divCreate: {
                                    class: `mx-n2 mt-n2`, style: ``
                                }
                            };
                        }),
                        gvc.bindView(() => {
                            const id = gvc.glitter.getUUID();
                            let toggle = true;
                            return {
                                bind: id,
                                view: () => {
                                    return `<div class="mx-0 d-flex   border-top px-3 hi fw-bold d-flex align-items-center shadow border-bottom  py-2 bgf6"
                                 style="color:black;cursor: pointer;font-size:15px;" onclick="${gvc.event(() => {
                                        toggle = !toggle;
                                        gvc.notifyDataChange(id);
                                    })}">
                                模塊進階設定
                                <div class="flex-fill"></div>
                                ${toggle ? ` <i class="fa-solid fa-chevron-up d-flex align-items-center justify-content-center me-2"
                                   style="cursor:pointer;" aria-hidden="true"></i>` : ` <i class="fa-solid  fa-angle-down d-flex align-items-center justify-content-center me-2"
                                   style="cursor:pointer;" aria-hidden="true"></i>`}
                            </div>
                            ${(toggle) ? `<div class="p-2 border-bottom">
${devEditorView()}
</div>` : ``}

`;
                                },
                                divCreate: {
                                    class: `mx-n2 mt-n3`, style: ``
                                }
                            };
                        })
                    ].join(`<div style=""></div>`);
                }
            };
        }
    };
});
