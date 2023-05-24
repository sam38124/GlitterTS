import {HtmlGenerate} from "../glitterBundle/module/Html_generate.js";
import {GVC} from "../glitterBundle/GVController.js";
import {EditorElem} from "../glitterBundle/plugins/editor-elem.js";
import {TriggerEvent} from "../glitterBundle/plugins/trigger-event.js";

export function initialStyle(gvc: GVC, viewModel: any, id: string) {
    const glitter = gvc.glitter;
    viewModel.initialStyleSheet = viewModel.initialStyleSheet ?? []
    return `
<div class="alert alert-warning " style="white-space: normal;word-break:break-all;">設計樣式會決定APP所呈現的基礎樣式，會依照前後執行順序進行覆蓋．</div>
                        ${
        gvc.bindView(() => {
            const id = glitter.getUUID()
            return {
                bind: id,
                view: () => {
                    return EditorElem.arrayItem({
                        originalArray: viewModel.initialStyleSheet,
                        gvc: gvc,
                        title: '文字區塊內容',
                        array: viewModel.initialStyleSheet.map((dd: any, index: number) => {
                            return {
                                title: `<span style="">${dd.name || `區塊:${index}`}</span>`,
                                innerHtml: (() => {
                                    return gvc.bindView(() => {
                                        const cid = glitter.getUUID();
                                        return {
                                            bind: cid,
                                            view: () => {
                                                return `  
                                          ${
                                                    EditorElem.select({
                                                        title: '類型',
                                                        gvc: gvc,
                                                        def: dd.type ?? 'code',
                                                        callback: (text: string) => {
                                                            dd.type = text
                                                            gvc.notifyDataChange(cid)
                                                        },
                                                        array: [{title: "自定義", value: "code"}, {
                                                            title: "檔案路徑",
                                                            value: "script"
                                                        }],
                                                    })
                                                }
                                          ${HtmlGenerate.editeInput({
                                                    gvc,
                                                    title: '自定義設計名稱',
                                                    default: dd.name,
                                                    placeHolder: '自定義設計名稱',
                                                    callback: (text) => {
                                                        dd.name = text;
                                                        gvc.notifyDataChange(id);
                                                    }
                                                })}
                                          ${(() => {
                                                    if (dd.type === 'script') {
                                                        return EditorElem.uploadFile({
                                                            title: "輸入或上傳路徑連結",
                                                            gvc: gvc,
                                                            def: dd.src.link ?? "",
                                                            callback: (text) => {
                                                                dd.src.link = text;
                                                                gvc.notifyDataChange(id);
                                                            }
                                                        })
                                                    } else if (dd.type === "event") {
                                                        dd.src.event = dd.src.event ?? {};
                                                        return TriggerEvent.editer(gvc, ({
                                                            refreshComponent: () => {
                                                                gvc.notifyDataChange(cid)
                                                            }
                                                        } as any), dd.src.event, {
                                                            title: "觸發事件",
                                                            hover: false,
                                                            option: []
                                                        })
                                                    } else {
                                                        return gvc.map([
                                                            HtmlGenerate.editeText({
                                                                gvc,
                                                                title: '設計代碼',
                                                                default: dd.src.official,
                                                                placeHolder: '請輸入代碼',
                                                                callback: (text) => {
                                                                    dd.src.official = text;
                                                                }
                                                            })
                                                        ])
                                                    }
                                                })()}  `;
                                            },
                                            divCreate: {
                                                class: `w-100`,
                                                style: `border-bottom: 1px solid lightgrey;padding-bottom: 10px;margin-bottom: 10px;`
                                            }
                                        };
                                    })
                                }),
                                expand: dd,
                                minus: gvc.event(() => {
                                    viewModel.initialStyleSheet.splice(index, 1);
                                    gvc.notifyDataChange(id);
                                })
                            }
                        }),
                        expand: undefined,
                        plus: {
                            title: '添加設計',
                            event: gvc.event(() => {
                                viewModel.initialStyleSheet.push({
                                    name: '設計區塊',
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
                    })
                },
                divCreate: {}
            }
        })
    }
                                             `;
}

