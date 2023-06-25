import { EditorElem } from "../glitterBundle/plugins/editor-elem.js";
import { ShareDialog } from "../dialog/ShareDialog.js";
import { ApiPageConfig } from "../api/pageConfig.js";
export function pageManager(gvc, viewModel, id) {
    var _a;
    const glitter = gvc.glitter;
    viewModel.data.page_config.seo = (_a = viewModel.data.page_config.seo) !== null && _a !== void 0 ? _a : {};
    const seo = viewModel.data.page_config.seo;
    const tabIndex = [
        {
            title: '基本設定 / Basic',
            index: 'pageSet',
            html: `<div class="row pt-0 justify-content-start" >
${EditorElem.h3("<span style='font-size:20px;color:orangered;'>基本設定</span>")}
  ${[
                `<div class=" m-0 d-flex align-items-center " style="border-radius: 0px;">
<h3 style="font-size: 16px;width: 100px;" class="m-0">首頁設定:</h3>
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
<h3 style="font-size: 16px;width: 100px;" class="m-0">容器樣式:</h3>
${glitter.htmlGenerate.styleEditor(viewModel.data.page_config).editor(gvc, () => {
                }, "設定樣式", { class: 'mt-0' })}</div>`,
                `<div class="w-100 d-flex align-items-center justify-content-center" style="">
<h3 style="font-size: 16px;width: 100px;" class="m-0">頁面連結:</h3>
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
<h3 style="font-size: 16px;width: 100px;" class="m-0">頁面名稱:</h3>
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
<h3 style="font-size: 16px;width: 100px;" class="m-0 ">頁面分類:</h3>
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
                })}</div>`, `
               ${(() => {
                    var deleteText = '';
                    return ` <div class="w-100 d-flex align-items-center justify-content-center" style="">
<h3 style="font-size: 16px;width: 100px;white-space: nowrap;" class="m-0 me-2 mb-2">刪除頁面:</h3>
${glitter.htmlGenerate.editeInput({
                        gvc: gvc,
                        title: '',
                        placeHolder: `請輸入「我要刪除」`,
                        default: '',
                        callback: (text) => {
                            deleteText = text;
                        }
                    })}
<button class="btn btn-danger ms-2 mt-0 mb-2" style="width:100px;" onclick="${gvc.event(() => {
                        if (deleteText === '我要刪除') {
                            const dialog = new ShareDialog(glitter);
                            dialog.dataLoading({ visible: true });
                            ApiPageConfig.deletePage({
                                "id": viewModel.data.id,
                                "appName": gvc.getBundle().appName,
                            }).then((data) => {
                                dialog.dataLoading({ visible: false });
                                location.reload();
                            });
                        }
                    })}">確認</button>
</div>`;
                })()}
                `
            ].map((dd) => {
                return `<div class="col-sm-6 pb-2  pt-3">${dd}</div>`;
            }).join(``)}
  <div class="col-12 mt-4 mb-2 bg-dark" style="height:2px;"></div>
  <div class="col-12">
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
                        return `
${EditorElem.h3("<span style='font-size:20px;color:orangered;'>SEO參數設定</span>")}
<select class="form-select form-control ${(viewModel.data.tag === viewModel.homePage) && 'd-none'}" onchange="${gvc.event((e) => {
                            seo.type = e.value;
                            gvc.notifyDataChange(id);
                        })}">
<option value="def" ${(seo.type === "def") ? `selected` : ``}>依照首頁</option>
<option value="custom" ${(seo.type === "custom") ? `selected` : ``}>自定義</option>
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
                        class: '-2'
                    }
                };
            })}
</div>
</div>`
        }, {
            title: '配置檔 / Config',
            index: 'pageConfig',
            html: `
${(() => {
                const json = JSON.parse(JSON.stringify(viewModel.data.config));
                json.map((dd) => {
                    dd.refreshAllParameter = undefined;
                    dd.refreshComponentParameter = undefined;
                });
                let value = JSON.stringify(json, null, '\t');
                return `

<div class="d-flex w-100 my-2 justify-content-end" style="gap:10px;">
<div class="alert alert-danger flex-fill m-0" style="white-space: normal;word-break:break-all;">此頁面的配置檔包含所有設計模組和觸發事件的項目。建議由熟悉程式開發的工程師進行編輯。</div>
 <button class="btn btn-primary h-auto"   onclick="${gvc.event(() => {
                    navigator.clipboard.writeText(JSON.stringify(json, null, '\t'));
                })}"><i class="fa-regular fa-copy me-2"></i>複製到剪貼簿</button>
  <button class="btn btn-warning " style="color:black; " onclick="${gvc.event(() => {
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
 <textArea class="form-control " style="overflow-x: scroll;height: calc(100vh - 250px);" onchange="${gvc.event((e) => {
                    value = e.value;
                })}">${JSON.stringify(json, null, '\t')}</textArea>
                        `;
            })()}`
        }
    ];
    return `
 <div class="w-100">
    <ul class="nav nav-tabs border-bottom" id="myTab" role="tablist">
    ${(() => {
        return tabIndex.map((dd, index) => {
            return `<li class="nav-item" role="presentation">
    <button class="nav-link ${(index === 0) ? `active` : ``}"  data-bs-toggle="tab" data-bs-target="#${dd.index}" type="button" role="tab" aria-controls="${dd.index}" aria-selected="${index === 0}">${dd.title}</button>
  </li>`;
        }).join('');
    })()}
</ul>
<div class="tab-content" id="myTabContent">
  ${(() => {
        return tabIndex.map((dd, index) => {
            return `<div class="tab-pane ${(index === 0) ? `show active` : `fade`}" id="${dd.index}" role="tabpanel" aria-labelledby="profile-tab">
${dd.html}</div>`;
        }).join('');
    })()}
</div>
</div>

    `;
}
function uploadImage(obj) {
    const glitter = window.glitter;
    const id = glitter.getUUID();
    return obj.gvc.bindView(() => {
        return {
            bind: id,
            view: () => {
                return `<h3 style="font-size: 16px;margin-bottom: 10px;" class="mt-2">${obj.title}</h3>
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
