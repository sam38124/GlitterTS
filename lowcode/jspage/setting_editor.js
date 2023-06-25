import { appCreate, appSetting, fileManager } from "../setting/appSetting.js";
import { Editor } from "../glitterBundle/plugins/editor.js";
import { ShareDialog } from "../dialog/ShareDialog.js";
export class Setting_editor {
    static left(gvc, viewModel, createID, gBundle) {
        const saasConfig = window.saasConfig;
        const dialog = new ShareDialog(gvc.glitter);
        const glitter = gvc.glitter;
        if (!glitter.getUrlParameter('selectItem')) {
            glitter.setUrlParameter('selectItem', 'pageDesign');
        }
        return gvc.bindView(() => {
            var _a;
            glitter.setUrlParameter('selectItem', (_a = glitter.getUrlParameter('selectItem')) !== null && _a !== void 0 ? _a : 'pageDesign');
            let items = [
                {
                    title: `<h3 class="ul fs-lg d-flex align-items-center px-3 py-3 border-bottom mb-0 shadow" style="">後台管理系統<button class="rounded-circle btn-warning  btn  ms-2 d-flex align-items-center justify-content-center p-0" style="height: 25px;width: 25px;" 
onclick="${gvc.event(() => {
                        Setting_editor.addPlugin(gvc);
                    })}">
<i class="fa-sharp fa-solid fa-circle-plus " style="color: black;"></i></button></h3>`,
                    option: [{
                            tag: 'pageDesign',
                            text: `<i class="fa-regular fa-gear me-2 d-flex align-items-center justify-content-center" style="width:25px;"></i>應用程式設定`,
                            click: () => {
                                gvc.notifyDataChange(createID);
                            },
                            select: true
                        }, {
                            tag: 'pushApp',
                            text: `<i class="fa-light fa-mobile me-2 d-flex align-items-center justify-content-center" style="width:25px;"></i>APP上架送審`,
                            click: () => {
                                gvc.notifyDataChange(createID);
                            },
                            select: false
                        }, {
                            tag: 'fileManager',
                            text: `<i class="fa-regular fa-folders me-2 d-flex align-items-center justify-content-center" style="width:25px;"></i>資源管理`,
                            click: () => {
                                gvc.notifyDataChange(createID);
                            },
                            select: false
                        }].map((dd) => {
                        dd.select = (glitter.getUrlParameter('selectItem') === dd.tag);
                        return dd;
                    })
                }
            ];
            const vm = {
                loading: true,
                data: {
                    array: []
                },
            };
            saasConfig.api.getPrivateConfig(saasConfig.config.appName, "glitter_backend_plugin").then((r) => {
                if (r.response.result[0]) {
                    vm.data = r.response.result[0].value;
                }
                vm.loading = false;
                items[0].option = items[0].option.concat(vm.data.array.map((dd, index) => {
                    if ((glitter.getUrlParameter('selectItem') === `${index}` + dd.title)) {
                        Setting_editor.pluginUrl = dd.route;
                    }
                    return {
                        tag: `${index}` + dd.title,
                        text: `<i class="${dd.icon} me-2 d-flex align-items-center justify-content-center" style="width:25px;"></i>${dd.title}`,
                        click: () => {
                            gvc.notifyDataChange(createID);
                        },
                        select: (glitter.getUrlParameter('selectItem') === `${index}` + dd.title)
                    };
                }));
                gvc.notifyDataChange('showView');
                gvc.notifyDataChange(vid);
            });
            const vid = glitter.getUUID();
            function clearSelect() {
                items.map((dd) => {
                    function clear(dd) {
                        dd.select = false;
                        if (dd.option) {
                            dd.option.map((d2) => {
                                clear(d2);
                            });
                        }
                    }
                    clear(dd);
                });
            }
            return {
                bind: vid,
                view: () => {
                    if (vm.loading) {
                        return `<div class="w-100 mt-3 d-flex align-items-center justify-content-center"><div class="spinner-border"></div></div>`;
                    }
                    let html = '';
                    let dragm = {
                        start: 0,
                        end: 0,
                        div: ''
                    };
                    let indexCounter = 9999;
                    items.map((dd, index) => {
                        html += `<ul class="list-group list-group-flush border-bottom   mx-n4">${dd.title}</ul>
                            <ul class="list-group list-group-flush border-bottom pb-3 mb-4 mx-n4">
                                                        ${(() => {
                            function convertInner(d2, inner, parentCallback = () => {
                            }) {
                                const hoverID = glitter.getUUID();
                                function checkOptionSelect(data) {
                                    if (data.select) {
                                        return true;
                                    }
                                    else if (data.option) {
                                        for (const a of data.option) {
                                            if (checkOptionSelect(a)) {
                                                data.select = true;
                                                return true;
                                            }
                                        }
                                    }
                                    return false;
                                }
                                let onMouselem = 'first';
                                return `<li class="align-items-center list-group-item list-group-item-action border-0 py-2 px-4 ${d2.select ? `${(inner) ? `bg-warning` : `active`}` : ``} position-relative d-flex"
                                                                    onclick="${gvc.event(() => {
                                    clearSelect();
                                    d2.select = true;
                                    glitter.setUrlParameter('selectItem', d2.tag);
                                    parentCallback();
                                    gvc.notifyDataChange(createID);
                                    d2.click();
                                })}"
                                                                    style="z-index: ${indexCounter--} !important;cursor:pointer;${(inner && d2.select) ? `background-color: #FFDC6A !important;color:black !important;` : ``}"
                                                                 >${d2.text}
                                                                 </li>`;
                            }
                            return gvc.map(dd.option.map((d2, index) => {
                                return convertInner(d2, false, () => {
                                });
                            }));
                        })()}
                                                    </ul>`;
                    });
                    return html;
                },
                divCreate: {
                    class: `swiper-slide h-auto`,
                },
                onCreate: () => {
                }
            };
        });
    }
    static center(gvc, viewModel, createID) {
        const glitter = gvc.glitter;
        if (!glitter.getUrlParameter('selectItem')) {
            glitter.setUrlParameter('selectItem', 'pageDesign');
        }
        if (glitter.getUrlParameter('selectItem') === 'pushApp') {
            return `<div class=" mx-auto" style="width: calc(100% - 20px);height: calc(100vh - 50px);padding-top: 40px;overflow-y: scroll;">
                  ${appCreate(gvc, viewModel, createID)}
                </div>`;
        }
        else if (glitter.getUrlParameter('selectItem') === 'fileManager') {
            return `<div class=" mx-auto" style="width: calc(100% - 20px);height: calc(100vh - 50px);padding-top: 40px;overflow-y: scroll;">
                  ${fileManager(gvc, viewModel, createID)}
                </div>`;
        }
        else if (glitter.getUrlParameter('selectItem') === 'pageDesign') {
            return `<div class=" mx-auto" style="width: calc(100% - 20px);height: calc(100vh - 50px);padding-top: 40px;overflow-y: scroll;">
                  ${appSetting(gvc, viewModel, createID)}
                </div>`;
        }
        else {
            return gvc.bindView(() => {
                var _a, _b;
                glitter.share.backendPlugins = (_a = glitter.share.backendPlugins) !== null && _a !== void 0 ? _a : {};
                const vid = glitter.getUUID();
                const id = Setting_editor.pluginUrl;
                let route = `${Setting_editor.pluginUrl}?callback=${id}`;
                glitter.share.backeng_callback = (_b = glitter.share.backeng_callback) !== null && _b !== void 0 ? _b : {};
                glitter.share.backeng_callback[id] = () => {
                    gvc.notifyDataChange(vid);
                };
                if (!glitter.share.backendPlugins[route]) {
                    glitter.addMtScript([{
                            src: route,
                            type: 'module'
                        }], () => {
                    }, () => {
                    });
                }
                return {
                    bind: vid,
                    view: () => {
                        if (glitter.share.backendPlugins[route]) {
                            return glitter.share.backendPlugins[route](gvc);
                        }
                        else {
                            return `<div class="w-100 d-flex align-items-center justify-content-center">
<div class=" spinner-border"></div>
</div>`;
                        }
                    },
                    divCreate: {
                        class: `pt-5 px-4`
                    }
                };
            });
        }
    }
    static addPlugin(gvc) {
        const saasConfig = window.saasConfig;
        gvc.glitter.innerDialog((gvc) => {
            const vm = {
                loading: true,
                data: {
                    array: []
                },
            };
            const did = gvc.glitter.getUUID();
            saasConfig.api.getPrivateConfig(saasConfig.config.appName, "glitter_backend_plugin").then((r) => {
                if (r.response.result[0]) {
                    vm.data = r.response.result[0].value;
                }
                vm.loading = false;
                gvc.notifyDataChange(did);
            });
            return gvc.bindView(() => {
                return {
                    bind: did,
                    view: () => {
                        return ` <div class="w-100 d-flex align-items-center border-bottom justify-content-center position-relative" style="height: 68px;">
        <h3 class="modal-title fs-4">事件叢集設定</h3>
        <i class="fa-solid fa-xmark text-dark position-absolute " style="font-size:20px;transform: translateY(-50%);right: 20px;top: 50%;cursor: pointer;"
        onclick="${gvc.event(() => {
                            gvc.closeDialog();
                        })}"></i>
</div>    

<div class="mt-2 border border-white p-2">
<div class="alert alert-info " style="white-space:normal;">
您可以透過添加插件來拓展你的後台系統應用．
</div>
${(() => {
                            if (vm.loading) {
                                return `  <div class="w-100 d-flex align-items-center justify-content-center">
  <div class="spinner-border " role="status">
  <span class="sr-only"></span>
</div>
</div>`;
                            }
                            else {
                                return Editor.arrayItem({
                                    originalArray: vm.data.array,
                                    gvc: gvc,
                                    title: '插件集',
                                    array: vm.data.array.map((obj, index) => {
                                        var _a;
                                        return {
                                            title: (_a = obj.title) !== null && _a !== void 0 ? _a : `第${index + 1}個後台插件`,
                                            expand: obj,
                                            innerHtml: () => {
                                                const selectID = gvc.glitter.getUUID();
                                                return gvc.bindView(() => {
                                                    return {
                                                        bind: selectID,
                                                        view: () => {
                                                            var _a, _b, _c;
                                                            return [
                                                                Editor.fontawesome({
                                                                    title: 'ICON圖示',
                                                                    gvc: gvc,
                                                                    def: (_a = obj.icon) !== null && _a !== void 0 ? _a : "",
                                                                    callback: (text) => {
                                                                        obj.icon = text;
                                                                        gvc.notifyDataChange(did);
                                                                    }
                                                                }),
                                                                gvc.glitter.htmlGenerate.editeInput({
                                                                    gvc: gvc,
                                                                    title: "插件名稱",
                                                                    default: (_b = obj.title) !== null && _b !== void 0 ? _b : "",
                                                                    placeHolder: "請輸入插件名稱",
                                                                    callback: (text) => {
                                                                        obj.title = text;
                                                                        gvc.notifyDataChange(did);
                                                                    }
                                                                }),
                                                                gvc.glitter.htmlGenerate.editeInput({
                                                                    gvc: gvc,
                                                                    title: "插件路徑",
                                                                    default: (_c = obj.route) !== null && _c !== void 0 ? _c : "",
                                                                    placeHolder: "請輸入插件路徑",
                                                                    callback: (text) => {
                                                                        obj.route = text;
                                                                        gvc.notifyDataChange(selectID);
                                                                    }
                                                                })
                                                            ].join('');
                                                        },
                                                        divCreate: {}
                                                    };
                                                });
                                            },
                                            minus: gvc.event(() => {
                                                vm.data.array.splice(index, 1);
                                                gvc.notifyDataChange(did);
                                            }),
                                        };
                                    }),
                                    expand: { expand: true },
                                    plus: {
                                        title: '添加後台插件',
                                        event: gvc.event(() => {
                                            vm.data.array.push({});
                                            gvc.notifyDataChange(did);
                                        }),
                                    },
                                    refreshComponent: () => {
                                        gvc.recreateView();
                                    }
                                });
                            }
                        })()}
</div>
<div class="d-flex border-top py-2 px-2 justify-content-end">
<button class="btn btn-warning d-flex align-items-center text-dark" onclick="${gvc.event(() => {
                            const dialog = new ShareDialog(gvc.glitter);
                            dialog.dataLoading({ text: '設定中', visible: true });
                            saasConfig.api.setPrivateConfig(saasConfig.config.appName, "glitter_backend_plugin", vm.data).then((r) => {
                                dialog.dataLoading({ visible: false });
                                if (r.response) {
                                    dialog.successMessage({ text: "儲存成功" });
                                }
                                else {
                                    dialog.errorMessage({ text: "儲存失敗" });
                                }
                            });
                        })}"><i class="fa-solid fa-floppy-disk me-2"></i>儲存</button>
</div>
`;
                    },
                    divCreate: {
                        class: `m-auto bg-white shadow rounded overflow-auto`,
                        style: `max-width: 100%;max-height: calc(100% - 20px);width:700px;`
                    }
                };
            });
        }, 'addPlugin');
    }
}
Setting_editor.index = '2';
Setting_editor.pluginUrl = '';
