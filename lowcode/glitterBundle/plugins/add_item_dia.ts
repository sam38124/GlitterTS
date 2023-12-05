import {GVC} from "../GVController.js";
import {EditorElem} from "./editor-elem.js";
import {ShareDialog} from "../../dialog/ShareDialog.js";
//@ts-ignore
import {config} from "../../config.js";
//@ts-ignore
import {BaseApi} from "../api/base.js";
import {HtmlGenerate} from "../module/Html_generate.js";
//@ts-ignore
import autosize from "./autosize.js";
import {component_group_key} from "./group_key.js";

const html = String.raw

class Add_item_dia {
    public static view(gvc: GVC) {
        let searchText = ''
        let searchInterval: any = 0
        const id = gvc.glitter.getUUID()
        const vm: {
            select: 'view' | 'code' | 'ai' | 'template' | 'copy'
        } = {
            select: "template"
        }
        return html`
            <div class="bg-white rounded" style="max-height:90vh;">
                <div class="d-flex w-100 border-bottom align-items-center" style="height:50px;">
                    <h3 style="font-size:15px;font-weight:500;" class="m-0 ps-3">
                        新增頁面區段</h3>
                    <div class="flex-fill"></div>
                    <div class="hoverBtn p-2 me-2" style="color:black;font-size:20px;"
                         onclick="${gvc.event(() => {
                             gvc.closeDialog()
                         })}"
                    ><i class="fa-sharp fa-regular fa-circle-xmark"></i>
                    </div>
                </div>
                <div class="d-flex " style="">
                    <div>
                        ${`<div class="add_item_search_bar w-100">
<i class="fa-regular fa-magnifying-glass"></i>
<input class="w-100" placeholder="搜尋區段" oninput="${gvc.event((e, event) => {
                            searchText = e.value;
                            clearInterval(searchInterval);
                            searchInterval = setTimeout(() => {
                                if (searchText) {
                                    vm.select = 'view'
                                }
                                gvc.notifyDataChange(id);
                            }, 500)
                        })}" value="${searchText}">
                        </div>` + gvc.bindView(() => {
                            return {
                                bind: id,
                                view: () => {

                                    const contentVM: {
                                        loading: boolean,
                                        leftID: string,
                                        rightID: string,
                                        leftBar: string,
                                        rightBar: string
                                    } = {
                                        loading: true,
                                        leftID: gvc.glitter.getUUID(),
                                        rightID: gvc.glitter.getUUID(),
                                        leftBar: '',
                                        rightBar: ''
                                    }

                                    switch (vm.select) {
                                        case "template":
                                            Add_item_dia.add_official_plugin(gvc, searchText).then((data) => {
                                                contentVM.loading = false
                                                contentVM.leftBar = data.left
                                                contentVM.rightBar = data.right
                                                gvc.notifyDataChange([contentVM.leftID, contentVM.rightID])
                                            })
                                            break
                                        case "view":
                                            Add_item_dia.add_unit_component(gvc, searchText).then((data) => {
                                                contentVM.loading = false
                                                contentVM.leftBar = data.left
                                                contentVM.rightBar = data.right
                                                gvc.notifyDataChange([contentVM.leftID, contentVM.rightID])
                                            })
                                            break
                                        case "code":
                                            Add_item_dia.add_code_component(gvc).then((data) => {
                                                contentVM.loading = false
                                                contentVM.leftBar = data.left
                                                contentVM.rightBar = data.right
                                                gvc.notifyDataChange([contentVM.leftID, contentVM.rightID])
                                            })
                                            break
                                        case "ai":
                                            Add_item_dia.add_ai_micro_phone(gvc).then((data) => {
                                                contentVM.loading = false
                                                contentVM.leftBar = data.left
                                                contentVM.rightBar = data.right
                                                gvc.notifyDataChange([contentVM.leftID, contentVM.rightID])
                                            })
                                            break
                                        case 'copy':
                                            Add_item_dia.past_data(gvc).then((data) => {
                                                contentVM.loading = false
                                                contentVM.leftBar = data.left
                                                contentVM.rightBar = data.right
                                                gvc.notifyDataChange([contentVM.leftID, contentVM.rightID])
                                            })
                                            break
                                        default:
                                            break
                                    }

                                    return html`
                                        <div class="d-flex">
                                            <div style="width:450px;" class="border-end">
                                                <div class="d-flex border-bottom ">
                                                    ${[
                                                        {
                                                            key: 'template',
                                                            label: "官方模塊"
                                                        }
                                                        , {
                                                            key: 'view',
                                                            label: "客製插件"
                                                        }, {
                                                            key: 'code',
                                                            label: "代碼轉換"
                                                        }, {
                                                            key: 'ai',
                                                            label: "AI生成"
                                                        },
                                                        {
                                                            key: 'copy',
                                                            label: "剪貼簿"
                                                        }
                                                    ].map((dd: { key: string, label: string }) => {
                                                        return `<div class="add_item_button ${(dd.key === vm.select) ? `add_item_button_active` : ``}" onclick="${
                                                                gvc.event((e, event) => {
                                                                    (vm as any).select = dd.key
                                                                    gvc.notifyDataChange(id)
                                                                })
                                                        }">${dd.label}</div>`
                                                    }).join('')}
                                                </div>
                                                ${gvc.bindView(() => {
                                                    return {
                                                        bind: contentVM.leftID,
                                                        view: () => {
                                                            return contentVM.leftBar
                                                        },
                                                        divCreate: {
                                                            class: ``,
                                                            style: `max-height:calc(90vh - 150px);min-height:490px;overflow-y:auto;`
                                                        }
                                                    }
                                                })}
                                            </div>
                                            ${gvc.bindView(() => {
                                                return {
                                                    bind: contentVM.rightID,
                                                    view: () => {
                                                        return contentVM.rightBar
                                                    },
                                                    divCreate: {}
                                                }
                                            })}
                                        </div>`
                                },
                                divCreate: {
                                    style: `overflow-y:auto;`
                                },
                                onCreate: () => {

                                }
                            }
                        })}
                    </div>
                </div>
            </div>
        `
    }

    public static add_official_plugin(gvc: GVC, search: string) {

        return new Promise<{ left: string, right: string }>(async (resolve, reject) => {

            const glitter = gvc.glitter;
            const docID = gvc.glitter.getUUID()
            const tabID = gvc.glitter.getUUID()
            let viewModel: {
                loading: boolean,
                selectSource?: string,
                addEvent?: () => void,
                pluginList: any
            } = {
                loading: true,
                pluginList: []
            };

            function getSource(dd: any) {

                return dd.src.official;
            }

            viewModel.pluginList = [];
            viewModel.pluginList.push({
                "src": {
                    "official": new URL('../../official_view_component/official.js', import.meta.url).href
                },
                "name": "開發元件"
            })
            const data = await BaseApi.create({
                "url": `https://liondesign.tw/api/v1/app/official/plugin`,
                "type": "GET",
                "timeout": 0,
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization": config.token
                }
            });
            (data.response.data ?? []).map((dd: any) => {
                if (component_group_key[dd.key]) {
                    viewModel.pluginList.push({
                        "src": {
                            "official": dd.url
                        },
                        "name": component_group_key[dd.key].title
                    })
                }
            })

            function loading() {
                // viewModel.loading = true
                viewModel.loading = false;
                if (viewModel.pluginList.length > 0) {
                    viewModel.pluginList.map((dd: any) => {
                        dd.toggle = true
                    })
                }
                glitter.addMtScript(viewModel.pluginList.map((dd: any) => {
                    return {
                        src: glitter.htmlGenerate.resourceHook(getSource(dd)),
                        type: 'module'
                    }
                }), () => {
                    console.log('notify-tab')
                    gvc.notifyDataChange(tabID)

                }, () => {
                });
            }

            function tryReturn(fun: () => string, defaults: string): string {
                try {
                    return fun();
                } catch (e) {
                    return defaults;
                }
            }


            loading()
            resolve({
                left: gvc.bindView({
                    bind: tabID,
                    view: () => {
                        try {
                            let hi = false
                            const it = gvc.map(viewModel.pluginList.map((dd: any, index: number) => {
                                try {
                                    const source = getSource(dd)
                                    const obg = gvc.glitter.share.htmlExtension[gvc.glitter.htmlGenerate.resourceHook(getSource(dd))];
                                    if (!obg) {
                                        setTimeout(() => {
                                            gvc.notifyDataChange(tabID)
                                        }, 1000)
                                        return ``
                                    }
                                    const haveItem = Object.keys(obg).filter((d2) => {
                                        return d2 !== 'document';
                                    }).find((dd) => {
                                        return obg[dd].title.indexOf(search) !== -1
                                    })
                                    if (haveItem || (!search)) {
                                        hi = true
                                    }
                                    return html`
                                        <div class="w-100 px-2 ${(search && !haveItem) ? `d-none` : ``}">
                                            <div class="mx-0 d-flex mx-n2  px-2 hi fw-bold d-flex align-items-center border-bottom border-top py-2 bgf6"
                                                 style="color:#151515;font-size:16px;gap:0px;"
                                                 onclick="${gvc.event(() => {
                                                     dd.toggle = !dd.toggle
                                                     gvc.notifyDataChange([tabID, docID]);
                                                 })}">
                                                    ．${dd.name}
                                                <div class="flex-fill"></div>

                                                <i class="fa-solid  ${(dd.toggle || search) ? `fa-angle-down` : `fa-angle-right`} d-flex align-items-center justify-content-center me-2"
                                                   style="cursor:pointer;"></i>
                                            </div>
                                            ${(() => {
                                                const id = gvc.glitter.getUUID()
                                                return gvc.bindView({
                                                    bind: id,
                                                    view: () => {
                                                        if (search) {
                                                            return gvc.map(Object.keys(obg).filter((d2) => {
                                                                return d2 !== 'document' && d2 !== 'code';
                                                            }).map((dd) => {
                                                                if (obg[dd].title.indexOf(search) !== -1) {
                                                                    return html`
                                                                        <div class="editor_item text_unselect"
                                                                             onclick="${gvc.event(() => {
                                                                                 viewModel.selectSource = obg[dd];
                                                                                 viewModel.addEvent = () => {
                                                                                     const ob = JSON.parse(JSON.stringify(obg))
                                                                                     glitter.share.addComponent({
                                                                                         'id': glitter.getUUID(),
                                                                                         'data': ob[dd].defaultData ?? {},
                                                                                         'style': ob[dd].style,
                                                                                         'class': ob[dd].class,
                                                                                         'type': dd,
                                                                                         'label': tryReturn(() => {
                                                                                             return ob[dd].title;
                                                                                         }, dd),
                                                                                         'js': source
                                                                                     })
                                                                                     glitter.closeDiaLog()
                                                                                 }
                                                                                 gvc.notifyDataChange([tabID, docID])
                                                                             })}">
                                                                            ${obg[dd].title}
                                                                        </div>`;
                                                                } else {
                                                                    return html``;
                                                                }
                                                            }))
                                                        } else {
                                                            return gvc.map(Object.keys(obg).filter((d2) => {
                                                                return d2 !== 'document' && d2 !== 'code';
                                                            }).map((dd) => {
                                                                if (!viewModel.selectSource) {
                                                                    viewModel.selectSource = obg[dd]
                                                                    viewModel.addEvent = () => {
                                                                        const ob = JSON.parse(JSON.stringify(obg))
                                                                        glitter.share.addComponent({
                                                                            'id': glitter.getUUID(),
                                                                            'data': ob[dd].defaultData ?? {},
                                                                            'style': ob[dd].style,
                                                                            'class': ob[dd].class,
                                                                            'type': dd,
                                                                            'label': tryReturn(() => {
                                                                                return ob[dd].title;
                                                                            }, dd),
                                                                            'js': source
                                                                        })
                                                                        glitter.closeDiaLog()
                                                                    }
                                                                    gvc.notifyDataChange(docID)
                                                                }
                                                                return html`
                                                                    <div class="editor_item  ${(viewModel.selectSource === obg[dd]) ? `active` : `text_unselect`}"
                                                                         onclick="${gvc.event(() => {
                                                                             viewModel.selectSource = obg[dd];
                                                                             viewModel.addEvent = () => {
                                                                                 const ob = JSON.parse(JSON.stringify(obg))
                                                                                 glitter.share.addComponent({
                                                                                     'id': glitter.getUUID(),
                                                                                     'data': ob[dd].defaultData ?? {},
                                                                                     'style': ob[dd].style,
                                                                                     'class': ob[dd].class,
                                                                                     'type': dd,
                                                                                     'label': tryReturn(() => {
                                                                                         return ob[dd].title;
                                                                                     }, dd),
                                                                                     'js': source
                                                                                 })
                                                                                 glitter.closeDiaLog()
                                                                             }
                                                                             gvc.notifyDataChange([tabID, docID])
                                                                         })}">
                                                                        ${obg[dd].title}
                                                                    </div>`;
                                                            }))
                                                        }


                                                    },
                                                    divCreate: {
                                                        class: `pe-2 ${(!dd.toggle && !search) ? `d-none` : ``}`
                                                    }
                                                })
                                            })()}
                                        </div>
                                    `;
                                } catch (e) {
                                    return ``
                                }
                            }))
                            if (hi) {
                                return it
                            } else {
                                return `<span class="font-14 m-auto p-2 w-100 d-flex align-items-center justify-content-center fw-500">很抱歉，查無相關模塊.</span>`
                            }
                        } catch (e) {
                            console.log(e)
                            setTimeout(() => {
                                gvc.notifyDataChange(tabID)
                            }, 500)
                            return `<span class="font-14 m-auto p-2 w-100 d-flex align-items-center justify-content-center fw-500">loading...</span>`
                        }
                    },
                    divCreate: {
                        style: 'overflow-y:auto;'
                    }
                }),
                right: gvc.bindView({
                    bind: docID,
                    view: () => {
                        function tryReturn(fun: () => string, defaults: string): string {
                            try {
                                return fun();
                            } catch (e) {
                                return defaults;
                            }
                        }

                        if (!viewModel.selectSource) {
                            return ``
                        }

                        function isValidHTML(str: any) {
                            const htmlRegex = /<[a-z][\s\S]*>/i;
                            return htmlRegex.test(str);
                        }

                        return html`
                            <div class="d-flex mx-n2 mt-n2 px-2 hi fw-bold d-flex align-items-center border-bottom border-top py-2 bgf6"
                                 style="color:#151515;font-size:16px;gap:0px;height:48px;">
                                模塊描述
                            </div>
                            <div class="d-flex flex-column w-100" style="height:calc(100% - 48px);">
                                ${(() => {
                                    if (isValidHTML((viewModel.selectSource as any).subContent)) {
                                        return (viewModel.selectSource as any).subContent
                                    } else {
                                        return html`
                                            <div class="flex-fill"></div>
                                            <div class="alert alert-info p-2"
                                                 style="white-space: normal;word-break:break-all;">
                                                <strong>元件說明:</strong>
                                                ${(viewModel.selectSource as any).subContent}
                                            </div>
                                        `
                                    }
                                })()}
                                <div class="flex-fill"></div>
                                <div class="w-100 d-flex border-top align-items-center mb-n2 pt-2"
                                     style="height:50px;">
                                    <div class="flex-fill"></div>
                                    <button class="btn btn-primary-c" style="height: 40px;width: 100px;"
                                            onclick="${gvc.event(() => {
                                                viewModel.addEvent!()
                                            })}">
                                        <i class="fa-light fa-circle-plus me-2"></i>插入模塊
                                    </button>
                                </div>
                            </div>
                        `

                    },
                    divCreate: () => {
                        if (viewModel.selectSource) {
                            return {
                                class: ` h-100 p-2`, style: `width:450px;`
                            }
                        } else {
                            return {
                                class: `d-none`
                            }
                        }
                    },
                    onCreate: () => {
                    }
                })
            })
        })
    }

    public static add_unit_component(gvc: GVC, search: string) {
        return new Promise<{ left: string, right: string }>(async (resolve, reject) => {
            const glitter = gvc.glitter;
            const docID = gvc.glitter.getUUID()
            const tabID = gvc.glitter.getUUID()
            let viewModel: {
                loading: boolean,
                selectSource?: string,
                addEvent?: () => void,
                pluginList: any
            } = {
                loading: true,
                pluginList: []
            };

            function getSource(dd: any) {

                return dd.src.official;
            }

            function loading() {
                viewModel.loading = true

                const data = glitter.share.appConfigresponse
                if (data.result) {
                    viewModel.loading = false
                    viewModel.pluginList = data.response.data.pagePlugin;
                    // alert(JSON.stringify(data.response.data.lambdaView))
                    if (data.response.data.lambdaView) {
                        data.response.data.lambdaView.map((dd: any) => {
                            for (let i = viewModel.pluginList.length - 1; i >= 0; i--) {
                                if (viewModel.pluginList[i].src.official === dd.path) {
                                    viewModel.pluginList.splice(i, 1);
                                }
                            }
                            viewModel.pluginList.push({
                                "src": {
                                    "official": dd.path
                                },
                                "name": dd.name
                            })
                        })
                    }
                    if (viewModel.pluginList.length > 0) {
                        viewModel.pluginList[0].toggle = true
                    }
                    glitter.addMtScript(viewModel.pluginList.map((dd: any) => {
                        return {
                            src: glitter.htmlGenerate.resourceHook(getSource(dd)),
                            type: 'module'
                        }
                    }), () => {
                        console.log('notify-tab')
                        gvc.notifyDataChange(tabID)

                    }, () => {
                    });

                }
            }

            function tryReturn(fun: () => string, defaults: string): string {
                try {
                    return fun();
                } catch (e) {
                    return defaults;
                }
            }


            loading()
            resolve({
                left: gvc.bindView({
                    bind: tabID,
                    view: () => {
                        try {
                            let hi = false
                            const it = gvc.map(viewModel.pluginList.map((dd: any, index: number) => {
                                try {
                                    const source = getSource(dd)
                                    const obg = gvc.glitter.share.htmlExtension[gvc.glitter.htmlGenerate.resourceHook(getSource(dd))];
                                    if (!obg) {
                                        setTimeout(() => {
                                            gvc.notifyDataChange(tabID)
                                        }, 1000)
                                        return ``
                                    }
                                    const haveItem = Object.keys(obg).filter((d2) => {
                                        return d2 !== 'document';
                                    }).find((dd) => {
                                        return obg[dd].title.indexOf(search) !== -1
                                    })
                                    if (haveItem || (!search)) {
                                        hi = true
                                    }
                                    return html`
                                        <div class="w-100 px-2 ${(search && !haveItem) ? `d-none` : ``}">
                                            <div class="mx-0 d-flex mx-n2  px-2 hi fw-bold d-flex align-items-center border-bottom border-top py-2 bgf6"
                                                 style="color:black;"
                                                 onclick="${gvc.event(() => {
                                                     dd.toggle = !dd.toggle
                                                     gvc.notifyDataChange([tabID, docID]);
                                                 })}">
                                                    ．${dd.name}
                                                <div class="flex-fill"></div>

                                                <i class="fa-solid  ${(dd.toggle || search) ? `fa-angle-down` : `fa-angle-right`} d-flex align-items-center justify-content-center me-2"
                                                   style="cursor:pointer;"></i>
                                            </div>
                                            ${(() => {
                                                const id = gvc.glitter.getUUID()
                                                return gvc.bindView({
                                                    bind: id,
                                                    view: () => {
                                                        if (search) {
                                                            return gvc.map(Object.keys(obg).filter((d2) => {
                                                                return d2 !== 'document';
                                                            }).map((dd) => {
                                                                if (obg[dd].title.indexOf(search) !== -1) {
                                                                    return html`
                                                                        <div class="editor_item text_unselect"
                                                                             onclick="${gvc.event(() => {
                                                                                 viewModel.selectSource = obg[dd];
                                                                                 viewModel.addEvent = () => {
                                                                                     const ob = JSON.parse(JSON.stringify(obg))
                                                                                     glitter.share.addComponent({
                                                                                         'id': glitter.getUUID(),
                                                                                         'data': ob[dd].defaultData ?? {},
                                                                                         'style': ob[dd].style,
                                                                                         'class': ob[dd].class,
                                                                                         'type': dd,
                                                                                         'label': tryReturn(() => {
                                                                                             return ob[dd].title;
                                                                                         }, dd),
                                                                                         'js': source
                                                                                     })
                                                                                     glitter.closeDiaLog()
                                                                                 }
                                                                                 gvc.notifyDataChange([tabID, docID])
                                                                             })}">
                                                                            ${obg[dd].title}
                                                                        </div>`;
                                                                } else {
                                                                    return html``;
                                                                }
                                                            }))
                                                        } else {
                                                            return gvc.map(Object.keys(obg).filter((d2) => {
                                                                return d2 !== 'document';
                                                            }).map((dd) => {
                                                                return html`
                                                                    <div class="editor_item  ${(viewModel.selectSource === obg[dd]) ? `active` : `text_unselect`}"
                                                                         onclick="${gvc.event(() => {
                                                                             viewModel.selectSource = obg[dd];
                                                                             viewModel.addEvent = () => {
                                                                                 const ob = JSON.parse(JSON.stringify(obg))
                                                                                 glitter.share.addComponent({
                                                                                     'id': glitter.getUUID(),
                                                                                     'data': ob[dd].defaultData ?? {},
                                                                                     'style': ob[dd].style,
                                                                                     'class': ob[dd].class,
                                                                                     'type': dd,
                                                                                     'label': tryReturn(() => {
                                                                                         return ob[dd].title;
                                                                                     }, dd),
                                                                                     'js': source
                                                                                 })
                                                                                 glitter.closeDiaLog()
                                                                             }
                                                                             gvc.notifyDataChange([tabID, docID])
                                                                         })}">
                                                                        ${obg[dd].title}
                                                                    </div>`;
                                                            }))
                                                        }


                                                    },
                                                    divCreate: {
                                                        class: `pe-2 ${(!dd.toggle && !search) ? `d-none` : ``}`
                                                    }
                                                })
                                            })()}
                                        </div>
                                    `;
                                } catch (e) {
                                    return ``
                                }
                            }))
                            if (hi) {
                                return it
                            } else {
                                return `<span class="font-14 m-auto p-2 w-100 d-flex align-items-center justify-content-center fw-500">很抱歉，查無相關模塊.</span>`
                            }
                        } catch (e) {
                            console.log(e)
                            setTimeout(() => {
                                gvc.notifyDataChange(tabID)
                            }, 500)
                            return `<span class="font-14 m-auto p-2 w-100 d-flex align-items-center justify-content-center fw-500">loading...</span>`
                        }
                    },
                    divCreate: {
                        style: 'overflow-y:auto;'
                    }
                }),
                right: gvc.bindView({
                    bind: docID,
                    view: () => {
                        function tryReturn(fun: () => string, defaults: string): string {
                            try {
                                return fun();
                            } catch (e) {
                                return defaults;
                            }
                        }

                        if (!viewModel.selectSource) {
                            return ``
                        }

                        function isValidHTML(str: any) {
                            const htmlRegex = /<[a-z][\s\S]*>/i;
                            return htmlRegex.test(str);
                        }

                        return html`
                            <div class="d-flex mx-n2 mt-n2 px-2 hi fw-bold d-flex align-items-center border-bottom border-top py-2 bgf6"
                                 style="color:#151515;font-size:16px;gap:0px;height:48px;">
                                模塊描述
                            </div>
                            <div class="d-flex flex-column w-100" style="height:calc(100% - 48px);">
                                ${(() => {
                                    if (isValidHTML((viewModel.selectSource as any).subContent)) {
                                        return (viewModel.selectSource as any).subContent
                                    } else {
                                        return html`
                                            <div class="flex-fill"></div>
                                            <div class="alert alert-info p-2"
                                                 style="white-space: normal;word-break:break-all;">
                                                <strong>元件說明:</strong>
                                                ${(viewModel.selectSource as any).subContent}
                                            </div>
                                            <div class="flex-fill"></div>
                                            <div class="w-100 d-flex border-top align-items-center mb-n2 pt-2"
                                                 style="height:50px;">
                                                <div class="flex-fill"></div>
                                                <button class="btn btn-primary-c" style="height: 40px;width: 100px;"
                                                        onclick="${gvc.event(() => {
                                                            viewModel.addEvent!()
                                                        })}">
                                                    <i class="fa-light fa-circle-plus me-2"></i>插入模塊
                                                </button>
                                            </div>
                                        `
                                    }
                                })()}
                            </div>
                        `

                    },
                    divCreate: () => {
                        if (viewModel.selectSource) {
                            return {
                                class: ` h-100 p-2`, style: `width:400px;`
                            }
                        } else {
                            return {
                                class: `d-none`
                            }
                        }
                    },
                    onCreate: () => {
                    }
                })
            })
        })

    }

    public static add_code_component(gvc: GVC) {
        return new Promise<{ left: string, right: string }>((resolve, reject) => {
            const glitter = gvc.glitter;
            let code = '';
            let relativePath = '';
            let copyElem = [
                {
                    elem: 'all',
                    title: '全部',
                    check: true
                },
                {
                    elem: 'html',
                    title: 'Html標籤',
                    check: false
                }, {
                    elem: 'style',
                    title: 'Style',
                    check: false
                }, {
                    elem: 'script',
                    title: 'Script',
                    check: false
                }
            ];
            resolve({
                left: html`<!-- Your code -->
                <div class="px-2 pb-2">
                    <div class="d-flex mx-n2  px-2 hi fw-bold d-flex align-items-center border-bottom border-top py-2 bgf6"
                         style="color:#151515;font-size:16px;gap:0px;">
                        勾選欲複製項目
                    </div>
                    <div class="my-2 mx-2">

                        ${gvc.bindView(() => {
                            const id = glitter.getUUID();
                            return {
                                bind: id,
                                view: () => {
                                    return copyElem.map((dd) => {
                                        return `<div class="d-flex align-items-center" style="gap:5px;cursor:pointer;" onclick="${gvc.event(() => {
                                            if ((dd.elem === 'all')) {
                                                copyElem.map((dd) => {
                                                    dd.check = false;
                                                });
                                            }
                                            copyElem.find((dd) => {
                                                return dd.elem === 'all';
                                            })!.check = false;
                                            if (copyElem.filter((dd) => {
                                                return dd.check;
                                            }).length > 1) {
                                                dd.check = !dd.check;
                                            } else {
                                                dd.check = true;
                                            }
                                            gvc.notifyDataChange(id);
                                        })}">
  <i class="${(dd.check) ? `fa-solid fa-square-check` : `fa-regular fa-square`}" style="font-size:15px;${(dd.check) ? `color:rgb(41, 94, 209);` : ``}"></i>
  <span class="form-check-label " style="font-size:15px;color:#6e6e6e;font-weight: 400!important;" >${dd.title}</span>
</div>`;
                                    }).join('');
                                },
                                divCreate: {class: `d-flex flex-wrap my-1 mt-1`, style: 'gap:10px;cursor:pointer;'}
                            };
                        })}
                    </div>
                    <div class="my-2"></div>
                    <div class="d-flex  px-2 mx-n2 hi fw-bold d-flex align-items-center border-bottom border-top py-2 bgf6"
                         style="color:#151515;font-size:16px;gap:0px;">
                        資源相對路徑
                    </div>
                    ${glitter.htmlGenerate.editeInput({
                        gvc: gvc,
                        title: ``,
                        default: relativePath,
                        placeHolder: `請輸入資源相對路徑-[為空則以當前網址作為相對路徑]`,
                        callback: (text) => {
                            relativePath = text;
                        }
                    })}
                    <div class="d-flex  px-2 mx-n2 hi fw-bold d-flex align-items-center border-bottom border-top py-2 bgf6"
                         style="color:#151515;font-size:16px;gap:0px;">
                        複製的代碼內容
                    </div>
                    <div class="my-2"></div>
                    ${EditorElem.customCodeEditor({
                        gvc: gvc,
                        title: '',
                        height:370,
                        initial:code,
                        language: 'html',
                        callback: (text) => {
                            console.log(`change--`,text)
                            code = text;
                        }
                    })}
                </div>
                <div class="d-flex p-2 align-content-end justify-content-end " style="font-weight:400;font-size:15px;">
                    <button class="btn btn-primary-c w-100" onclick="${gvc.event(() => {
                        const html = document.createElement('body');
                        html.innerHTML = code;
                        saveHTML(traverseHTML(html), relativePath, gvc, copyElem);
                    })}"><i class="fa-regular fa-arrows-retweet me-2"></i>轉換代碼
                    </button>
                </div>`,
                right: ``
            });
        })

    }

    public static add_ai_micro_phone(gvc: GVC) {
        return new Promise<{ left: string, right: string }>((resolve, reject) => {
            const textID = gvc.glitter.getUUID()
            const glitter = gvc.glitter
            let configText = ''
            gvc.addMtScript([
                {src: `https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js`}
            ], () => {
            }, () => {
            })

            function trigger() {
                const dialog = new ShareDialog(glitter)
                if (!configText) {
                    dialog.errorMessage({text: "請輸入描述語句"})
                    return
                }
                dialog.dataLoading({text:"AI運算中",visible:true})
                BaseApi.create({
                    "url": config.url + `/api/v1/ai/generate-html`,
                    "type": "POST",
                    "headers": {
                        "Content-Type": "application/json",
                        "Authorization": config.token
                    },
                    data: JSON.stringify({
                        "search": configText
                    })
                }).then((re:any) => {
                    dialog.dataLoading({visible:false})
                    if (re.result) {
                        const html = document.createElement('body');
                        console.log(`responseData:` + re.response.data)
                        html.innerHTML = re.response.data;
                        saveHTML(traverseHTML(html), '', gvc);
                    } else {
                        dialog.errorMessage({text: "轉換失敗，請輸入其他文案"})
                    }
                })
            }

            resolve({
                left: `      <lottie-player src="lottie/ai.json"    class="mx-auto my-n4" speed="1"   style="max-width: 100%;width: 250px;height:300px;"  loop  autoplay></lottie-player>
 ${gvc.bindView(() => {
                    return {
                        bind: textID,
                        view: () => {
                            return glitter.htmlGenerate.editeText({
                                gvc: gvc,
                                title: '',
                                default: configText ?? "",
                                placeHolder: `輸入或說出AI生成語句\n譬如:
        -產生一個h1，字體顏色為紅色，大小為30px．
        -產生一個商品內文．
        -使用bootstrap生成一個商品展示頁面．
        `,
                                callback: (text: string) => {
                                    configText = text
                                }
                            })
                        },
                        divCreate: {class: `w-100 px-2`}
                    }
                })}
  ${gvc.bindView(() => {
                    let linsten = false;
                    const id = glitter.getUUID()
                    // @ts-ignore
                    const recognition = new webkitSpeechRecognition();
                    recognition.lang = 'zh-tw';
                    recognition.continuous = true;
                    recognition.interimResults = false;
                    recognition.onresult = function (event: any) {
                        configText = Object.keys(event.results).map((dd) => {
                            return event.results[dd][0].transcript
                        }).join('')
                        gvc.notifyDataChange(textID)
                    };
                    return {
                        bind: id,
                        view: () => {
                            return html`
                                ${(linsten) ? `
                                  <button class="btn btn-danger flex-fill" style="flex:1;"
                                        onclick="${gvc.event(() => {
                                    linsten = false
                                    recognition.stop();
                                    gvc.notifyDataChange(id)
                                })}">
                                        <i class="fa-solid fa-stop me-2" style="font-size:20px;"></i>停止
                                </button>
                                ` : `  <button class="btn btn-outline-secondary-c flex-fill" style="flex:1;"
                                        onclick="${gvc.event(() => {
                                    linsten = true
                                    recognition.start();
                                    gvc.notifyDataChange(id)
                                })}">
                                    <i class="fa-light fa-microphone me-2" style="font-size:20px;"></i>語音輸入
                                </button>`}

                                <button class="btn btn-primary-c flex-fill" style="flex:1;" onclick="${gvc.event(() => {
                                    trigger()
                                })}">
                                    <i class="fa-light fa-microchip-ai me-2" style="font-size:20px;"></i>開始AI生成
                                </button>`
                        },
                        divCreate: {
                            class: `p-2 w-100 d-flex`, style: `gap:10px;`
                        }
                    }
                })}
`,
                right: ``
            })
        })
    }

    public static past_data(gvc: GVC) {
        return new Promise<{ left: string, right: string }>((resolve, reject) => {
            let copyCount=1
            const textID = gvc.glitter.getUUID()
            const glitter = gvc.glitter
            let configText = ''
            gvc.addMtScript([
                {src: `https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js`}
            ], () => {
            }, () => {
            })

            function trigger() {
                const dialog = new ShareDialog(glitter)
                if (!configText) {
                    dialog.errorMessage({text: "請貼上模塊內容"})
                    return
                }
                glitter.share.copycomponent = configText;
                for(let c=0;c<copyCount;c++){
                    glitter.share.pastEvent()
                }
                gvc.closeDialog()
            }

            resolve({
                left: `     
             
 ${gvc.bindView(() => {
                    return {
                        bind: textID,
                        view: () => {
                            const id = gvc.glitter.getUUID()
                            return `<div class=" alert alert-info mt-2 p-2" style="white-space: normal;word-break:break-all;">
將複製於剪貼簿的元件貼上於下方區塊，確認後來產生元件．
</div>
` +EditorElem.editeInput({
                                gvc:gvc,
                                title:"複製數量",
                                default:`${copyCount}`,
                                placeHolder:"複製數量",
                                callback:(text)=>{
                                    copyCount=parseInt(text,10)
                                },
                                type:'number'
                            })+ `<div class="my-2"></div>`+gvc.bindView({
                                bind: id,
                                view: () => {
                                    return configText ?? ""
                                },
                                divCreate: {
                                    elem: `textArea`,
                                    style: `max-height:330px!important;min-height:330px;`,
                                    class: `form-control`, option: [
                                        {key: 'placeholder', value: "請將剪貼簿的內容貼上。"},
                                        {
                                            key: 'onchange', value: gvc.event((e) => {
                                                configText = e.value
                                            })
                                        }
                                    ]
                                },
                                onCreate: () => {
                                    //@ts-ignore
                                    autosize(obj.gvc.getBindViewElem(id))
                                }
                            }) + `<button class="btn btn-primary-c flex-fill mt-2 w-100" style="flex:1;" onclick="${gvc.event(() => {
                                trigger()
                            })}">
                                 確認並複製
                                </button>`
                        },
                        divCreate: {class: `w-100 px-2 `}
                    }
                })}
`,
                right: ``
            })
        })
    }

    public static add_content_folder(gvc: GVC, callback?: (data: any) => void
    ) {
        return gvc.bindView(() => {
            const id = gvc.glitter.getUUID()
            return {
                bind: id,
                view: () => {
                    return html`<a class="dropdown-item" style="cursor:pointer;" onclick="${gvc.event(() => {
                        const data = {
                            id:gvc.glitter.getUUID(),
                            label:"分類名稱",
                            data:{
                                setting:[]
                            },
                            type:'container'
                        }
                        if (callback) {
                            callback(data)
                        } else {
                            gvc.glitter.share.addComponent(data);
                        }

                    })}">添加分類</a>
                    <a class="dropdown-item" style="cursor:pointer;" onclick="${gvc.event(() => {
                        const data = {
                            id:gvc.glitter.getUUID(),
                            label:"標籤名稱",
                            data:{
                                value:"",
                                tagType:'language'
                            },
                            type:'text',
                        }
                        if (callback) {
                            callback(data)
                        } else {
                            gvc.glitter.share.addComponent(data);
                        }
                    })}">添加資源</a>`
                }
            }
        })
    }
    public static add_style(gvc: GVC, callback?: (data: any) => void
    ) {
        return gvc.bindView(() => {
            const id = gvc.glitter.getUUID()
            return {
                bind: id,
                view: () => {
                    return html`<a class="dropdown-item" style="cursor:pointer;" onclick="${gvc.event(() => {
                        const data = {
                            'id': gvc.glitter.getUUID(),
                            "data": {
                                "attr": [],
                                "elem": "style",
                                "inner": "/***請輸入設計代碼***/",
                                "dataFrom": "static",
                                "atrExpand": {
                                    "expand": true
                                },
                                "elemExpand": {
                                    "expand": true
                                },
                                "innerEvenet": {}
                            },
                            'type': 'widget',
                            'label': 'STYLE代碼',
                            'js': '$style1/official.js'
                        }
                        if (callback) {
                            callback(data)
                        } else {
                            gvc.glitter.share.addComponent(data);
                        }

                    })}">添加設計代碼</a>
                    <a class="dropdown-item" style="cursor:pointer;" onclick="${gvc.event(() => {
                        const data = {
                            "id": gvc.glitter.getUUID(),
                            "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                            "css": {"class": {}, "style": {}},
                            "data": {
                                "class": "",
                                "style": "",
                                "attr": [{
                                    "attr": "href",
                                    "type": "par",
                                    "value": "",
                                    "expand": false
                                }, {"attr": "rel", "type": "par", "value": "stylesheet", "expand": false}],
                                "elem": "link",
                                "inner": "",
                                "dataFrom": "static",
                                "atrExpand": {"expand": true},
                                "elemExpand": {"expand": true},
                                "innerEvenet": {},
                                "setting": [],
                                "note": ""
                            },
                            "type": "widget",
                            "label": "STYLE資源",
                            "styleList": [],
                            "refreshAllParameter": {},
                            "refreshComponentParameter": {}
                        }
                        if (callback) {
                            callback(data)
                        } else {
                            gvc.glitter.share.addComponent(data);
                        }
                    })}">添加資源連結</a>`
                }
            }
        })
    }

    public static add_script(gvc: GVC, callback?: (data: any) => void) {
        return gvc.bindView(() => {
            const id = gvc.glitter.getUUID()
            return {
                bind: id,
                view: () => {
                    return html`
                        <a class="dropdown-item d-none" style="cursor:pointer;" onclick="${gvc.event(() => {
                            const data = {
                                "id": gvc.glitter.getUUID(),
                                "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                "data": {
                                    "elem": "script",
                                    "inner": "/***請輸入Script代碼***/",
                                    "setting": [],
                                    "dataFrom": "static",
                                    "innerEvenet": {}
                                },
                                "type": "widget",
                                "label": "SCRIPT代碼"
                            }
                            if (callback) {
                                callback(data)
                            } else {
                                gvc.glitter.share.addComponent(data);
                            }
                        })}">添加SCRIPT代碼</a>
                        <a class="dropdown-item" style="cursor:pointer;" onclick="${gvc.event(() => {
                            const data ={
                                "id": gvc.glitter.getUUID(),
                                "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                "data": {
                                    "attr": [{
                                        "attr": "src",
                                        "type": "par",
                                        "value": "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js",
                                        "expand": false
                                    }, {
                                        "attr": "crossorigin",
                                        "type": "par",
                                        "value": "anonymous",
                                        "expand": false
                                    }],
                                    "elem": "script",
                                    "note": "",
                                    "setting": [],
                                    "dataFrom": "static",
                                    "atrExpand": {"expand": true},
                                    "elemExpand": {"expand": true}
                                },
                                "type": "widget",
                                "label": "SCRIPT資源",
                                "styleList": []
                            }
                            if (callback) {
                                callback(data)
                            } else {
                                gvc.glitter.share.addComponent(data);
                            }
                        })}">添加SCRIPT資源</a>
                        <a class="dropdown-item" style="cursor:pointer;" onclick="${gvc.event(() => {
                            const data ={
                                "id": gvc.glitter.getUUID(),
                                "data": {"triggerTime": "first", "clickEvent": {}},
                                "type": "code",
                                "label": "代碼區塊",
                                "js": "$style1/official.js",
                                "index": 2,
                                "css": {"style": {}, "class": {}},
                                "refreshAllParameter": {},
                                "refreshComponentParameter": {}
                            }
                            if (callback) {
                                callback(data)
                            } else {
                                gvc.glitter.share.addComponent(data);
                            }
                        })}">添加觸發事件</a>
                    `
                }
            }
        })
    }
}

