import {GVC} from "../glitterBundle/GVController.js";
import {EditorElem} from "../glitterBundle/plugins/editor-elem.js";
import {ShareDialog} from "../glitterBundle/dialog/ShareDialog.js";
import {ApiPageConfig} from "../api/pageConfig.js";
import {PageEditor} from "./page-editor.js";
import {BgWidget} from "../backend-manager/bg-widget.js";
import {Storage} from "../glitterBundle/helper/storage.js";
import {FormWidget} from "../official_view_component/official/form.js";
import {StoreHelper} from "../helper/store-helper.js";
import {EditorConfig} from "../editor-config.js";
export class PageSettingView {
    public static leftNav(gvc: GVC) {
        const html = String.raw
        return html`
            <div class="vw-100 vh-100 position-fixed left-0 top-0 d-none"
                 id="addSettingViewHover"
                 style="z-index: 99999;background: rgba(0,0,0,0.5);"
                 onclick="${gvc.event(() => {
                     PageSettingView.toggle(false)
                 })}"></div>

            <div id="pageSettingView"
                 class="position-fixed left-0 top-0 h-100 bg-white shadow-lg "
                 style="width:400px;z-index: 99999;left: -100%;">
                ${PageSettingView.view(gvc)}
            </div>`
    }

    public static refresh = () => {
    }

