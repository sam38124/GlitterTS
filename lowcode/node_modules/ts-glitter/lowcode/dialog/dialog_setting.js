import { init } from '../glitterBundle/GVController.js';
import { EditorElem } from "../glitterBundle/plugins/editor-elem.js";
import { HtmlGenerate } from "../glitterBundle/module/Html_generate.js";
import { ShareDialog } from "./ShareDialog.js";
init((gvc, glitter, gBundle) => {
    function getSource(dd) {
        return dd.src.official;
    }
    return {
        onCreateView: () => {
            let viewModel = {
                dataList: undefined,
                data: undefined,
                loading: true,
                selectItem: undefined,
                pluginList: [],
                initialJS: [],
                initialCode: '',
                homePage: ''
            };
            function pageSelect(def, callback) {
                var _a;
                const btid = glitter.getUUID();
                const defd = (_a = viewModel.dataList.find((dd) => {
                    return dd.tag === def;
                })) !== null && _a !== void 0 ? _a : { name: "尚未選擇" };
                return `
<div class="w-100"><button class="form-control position-relative" onclick="${gvc.event(() => {
                    $('#' + btid).toggle();
                })}">${defd.name} <i class="fa-sharp fa-solid fa-caret-down position-absolute translate-middle-y" style="top: 50%;right: 20px;"></i></button>
<div class="dropdown-menu" id="${btid}" style="max-height: calc(100vh - 100px);width:300px;overflow-y: scroll;">
 
<ul class="list-group list-group-flush border-bottom mt-2">
    ${(() => {
                    let group = [];
                    let selectGroup = '';
                    let id = glitter.getUUID();
                    viewModel.dataList.map((dd) => {
                        if (dd.tag === def) {
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
                                return group.map((dd) => {
                                    return `<l1 onclick="${gvc.event(() => {
                                        selectGroup = dd;
                                        gvc.notifyDataChange(id);
                                    })}"  class="list-group-item list-group-item-action border-0 py-2 ${(selectGroup === dd) && 'active'} position-relative " style="border-radius: 0px;cursor: pointer;">${dd || "未分類"}</l1>`
                                        +
                                            `<div class="collapse multi-collapse ${(selectGroup === dd) && 'show'}" style="margin-left: 10px;">
 ${viewModel.dataList.filter((d2) => {
                                                return d2.group === dd;
                                            }).map((d3) => {
                                                if (d3.tag !== def) {
                                                    return `<a onclick="${gvc.event(() => {
                                                        callback(d3.tag);
                                                    })}"  class=" list-group-item list-group-item-action border-0 py-2 px-4"  style="border-radius: 0px;">${d3.name}</a>`;
                                                }
                                                else {
                                                    return `<a onclick="${gvc.event(() => {
                                                        callback(d3.tag);
                                                    })}"  class=" list-group-item list-group-item-action border-0 py-2 px-4 bg-warning"  style="cursor:pointer;background-color: #FFDC6A !important;color:black !important;border-radius: 0px;">${d3.name}</a>`;
                                                }
                                            }).join('')}
</div>`;
                                }).join('');
                            },
                            divCreate: {}
                        };
                    });
                })()}

</ul>

  </div></div>`;
            }
            viewModel = gBundle.vm;
            const id = glitter.getUUID();
            let select = "defaultStyle";
            var option = [{
                    title: "頁面設定",
                    value: "defaultStyle"
                }, { title: "初始化代碼", value: "initialCode" },
                { title: "頁面模塊管理", value: "plugin" },
                { title: "程式插件管理", value: "initial" }
            ];
            return `
            <div  class="w-100 h-100 d-flex flex-column align-items-center justify-content-center" style="background-color: rgba(255,255,255,0.5);" >
            <div class="bg-dark m-auto rounded overflow-scroll" style="max-width: 100%;max-height: calc(100% - 50px);width: 480px;">
        <div class="w-100 d-flex align-items-center border-bottom justify-content-center position-relative" style="height: 68px;">
        <h3 class="modal-title fs-4" >設定</h3>
        <i class="fa-solid fa-xmark text-white position-absolute " style="font-size:20px;transform: translateY(-50%);right: 20px;top: 50%;cursor: pointer;"
        onclick="${gvc.event(() => {
                glitter.closeDiaLog();
            })}"></i>
</div>    
${gvc.bindView(() => {
                const selecter = glitter.getUUID();
                return {
                    bind: selecter,
                    view: () => {
                        return `<div class="p-2  m-0 d-flex align-items-center " style="border-radius: 0px;"><h3 style="color: white;font-size: 16px;width: 100px;" class="m-0">設定項目:</h3>
  <select class="form-select form-control flex-fill" onchange="${gvc.event((e) => {
                            select = e.value;
                            gvc.notifyDataChange([id, selecter]);
                        })}">
            ${option.map((dd) => {
                            return `<option value="${dd.value}" ${dd.value === select && "selected"}>${dd.title}</option>`;
                        }).join('')}
