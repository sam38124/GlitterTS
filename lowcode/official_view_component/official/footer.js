import { Plugin } from "../../glitterBundle/plugins/plugin-creater.js";
import { TriggerEvent } from "../../glitterBundle/plugins/trigger-event.js";
import { EditorElem } from "../../glitterBundle/plugins/editor-elem.js";
Plugin.createComponent(import.meta.url, (glitter, editMode) => {
    return {
        defaultData: {},
        render: (gvc, widget, setting, hoverID) => {
            var _b;
            widget.data.dataList = (_b = widget.data.dataList) !== null && _b !== void 0 ? _b : [
                {
                    title: "首頁",
                    icon: new URL('../img/home.svg', import.meta.url).href,
                    toPage: "",
                    click: () => {
                    }
                },
                {
                    title: "靈感",
                    icon: new URL('../img/home.svg', import.meta.url).href,
                    toPage: "",
                    click: () => {
                    }
                },
                {
                    title: "我的空間",
                    icon: new URL('../img/home.svg', import.meta.url).href,
                    toPage: "",
                    click: () => {
                    }
                },
                {
                    title: "購物車",
                    icon: new URL('../img/home.svg', import.meta.url).href,
                    toPage: "",
                    click: () => {
                    }
                },
                {
                    title: "會員",
                    icon: new URL('../img/home.svg', import.meta.url).href,
                    toPage: "",
                    click: () => {
                    }
                },
            ];
            return {
                view: () => {
                    let id = glitter.getUUID();
                    glitter.runJsInterFace("getBottomInset", {}, (response) => {
                        var _a;
                        if (((_a = widget.data) === null || _a === void 0 ? void 0 : _a.bottomInset) != response.data) {
                            widget.data.bottomInset = response.data;
                            try {
                                widget.refreshAll();
                            }
                            catch (e) {
                            }
                        }
                    }, {
                        webFunction: () => {
                            return { data: 20 };
                        }
                    });
                    gvc.addStyle(`
                        footer{
                            background:white;
                            box-shadow: 0px -5px 15px rgba(0, 0, 0, 0.05);
                            padding-top:18px;
                        }
                        .footerTitle{
                            font-family: 'Noto Sans TC';
                            font-style: normal;
                            font-weight: 400;
                            font-size: 12px;
                            line-height: 17px;
                            text-align: center;
                            color: #1E1E1E;
                        }
                        .selected{
                            color:#FE5541;
                        }
                    `);
                    return gvc.bindView({
                        bind: id,
                        view: () => {
                            return `
                        <footer class="d-flex align-items-center justify-content-around     w-100" style="padding-bottom: ${widget.data.bottomInset - 10}px;position: fixed;bottom: 0px;left: 0px;z-index:2;">
                            ${(() => {
                                return gvc.map(widget.data.dataList.map((data, index) => {
                                    var _b, _c, _d;
                                    data.badge = (_b = data.badge) !== null && _b !== void 0 ? _b : {};
                                    return `
                                <div class="d-flex flex-column align-items-center" style="width: 64px;" onclick="${gvc.event((e) => {
                                        TriggerEvent.trigger({
                                            gvc, widget, clickEvent: data
                                        });
                                    })}">
                                ${(data.imageType === 'icon') ? `
                                <i class="${data.icon} ${glitter.htmlGenerate.styleEditor(data.imageStyle).class()}" style="${glitter.htmlGenerate.styleEditor(data.imageStyle).style()}"></i>
                                `
                                        :
                                            `<img class="${glitter.htmlGenerate.styleEditor(data.imageStyle).class()}" src=${data.icon} style="width: 28px;height: 28px;color:${(_c = data.color) !== null && _c !== void 0 ? _c : `black`};${glitter.htmlGenerate.styleEditor(data.imageStyle).style()}">`}   
                                    <div class="footerTitle ${glitter.htmlGenerate.styleEditor(data.fontStyle).class()}" style="color:${(_d = data.color) !== null && _d !== void 0 ? _d : `black`};${glitter.htmlGenerate.styleEditor(data.fontStyle).style()}">${data.title}</div>
                                   ${gvc.bindView(() => {
                                        let badge = 0;
                                        const id = gvc.glitter.getUUID();
                                        data.badge.callback = (count) => {
                                            badge = count;
                                            gvc.notifyDataChange(id);
                                        };
                                        return {
                                            bind: id,
                                            view: () => {
                                                if (badge === 0) {
                                                    return ``;
                                                }
                                                return `<div class=" d-flex align-items-center justify-content-center" style="position: absolute;
width: 16px;
height: 16px;

background: #FE5541;
border: 1px solid #FFFFFF;
font-size: 9px;

color: white;
border-radius: 8px;">${badge}</div>`;
                                            },
                                            divCreate: { class: `position-relative position-absolute` }
                                        };
                                    })}
                                    
                                </div>
                                `;
                                }));
                            })()}
                        </footer>
                    `;
                        },
                        divCreate: {},
                        onCreate: () => {
                        }
                    });
                },
                editor: () => {
                    console.log("-------------------");
                    return EditorElem.arrayItem({
                        title: "列表項目",
                        gvc: gvc,
                        array: widget.data.dataList.map((dd, index) => {
                            var _b, _c, _d, _e, _f;
                            dd.badge = (_b = dd.badge) !== null && _b !== void 0 ? _b : {};
                            dd.fontStyle = (_c = dd.fontStyle) !== null && _c !== void 0 ? _c : {};
                            dd.imageStyle = (_d = dd.imageStyle) !== null && _d !== void 0 ? _d : {};
                            dd.imageType = (_e = dd.imageType) !== null && _e !== void 0 ? _e : 'image';
                            return {
                                title: (_f = dd.title) !== null && _f !== void 0 ? _f : `選項.${index + 1}`,
                                innerHtml: (gvc) => {
                                    return gvc.map([
                                        glitter.htmlGenerate.styleEditor(dd.fontStyle).editor(gvc, () => {
                                            widget.refreshComponent();
                                        }, '字體設計'),
                                        `<br>`,
                                        glitter.htmlGenerate.styleEditor(dd.imageStyle).editor(gvc, () => {
                                            widget.refreshComponent();
                                        }, 'icon設計'),
                                        glitter.htmlGenerate.editeInput({
                                            gvc: gvc,
                                            title: `名稱`,
                                            default: dd.title,
                                            placeHolder: dd.title,
                                            callback: (text) => {
                                                widget.data.dataList[index].title = text;
                                                widget.refreshAll();
                                            }
                                        }),
                                        EditorElem.select({
                                            title: `圖片類型`,
                                            gvc: gvc,
                                            def: dd.imageType,
                                            array: [
                                                {
                                                    title: '圖片',
                                                    value: `image`,
                                                },
                                                {
                                                    title: 'Fontawesome',
                                                    value: `icon`,
                                                },
                                            ],
                                            callback: (text) => {
                                                dd.imageType = text;
                                                widget.refreshComponent();
                                            },
                                        }),
                                        (() => {
                                            if (dd.imageType === 'icon') {
                                                return EditorElem.fontawesome({
                                                    title: 'icon',
                                                    gvc: gvc,
                                                    def: dd.icon,
                                                    callback: (text) => {
                                                        dd.icon = text;
                                                        widget.refreshComponent();
                                                    },
                                                });
                                            }
                                            else {
                                                return EditorElem.uploadImage({
                                                    title: 'icon路徑',
                                                    gvc: gvc,
                                                    def: dd.icon,
                                                    callback: (text) => {
                                                        dd.icon = text;
                                                        widget.refreshComponent();
                                                    },
                                                });
                                            }
                                        })(),
                                        TriggerEvent.editer(gvc, widget, dd)
                                    ]);
                                },
                                expand: dd,
                                minus: gvc.event(() => {
                                    widget.data.dataList.splice(index, 1);
                                    widget.refreshComponent();
                                })
                            };
                        }),
                        originalArray: widget.data.dataList,
                        expand: widget.data,
                        plus: {
                            title: "新增按鈕",
                            event: gvc.event((e, event) => {
                                widget.data.dataList.push({
                                    title: "首頁",
                                    icon: new URL('../img/home.svg', import.meta.url).href,
                                    toPage: "",
                                    click: () => {
                                    }
                                });
                                widget.refreshComponent();
                            })
                        },
                        refreshComponent: () => {
                            widget.refreshComponent();
                        }
                    });
                }
            };
        },
    };
});
