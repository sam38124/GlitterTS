import {GVC} from "../glitterBundle/GVController.js";
import {ApiPageConfig} from "../api/pageConfig.js";
import {EditorElem} from "../glitterBundle/plugins/editor-elem.js";
import {ShareDialog} from "../dialog/ShareDialog.js";
import {config} from "../config.js";
import {BaseApi} from "../api/base.js";
import {HtmlGenerate} from "../glitterBundle/module/Html_generate.js";

const html = String.raw

class Add_item_dia {
    public static view(gvc: GVC) {
        let searchText = ''
        let searchInterval: any = 0
        const id = gvc.glitter.getUUID()
        const vm: {
            select: 'view' | 'code' | 'ai',
        } = {
            select: "view"
        }
        return `<div class="add_item_search_bar">
                            <i class="fa-regular fa-magnifying-glass"></i>
                            <input class="" placeholder="搜尋區段" oninput="${gvc.event((e, event) => {
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
                        default:
                            break
                    }

                    return html`
                        <div class="d-flex">
                            <div style="width:380px;" class="border-end">
                                <div class="d-flex border-bottom ">
                                    ${[{
                                        key: 'view',
                                        label: "頁面模塊"
                                    }, {
                                        key: 'code',
                                        label: "程式碼"
                                    }, {
                                        key: 'ai',
                                        label: "AI生成"
                                    }].map((dd: { key: string, label: string }) => {
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
                                            class: `overflow-auto`, style: `max-height:500px;`
                                        }
                                    }
                                })}
                            </div>
                            <div style="width:400px;" class="d-none">
                                ${gvc.bindView(() => {
                                    return {
                                        bind: contentVM.rightID,
                                        view: () => {
                                            return contentVM.rightBar
                                        }
                                    }
                                })}
                            </div>
                        </div>`
                },
                divCreate: {},
                onCreate: () => {

                }
            }
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
                    // if (data.response.data.lambdaView) {
                    //     viewModel.pluginList = viewModel.pluginList.concat(data.response.data.lambdaView.map((dd: any) => {
                    //         return {
                    //             "src": {
                    //                 "official": dd.path
                    //             },
                    //             "name": dd.name
                    //         }
                    //     }))
                    // }
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
                                            <div class="editor_item  mx-0 " style="color:black;"
                                                 onclick="${gvc.event(() => {
                                                     dd.toggle = !dd.toggle
                                                     gvc.notifyDataChange([tabID, docID]);
                                                 })}">
                                                    ．${dd.name}
                                                <div class="flex-fill"></div>

                                                <i class="fa-solid  ${(dd.toggle || search) ? `fa-angle-down` : `fa-angle-right`} d-flex align-items-center justify-content-center me-2"></i>
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
                                                                    <div class="editor_item text_unselect"
                                                                         onclick="${gvc.event(() => {
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
                        style: 'padding-bottom:50px;'
                    }
                }) + html`
                    <div class="btn-group dropend position-absolute w-100 px-2 bg-white" style="height:34px;bottom:10px;">
                        <button type="button" class="btn btn-outline-secondary-c rounded" data-bs-toggle="dropdown"
                                aria-haspopup="true" aria-expanded="false">
                            添加自訂模塊
                        </button>
                        <div class="dropdown-menu mx-1" style="max-height:400px;overflow-y:auto;">
                            ${gvc.bindView(() => {
                                const id = glitter.getUUID()
                                return {
                                    bind: id,
                                    view: () => {
                                        return html`
                                            <div class="alert alert-warning"
                                                 style="white-space: normal;word-break: break-all;">
                                                頁面模塊決定您能夠在網站上使用哪些設計模塊。<br>您可以從官方或第三方資源中獲取連結，或自行開發插件上傳以供使用。
                                            </div>
                                            ${EditorElem.arrayItem({
                                                originalArray: viewModel.pluginList,
                                                gvc: gvc,
                                                title: '頁面模塊',
                                                array: viewModel.pluginList.map((dd: any, index: number) => {
                                                    return {
                                                        title: `<span style="color: black;">${dd.name || `區塊:${index}`}</span>`,
                                                        innerHtml: (() => {
                                                            return ` ${HtmlGenerate.editeInput({
                                                                gvc,
                                                                title: '自定義插件名稱',
                                                                default: dd.name,
                                                                placeHolder: '自定義插件名稱',
                                                                callback: (text) => {
                                                                    dd.name = text;
                                                                    gvc.notifyDataChange(id)
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
                                                            })}`
                                                        }),
                                                        expand: dd,
                                                        minus: gvc.event(() => {
                                                            viewModel.pluginList.splice(index, 1);
                                                            gvc.notifyDataChange(id);
                                                        })
                                                    }
                                                }),
                                                expand: undefined,
                                                plus: {
                                                    title: '添加頁面模塊',
                                                    event: gvc.event(() => {
                                                        viewModel.pluginList.push({
                                                            name: '',
                                                            route: '',
                                                            src: {
                                                                official: '',
                                                                open: true
                                                            }
                                                        });
                                                        gvc.notifyDataChange(id);
                                                    }),
                                                },
                                                refreshComponent: () => {
                                                    gvc.notifyDataChange(id);
                                                },
                                                plusBtn: (title, event) => {
                                                    return html`
                                                        <div class="w-100 d-flex align-items-center mt-3"
                                                             style="gap:10px;">
                                                            <div
                                                                    class="fw-500 text-dark align-items-center justify-content-center d-flex  rounded  hoverBtn "
                                                                    style="border: 1px solid #151515;color:#151515;flex:1;height:34px;width:calc(50% - 10px);"
                                                                    onclick="${event}"
                                                            >
                                                                ${title}
                                                            </div>
                                                            <div class=" btn btn-primary-c "
                                                                 style="height:34px;flex:1;width:calc(50% - 10px);"
                                                                 onclick="${
                                                                         gvc.event(() => {
                                                                             glitter.htmlGenerate.saveEvent()
                                                                         })
                                                                 }">儲存
                                                            </div>

                                                        </div>
                                                    `
                                                }
                                            })}`
                                    },
                                    divCreate: {
                                        class: `px-2`
                                    }
                                }
                            })}

                        </div>
                    </div>`,
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
                        const obg = gvc.glitter.share.htmlExtension[gvc.glitter.htmlGenerate.resourceHook(viewModel.selectSource!)];
                        if (!obg) {
                            return ``
                        }

                        return gvc.map(Object.keys(gvc.glitter.share.htmlExtension[gvc.glitter.htmlGenerate.resourceHook(viewModel.selectSource!)]).filter((dd) => {
                            return dd !== 'document';
                        }).map((dd) => {
                            return html`
                                <div class="col-6 p-2">
                                    <div class="card card-hover ">
                                        <div class="card-body">
                                            <h5 class="card-title">${tryReturn(() => {
                                                return obg[dd].title;
                                            }, dd)}</h5>
                                            <p class="card-text fs-sm" style="white-space: normal;word-break: break-word;overflow-x: hidden;text-overflow: ellipsis;
   display: -webkit-box;
   -webkit-line-clamp: 2; /* number of lines to show */
           line-clamp: 2; 
   -webkit-box-orient: vertical;
