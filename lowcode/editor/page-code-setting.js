import { Storage } from "../glitterBundle/helper/storage.js";
import { EditorElem } from "../glitterBundle/plugins/editor-elem.js";
import { ShareDialog } from "../glitterBundle/dialog/ShareDialog.js";
import { PageEditor } from "./page-editor.js";
import { NormalPageEditor } from "./normal-page-editor.js";
import { PageSettingView } from "./page-setting-view.js";
export class PageCodeSetting {
    static toggle(visible, gvc) {
        NormalPageEditor.toggle({
            visible: visible,
            title: '頁面代碼',
            view: gvc.bindView(() => {
                const html = String.raw;
                const id = gvc.glitter.getUUID();
                return {
                    bind: id,
                    view: () => {
                        return [
                            html `
                                <div class="d-flex  py-2 px-2 bg-white align-items-center w-100 justify-content-around border-bottom">
                                    ${(() => {
                                let list = [
                                    {
                                        key: 'style',
                                        label: "Style-代碼樣式",
                                        icon: '<i class="fa-regular fa-regular fa-pen-swirl"></i>'
                                    },
                                    {
                                        key: 'script',
                                        label: "Script-代碼事件",
                                        icon: '<i class="fa-regular fa-file-code"></i>'
                                    },
                                    {
                                        key: 'form',
                                        label: "內容編輯表單",
                                        icon: '  <i class="fa-regular fa-square-list"></i>'
                                    },
                                    {
                                        key: 'code',
                                        label: "頁面配置檔",
                                        icon: '<i class="fa-sharp fa-solid fa-code fa-fw"></i>'
                                    }
                                ];
                                return list.map((dd) => {
                                    return `<div class="d-flex align-items-center justify-content-center hoverBtn  border"
                                 style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;
                                 ${(Storage.code_set_select === dd.key) ? `background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);background:-webkit-linear-gradient(135deg, #667eea 0%, #764ba2 100%);color:white;` : ``}
                                 "
                                 data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                 data-bs-title="${dd.label}" onclick="${gvc.event(() => {
                                        Storage.code_set_select = dd.key;
                                        gvc.notifyDataChange(id);
                                    })}">
                               ${dd.icon}
                            </div>`;
                                }).join('');
                            })()}
                                </div>`,
                            gvc.bindView(() => {
                                const docID = gvc.glitter.getUUID();
                                let viewModel = gvc.glitter.share.editorViewModel;
                                let editData = viewModel.data;
                                return {
                                    bind: docID,
                                    view: () => {
                                        switch (Storage.code_set_select) {
                                            case "form":
                                                return PageSettingView.formSetting(gvc);
                                            case "style":
                                                return [html `
                                                    <div class="position-relative bgf6 d-flex align-items-center justify-content-between mx-n2 mt-n2 p-2 border-bottom shadow mb-2 d-none">
                                                        <span class="fs-6 fw-bold " style="color:black;">樣式設定</span>
                                                        <button class="btn btn-primary-c "
                                                                style="height: 28px;width:40px;font-size:14px;"
                                                                onclick="${gvc.event(() => {
                                                        gvc.glitter.htmlGenerate.saveEvent();
                                                    })}">儲存
                                                        </button>
                                                    </div>`,
                                                    gvc.bindView(() => {
                                                        const id = gvc.glitter.getUUID();
                                                        return {
                                                            bind: id,
                                                            view: () => {
                                                                return PageEditor.styleRenderSelector({
                                                                    gvc: gvc,
                                                                    vid: gvc.glitter.getUUID(),
                                                                    viewModel: {
                                                                        selectContainer: gvc.glitter.share.editorViewModel.data.config,
                                                                        globalStyle: gvc.glitter.share.editorViewModel.globalStyle,
                                                                        data: gvc.glitter.share.editorViewModel.data
                                                                    },
                                                                    docID: '',
                                                                    selectBack: (dd) => {
                                                                        NormalPageEditor.toggle({
                                                                            visible: true,
                                                                            title: '編輯STYLE樣式',
                                                                            view: PageEditor.styleRenderEditor({
                                                                                gvc: gvc,
                                                                                vid: gvc.glitter.getUUID(),
                                                                                viewModel: {
                                                                                    selectItem: dd,
                                                                                    get globalStyle() {
                                                                                        return gvc.glitter.share.editorViewModel.globalStyle;
                                                                                    },
                                                                                    set globalStyle(v) {
                                                                                        gvc.glitter.share.editorViewModel.globalStyle = v;
                                                                                    },
                                                                                    data: gvc.glitter.share.editorViewModel.data
                                                                                },
                                                                                docID: '',
                                                                                editFinish: () => {
                                                                                }
                                                                            }),
                                                                            width: 450
                                                                        });
                                                                    }
                                                                });
                                                            },
                                                            divCreate: {
                                                                class: `m-n2`
                                                            }
                                                        };
                                                    })].join('');
                                            case "script":
                                                return [html `
                                                    <div class="position-relative bgf6 d-flex align-items-center justify-content-between mx-n2 mt-n2 p-2 border-bottom shadow mb-2 d-none">
                                                        <span class="fs-6 fw-bold "
                                                              style="color:black;">頁面代碼設定</span>
                                                        <button class="btn btn-primary-c "
                                                                style="height: 28px;width:40px;font-size:14px;"
                                                                onclick="${gvc.event(() => {
                                                        gvc.glitter.htmlGenerate.saveEvent();
                                                    })}">儲存
                                                        </button>
                                                    </div>`, gvc.bindView(() => {
                                                        const id = gvc.glitter.getUUID();
                                                        return {
                                                            bind: id,
                                                            view: () => {
                                                                return PageEditor.scriptRenderSelector({
                                                                    gvc: gvc,
                                                                    vid: gvc.glitter.getUUID(),
                                                                    viewModel: {
                                                                        selectContainer: gvc.glitter.share.editorViewModel.data.config,
                                                                        globalScript: gvc.glitter.share.editorViewModel.globalScript,
                                                                        data: gvc.glitter.share.editorViewModel.data
                                                                    },
                                                                    docID: '',
                                                                    selectBack: (dd) => {
                                                                        NormalPageEditor.toggle({
                                                                            visible: true,
                                                                            title: '編輯觸發事件',
                                                                            view: PageEditor.scriptRenderEditor({
                                                                                gvc: gvc,
                                                                                vid: gvc.glitter.getUUID(),
                                                                                viewModel: {
                                                                                    selectItem: dd,
                                                                                    get globalScript() {
                                                                                        return gvc.glitter.share.editorViewModel.globalScript;
                                                                                    },
                                                                                    set globalScript(v) {
                                                                                        gvc.glitter.share.editorViewModel.globalScript = v;
                                                                                    },
                                                                                    data: gvc.glitter.share.editorViewModel.data
                                                                                },
                                                                                docID: '',
                                                                                editFinish: () => {
                                                                                }
                                                                            }),
                                                                            width: 400
                                                                        });
                                                                    }
                                                                });
                                                            },
                                                            divCreate: {
                                                                class: `m-n2`
                                                            }
                                                        };
                                                    })].join('');
                                            case "code":
                                                const json = JSON.parse(JSON.stringify(gvc.glitter.share.editorViewModel.data.config));
                                                json.map((dd) => {
                                                    dd.refreshAllParameter = undefined;
                                                    dd.refreshComponentParameter = undefined;
                                                });
                                                let value = JSON.stringify(json, null, '\t');
                                                return gvc.bindView(() => {
                                                    const id = gvc.glitter.getUUID();
                                                    return {
                                                        bind: id,
                                                        view: () => {
                                                            return html `
                                                                <div class="alert alert-danger flex-fill m-0 p-2 fw-500"
                                                                     style="white-space: normal;word-break:break-all;font-size:14px;">
                                                                    此頁面的配置檔包含所有設計模組和觸發事件的代碼配置項目。<br>建議由熟悉程式開發的工程師進行編輯。
                                                                </div>
                                                                ${EditorElem.customCodeEditor({
                                                                gvc: gvc,
                                                                height: window.innerHeight - 320,
                                                                initial: value,
                                                                title: 'JSON配置參數',
                                                                callback: (data) => {
                                                                    value = data;
                                                                },
                                                                language: 'json'
                                                            })}
                                                                <div class="d-flex w-100 mb-2 mt-2 justify-content-end"
                                                                     style="gap:10px;">
                                                                    <button class="btn btn-outline-secondary-c "
                                                                            style="flex:1;height:40px; width:calc(50% - 10px);"
                                                                            onclick="${gvc.event(() => {
                                                                navigator.clipboard.writeText(JSON.stringify(json, null, '\t'));
                                                            })}"><i
                                                                            class="fa-regular fa-copy me-2"></i>複製到剪貼簿
                                                                    </button>
                                                                    <button class="btn btn-primary-c "
                                                                            style="flex:1; height:40px; width:calc(50% - 10px);"
                                                                            onclick="${gvc.event(() => {
                                                                const dialog = new ShareDialog(gvc.glitter);
                                                                try {
                                                                    gvc.glitter.share.editorViewModel.data.config = JSON.parse(value);
                                                                    gvc.glitter.closeDiaLog();
                                                                    gvc.glitter.htmlGenerate.saveEvent();
                                                                }
                                                                catch (e) {
                                                                    dialog.errorMessage({ text: "代碼輸入錯誤" });
                                                                    console.log(`${e}${e.stack}${e.line}`);
                                                                }
                                                            })}"><i
                                                                            class="fa-regular fa-floppy-disk me-2"></i>儲存
                                                                    </button>
                                                                </div>
                                                            `;
                                                        },
                                                        divCreate: {
                                                            class: `p-2`
                                                        }
                                                    };
                                                });
                                        }
                                    },
                                    divCreate: () => {
                                        return {
                                            class: ` h-100 p-2 d-flex flex-column`,
                                            style: `width:100%;max-height:calc(100vh - 100px);overflow-y:auto;overflow-x:hidden;`
                                        };
                                    },
                                    onCreate: () => {
                                        $('.tooltip').remove();
                                        $('[data-bs-toggle="tooltip"]').tooltip();
                                    }
                                };
                            })
                        ].join('');
                    }
                };
            })
        });
    }
    static leftNav(gvc) {
        const html = String.raw;
        return html `
            <div class="vw-100 vh-100 position-fixed left-0 top-0 d-none"
                 id="codeSettingViewHover"
                 style="z-index: 99999;background: rgba(0,0,0,0.5);"
                 onclick="${gvc.event(() => {
            PageCodeSetting.toggle(false, gvc);
        })}"></div>

            <div id="PageCodeSettingView"
                 class="position-fixed left-0 top-0 h-100 bg-white shadow-lg "
                 style="width:400px;z-index: 99999;left: -120%;">
                ${PageCodeSetting.view(gvc)}
            </div>`;
    }
    static view(gvc) {
        const glitter = gvc.glitter;
        const html = String.raw;
        const id = glitter.getUUID();
        PageCodeSetting.refresh = () => {
            gvc.notifyDataChange(id);
        };
        return gvc.bindView(() => {
            return {
                bind: id,
                view: () => {
                    return [
                        html `
                            <div class="w-100 d-flex align-items-center p-3 border-bottom">
                                <h5 class="offcanvas-title" style="">頁面代碼</h5>
                                <div class="flex-fill"></div>
                                <div class="fs-5 text-black" style="cursor: pointer;" onclick="${gvc.event(() => {
                            PageCodeSetting.toggle(false, gvc);
                        })}"><i class="fa-sharp fa-regular fa-circle-xmark" style="color:black;"></i></div>
                            </div>`,
                        `<div class="d-flex  py-2 px-2 bg-white align-items-center w-100 justify-content-around border-bottom">${(() => {
                            let list = [
                                {
                                    key: 'style',
                                    label: "Style-代碼樣式",
                                    icon: '<i class="fa-regular fa-regular fa-pen-swirl"></i>'
                                },
                                {
                                    key: 'script',
                                    label: "Script-代碼事件",
                                    icon: '<i class="fa-regular fa-file-code"></i>'
                                },
                                {
                                    key: 'code',
                                    label: "頁面配置檔",
                                    icon: '<i class="fa-sharp fa-solid fa-code fa-fw"></i>'
                                }
                            ];
                            return list.map((dd) => {
                                return `<div class="d-flex align-items-center justify-content-center hoverBtn  border"
                                 style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;
                                 ${(Storage.code_set_select === dd.key) ? `background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);background:-webkit-linear-gradient(135deg, #667eea 0%, #764ba2 100%);color:white;` : ``}
                                 "
                                 data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                 data-bs-title="${dd.label}" onclick="${gvc.event(() => {
                                    Storage.code_set_select = dd.key;
                                    gvc.notifyDataChange(id);
                                })}">
                               ${dd.icon}
                            </div>`;
                            }).join('');
                        })()}</div>`,
                        gvc.bindView(() => {
                            const docID = gvc.glitter.getUUID();
                            let viewModel = JSON.parse(JSON.stringify(glitter.share.editorViewModel));
                            let editData = viewModel.data;
                            return {
                                bind: docID,
                                view: () => {
                                    switch (Storage.code_set_select) {
                                        case "style":
                                            return [html `
                                                <div class="position-relative bgf6 d-flex align-items-center justify-content-between mx-n2 mt-n2 p-2 border-bottom shadow mb-2 d-none">
                                                    <span class="fs-6 fw-bold " style="color:black;">樣式設定</span>
                                                    <button class="btn btn-primary-c "
                                                            style="height: 28px;width:40px;font-size:14px;"
                                                            onclick="${gvc.event(() => {
                                                    gvc.glitter.htmlGenerate.saveEvent();
                                                })}">儲存
                                                    </button>
                                                </div>`,
                                                gvc.bindView(() => {
                                                    const id = gvc.glitter.getUUID();
                                                    return {
                                                        bind: id,
                                                        view: () => {
                                                            return PageEditor.styleRenderSelector({
                                                                gvc: gvc,
                                                                vid: gvc.glitter.getUUID(),
                                                                viewModel: {
                                                                    selectContainer: glitter.share.editorViewModel.data.config,
                                                                    globalStyle: glitter.share.editorViewModel.globalStyle,
                                                                    data: glitter.share.editorViewModel.data
                                                                },
                                                                docID: '',
                                                                selectBack: (dd) => {
                                                                    NormalPageEditor.toggle({
                                                                        visible: true,
                                                                        title: '編輯STYLE樣式',
                                                                        view: PageEditor.styleRenderEditor({
                                                                            gvc: gvc,
                                                                            vid: gvc.glitter.getUUID(),
                                                                            viewModel: {
                                                                                selectItem: dd,
                                                                                get globalStyle() {
                                                                                    return glitter.share.editorViewModel.globalStyle;
                                                                                },
                                                                                set globalStyle(v) {
                                                                                    glitter.share.editorViewModel.globalStyle = v;
                                                                                },
                                                                                data: glitter.share.editorViewModel.data
                                                                            },
                                                                            docID: '',
                                                                            editFinish: () => {
                                                                            }
                                                                        }),
                                                                        width: 450
                                                                    });
                                                                }
                                                            });
                                                        },
                                                        divCreate: {
                                                            class: `m-n2`
                                                        }
                                                    };
                                                })].join('');
                                        case "script":
                                            return [html `
                                                <div class="position-relative bgf6 d-flex align-items-center justify-content-between mx-n2 mt-n2 p-2 border-bottom shadow mb-2">
                                                    <span class="fs-6 fw-bold " style="color:black;">頁面代碼設定</span>
                                                    <button class="btn btn-primary-c "
                                                            style="height: 28px;width:40px;font-size:14px;"
                                                            onclick="${gvc.event(() => {
                                                    gvc.glitter.htmlGenerate.saveEvent();
                                                })}">儲存
                                                    </button>
                                                </div>`, gvc.bindView(() => {
                                                    const id = gvc.glitter.getUUID();
                                                    return {
                                                        bind: id,
                                                        view: () => {
                                                            return PageEditor.scriptRenderSelector({
                                                                gvc: gvc,
                                                                vid: gvc.glitter.getUUID(),
                                                                viewModel: {
                                                                    selectContainer: glitter.share.editorViewModel.data.config,
                                                                    globalScript: glitter.share.editorViewModel.globalScript,
                                                                    data: glitter.share.editorViewModel.data
                                                                },
                                                                docID: '',
                                                                selectBack: (dd) => {
                                                                    NormalPageEditor.toggle({
                                                                        visible: true,
                                                                        title: '編輯觸發事件',
                                                                        view: PageEditor.scriptRenderEditor({
                                                                            gvc: gvc,
                                                                            vid: gvc.glitter.getUUID(),
                                                                            viewModel: {
                                                                                selectItem: dd,
                                                                                get globalScript() {
                                                                                    return glitter.share.editorViewModel.globalScript;
                                                                                },
                                                                                set globalScript(v) {
                                                                                    glitter.share.editorViewModel.globalScript = v;
                                                                                },
                                                                                data: glitter.share.editorViewModel.data
                                                                            },
                                                                            docID: '',
                                                                            editFinish: () => {
                                                                            }
                                                                        }),
                                                                        width: 400
                                                                    });
                                                                }
                                                            });
                                                        },
                                                        divCreate: {
                                                            class: `m-n2`
                                                        }
                                                    };
                                                })].join('');
                                        case "code":
                                            const json = JSON.parse(JSON.stringify(glitter.share.editorViewModel.data.config));
                                            json.map((dd) => {
                                                dd.refreshAllParameter = undefined;
                                                dd.refreshComponentParameter = undefined;
                                            });
                                            let value = JSON.stringify(json, null, '\t');
                                            return gvc.bindView(() => {
                                                const id = glitter.getUUID();
                                                return {
                                                    bind: id,
                                                    view: () => {
                                                        return html `
                                                            <div class="alert alert-danger flex-fill m-0 p-2 fw-500"
                                                                 style="white-space: normal;word-break:break-all;font-size:14px;">
                                                                此頁面的配置檔包含所有設計模組和觸發事件的代碼配置項目。<br>建議由熟悉程式開發的工程師進行編輯。
                                                            </div>
                                                            ${EditorElem.customCodeEditor({
                                                            gvc: gvc,
                                                            height: window.innerHeight - 320,
                                                            initial: value,
                                                            title: 'JSON配置參數',
                                                            callback: (data) => {
                                                                value = data;
                                                            },
                                                            language: 'json'
                                                        })}
                                                            <div class="d-flex w-100 mb-2 mt-2 justify-content-end"
                                                                 style="gap:10px;">
                                                                <button class="btn btn-outline-secondary-c "
                                                                        style="flex:1;height:40px; width:calc(50% - 10px);"
                                                                        onclick="${gvc.event(() => {
                                                            navigator.clipboard.writeText(JSON.stringify(json, null, '\t'));
                                                        })}"><i
                                                                        class="fa-regular fa-copy me-2"></i>複製到剪貼簿
                                                                </button>
                                                                <button class="btn btn-primary-c "
                                                                        style="flex:1; height:40px; width:calc(50% - 10px);"
                                                                        onclick="${gvc.event(() => {
                                                            const dialog = new ShareDialog(gvc.glitter);
                                                            try {
                                                                glitter.share.editorViewModel.data.config = JSON.parse(value);
                                                                glitter.closeDiaLog();
                                                                glitter.htmlGenerate.saveEvent();
                                                            }
                                                            catch (e) {
                                                                dialog.errorMessage({ text: "代碼輸入錯誤" });
                                                                console.log(`${e}${e.stack}${e.line}`);
                                                            }
                                                        })}"><i
                                                                        class="fa-regular fa-floppy-disk me-2"></i>儲存
                                                                </button>
                                                            </div>
                                                        `;
                                                    },
                                                    divCreate: {
                                                        class: `p-2`
                                                    }
                                                };
                                            });
                                        default: return ``;
                                    }
                                },
                                divCreate: () => {
                                    return {
                                        class: ` h-100 p-2 d-flex flex-column`,
                                        style: `width:100%;max-height:calc(100vh - 100px);overflow-y:auto;overflow-x:hidden;`
                                    };
                                },
                                onCreate: () => {
                                    $('.tooltip').remove();
                                    $('[data-bs-toggle="tooltip"]').tooltip();
                                }
                            };
                        })
                    ].join('');
                },
                onCreate: () => {
                    $('.tooltip').remove();
                    $('[data-bs-toggle="tooltip"]').tooltip();
                }
            };
        });
    }
}
PageCodeSetting.refresh = () => {
};
PageCodeSetting.checkFinish = (callback) => {
    callback();
};
