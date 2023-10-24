import { init } from '../GVController.js';
import { EditorElem } from "./editor-elem.js";
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
                                                { title: "程式碼", value: "code" }
                                            ],
                                            callback: (text) => {
                                                styleData.style_from = text;
                                                gvc.notifyDataChange(id);
                                            }
                                        })}</div>`,
                                        (() => {
                                            if (styleData.style_from === 'code') {
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
                                                                    class: ` rounded-3 px-3 mt-2 py-1 `, style: `border:1px solid black;`
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
                                                                    class: ` rounded-3 px-3 mt-2 py-1 `, style: `border:1px solid black;`
                                                                }
                                                            };
                                                        })
                                                    ].join('');
                                                }
                                                return html `
                                                                                    <div class="mx-2">
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
                                                            gvc.recreateView();
                                                        })
                                                    },
                                                    refreshComponent: () => {
                                                        gvc.recreateView();
                                                    }
                                                })}
                                                                                    </div>`;
                                            }
                                            else {
                                                return ``;
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