    public static view(gvc: GVC) {
        const glitter = gvc.glitter;
        const html = String.raw
        const id = glitter.getUUID()
        PageSettingView.refresh = () => {
            gvc.notifyDataChange(id)
        }
        return gvc.bindView(() => {
            return {
                bind: id,
                view: () => {
                    return [
                        html`
                            <div class="w-100 d-flex align-items-center p-3 border-bottom">
                                <h5 class="offcanvas-title" style="">頁面設定</h5>
                                <div class="flex-fill"></div>
                                <div class="fs-5 text-black" style="cursor: pointer;" onclick="${gvc.event(() => {
                                    PageSettingView.toggle(false)
                                })}"><i class="fa-sharp fa-regular fa-circle-xmark" style="color:black;"></i></div>
                            </div>`,
                        ` <div class="d-flex  py-2 px-2 bg-white align-items-center w-100 justify-content-around border-bottom">
                            ${(() => {
                            let list = [
                                {
                                    key: 'normal',
                                    label: "基本設定",
                                    icon: '<i class="fa-regular fa-gear"></i>'
                                }
                                , {
                                    key: 'seo',
                                    label: "SEO設定",
                                    icon: '<i class="fa-regular fa-magnifying-glass"></i>'
                                },
                                {
                                    key: 'module',
                                    label: "模板發佈",
                                    icon: '<i class="fa-regular fa-cloud-arrow-up"></i>'
                                },
                                // {
                                //     key: 'form',
                                //     label: "內容編輯表單",
                                //     icon: '  <i class="fa-regular fa-square-list"></i>'
                                // }
                            ]
                            if (['page', 'blog'].indexOf(glitter.share.editorViewModel.data.page_type) === -1) {
                                if (Storage.page_set_select === 'seo') {
                                    Storage.page_set_select = 'normal'
                                }
                                list = list.filter((dd) => {
                                    return dd.key !== 'seo'
                                })
                            }
                            return list.map((dd) => {
                                return `<div class="d-flex align-items-center justify-content-center hoverBtn  border"
                                 style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;
                                 ${(Storage.page_set_select === dd.key) ? `background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);background:-webkit-linear-gradient(135deg, #667eea 0%, #764ba2 100%);color:white;` : ``}
                                 "
                                 data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                 data-bs-title="${dd.label}" onclick="${gvc.event(() => {
                                    PageSettingView.checkFinish(() => {
                                        Storage.page_set_select = dd.key as any
                                        gvc.notifyDataChange(id)
                                    })
                                })}">
                               ${dd.icon}
                            </div>`
                            }).join('')
                        })()}
                        </div>`,
                        gvc.bindView(() => {
                            const docID = gvc.glitter.getUUID()
                            let viewModel = JSON.parse(JSON.stringify(glitter.share.editorViewModel))
                            let editData: any = viewModel.data;
                            return {
                                bind: docID,
                                view: () => {

                                    switch (Storage.page_set_select) {
                                        case "module":
                                            return PageSettingView.module(gvc)
                                        case "code":
                                            const json = JSON.parse(JSON.stringify(glitter.share.editorViewModel.data.config));
                                            json.map((dd: any) => {
                                                dd.refreshAllParameter = undefined;
                                                dd.refreshComponentParameter = undefined;
                                            });
                                            let value = JSON.stringify(json, null, '\t')
                                            return gvc.bindView(() => {
                                                const id = glitter.getUUID();
                                                return {
                                                    bind: id,
                                                    view: () => {
                                                        return html`
                                                            <div class="alert alert-danger flex-fill m-0 p-2 fw-500"
                                                                 style="white-space: normal;word-break:break-all;font-size:14px;">
                                                                此頁面的配置檔包含所有設計模組和觸發事件的代碼配置項目。<br>建議由熟悉程式開發的工程師進行編輯。
                                                            </div>
                                                            ${EditorElem.customCodeEditor({
                                                                gvc: gvc,
                                                                height: window.innerHeight - 320,
                                                                initial: value,
                                                                title: 'JSON配置參數',
                                                                callback: (data) => {
                                                                    value = data;
                                                                },
                                                                language: 'json'
                                                            })}
                                                            <div class="d-flex w-100 mb-2 mt-2 justify-content-end"
                                                                 style="gap:10px;">
                                                                <button class="btn btn-outline-secondary-c "
                                                                        style="flex:1;height:40px; width:calc(50% - 10px);"
                                                                        onclick="${gvc.event(() => {
                                                                            navigator.clipboard.writeText(JSON.stringify(json, null, '\t'));
                                                                        })}"><i
                                                                        class="fa-regular fa-copy me-2"></i>複製到剪貼簿
                                                                </button>
                                                                <button class="btn btn-primary-c "
                                                                        style="flex:1; height:40px; width:calc(50% - 10px);"
                                                                        onclick="${gvc.event(() => {
                                                                            const dialog = new ShareDialog(gvc.glitter)
                                                                            try {
                                                                                glitter.share.editorViewModel.data.config = JSON.parse(value)
                                                                                glitter.closeDiaLog()
                                                                                glitter.htmlGenerate.saveEvent()
                                                                            } catch (e: any) {
                                                                                dialog.errorMessage({text: "代碼輸入錯誤"})
                                                                                console.log(`${e}${e.stack}${e.line}`)
                                                                            }

                                                                        })}"><i
                                                                        class="fa-regular fa-floppy-disk me-2"></i>儲存
                                                                </button>
                                                            </div>
                                                        `
                                                    },
                                                    divCreate: {
                                                        class: `p-2`
                                                    }
                                                }
                                            });
                                        case "seo":
                                            return `<div class="mx-n2">
${PageSettingView.seoSetting({
                                                gvc: gvc,
                                                id: glitter.getUUID(),
                                                vid: '',
                                                viewModel: {
                                                    get selectItem() {
                                                        return viewModel.data
                                                    }
                                                }
                                            })}
</div>`
                                        case "normal":
                                            return PageSettingView.basicSetting(gvc, editData, docID, viewModel)
                                        case 'form':
                                            return PageSettingView.formSetting(gvc)
                                    }
                                },
                                divCreate: () => {
                                    return {
                                        class: ` h-100 p-2 d-flex flex-column`,
                                        style: `width:100%;max-height:calc(100vh - 100px);overflow-y:auto;overflow-x:hidden;`
                                    }
                                },
                                onCreate: () => {
                                    $('.tooltip')!.remove();
                                    ($('[data-bs-toggle="tooltip"]') as any).tooltip();
                                }
                            }
                        })
                    ].join('')
                },
                onCreate: () => {
                    $('.tooltip').remove();
                    ($('[data-bs-toggle="tooltip"]') as any).tooltip();
                }
            }
        })
    }

    public static formSetting(gvc: GVC) {
        gvc.glitter.share.editorViewModel.data.page_config.formFormat = gvc.glitter.share.editorViewModel.data.page_config.formFormat ?? [];
        const dialog = new ShareDialog(gvc.glitter)
        const html = String.raw
        const formFormat = gvc.glitter.share.editorViewModel.data.page_config.formFormat

        function save() {
            gvc.glitter.share.editorViewModel.data.page_config.formFormat = formFormat
            gvc.glitter.htmlGenerate.saveEvent(true)
        }

        PageSettingView.checkFinish = (callback: () => void) => {
            if (
                JSON.stringify(formFormat) !== JSON.stringify(gvc.glitter.share.editorViewModel.data.page_config.formFormat)
            ) {
                dialog.checkYesOrNot({
                    callback: (response) => {
                        if (!response) {
                            PageSettingView.checkFinish = (callback) => {
                                callback()
                            }
                            callback()
                        } else {
                            save()
                        }
                    },
                    text: '內容已變更，是否儲存?'
                })
            } else {
                PageSettingView.checkFinish = (callback) => {
                    callback()
                }
                callback()
            }
        }
        return html`
            <div class="position-relative bgf6 d-flex align-items-center justify-content-between m-n2 p-2 border-bottom shadow">
                <span class="fs-6 fw-bold " style="color:black;">頁面編輯表單設定</span>
                <button class="btn btn-primary-c "
                        style="height: 28px;width:40px;font-size:14px;"
                        onclick="${gvc.event(() => {
                            save()
                        })}">儲存
                </button>
            </div>
            ${
                    gvc.bindView(() => {
                        const id = gvc.glitter.getUUID()
                        return {
                            bind: id,
                            view: () => {
                                return FormWidget.settingView({
                                    gvc: gvc,
                                    array: formFormat,
                                    refresh: () => {
                                        gvc.notifyDataChange(id)
                                    },
                                    title: ''
                                })
                            },
                            divCreate: {
                                class: `my-2`
                            }
                        }
                    })
            }
        `
    }

    public static toggle(visible: boolean) {
        if (visible) {
            $('#addSettingViewHover').removeClass('d-none')
            $('#pageSettingView').removeClass('scroll-out')
            $('#pageSettingView').addClass('scroll-in')
            PageSettingView.refresh()
        } else {
            PageSettingView.checkFinish(() => {
                $('#addSettingViewHover').addClass('d-none')
                $('#pageSettingView').addClass('scroll-out')
                $('#pageSettingView').removeClass('scroll-in')
            })

        }

    }

    public static module(gvc: GVC) {
        let postMD: {
            preview_img: string,
            image: string[],
            desc: string,
            name: string,
            created_by: string
            version: string
            status: "finish" | 'error' | 'wait' | 'no',
            post_to: 'all' | 'me' | 'cancel' | 'project',
            tag: string []
        } = gvc.glitter.share.editorViewModel.data.template_config ?? {
            preview_img: '',
            image: [],
            desc: '',
            name: '',
            created_by: '',
            status: 'no',
            post_to: 'all',
            version: '1.0',
            tag: []
        }

        if (postMD.post_to !== 'all' && postMD.post_to !== 'me' && postMD.post_to !== 'project') {
            postMD.post_to = 'all'
        }
        if ((gvc.glitter.share.editorViewModel.data.template_type === 2) || (gvc.glitter.share.editorViewModel.data.template_type === 3)) {
            postMD.status = 'finish'
        } else if (gvc.glitter.share.editorViewModel.data.template_type === -1) {
            postMD.status = 'error'
        } else if (gvc.glitter.share.editorViewModel.data.template_type === 0) {
            postMD.status = 'no'
        }

        function save() {
            const dialog = new ShareDialog(gvc.glitter)
            if (postMD.post_to === 'all') {
                postMD.status = 'wait';
            } else {
                postMD.status = 'finish';
            }
            dialog.dataLoading({text: '提交審核中...', visible: true});
            ApiPageConfig.createPageTemplate((window as any).appName, postMD, gvc.glitter.getUrlParameter('page')).then((response) => {
                dialog.dataLoading({visible: false})
                if (response.result) {
                    dialog.successMessage({text: `上傳成功...`})
                }
                location.reload()
            })
        }

        const title = (() => {
            return  (EditorConfig.page_type_list.find((dd)=>{
                return dd.value===gvc.glitter.share.editorViewModel.data.page_type
            }) as any).title;
        })()
        const html = String.raw
        return html`
            <div class="mt-n2 mx-n2 position-relative bgf6 d-flex align-items-center   p-2 border-bottom shadow">
                <span class="fs-6 fw-bold " style="color:black;">${title}發佈</span>
                ${
                        (() => {
                            return (() => {
                                switch (postMD.status) {
                                    case "finish":
                                        return `<div class="badge badge-success fs-7 ms-2" >審核通過</div>`;
                                    case "error":
                                        return `<div class="badge bg-danger fs-7 ms-2" >審核失敗</div>`;
                                    case "wait":
                                        return `<div class="badge bg-warning fs-7 ms-2" style="color:black;">等待審核</div>`
                                    default:
                                        return `<div class="badge bg-secondary fs-7 ms-2 border" >尚未發佈</div>`

                                }
                            })()
                        })()
                }
                <div class="flex-fill"></div>
                <button class="btn btn-primary-c "
                        style="height: 28px;width:40px;font-size:14px;"
                        onclick="${gvc.event(() => {
                            save()
                        })}">${(postMD.status === 'finish' || postMD.status === 'wait') ? `更新` : `發佈`}
                </button>
            </div>
            ${gvc.bindView(() => {
                const id = gvc.glitter.getUUID()
                return {
                    bind: id,
                    view: () => {
                        return new Promise(async (resolve, reject) => {
                            resolve(html`
                                <div class="w-100">
                                    ${[

                                        [
                                            html`
                                                ${[
                                                    html`
                                                        <div class="row">
                                                            ${[EditorElem.editeInput({
                                                                title: title + '名稱',
                                                                gvc: gvc,
                                                                default: postMD.name,
                                                                callback: (text) => {
                                                                    postMD.name = text
                                                                },
                                                                placeHolder: `請輸入${title}名稱`
                                                            }),
                                                                EditorElem.editeInput({
                                                                    title: '作者名稱',
                                                                    gvc: gvc,
                                                                    default: postMD.created_by,
                                                                    callback: (text) => {
                                                                        postMD.created_by = text
                                                                    },
                                                                    placeHolder: '請輸入作者名稱'
                                                                }),
                                                                EditorElem.editeInput({
                                                                    title: '版本號碼',
                                                                    gvc: gvc,
                                                                    default: postMD.version,
                                                                    callback: (text) => {
                                                                        postMD.version = text
                                                                    },
                                                                    placeHolder: '請輸入版本號碼'
                                                                }),
                                                                EditorElem.select({
                                                                    title: '發佈至',
                                                                    gvc: gvc,
                                                                    def: postMD.post_to,
                                                                    array: [
                                                                        {
                                                                            title: '官方與個人模板庫',
                                                                            value: 'all'
                                                                        },
                                                                        {
                                                                            title: '個人模板庫',
                                                                            value: 'me'
                                                                        },
                                                                        {
                                                                            title: '專案資料夾',
                                                                            value: 'project'
                                                                        }
                                                                    ],
                                                                    callback: (text: string) => {
                                                                        postMD.post_to = text as any
                                                                    }
                                                                })].map((dd) => {
                                                                return `<div class="col-12 ">${dd}</div>`
                                                            }).join('')}
                                                        </div>`,
                                                    `${EditorElem.h3(title + '標籤')}
                                                    ${
                                                            gvc.bindView(() => {
                                                                const id = gvc.glitter.getUUID()

                                                                function refreshTag() {
                                                                    gvc.notifyDataChange(id)
                                                                }

                                                                return {
                                                                    bind: id,
                                                                    view: () => {

                                                                        return html`
                                                                            ${postMD.tag.map((dd: any, index: number) => {
                                                                                return ` <div class="badge bg-warning text-dark btn "
                                                                                 ><i
                                                                                    class="fa-regular fa-circle-minus me-1 text-danger fw-bold" onclick="${gvc.event(() => {
                                                                                    postMD.tag.splice(index, 1)
                                                                                    refreshTag()
                                                                                })}"></i>${dd}
                                                                            </div>`
                                                                            }).join('')}
                                                                            <div class="badge  btn "
                                                                                 style="background: #295ed1;"
                                                                                 onclick="${gvc.event(() => {
                                                                                     EditorElem.openEditorDialog(gvc, (gvc) => {
                                                                                         let label = ''
                                                                                         return `<div class="p-2">${EditorElem.editeInput({
                                                                                             gvc: gvc,
                                                                                             title: '標籤名稱',
                                                                                             default: label,
                                                                                             placeHolder: '請輸入標籤名稱',
                                                                                             callback: (text) => {
                                                                                                 label = text;
                                                                                             },
                                                                                         })}</div>
<div class="w-100 border-top p-2 d-flex align-items-center justify-content-end">
<button class="btn btn-primary" style="height:35px;width:80px;" onclick="${gvc.event(() => {
                                                                                             postMD.tag.push(label)
                                                                                             refreshTag()
                                                                                             gvc.closeDialog()
                                                                                         })}">確認新增</button>
</div>
`
                                                                                     }, () => {
                                                                                     }, 400, '新增標籤')
                                                                                 })}"><i
                                                                                    class="fa-regular fa-circle-plus me-1"></i>新增標籤
                                                                            </div>`
                                                                    },
                                                                    divCreate: {
                                                                        class: `w-100 d-flex flex-wrap bg-secondary p-3`,
                                                                        style: `gap:5px;`
                                                                    }
                                                                }
                                                            })
                                                    } 
                                                     `,
                                                    EditorElem.editeText({
                                                        gvc: gvc,
                                                        title: title + "描述",
                                                        placeHolder: `請輸入${title}描述`,
                                                        default: postMD.desc,
                                                        callback: (text) => {
                                                            postMD.desc = text
                                                        }
                                                    }),
                                                    gvc.bindView(() => {
                                                        const id = gvc.glitter.getUUID()
                                                        return {
                                                            bind: id,
                                                            view: () => {
                                                                return EditorElem.h3(html`
                                                                            <div class="d-flex align-items-center"
                                                                                 style="gap:10px;">${title}圖片 [ 首張圖片為預覽圖
                                                                                ]
                                                                                <div class="d-flex align-items-center justify-content-center rounded-3"
                                                                                     style="height: 30px;width: 80px;
