var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BgWidget } from '../backend-manager/bg-widget.js';
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
const html = String.raw;
export class TableSet {
    static main(gvc) {
        const glitter = gvc.glitter;
        const id = gvc.glitter.getUUID();
        function refresh() {
            gvc.notifyDataChange(id);
        }
        const vm = {
            loading: false,
            appData: {}
        };
        (ApiUser.getPublicConfig('store-information', 'manager')).then((res) => {
            vm.appData = res.response.value;
            gvc.notifyDataChange(id);
        });
        return gvc.bindView({
            bind: id,
            view: () => {
                if (vm.loading) {
                    return ``;
                }
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    const appData = vm.appData;
                    appData.pos_table = (_a = appData.pos_table) !== null && _a !== void 0 ? _a : [];
                    resolve([
                        html `
                            <div class="my-3"
                                 style="color: #393939; font-size: 24px; font-weight: 700; word-wrap: break-word;">
                                桌位設定
                            </div>`,
                        BgWidget.card(EditorElem.arrayItem({
                            gvc: gvc,
                            title: '',
                            customEditor: true,
                            array: (() => {
                                return appData.pos_table.map((dd) => {
                                    return {
                                        title: dd.title,
                                        innerHtml: (gvc) => {
                                            const vm = dd;
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
                                                                vm.title = text;
                                                            }
                                                        })
                                                    ].join('');
                                                },
                                                footer_html: (gvc) => {
                                                    return html `
                                                <div class="d-flex justify-content-end align-items-center"
                                                     style="gap:10px;">
                                                    ${BgWidget.cancel(gvc.event(() => {
                                                        gvc.closeDialog();
                                                    }))}
                                                    ${BgWidget.save(gvc.event(() => {
                                                        gvc.closeDialog();
                                                        refresh();
                                                    }))}
                                                </div>`;
                                                }
                                            });
                                            return ``;
                                        }
                                    };
                                });
                            }),
                            copyable: false,
                            originalArray: [],
                            draggable: false,
                            expand: {},
                            refreshComponent: () => {
                                refresh();
                            },
                            minusEvent: (data, index) => {
                                appData.pos_table.splice(index, 1);
                                refresh();
                            },
                            plus: {
                                title: '新增桌位',
                                event: gvc.event(() => {
                                    const vm = {
                                        title: ''
                                    };
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
                                                        vm.title = text;
                                                    }
                                                })
                                            ].join('');
                                        },
                                        footer_html: (gvc) => {
                                            return html `
                                                <div class="d-flex justify-content-end align-items-center"
                                                     style="gap:10px;">
                                                    ${BgWidget.cancel(gvc.event(() => {
                                                gvc.closeDialog();
                                            }))}
                                                    ${BgWidget.save(gvc.event(() => {
                                                appData.pos_table.push(vm);
                                                gvc.closeDialog();
                                                refresh();
                                            }))}
                                                </div>`;
                                        }
                                    });
                                })
                            }
                        })),
                        `<div class="update-bar-container">
                                    ${BgWidget.save(gvc.event(() => {
                            const dialog = new ShareDialog(gvc.glitter);
                            dialog.dataLoading({ visible: true });
                            ApiUser.setPublicConfig({
                                key: 'store-information', user_id: 'manager',
                                value: JSON.stringify(appData)
                            }).then((res) => {
                                dialog.dataLoading({ visible: false });
                                dialog.successMessage({ text: '儲存成功' });
                            });
                        }))}
                                </div>`
                    ].join(''));
                }));
            },
            divCreate: {
                class: `mx-2 `
            }
        });
    }
}
window.glitter.setModule(import.meta.url, TableSet);
