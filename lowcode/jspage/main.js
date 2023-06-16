import { init } from '../glitterBundle/GVController.js';
import { Editor } from './editor.js';
import { ApiPageConfig } from '../api/pageConfig.js';
import { Swal } from '../modules/sweetAlert.js';
import { Main_editor } from "./main_editor.js";
import { Page_editor } from "./page_editor.js";
import { Setting_editor } from "./setting_editor.js";
init((gvc, glitter, gBundle) => {
    gvc.addStyle(`
    .swal2-title {
    color:black!important;
    }
    `);
    const viewModel = {
        dataList: undefined,
        data: undefined,
        loading: true,
        selectItem: undefined,
        initialStyle: [],
        initialStyleSheet: [],
        pluginList: [],
        initialJS: [],
        initialCode: '',
        initialList: [],
        backendPlugins: [],
        homePage: '',
        selectContainer: undefined,
        selectIndex: undefined,
        waitCopy: undefined
    };
    const swal = new Swal(gvc);
    const doc = new Editor(gvc, viewModel);
    const createID = `HtmlEditorContainer`;
    glitter.share.refreshAllContainer = () => {
        gvc.notifyDataChange(createID);
    };
    async function lod() {
        swal.loading('加載中...');
        const waitGetData = [
            (async () => {
                return await new Promise(async (resolve) => {
                    var _a;
                    const data = await ApiPageConfig.getPage(gBundle.appName);
                    if (data.result) {
                        data.response.result.map((dd) => {
                            var _a;
                            dd.page_config = (_a = dd.page_config) !== null && _a !== void 0 ? _a : {};
                            if (glitter.getUrlParameter('page') == undefined) {
                                glitter.setUrlParameter('page', dd.tag);
                            }
                            if (dd.tag === glitter.getUrlParameter('page')) {
                                viewModel.data = dd;
                            }
                            return dd;
                        });
                        viewModel.data = (_a = viewModel.data) !== null && _a !== void 0 ? _a : data.response.result[0];
                        viewModel.dataList = data.response.result;
                        if (!data) {
                            resolve(false);
                        }
                        else {
                            resolve(true);
                        }
                    }
                });
            }),
            (async () => {
                return await new Promise(async (resolve) => {
                    var _a, _b, _c;
                    const data = await ApiPageConfig.getPlugin(gBundle.appName);
                    if (data.result) {
                        viewModel.initialList = data.response.data.initialList;
                        viewModel.initialJS = data.response.data.eventPlugin;
                        viewModel.pluginList = data.response.data.pagePlugin;
                        viewModel.initialStyleSheet = data.response.data.initialStyleSheet;
                        viewModel.initialStyle = data.response.data.initialStyle;
                        viewModel.initialCode = (_a = data.response.data.initialCode) !== null && _a !== void 0 ? _a : "";
                        viewModel.homePage = (_b = data.response.data.homePage) !== null && _b !== void 0 ? _b : "";
                        viewModel.backendPlugins = (_c = data.response.data.backendPlugins) !== null && _c !== void 0 ? _c : [];
                        async function load() {
                            for (const a of viewModel.initialJS) {
                                await new Promise((resolve) => {
                                    glitter.addMtScript([{
                                            src: glitter.htmlGenerate.resourceHook(a.src.official) + `?resource=${a.src.official}`,
                                            type: 'module'
                                        }], () => {
                                        resolve(true);
                                    }, () => {
                                        resolve(true);
                                    });
                                });
                            }
                            resolve(true);
                        }
                        await load();
                    }
                    else {
                        resolve(false);
                    }
                }).then((data) => {
                    return data;
                });
            })
        ];
        for (const a of waitGetData) {
            if (!await a()) {
                await lod();
                return;
            }
        }
        swal.close();
        viewModel.loading = false;
        gvc.notifyDataChange(createID);
    }
    glitter.htmlGenerate.saveEvent = () => {
        glitter.setCookie("jumpToNavScroll", $(`#jumpToNav`).scrollTop());
        swal.loading('更新中...');
        async function saveEvent() {
            const waitSave = [
                (async () => {
                    let haveID = [];
                    function getID(set) {
                        set.map((dd) => {
                            var _a;
                            if (haveID.indexOf(dd.id) !== -1) {
                                dd.id = glitter.getUUID();
                            }
                            haveID.push(dd.id);
                            if (dd.type === 'container') {
                                dd.data.setting = (_a = dd.data.setting) !== null && _a !== void 0 ? _a : [];
                                getID(dd.data.setting);
                            }
                        });
                    }
                    getID(viewModel.data.config);
                    return new Promise(async (resolve) => {
                        const api = await ApiPageConfig.setPage({
                            id: viewModel.data.id,
                            appName: gBundle.appName,
                            tag: viewModel.data.tag,
                            name: viewModel.data.name,
                            config: viewModel.data.config,
                            group: viewModel.data.group,
                            page_config: viewModel.data.page_config
                        });
                        resolve(api.result);
                    });
                }),
                (async () => {
                    return new Promise(async (resolve) => {
                        const api = await ApiPageConfig.setPlugin(gBundle.appName, {
                            pagePlugin: viewModel.pluginList,
                            eventPlugin: viewModel.initialJS,
                            initialStyle: viewModel.initialStyle,
                            initialStyleSheet: viewModel.initialStyleSheet,
                            backendPlugins: viewModel.backendPlugins,
                            initialCode: viewModel.initialCode,
                            homePage: viewModel.homePage,
                            initialList: viewModel.initialList
                        });
                        resolve(api.result);
                    });
                })
            ];
            for (const a of waitSave) {
                if (!await a()) {
                    swal.nextStep(`連結不可重複`, () => {
                    }, 'error');
                    return;
                }
            }
            swal.nextStep(`更新成功`, () => {
            });
            gvc.notifyDataChange(createID);
        }
        saveEvent().then(r => {
        });
    };
    lod();
    document.addEventListener("paste", function (event) {
        var clipboardData = event.clipboardData || window.clipboardData;
        var pastedData = clipboardData.getData('text/plain');
        if (pastedData.indexOf('glitter-copyEvent') === 0) {
            var copy = JSON.parse(pastedData.replace('glitter-copyEvent', ''));
            function checkId(dd) {
                copy.id = glitter.getUUID();
                if (dd.type === 'container') {
                    dd.data.setting.map((d2) => {
                        checkId(d2);
                    });
                }
            }
            console.log(JSON.stringify(viewModel.selectContainer));
            checkId(copy);
            glitter.setCookie('lastSelect', copy.id);
            viewModel.selectContainer.splice(viewModel.selectIndex + 1, 0, copy);
            gvc.notifyDataChange(createID);
        }
    });
    window.parent.glitter.share.refreshMainLeftEditor = () => {
        gvc.notifyDataChange('MainEditorLeft');
    };
    window.parent.glitter.share.refreshMainRightEditor = () => {
        gvc.notifyDataChange('MainEditorRight');
    };
    return {
        onCreateView: () => {
            return gvc.bindView({
                bind: createID,
                view: () => {
                    var _a;
                    let selectPosition = (_a = glitter.getUrlParameter('editorPosition')) !== null && _a !== void 0 ? _a : "0";
                    if (viewModel.loading) {
                        return ``;
                    }
                    else {
                        try {
                            return doc.create(`<div class="d-flex overflow-hidden"  style="height:100vh;">
<div style="width:60px;gap:20px;padding-top: 15px;" class="h-100 border-end d-flex flex-column align-items-center " >
${[
                                { src: `fa-table-layout`, index: Main_editor.index },
                                { src: `fa-sharp fa-regular fa-file-dashed-line`, index: Page_editor.index },
                                { src: `fa-solid fa-list-check`, index: Setting_editor.index },
                                { src: `fa-regular fa-folders d-none`, index: '3' }
                            ].map((da, index) => {
                                return `<i class="fa-regular ${da.src} fs-4 fw-bold ${(selectPosition === `${da.index}`) ? `text-primary` : ``}  p-2 rounded" style="cursor:pointer;${(selectPosition === `${da.index}`) ? `background-color: rgba(10,83,190,0.1);` : ``}"
onclick="${gvc.event(() => {
                                    viewModel.waitCopy = undefined;
                                    viewModel.selectItem = undefined;
                                    glitter.setUrlParameter(`editorPosition`, `${da.index}`);
                                    gvc.notifyDataChange(createID);
                                })}"></i>`;
                            }).join('')}
</div>
<div class="offcanvas-body swiper scrollbar-hover  w-100 ${(() => {
                                switch (selectPosition) {
                                    case Setting_editor.index:
                                    case Main_editor.index:
                                        return `p-4 pt-0`;
                                    case Page_editor.index:
                                        return `p-0`;
                                    default:
                                        return `p-0`;
                                }
                            })()}" style="overflow-y: auto;">
                            <div class="" style="">
                                ${gvc.bindView(() => {
                                return {
                                    bind: 'MainEditorLeft',
                                    view: () => {
                                        switch (selectPosition) {
                                            case Setting_editor.index:
                                                return Setting_editor.left(gvc, viewModel, createID, gBundle);
                                            case Page_editor.index:
                                                return Page_editor.left(gvc, viewModel, createID, gBundle);
                                            default:
                                                return Main_editor.left(gvc, viewModel, createID, gBundle);
                                        }
                                    },
                                    divCreate: {}
                                };
                            })}
                            </div>
                            <div class="swiper-scrollbar end-0"></div>
                        </div>
</div>`, gvc.bindView({
                                bind: 'MainEditorRight',
                                view: () => {
                                    return Main_editor.right(gvc, viewModel, createID, gBundle);
                                },
                                divCreate: {}
                            }));
                        }
                        catch (e) {
                            console.log(e);
                            return ``;
                        }
                    }
                },
                divCreate: {},
                onCreate: () => {
                    $("#jumpToNav").scroll(function () {
                        glitter.setCookie("jumpToNavScroll", $(`#jumpToNav`).scrollTop());
                    });
                }
            });
        },
        onCreate: () => {
        },
    };
});