">
                                                                                    <button class="btn ms-2 btn-primary-c ms-2"
                                                                                            style="height: 30px;width: 80px;"
                                                                                            onclick="${gvc.event(() => {
                                                                                                EditorElem.uploadFileFunction({
                                                                                                    gvc: gvc,
                                                                                                    callback: (text) => {
                                                                                                        postMD.image.push(text)
                                                                                                        gvc.notifyDataChange(id)
                                                                                                    },
                                                                                                    type: `image/*, video/*`
                                                                                                })
                                                                                            })}">添加圖檔
                                                                                    </button>
                                                                                </div>
                                                                            </div>`) + html`
                                                                            <div class="my-2"></div>` +
                                                                        EditorElem.flexMediaManager({
                                                                            gvc: gvc,
                                                                            data: postMD.image
                                                                        })
                                                            },
                                                            divCreate: {}
                                                        }
                                                    })
                                                ].join('')}
                                            `
                                        ].join('<div class="my-2"></div>'),
                                        `<div class="border-top  pt-2 mt-n2 align-items-center justify-content-end ${(postMD.status === 'finish' || postMD.status === 'wait') ? `d-flex` : `d-none`}">
 <div class="btn btn-danger" style="height:35px;width:100px;" onclick="${gvc.event(() => {
                                            postMD.post_to = 'cancel'
                                            const dialog = new ShareDialog(gvc.glitter)
                                            dialog.checkYesOrNot({
                                                callback: (response) => {
                                                    response && save()
                                                },
                                                text: '是否確認取消發佈?'
                                            })

                                        })}"><i class="fa-regular fa-trash-can me-2"></i>取消發佈</div>
</div>`,
                                        `<div style="height:50px;"></div>`
                                    ].join(``)}
                                </div>`)
                        })
                    },
                    divCreate: {
                        class: `d-flex flex-column flex-column-reverse  flex-md-row p-2 pb-5`, style: `
                    gap:10px;max-height:calc(100vh - 170px);overflow-y:auto;overflow-x:hidden;`
                    }
                }
            })}`
    }

    public static checkFinish: ((callback: () => void) => void) = (callback) => {
        callback()
    }

    public static basicSetting(gvc: GVC, editData: any, docID: string, viewModel: any) {
        const dialog = new ShareDialog(gvc.glitter)
        gvc.glitter.share.editorViewModel.data.page_config.resource_from = gvc.glitter.share.editorViewModel.data.page_config.resource_from ?? 'global'
        gvc.glitter.share.editorViewModel.data.page_config.list = gvc.glitter.share.editorViewModel.data.page_config.list ?? [];
        gvc.glitter.share.editorViewModel.data.page_config.version = gvc.glitter.share.editorViewModel.data.page_config.version ?? 'v2'

        function save() {
            ApiPageConfig.setPage({
                id: (viewModel.data! as any).id,
                appName: (window as any).appName,
                tag: (viewModel.data! as any).tag,
                name: (viewModel.data! as any).name,
                config: (viewModel.data! as any).config,
                group: (viewModel.data! as any).group,
                page_config: (viewModel.data! as any).page_config,
                page_type: (viewModel.data! as any).page_type,
                preview_image: (viewModel.data! as any).preview_image,
                favorite: (viewModel.data! as any).favorite,
            }).then(async (api) => {
                viewModel.appConfig.homePage = viewModel.homePage;
                await StoreHelper.setPlugin(viewModel.originalConfig, viewModel.appConfig)
                gvc.glitter.setUrlParameter('page', (viewModel.data! as any).tag)
                location.reload()
            })
        }

        PageSettingView.checkFinish = (callback: () => void) => {
            if (
                JSON.stringify(editData) !== JSON.stringify(gvc.glitter.share.editorViewModel.data)
            ) {
                dialog.checkYesOrNot({
                    callback: (response) => {
                        if (!response) {
                            PageSettingView.checkFinish = (callback) => {
                                callback()
                            }
                            callback()
                        } else {
                            save()
                        }
                    },
                    text: '內容已變更，是否儲存?'
                })
            } else {
                PageSettingView.checkFinish = (callback) => {
                    callback()
                }
                callback()
            }
        }
        const html = String.raw
        return html`
            <div class="position-relative" style="">
                <div class="position-relative bgf6 d-flex align-items-center justify-content-between m-n2 p-2 border-bottom shadow">
                    <span class="fs-6 fw-bold " style="color:black;">基本設定</span>
                    <button class="btn btn-primary-c "
                            style="height: 28px;width:40px;font-size:14px;"
                            onclick="${gvc.event(() => {
                                save()
                            })}">儲存
                    </button>
                </div>
                <div class="pt-3 justify-content-start px-2 "
                     style="">
                    ${
                            [
                                (() => {
                                    let view: any = [
                                        EditorElem.h3('頁面類型'),
                                        ` <div class="">
                               ${EditorElem.select({
                                            title: '',
                                            gvc: gvc,
                                            def: editData.page_type,
                                            array: EditorConfig.page_type_list,
                                            callback: (text: string) => {
                                                editData.page_type = text as any
                                                gvc.notifyDataChange(docID)
                                            }
                                        })}
                           </div>`,
                                        EditorElem.h3('是否開放內容編輯'),
                                        EditorElem.select({
                                            title: '',
                                            gvc: gvc,
                                            def: editData.page_config.support_editor || 'false',
                                            array: [
                                                { title: '是',value: 'true' },
                                                { title: '否', value: 'false' }
                                            ],
                                            callback: (text: string) => {
                                                editData.page_config.support_editor = text as any
                                                gvc.notifyDataChange(docID)
                                            }
                                        })
                                    ]
                                    const title = EditorConfig.page_type_list.find((dd) => {
                                        return editData.page_type === dd.value
                                    })!.title;
                                    editData.page_type = editData.page_type ?? 'page';
                                    ((editData.page_type === 'page') || (editData.page_type === 'blog')) && view.push(EditorElem.select({
                                        title: "設為首頁",
                                        gvc: gvc,
                                        def: (viewModel.homePage === editData.tag) ? `true` : `false`,
                                        array: [{
                                            title: "是",
                                            value: 'true'
                                        }, {
                                            title: "否",
                                            value: 'false'
                                        }],
                                        callback: (text) => {
                                            if (text === 'true') {
                                                viewModel.homePage = editData.tag
                                                editData.page_config.seo.type = 'custom'
                                            } else {
                                                viewModel.homePage = undefined
                                            }
                                            gvc.notifyDataChange(docID)
                                        }
                                    }));
                                    if (editData.page_type === 'article') {
                                        editData.page_config.template_type = editData.page_config.template_type ?? 'blog'
                                        view.push(EditorElem.select({
                                            title: "樣板類型",
                                            gvc: gvc,
                                            def: (['blog', 'product'].indexOf(editData.page_config.template_type) === -1) ? `tag` : editData.page_config.template_type,
                                            array: [{
                                                title: "網誌頁面",
                                                value: 'blog'
                                            }, {
                                                title: "商品頁面",
                                                value: 'product'
                                            }
                                            ],
                                            callback: (text) => {
                                                editData.page_config.template_type = text
                                                gvc.notifyDataChange(docID)
                                            }
                                        }))
                                    }
                                    view.push(EditorElem.editeInput({
                                        gvc: gvc,
                                        title: `${title}標籤`,
                                        placeHolder: `請輸入${title}標籤`,
                                        default: editData.tag,
                                        callback: (text) => {
                                            editData.tag = text
                                        }
                                    }))
                                    view.push(EditorElem.editeInput({
                                        gvc: gvc,
                                        title: `${title}名稱`,
                                        placeHolder: `請輸入${title}名稱`,
                                        default: editData.name,
                                        callback: (text) => {
                                            editData.name = text
                                        }
                                    }))
                                    view.push(EditorElem.searchInput({
                                        title: `${title}分類`,
                                        gvc: gvc,
                                        def: editData.group,
                                        array: (() => {
                                            let group: string[] = []
                                            viewModel.dataList.map((dd: any) => {
                                                if ((group.indexOf(dd.group) === -1) && dd.page_type === editData.page_type) {
                                                    group.push(dd.group)
                                                }
                                            });
                                            return group
                                        })(),
                                        callback: (text: string) => {
                                            editData.group = text
                                            gvc.notifyDataChange(docID)
                                        },
                                        placeHolder: `請輸入${title}分類`
                                    }))
                                    editData.page_config.resource_from = editData.page_config.resource_from ?? 'global'
                                    view.push(EditorElem.select({
                                        title: '渲染模式',
                                        gvc: gvc,
                                        def: editData.page_config.resource_from,
                                        callback: (text: string) => {
                                            editData.page_config.resource_from = text;
                                        },
                                        array: [{
                                            title: '導入全局樣式',
                                            value: 'global'
                                        }, {
                                            title: `Iframe`,
                                            value: 'own'
                                        }]
                                    }))
                                    return view.join('')
                                })(),
                                html`
                                    <button class="w-100 bg-danger btn btn-danger mt-3" onclick="${gvc.event(() => {
                                        EditorElem.openEditorDialog(gvc, (gvc) => {
                                            return gvc.bindView(() => {
                                                const id = gvc.glitter.getUUID();
                                                let checkText = ''
                                                return {
                                                    bind: id,
                                                    view: () => {
                                                        return `<lottie-player
  autoplay
  loop
  mode="normal"
  src="${new URL('../lottie/error.json', import.meta.url)}"
  style="width: 200px;"
  class=""
>
</lottie-player>
<div class="alert alert-danger w-100" style="word-break: break-all;white-space: normal;"><strong>請注意</strong>，頁面刪除後即無法復原，請警慎進行操作。</div>
<input placeholder="請輸入『 我要刪除 』後按下確認刪除" class="form-control" onchange="${gvc.event((e, event) => {
                                                            checkText = e.value;
                                                        })}"></input>
<div class="btn btn-danger w-100 mt-2" onclick="${gvc.event(() => {
                                                            const dialog = new ShareDialog(gvc.glitter)
                                                            if (checkText !== '我要刪除') {
                                                                dialog.errorMessage({text: "請輸入我要刪除"})
                                                            } else {
                                                                dialog.checkYesOrNot({
                                                                    callback: (response) => {
                                                                        if (response) {
                                                                            dialog.dataLoading({visible: true})
                                                                            ApiPageConfig.deletePage({
                                                                                "id": gvc.glitter.share.editorViewModel.data.id,
                                                                                "appName": (window as any).appName,
                                                                            }).then((data) => {
                                                                                dialog.dataLoading({visible: false})
                                                                                location.reload()
                                                                            })
                                                                        }
                                                                    },
                                                                    text: "是否確認刪除頁面?"
                                                                })
                                                            }
                                                        })}">確認刪除</div>
`
                                                    },
                                                    divCreate: {
                                                        class: `flex-column p-2 d-flex align-items-center justify-content-center`,
                                                        style: ``
                                                    }
                                                }
                                            })
                                        }, () => {
                                        }, 400)
                                    })}">刪除頁面
                                    </button>
                                `
                            ].map((dd) => {
                                return `<div class="">${dd}</div>`
                            }).join(``)}
                </div>
            </div>`
    }

    public static seoSetting(obj: {
        gvc: GVC,
        id: string,
        vid: string,
        viewModel: any,
        style?: {
            style?: string,
            class?: string
        },
        hiddenDelete?: boolean,
        page_select?: boolean
    }) {
        const html = String.raw
        const gvc = obj.gvc;
        const viewModel = obj.viewModel;
        const docID = obj.id
        const glitter = gvc.glitter;
        const dialog = new ShareDialog(gvc.glitter)
        // gvc.glitter.share.editorViewModel.data.page_config.seo = gvc.glitter.share.editorViewModel.data.page_config.seo ?? {"type": "def"}

        function save() {
            ApiPageConfig.setPage({
                id: viewModel.selectItem.id,
                appName: (window as any).appName,
                tag: viewModel.selectItem.tag,
                name: viewModel.selectItem.name,
                config: viewModel.selectItem.config,
                group: viewModel.selectItem.group,
                page_config: viewModel.selectItem.page_config,
                page_type: viewModel.selectItem.page_type,
                preview_image: viewModel.selectItem.preview_image,
                favorite: viewModel.selectItem.favorite,
            }).then((api) => {
                gvc.glitter.setUrlParameter('page', viewModel.selectItem.tag)
                location.reload()
            })
        }

        const desc = (document.querySelector(`[name="description"]`) && document.querySelector(`[name="description"]`)!.getAttribute('content')) || '尚未設定描述'
        PageSettingView.checkFinish = (callback: () => void) => {
            if (
                JSON.stringify(viewModel.selectItem) !== JSON.stringify(gvc.glitter.share.editorViewModel.data)
            ) {
                dialog.checkYesOrNot({
                    callback: (response) => {
                        if (!response) {
                            PageSettingView.checkFinish = (callback) => {
                                callback()
                            }
                            callback()
                        } else {
                            save()
                        }
                    },
                    text: '內容已變更，是否儲存?'
                })
            } else {
                PageSettingView.checkFinish = (callback) => {
                    callback()
                }
                callback()
            }
        }
        return [html`
            <div class="mt-n2 position-relative bgf6 d-flex align-items-center justify-content-between  p-2 py-3 border-bottom shadow">
                <span class="fs-6 fw-bold " style="color:black;">SEO設定</span>
                <button class="btn btn-primary-c "
                        style="height: 28px;width:40px;font-size:14px;"
                        onclick="${gvc.event(() => {
                            save()
                        })}">儲存
                </button>
            </div>`,
            (obj.page_select) ? gvc.bindView(() => {
                const menuID = gvc.glitter.getUUID()
                let visible = false
                return {
                    bind: menuID,
                    view: () => {
                        return html`
                            <div class="">${EditorElem.h3('選擇頁面')}</div>
                            <div class="d-flex align-items-center">
                                <div class="btn-group ms-0" style="max-width: 400px;min-width: 250px;">
                                    <button type="button" class="btn btn-outline-secondary rounded  bg-white"
                                            onclick="${gvc.event(() => {
                                                visible = !visible
                                                gvc.notifyDataChange(menuID)
                                            })}">
                                        <span style="max-width: 180px;overflow: hidden;text-overflow: ellipsis;">${gvc.glitter.share.editorViewModel.data.name}</span>
                                        <i class="fa-sharp fa-solid fa-caret-down position-absolute translate-middle-y"
                                           style="top: 50%;right: 20px;"></i>
                                    </button>
                                    ${
                                            gvc.bindView(() => {
                                                const id = gvc.glitter.getUUID()
                                                return {
                                                    bind: id,
                                                    view: () => {
                                                        return html`
                                                            <ul class="list-group list-group-flush ">
                                                                ${(() => {
                                                                    return gvc.bindView(() => {
                                                                        const pdID = gvc.glitter.getUUID()
                                                                        return {
                                                                            bind: pdID,
                                                                            view: () => {
                                                                                return new Promise((resolve, reject) => {
                                                                                    PageEditor.pageSelctor(gvc, (d3: any) => {
                                                                                        glitter.setUrlParameter('page', d3.tag)
                                                                                        glitter.share.reloadEditor()
                                                                                    }, {
                                                                                        filter: (data) => {
                                                                                            return (data.page_type != 'module') && (data.page_type != 'article')
                                                                                        }
                                                                                    }).then((data) => {
                                                                                        resolve(data.left)
                                                                                    })
                                                                                })
                                                                            },
                                                                            divCreate: {}
                                                                        }
                                                                    })
                                                                })()}
                                                            </ul>`
                                                    },
                                                    divCreate: {
                                                        class: `dropdown-menu ${(visible) ? `show` : ''}`,
                                                        style: 'margin-top: 45px;max-height: calc(100vh - 100px);width:300px;overflow-y: scroll;',
                                                        option: [
                                                            {key: 'id', value: 'topd'}
                                                        ]
                                                    },
                                                    onCreate: () => {
                                                        $('.tooltip')!.remove();
                                                        ($('[data-bs-toggle="tooltip"]') as any).tooltip();
                                                    }
                                                }
                                            })
                                    }
                                </div>
                                <div class="d-flex align-items-center justify-content-center hoverBtn ms-1 me-2 border bg-white
${(glitter.share.editorViewModel.homePage === glitter.getUrlParameter('page')) ? `d-none` : ``}
"
                                     style="height:43px;width:43px;border-radius:10px;cursor:pointer;color:#151515;"
                                     data-bs-toggle="tooltip" data-bs-placement="top"
                                     data-bs-custom-class="custom-tooltip" data-bs-title="前往首頁"
                                     onclick="${gvc.event(() => {
                                         const url = new URL(location.href)
                                         url.searchParams.set('page', glitter.share.editorViewModel.homePage);
                                         location.href = url.href;
                                     })}">
                                    <i class="fa-regular fa-house"></i>
                                </div>
                            </div>
                        `
                    },
                    divCreate: {
                        class: 'mx-3'
                    }
                }
            }) : ``,
            obj.gvc.bindView(() => {
                return {
                    bind: obj.id,
                    view: () => {
                        const editData = obj.viewModel.selectItem;
                        return gvc.bindView(() => {
                            const id = glitter.getUUID()
                            return {
                                bind: id,
                                view: () => {
                                    editData.page_config.seo = editData.page_config.seo ?? {}
                                    const seo = editData.page_config.seo
                                    seo.type = seo.type ?? "def"
                                    if (editData.tag === gvc.glitter.share.editorViewModel.homePage) {
                                        seo.type = 'custom'
                                    }
                                    return html`
                                        ${BgWidget.card([`<div class="fs-sm fw-500 d-flex align-items-center justify-content-between mb-2 ">搜尋引擎預覽
</div>`,
                                            `<div class="fs-6 fw-500" style="color:#1a0dab;white-space: normal;">${document.title || '尚未設定'}</div>`,
                                            `<div class="fs-sm fw-500" style="color:#006621;white-space: normal;">${(() => {
                                                const url = new URL("", (glitter.share.editorViewModel.domain) ? `https://${glitter.share.editorViewModel.domain}/` : location.href)
                                                url.search = ''
                                                url.searchParams.set("page", glitter.getUrlParameter("page"))
                                                if (!gvc.glitter.share.editorViewModel.domain) {
                                                    url.searchParams.set('appName', (window as any).appName)
                                                }
                                                return url.href
                                            })()}</div>`,
                                            `<div class="fs-sm fw-500" style="color:#545454;white-space: normal;">${desc}</div>`
                                        ].join(''), `p-3 bg-white rounded-3 shadow border  mt-2`)}
                                        ${((editData.page_type === 'page') || (editData.page_type === 'blog')) ? (EditorElem.select({
                                            title: "設為首頁",
                                            gvc: gvc,
                                            def: (gvc.glitter.share.editorViewModel.homePage === editData.tag) ? `true` : `false`,
                                            array: [{
                                                title: "是",
                                                value: 'true'
                                            }, {
                                                title: "否",
                                                value: 'false'
                                            }],
                                            callback: (text) => {
                                                if (text === 'true') {
                                                    gvc.glitter.share.editorViewModel.homePage = editData.tag
                                                    seo.type = 'custom'
                                                } else {
                                                    gvc.glitter.share.editorViewModel.homePage = undefined
                                                }
                                                gvc.notifyDataChange(docID)
                                            }
                                        })) : ''}
                                        ${(editData.tag === gvc.glitter.share.editorViewModel.homePage) ? `` : EditorElem.h3('SEO參照')}
                                        <select class="mt-2 form-select form-control ${(editData.tag === gvc.glitter.share.editorViewModel.homePage) && 'd-none'}"
                                                onchange="${gvc.event((e) => {
                                                    seo.type = e.value
                                                    gvc.notifyDataChange(id)
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
                                            def: seo.logo ?? "",
                                            callback: (data) => {
                                                seo.logo = data
                                            }
                                        }),
                                            uploadImage({
                                                gvc: gvc,
                                                title: `預覽圖片`,
                                                def: seo.image ?? "",
                                                callback: (data) => {
                                                    seo.image = data
                                                }
                                            }),
                                            EditorElem.editeInput({
                                                gvc: gvc,
                                                title: "網頁標題",
                                                default: seo.title ?? "",
                                                placeHolder: "請輸入網頁標題",
                                                callback: (text: string) => {
                                                    seo.title = text
                                                }
                                            }),
                                            EditorElem.editeText({
                                                gvc: gvc,
                                                title: "網頁描述",
                                                default: seo.content ?? "",
                                                placeHolder: "請輸入網頁標題",
                                                callback: (text: string) => {
                                                    seo.content = text
                                                }
                                            }),
                                            EditorElem.editeText({
                                                gvc: gvc,
                                                title: "關鍵字設定",
                                                default: seo.keywords ?? "",
                                                placeHolder: "關鍵字設定",
                                                callback: (text: string) => {
                                                    seo.keywords = text
                                                }
                                            }),
                                            EditorElem.htmlEditor({
                                                gvc: gvc,
                                                title: `網頁代碼`,
                                                initial: seo.code ?? "",
                                                callback: (text) => {
                                                    seo.code = text
                                                    console.log(text)
                                                },
                                                height: 200
                                            })
                                        ])}
                                    `
                                },
                                divCreate: {
                                    style: `${obj.page_select ? `overflow-y:hidden;padding-bottom:50px;` : `max-height:calc(100vh - 170px);overflow-y:auto;`}overflow-x:hidden;`,
                                    class: `px-2`
                                }
                            }
                        })
                    },
                    divCreate: () => {
                        return {
                            class: `mx-2 d-flex flex-column position-relative ${obj.style?.class ?? ""}`,
                            style: `${obj.style?.style ?? ""}`
                        }
                    },
                    onCreate: () => {
                    }
                }
            })].join('')
    }

}

