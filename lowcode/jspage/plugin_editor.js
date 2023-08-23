import { EditorElem } from "../glitterBundle/plugins/editor-elem.js";
import { HtmlGenerate } from "../glitterBundle/module/Html_generate.js";
import { TriggerEvent } from "../glitterBundle/plugins/trigger-event.js";
export class Plugin_editor {
    static left(gvc, viewModel, createID, gBundle) {
        const html = String.raw;
        const glitter = gvc.glitter;
        let vm = {
            select: `view`,
        };
        return gvc.bindView(() => {
            const id = glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    return `<div class="d-flex border-bottom ">
                                    ${[
                        {
                            key: 'view',
                            label: "頁面模塊"
                        }, {
                            key: 'event',
                            label: "觸發事件"
                        },
                        {
                            key: 'router',
                            label: "資源初始化"
                        }
                    ].map((dd) => {
                        return `<div class="add_item_button ${(dd.key === vm.select) ? `add_item_button_active` : ``}" onclick="${gvc.event((e, event) => {
                            vm.select = dd.key;
                            gvc.notifyDataChange(id);
                        })}" style="font-size:14px;">${dd.label}</div>`;
                    }).join('')}
                                </div>` + (() => {
                        switch (vm.select) {
                            case "view":
                                return gvc.bindView(() => {
                                    const id = glitter.getUUID();
                                    return {
                                        bind: id,
                                        view: () => {
                                            return `
