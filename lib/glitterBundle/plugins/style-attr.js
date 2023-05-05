import { EditorElem } from "./editor-elem.js";
export const styleAttr = [
    {
        tag: "size", title: "大小", innerHtml: (gvc, data) => {
            const glitter = window.glitter;
            return `
            <div class="alert alert-primary mt-2">
                <span class="fw-bold">範例:</span>100% ,100px,100em
            </div>
            ${['height', 'min-height', 'max-height', 'width', 'min-width', 'max-width'].map((dd, index) => {
                var _a;
                const k = ["高", "最小高度", "最大高度", "寬", "最小寬度", "最大寬度"][index];
                return glitter.htmlGenerate.editeInput({
                    gvc: gvc,
                    title: `${k}`,
                    default: (_a = data[dd]) !== null && _a !== void 0 ? _a : "",
                    placeHolder: `輸入${k}`,
                    callback: (text) => {
                        data[dd] = text;
                    }
                });
            }).join('')}`;
        }
    },
    {
        tag: "margin", title: "外距", innerHtml: (gvc, data) => {
            const glitter = window.glitter;
            return `
            <div class="alert alert-primary mt-2">
                <span class="fw-bold">範例:</span>10px,10em,10pt,10%
            </div>
            ${['margin-left', 'margin-right', 'margin-top', 'margin-bottom'].map((dd, index) => {
                var _a;
                const k = ["左", "右", "上", "下"][index];
                return glitter.htmlGenerate.editeInput({
                    gvc: gvc,
                    title: `${k}側外距`,
                    default: (_a = data[dd]) !== null && _a !== void 0 ? _a : "",
                    placeHolder: `輸入${k}側外距`,
                    callback: (text) => {
                        data[dd] = text;
                    }
                });
            }).join('')}`;
        }
    },
    {
        tag: "padding", title: "內距", innerHtml: (gvc, data) => {
            const glitter = window.glitter;
            return `
            <div class="alert alert-primary mt-2">
            <span class="fw-bold">範例:</span>10px,10em,10pt,10%
</div>
            ${['padding-left', 'padding-right', 'padding-top', 'padding-bottom'].map((dd, index) => {
                var _a;
                const k = ["左", "右", "上", "下"][index];
                return glitter.htmlGenerate.editeInput({
                    gvc: gvc,
                    title: `${k}側內距`,
                    default: (_a = data[dd]) !== null && _a !== void 0 ? _a : "",
                    placeHolder: `輸入${k}側內距`,
                    callback: (text) => {
                        data[dd] = text;
                    }
                });
            }).join('')}`;
        }
    },
    {
        tag: "font", title: "字體設定", innerHtml: (gvc, data) => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            const glitter = window.glitter;
            return `<div class="alert alert-primary mt-2">
            <span class="fw-bold">範例:</span>10px,10em,10pt,10%
            </div>` + glitter.htmlGenerate.editeInput({
                gvc: gvc,
                title: `字體大小`,
                default: (_a = data["font-size"]) !== null && _a !== void 0 ? _a : "",
                placeHolder: `輸入字體大小`,
                callback: (text) => {
                    data["font-size"] = text;
                }
            }) + ` <div class="alert alert-primary mt-2">
            <span class="fw-bold">範例:</span>"Gill Sans", sans-serif 
            </div><div class="mb-2" style="width: 100%;height: 1px;background-color: white;"></div>` + glitter.htmlGenerate.editeInput({
                gvc: gvc,
                title: `字體`,
                default: (_b = data["font-family"]) !== null && _b !== void 0 ? _b : "",
                placeHolder: `輸入字體需求`,
                callback: (text) => {
                    data["font-family"] = text;
                }
            }) + ` <div class="alert alert-primary mt-2">
            <span class="fw-bold">範例:</span> normal,bold,400,700
            </div><div class="mb-2" style="width: 100%;height: 1px;background-color: white;"></div>` + glitter.htmlGenerate.editeInput({
                gvc: gvc,
                title: `字體粗細`,
                default: (_c = data["font-weight"]) !== null && _c !== void 0 ? _c : "",
                placeHolder: `輸入字體粗細`,
                callback: (text) => {
                    data["font-weight"] = text;
                }
            }) + ` <div class="alert alert-primary mt-2">
            <span class="fw-bold">範例:</span>  left、right、center、justify
            </div><div class="mb-2" style="width: 100%;height: 1px;background-color: white;"></div>` + glitter.htmlGenerate.editeInput({
                gvc: gvc,
                title: `對齊方式`,
                default: (_d = data["text-align"]) !== null && _d !== void 0 ? _d : "",
                placeHolder: `輸入如何對齊`,
                callback: (text) => {
                    data["text-align"] = text;
                }
            }) + ` <div class="alert alert-primary mt-2">
            <span class="fw-bold">範例:</span>underline、overline、line-through、none
            </div><div class="mb-2" style="width: 100%;height: 1px;background-color: white;"></div>` + glitter.htmlGenerate.editeInput({
                gvc: gvc,
                title: `文字效果`,
                default: (_e = data["text-decoration"]) !== null && _e !== void 0 ? _e : "",
                placeHolder: `輸入字體粗細`,
                callback: (text) => {
                    data["text-decoration"] = text;
                }
            }) + ` <div class="alert alert-primary mt-2">
            <span class="fw-bold">範例:</span>normal , 1em , 1px
            </div><div class="mb-2" style="width: 100%;height: 1px;background-color: white;"></div>` + glitter.htmlGenerate.editeInput({
                gvc: gvc,
                title: `字距`,
                default: (_f = data["letter-spacing"]) !== null && _f !== void 0 ? _f : "",
                placeHolder: `輸入字距`,
                callback: (text) => {
                    data["letter-spacing"] = text;
                }
            }) + ` <div class="alert alert-primary mt-2">
            <span class="fw-bold">範例:</span>1px , 1% , 1 , 1em
            <div class="mb-2" style="width: 100%;height: 1px;background-color: white;"></div>` + glitter.htmlGenerate.editeInput({
                gvc: gvc,
                title: `行高`,
                default: (_g = data["line-height"]) !== null && _g !== void 0 ? _g : "",
                placeHolder: `輸入行高`,
                callback: (text) => {
                    data["line-height"] = text;
                }
            }) + ` <div class="alert alert-primary mt-2">
            <span class="fw-bold">範例:</span>uppercase , lowercase , capitalize
            </div><div class="mb-2" style="width: 100%;height: 1px;background-color: white;"></div>` + glitter.htmlGenerate.editeInput({
                gvc: gvc,
                title: `大小寫轉換`,
                default: (_h = data["text-transform"]) !== null && _h !== void 0 ? _h : "",
                placeHolder: `統一uppercase、lowercase、capitalize或none`,
                callback: (text) => {
                    data["text-transform"] = text;
                }
            }) + ` <div class="alert alert-primary mt-2">
            <span class="fw-bold">範例:</span>0.1em 0.1em 0.05em #333
</div><div class="mb-2" style="width: 100%;height: 1px;background-color: white;"></div>` + glitter.htmlGenerate.editeInput({
                gvc: gvc,
                title: `字體陰影(向右,向下,模糊程度(可審略),顏色)`,
                default: data["text-shadow"],
                placeHolder: ``,
                callback: (text) => {
                    data["text-shadow"] = text;
                }
            }) + ` <div class="alert alert-primary mt-2">
            <span class="fw-bold">範例:</span>clip,ellipsis,或是特定字串代替
</div>` + glitter.htmlGenerate.editeInput({
                gvc: gvc,
                title: `文字溢出處理(太多會變省略號)`,
                default: data["text-overflow"],
                placeHolder: ``,
                callback: (text) => {
                    data["text-overflow"] = text;
                }
            });
        }
    },
    {
        tag: "background", title: "背景設定", innerHtml: (gvc, data) => {
            var _a;
            const glitter = window.glitter;
            return gvc.map([EditorElem.select({
                    title: 'Attachment',
                    gvc: gvc,
                    def: data["background-attachment"],
                    callback: (text) => {
                        data["background-attachment"] = text;
                    },
                    array: ["fixed", "local", "scroll"],
                }), EditorElem.select({
                    title: 'Clip',
                    gvc: gvc,
                    def: data["background-clip"],
                    callback: (text) => {
                        data["background-clip"] = text;
                    },
                    array: ["border-box", "padding-box", "content-box", "text"],
                }), `<div class="alert alert-primary mt-2">
            <span class="fw-bold">背景顏色範例:</span> black,white,#000000,rgb(0,0,0)
            </div>` + glitter.htmlGenerate.editeInput({
                    gvc: gvc,
                    title: `顏色`,
                    default: data["background-color"],
                    placeHolder: `輸入顏色`,
                    callback: (text) => {
                        data["background-color"] = text;
                    }
                }) +
                    `
            <input id="palette" value="${(_a = data["background-color"]) !== null && _a !== void 0 ? _a : ""}" type="background-color" style="margin-top:10px;" onchange="${gvc.event((e) => {
                        data["background-color"] = e.value;
                    })}">
            `, EditorElem.select({
                    title: 'Origin',
                    gvc: gvc,
                    def: data["background-origin"],
                    callback: (text) => {
                        data["background-origin"] = text;
                    },
                    array: ["border-box", "padding-box", "content-box", ""],
                }), EditorElem.select({
                    title: '位置',
                    gvc: gvc,
                    def: data["background-origin"],
                    callback: (text) => {
                        data["background-origin"] = text;
                    },
                    array: ["border-box", "padding-box", "content-box", ""],
                }), `<div class="alert alert-primary mt-2">
            <span class="fw-bold">背景位置:</span> top , left , bottom , right,50% 
            </div>` + glitter.htmlGenerate.editeInput({
                    gvc: gvc,
                    title: ``,
                    default: data["background-color"],
                    placeHolder: `輸入顏色`,
                    callback: (text) => {
                        data["background-color"] = text;
                    }
                }), EditorElem.select({
                    title: '重複',
                    gvc: gvc,
                    def: data["background-repeat"],
                    callback: (text) => {
                        data["background-repeat"] = text;
                    },
                    array: ["repeat", "no-repeat", "repeat-x", "repeat-y", "round", "space"],
                }), EditorElem.select({
                    title: '重複',
                    gvc: gvc,
                    def: data["background-repeat"],
                    callback: (text) => {
                        data["background-repeat"] = text;
                    },
                    array: ["repeat", "no-repeat", "repeat-x", "repeat-y", "round", "space"],
                })]);
        }
    },
    {
        tag: "background-image", title: "背景圖片", innerHtml: (gvc, data) => {
            var _a, _b;
            data["background-image"] = (_a = data["background-image"]) !== null && _a !== void 0 ? _a : "";
            data["background-repeat"] = (_b = data["background-repeat"]) !== null && _b !== void 0 ? _b : "repeat";
            return gvc.bindView(() => {
                const id = gvc.glitter.getUUID();
                return {
                    bind: id,
                    view: () => {
                        return gvc.map([EditorElem.uploadImage({
                                gvc: gvc,
                                title: `背景圖`,
                                def: data["background-image"],
                                callback: (dd) => {
                                    if (dd.indexOf(`url('`) === -1) {
                                        data["background-image"] = `url('${dd}')`;
                                    }
                                    gvc.notifyDataChange(id);
                                },
                            }), EditorElem.select({
                                title: '是否重複繪圖',
                                gvc: gvc,
                                def: data["background-repeat"],
                                callback: (text) => {
                                    data["background-repeat"] = text;
                                },
                                array: [{ title: "是", value: "repeat" }, { title: "否", value: "no-repeat" }],
                            })]);
                    },
                    divCreate: {}
                };
            });
        }
    },
    {
        tag: "color", title: "顏色", innerHtml: (gvc, data) => {
            var _a, _b;
            const glitter = window.glitter;
            data["color"] = (_a = data["color"]) !== null && _a !== void 0 ? _a : "black";
            return ` <div class="alert alert-primary mt-2">
            <span class="fw-bold">範例:</span> black,white,#000000,rgb(0,0,0)
</div>` + glitter.htmlGenerate.editeInput({
                gvc: gvc,
                title: `顏色`,
                default: data["color"],
                placeHolder: `輸入顏色`,
                callback: (text) => {
                    data["color"] = text;
                }
            }) +
                `
            <input id="palette" value="${(_b = data["color"]) !== null && _b !== void 0 ? _b : "black"}" type="color" style="margin-top:10px;" onchange="${gvc.event((e) => {
                    data["color"] = e.value;
                })}">
            `;
        }
    },
    {
        tag: "border", title: "邊線設計", innerHtml: (gvc, data) => {
            const glitter = window.glitter;
            let prefix = "border";
            return `
            ${EditorElem.select({
                title: "設定邊線位置",
                gvc: gvc,
                def: "全部",
                array: ["上", "下", "左", "右", "全部"],
                callback: (text) => {
                    switch (text) {
                        case "上": {
                            prefix = "border-top";
                            break;
                        }
                        case "下": {
                            prefix = "border-bottom";
                            break;
                        }
                        case "左": {
                            prefix = "border-left";
                            break;
                        }
                        case "右": {
                            prefix = "border-right";
                            break;
                        }
                        case "全部": {
                            prefix = "border";
                            break;
                        }
                    }
                }
            })}
            ${glitter.htmlGenerate.editeInput({
                gvc: gvc,
                title: `寬度 (1px , 1% , 1em)`,
                default: data[`${prefix}-width`],
                placeHolder: ``,
                callback: (text) => {
                    data[`${prefix}-width`] = text;
                }
            })}
            ${glitter.htmlGenerate.editeInput({
                gvc: gvc,
                title: `顏色(black,white,#000000,rgb(0,0,0))`,
                default: data[`${prefix}-color`],
                placeHolder: ``,
                callback: (text) => {
                    data[`${prefix}-color`] = text;
                }
            })}
            `;
        }
    },
    {
        tag: "border-radius", title: "圓角", innerHtml: (gvc, data) => {
            const glitter = window.glitter;
            return `
            <div class="alert alert-primary mt-2">
            <span class="fw-bold">範例:</span>10px,10em,10pt,10%