">${
                                                    tryReturn(() => {
                                                        return obg[dd].subContent;
                                                    }, '')
                                            }</p>
                                            <a onclick="${gvc.event(() => {
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
                                                    'js': viewModel.selectSource
                                                });
                                                glitter.closeDiaLog()
                                            })}" class="btn btn-sm btn-primary w-100">插入</a>
                                        </div>
                                    </div>
                                </div>

                            `;
                        }));
                    },
                    divCreate: {
                        class: `row w-100 p-0 m-0`
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
                <div class="p-2">
                    <div class="my-2">
                        <h3 class="fw-500 p-0 my-1" style="font-size:15px;">勾選欲複製項目</h3>
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
                                divCreate: {class: `d-flex flex-wrap my-1`, style: 'gap:10px;cursor:pointer;'}
                            };
                        })}
                    </div>
                    <div class="my-2"></div>
                    ${glitter.htmlGenerate.editeInput({
                        gvc: gvc,
                        title: `資源相對路徑`,
                        default: relativePath,
                        placeHolder: `請輸入資源相對路徑-[為空則以當前網址作為相對路徑]`,
                        callback: (text) => {
                            relativePath = text;
                        }
                    })}
                    ${glitter.htmlGenerate.editeText({
                        gvc: gvc,
                        title: '複製的代碼內容',
                        default: code,
                        placeHolder: `請輸入HTML代碼`,
                        callback: (text) => {
                            code = text;
                        }
                    })}
                </div>
                <div class="d-flex p-2 align-content-end justify-content-end" style="font-weight:400;font-size:15px;">
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
                glitter.openDiaLog('dialog/ai-progress.js', 'ai-progress', {})
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
                }).then((re) => {
                    glitter.closeDiaLog('ai-progress')
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
                left: `      <lottie-player src="lottie/ai.json"    class="mx-auto my-n4" speed="1"   style="max-width: 100%;width: 250px;"  loop  autoplay></lottie-player>
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

    public static add_style(gvc: GVC) {
        return gvc.bindView(() => {
            const id = gvc.glitter.getUUID()
            return {
                bind: id,
                view: () => {
                    return html`<a class="dropdown-item" style="cursor:pointer;" onclick="${gvc.event(() => {
                        gvc.glitter.share.addComponent({
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
                        });
                    })}">添加設計代碼</a>
                    <a class="dropdown-item" style="cursor:pointer;" onclick="${gvc.event(() => {
                        gvc.glitter.share.addComponent({
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
                        });
                    })}">添加資源連結</a>`
                }
            }
        })
    }

    public static add_script(gvc: GVC) {
        return gvc.bindView(() => {
            const id = gvc.glitter.getUUID()
            return {
                bind: id,
                view: () => {
                    return html`
                        <a class="dropdown-item" style="cursor:pointer;" onclick="${gvc.event(() => {
                            gvc.glitter.share.addComponent({
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
                            });
                        })}">添加SCRIPT代碼</a>
                        <a class="dropdown-item" style="cursor:pointer;" onclick="${gvc.event(() => {
                            gvc.glitter.share.addComponent({
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
                            });
                        })}">添加SCRIPT資源</a>
                        <a class="dropdown-item" style="cursor:pointer;" onclick="${gvc.event(() => {
                            gvc.glitter.share.addComponent({
                                "id": gvc.glitter.getUUID(),
                                "data": {"triggerTime": "first", "clickEvent": {}},
                                "type": "code",
                                "label": "代碼區塊",
                                "js": "$style1/official.js",
                                "index": 2,
                                "css": {"style": {}, "class": {}},
                                "refreshAllParameter": {},
                                "refreshComponentParameter": {}
                            });
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