<div class="alert alert-info m-2 p-3" style="white-space: normal;word-break: break-all;">頁面模塊決定您能夠在網站上使用哪些設計模塊。您可以從官方或第三方資源中獲取連結，或自行開發插件上傳以供使用。</div>
${EditorElem.arrayItem({
                                                originalArray: viewModel.pluginList,
                                                gvc: gvc,
                                                title: '頁面模塊',
                                                array: () => {
                                                    return viewModel.pluginList.map((dd, index) => {
                                                        return {
                                                            title: `<span style="color: black;">${dd.name || `區塊:${index}`}</span>`,
                                                            innerHtml: (() => {
                                                                return ` ${HtmlGenerate.editeInput({
                                                                    gvc,
                                                                    title: '自定義插件名稱',
                                                                    default: dd.name,
                                                                    placeHolder: '自定義插件名稱',
                                                                    callback: (text) => {
                                                                        dd.name = text;
                                                                    }
                                                                })}
                                                     ${HtmlGenerate.editeInput({
                                                                    gvc,
                                                                    title: '模板路徑',
                                                                    default: dd.src.official,
                                                                    placeHolder: '模板路徑',
                                                                    callback: (text) => {
                                                                        dd.src.official = text;
                                                                    }
                                                                })}`;
                                                            })
                                                        };
                                                    });
                                                },
                                                expand: undefined,
                                                plus: {
                                                    title: '頁面模塊',
                                                    event: gvc.event(() => {
                                                        viewModel.pluginList.push({
                                                            name: '',
                                                            route: '',
                                                            src: {
                                                                official: '',
                                                                staging: '',
                                                                open: true
                                                            }
                                                        });
                                                        gvc.notifyDataChange(id);
                                                    }),
                                                },
                                                refreshComponent: () => {
                                                    gvc.notifyDataChange(id);
                                                }
                                            })}`;
                                        },
                                        divCreate: {}
                                    };
                                });
                            case "event":
                                return gvc.bindView(() => {
                                    const id = glitter.getUUID();
                                    return {
                                        bind: id,
                                        view: () => {
                                            return html `
                                                        <div class="alert alert-info m-2 p-3"
                                                             style="white-space: normal;word-break: break-all;">
                                                            為您的元件添加各樣的觸發事件，包含連結跳轉/內容取得/資料儲存/頁面渲染/動畫事件/內容發布....等，都能透過事件來完成。
                                                        </div>`
                                                + EditorElem.arrayItem({
                                                    originalArray: viewModel.initialJS,
                                                    gvc: gvc,
                                                    title: '觸發事件',
                                                    array: () => {
                                                        return viewModel.initialJS.map((dd, index) => {
                                                            return {
                                                                title: `<span style="color: black;">${dd.name || `區塊:${index}`}</span>`,
                                                                innerHtml: (() => {
                                                                    return `      ${HtmlGenerate.editeInput({
                                                                        gvc,
                                                                        title: '自定義插件名稱',
                                                                        default: dd.name,
                                                                        placeHolder: '自定義插件名稱',
                                                                        callback: (text) => {
                                                                            dd.name = text;
                                                                            gvc.notifyDataChange(id);
                                                                        }
                                                                    })}
                                                     ${HtmlGenerate.editeInput({
                                                                        gvc,
                                                                        title: '插件路徑',
                                                                        default: dd.src.official,
                                                                        placeHolder: '請輸入插件路徑',
                                                                        callback: (text) => {
                                                                            dd.src.official = text;
                                                                            gvc.notifyDataChange(id);
                                                                        }
                                                                    })}`;
                                                                }),
                                                                expand: dd,
                                                                minus: gvc.event(() => {
                                                                    viewModel.initialJS.splice(index, 1);
                                                                    gvc.notifyDataChange(id);
                                                                })
                                                            };
                                                        });
                                                    },
                                                    expand: undefined,
                                                    plus: {
                                                        title: '觸發事件',
                                                        event: gvc.event(() => {
                                                            viewModel.initialJS.push({
                                                                name: '',
                                                                route: '',
                                                                src: {
                                                                    official: '',
                                                                    open: true
                                                                }
                                                            });
                                                            gvc.notifyDataChange(id);
                                                        }),
                                                    },
                                                    refreshComponent: () => {
                                                        gvc.notifyDataChange(id);
                                                    }
                                                });
                                        }
                                    };
                                });
                            case "router":
                                return `
                                <div class="alert alert-info m-2 p-3" style="white-space: normal;word-break: break-all;">資源初始代碼會在頁面載入之前執行，通常處理一些基本配置行為，例如設定插件路徑與後端API路徑...等，這些初始化代碼會按照順序執行。</div>
                                ${gvc.bindView(() => {
                                    const id = glitter.getUUID();
                                    return {
                                        bind: id,
                                        view: () => {
                                            return EditorElem.arrayItem({
                                                originalArray: viewModel.initialList,
                                                gvc: gvc,
                                                title: '資源初始化',
                                                array: (() => {
                                                    return viewModel.initialList.map((dd, index) => {
                                                        return {
                                                            title: `<span style="color:black;">${dd.name || `區塊:${index}`}</span>`,
                                                            innerHtml: () => {
                                                                return `
                                                    ${gvc.bindView(() => {
                                                                    const cid = glitter.getUUID();
                                                                    return {
                                                                        bind: cid,
                                                                        view: () => {
                                                                            var _a;
                                                                            return `  
                                          ${EditorElem.select({
                                                                                title: '類型',
                                                                                gvc: gvc,
                                                                                def: (_a = dd.type) !== null && _a !== void 0 ? _a : 'code',
                                                                                callback: (text) => {
                                                                                    dd.type = text;
                                                                                    gvc.notifyDataChange(cid);
                                                                                },
                                                                                array: [{ title: "自定義", value: "code" }, { title: "程式碼路徑", value: "script" }, { title: "觸發事件", value: "event" }],
                                                                            })}
                                          ${HtmlGenerate.editeInput({
                                                                                gvc,
                                                                                title: '自定義程式區塊名稱',
                                                                                default: dd.name,
                                                                                placeHolder: '自定義程式區塊名稱',
                                                                                callback: (text) => {
                                                                                    dd.name = text;
                                                                                    gvc.notifyDataChange(id);
                                                                                }
                                                                            })}
                                          ${(() => {
                                                                                var _a, _b;
                                                                                if (dd.type === 'script') {
                                                                                    return EditorElem.uploadFile({
                                                                                        gvc,
                                                                                        title: '輸入或上傳路徑連結',
                                                                                        def: (_a = dd.src.link) !== null && _a !== void 0 ? _a : "",
                                                                                        callback: (text) => {
                                                                                            dd.src.link = text;
                                                                                            gvc.notifyDataChange(cid);
                                                                                        }
                                                                                    });
                                                                                }
                                                                                else if (dd.type === "event") {
                                                                                    dd.src.event = (_b = dd.src.event) !== null && _b !== void 0 ? _b : {};
                                                                                    return TriggerEvent.editer(gvc, {
                                                                                        refreshComponent: () => {
                                                                                            gvc.notifyDataChange(cid);
                                                                                        }
                                                                                    }, dd.src.event, {
                                                                                        title: "觸發事件",
                                                                                        hover: false,
                                                                                        option: []
                                                                                    });
                                                                                }
                                                                                else {
                                                                                    return gvc.map([
                                                                                        HtmlGenerate.editeText({
                                                                                            gvc,
                                                                                            title: '區塊代碼',
                                                                                            default: dd.src.official,
                                                                                            placeHolder: '請輸入代碼',
                                                                                            callback: (text) => {
                                                                                                dd.src.official = text;
                                                                                            }
                                                                                        })
                                                                                    ]);
                                                                                }
                                                                            })()}  `;
                                                                        },
                                                                        divCreate: {
                                                                            class: `w-100`,
                                                                            style: `border-bottom: 1px solid lightgrey;padding-bottom: 10px;margin-bottom: 10px;`
                                                                        }
                                                                    };
                                                                })}
                                                    `;
                                                            },
                                                            expand: dd,
                                                            minus: gvc.event(() => {
                                                                viewModel.initialList.splice(index, 1);
                                                                gvc.notifyDataChange(id);
                                                            })
                                                        };
                                                    });
                                                }),
                                                expand: undefined,
                                                plus: {
                                                    title: '添加代碼區塊',
                                                    event: gvc.event(() => {
                                                        viewModel.initialList.push({
                                                            name: '代碼區塊',
                                                            src: {
                                                                official: '',
                                                                staging: '',
                                                                open: true
                                                            }
                                                        });
                                                        gvc.notifyDataChange(id);
                                                    }),
                                                },
                                                refreshComponent: () => {
                                                    gvc.notifyDataChange(id);
                                                }
                                            });
                                        },
                                        divCreate: {}
                                    };
                                })}
                                `;
                        }
                    })();
                }
            };
        });
    }
}
Plugin_editor.index = 'plugin';