// 遞迴函式，用於遍歷 HTML 內容
function traverseHTML(element: any) {
    var result: any = {};

    // 取得元素的標籤名稱
    result.tag = element.tagName;
    // 取得元素的屬性
    var attributes = element.attributes ?? [];
    if (attributes.length > 0) {
        result.attributes = {};
        for (let i = 0; i < attributes.length; i++) {
            result.attributes[attributes[i].name] = attributes[i].value;
        }
    }
    if (element.children && element.children.length > 0) {
        result.children = []
        var childNodes = element.childNodes;
        for (let i = 0; i < childNodes.length; i++) {
            var node = childNodes[i];
            if (node.nodeType === Node.ELEMENT_NODE) {
                result.children.push(traverseHTML(node));
            } else if (node.nodeType === Node.TEXT_NODE) {
                const html = document.createElement('span');
                html.innerHTML = node.textContent.trim();
                if (html.innerHTML) {
                    result.children.push(traverseHTML(html));
                }

            } else {
                if (node.tagName) {
                    result.children.push(traverseHTML(node));
                }

            }
        }
    }


    // let trimmedStr = element.innerHTML.replace(/\n/,'').replace(/^\s+|\s+$/g, "");
    // let trimmedStr2 = element.innerText.replace(/\n/,'').replace(/^\s+|\s+$/g, "");
    // result.textIndex=trimmedStr.indexOf(trimmedStr2)
    result.innerText = (element.innerText ?? "").replace(/\n/, '').replace(/^\s+|\s+$/g, "")
    // 返回 JSON 結果
    return result;
}


