var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BgWidget } from './bg-widget.js';
import { PageEditor } from '../editor/page-editor.js';
import { ApiPageConfig } from '../api/pageConfig.js';
import { ShareDialog } from '../dialog/ShareDialog.js';
import { StoreHelper } from '../helper/store-helper.js';
const html = String.raw;
export class BgSeo {
    static mainPage(gvc) {
        let selectTag = gvc.glitter.getUrlParameter('page');
        const leftID = gvc.glitter.getUUID();
        const rightID = gvc.glitter.getUUID();
        let saveEvent = () => { };
        return BgWidget.container(html `
            <div class="d-flex w-100 align-items-center pb-3 mb-2 border-bottom">
                ${BgWidget.title(`SEO管理`)}
                <div class="flex-fill"></div>
                <button
                    class="btn btn-primary-c"
                    style="height:38px;font-size: 14px;"
                    onclick="${gvc.event(() => {
            saveEvent();
        })}"
                >
                    儲存SEO設定
                </button>
            </div>
            <div class="d-flex" style="gap:10px;">
                <div style="width:300px;" class="">
                    ${BgWidget.card(gvc.bindView(() => {
            return {
                bind: leftID,
                view: () => {
                    return new Promise((resolve, reject) => {
                        PageEditor.pageSelctor(gvc, (d3) => {
                            selectTag = d3.tag;
                            gvc.notifyDataChange([leftID, rightID]);
                        }, {
                            checkSelect: (data) => {
                                return data.tag === selectTag;
                            },
                        }).then((data) => {
                            resolve(data.left);
                        });
                    });
                },
                divCreate: {
                    class: `mx-n3 my-n2`,
                    style: `max-height:calc(100vh - 200px);overflow-y:auto;`,
                },
            };
        }))}
                </div>
                <div class="flex-fill">
                    ${BgWidget.card(gvc.bindView(() => {
            return {
                bind: rightID,
                view: () => {
                    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                        const dialog = new ShareDialog(gvc.glitter);
                        dialog.dataLoading({ visible: true });
                        const selectItem = (yield ApiPageConfig.getPage({
                            appName: window.appName,
                            tag: selectTag,
                        })).response.result[0];
                        dialog.dataLoading({ visible: false });
                        saveEvent = () => __awaiter(this, void 0, void 0, function* () {
                            dialog.dataLoading({ visible: true });
                            const savePage = yield ApiPageConfig.setPage({
                                id: selectItem.id,
                                appName: window.appName,
                                tag: selectItem.tag,
                                name: selectItem.name,
                                config: selectItem.config,
                                group: selectItem.group,
                                page_config: selectItem.page_config,
                            });
                            const viewModel = gvc.glitter.share.editorViewModel;
                            viewModel.appConfig.homePage = viewModel.homePage;
                            viewModel.appConfig.globalStyle = viewModel.globalStyle;
                            viewModel.appConfig.globalScript = viewModel.globalScript;
                            viewModel.appConfig.globalValue = viewModel.globalValue;
                            viewModel.appConfig.globalStyleTag = viewModel.globalStyleTag;
                            const savePlugin = yield StoreHelper.setPlugin(viewModel.originalConfig, viewModel.appConfig);
                            dialog.dataLoading({ visible: false });
                            if (savePage.result && savePlugin) {
                                dialog.successMessage({ text: '儲存成功' });
                            }
                            else {
                                dialog.errorMessage({ text: '發生異常' });
                            }
                            if (gvc.glitter.getUrlParameter('page') === selectTag) {
                                gvc.glitter.share.reloadEditor();
                            }
                        });
                        resolve(PageEditor.pageEditorView({
                            gvc: gvc,
                            id: gvc.glitter.getUUID(),
                            vid: '',
                            viewModel: {
                                get selectItem() {
                                    return selectItem;
                                },
                                get dataList() {
                                    return gvc.glitter.share.editorViewModel.dataList;
                                },
                            },
                            style: {
                                style: `width:100%;`,
                                class: ``,
                            },
                            hiddenDelete: true,
                        }));
                    }));
                },
                divCreate: {
                    style: `max-height:calc(100vh - 200px);overflow-y:auto;`,
                },
            };
        }), 'p-0 bg-white border rounded-3 shadow')}
                </div>
            </div>
        `);
    }
}
