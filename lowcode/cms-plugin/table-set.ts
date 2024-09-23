import {GVC} from '../glitterBundle/GVController.js';
import {BgWidget} from '../backend-manager/bg-widget.js';
import {EditorElem} from '../glitterBundle/plugins/editor-elem.js';
import {ApiUser} from '../glitter-base/route/user.js';
import {ShareDialog} from '../glitterBundle/dialog/ShareDialog.js';
import {FilterOptions} from './filter-options.js';
import {BgListComponent} from '../backend-manager/bg-list-component.js';
import {CheckInput} from '../modules/checkInput.js';
import {Setting_editor} from '../jspage/function-page/setting_editor.js';
import {Tool} from '../modules/tool.js';
import {ApiShop} from '../glitter-base/route/shopping.js';
import {ApiDelivery} from '../glitter-base/route/delivery.js';

const html = String.raw;

export class TableSet {
    static main(gvc: GVC) {
        const glitter = gvc.glitter;
        const id = gvc.glitter.getUUID()

        function refresh() {
            gvc.notifyDataChange(id)
        }

        const vm: {
            loading: boolean,
            appData: any
        } = {
            loading: false,
            appData: {}
        };
        (ApiUser.getPublicConfig('store-information', 'manager')).then((res) => {
            vm.appData = res.response.value
            gvc.notifyDataChange(id)
        })
        return gvc.bindView({
            bind: id,
            view: () => {
                if (vm.loading) {
                    return ``
                }
                return new Promise(async (resolve, reject) => {
                    const appData = vm.appData;
                    appData.pos_table = appData.pos_table ?? []

                    resolve([
                        html`
                            <div class="my-3"
                                 style="color: #393939; font-size: 24px; font-weight: 700; word-wrap: break-word;">
                                桌位設定
                            </div>`,
                        BgWidget.card(EditorElem.arrayItem({
                            gvc: gvc,
                            title: '',
                            customEditor:true,
                            array: (() => {
                                return appData.pos_table.map((dd: any) => {
                                    return {
                                        title: dd.title,
                                        innerHtml:(gvc:GVC)=>{
                                            const vm=dd
                                            BgWidget.settingDialog({
                                                gvc: gvc,
                                                title: '新增桌位',
                                                innerHTML: (gvc) => {
                                                    return [
                                                        BgWidget.editeInput({
                                                            gvc: gvc,
                                                            title: '桌位名稱',
                                                            default: vm.title,
                                                            placeHolder: '選擇桌位',
                                                            callback: (text) => {
                                                                vm.title = text
                                                            }
                                                        })
                                                    ].join('')
                                                },
                                                footer_html: (gvc) => {
                                                    return html`
                                                <div class="d-flex justify-content-end align-items-center"
                                                     style="gap:10px;">
                                                    ${BgWidget.cancel(gvc.event(() => {
                                                        gvc.closeDialog()
                                                    }))}
                                                    ${BgWidget.save(gvc.event(() => {
                                                        gvc.closeDialog()
                                                        refresh()
                                                    }))}
                                                </div>`
                                                }
                                            })
                                            return ``
                                        }
                                    }
                                })
                            }),
                            copyable: false,
                            originalArray: [],
                            draggable:false,
                            expand: {},
                            refreshComponent: () => {
                                refresh()
                            },
                            minusEvent: (data, index) => {
                                appData.pos_table.splice(index, 1)
                                refresh()
                            },
                            plus: {
                                title: '新增桌位',
                                event: gvc.event(() => {
                                    const vm: {
                                        title: string
                                    } = {
                                        title: ''
                                    }
                                    BgWidget.settingDialog({
                                        gvc: gvc,
                                        title: '新增桌位',
                                        innerHTML: (gvc) => {
                                            return [
                                                BgWidget.editeInput({
                                                    gvc: gvc,
                                                    title: '桌位名稱',
                                                    default: vm.title,
                                                    placeHolder: '選擇桌位',
                                                    callback: (text) => {
                                                        vm.title = text
                                                    }
                                                })
                                            ].join('')
                                        },
                                        footer_html: (gvc) => {
                                            return html`
                                                <div class="d-flex justify-content-end align-items-center"
                                                     style="gap:10px;">
                                                    ${BgWidget.cancel(gvc.event(() => {
                                                        gvc.closeDialog()
                                                    }))}
                                                    ${BgWidget.save(gvc.event(() => {
                                                        appData.pos_table.push(vm)
                                                        gvc.closeDialog()
                                                        refresh()
                                                    }))}
                                                </div>`
                                        }
                                    })
                                })
                            }
                        })),
                        `<div class="update-bar-container">
                                    ${BgWidget.save(
                            gvc.event(() => {
                                const dialog=new ShareDialog(gvc.glitter)
                                dialog.dataLoading({visible: true})
                                ApiUser.setPublicConfig({
                                    key: 'store-information', user_id: 'manager',
                                    value: JSON.stringify(appData)
                                }).then((res) => {
                                    dialog.dataLoading({visible: false})
                                    dialog.successMessage({text: '儲存成功'})
                                })
                            })
                        )}
                                </div>`
                    ].join(''))
                })
            },
            divCreate: {
                class: `mx-2 `
            }
        });
    }
}

(window as any).glitter.setModule(import.meta.url, TableSet);