</div>
            ${['border-top-left-radius', 'border-top-right-radius', 'border-bottom-left-radius', 'border-bottom-right-radius'].map((dd, index) => {
                var _a;
                const k = ["左上", "右上", "左下", "右下"][index];
                return glitter.htmlGenerate.editeInput({
                    gvc: gvc,
                    title: `${k}側圓角`,
                    default: (_a = data[dd]) !== null && _a !== void 0 ? _a : "",
                    placeHolder: `輸入${k}側圓角`,
                    callback: (text) => {
                        data[dd] = text;
                    }
                });
            }).join('')}`;
        }
    },
    {
        tag: "aspect-ratio", title: "畫面比例", innerHtml: (gvc, data) => {
            var _a;
            const glitter = window.glitter;
            data["aspect-ratio"] = (_a = data["aspect-ratio"]) !== null && _a !== void 0 ? _a : "auto";
            return ` <div class="alert alert-primary mt-2">
            <span class="fw-bold">範例:</span>1/1 , 0.5 , auto
</div>` + glitter.htmlGenerate.editeInput({
                gvc: gvc,
                title: `畫面比例`,
                default: data["aspect-ratio"],
                placeHolder: `輸入比值`,
                callback: (text) => {
                    data["aspect-ratio"] = text;
                }
            });
        }
    },
    {
        tag: "box-sizing", title: "box-sizing", innerHtml: (gvc, data) => {
            var _a;
            const glitter = window.glitter;
            data["box-sizing"] = (_a = data["box-sizing"]) !== null && _a !== void 0 ? _a : "content-box";
            return ` <div class="alert alert-primary mt-2">
            <span class="fw-bold">範例:</span>Content-box,Border-box 
