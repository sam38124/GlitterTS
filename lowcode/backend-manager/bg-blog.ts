import {GVC} from "../glitterBundle/GVController.js";
import {EditorElem} from "../glitterBundle/plugins/editor-elem.js";
import {BgWidget} from "./bg-widget.js";
import {ApiUser} from "../glitter-base/route/user.js";
import {ShareDialog} from "../dialog/ShareDialog.js";
import {ApiPageConfig} from "../api/pageConfig.js";
import {config} from "../config.js";
import {Article} from "../glitter-base/route/article.js";
import {BgShopping} from "./bg-shopping.js";
import {Glitter} from "../glitterBundle/Glitter.js";

export class BgBlog {
    public static contentManager(gvc: GVC, type: 'select' | 'list' = 'list', callback: (list: any[]) => void = () => {
    }) {
        const html = String.raw
        const glitter = gvc.glitter
        const vm: {
            type: "list" | "add" | "replace" | 'select',
            data: any,
            dataList: any,
            query?: string
        } = {
            type: "list",
            data: {},
            dataList: undefined,
            query: ''
        }
        const filterID = gvc.glitter.getUUID()
        let vmi: any = undefined

        function getDatalist() {
            return vm.dataList.map((dd: any) => {
                return [
                    {
                        key: EditorElem.checkBoxOnly({
                            gvc: gvc,
                            def: (!vm.dataList.find((dd: any) => {
                                return !dd.checked
                            })),
                            callback: (result) => {
                                vm.dataList.map((dd: any) => {
                                    dd.checked = result
                                })
                                vmi.data = getDatalist()
                                vmi.callback()
                                gvc.notifyDataChange(filterID)
                                callback(vm.dataList.filter((dd: any) => {
                                    return dd.checked
                                }))
                            }
                        }),
                        value: EditorElem.checkBoxOnly({
                            gvc: gvc,
                            def: dd.checked,
                            callback: (result) => {
                                dd.checked = result
                                vmi.data = getDatalist()
                                vmi.callback()
                                gvc.notifyDataChange(filterID)
                                callback(vm.dataList.filter((dd: any) => {
                                    return dd.checked
                                }))

                            },
                            style: "height:25px;"
                        })
                    },
                    {
                        key: '網誌連結',
                        value: `<span class="fs-7">${(dd.content.tag)}</span>`
                    },
                    {
                        key: '網誌標題',
                        value: `<span class="fs-7">${(dd.content.name ?? "尚未設定標題").substring(0, 15)}</span>`
                    },
                    {
                        key: '發布時間',
                        value: `<span class="fs-7">${glitter.ut.dateFormat(new Date(dd.created_time), 'yyyy-MM-dd')}</span>`
                    },
                    {
                        key: '預覽',
                        value: `
                        <div class="d-flex align-items-center justify-content-center hoverBtn me-2 border" style="height:28px;width:28px;border-radius:5px;cursor:pointer;color:#151515;"
                        onclick="${gvc.event((e, event) => {
                            const url = new URL("", (glitter.share.editorViewModel.domain) ? `https://${glitter.share.editorViewModel.domain}/?page=index` : location.href)
                            url.searchParams.delete('type')
                            url.searchParams.set("page", dd.tag)
                            glitter.openNewTab(url.href)
                            event.stopPropagation()
                        })}">
                                    <i class="fa-regular fa-eye" aria-hidden="true"></i>
                                </div>
                        `
                    }
                ]
            })
        }

        return gvc.bindView(() => {
            const id = glitter.getUUID()
            return {
                bind: id,
                dataList: [{obj: vm, key: 'type'}],
                view: () => {
                    if (vm.type === 'list') {
                        return BgWidget.container(html`
                            <div class="d-flex w-100 align-items-center mb-3 ${(type === 'select') ? `d-none` : ``}">
                                ${BgWidget.title('內容管理')}
                                <div class="flex-fill"></div>
                                <button class="btn btn-primary-c me-2 px-3"
                                        style="height:35px !important;font-size: 14px;color:white;border:1px solid black;"
                                        onclick="${
                                                gvc.event(() => {
                                                    gvc.glitter.innerDialog((gvc) => {
                                                        return addArticle(gvc, (data) => {
                                                            Article.get({
                                                                page: vmi.page - 1,
                                                                limit: 20,
                                                                tag: data
                                                            }).then((data) => {
                                                                vm.data = data.response.data[0]
                                                                vm.type = 'add'
                                                            })
                                                            gvc.closeDialog()
                                                        })
                                                    }, 'addPage')
                                                })
                                        }">
                                    <i class="fa-solid fa-plus me-2"></i>
                                    新增網誌
                                </button>
                            </div>
                            ${BgWidget.table({
                                gvc: gvc,
                                getData: (vd) => {
                                    vmi = vd
                                    Article.get({
                                        page: vmi.page - 1,
                                        limit: 20,
                                        search: vm.query || undefined
                                    }).then((data) => {
                                        vmi.pageSize = Math.ceil(data.response.total / 20)
                                        vm.dataList = data.response.data
                                        vmi.data = getDatalist()
                                        vmi.loading = false
                                        vmi.callback()
                                    })
                                },
                                rowClick: (data, index) => {
                                    if (type === 'select') {
                                        vm.dataList[index].checked = !vm.dataList[index].checked
                                        vmi.data = getDatalist()
                                        vmi.callback()
                                        callback(vm.dataList.filter((dd: any) => {
                                            return dd.checked
                                        }))
                                    } else {
                                        vm.data = vm.dataList[index]
                                        vm.type = "replace"
                                    }

                                },
                                filter: html`
                                    ${BgWidget.searchPlace(gvc.event((e, event) => {
                                        vm.query = e.value
                                        gvc.notifyDataChange(id)
                                    }),vm.query || '','搜尋所有文章')}
                                    ${
                                            gvc.bindView(() => {
                                                return {
                                                    bind: filterID,
                                                    view: () => {

                                                        if (!vm.dataList || !vm.dataList.find((dd: any) => {
                                                            return dd.checked
                                                        }) || type === 'select') {
                                                            return ``
                                                        } else {
                                                            return [
                                                                `<span class="fs-7 fw-bold">操作選項</span>`,
                                                                `<button class="btn btn-danger fs-7 px-2" style="height:30px;border:none;" onclick="${gvc.event(() => {
                                                                    const dialog = new ShareDialog(gvc.glitter)
                                                                    dialog.checkYesOrNot({
                                                                        text: '是否確認移除所選項目?',
                                                                        callback: (response) => {
                                                                            if (response) {
                                                                                dialog.dataLoading({visible: true})
                                                                                Article.deleteV2({
                                                                                    id: vm.dataList.filter((dd: any) => {
                                                                                        return dd.checked
                                                                                    }).map((dd: any) => {
                                                                                        return dd.id
                                                                                    }).join(`,`)
                                                                                }).then((res) => {
                                                                                    dialog.dataLoading({visible: false})
                                                                                    if (res.result) {
                                                                                        vm.dataList = undefined
                                                                                        gvc.notifyDataChange(id)
                                                                                    } else {
                                                                                        dialog.errorMessage({text: "刪除失敗"})
                                                                                    }
                                                                                })
                                                                            }
                                                                        }
                                                                    })
                                                                })}">批量移除</button>`
                                                            ].join(``)
                                                        }

                                                    },
                                                    divCreate: () => {
                                                        return {
                                                            class: `d-flex mt-2 align-items-center p-2 py-3 ${(!vm.dataList || !vm.dataList.find((dd: any) => {
                                                                return dd.checked
                                                            }) || type === 'select') ? `d-none` : ``}`,
                                                            style: `height:40px;gap:10px;margin-top:10px;`
                                                        }
                                                    }
                                                }
                                            })
                                    }
                                `
                            })}
                        `)
                    } else if (vm.type == 'replace') {
                        return editor({
                            gvc: gvc,
                            vm: vm,

                        })
                    } else {
                        return editor({
                            gvc: gvc,
                            vm: vm
                        })
                    }

                }
            }
        })
    }
}