</select></div>` + (() => {
                            if (select === 'defaultStyle') {
                                return `<div class="p-2  m-0 d-flex align-items-center " style="border-radius: 0px;"><h3 style="color: white;font-size: 16px;width: 100px;" class="m-0">選擇頁面:</h3>

${pageSelect(viewModel.data.tag, (tag) => {
                                    viewModel.data = viewModel.dataList.find((dd) => {
                                        return dd.tag === tag;
                                    });
                                    gvc.notifyDataChange([id, selecter]);
                                })}
</div>
`;
                            }
                            else {
                                return ``;
                            }
                        })();
                    },
                    divCreate: {
                        class: `w-100 alert alert-primary border-bottom p-2 m-0`, style: `border-radius: 0px;`
                    }
                };
            })}
<div style="" class="p-2">
${gvc.bindView(() => {
                return {
                    bind: id,
                    view: () => {
                        return `
                            ` + (() => {
                            var _a;
                            switch (select) {
                                case `code`:
                                    const json = JSON.parse(JSON.stringify(viewModel.data.config));
                                    json.map((dd) => {
                                        dd.refreshAllParameter = undefined;
                                        dd.refreshComponentParameter = undefined;
                                    });
                                    return ` <textArea class="form-control " style="overflow-x: scroll;height: 700px;" onchange="${gvc.event((e) => {
                                    })}">${JSON.stringify(json, null, '\t')}</textArea>
                        <button class="btn btn-primary  w-100 mt-2" onclick="${gvc.event(() => {
                                        navigator.clipboard.writeText(JSON.stringify(json, null, '\t'));
                                    })}">複製到剪貼簿</button>`;
                                case `plugin`:
                                    return `
                                                ${gvc.map(viewModel.pluginList.map((dd, index) => {
                                        return `
                                                    ${gvc.bindView(() => {
                                            const cid = glitter.getUUID();
                                            return {
                                                bind: cid,
                                                view: () => {
                                                    return `
                                                     <div class="d-flex align-items-center" style="height: 40px;">
    <i class="fa-regular fa-circle-minus text-danger me-2" style="font-size: 20px;cursor: pointer;" onclick="${gvc.event(() => {
                                                        viewModel.pluginList.splice(index, 1);
                                                        gvc.notifyDataChange(id);
                                                    })}"></i>
                                                    <h3 style="color: white;font-size: 16px;" class="m-0 text-warning">${(dd.name && dd.name !== '') ? dd.name : '未命名插件'}</h3>

                                                    <div class="flex-fill"></div>
                                                     ${(dd.src.open) ? `
                                                     <div style="cursor: pointer;" onclick="${gvc.event(() => {
                                                        dd.src.open = false;
                                                        gvc.notifyDataChange(cid);
                                                    })}">收合<i class="fa-solid fa-up ms-2 text-white"></i></div>
                                                     ` : `
                                                     <div style="cursor: pointer;" onclick="${gvc.event(() => {
                                                        dd.src.open = true;
                                                        gvc.notifyDataChange(cid);
                                                    })}}">展開<i class="fa-solid fa-down ms-2 text-white"></i></div>
                                                     `}
                                                     </div>
                                                     ${(dd.src.open) ? `
                                                     ${HtmlGenerate.editeInput({
                                                        gvc,
                                                        title: '自定義插件名稱',
                                                        default: dd.name,
                                                        placeHolder: '自定義插件名稱',
                                                        callback: (text) => {
                                                            dd.name = text;
                                                            gvc.notifyDataChange(cid);
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
                                                    })}
                                                     ` : ''}
                                                    `;
                                                },
                                                divCreate: {
                                                    class: `w-100`,
                                                    style: `border-bottom: 1px solid lightgrey;padding-bottom: 10px;margin-bottom: 10px;`
                                                }
                                            };
                                        })}
                                                    `;
                                    }))}
                                                <div class="d-flex" style="gap: 10px;">
                                                  <div class="btn btn-warning" style="color:black;flex: 1;height: 50px;" onclick="${gvc.event(() => {
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
                                    })}">添加插件</div>
                                                  <button class="btn btn-primary w-100" style="flex: 1;height: 50px;" onclick="${gvc.event(() => {
                                        glitter.closeDiaLog();
                                        glitter.htmlGenerate.saveEvent();
                                    })}">儲存</button>
</div>
                                             `;
                                case `initial`:
                                    return `
                                                ${gvc.map(viewModel.initialJS.map((dd, index) => {
                                        return `
                                                    ${gvc.bindView(() => {
                                            const cid = glitter.getUUID();
                                            return {
                                                bind: cid,
                                                view: () => {
                                                    return `
                                                     <div class="d-flex align-items-center" style="height: 40px;">
    <i class="fa-regular fa-circle-minus text-danger me-2" style="font-size: 20px;cursor: pointer;" onclick="${gvc.event(() => {
                                                        viewModel.initialJS.splice(index, 1);
                                                        gvc.notifyDataChange(id);
                                                    })}"></i>
                                                    <h3 style="color: white;font-size: 16px;" class="m-0 text-warning">${(dd.name && dd.name !== '') ? dd.name : '未命名插件'}</h3>

                                                    <div class="flex-fill"></div>
                                                     ${(dd.src.open) ? `
                                                     <div style="cursor: pointer;" onclick="${gvc.event(() => {
                                                        dd.src.open = false;
                                                        gvc.notifyDataChange(cid);
                                                    })}">收合<i class="fa-solid fa-up ms-2 text-white"></i></div>
                                                     ` : `
                                                     <div style="cursor: pointer;" onclick="${gvc.event(() => {
                                                        dd.src.open = true;
                                                        gvc.notifyDataChange(cid);
                                                    })}}">展開<i class="fa-solid fa-down ms-2 text-white"></i></div>
                                                     `}
                                                     </div>
                                                     ${(dd.src.open) ? `
                                                     ${HtmlGenerate.editeInput({
                                                        gvc,
                                                        title: '自定義插件名稱',
                                                        default: dd.name,
                                                        placeHolder: '自定義插件名稱',
                                                        callback: (text) => {
                                                            dd.name = text;
                                                            gvc.notifyDataChange(cid);
                                                        }
                                                    })}
                                                     ${HtmlGenerate.editeInput({
                                                        gvc,
                                                        title: '正式區',
                                                        default: dd.src.official,
                                                        placeHolder: '正式區路徑',
                                                        callback: (text) => {
                                                            dd.src.official = text;
                                                        }
                                                    })}
                                                     ` : ''}
                                                    `;
                                                },
                                                divCreate: {
                                                    class: `w-100`,
                                                    style: `border-bottom: 1px solid lightgrey;padding-bottom: 10px;margin-bottom: 10px;`
                                                }
                                            };
                                        })}
                                                    `;
                                    }))}
                                                <div class="d-flex" style="gap: 10px;">
                                                  <div class="btn btn-warning" style="color:black;flex: 1;height: 50px;" onclick="${gvc.event(() => {
                                        viewModel.initialJS.push({
                                            name: '',
                                            route: '',
                                            src: {
                                                official: '',
                                                open: true
                                            }
                                        });
                                        gvc.notifyDataChange(id);
                                    })}">添加插件</div>
                                                  <button class="btn btn-primary w-100" style="flex: 1;height: 50px;" onclick="${gvc.event(() => {
                                        glitter.closeDiaLog();
                                        glitter.htmlGenerate.saveEvent();
                                    })}">儲存</button>
</div>
                                              `;
                                case `initialCode`:
                                    return `
                                                <textarea class="form-control " style="height:400px;" onchange="${gvc.event((e) => {
                                        viewModel.initialCode = $(e).val();
                                    })}">${viewModel.initialCode}</textarea>
<button class="btn btn-warning w-100 mt-2" style="color: black;" onclick="${gvc.event(() => {
                                        glitter.closeDiaLog();
                                        glitter.htmlGenerate.saveEvent();
                                    })}">儲存</button>                                               
`;
                                case `defaultStyle`:
                                    viewModel.data.page_config.seo = (_a = viewModel.data.page_config.seo) !== null && _a !== void 0 ? _a : {};
                                    const seo = viewModel.data.page_config.seo;
                                    return gvc.map([
                                        [
                                            `<div class=" m-0 d-flex align-items-center " style="border-radius: 0px;">
<h3 style="color: white;font-size: 16px;width: 100px;" class="m-0">首頁設定:</h3>
<select onchange="${gvc.event((e) => {
                                                if (e.value === 'true') {
                                                    viewModel.homePage = viewModel.data.tag;
                                                }
                                            })}" class="form-control form-select">

<option value="false">否</option>
<option value="true" ${(viewModel.homePage === viewModel.data.tag) ? `selected` : ``}>是</option>
</select>
</div>`,
                                            `<div class="w-100 d-flex align-items-center justify-content-center" style="">
<h3 style="color: white;font-size: 16px;width: 100px;" class="m-0">設計樣式:</h3>
${glitter.htmlGenerate.styleEditor(viewModel.data.page_config).editor(gvc, () => {
                                            }, "選擇樣式")}</div>`,
                                            `<div class="w-100 d-flex align-items-center justify-content-center" style="">
<h3 style="color: white;font-size: 16px;width: 100px;" class="m-0">頁面連結:</h3>
${glitter.htmlGenerate.editeInput({
                                                gvc: gvc,
                                                title: '',
                                                placeHolder: `請輸入頁面標籤`,
                                                default: viewModel.data.tag,
                                                callback: (text) => {
                                                    viewModel.data.tag = text;
                                                }
                                            })}</div>`,
                                            `<div class="w-100 d-flex align-items-center justify-content-center" style="">
<h3 style="color: white;font-size: 16px;width: 100px;" class="m-0">頁面名稱:</h3>
${glitter.htmlGenerate.editeInput({
                                                gvc: gvc,
                                                title: '',
                                                placeHolder: `請輸入頁面名稱`,
                                                default: viewModel.data.name,
                                                callback: (text) => {
                                                    viewModel.data.name = text;
                                                }
                                            })}</div>`,
                                            `<div class="w-100 d-flex align-items-center justify-content-center" style="">
<h3 style="color: white;font-size: 16px;width: 100px;" class="m-0 ">頁面分類:</h3>
${EditorElem.searchInput({
                                                title: "",
                                                gvc: gvc,
                                                def: viewModel.data.group,
                                                array: (() => {
                                                    let group = [];
                                                    viewModel.dataList.map((dd) => {
                                                        if (group.indexOf(dd.group) === -1) {
                                                            group.push(dd.group);
                                                        }
                                                    });
                                                    return group;
                                                })(),
                                                callback: (text) => {
                                                    viewModel.data.group = text;
                                                    gvc.notifyDataChange(id);
                                                },
                                                placeHolder: "請輸入頁面分類"
                                            })}</div>`,
                                            EditorElem.h3("SEO參數設定") + gvc.bindView(() => {
                                                const id = glitter.getUUID();
                                                return {
                                                    bind: id,
                                                    view: () => {
                                                        var _a, _b, _c, _d, _e, _f;
                                                        seo.type = (_a = seo.type) !== null && _a !== void 0 ? _a : "def";
                                                        if (viewModel.data.tag === viewModel.homePage) {
                                                            seo.type = 'custom';
                                                        }
                                                        return `
<select class="form-select form-control ${(viewModel.data.tag === viewModel.homePage) && 'd-none'}" onchange="${gvc.event((e) => {
                                                            seo.type = e.value;
                                                            gvc.notifyDataChange(id);
                                                        })}">
<option value="def" ${(seo.type === "def") ? `selected` : ``}>依照首頁</option>
<option value="custom" ${(seo.type === "custom") ? `selected` : ``}>自定義</option>
</select>
<div class="alert alert-dark p-0 px-2 pb-2 mt-2 ${(seo.type === "def") ? `d-none` : ``}">
${gvc.map([uploadImage({
                                                                gvc: gvc,
                                                                title: `網頁logo`,
                                                                def: (_b = seo.logo) !== null && _b !== void 0 ? _b : "",
                                                                callback: (data) => {
                                                                    seo.logo = data;
                                                                }
                                                            }),
                                                            uploadImage({
                                                                gvc: gvc,
                                                                title: `預覽圖片`,
                                                                def: (_c = seo.image) !== null && _c !== void 0 ? _c : "",
                                                                callback: (data) => {
                                                                    seo.image = data;
                                                                }
                                                            }),
                                                            glitter.htmlGenerate.editeInput({
                                                                gvc: gvc,
                                                                title: "網頁標題",
                                                                default: (_d = seo.title) !== null && _d !== void 0 ? _d : "",
                                                                placeHolder: "請輸入網頁標題",
                                                                callback: (text) => {
                                                                    seo.title = text;
                                                                }
                                                            }),
                                                            glitter.htmlGenerate.editeText({
                                                                gvc: gvc,
                                                                title: "網頁描述",
                                                                default: (_e = seo.content) !== null && _e !== void 0 ? _e : "",
                                                                placeHolder: "請輸入網頁標題",
                                                                callback: (text) => {
                                                                    seo.content = text;
                                                                }
                                                            }),
                                                            glitter.htmlGenerate.editeText({
                                                                gvc: gvc,
                                                                title: "關鍵字設定",
                                                                default: (_f = seo.keywords) !== null && _f !== void 0 ? _f : "",
                                                                placeHolder: "關鍵字設定",
                                                                callback: (text) => {
                                                                    seo.keywords = text;
                                                                }
                                                            })
                                                        ])}
</div>`;
                                                    },
                                                    divCreate: {}
                                                };
                                            })
                                        ].join(`<div class="my-2 border-bottom w-100"></div>`),
                                        `
<br>
<button class="btn btn-warning w-100 mt-2" style="color: black;" onclick="${gvc.event(() => {
                                            glitter.closeDiaLog();
                                            glitter.htmlGenerate.saveEvent();
                                        })}">儲存</button> `
                                    ]);
                            }
                        })();
                    },
                    divCreate: { class: `m-2` }
                };
            })}
