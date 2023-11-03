import { init } from '../GVController.js';
import { EditorElem } from "./editor-elem.js";
import Add_item_dia from "../../editor/add_item_dia.js";
import { PageEditor } from "../../editor-widget/page-editor.js";
const html = String.raw;
init((gvc, glitter, gBundle) => {
    return {
        onCreateView: () => {
            var _a, _b;
            const styleData = gBundle.data;
            styleData.style_from = (_a = styleData.style_from) !== null && _a !== void 0 ? _a : 'code';
            styleData.stylist = (_b = styleData.stylist) !== null && _b !== void 0 ? _b : [];
            const id = gvc.glitter.getUUID();
            function migrateFrSize(key) {
                try {
                    if (styleData[key].trim().startsWith('glitter.ut.frSize')) {
                        const data = styleData[key].trim().replace(`glitter.ut.frSize(`, '');
                        let f1 = `(()=>{
                return ${data.substring(0, data.lastIndexOf(`},`))}}
                })()`;
                        f1 = eval(f1);
                        let f2 = data.substring(data.lastIndexOf(`},`) + 2, data.length - 1);
                        f2 = eval(f2);
                        styleData[key] = f2;
                        Object.keys(f1).map((d1) => {
                            let waitPost = styleData.stylist.find((d2) => {
                                return d2.size === d1;
                            });
                            if (!waitPost) {
                                waitPost = {
                                    size: d1,
                                    style: ``,
                                    class: ``
                                };
                                styleData.stylist.push(waitPost);
                            }
                            waitPost[key] = f1[d1];
                        });
                    }
                }
                catch (e) {
                }
            }
            migrateFrSize("class");
            migrateFrSize("style");
            return html `
                <div class="vw-100 vh-100 d-flex align-items-center justify-content-center"
                     style="background:rgba(0,0,0,0.6);">
                    <div class="bg-white rounded" style="max-height:90vh;max-width:900px;">
                        <div class="d-flex w-100 border-bottom align-items-center" style="height:50px;">
                            <h3 style="font-size:15px;font-weight:500;" class="m-0 ps-3">
                                設定CSS樣式</h3>
                            <div class="flex-fill"></div>
                            <div class="hoverBtn p-2 me-2" style="color:black;font-size:20px;"
                                 onclick="${gvc.event(() => {
                gvc.closeDialog();
                gBundle.callback();
            })}"
                            ><i class="fa-sharp fa-regular fa-circle-xmark"></i>
                            </div>
                        </div>
                        <div class="d-flex " style="">
                            <div>
                                ${gvc.bindView(() => {
                return {
                    bind: id,
                    view: () => {
                        return html `
                                                <div class="d-flex">
                                                    <div style="width:400px;" class="border-end  pb-2">
                                                        ${gvc.bindView(() => {
                            const id = gvc.glitter.getUUID();
                            return {
                                bind: id,
                                view: () => {
                                    return [
                                        `<div class="mx-2">${EditorElem.select({
                                            title: '設定樣式來源',
                                            gvc: gvc,
                                            def: styleData.style_from,
                                            array: [
                                                { title: "設計代碼", value: "code" },
                                                { title: "設計標籤", value: "tag" }
                                            ],
                                            callback: (text) => {
                                                styleData.style_from = text;
                                                gvc.notifyDataChange(id);
                                            }
                                        })}</div>`,
                                        (() => {
                                            if (styleData.style_from === 'code') {
                                                return styleEditor(gvc, styleData);
                                            }
                                            else if (styleData.style_from === 'tag') {
                                                return html `<div class="mx-2">
                                                                                        <div class="btn btn-primary-c  w-100"
                                                                                             onclick="${gvc.event(() => {
                                                    glitter.share.selectStyleCallback = (tag) => {
                                                        function toOneArray(array, map) {
                                                            try {
                                                                array.map((dd) => {
                                                                    if (dd.type === 'container') {
                                                                        toOneArray(dd.data.setting, map);
                                                                    }
                                                                    else {
                                                                        map[dd.data.tag] = dd.data.value;
                                                                    }
                                                                });
                                                                return map;
                                                            }
                                                            catch (e) { }
                                                        }
                                                        ;
                                                        glitter.share.editerGlitter.share.globalStyle = toOneArray(glitter.share.editorViewModel.globalStyleTag, {});
                                                        styleData.tag = tag;
                                                        glitter.closeDiaLog('EditItem');
                                                        gvc.recreateView();
                                                    };
                                                    gvc.glitter.innerDialog((gvc) => {
                                                        let searchText = '';
                                                        let searchInterval = 0;
                                                        const id = gvc.glitter.getUUID();
                                                        return html `
                                                                                                         <div class="bg-white rounded"
                                                                                                              style="max-height:90vh;">
                                                                                                             <div class="d-flex w-100 border-bottom align-items-center"
                                                                                                                  style="height:50px;">
                                                                                                                 <h3 style="font-size:15px;font-weight:500;"
                                                                                                                     class="m-0 ps-3">
                                                                                                                     設定STYLE標籤</h3>
                                                                                                                 <div class="flex-fill"></div>
                                                                                                                 <div class="hoverBtn p-2 me-2"
                                                                                                                      style="color:black;font-size:20px;"
                                                                                                                      onclick="${gvc.event(() => {
                                                            if (styleData.tag) {
                                                                glitter.share.selectStyleCallback(styleData.tag);
                                                            }
                                                        })}"
                                                                                                                 >
                                                                                                                     <i class="fa-sharp fa-regular fa-circle-xmark"></i>
                                                                                                                 </div>
                                                                                                             </div>
                                                                                                             <div class="d-flex "
                                                                                                                  style="">
                                                                                                                 <div>
                                                                                                                     ${gvc.bindView(() => {
                                                            return {
                                                                bind: id,
                                                                view: () => {
                                                                    const contentVM = {
                                                                        loading: true,
                                                                        leftID: gvc.glitter.getUUID(),
                                                                        rightID: gvc.glitter.getUUID(),
                                                                        leftBar: '',
                                                                        rightBar: ''
                                                                    };
                                                                    styleRender(gvc, styleData.tag).then((response) => {
                                                                        contentVM.loading = false;
                                                                        contentVM.leftBar = response.left;
                                                                        contentVM.rightBar = response.right;
                                                                        gvc.notifyDataChange([contentVM.leftID, contentVM.rightID]);
                                                                    });
                                                                    return html `
                                                                                                                                     <div class="d-flex">
                                                                                                                                         <div style="width:300px;"
                                                                                                                                              class="border-end">
                                                                                                                                             ${gvc.bindView(() => {
                                                                        return {
                                                                            bind: contentVM.leftID,
                                                                            view: () => {
                                                                                return contentVM.leftBar;
                                                                            },
                                                                            divCreate: {
                                                                                class: ``,
                                                                                style: `max-height:calc(90vh - 150px);overflow-y:auto;overflow-x:hidden;`
                                                                            }
                                                                        };
                                                                    })}
                                                                                                                                         </div>
                                                                                                                                         ${gvc.bindView(() => {
                                                                        return {
                                                                            bind: contentVM.rightID,
                                                                            view: () => {
                                                                                return contentVM.rightBar;
                                                                            },
                                                                            divCreate: {}
                                                                        };
                                                                    })}
                                                                                                                                     </div>`;
                                                                },
                                                                divCreate: {
                                                                    style: `overflow-y:auto;`
                                                                },
                                                                onCreate: () => {
                                                                }
                                                            };
                                                        })}
                                                                                                                 </div>
                                                                                                             </div>
                                                                                                         </div>
                                                                                                     `;
                                                    }, "EditItem");
                                                })}">
                                                                                           ${styleData.tag ? `當前標籤 : [${styleData.tag}]` : `設定標籤`} 
                                                                                        </div>
                                                                                    </div>`;
                                            }
                                        })()
                                    ].join('<div class="my-2"></div>');
                                },
                                divCreate: {
                                    class: ``,
                                    style: `max-height:calc(90vh - 150px);overflow-y:auto;`
                                }
                            };
                        })}
                                                    </div>
                                                </div>`;
                    },
                    divCreate: {
                        style: `overflow-y:auto;`
                    },
                    onCreate: () => {
                    }
                };
            })}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    };
});
function styleRender(gvc, tag) {
    var _a, _b;
    const html = String.raw;
    const glitter = gvc.glitter;
    const viewModel = gvc.glitter.share.editorViewModel;
    const docID = glitter.getUUID();
    const vid = glitter.getUUID();
    viewModel.selectItem = undefined;
    viewModel.globalStyleTag = (_a = viewModel.globalStyleTag) !== null && _a !== void 0 ? _a : [];
    viewModel.data.page_config.globalStyleTag = (_b = viewModel.data.page_config.globalStyleTag) !== null && _b !== void 0 ? _b : [];
    return new Promise((resolve, reject) => {
        resolve({
            left: gvc.bindView(() => {
                return {
                    bind: vid,
                    view: () => {
                        return [
                            html `
                                <div class="d-flex   px-2   hi fw-bold d-flex align-items-center border-bottom"
                                     style="font-size:14px;color:black;">全域標籤
                                    <div class="flex-fill"></div>
                                    <l1 class="btn-group dropend" onclick="${gvc.event(() => {
                                viewModel.selectContainer = viewModel.globalStyleTag;
                            })}">
                                        <div class="editor_item   px-2 me-0 d-none" style="cursor:pointer; "
                                             onclick="${gvc.event(() => {
                                viewModel.selectContainer = viewModel.globalStyleTag;
                                glitter.share.pastEvent();
                            })}"
                                        >
                                            <i class="fa-duotone fa-paste"></i>
                                        </div>
                                        <div class="editor_item   px-2 ms-0 me-n1"
                                             style="cursor:pointer;gap:5px;"
                                             data-bs-toggle="dropdown"
                                             aria-haspopup="true"
                                             aria-expanded="false">
                                            <i class="fa-regular fa-circle-plus "></i>
                                        </div>
                                        <div class="dropdown-menu mx-1 position-fixed pb-0 border "
                                             style="z-index:999999;"
                                             onclick="${gvc.event((e, event) => {
                                event.preventDefault();
                                event.stopPropagation();
                            })}">
                                            ${Add_item_dia.add_content_folder(gvc, (response) => {
                                viewModel.globalStyleTag.push(response);
                                gvc.notifyDataChange(vid);
                            })}
                                        </div>
                                    </l1>
                                </div>`,
                            new PageEditor(gvc, vid, docID).renderLineItem(viewModel.globalStyleTag.map((dd, index) => {
                                dd.index = index;
                                return dd;
                            }), false, viewModel.globalStyleTag, {
                                addComponentView: Add_item_dia.add_content_folder,
                                copyType: 'directly',
                                selectEv: (dd) => {
                                    var _a, _b;
                                    if (((_a = dd.data) !== null && _a !== void 0 ? _a : {}).tag && ((_b = dd.data) !== null && _b !== void 0 ? _b : {}).tag === tag) {
                                        viewModel.selectItem = dd;
                                        tag = undefined;
                                        gvc.notifyDataChange(docID);
                                        return true;
                                    }
                                    else {
                                        return false;
                                    }
                                }
                            })
                        ].join('');
                    },
                    divCreate: {
                        style: `min-height:400px;`
                    },
                    onCreate: () => {
                        gvc.notifyDataChange(docID);
                    }
                };
            }),
            right: gvc.bindView(() => {
                return {
                    bind: docID,
                    view: () => {
                        if (viewModel.selectItem) {
                            return html `
                                <div class="d-flex mx-n2 mt-n2 px-2 hi fw-bold d-flex align-items-center border-bottom border-top py-2 bgf6"
                                     style="color:#151515;font-size:16px;gap:0px;height:48px;">
                                    ${viewModel.selectItem.label}
                                    <button class="btn btn-outline-danger ms-auto" style="height: 35px;width: 100px;"
                                            onclick="${gvc.event(() => {
                                function checkValue(check) {
                                    let data = [];
                                    check.map((dd) => {
                                        var _a;
                                        if (dd.id !== viewModel.selectItem.id) {
                                            data.push(dd);
                                        }
                                        if (dd.type === 'container') {
                                            dd.data.setting = checkValue((_a = dd.data.setting) !== null && _a !== void 0 ? _a : []);
                                        }
                                    });
                                    return data;
                                }
                                viewModel.globalStyleTag = checkValue(viewModel.globalStyleTag);
                                viewModel.selectItem = undefined;
                                gvc.notifyDataChange([vid, docID]);
                            })}">
                                        <i class="fa-light fa-circle-minus me-2"></i>移除標籤
                                    </button>
                                </div>
                                ${gvc.bindView(() => {
                                return {
                                    bind: `htmlGenerate`,
                                    view: () => {
                                        var _a;
                                        return (viewModel.selectItem.type === 'container') ? EditorElem.editeInput({
                                            gvc: gvc,
                                            title: `${((viewModel.selectItem.type === 'container') ? `分類` : `標籤`)}名稱`,
                                            default: (_a = viewModel.selectItem.label) !== null && _a !== void 0 ? _a : "",
                                            placeHolder: `請輸入${((viewModel.selectItem.type === 'container') ? `分類` : `標籤`)}名稱`,
                                            callback: (text) => {
                                                viewModel.selectItem.label = text;
                                                gvc.notifyDataChange([vid, docID]);
                                            }
                                        }) : `` + ((viewModel.selectItem.type === 'container') ? `` : (() => {
                                            var _a, _b;
                                            viewModel.selectItem.data.tagType = (_a = viewModel.selectItem.data.tagType) !== null && _a !== void 0 ? _a : "value";
                                            if (typeof viewModel.selectItem.data.value !== 'object') {
                                                viewModel.selectItem.data.value = {};
                                            }
                                            const data = [EditorElem.editeInput({
                                                    gvc: gvc,
                                                    title: `標籤名稱`,
                                                    default: (_b = viewModel.selectItem.data.tag) !== null && _b !== void 0 ? _b : "",
                                                    placeHolder: `請輸入標籤名`,
                                                    callback: (text) => {
                                                        viewModel.selectItem.data.tag = text;
                                                        viewModel.selectItem.label = text;
                                                        gvc.notifyDataChange([vid, docID]);
                                                    }
                                                }), `<div class="mx-n2">${styleEditor(gvc, viewModel.selectItem.data.value)}</div>`];
                                            return data.join('');
                                        })());
                                    },
                                    divCreate: {
                                        class: `p-2`, style: `overflow-y:auto;max-height:calc(100vh - 270px);`
                                    },
                                    onCreate: () => {
                                        setTimeout(() => {
                                            var _a;
                                            $('#jumpToNav').scrollTop((_a = parseInt(glitter.getCookieByName('jumpToNavScroll'), 10)) !== null && _a !== void 0 ? _a : 0);
                                        }, 1000);
                                    }
                                };
                            })}
                                <div class="flex-fill"></div>
                                <div class=" d-flex border-top align-items-center mb-n1 py-2 pt-2 mx-n2 pe-3 bgf6"
                                     style="height:50px;">
                                    <div class="flex-fill"></div>
                                    <button class="btn btn-primary-c me-n2" style="height: 40px;width: 100px;"
                                            onclick="${gvc.event(() => {
                                glitter.share.selectStyleCallback(viewModel.selectItem.data.tag);
                            })}">
                                        <i class="fa-regular fa-circle-plus me-2"></i>
                                        選擇標籤
                                    </button>
                                </div>
                            `;
                        }
                        else {
                            return html `
                                <div class="d-flex mx-n2 mt-n2 px-2 hi fw-bold d-flex align-items-center border-bottom border-top py-2 bgf6"
                                     style="color:#151515;font-size:16px;gap:0px;height:48px;">
                                    說明描述
                                </div>
                                <div class="d-flex flex-column w-100 align-items-center justify-content-center"
                                     style="height:calc(100% - 48px);">
                                    <lottie-player src="lottie/animation_cdd.json" class="mx-auto my-n4" speed="1"
                                                   style="max-width: 100%;width: 250px;height:300px;" loop
                                                   autoplay></lottie-player>
                                    <h3 class=" text-center px-4" style="font-size:18px;">透過設定STYLE標籤，來決定頁面的統一樣式。
                                    </h3>
                                </div>
                            `;
                        }
                    },
                    divCreate: () => {
                        return {
                            class: ` h-100 p-2 d-flex flex-column`, style: `width:400px;`
                        };
                    },
                    onCreate: () => {
                    }
                };
            })
        });
    });
}
function styleEditor(gvc, styleData, classs = 'mx-2') {
    var _a;
    console.log(`styleData`, styleData);
    styleData.stylist = (_a = styleData.stylist) !== null && _a !== void 0 ? _a : [];
    const glitter = gvc.glitter;
    function editIt(gvc, data) {
        var _a, _b;
        data.class = ((_a = data.class) !== null && _a !== void 0 ? _a : "").trim();
        data.style = ((_b = data.style) !== null && _b !== void 0 ? _b : "").trim();
        return [
            gvc.bindView(() => {
                var _a;
                const id = glitter.getUUID();
                data.classDataType = (_a = data.classDataType) !== null && _a !== void 0 ? _a : "static";
                return {
                    bind: id,
                    view: () => {
                        return [
                            `
                                                                                                     <h3 style="color: black;font-size: 24px;margin-bottom: 10px;" class="fw-bold mt-2">CLASS參數</h3> 
                                                                                                        `,
                            EditorElem.select({
                                title: "設定參數資料來源",
                                gvc: gvc,
                                def: data.classDataType,
                                array: [
                                    {
                                        title: '靜態來源',
                                        value: 'static'
                                    },
                                    {
                                        title: '程式碼',
                                        value: 'code'
                                    }
                                ],
                                callback: (text) => {
                                    data.classDataType = text;
                                    gvc.notifyDataChange(id);
                                }
                            }),
                            `<div class="mt-2"></div>`,
                            (() => {
                                if (data.classDataType === 'static') {
                                    return EditorElem.editeText({
                                        gvc: gvc,
                                        default: data.class,
                                        title: ``,
                                        placeHolder: ``,
                                        callback: (text) => {
                                            data.class = text;
                                        }
                                    });
                                }
                                else {
                                    return EditorElem.codeEditor({
                                        gvc: gvc,
                                        height: 300,
                                        initial: data.class,
                                        title: ``,
                                        callback: (text) => {
                                            data.class = text;
                                        }
                                    });
                                }
                            })()
                        ].join('');
                    },
                    divCreate: {
                        class: ` rounded-3 px-3 mt-2 py-1 `,
                        style: `border:1px solid black;`
                    }
                };
            }),
            gvc.bindView(() => {
                var _a;
                const id = glitter.getUUID();
                data.dataType = (_a = data.dataType) !== null && _a !== void 0 ? _a : "static";
                return {
                    bind: id,
                    view: () => {
                        return [
                            `<h3 style="color: black;font-size: 24px;margin-bottom: 10px;" class="fw-bold mt-2">STYLE參數</h3>`,
                            EditorElem.select({
                                title: "設定參數資料來源",
                                gvc: gvc,
                                def: data.dataType,
                                array: [
                                    {
                                        title: '靜態來源',
                                        value: 'static'
                                    },
                                    {
                                        title: '程式碼',
                                        value: 'code'
                                    }
                                ],
                                callback: (text) => {
                                    data.dataType = text;
                                    gvc.notifyDataChange(id);
                                }
                            }),
                            `<div class="mt-2"></div>`,
                            (() => {
                                if (data.dataType === 'static') {
                                    return EditorElem.styleEditor({
                                        gvc: gvc,
                                        height: 300,
                                        initial: data.style,
                                        title: ``,
                                        callback: (text) => {
                                            data.style = text;
                                        }
                                    });
                                }
                                else {
                                    return EditorElem.codeEditor({
                                        gvc: gvc,
                                        height: 300,
                                        initial: data.style,
                                        title: ``,
                                        callback: (text) => {
                                            data.style = text;
                                        }
                                    });
                                }
                            })()
                        ].join('');
                    },
                    divCreate: {
                        class: ` rounded-3 px-3 mt-2 py-1 `,
                        style: `border:1px solid black;`
                    }
                };
            })
        ].join('');
    }
    return html `
        ${gvc.bindView(() => {
        const id = glitter.getUUID();
        return {
            bind: id,
            view: () => {
                return `<div class="mx-2">
            ${EditorElem.editerDialog({
                    gvc: gvc,
                    dialog: (gvc) => {
                        return editIt(gvc, styleData);
                    },
                    width: '600px',
                    editTitle: `裝置預設樣式`
                })}
        </div>
        <div class="my-2 w-100">
            ${EditorElem.arrayItem({
                    gvc: gvc,
                    title: '設定其他裝置尺寸',
                    array: () => {
                        return styleData.stylist.map((dd) => {
                            return {
                                title: `寬度:${dd.size}`,
                                innerHtml: () => {
                                    return EditorElem.editeInput({
                                        gvc: gvc,
                                        title: '設定寬度尺寸',
                                        default: `${dd.size}`,
                                        placeHolder: '請輸入Class參數',
                                        callback: (text) => {
                                            dd.size = text;
                                            gvc.recreateView();
                                        },
                                        type: 'text'
                                    }) + editIt(gvc, dd);
                                },
                                width: '600px'
                            };
                        });
                    },
                    originalArray: styleData.stylist,
                    expand: {},
                    plus: {
                        title: "新增尺寸",
                        event: gvc.event(() => {
                            styleData.stylist.push({
                                size: 480,
                                style: ``,
                                class: ``
                            });
                            gvc.notifyDataChange(id);
                        })
                    },
                    refreshComponent: () => {
                        gvc.notifyDataChange(id);
                    }
                })}
        </div>`;
            },
            divCreate: {}
        };
    })}
    `;
}
