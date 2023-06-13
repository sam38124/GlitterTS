import { init } from '../GVController.js';
import { EditorElem } from "./editor-elem.js";
import { styleAttr } from "./style-attr.js";
init((gvc, glitter, gBundle) => {
    const design = {
        get style() {
            return gBundle.data.style;
        },
        set style(data) {
            gBundle.data.style = data;
        },
        get class() {
            return gBundle.data.class;
        },
        set class(data) {
            gBundle.data.class = data;
        },
        get styleList() {
            var _a;
            gBundle.data.styleList = (_a = gBundle.data.styleList) !== null && _a !== void 0 ? _a : [];
            return gBundle.data.styleList;
        },
        set styleList(data) {
            gBundle.data.styleLis = data;
        }
    };
    return {
        onCreateView: () => {
            const styleContainer = glitter.getUUID();
            return `
            <div  class="w-100 h-100 d-flex flex-column align-items-center justify-content-center" style="background-color: rgba(0,0,0,0.3);" >
            <div class="bg-light m-auto rounded shadow" style="max-width: 100%;max-height: 100%;width: 480px;overflow-y: scroll;">
        <div class="w-100 d-flex align-items-center border-bottom justify-content-center position-relative" style="height: 68px;">
        <h3 class="modal-title fs-4" >設計樣式</h3>
        <i class="fa-solid fa-xmark text-dark position-absolute " style="font-size:20px;transform: translateY(-50%);right: 20px;top: 50%;cursor: pointer;"
        onclick="${gvc.event(() => {
                var _a;
                glitter.closeDiaLog((_a = gvc.parameter.pageConfig) === null || _a === void 0 ? void 0 : _a.tag);
            })}"></i>
</div>    
<div class="w-100 p-3">
${gvc.map([
                glitter.htmlGenerate.editeText({
                    gvc: gvc,
                    title: 'Class參數',
                    default: design.class,
                    placeHolder: `請輸入Class樣式或程式碼\n譬如:
        -(()=>{
        const a=true
        if(abc){
        return 'text-dark'
        }else{
         return 'text-white'
        }
        })()．`,
                    callback: (text) => {
                        design.class = text;
                    }
                }),
                glitter.htmlGenerate.editeText({
                    gvc: gvc,
                    title: `Style樣式`,
                    default: design.style,
                    placeHolder: `輸入Style樣式或者程式碼\n譬如:
        -(()=>{ const a=true
        if(abc){
        return 'color:red;font-size:20px;'
        }else{
         return 'color:red;'
        }})()`,
                    callback: (text) => {
                        design.style = text;
                    }
                }),
                `
${EditorElem.h3("設計特徵")}
${gvc.bindView(() => {
                    const idl = glitter.getUUID();
                    return {
                        bind: idl,
                        view: () => {
                            return `<div class="alert-success alert ">
${design.styleList.map((dd, index) => {
                                var _a, _b;
                                let title = (_b = ((_a = styleAttr.find((d2) => {
                                    return dd.tag === d2.tag;
                                })) !== null && _a !== void 0 ? _a : {}).title) !== null && _b !== void 0 ? _b : "尚未設定";
                                return `
    ${EditorElem.toggleExpand({
                                    gvc: gvc, title: EditorElem.minusTitle(title, gvc.event(() => {
                                        design.styleList.splice(index, 1);
                                        gvc.notifyDataChange(idl);
                                    })), data: dd, innerText: (() => {
                                        return `
<div class="mb-2">
</div>
<div class="btn-group dropdown w-100" style="">
  ${(() => {
                                            var _a, _b;
                                            let title = (_b = ((_a = styleAttr.find((d2) => {
                                                return dd.tag === d2.tag;
                                            })) !== null && _a !== void 0 ? _a : {}).title) !== null && _b !== void 0 ? _b : "";
                                            const id = glitter.getUUID();
                                            const id2 = glitter.getUUID();
                                            return `
${gvc.bindView(() => {
                                                return {
                                                    bind: id2,
                                                    view: () => {
                                                        return `<input class="form-control w-100" style="height: 40px;" placeholder="關鍵字搜尋" onfocus="${gvc.event(() => {
                                                            $('#' + gvc.id(id)).addClass(`show`);
                                                        })}" onblur="${gvc.event(() => {
                                                            setTimeout(() => {
                                                                $('#' + gvc.id(id)).removeClass(`show`);
                                                            }, 300);
                                                        })}" oninput="${gvc.event((e) => {
                                                            var _a;
                                                            title = e.value;
                                                            dd.tag = ((_a = styleAttr.find((d2) => {
                                                                return d2.title == e.value;
                                                            })) !== null && _a !== void 0 ? _a : {}).tag;
                                                            gvc.notifyDataChange(styleContainer);
                                                            gvc.notifyDataChange(id);
                                                        })}" value="${title}">`;
                                                    },
                                                    divCreate: { class: `w-100` }
                                                };
                                            })}
${gvc.bindView(() => {
                                                return {
                                                    bind: id,
                                                    view: () => {
                                                        return styleAttr.filter((d2) => {
                                                            return d2.title.indexOf(title) !== -1;
                                                        }).map((d3) => {
                                                            return `<button  class="dropdown-item" onclick="${gvc.event(() => {
                                                                dd.tag = d3.tag;
                                                                title = d3.title;
                                                                gvc.notifyDataChange(idl);
                                                            })}">${d3.title}</button>`;
                                                        }).join('');
                                                    },
                                                    divCreate: {
                                                        class: `dropdown-menu`,
                                                        style: `transform: translateY(40px);max-height: 200px;overflow-y:scroll;`
                                                    }
                                                };
                                            })}                                 
                                            `;
                                        })()}
</div>
${gvc.bindView(() => {
                                            return {
                                                bind: styleContainer,
                                                view: () => {
                                                    let data = (styleAttr.find((d2) => {
                                                        return dd.tag === d2.tag;
                                                    }));
                                                    if (data) {
                                                        return data.innerHtml(gvc, dd.data);
                                                    }
                                                    else {
                                                        return ``;
                                                    }
                                                },
                                                divCreate: {}
                                            };
                                        })}           
`;
                                    })
                                })}`;
                            }).join('<div class="my-2"></div>')}
${EditorElem.plusBtn("添加特徵", gvc.event((e, event) => {
                                design.styleList.push({
                                    tag: "",
                                    data: {}
                                });
                                gvc.notifyDataChange(idl);
                            }))}
</div>`;
                        },
                        divCreate: {}
                    };
                })}
                <button class="w-100 btn btn-primary" onclick="${gvc.event(() => {
                    var _a;
                    gBundle.callback();
                    glitter.closeDiaLog((_a = gvc.parameter.pageConfig) === null || _a === void 0 ? void 0 : _a.tag);
                })}">
                儲存
</button>
`
            ])}
</div>

</div>
</div>
            `;
        }
    };
});