</div>

<div class="w-100 bg-light" style="height: 1px;"></div>
</div>
</div>
            `;
        }
    };
});
function uploadImage(obj) {
    const glitter = window.glitter;
    const id = glitter.getUUID();
    return obj.gvc.bindView(() => {
        return {
            bind: id,
            view: () => {
                return `<h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">${obj.title}</h3>
                            <div class="d-flex align-items-center mb-3">
                                <input class="flex-fill form-control "  placeholder="請輸入圖片連結" value="${obj.def}" onchange="${obj.gvc.event((e) => {
                    obj.callback(e.value);
                    obj.gvc.notifyDataChange(id);
                })}">
                                <div class="" style="width: 1px;height: 25px;background-color: white;"></div>
                                <i class="fa-regular fa-upload text-white ms-2" style="cursor: pointer;" onclick="${obj.gvc.event(() => {
                    glitter.ut.chooseMediaCallback({
                        single: true,
                        accept: 'json,image/*',
                        callback(data) {
                            const saasConfig = window.saasConfig;
                            const dialog = new ShareDialog(obj.gvc.glitter);
                            dialog.dataLoading({ visible: true });
                            const file = data[0].file;
                            saasConfig.api.uploadFile(file.name).then((data) => {
                                dialog.dataLoading({ visible: false });
                                const data1 = data.response;
                                dialog.dataLoading({ visible: true });
                                $.ajax({
                                    url: data1.url,
                                    type: 'put',
                                    data: file,
                                    processData: false,
                                    crossDomain: true,
                                    success: (data2) => {
                                        dialog.dataLoading({ visible: false });
                                        obj.callback(data1.fullUrl);
                                        obj.def = data1.fullUrl;
                                        obj.gvc.notifyDataChange(id);
                                    },
                                    error: (err) => {
                                        dialog.dataLoading({ visible: false });
                                        dialog.errorMessage({ text: "上傳失敗" });
                                    },
                                });
                            });
                        }
                    });
                })}"></i>
                            </div>
                            ${obj.def && `<img src="${obj.def}" style="max-width: 150px;">`}

`;
            },
            divCreate: {}
        };
    });
}
