export class HtmlGenerate {
    constructor(setting) {
        setting.map((dd) => {
            var _a, _b;
            dd.refreshAllParameter = (_a = dd.refreshAllParameter) !== null && _a !== void 0 ? _a : {
                view1: () => {
                }, view2: () => {
                }
            };
            dd.refreshComponentParameter = (_b = dd.refreshComponentParameter) !== null && _b !== void 0 ? _b : {
                view1: () => {
                }, view2: () => {
                }
            };
            dd.refreshAll = () => {
                dd.refreshAllParameter.view1();
                dd.refreshAllParameter.view2();
            };
            dd.refreshComponent = () => {
                dd.refreshComponentParameter.view1();
                dd.refreshComponentParameter.view2();
            };
            return dd;
        });
        this.render = (gvc, option = { class: ``, style: `` }) => {
            var loading = true;
            const container = gvc.glitter.getUUID();
            gvc.glitter.addMtScript(setting.map((dd) => {
                return dd.js;
            }), () => {
                loading = false;
                gvc.notifyDataChange(container);
            }, () => {
            });
            return gvc.bindView({
                bind: container,
                view: () => {
                    if (loading) {
                        return ``;
                    }
                    else {
                        return gvc.map(setting.map((dd) => {
                            var _a, _b;
                            const component = gvc.glitter.getUUID();
                            dd.refreshAllParameter.view1 = () => {
                                gvc.notifyDataChange(container);
                            };
                            dd.refreshComponentParameter.view1 = () => {
                                gvc.notifyDataChange(component);
                            };
                            return gvc.bindView({
                                bind: component,
                                view: () => {
                                    return gvc.glitter.share.htmlExtension[dd.route][dd.type](gvc, dd, setting).view;
                                },
                                divCreate: {
                                    style: `${gvc.map(["paddingT", "paddingB", "paddingL", "paddingR"].map((d2, index) => {
                                        var _a;
                                        let k = ["padding-top", "padding-bottom", "padding-left", "padding-right"];
                                        return `${k[index]}:${(_a = dd.data[d2]) !== null && _a !== void 0 ? _a : "0"};`;
                                    }))}${(_a = dd.style) !== null && _a !== void 0 ? _a : ""}`,
                                    class: (_b = dd.class) !== null && _b !== void 0 ? _b : ""
                                }
                            });
                        }));
                    }
                },
                divCreate: { class: option.class, style: option.style }
            });
        };
        this.editor = (gvc, option = {
            return_: false,
            refreshAll: () => {
            }
        }) => {
            var loading = true;
            const editContainer = gvc.glitter.getUUID();
            gvc.glitter.addMtScript(setting.map((dd) => {
                return dd.js;
            }), () => {
                loading = false;
                gvc.notifyDataChange(editContainer);
            }, () => {
            });
            return gvc.bindView({
                bind: editContainer,
                view: () => {
                    if (loading) {
                        return ``;
                    }
                    else {
                        return gvc.map(setting.map((dd, index) => {
                            try {
                                const component = gvc.glitter.getUUID();
                                dd.refreshAllParameter.view2 = () => {
                                    gvc.notifyDataChange(editContainer);
                                };
                                dd.refreshComponentParameter.view2 = () => {
                                    gvc.notifyDataChange(component);
                                };
                                dd.refreshAll = () => {
                                    dd.refreshAllParameter.view1();
                                    dd.refreshAllParameter.view2();
                                    option.refreshAll();
                                };
                                const toggleView = gvc.glitter.getUUID();
                                const toggleEvent = gvc.event(() => {
                                    dd.expand = !dd.expand;
                                    gvc.notifyDataChange([toggleView, component]);
                                });
                                return `<div style=" ${(option.return_) ? `padding: 10px;` : `padding-bottom: 10px;margin-bottom: 10px;border-bottom: 1px solid lightgrey;`}" class="
${(option.return_) ? `w-100 border rounded bg-dark mt-2` : ``} " >

${gvc.bindView({
                                    bind: toggleView,
                                    view: () => {
                                        return `<div class="d-flex align-items-center" style="${(option.return_ && !dd.expand) ? `` : `margin-bottom: 10px;`};cursor: pointer;" >
<i class="fa-regular fa-circle-minus text-danger me-2" style="font-size: 20px;cursor: pointer;" onclick="${gvc.event(() => {
                                            setting.splice(index, 1);
                                            option.refreshAll();
                                            dd.refreshAll();
                                        })}"></i>
<h3 style="color: white;font-size: 16px;" class="m-0">${dd.label}</h3>
<div class="flex-fill"></div>
${(option.return_) ? (dd.expand ? `<div style="cursor: pointer;" onclick="${toggleEvent}">收合<i class="fa-solid fa-up ms-2 text-white"></i></div>` : `<div style="cursor: pointer;" onclick="${toggleEvent}">展開<i class="fa-solid fa-down ms-2 text-white"></i></div>\``) : ``}
</div>`;
                                    },
                                    divCreate: {}
                                })}

${gvc.bindView({
                                    bind: component,
                                    view: () => {
                                        if (option.return_ && !dd.expand) {
                                            return ``;
                                        }
                                        return gvc.map([
                                            gvc.bindView(() => {
                                                const uid = gvc.glitter.getUUID();
                                                const toggleEvent = gvc.event(() => {
                                                    dd.expandStyle = !dd.expandStyle;
                                                    gvc.notifyDataChange(uid);
                                                });
                                                return {
                                                    bind: uid,
                                                    view: () => {
                                                        var _a, _b;
                                                        return `<div class="w-100  rounded p-2" style="background-color: #0062c0;">
<div class="w-100 d-flex p-0 align-items-center" onclick="${toggleEvent}" style="cursor: pointer;"><h3 style="font-size: 16px;" class="m-0 p-0">CSS-版面設計</h3>
<div class="flex-fill"></div>
${(dd.expandStyle ? `<div style="cursor: pointer;" >收合<i class="fa-solid fa-up ms-2 text-white"></i></div>` : `<div style="cursor: pointer;">展開<i class="fa-solid fa-down ms-2 text-white"></i></div>\``)}
</div>

<div class="d-flex flex-wrap align-items-center mt-2 ${(dd.expandStyle) ? `` : `d-none`}">
<span class="w-100 mb-2 fw-500" style="color: orange;">間距 [ 單位 : %,PX ]</span>
${gvc.map(["上", "下", "左", "右"].map((d2, index) => {
                                                            var _a;
                                                            let key = ["paddingT", "paddingB", "paddingL", "paddingR"][index];
                                                            return `<div class="d-flex align-items-center mb-2" style="width: calc(50%);"><span class="mx-2">${d2}</span>
<input class="form-control" value="${(_a = dd.data[key]) !== null && _a !== void 0 ? _a : ""}" onchange="${gvc.event((e) => {
                                                                dd.data[key] = e.value;
                                                                option.refreshAll();
                                                                dd.refreshAll();
                                                            })}"></div>`;
                                                        }))}
<span class="w-100 mb-2 fw-500 mt-2" style="color: orange;">Class</span>
<input class="w-100 form-control" value="${(_a = dd.class) !== null && _a !== void 0 ? _a : ""}" onchange="${gvc.event((e) => {
                                                            dd.class = e.value;
                                                            option.refreshAll();
                                                            dd.refreshAll();
                                                        })}">
<span class="w-100 mb-2 fw-500 mt-2" style="color: orange;">Style</span>
<input class="w-100 form-control"  value="${(_b = dd.style) !== null && _b !== void 0 ? _b : ""}" onchange="${gvc.event((e) => {
                                                            dd.style = e.value;
                                                            option.refreshAll();
                                                            dd.refreshAll();
                                                        })}">
</div></div>`;
                                                    },
                                                    divCreate: {}
                                                };
                                            }),
                                            gvc.glitter.share.htmlExtension[dd.route][dd.type](gvc, dd, setting).editor
                                        ]);
                                    },
                                    divCreate: {}
                                })}</div>`;
                            }
                            catch (e) {
                                return `資料錯誤`;
                            }
                        }));
                    }
                },
                divCreate: {}
            });
        };
        this.exportJson = (setting) => {
            return JSON.stringify(setting);
        };
    }
    static editeInput(obj) {
        var _a;
        return `<h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">${obj.title}</h3>
<input class="form-control" placeholder="${obj.placeHolder}" onchange="${obj.gvc.event((e) => {
            obj.callback(e.value);
        })}" value="${(_a = obj.default) !== null && _a !== void 0 ? _a : ""}">`;
    }
    ;
    static editeText(obj) {
        var _a;
        return `<h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">${obj.title}</h3>
<textarea class="form-control" placeholder="${obj.placeHolder}" onchange="${obj.gvc.event((e) => {
            obj.callback(e.value);
        })}" style="height: 200px;">${(_a = obj.default) !== null && _a !== void 0 ? _a : ""}</textarea>`;
    }
    ;
}
HtmlGenerate.saveEvent = () => {
    alert('save');
};