function editor(cf: {
    gvc: GVC,
    vm: any
}) {
    const glitter = cf.gvc.glitter;
    const dialog = new ShareDialog(glitter);
    const vm = cf.vm;
    const gvc = cf.gvc
    const html = String.raw;
    vm.data.content.seo = vm.data.content.seo ?? {};
    return BgWidget.container(html`
        <div class="d-flex w-100 align-items-center mb-3 ">
            ${BgWidget.goBack(gvc.event(() => {
                vm.type = "list"
            }))} ${BgWidget.title('編輯網誌')}
            <div class="flex-fill"></div>
            <button class="btn  me-2 btn-outline-secondary" style="height:35px;font-size: 14px;"
                    onclick="${gvc.event(() => {
                        
                        const href = (() => {
                            const url = new URL(
                                    '',
                                    (window.parent as any).glitter.share.editorViewModel.domain
                                            ? `https://${(window.parent as any).glitter.share.editorViewModel.domain}/`
                                            : (window.parent as any).location.href
                            );
                            url.search = '';
                            url.searchParams.set('page', vm.data.content.template);
                            url.searchParams.set('article', vm.data.content.tag);
                            if (!(window.parent as any).glitter.share.editorViewModel.domain) {
                                url.searchParams.set('appName', (window.parent as any).appName);
                            }
                            return url.href;
                        })();
                        (window.parent as any).glitter.openNewTab(href);
                    })}"><i class="fa-regular fa-eye me-2"></i>預覽網誌
            </button>
            <button class="btn btn-primary-c " style="height:35px;font-size: 14px;"
                    onclick="${gvc.event(() => {
                        console.log(vm.data)
                        dialog.dataLoading({visible: true})
                        Article.put(vm.data).then((res) => {
                            dialog.dataLoading({visible: false})
                            dialog.successMessage({
                                text: "儲存成功"
                            })
                        })
                    })}">儲存
            </button>
        </div>
        <div class="d-flex justify-content-between" style="gap:10px;">
            <div style="width: 852px;">
                ${BgWidget.card(gvc.bindView(() => {
                    const artViewID = gvc.glitter.getUUID()
                    return {
                        bind: artViewID,
                        view: () => {
                            return [
                                EditorElem.editeInput({
                                    gvc: gvc,
                                    title: '網誌名稱',
                                    default: vm.data.content.name,
                                    placeHolder: '請輸入網誌名稱',
                                    callback: (text) => {
                                        vm.data.content.name = text;
                                    }
                                }),
                                EditorElem.editeInput({
                                    gvc: gvc,
                                    title: '網誌標題',
                                    default: vm.data.content.title,
                                    placeHolder: '請輸入網誌標題',
                                    callback: (text) => {
                                        vm.data.content.title = text;
                                    }
                                }),
                                EditorElem.editeText({
                                    gvc: gvc,
                                    title: '網誌摘要',
                                    default: vm.data.content.description,
                                    placeHolder: '請輸入網誌摘要',
                                    callback: (text) => {
                                        vm.data.content.description = text;
                                    }
                                }),
                                (() => {
                                    return EditorElem.richText({
                                        gvc: gvc,
                                        def: vm.data.content.text ?? '',
                                        callback: (text) => {
                                            vm.data.content.text = text
                                        }
                                    })
                                })()
                            ].join(`<div class="my-2"></div>`)
                        },
                        divCreate: {}
                    }
                }))}
                <div class="my-2">
                    ${EditorElem.h3('SEO配置')}
                </div>
                ${BgWidget.card(
                        gvc.bindView(() => {
                            const id = gvc.glitter.getUUID();
                            let toggle = false;
                            return {
                                bind: id,
                                view: () => {
                                    try {
                                        let view = [
                                            html`
                                                <div
                                                        class="fs-sm fw-500 d-flex align-items-center justify-content-between mb-2"
                                                >
                                                    搜尋引擎列表
                                                    <div
                                                            class="fw-500 fs-sm "
                                                            style="cursor: pointer;color:rgba(0, 91, 211, 1);"
                                                            onclick="${gvc.event(() => {
                                                                toggle = !toggle;
                                                                gvc.notifyDataChange(id);
                                                            })}"
                                                    >
                                                        ${toggle ? `確認` : `編輯`}
                                                    </div>
                                                </div>`,
                                            html`
                                                <div class="fs-6 fw-500" style="color:#1a0dab;">
                                                    ${vm.data.content.seo.title || '尚未設定'}
                                                </div>`,
                                            (() => {
                                                const href = (() => {
                                                    const url = new URL(
                                                            '',
                                                            (window.parent as any).glitter.share.editorViewModel.domain
                                                                    ? `https://${(window.parent as any).glitter.share.editorViewModel.domain}/`
                                                                    : (window.parent as any).location.href
                                                    );
                                                    url.search = '';
                                                    url.searchParams.set('page', vm.data.content.template);
                                                    url.searchParams.set('article', vm.data.content.tag);
                                                    if (!(window.parent as any).glitter.share.editorViewModel.domain) {
                                                        url.searchParams.set('appName', (window.parent as any).appName);
                                                    }
                                                    return url.href;
                                                })();
                                                return html`<a
                                                        class="fs-sm fw-500"
                                                        style="color:#006621;cursor: pointer;"
                                                        href="${href}"
                                                >${href}</a
                                                >`;
                                            })(),
                                            html`
                                                <div
                                                        class="fs-sm fw-500"
                                                        style="color:#545454;white-space: normal;"
                                                >
                                                    ${vm.data.content.seo.content || '尚未設定'}
                                                </div>`,
                                        ];
                                        if (toggle) {
                                            view = view.concat([
                                                EditorElem.editeInput({
                                                    gvc: gvc,
                                                    title: '網誌標籤',
                                                    default: vm.data.content.tag,
                                                    placeHolder: `請輸入頁面標題`,
                                                    callback: (text) => {
                                                        vm.data.content.tag = text;
                                                    },
                                                }),
                                                EditorElem.editeInput({
                                                    gvc: gvc,
                                                    title: '頁面標題',
                                                    default: vm.data.content.seo.title,
                                                    placeHolder: `請輸入頁面標題`,
                                                    callback: (text) => {
                                                        vm.data.content.seo.title = text;
                                                    },
                                                }),
                                                EditorElem.editeText({
                                                    gvc: gvc,
                                                    title: '中繼描述',
                                                    default: vm.data.content.seo.content,
                                                    placeHolder: `請輸入中繼描述`,
                                                    callback: (text) => {
                                                        vm.data.content.seo.content = text;
                                                    },
                                                }),
                                            ]);
                                        }
                                        return view.join('');
                                    } catch (e) {
                                        console.log(e)
                                        return ``
                                    }

                                },
                            };
                        })
                )}
            </div>
            <div class="flex-fill">
                ${BgWidget.card(gvc.bindView(() => {
                    const id = gvc.glitter.getUUID()
                    return {
                        bind: id,
                        view: () => {
                            return [
                                EditorElem.pageSelect(gvc, '選擇佈景主題', vm.data.content.template ?? "", (data) => {
                                    vm.data.content.template = data
                                }, (dd) => {
                                    const filter_result = dd.group !== 'glitter-article' && dd.page_type === 'article' && dd.page_config.template_type==='blog'
                                    if (filter_result && !vm.data.content.template) {
                                        vm.data.content.template = dd.tag
                                        gvc.notifyDataChange(id)
                                    }
                                    return filter_result
                                }),
                                EditorElem.editeInput({
                                    gvc: gvc,
                                    title: '作者資訊',
                                    default: vm.data.content.author,
                                    placeHolder: '請輸入作者資訊',
                                    callback: (text) => {
                                        vm.data.content.author = text;
                                    }
                                }),
                                gvc.bindView(() => {
                                    const id = gvc.glitter.getUUID()
                                    return {
                                        bind: id,
                                        view: () => {
                                            vm.data.content.collection=vm.data.content.collection || [];
                                            return [EditorElem.h3(html`
                                                <div class="d-flex align-items-center" style="gap:10px;">預覽圖
                                                    <div class="d-flex align-items-center justify-content-center rounded-3"
                                                         style="height: 30px;width: 80px;
">
                                                        <button class="btn ms-2 btn-primary-c ms-2"
                                                                style="height: 30px;width: 80px;"
                                                                onclick="${gvc.event(() => {
                                                                    EditorElem.uploadFileFunction({
                                                                        gvc: gvc,
                                                                        callback: (text) => {
                                                                            vm.data.content.preview_image = text
                                                                            gvc.notifyDataChange(id)
                                                                        },
                                                                        type: `image/*, video/*`
                                                                    })
                                                                })}">添加檔案
                                                        </button>
                                                    </div>
                                                </div>`), EditorElem.flexMediaManager({
                                                gvc: gvc,
                                                data: vm.data.content.preview_image  ? [vm.data.content.preview_image]:[]
                                            }),
                                                EditorElem.select({
                                                    title: '是否支援網誌索引',
                                                    gvc: gvc,
                                                    def: vm.data.content.for_index ?? 'true',
                                                    array: [
                                                        {
                                                            title: '是', value: 'true',
                                                        },
                                                        {
                                                            title: '否', value: 'false',
                                                        }
                                                    ],
                                                    callback: (text) => {
                                                        vm.data.content.for_index = text
                                                    }
                                                }),
                                                `<div class="mx-n3 mt-4">${
                                                        EditorElem.arrayItem({
                                                            originalArray: vm.data.content.collection,
                                                            gvc: gvc,
                                                            title: '文章分類',
                                                            array: (() => {
                                                                return vm.data.content.collection.map((dd: any, index: number) => {
                                                                    return {
                                                                        title: `<span style="color:black;">${dd}</span>`,
                                                                        innerHtml: (gvc: GVC) => {
                                                                            return `<div class="w-100 mb-2">
${EditorElem.editeInput({
                                                                                gvc: gvc,
                                                                                title: "標籤名稱",
                                                                                default: `${dd}`,
                                                                                placeHolder: "請輸入標籤名稱",
                                                                                callback: (text) => {
                                                                                    vm.data.content.collection[index] = text
                                                                                    gvc.notifyDataChange(id)
                                                                                },
                                                                                type: 'text'
                                                                            })}
</div>`
                                                                        },
                                                                        expand: dd,
                                                                        minus: gvc.event(() => {
                                                                            vm.data.page_config.meta_article.tag.splice(index, 1);
                                                                            gvc.notifyDataChange(id);
                                                                        })
                                                                    }
                                                                })
                                                            }),
                                                            expand: {},
                                                            plus: {
                                                                title: '添加分類',
                                                                event: gvc.event(() => {
                                                                    vm.data.content.collection.push('')
                                                                    gvc.notifyDataChange(id);
                                                                }),
                                                            },
                                                            refreshComponent: () => {
                                                                gvc.notifyDataChange(id);
                                                            }
                                                        })
                                                }</div>`
                                            ].join(`<div class="my-2"></div>`)

                                        },
                                        divCreate: {}
                                    }
                                })
                            ].join('')
                        }
                    }
                }))}
            </div>
        </div>
    `, 1200)
    return BgWidget.container(`<div class="d-flex w-100 align-items-center mb-3 ">
                ${BgWidget.goBack(gvc.event(() => {
        vm.type = "list"
    }))} ${BgWidget.title(vm.data.page_config.meta_article.title || '編輯網誌')}
                <div class="flex-fill"></div>
                <button class="btn  me-2 btn-outline-secondary" style="height:35px;font-size: 14px;" onclick="${gvc.event(() => {
        const href = (() => {
            const url = new URL(
                '',
                (window.parent as any).glitter.share.editorViewModel.domain
                    ? `https://${(window.parent as any).glitter.share.editorViewModel.domain}/`
                    : (window.parent as any).location.href
            );
            url.search = '';
            url.searchParams.set('page', vm.data.content.template);
            url.searchParams.set('article', vm.data.content.tag);
            if (!(window.parent as any).glitter.share.editorViewModel.domain) {
                url.searchParams.set('appName', (window.parent as any).appName);
            }
            return url.href;
        })();
        alert(href);
        (window.parent as any).glitter.openNewTab(href)
    })}"><i class="fa-regular fa-eye me-2"></i>預覽網誌</button>
                <button class="btn btn-primary-c " style="height:35px;font-size: 14px;"
                        onclick="${gvc.event(() => {
        dialog.dataLoading({visible: true})
        ApiPageConfig.setPage({
            id: (vm.data! as any).id,
            appName: vm.data.appName,
            tag: vm.data.tag,
            name: vm.data.name,
            group: vm.data.group,
            page_config: vm.data.page_config
        }).then((api) => {
            dialog.dataLoading({visible: false})
            dialog.successMessage({
                text: "儲存成功"
            })
        })
    })}">儲存
                </button>
            </div>
            <div class="d-flex justify-content-between" style="gap:10px;">
            <div style="width: 752px;">
       ${BgWidget.card(gvc.bindView(() => {
        const artViewID = gvc.glitter.getUUID()
        return {
            bind: artViewID,
            view: () => {
                return [
                    EditorElem.editeInput({
                        gvc: gvc,
                        title: '網誌名稱',
                        default: vm.data.name,
                        placeHolder: '請輸入網誌名稱',
                        callback: (text) => {
                            vm.data.name = text;
                        }
                    }),
                    EditorElem.editeInput({
                        gvc: gvc,
                        title: '網誌標題',
                        default: vm.data.page_config.meta_article.title,
                        placeHolder: '請輸入網誌標題',
                        callback: (text) => {
                            vm.data.page_config.meta_article.title = text;
                        }
                    }),
                    EditorElem.editeText({
                        gvc: gvc,
                        title: '網誌摘要',
                        default: vm.data.page_config.meta_article.description,
                        placeHolder: '請輸入網誌摘要',
                        callback: (text) => {
                            vm.data.page_config.meta_article.description = text;
                        }
                    }),
                    EditorElem.select({
                        title: '網誌編輯類型',
                        gvc: gvc,
                        def: vm.data.page_config.meta_article.view_type,
                        array: [
                            {
                                title: 'HTML編輯器',
                                value: 'html'
                            },
                            {
                                title: '富文本',
                                value: 'rich_text'
                            }
                        ],
                        callback: (text: string) => {
                            vm.data.page_config.meta_article.view_type = text
                            gvc.notifyDataChange(artViewID)
                        }
                    }),
                    (() => {
                        if (vm.data.page_config.meta_article.view_type === 'rich_text') {
                            return EditorElem.richText({
                                gvc: gvc,
                                def: vm.data.page_config.meta_article.content ?? '',
                                callback: (text) => {
                                    vm.data.page_config.meta_article.content = text
                                }
                            })
                        } else {
                            return `<div class="btn btn-primary-c w-100" onclick="${gvc.event(() => {
                                gvc.glitter.innerDialog(() => {
                                    return EditorElem.pageEditor({
                                        page: vm.data.tag,
                                        width: window.innerWidth - 30,
                                        height: window.innerHeight - 30,
                                        par: [
                                            {
                                                key: 'page',
                                                value: vm.data.tag
                                            }
                                        ]
                                    })
                                }, '')
                            })}">前往頁面編輯器</div>`
                        }
                    })()
                ].join(`<div class="my-2"></div>`)
            },
            divCreate: {}
        }
    }))}   
       <div class="my-2">
       ${EditorElem.h3('SEO配置')}
</div>
       ${BgWidget.card([
        EditorElem.editeInput({
            gvc: gvc,
            title: '網誌連結',
            default: vm.data.tag,
            placeHolder: '請輸入網誌連結',
            callback: (text) => {
                vm.data.tag = text;
            }
        }),
        EditorElem.editeInput({
            gvc: gvc,
            title: 'SEO標題',
            default: vm.data.page_config.seo.title,
            placeHolder: '請輸入網誌標題',
            callback: (text) => {
                vm.data.page_config.seo.title = text
            }
        }),
        EditorElem.editeText({
            gvc: gvc,
            title: 'SEO描述',
            default: vm.data.page_config.seo.content,
            placeHolder: '請輸入網誌摘要',
            callback: (text) => {
                vm.data.page_config.seo.content = text
            }
        })
    ].join(`<div class="my-2"></div>`))}   
</div>
       <div class="flex-fill" style="width:270px;">
       ${[
        BgWidget.card([
            gvc.bindView(() => {
                const id = gvc.glitter.getUUID()
                return {
                    bind: id,
                    view: () => {
                        return EditorElem.pageSelect(gvc, '選擇佈景主題', vm.data.page_config.template ?? "", (data) => {
                            vm.data.page_config.template = data
                        }, (dd) => {
                            
                            const filter_result = dd.group !== 'glitter-article' && dd.page_type === 'article' && dd.page_config.template_type==='blog'
                            if (filter_result && !vm.data.page_config.template) {
                                vm.data.page_config.template = dd.tag
                                gvc.notifyDataChange(id)
                            }
                            return filter_result
                        })
                    }
                }
            }),
            html`<h3 style="color: black;font-size: 14px;margin-bottom: 10px;" class="fw-normal mt-2">
                從您目前的模板主題中指派範本，以打造網誌文章外觀。</h3>`,
            EditorElem.select({
                title: '是否支援網誌索引',
                gvc: gvc,
                def: vm.data.page_config.hideIndex ?? 'false',
                array: [
                    {
                        title: '是', value: 'false',
                    },
                    {
                        title: '否', value: 'true',
                    }
                ],
                callback: (text) => {
                    vm.data.page_config.hideIndex = text
                }
            })
            ,
            EditorElem.editeInput({
                gvc: gvc,
                title: '作者資訊',
                default: vm.data.page_config.meta_article.author,
                placeHolder: '請輸入作者資訊',
                callback: (text) => {
                    vm.data.page_config.meta_article.author = text;
                }
            }),
            gvc.bindView(() => {
                const id = gvc.glitter.getUUID()
                return {
                    bind: id,
                    view: () => {
                        const imageArray = []
                        if (vm.data.page_config.meta_article.preview_image) {
                            imageArray.push(vm.data.page_config.meta_article.preview_image)
                        }
                        return [EditorElem.h3(html`
                            <div class="d-flex align-items-center" style="gap:10px;">預覽圖
                                <div class="d-flex align-items-center justify-content-center rounded-3"
                                     style="height: 30px;width: 80px;
">
                                    <button class="btn ms-2 btn-primary-c ms-2"
                                            style="height: 30px;width: 80px;"
                                            onclick="${gvc.event(() => {
                                                EditorElem.uploadFileFunction({
                                                    gvc: gvc,
                                                    callback: (text) => {
                                                        vm.data.page_config.meta_article.preview_image = text
                                                        gvc.notifyDataChange(id)
                                                    },
                                                    type: `image/*, video/*`
                                                })
                                            })}">添加檔案
                                    </button>
                                </div>
                            </div>`), EditorElem.flexMediaManager({
                            gvc: gvc,
                            data: imageArray
                        }),
                            `<div class="mx-n3">${
                                EditorElem.arrayItem({
                                    originalArray: vm.data.page_config.meta_article.tag,
                                    gvc: gvc,
                                    title: '文章分類',
                                    array: (() => {
                                        return vm.data.page_config.meta_article.tag.map((dd: any, index: number) => {
                                            return {
                                                title: `<span style="color:black;">${dd}</span>`,
                                                innerHtml: (gvc: GVC) => {
                                                    return `<div class="w-100 mb-2">
${EditorElem.editeInput({
                                                        gvc: gvc,
                                                        title: "標籤名稱",
                                                        default: `${dd}`,
                                                        placeHolder: "請輸入標籤名稱",
                                                        callback: (text) => {
                                                            vm.data.page_config.meta_article.tag[index] = text
                                                            gvc.notifyDataChange(id)
                                                        },
                                                        type: 'text'
                                                    })}
</div>`
                                                },
                                                expand: dd,
                                                minus: gvc.event(() => {
                                                    vm.data.page_config.meta_article.tag.splice(index, 1);
                                                    gvc.notifyDataChange(id);
                                                })
                                            }
                                        })
                                    }),
                                    expand: {},
                                    plus: {
                                        title: '添加分類',
                                        event: gvc.event(() => {
                                            vm.data.page_config.meta_article.tag.push('')
                                            gvc.notifyDataChange(id);
                                        }),
                                    },
                                    refreshComponent: () => {
                                        gvc.notifyDataChange(id);
                                    }
                                })
                            }</div>`
                        ].join(`<div class="my-2"></div>`)

                    },
                    divCreate: {}
                }
            })
        ].join(`<div class="my-3 border-bottom"></div>`))].join(`<div class="my-3"></div>`)}
</div>
</div>
                        `, 1100)
}


function addArticle(gvc: GVC, callback: (tag: string) => void) {
    const tdata: {
        "appName": string,
        "tag": string,
        "group"?: string,
        "name"?: string,
        "config"?: [],
        "page_config"?: any,
        "copy"?: string,
        "page_type": string
    } = {
        "appName": config.appName,
        "tag": "",
        "group": "",
        "name": "",
        "config": [],
        "page_type": 'blog'
    }
    const html = String.raw
    const glitter = gvc.glitter;
    return html`
        <div class="w-100 h-100 d-flex flex-column align-items-center justify-content-center"
             style="background-color: rgba(0,0,0,0.5);">
            <div class="m-auto rounded shadow bg-white" style="max-width: 100%;max-height: 100%;width: 360px;">
                <div class="w-100 d-flex align-items-center border-bottom justify-content-center position-relative py-3"
                     style="">
                    <h3 class="modal-title fs-5">添加網誌</h3>
                    <i class="fa-solid fa-xmark text-dark position-absolute "
                       style="font-size:20px;transform: translateY(-50%);right: 20px;top: 50%;cursor: pointer;"
                       onclick="${gvc.event(() => {
                           glitter.closeDiaLog();
                       })}"></i>
                </div>
                <div class="py-2 px-3">
                    ${gvc.bindView(() => {
                        const id = glitter.getUUID()
                        return {
                            bind: id,
                            view: () => {
                                return new Promise(async (resolve, reject) => {
                                    let dataList: any = []
                                    await new Promise(async (resolve, reject) => {
                                        Article.get({
                                            page: 0,
                                            limit: 200
                                        }).then((data) => {
                                            dataList = data.response.data
                                            resolve(true)
                                        })
                                    })
                                    resolve([
                                        glitter.htmlGenerate.editeInput({
                                            gvc: gvc,
                                            title: '網誌標籤連結',
                                            default: "",
                                            placeHolder: "請輸入網誌標籤連結",
                                            callback: (text) => {
                                                tdata.tag = text
                                            }
                                        }),
                                        glitter.htmlGenerate.editeInput({
                                            gvc: gvc,
                                            title: '網誌名稱',
                                            default: "",
                                            placeHolder: "請輸入網誌名稱",
                                            callback: (text) => {
                                                tdata.name = text
                                            }
                                        })
                                    ].join(''))
                                })
                            },
                            divCreate: {}
                        }
                    })}
                </div>
                <div class="d-flex w-100 mb-2 align-items-center justify-content-center">
                    <button class="btn btn-primary " style="width: calc(100% - 20px);" onclick="${gvc.event(() => {
                        const dialog = new ShareDialog(glitter)
                        dialog.dataLoading({text: "上傳中", visible: true})
                        Article.post(tdata as any).then((it) => {
                            setTimeout(() => {
                                dialog.dataLoading({text: "", visible: false})
                                if (it.result) {
                                    callback(tdata.tag)
                                } else {
                                    dialog.errorMessage({
                                        text: "已有此頁面標籤"
                                    })
                                }
                            }, 1000)
                        })
                        // ApiPageConfig.addPage(tdata).then((it) => {
                        //     setTimeout(() => {
                        //         dialog.dataLoading({text: "", visible: false})
                        //         if (it.result) {
                        //             callback(tdata.tag)
                        //         } else {
                        //             dialog.errorMessage({
                        //                 text: "已有此頁面標籤"
                        //             })
                        //         }
                        //     }, 1000)
                        // })
                    })}">確認新增
                    </button>
                </div>
            </div>
        </div>
    `;
}

(window as any).glitter.setModule(import.meta.url, BgBlog)