</div>` + glitter.htmlGenerate.editeInput({
                gvc: gvc,
                title: `行高`,
                default: data["box-sizing"],
                placeHolder: `輸入行高`,
                callback: (text) => {
                    data["box-sizing"] = text;
                }
            });
        }
    },
    {
        tag: "display", title: "display排版", innerHtml: (gvc, data) => {
            var _a;
            const glitter = window.glitter;
            data["display"] = (_a = data["display"]) !== null && _a !== void 0 ? _a : "none";
            return `<div class="alert alert-primary mt-2">
            <span class="fw-bold">範例:</span>none,block,inline,inline-block,flex,grid
            </div>` + EditorElem.select({
                title: 'display',
                gvc: gvc,
                def: data["display"],
                callback: (text) => {
                    data["display"] = text;
                    gvc.notifyDataChange(['displayDetail']);
                },
                array: ["none", "block", "inline", "inline-block", "flex", "grid"],
            }) +
                gvc.bindView({
                    bind: "displayDetail",
                    view: () => {
                        if (data["display"] == "flex") {
                            return gvc.map([glitter.htmlGenerate.editeInput({
                                    gvc: gvc,
                                    title: `flex-basis`,
                                    default: data["flex-basis"],
                                    placeHolder: `輸入元素的基本大小`,
                                    callback: (text) => {
                                        data["flex-basis"] = text;
                                    }
                                }),
                                EditorElem.select({
                                    title: 'direction',
                                    gvc: gvc,
                                    def: data["flex-direction"],
                                    callback: (text) => {
                                        data["flex-direction"] = text;
                                    },
                                    array: ["row", "row-reverse", "column", "column-reverse"],
                                }),
                                EditorElem.select({
                                    title: 'wrap',
                                    gvc: gvc,
                                    def: data["flex-wrap"],
                                    callback: (text) => {
                                        data["flex-wrap"] = text;
                                    },
                                    array: ["wrap", "wrap-reverse", "nowrap"],
                                }),
                                glitter.htmlGenerate.editeInput({
                                    gvc: gvc,
                                    title: `flex-grow`,
                                    default: data["flex-grow"],
                                    placeHolder: `flex-grow的數值`,
                                    callback: (text) => {
                                        data["flex-grow"] = text;
                                    }
                                }),
                                glitter.htmlGenerate.editeInput({
                                    gvc: gvc,
                                    title: `flex-shrink`,
                                    default: data["flex-shrink"],
                                    placeHolder: `flex-shrink的數值`,
                                    callback: (text) => {
                                        data["flex-shrink"] = text;
                                    }
                                }),
                                glitter.htmlGenerate.editeInput({
                                    gvc: gvc,
                                    title: `order`,
                                    default: data["order"],
                                    placeHolder: `order的次序`,
                                    callback: (text) => {
                                        data["order"] = text;
                                    }
                                }),
                                EditorElem.select({
                                    title: 'justify-content',
                                    gvc: gvc,
                                    def: data["justify-content"],
                                    callback: (text) => {
                                        data["justify-content"] = text;
                                    },
                                    array: ["normal", "flex-start", "flex-end", "center", "space-between", "space-around", "space-evenly", "stretch"],
                                }),
                                EditorElem.select({
                                    title: 'align-items',
                                    gvc: gvc,
                                    def: data["align-items"],
                                    callback: (text) => {
                                        data["align-items"] = text;
                                    },
                                    array: ["flex-start", "flex-end", "center", "baseline", "stretch"],
                                }),
                                EditorElem.select({
                                    title: 'align-self',
                                    gvc: gvc,
                                    def: data["align-self"],
                                    callback: (text) => {
                                        data["align-self"] = text;
                                    },
                                    array: ["auto", "flex-start", "flex-end", "center", "baseline", "stretch"],
                                }),
                            ]);
                        }
                        return ``;
                    }, divCreate: {}
                });
        }
    },
    {
        tag: "object-fit", title: "內部元素大小", innerHtml: (gvc, data) => {
            var _a;
            const glitter = window.glitter;
            data["object-fit"] = (_a = data["object-fit"]) !== null && _a !== void 0 ? _a : "none";
            return ` <div class="alert alert-primary mt-2">
            <span class="fw-bold">範例:</span>fill,cover,contain,none,scale-down, 
            </div>` + EditorElem.select({
                title: 'object-fit',
                gvc: gvc,
                def: data["object-fit"],
                callback: (text) => {
                    data["object-fit"] = text;
                },
                array: ["fill", "cover", "contain", "none", "scale-down",],
            });
        }
    },
    {
        tag: "object-position", title: "內部元素位置", innerHtml: (gvc, data) => {
            var _a;
            const glitter = window.glitter;
            data["object-position"] = (_a = data["object-position"]) !== null && _a !== void 0 ? _a : "center";
            return ` <div class="alert alert-primary mt-2">
            <span class="fw-bold">範例:</span>center , top , bottom , left , right , top left , bottom right 
            </div>` + glitter.htmlGenerate.editeInput({
                gvc: gvc,
                title: `內部元素位置`,
                default: data["object-position"],
                placeHolder: `輸入內部元素位置`,
                callback: (text) => {
                    data["object-position"] = text;
                }
            });
        }
    },
    {
        tag: "overflow", title: "內容物溢出", innerHtml: (gvc, data) => {
            const glitter = window.glitter;
            let prefix = "overflow";
            data[prefix] = "auto";
            return `
            ${EditorElem.select({
                title: "設定溢出方向",
                gvc: gvc,
                def: "全部",
                array: ["垂直方向", "水平方向", "全部"],
                callback: (text) => {
                    switch (text) {
                        case "垂直方向": {
                            prefix = "overflow-y";
                            break;
                        }
                        case "水平方向": {
                            prefix = "overflow-x";
                            break;
                        }
                        case "全部": {
                            prefix = "overflow";
                            break;
                        }
                    }
                }
            })}
            ${EditorElem.select({
                title: "溢出的處理方式",
                gvc: gvc,
                def: "auto",
                array: ["auto", "hidden", "clip", "visible", "scroll"],
                callback: (text) => {
                    data[prefix] = text;
                }
            })}
            `;
        }
    },
    {
        tag: "position", title: "位置", innerHtml: (gvc, data) => {
            const glitter = window.glitter;
            return `
            ${EditorElem.select({
                title: "位置",
                gvc: gvc,
                def: "static",
                array: ["static", "fixed", "absolute", "relative", "sticky"],
                callback: (text) => {
                    data["position"] = text;
                }
            })}
            ${(() => {
                return gvc.bindView({
                    bind: "position",
                    view: () => {
                        if (data["position"] != "static") {
                            let returnHTML = ``;
                            return `
                            ${['left', 'right', 'top', 'bottom'].map((dd, index) => {
                                var _a;
                                const k = ["左", "右", "上", "下"][index];
                                return glitter.htmlGenerate.editeInput({
                                    gvc: gvc,
                                    title: `${k}方距離，同個方向只會取前者(左or右 上or下)`,
                                    default: (_a = data[dd]) !== null && _a !== void 0 ? _a : "",
                                    placeHolder: `輸入${k}側距離`,
                                    callback: (text) => {
                                        data[dd] = text;
                                    }
                                });
                            }).join('')}
                            ${glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: `排列先後(z-index)`,
                                default: data["z-index"],
                                placeHolder: `輸入先後次序`,
                                callback: (text) => {
                                    data["z-index"] = text;
                                }
                            })}
                            `;
                        }
                        return ``;
                    }, divCreate: {}
                });
            })()}
            `;
        }
    },
    {
        tag: "Box Shadow", title: "容器陰影", innerHtml: (gvc, data) => {
            var _a;
            const glitter = window.glitter;
            data["box-shadow"] = (_a = data["box-shadow"]) !== null && _a !== void 0 ? _a : "";
            return ` <div class="alert alert-primary mt-2">
            <span class="fw-bold">範例:</span>0 1px 2px 0 rgb(0 0 0 / 0.05);
</div>` + glitter.htmlGenerate.editeInput({
                gvc: gvc,
                title: `畫面比例`,
                default: data["box-shadow"],
                placeHolder: `輸入陰影屬性`,
                callback: (text) => {
                    data["box-shadow"] = text;
                }
            });
        }
    },
    {
        tag: "Opacity", title: "透明度", innerHtml: (gvc, data) => {
            var _a;
            const glitter = window.glitter;
            data["opacity"] = (_a = data["opacity"]) !== null && _a !== void 0 ? _a : "";
            return ` <div class="alert alert-primary mt-2">
            <span class="fw-bold">範例:</span>0~1 , 0.05 , 0.5
</div>` + glitter.htmlGenerate.editeInput({
                gvc: gvc,
                title: `透明度`,
                default: data["opacity"],
                placeHolder: `輸入透明度`,
                callback: (text) => {
                    data["opacity"] = text;
                }
            });
        }
    }
];
