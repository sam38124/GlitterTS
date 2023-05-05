import {init} from '../glitterBundle/GVController.js';
import {Editor} from './editor.js';
import {ApiPageConfig} from '../api/pageConfig.js';
import {Swal} from '../modules/sweetAlert.js';
import {Lan} from './language.js';
import {HtmlGenerate} from '../glitterBundle/module/Html_generate.js';
import {config} from "../config.js";
import {ShareDialog} from "../dialog/ShareDialog.js";
import {Main_editor} from "./main_editor.js";
import {Page_editor} from "./page_editor.js";
import {Setting_editor} from "./setting_editor.js";

init((gvc, glitter, gBundle) => {
    gvc.addStyle(`
    .swal2-title {
    color:black!important;
    }
    `);
    const viewModel: {
        dataList: any
        data: any
        loading: boolean,
        selectItem: any,
        initialJS: { name: string, src: { official: string, open: boolean }, route: string }[],
        pluginList: { name: string, src: { staging: string, official: string, open: boolean }, route: string }[],
        initialStyle: { name: string, src: { src: string }, route: string }[],
        initialStyleSheet: { name: string, src: { src: string }, route: string }[],
        initialCode: any,
        initialList: any,
        homePage: string,
        selectContainer: any,
        backendPlugins:any,
        selectIndex: any
    } = {
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
        backendPlugins:[],
        homePage: '',
        selectContainer: undefined,
        selectIndex: undefined
    };
    const swal = new Swal(gvc);
    const doc = new Editor(gvc, viewModel);
    const createID = glitter.getUUID();

    async function lod() {
        swal.loading('加載中...');
        const waitGetData = [
            (async () => {
                return await new Promise(async (resolve) => {
                    const data = await ApiPageConfig.getPage(gBundle.appName)
                    if (data.result) {
                        data.response.result.map((dd: any) => {
                            dd.page_config = dd.page_config ?? {}
                            if (glitter.getUrlParameter('page') == undefined) {
                                glitter.setUrlParameter('page', dd.tag)
                            }
                            if (dd.tag === glitter.getUrlParameter('page')) {
                                viewModel.data = dd;
                            }
                            return dd;
                        });

                        viewModel.data = viewModel.data ?? data.response.result[0];
                        viewModel.dataList = data.response.result;
                        if (!data) {
                            resolve(false);
                        } else {
                            resolve(true);
                        }
                    }
                })
            }),
            (async () => {
                return await new Promise(async (resolve) => {
                    const data = await ApiPageConfig.getPlugin(gBundle.appName)
                    if (data.result) {
                        viewModel.initialList = data.response.data.initialList;
                        viewModel.initialJS = data.response.data.eventPlugin;
                        viewModel.pluginList = data.response.data.pagePlugin;
                        viewModel.initialStyleSheet = data.response.data.initialStyleSheet;
                        viewModel.initialStyle = data.response.data.initialStyle;
                        viewModel.initialCode = data.response.data.initialCode ?? "";
                        viewModel.homePage = data.response.data.homePage ?? ""
                        viewModel.backendPlugins= data.response.data.backendPlugins ?? []
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
                                })
                            }
                            resolve(true);
                        }

                        await load()

                    } else {
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

        glitter.setCookie("jumpToNavScroll", $(`#jumpToNav`).scrollTop())
        swal.loading('更新中...');

        async function saveEvent() {
            const waitSave = [
                (async () => {
                    let haveID: string[] = [];

                    function getID(set: any) {
                        set.map((dd: any) => {
                            if (haveID.indexOf(dd.id) !== -1) {
                                dd.id = glitter.getUUID();
                            }
                            haveID.push(dd.id);
                            if (dd.type === 'container') {
                                dd.data.setting = dd.data.setting ?? [];
                                getID(dd.data.setting);
                            }
                        });
                    }

                    getID((viewModel.data as any).config);
                    return new Promise(async resolve => {
                        const api = await ApiPageConfig.setPage({
                            id: viewModel.data.id,
                            appName: gBundle.appName,
                            tag: (viewModel.data as any).tag,
                            name: (viewModel.data as any).name,
                            config: (viewModel.data as any).config,
                            group: (viewModel.data as any).group,
                            page_config: viewModel.data.page_config
                        })
                        resolve(api.result)
                    });
                }),
                (async () => {
                    return new Promise(async resolve => {
                        const api = await ApiPageConfig.setPlugin(gBundle.appName, {
                            pagePlugin: viewModel.pluginList,
                            eventPlugin: viewModel.initialJS,
                            initialStyle: viewModel.initialStyle,
                            initialStyleSheet: viewModel.initialStyleSheet,
                            backendPlugins:viewModel.backendPlugins,
                            initialCode: viewModel.initialCode,
                            homePage: viewModel.homePage,
                            initialList: viewModel.initialList
                        })
                        resolve(api.result)
                    });

                })
            ];
            for (const a of waitSave) {
                if (!await a()) {
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
    lod()
    document.addEventListener("paste", function (event) {
        // 获取粘贴的内容
        var clipboardData = event.clipboardData || (window as any).clipboardData;
        var pastedData = clipboardData.getData('text/plain');

        // 在控制台输出粘贴的内容
        if (pastedData === 'glitter-copyEvent') {
            var copy = JSON.parse(JSON.stringify(viewModel.selectItem))

            function checkId(dd: any) {
                copy.id = glitter.getUUID()
                if (dd.type === 'container') {
                    dd.setting.map((d2: any) => {
                        checkId(d2)
                    })
                }
            }

            checkId(copy)
            glitter.setCookie('lastSelect', copy.id);
            viewModel.selectContainer.splice(viewModel.selectIndex + 1, 0, copy)
            gvc.notifyDataChange(createID)
        }
    });

    return {
        onCreateView: () => {
            return gvc.bindView({
                bind: createID,
                view: () => {
                    let selectPosition = glitter.getUrlParameter('editorPosition') ?? "0"
                    if (viewModel.loading) {
                        return ``;
                    } else {
                        try {
                            return doc.create(`<div class="d-flex vh-100" >
<div style="width:60px;gap:20px;padding-top: 15px;" class="h-100 border-end d-flex flex-column align-items-center " >
${[{src: `fa-table-layout`, index: Main_editor.index}, {
                                    src: `fa-sharp fa-regular fa-file-dashed-line`,
                                    index: Page_editor.index
                                }, {src: `fa-solid fa-list-check`, index: Setting_editor.index},
                                    {src: `fa-regular fa-folders`,index: '3'}].map((da: any, index: number) => {
                                    return `<i class="fa-regular ${da.src} fs-4 fw-bold ${(selectPosition === `${da.index}`) ? `text-primary` : ``}  p-2 rounded" style="cursor:pointer;${(selectPosition === `${da.index}`) ? `background-color: rgba(10,83,190,0.1);` : ``}"
onclick="${gvc.event(() => {
    viewModel.selectItem=undefined
                                        glitter.setUrlParameter(`editorPosition`, `${da.index}`)
                                        gvc.notifyDataChange(createID)
                                    })}"></i>`
                                }).join('')}
</div>
<div class="offcanvas-body swiper scrollbar-hover overflow-hidden w-100 ${(() => {
                                    switch (selectPosition) {
                                        case Setting_editor.index:
                                        case Main_editor.index:
                                            return `p-4`
                                        case Page_editor.index:
                                            return `p-0`
                                        default:
                                            return `p-0`
                                    }
                                })()}">
                            <div class="swiper-wrapper">
                                ${(() => {
                                    switch (selectPosition) {
                                        case Setting_editor.index:
                                            return Setting_editor.left(gvc, viewModel, createID, gBundle)
                                        case Page_editor.index:
                                            return Page_editor.left(gvc, viewModel, createID, gBundle)
                                        default:
                                            return Main_editor.left(gvc, viewModel, createID, gBundle)
                                    }
                                })()}
                            </div>
                            <div class="swiper-scrollbar end-0"></div>
                        </div>
</div>`,
                                Main_editor.right(gvc, viewModel, createID, gBundle)
                            );
                        } catch (e) {
                            console.log(e)
                            return ``
                        }

                    }
                },
                divCreate: {},
                onCreate: () => {
                    $("#jumpToNav").scroll(function () {
                        glitter.setCookie("jumpToNavScroll", $(`#jumpToNav`).scrollTop())
                    });
                }
            });
        },
        onCreate: () => {

        },
    };
});