export function initialStylePage(gvc: GVC, viewModel: any, id: string) {
    const glitter = gvc.glitter;
    viewModel.data.page_config.initialStyleSheet = viewModel.data.page_config.initialStyleSheet ?? []
    return `
<div class="alert alert-warning " style="white-space: normal;word-break:break-all;">設計樣式會決定APP所呈現的基礎樣式，會依照前後執行順序進行覆蓋．</div>
                        ${
        gvc.bindView(() => {
            const id = glitter.getUUID()
            return {
                bind: id,
                view: () => {
                    return EditorElem.arrayItem({
                        originalArray: viewModel.data.page_config.initialStyleSheet,
                        gvc: gvc,
                        title: '文字區塊內容',
                        array: viewModel.data.page_config.initialStyleSheet.map((dd: any, index: number) => {
                            return {
                                title: `<span style="">${dd.name || `區塊:${index}`}</span>`,
                                innerHtml: (() => {
                                    return gvc.bindView(() => {
                                        const cid = glitter.getUUID();
                                        return {
                                            bind: cid,
                                            view: () => {
                                                return `  
                                          ${
                                                    EditorElem.select({
                                                        title: '類型',
                                                        gvc: gvc,
                                                        def: dd.type ?? 'code',
                                                        callback: (text: string) => {
                                                            dd.type = text
                                                            gvc.notifyDataChange(cid)
                                                        },
                                                        array: [{title: "自定義", value: "code"}, {
                                                            title: "檔案路徑",
                                                            value: "script"
                                                        }],
                                                    })
                                                }
                                          ${HtmlGenerate.editeInput({
                                                    gvc,
                                                    title: '自定義設計名稱',
                                                    default: dd.name,
                                                    placeHolder: '自定義設計名稱',
                                                    callback: (text) => {
                                                        dd.name = text;
                                                        gvc.notifyDataChange(id);
                                                    }
                                                })}
                                          ${(() => {
                                                    if (dd.type === 'script') {
                                                        return EditorElem.uploadFile({
                                                            title: "輸入或上傳路徑連結",
                                                            gvc: gvc,
                                                            def: dd.src.link ?? "",
                                                            callback: (text) => {
                                                                dd.src.link = text;
                                                                gvc.notifyDataChange(id);
                                                            }
                                                        })
                                                    } else if (dd.type === "event") {
                                                        dd.src.event = dd.src.event ?? {};
                                                        return TriggerEvent.editer(gvc, ({
                                                            refreshComponent: () => {
                                                                gvc.notifyDataChange(cid)
                                                            }
                                                        } as any), dd.src.event, {
                                                            title: "觸發事件",
                                                            hover: false,
                                                            option: []
                                                        })
                                                    } else {
                                                        return gvc.map([
                                                            HtmlGenerate.editeText({
                                                                gvc,
                                                                title: '設計代碼',
                                                                default: dd.src.official,
                                                                placeHolder: '請輸入設計代碼',
                                                                callback: (text) => {
                                                                    dd.src.official = text;
                                                                }
                                                            })
                                                        ])
                                                    }
                                                })()}  `;
                                            },
                                            divCreate: {
                                                class: `w-100`,
                                                style: `border-bottom: 1px solid lightgrey;padding-bottom: 10px;margin-bottom: 10px;`
                                            }
                                        };
                                    })
                                }),
                                expand: dd,
                                minus: gvc.event(() => {
                                    viewModel.data.page_config.initialStyleSheet.splice(index, 1);
                                    gvc.notifyDataChange(id);
                                })
                            }
                        }),
                        expand: undefined,
                        plus: {
                            title: '添加設計',
                            event: gvc.event(() => {
                                viewModel.data.page_config.initialStyleSheet.push({
                                    name: '設計區塊',
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
                    })
                },
                divCreate: {}
            }
        })
    }
                                             `;
}