async function saveHTML(json: any, relativePath: string, gvc: GVC, elem?: {
    elem: string,
    title: string,
    check: boolean
}[]) {
    const dialog = new ShareDialog(gvc.glitter)
    dialog.dataLoading({visible: true, text: "解析資源中"})
    const glitter = gvc.glitter
    let addSheet = elem?.find((dd) => {
        return (dd.elem === 'all' && dd.check) || (dd.elem === 'style' && dd.check)
    }) || (elem === undefined)
    let addHtml = elem?.find((dd) => {
        return (dd.elem === 'all' && dd.check) || (dd.elem === 'html' && dd.check)
    }) || (elem === undefined)
    let addScript = elem?.find((dd) => {
        return (dd.elem === 'all' && dd.check) || (dd.elem === 'script' && dd.check)
    }) || (elem === undefined)
    const styleSheet: any = {
        "id": glitter.getUUID(),
        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
        "css": {"class": {}, "style": {}},
        "data": {
            "elem": "glitterStyle",
            "dataFrom": "static",
            "atrExpand": {"expand": false},
            "elemExpand": {"expand": true},
            "innerEvenet": {},
            "setting": []
        },
        "type": "container",
        "label": "所有設計樣式",
    }
    const jsLink: any = {
        "id": glitter.getUUID(),
        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
        "css": {"class": {}, "style": {}},
        "data": {
            "elem": "glitterJS",
            "dataFrom": "static",
            "atrExpand": {"expand": false},
            "elemExpand": {"expand": true},
            "innerEvenet": {},
            "setting": []
        },
        "type": "container",
        "label": "所有JS資源",
    }

    async function covertHtml(json: any, pushArray: any[]) {
        for (const dd of json.children ?? []) {
            if ((dd.tag.toLowerCase() !== 'title')) {
                dd.attributes = dd.attributes ?? {}
                let originalHref = '';
                let originalSrc = '';
                try {
                    originalHref = new URL(dd.attributes.href, relativePath).href
                } catch (e) {

                }
                try {
                    originalSrc = new URL(dd.attributes.src, relativePath).href
                } catch (e) {

                }
                const obj = await convert(dd)
                if (obj.data.elem !== 'meta' && !(((obj.data.elem === 'link') && (dd.attributes.rel !== 'stylesheet')))) {
                    if (obj.data.elem === 'style' || ((obj.data.elem === 'link') && (dd.attributes.rel === 'stylesheet'))) {
                        if ((obj.data.elem === 'link' && (dd.attributes.rel === 'stylesheet'))) {
                            obj.data.note = "源代碼路徑:" + originalHref
                        }
                        if (addSheet) {
                            styleSheet.data.setting.push(obj)
                        }
                    } else if (obj.data.elem === 'script') {
                        if (addScript) {
                            obj.data.note = "源代碼路徑:" + originalSrc
                            jsLink.data.setting.push(obj)
                        }
                    } else if (obj.data.elem === 'image') {
                        obj.data.note = "源代碼路徑:" + originalSrc
                    } else {
                        if (addHtml) {
                            pushArray.push(obj)
                        }
                    }
                }
            }
        }
    }

    async function convert(obj: any) {
        obj.children = obj.children ?? []
        obj.attributes = obj.attributes ?? {}
        let originalHref = obj.attributes.href
        let originalSrc = obj.attributes.src
        obj.innerText = obj.innerText ?? ""
        const a = await new Promise((resolve, reject) => {
            try {
                if (obj.tag.toLowerCase() === 'link' && obj.attributes.rel === 'stylesheet' && addSheet) {
                    const src = obj.attributes.href
                    const url = new URL(src, relativePath)
                    originalHref = url.href
                    getFile(url.href).then((link) => {
                        obj.attributes.href = link
                        resolve(true)
                    })
                } else if (obj.tag.toLowerCase() === 'script' && obj.attributes.src && addScript) {
                    const src = obj.attributes.src
                    const url = new URL(src, relativePath)
                    originalSrc = url
                    getFile(url.href).then((link) => {
                        obj.attributes.src = link
                        resolve(true)
                    })
                } else if (obj.tag.toLowerCase() === 'img' && obj.attributes.src && addHtml) {
                    const src = obj.attributes.src
                    const url = new URL(src, relativePath)
                    getFile(url.href).then((link) => {
                        obj.attributes.src = link
                        resolve(true)
                    })
                } else {
                    resolve(true)
                }
            } catch (e) {
                resolve(true)
            }

        })
        let setting: any = []
        // if (obj.textIndex === 0 && (obj.innerText.replace(/ /g, '').replace(/\n/g, '').length > 0 && ((obj.children ?? []).length > 0))) {
        //     setting.push(await convert({
        //         tag: 'span',
        //         innerText: obj.innerText
        //     }))
        // }
        // if (obj.children.length > 0) {
        //     obj.innerText = ''
        // }
        await covertHtml(obj, setting);
        // if (obj.textIndex > 0 && (obj.innerText.replace(/ /g, '').replace(/\n/g, '').length > 0 && ((obj.children ?? []).length > 0))) {
        //     setting.push(await convert({
        //         tag: 'span',
        //         innerText: obj.innerText
        //     }))
        // }
        let x = {
            "id": glitter.getUUID(),
            "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
            "css": {"class": {}, "style": {}},
            "data": {
                "class": obj.attributes.class ?? "",
                "style": (obj.attributes.style ?? ""),
                "attr": Object.keys(obj.attributes).filter((key) => {
                    return key !== 'class' && key !== 'style'
                }).map((dd) => {
                    const of = obj.attributes[dd]
                    return {
                        "attr": dd,
                        "type": "par",
                        "value": of,
                        "expand": false,
                    }
                }),
                "elem": obj.tag.toLowerCase(),
                "inner": obj.innerText ?? "",
                "dataFrom": "static",
                "atrExpand": {"expand": true},
                "elemExpand": {"expand": true},
                "innerEvenet": {},
                "setting": setting
            },
            "type": (obj.children && obj.children.length > 0) ? "container" : "widget",
            "label": (() => {
                if (obj.tag.toLowerCase() === 'link' && (obj.attributes.rel === 'stylesheet')) {
                    return `style資源`
                }
                const source = ['script', 'style'].indexOf(obj.tag.toLowerCase())
                if (source >= 0) {
                    return ['script資源', 'style資源'][source]
                }
                let lab = obj.innerText ?? ((obj.type === 'container') ? `HTML容器` : `HTML元件`)
                lab = lab.trim().replace(/&nbsp;/g, '')
                if (lab.length > 10) {
                    return lab.substring(0, 10)
                } else {
                    if (lab.length === 0) {
                        return ((obj.type === 'container') ? `HTML容器` : `HTML元件`)
                    } else {
                        return lab
                    }
                }
            })(),
            "styleList": []
        }
        if (x.data.style.length > 0) {
            x.data.style += ";"
        }
        if (x.data.elem === 'img') {
            x.data.inner = (x.data.attr.find((dd) => {
                return dd.attr === 'src'
            }) ?? {value: ""}).value
            x.data.attr = x.data.attr.filter((dd) => {
                return dd.attr !== 'src'
            })
        }
        if ((x.data.elem === 'html') || (x.data.elem === 'head')) {
            x.data.elem = 'div'
        }
        return new Promise<any>((resolve, reject) => {
            resolve(x)
        })
    }

    let waitPush: any = []

    await covertHtml(json, waitPush)
    if (styleSheet.data.setting.length > 0) {
        styleSheet.data.setting.map((dd: any) => {
            glitter.share.addComponent(dd);
        })
    }
    if (jsLink.data.setting.length > 0) {
        jsLink.data.setting.map((dd: any) => {
            glitter.share.addComponent(dd);
        })
    }
    waitPush.map((obj: any) => {
        glitter.share.addComponent(obj)
    })

    setTimeout((() => {
        dialog.dataLoading({visible: false})
        glitter.closeDiaLog()
    }), 1000)

}

function getFile(href: string) {
    const glitter = (window as any).glitter
    return new Promise<string>((resolve, reject) => {
        $.ajax({
            url: config.url + "/api/v1/fileManager/getCrossResource",
            type: 'post',
            data: JSON.stringify({
                "url": href
            }),
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token
            },
            crossDomain: true,
            processData: false,
            success: (data2) => {
                resolve(data2.url)
            },
            error: (err) => {
                resolve(href)
            }
        });
    })

}

export default Add_item_dia