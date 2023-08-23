import { pageManager } from "../setting/pageManager.js";
import { EditorElem } from "../glitterBundle/plugins/editor-elem.js";
import { ApiPageConfig } from "../api/pageConfig.js";
import { ShareDialog } from "../dialog/ShareDialog.js";
export class Page_editor {
    static left(gvc, viewModel, createID, gBundle) {
        const id = gvc.glitter.getUUID();
        const glitter = gvc.glitter;
        if (typeof viewModel.data.page_config.seo !== 'object') {
            viewModel.data.page_config.seo = {};
        }
        let vm = {
            select: `pageSet`,
        };
        const html = String.raw;
        return gvc.bindView(() => {
            return {
                bind: id,
                view: () => {
                    const seo = viewModel.data.page_config.seo;
                    return `<div class="d-flex border-bottom position-absolute left-0 top-0 w-100" style="">
                                    ${[{
                            key: 'pageSet',
                            label: "頁面設定"
                        }, {
                            key: 'pageConfig',
                            label: "頁面代碼"
                        }].map((dd) => {
                        return `<div class="add_item_button ${(dd.key === vm.select) ? `add_item_button_active` : ``}" onclick="${gvc.event((e, event) => {
                            vm.select = dd.key;
                            gvc.notifyDataChange(id);
                        })}" style="font-size:14px;">${dd.label}</div>`;
                    }).join('')}
                                </div>` + (() => {
                        switch (vm.select) {
                            case "pageSet":
                                return html `
                                   <div class="flex-fill" style="overflow-y:auto;">
                                       <div class="d-flex  px-2 hi fw-bold d-flex align-items-center border-bottom border-top py-2 bgf6"
                                            style="color:#151515;font-size:16px;gap:0px;">
                                           頁面設定
                                       </div>
                                       <div class=" pt-0 justify-content-start px-2" style="">
                                           ${[EditorElem.select({
                                        title: "首頁設定",
                                        gvc: gvc,
                                        def: (viewModel.homePage === viewModel.data.tag) ? `true` : `false`,
                                        array: [{ title: "是", value: 'true' }, { title: "否", value: 'false' }],
                                        callback: (text) => {
                                            if (text === 'true') {
                                                viewModel.homePage = viewModel.data.tag;
                                                viewModel.data.page_config.seo.type = 'custom';
                                            }
                                            else {
                                                viewModel.homePage = undefined;
                                            }
                                            gvc.notifyDataChange(id);
                                        }
                                    }),
                                    EditorElem.editeInput({
                                        gvc: gvc,
                                        title: '頁面連結',
                                        placeHolder: `請輸入頁面標籤`,
                                        default: viewModel.data.tag,
                                        callback: (text) => {
                                            viewModel.data.tag = text;
                                        }
                                    }),
                                    EditorElem.editeInput({
                                        gvc: gvc,
                                        title: '頁面名稱',
                                        placeHolder: `請輸入頁面名稱`,
                                        default: viewModel.data.name,
                                        callback: (text) => {
                                            viewModel.data.name = text;
                                        }
                                    }),
                                    EditorElem.searchInput({
                                        title: "頁面分類",
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
                                    })
                                ].map((dd) => {
                                    return `<div class="">${dd}</div>`;
                                }).join(``)}
                                       </div>
                                       <div class="mt-2 d-flex  px-2 hi fw-bold d-flex align-items-center border-bottom border-top py-2 bgf6"
                                            style="color:#151515;font-size:16px;gap:0px;">
                                           SEO設定
                                       </div>
                                       ${gvc.bindView(() => {
                                    const id = glitter.getUUID();
                                    return {
                                        bind: id,
                                        view: () => {
                                            var _a, _b, _c, _d, _e, _f;
                                            seo.type = (_a = seo.type) !== null && _a !== void 0 ? _a : "def";
                                            if (viewModel.data.tag === viewModel.homePage) {
                                                seo.type = 'custom';
                                            }
                                            return html `
                                                       ${(viewModel.data.tag === viewModel.homePage) ? `` : EditorElem.h3('SEO參照')}
                                                    <select class="mt-2 form-select form-control ${(viewModel.data.tag === viewModel.homePage) && 'd-none'}"
                                                            onchange="${gvc.event((e) => {
                                                seo.type = e.value;
                                                gvc.notifyDataChange(id);
                                            })}">
                                                        <option value="def" ${(seo.type === "def") ? `selected` : ``}>
                                                            依照首頁
                                                        </option>
                                                        <option value="custom"
                                                                ${(seo.type === "custom") ? `selected` : ``}>自定義
                                                        </option>
                                                    </select>
                                                    ${(seo.type === "def") ? `` : gvc.map([uploadImage({
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
                                                `;
                                        },
                                        divCreate: {
                                            style: `padding-bottom:100px;`, class: `px-2`
                                        }
                                    };
                                })}
                                   </div>
                                    <div class="w-100  position-absolute bottom-0 border-top d-flex align-items-center ps-3"
                                         style="height:50px;background:#f6f6f6;font-size:14px;">
                                        <div class="hoverBtn fw-bold" style="color:#8e1f0b;cursor:pointer;"
                                             onclick="${gvc.event(() => {
                                    gvc.glitter.innerDialog((gvc) => {
                                        let deleteText = '';
                                        return html `
                                                         <div class="dropdown-menu mx-0  pb-0 border p-0 show"
                                                              style="z-index:999999;"
                                                              onclick="${gvc.event((e, event) => {
                                            event.preventDefault();
                                            event.stopPropagation();
                                        })}">
                                                             <div class="d-flex align-items-center px-2 border-bottom"
                                                                  style="height:50px;width:400px;">
                                                                 <h3 style="font-size:15px;font-weight:500;"
                                                                     class="m-0">
                                                                     刪除頁面</h3>
                                                                 <div class="flex-fill"></div>
                                                                 <div class="hoverBtn p-2" data-bs-toggle="dropdown"
                                                                      aria-haspopup="true" aria-expanded="false"
                                                                      style="color:black;font-size:20px;"
                                                                      onclick="${gvc.event((e, event) => {
                                            gvc.closeDialog();
                                        })}"><i
                                                                         class="fa-sharp fa-regular fa-circle-xmark"></i>
                                                                 </div>
                                                             </div>
                                                             <div class="px-2"
                                                                  style="max-height:calc(100vh - 20px);overflow-y:auto;">
                                                                 <div class="alert alert-danger my-2 mb-0">
                                                                     <strong>警告</strong>-刪除頁面後無法復原，請警慎進行操作
                                                                     !
                                                                 </div>
                                                                 ${EditorElem.editeInput({
                                            gvc: gvc,
                                            title: '再次確認',
                                            placeHolder: `請輸入「我要刪除」`,
                                            default: '',
                                            callback: (text) => {
                                                deleteText = text;
                                            }
                                        })}
                                                             </div>
                                                             <div class="d-flex w-100 p-2">
                                                                 <div class="btn btn-outline-danger flex-fill"
                                                                      onclick="${gvc.event(() => {
                                            if (deleteText === '我要刪除') {
                                                const dialog = new ShareDialog(glitter);
                                                dialog.dataLoading({ visible: true });
                                                ApiPageConfig.deletePage({
                                                    "id": viewModel.data.id,
                                                    "appName": viewModel.appName,
                                                }).then((data) => {
                                                    dialog.dataLoading({ visible: false });
                                                    location.reload();
                                                });
                                            }
                                        })}"><i class="fa-light fa-trash me-2"></i>確認刪除
                                                                 </div>
                                                             </div>

                                                         </div>`;
                                    }, "delete");
                                })}">
                                            <i class="fa-solid fa-trash-can me-2"></i>移除頁面
                                        </div>
                                    </div>`;
                            case 'pageConfig':
                                const json = JSON.parse(JSON.stringify(viewModel.data.config));
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
<div class="alert alert-danger flex-fill m-0 p-2 " style="white-space: normal;word-break:break-all;">此頁面的配置檔包含所有設計模組和觸發事件的代碼配置項目。<br>建議由熟悉程式開發的工程師進行編輯。</div>
 <textArea class="form-control mt-2" style="overflow-x: scroll;height: calc(100vh - 300px);" onchange="${gvc.event((e) => { value = e.value; })}">${JSON.stringify(json, null, '\t')}</textArea>
<div class="d-flex w-100 mb-2 mt-2 justify-content-end" style="gap:10px;">
    <button class="btn btn-outline-secondary-c " style="flex:1;height:40px; width:calc(50% - 10px);"   onclick="${gvc.event(() => {
                                                navigator.clipboard.writeText(JSON.stringify(json, null, '\t'));
                                            })}"><i class="fa-regular fa-copy me-2"></i>複製到剪貼簿</button>
    <button class="btn btn-primary-c " style="flex:1; height:40px; width:calc(50% - 10px);" onclick="${gvc.event(() => {
                                                const dialog = new ShareDialog(gvc.glitter);
                                                try {
                                                    viewModel.data.config = JSON.parse(value);
                                                    glitter.closeDiaLog();
                                                    glitter.htmlGenerate.saveEvent();
                                                }
                                                catch (e) {
                                                    dialog.errorMessage({ text: "代碼輸入錯誤" });
                                                    console.log(`${e}${e.stack}${e.line}`);
                                                }
                                            })}"><i class="fa-regular fa-floppy-disk me-2"></i>儲存</button>
</div>
                                            `;
                                        },
                                        divCreate: {
                                            class: `p-2`
                                        }
                                    };
                                });
                        }
                    })();
                },
                divCreate: {
                    class: `position-relative  d-flex flex-column`, style: "padding-top:50px;height:calc(100vh - 56px);overflow-y: scroll;"
                }
            };
        });
    }
    static center(viewModel, gvc, createID) {
        return `<div class=" mx-auto" style="width: calc(100% - 20px);height: calc(100vh - 50px);padding-top: 40px;overflow-y: scroll;">
                  ${pageManager(gvc, viewModel, createID)}
                </div>`;
    }
}
Page_editor.index = '1';
function swapArr(arr, index1, index2) {
    const data = arr[index1];
    arr.splice(index1, 1);
    arr.splice(index2, 0, data);
}
function uploadImage(obj) {
    const glitter = window.glitter;
    const id = glitter.getUUID();
    return obj.gvc.bindView(() => {
        return {
            bind: id,
            view: () => {
                return `<h3 style="font-size: 15px;margin-bottom: 10px;" class="mt-2 fw-500">${obj.title}</h3>
                            <div class="d-flex align-items-center mb-3">
                                <input class="flex-fill form-control "  placeholder="請輸入圖片連結" value="${obj.def}" onchange="${obj.gvc.event((e) => {
                    obj.callback(e.value);
                    obj.gvc.notifyDataChange(id);
                })}">
                                <div class="" style="width: 1px;height: 25px;background-"></div>
                                <i class="fa-regular fa-upload text-dark ms-2" style="cursor: pointer;" onclick="${obj.gvc.event(() => {
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
                                    headers: {
                                        "Content-Type": data1.type
                                    },
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
