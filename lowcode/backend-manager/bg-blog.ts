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
import {MenusSetting} from "../cms-plugin/menus-setting.js";

interface MenuItem {
    link: string;

    title: string;

    items: MenuItem[];
}

const html = String.raw

export class BgBlog {
    public static contentManager(gvc: GVC, type: 'select' | 'list' | 'collection' = 'list', callback: (list: any[]) => void = () => {
    }, is_page: boolean, widget: any) {
        const html = String.raw
        const glitter = gvc.glitter
        const vm: {
            type: "list" | "add" | "replace" | 'select' | 'collection',
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
                        key: `${is_page ? `頁面` : `網誌`}連結`,
                        value: `<span class="fs-7">${(dd.content.tag)}</span>`
                    },
                    {
                        key: `${is_page ? `頁面` : `網誌`}標題`,
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
                                ${BgWidget.title(is_page ? '頁面管理' : '網誌文章')}
                                <div class="flex-fill"></div>
                                <button class="btn-gary ${(is_page) ? `d-none` : ``}" type="button"
                                        onclick="${gvc.event(() => {
                                            vm.type = 'collection'
                                            gvc.notifyDataChange(id)
                                        })}">網誌分類
                                </button>
                                <div class="cursor_it bt_c39 ms-2 p-1"
                                     style=""
                                     onclick="${gvc.event(() => {
                                         vm.data = {
                                             content:{}
                                         }
                                         vm.type = 'add'
                                     })}">
                                    <i class="fa-solid fa-plus me-2"></i>
                                        新增${is_page ? `頁面` : `網誌`}
                                </div>
                            </div>
                            ${BgWidget.table({
                                gvc: gvc,
                                getData: (vd) => {
                                    vmi = vd
                                    Article.get({
                                        page: vmi.page - 1,
                                        limit: 20,
                                        search: vm.query || undefined,
                                        for_index: (is_page) ? `false` : `true`,
                                        status:'0,1'
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
                                    }), vm.query || '', '搜尋所有文章')}
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
                        `, 960, `max-width:100%;`)
                    } else if (vm.type == 'replace') {
                        return editor({
                            gvc: gvc,
                            vm: vm,
                            is_page: is_page,
                            widget: widget
                        })
                    } else if (vm.type == 'collection') {
                        return BgWidget.container(setCollection({
                            gvc: gvc,
                            widget: widget,
                            key: 'blog_collection',
                            goBack: () => {
                                vm.type = 'list'
                                gvc.notifyDataChange(id)
                            },
                        }), 960, `max-width:100%;`)

                    } else {
                        return editor({
                            gvc: gvc,
                            vm: vm,
                            is_page: is_page,
                            widget: widget
                        })
                    }

                },
                divCreate: {
                    class: `mx-auto `,
                    style: `max-width:100%;`,
                }
            }
        })
    }
}

function editor(cf: {
    gvc: GVC,
    vm: any,
    is_page: boolean,
    widget: any
}) {
    const glitter = cf.gvc.glitter;
    const dialog = new ShareDialog(glitter);
    const vm = cf.vm;
    const gvc = cf.gvc
    const html = String.raw;
    vm.data.content.seo = vm.data.content.seo ?? {};
    vm.data.content.for_index = (cf.is_page) ? 'false' : 'true'
    let cVm: {
        id: string,
        type: 'detail' | 'collection'
    } = {
        id: gvc.glitter.getUUID(),
        type: 'detail'
    }
    return BgWidget.container(gvc.bindView(() => {
        return {
            bind: cVm.id,
            view: () => {
                vm.data.content.collection=(vm.data.content.collection || []).map((dd:any)=>{
                    return (typeof dd !== 'string') ? dd.link :dd
                })
                if (cVm.type === 'collection') {
                    return BgWidget.container(setCollection({
                        gvc: gvc,
                        widget: cf.widget,
                        key: 'blog_collection',
                        goBack: () => {
                            cVm.type = 'detail'
                            gvc.notifyDataChange(cVm.id)
                        },
                        select_module: {
                            callback: (data) => {
                                vm.data.content.collection = data
                                cVm.type = 'detail'
                                gvc.notifyDataChange(cVm.id)
                            },
                            def: vm.data.content.collection || []
                        }
                    }), 960, `max-width:100%;`)

                }
                return html`
                    <div class="d-flex w-100 align-items-center mb-3 ">
                        ${BgWidget.goBack(gvc.event(() => {
                            vm.type = "list"
                        }))} ${BgWidget.title(cf.is_page ? '編輯頁面':'編輯網誌')}
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
                                onclick="${gvc.event(async () => {
                                    if(!vm.data.content.tag){
                                        await cf.widget.event('error',{
                                            title:'請輸入連結'
                                        })
                                    }else{
                                        await cf.widget.event('loading', {
                                            title: '儲存中...',
                                        });
                                        if(vm.data.id){
                                            Article.put(vm.data).then(async (res) => {
                                                await cf.widget.event('loading', {
                                                    title: '儲存中...',
                                                    visible:false
                                                });
                                                if(res.result){
                                                    await cf.widget.event('success',{
                                                        title:'設定成功'
                                                    })
                                                }else{
                                                    await cf.widget.event('error',{
                                                        title:'此連結已被使用'
                                                    })
                                                }
                                            })
                                        }else{
                                            await cf.widget.event('loading', {
                                                title: '儲存中...',
                                            });
                                            Article.post(vm.data.content,vm.data.status).then(async (res) => {
                                                await cf.widget.event('loading', {
                                                    title: '儲存中...',
                                                    visible:false
                                                });
                                                if(res.result){
                                                    vm.data.id=res.response.id
                                                    await cf.widget.event('success',{
                                                        title:'添加成功'
                                                    })
                                                    gvc.notifyDataChange(cVm.id)
                                                }else{
                                                    await cf.widget.event('error',{
                                                        title:'此連結已被使用'
                                                    })
                                                }
                                              
                                            })                                    
                                        }
                                    }
                                   
                                   
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
                                                            
                                                                return `https://${(window.parent as any).glitter.share.editorViewModel.domain}/${vm.data.content.template}?article=${vm.data.content.tag}`;
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
                                            EditorElem.select({
                                                title: '啟用狀態',
                                                gvc: gvc,
                                                def: `${vm.data.status}`,
                                                array: [{
                                                    title:'啟用',
                                                    value:'1'
                                                },{
                                                    title:'隱藏',
                                                    value:'0'
                                                }],
                                                callback: (text: string)=>{
                                                    vm.data.status=text
                                                    gvc.notifyDataChange(id)
                                                }
                                            }),
                                            EditorElem.pageSelect(gvc, '選擇佈景主題', vm.data.content.template ?? "", (data) => {
                                                vm.data.content.template = data
                                            }, (dd) => {
                                                const filter_result = dd.group !== 'glitter-article' && dd.page_type === 'article' && dd.page_config.template_type === 'blog'
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
                                                        vm.data.content.collection = vm.data.content.collection ?? [];
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
                                                            data: vm.data.content.preview_image ? [vm.data.content.preview_image] : []
                                                        }),
                                                            html`
                                                                <div class="d-flex mx-n3  px-2 hi fw-bold d-flex align-items-center border-bottom  py-2 border-top bgf6"
                                                                     style="color:#151515;font-size:16px;gap:0px;height:48px;">
                                                                    文章分類
                                                                    <div class="flex-fill"></div>
                                                                </div>
                                                                ${gvc.bindView(() => {
                                                                    const tagID = gvc.glitter.getUUID()
                                                                    let listTag: string[] = []
                                                                    ApiUser.getPublicConfig('blog_collection', 'manager').then((data: any) => {
                                                                        if (data.response.value) {
                                                                            vm.link = data.response.value;
                                                                            
                                                                            function setCheck(link: MenuItem[]) {
                                                                                link.map((dd, value) => {

                                                                                    const it = vm.data.content.collection.find((d1: string) => {
                                                                                        return d1 === dd.link
                                                                                    });
                                                                                    it && listTag.push(dd.title)
                                                                                    setCheck(dd.items)
                                                                                })
                                                                            }

                                                                            setCheck(vm.link)
                                                                          
                                                                            gvc.notifyDataChange(tagID);
                                                                        }
                                                                    });
                                                                    return {
                                                                        bind: tagID,
                                                                        view: () => {
                                                                            return listTag.map((dd: any) => {
                                                                                return `<div class="badge bg_orange  mt-2 me-2 fs-sm">${dd}</div>`
                                                                            }).join('')
                                                                        },
                                                                        divCreate: {
                                                                            class: `d-flex flex-wrap`
                                                                        }
                                                                    }
                                                                })}
                                                                <div class="cursor_it bt_c39 ms-2 p-1 mt-3" style=""
                                                                     onclick="${gvc.event((() => {
                                                                         cVm.type = 'collection'
                                                                         gvc.notifyDataChange(cVm.id)
                                                                     }))}">
                                                                    <i class="fa-solid fa-plus me-2"
                                                                       aria-hidden="true"></i>
                                                                    添加與編輯分類
                                                                </div>
                                                            `
                                                        ].join(`<div class="my-2"></div>`)

                                                    },
                                                    divCreate: {}
                                                }
                                            })
                                        ].join('')
                                    }
                                }
                            }))}
                            <div class="${(vm.data.id) ? `d-flex`:`d-none`} align-items-center justify-content-end mt-2">
                                <button class="btn btn-danger btn-sm" onclick="${gvc.event(()=>{
                                    const dialog = new ShareDialog(gvc.glitter)
                                    dialog.checkYesOrNot({
                                        text: '是否確認刪除此頁面?',
                                        callback: async (response) => {
                                            if (response) {
                                                await cf.widget.event('loading', {
                                                    title: '刪除中...',
                                                });
                                                Article.deleteV2({
                                                    id: `${vm.data.id}`
                                                }).then(async (res) => {
                                                    await cf.widget.event('loading', {
                                                        title: '刪除中...',
                                                        visible:false
                                                    });
                                                    if (res.result) {
                                                        vm.dataList = undefined
                                                        vm.type = "list"
                                                    } else {
                                                        await cf.widget.event('error', {
                                                            title: '刪除失敗',
                                                            visible:false
                                                        });
                                                    }
                                                })
                                            }
                                        }
                                    })
                                })}">刪除${cf.is_page ? '頁面':'網誌'}</button>
                            </div>
                        </div>
                      
                    </div>
                `
            },
            divCreate: {}
        }
    }), 1200)
}

function setCollection(cf: {
    goBack: () => void; gvc: GVC; widget: any; key: string, select_module?: {
        callback: (data: any) => void,
        def: string[]
    }
}) {
    const vm: {
        id: string;
        link: MenuItem[];
        loading: boolean;
        selected: boolean;
    } = {
        id: cf.gvc.glitter.getUUID(),
        link: [],
        selected: false,
        loading: true,
    };

    ApiUser.getPublicConfig(cf.key, 'manager').then((data: any) => {
        if (data.response.value) {
            vm.link = data.response.value;
            if (cf.select_module) {
                function setCheck(link: MenuItem[]) {
                    link.map((dd, value) => {
                        if (cf.select_module!.def.find((d1) => {
                            return d1 === dd.link
                        })) {
                            (dd as any).selected = true
                        }
                        setCheck(dd.items)
                    })
                }

                setCheck(vm.link)
            }
            gvc.notifyDataChange(vm.id);
        }
    });

    function clearNoNeedData(items: MenuItem[]) {
        items.map((dd) => {
            (dd as any).selected = undefined;
            clearNoNeedData(dd.items || []);
        });
    }

    function save() {
        let select_list: any = []

        function check_select(items: MenuItem[]) {
            items.map((dd) => {
                if ((dd as any).selected) {
                    select_list.push(dd.link)
                }
            });
        }

        check_select(vm.link)
        clearNoNeedData(vm.link);
        cf.widget.event('loading', {
            title: '儲存中...',
        });
        ApiUser.setPublicConfig({
            key: cf.key,
            value: vm.link,
            user_id: 'manager',
        }).then((data) => {
            setTimeout(() => {
                cf.widget.event('loading', {
                    visible: false,
                });
                if (cf.select_module) {

                    cf.select_module.callback(select_list)
                } else {
                    cf.widget.event('success', {
                        title: '儲存成功',
                    });
                }
            }, 1000);
        });
    }

    function selectAll(array: MenuItem) {
        (array as any).selected = true;
        array.items.map((dd) => {
            (dd as any).selected = true;
            selectAll(dd);
        });
    }

    function clearAll(array: MenuItem) {
        (array as any).selected = false;
        array.items.map((dd) => {
            (dd as any).selected = false;
            clearAll(dd);
        });
    }


    function allSelect(dd: any) {
        return (
            !dd.items.find((d1: any) => {
                return !(d1 as any).selected;
            }) && (dd as any).selected
        );
    }

    function getSelectCount(dd: any) {
        let count = 0;
        if (dd.selected) {
            count++;
        }
        dd.items.map((d1: any) => {
            count += getSelectCount(d1);
        });
        return count;
    }

    function deleteSelect(items: MenuItem[]) {
        return items.filter((d1) => {
            d1.items = deleteSelect(d1.items || []);
            return !(d1 as any).selected;
        });
    }

    function checkLinkExists(it: MenuItem, items: MenuItem[]) {
        let exists_count = -1
        let title_exists_count = -1
       function check(it: MenuItem, items: MenuItem[]) {
           items.map((d1) => {
               if (d1.link === it.link) {
                   exists_count++
               }
               if (d1.title === it.title) {
                   title_exists_count++
               }
               return check(it, d1.items)
           });
       }
        check(it, items);
        if (!it.link || !it.title) {
            alert('請確實填寫欄位內容!')
            return false
        } else if (exists_count) {
            alert('此標籤已被使用!')
            return false
        }else if (title_exists_count) {
            alert('此標題已被使用!')
            return false
        }else{
            return true
        }
    }

    const gvc = cf.gvc;
    return gvc.bindView(() => {
        return {
            bind: vm.id,
            view: () => {
                return html`
                    <div class="d-flex align-items-center my-3">
                        ${BgWidget.goBack(
                                cf.gvc.event(() => {
                                    cf.goBack();
                                })
                        )}${BgWidget.title('分類設定')}
                    </div>
                    <div
                            style="max-width:100%;width: 856px; padding: 20px; background: white; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.08); border-radius: 10px; overflow: hidden; justify-content: center; align-items: center; display: inline-flex"
                    >
                        <div style="width: 100%;  position: relative">
                            <div style="width: 100%;  left: 0px; top: 0px;  flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 20px; display: inline-flex">
                                <div
                                        class="w-100  ${getSelectCount({
                                            items: vm.link,
                                        }) > 0
                                                ? ``
                                                : `d-none`}"
                                        style="height: 40px; padding: 12px 18px;background: #F7F7F7; border-radius: 10px; justify-content: flex-end; align-items: center; gap: 8px; display: inline-flex"
                                >
                                    <div style="flex: 1 1 0; color: #393939; font-size: 14px; font-family: Noto Sans; font-weight: 700; word-wrap: break-word">
                                            已選取${getSelectCount({
                                            items: vm.link,
                                        })}項
                                    </div>
                                    <div
                                            style="cursor:pointer;padding: 4px 14px;background: white; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.10); border-radius: 20px; border: 1px #DDDDDD solid; justify-content: flex-start; align-items: flex-start; gap: 10px; display: flex"
                                    >
                                        <div
                                                style="color: #393939; font-size: 14px; font-family: Noto Sans; font-weight: 400; word-wrap: break-word"
                                                onclick="${gvc.event(() => {
                                                    vm.link = deleteSelect(vm.link);
                                                    gvc.notifyDataChange(vm.id);
                                                })}"
                                        >
                                            刪除
                                        </div>
                                    </div>
                                </div>
                                <div class="d-flex align-items-center"
                                     style="width: 100%; height: 22px; position: relative;gap:29px;">
                                    <div
                                            class="${allSelect({
                                                items: vm.link,
                                                selected: !vm.link.find((dd) => {
                                                    return !(dd as any).selected;
                                                }),
                                            })
                                                    ? `fa-solid fa-square-check`
                                                    : `fa-regular fa-square`}"
                                            style="color:#393939;width: 16px; height: 16px;cursor: pointer;"
                                            onclick="${cf.gvc.event((e, event) => {
                                                event.stopPropagation();

                                                if (
                                                        vm.link.find((dd) => {
                                                            return !(dd as any).selected;
                                                        })
                                                ) {
                                                    selectAll({
                                                        items: vm.link,
                                                    } as any);
                                                } else {
                                                    clearAll({
                                                        items: vm.link,
                                                    } as any);
                                                }
                                                gvc.notifyDataChange(vm.id);
                                            })}"
                                    ></div>
                                    <div style="left: 61px; top: 0px;  color: #393939; font-size: 16px; font-family: Noto Sans; font-weight: 700; word-wrap: break-word">
                                        選單名稱
                                    </div>
                                </div>
                                <div style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 18px; display: flex">
                                    ${(() => {
                                        function renderItems(array: MenuItem[]): string {
                                            const id = gvc.glitter.getUUID();
                                            return (
                                                    gvc.bindView(() => {
                                                        return {
                                                            bind: id,
                                                            view: () => {
                                                                return array
                                                                        .map((dd, index) => {
                                                                            dd.items
                                                                            const list = html`
                                                                                <div
                                                                                        class=" w-100 "
                                                                                        style="width: 100%; justify-content: flex-start; align-items: center; gap: 5px; display: inline-flex;cursor: pointer;"
                                                                                        onclick="${cf.gvc.event(() => {
                                                                                            if (dd.items && dd.items.length > 0) {
                                                                                                (dd as any).toggle = !(dd as any).toggle;
                                                                                                gvc.notifyDataChange(vm.id);
                                                                                            }
                                                                                        })}"
                                                                                >
                                                                                    <div
                                                                                            class="${allSelect(dd) ? `fa-solid fa-square-check` : `fa-regular fa-square`}"
                                                                                            style="color:#393939;width: 16px; height: 16px;"
                                                                                            onclick="${cf.gvc.event((e, event) => {
                                                                                                event.stopPropagation();
                                                                                                (dd as any).selected = !(dd as any).selected;
                                                                                                if ((dd as any).selected) {
                                                                                                    selectAll(dd);
                                                                                                } else {
                                                                                                    clearAll(dd);
                                                                                                }
                                                                                                gvc.notifyDataChange(vm.id);
                                                                                            })}"
                                                                                    ></div>
                                                                                    <div
                                                                                            class="hoverF2 pe-2"
                                                                                            style="width: 100%;  justify-content: flex-start; align-items: center; gap: 8px; display: flex"
                                                                                    >
                                                                                        <i
                                                                                                class="ms-2 fa-solid fa-grip-dots-vertical cl_39 dragItem hoverBtn d-flex align-items-center justify-content-center"
                                                                                                style="cursor: pointer;width:25px;height: 25px;"
                                                                                        ></i>
                                                                                        <div
                                                                                                style="flex-direction: column; justify-content: center; align-items: flex-start; gap: 2px; display: inline-flex"
                                                                                        >
                                                                                            <div style="justify-content: flex-start; align-items: center; gap: 8px; display: inline-flex">
                                                                                                <div
                                                                                                        style="color: #393939; font-size: 16px; font-family: Noto Sans; font-weight: 400; word-wrap: break-word"
                                                                                                >
                                                                                                    ${dd.title}
                                                                                                </div>
                                                                                                ${dd.items && dd.items.length > 0
                                                                                                        ? !(dd as any).toggle
                                                                                                                ? `<i class="fa-solid fa-angle-down cl_39"></i>`
                                                                                                                : `<i class="fa-solid fa-angle-up cl_39"></i>`
                                                                                                        : ``}
                                                                                            </div>
                                                                                            <div style="justify-content: flex-start; align-items: center; gap: 8px; display: inline-flex">
                                                                                                <div
                                                                                                        style="color: #3366BB; font-size: 14px; font-family: Noto Sans; font-weight: 400; line-height: 14px; word-wrap: break-word"
                                                                                                >
                                                                                                    ${dd.title}
                                                                                                </div>
                                                                                                <div
                                                                                                        style="color: #159240; font-size: 14px; font-family: Noto Sans; font-weight: 400; word-wrap: break-word"
                                                                                                >
                                                                                                    ${dd.link}
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div class="flex-fill"></div>
                                                                                        <div
                                                                                                class="child me-2"
                                                                                                onclick="${cf.gvc.event((e, event) => {
                                                                                                    event.stopPropagation();
                                                                                                    MenusSetting.collectionEvent(
                                                                                                            {
                                                                                                                link: '',
                                                                                                                title: '',
                                                                                                                items: [],
                                                                                                            },
                                                                                                            (data) => {
                                                                                                                dd.items = dd.items || [];
                                                                                                                dd.items.push(data)
                                                                                                                if(checkLinkExists(data,vm.link)){
                                                                                                                    gvc.notifyDataChange(vm.id);
                                                                                                                    return true
                                                                                                                } else{
                                                                                                                    dd.items.splice(dd.items.length-1,1)
                                                                                                                    return  false
                                                                                                                }
                                                                                                            }
                                                                                                    );
                                                                                                })}"
                                                                                        >
                                                                                            <i class="fa-solid fa-plus"
                                                                                               style="color:#393939;"></i>
                                                                                        </div>
                                                                                        <div
                                                                                                class="child"
                                                                                                onclick="${cf.gvc.event((e, event) => {
                                                                                                    event.stopPropagation();
                                                                                                    const og=JSON.parse(JSON.stringify(dd))
                                                                                                   
                                                                                                    MenusSetting.collectionEvent(dd, (data) => {
                                                                                                        if(checkLinkExists(data,vm.link)){
                                                                                                            array[index] = data;
                                                                                                            gvc.notifyDataChange(vm.id);
                                                                                                            return true
                                                                                                        } else{
                                                                                                            data.link=og.link
                                                                                                            data.title=og.title
                                                                                                            return  false
                                                                                                        }
                                                                                                    });
                                                                                                })}"
                                                                                        >
                                                                                            <i class="fa-solid fa-pencil"
                                                                                               style="color:#393939;"></i>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                ${dd.items && dd.items.length > 0
                                                                                        ? `
                                    <div class=" w-100 ${(dd as any).toggle ? `` : `d-none`}" style="padding-left: 35px;" >
                                 ${renderItems(dd.items as MenuItem[]) as any}
</div>
                                    `
                                                                                        : ``}
                                                                            `;
                                                                            return `<li class="w-100 ">${list}</li>`;
                                                                        })
                                                                        .join('');
                                                            },
                                                            divCreate: {
                                                                elem: 'ul',
                                                                class: `w-100 my-2`,
                                                                style: `display:flex;flex-direction: column;gap:18px;`,
                                                            },
                                                            onCreate: () => {
                                                                gvc.glitter.addMtScript(
                                                                        [
                                                                            {
                                                                                src: `https://raw.githack.com/SortableJS/Sortable/master/Sortable.js`,
                                                                            },
                                                                        ],
                                                                        () => {
                                                                        },
                                                                        () => {
                                                                        }
                                                                );
                                                                const interval = setInterval(() => {
                                                                    //@ts-ignore
                                                                    if (window.Sortable) {
                                                                        try {
                                                                            gvc.addStyle(`ul {
  list-style: none;
  padding: 0;
}`);

                                                                            function swapArr(arr: any, index1: number, index2: number) {
                                                                                const data = arr[index1];
                                                                                arr.splice(index1, 1);
                                                                                arr.splice(index2, 0, data);
                                                                            }

                                                                            let startIndex = 0;
                                                                            //@ts-ignore
                                                                            Sortable.create(gvc.getBindViewElem(id).get(0), {
                                                                                group: id,
                                                                                animation: 100,
                                                                                handle: '.dragItem',
                                                                                onChange: function (evt: any) {
                                                                                },
                                                                                onEnd: (evt: any) => {
                                                                                    swapArr(array, startIndex, evt.newIndex);
                                                                                    gvc.notifyDataChange(id);
                                                                                },
                                                                                onStart: function (evt: any) {
                                                                                    startIndex = evt.oldIndex;
                                                                                },
                                                                            });
                                                                        } catch (e) {
                                                                        }
                                                                        clearInterval(interval);
                                                                    }
                                                                }, 100);
                                                            },
                                                        };
                                                    }) +
                                                    ` <div class=""
                                                         style="cursor:pointer;align-self: stretch; height: 50px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 10px; display: flex"
                                                         onclick="${cf.gvc.event(() => {
                                                        MenusSetting.collectionEvent(
                                                                {
                                                                    link: '',
                                                                    title: '',
                                                                    items: [],
                                                                },
                                                                (data) => {
                                                                    array.push(data);
                                                                    if(checkLinkExists(data,vm.link)){
                                                                        gvc.notifyDataChange(vm.id);
                                                                        return true
                                                                    } else{
                                                                        array.splice(array.length-1,1)
                                                                        return  false
                                                                    }
                                                                }
                                                        );
                                                    })}">
                                                        <div style="align-self: stretch; height: 54px; border-radius: 10px; border: 1px #DDDDDD solid; justify-content: center; align-items: center; gap: 6px; display: inline-flex">
                                                            <i class="fa-solid fa-plus"
                                                               style="color: #3366BB;font-size: 16px; "></i>
                                                            <div style="color: #3366BB; font-size: 16px; font-family: Noto Sans; font-weight: 400; word-wrap: break-word">
                                                                新增選單
                                                            </div>
                                                        </div>
                                                    </div>`
                                            );
                                        }

                                        return renderItems(vm.link);
                                    })()}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="position-fixed bg-body bottom-0  w-100 d-flex align-items-center justify-content-end p-3 border-top"
                         style="gap:10px;left:0px;">
                        ${BgWidget.cancel(
                                gvc.event(() => {
                                    cf.goBack();
                                })
                        )}
                        ${BgWidget.save(
                                gvc.event(() => {
                                    save();
                                }),
                                '確認'
                        )}
                    </div>`;
            },
            divCreate: {
                style: `padding-bottom:60px;`,
            },
        };
    });
}

function addArticle(gvc: GVC, callback: (tag: string) => void, for_index: boolean) {
    const tdata: {
        "appName": string,
        "tag": string,
        "group"?: string,
        "name"?: string,
        "config"?: [],
        "page_config"?: any,
        "copy"?: string,
        "page_type": string,
        for_index: string
    } = {
        "appName": config.appName,
        "tag": "",
        "group": "",
        "name": "",
        "config": [],
        "page_type": 'blog',
        "for_index": `${for_index}`
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