function uploadImage(obj: {
    title: string,
    gvc: any, def: string, callback: (data: string) => void
}) {
    obj.gvc.addStyle(`.p-hover-image:hover{
  opacity: 1 !important; /* 在父元素悬停时，底层元素可见 */
}`)
    const glitter = (window as any).glitter
    const id = glitter.getUUID()
    return obj.gvc.bindView(() => {
        return {
            bind: id,
            view: () => {
                return `<h3 style="font-size: 15px;margin-bottom: 10px;" class="mt-2 fw-500">${obj.title}</h3>
                            <div class="d-flex align-items-center mb-3">
                                <input class="flex-fill form-control "  placeholder="請輸入圖片連結" value="${obj.def}" onchange="${obj.gvc.event((e: any) => {
                    obj.callback(e.value)
                    obj.def = e.value
                    obj.gvc.notifyDataChange(id)
                })}">
                                <div class="" style="width: 1px;height: 25px;background-"></div>
                                <i class="fa-regular fa-upload text-dark ms-2" style="cursor: pointer;" onclick="${obj.gvc.event(() => {
                    glitter.ut.chooseMediaCallback({
                        single: true,
                        accept: 'json,image/*',
                        callback(data: any) {
                            const saasConfig: {
                                config: any,
                                api: any
                            } = (window as any).saasConfig
                            const dialog = new ShareDialog(obj.gvc.glitter)
                            dialog.dataLoading({visible: true})
                            const file = data[0].file
                            saasConfig.api.uploadFile(file.name).then((data: any) => {
                                dialog.dataLoading({visible: false})
                                const data1 = data.response
                                dialog.dataLoading({visible: true})
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
                                        dialog.dataLoading({visible: false})
                                        obj.callback(data1.fullUrl)
                                        obj.def = data1.fullUrl
                                        obj.gvc.notifyDataChange(id)
                                    },
                                    error: (err) => {
                                        dialog.dataLoading({visible: false})
                                        dialog.errorMessage({text: "上傳失敗"})
                                    },
                                });
                            })
                        }
                    });
                })}"></i>
                            </div>
                            ${obj.def && `
<div class="d-flex align-items-center justify-content-center rounded-3 shadow"  style="min-width:100px;width:100px;height:100px;cursor:pointer;
background: 50%/cover url('${obj.def}');
">
<div class="w-100 h-100 d-flex align-items-center justify-content-center rounded-3 p-hover-image" style="opacity:0;background: rgba(0,0,0,0.5);gap:20px;color:white;font-size:22px;">
<i class="fa-regular fa-eye" onclick="${obj.gvc.event(() => {
                    obj.gvc.glitter.openDiaLog(new URL('../dialog/image-preview.js', import.meta.url).href, 'preview', obj.def)
                })}"></i>
</div>
</div>`}

`
            },
            divCreate: {}
        }
    })
}

function deepEqual(obj1: any, obj2: any) {
    if (obj1 === obj2) {
        return true
    }
    // 检查两个对象的类型
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
        return false;
    }

    // 获取两个对象的属性名数组
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    // 检查属性数量是否相同
    if (keys1.length !== keys2.length) {
        console.log(`長度不同:${keys1.length}-${keys2.length}`)
        console.log(`keys1`, keys1)
        console.log(`keys2`, keys2)
        return false;
    }

    // 逐一比较每个属性的值
    for (let key of keys1) {
        // 递归比较嵌套对象
        if (!deepEqual(obj1[key], obj2[key])) {
            console.log(`obj1[key]-`, obj1[key])
            console.log(`obj2[key]-`, obj2[key])
            console.log(`內容不同-${key}:${obj1[key]}-${obj2[key]}`,)
            return false;
        }
    }

    // 如果所有属性的值都相同，则两个对象相同
    return true;
}

(window as any).glitter.setModule(import.meta.url, PageSettingView)
