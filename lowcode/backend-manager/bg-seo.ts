import {BgWidget} from "./bg-widget.js";
import {GVC} from "../glitterBundle/GVController.js";
import {PageEditor} from "../editor/page-editor.js";
import {ApiPageConfig} from "../api/pageConfig.js";
import {ShareDialog} from "../dialog/ShareDialog.js";
import {StoreHelper} from "../helper/store-helper.js";


const html = String.raw

export class BgSeo {
    public static mainPage(gvc: GVC) {
        let selectTag = gvc.glitter.getUrlParameter('page')
        const leftID = gvc.glitter.getUUID()
        const rightID = gvc.glitter.getUUID()
        let saveEvent = () => {

        }
        return BgWidget.container(html`
            <div class="d-flex w-100 align-items-center pb-3 mb-2 border-bottom">
                ${BgWidget.title(`SEO管理`)}
                <div class="flex-fill"></div>
                <button class="btn btn-primary-c" style="height:38px;font-size: 14px;" onclick="${gvc.event(() => {
                    saveEvent()
                })}">儲存SEO設定
                </button>
            </div>
            <div class="d-flex" style="gap:10px;">
                <div style="width:300px;" class="">
                    ${BgWidget.card(gvc.bindView(() => {
                        return {
                            bind: leftID,
                            view: () => {
                                return new Promise((resolve, reject) => {
                                    PageEditor.pageSelctor(gvc, (d3: any) => {
                                        selectTag = d3.tag;
                                        gvc.notifyDataChange([leftID, rightID])
                                    }, {
                                        checkSelect: (data: any) => {
                                            return data.tag === selectTag
                                        }
                                    }).then((data) => {
                                        resolve(data.left)
                                    })
                                })
                            },
                            divCreate: {
                                class: `mx-n3 my-n2`, style: `max-height:calc(100vh - 200px);overflow-y:auto;`
                            }
                        }
                    }))}
                </div>
                <div class="flex-fill">
                    ${BgWidget.card(gvc.bindView(() => {
                        return {
                            bind: rightID,
                            view: () => {
                                return new Promise(async (resolve, reject) => {
                                    const dialog = new ShareDialog(gvc.glitter)
                                    dialog.dataLoading({visible: true})
                                    const selectItem = (await ApiPageConfig.getPage({
                                        appName:(window as any).appName,
                                        tag:selectTag
                                    } )).response.result[0]
                                    dialog.dataLoading({visible: false})
                                    saveEvent = async () => {
                                        dialog.dataLoading({visible: true})
                                        const savePage = await ApiPageConfig.setPage({
                                            id: selectItem.id,
                                            appName: (window as any).appName,
                                            tag: selectItem.tag,
                                            name: selectItem.name,
                                            config: selectItem.config,
                                            group: selectItem.group,
                                            page_config: selectItem.page_config
                                        })
                                        const viewModel = gvc.glitter.share.editorViewModel
                                        viewModel.appConfig.homePage = viewModel.homePage
                                        viewModel.appConfig.globalStyle = viewModel.globalStyle
                                        viewModel.appConfig.globalScript = viewModel.globalScript
                                        viewModel.appConfig.globalValue = viewModel.globalValue
                                        viewModel.appConfig.globalStyleTag = viewModel.globalStyleTag
                                        const savePlugin = await StoreHelper.setPlugin(viewModel.originalConfig, viewModel.appConfig)
                                        dialog.dataLoading({visible: false})
                                        if (savePage.result && savePlugin) {
                                            dialog.successMessage({text: '儲存成功'})
                                        } else {
                                            dialog.errorMessage({text: '發生異常'})
                                        }
                                        if (gvc.glitter.getUrlParameter('page') === selectTag) {
                                            gvc.glitter.share.reloadEditor()
                                        }
                                    }
                                    resolve(PageEditor.pageEditorView({
                                        gvc: gvc,
                                        id: gvc.glitter.getUUID(),
                                        vid: '',
                                        viewModel: {
                                            get selectItem() {
                                                return selectItem
                                            },
                                            get dataList() {
                                                return gvc.glitter.share.editorViewModel.dataList
                                            }
                                        },
                                        style: {
                                            style: `width:100%;`,
                                            class: ``
                                        },
                                        hiddenDelete: true
                                    }))
                                })
                            },
                            divCreate: {
                                style: `max-height:calc(100vh - 200px);overflow-y:auto;`
                            }
                        }
                    }), 'p-0 bg-white border rounded-3 shadow')}
                </div>
            </div>
        `, 1000)
    }
}