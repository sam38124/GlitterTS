var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BgWidget } from '../../backend-manager/bg-widget.js';
import { ApiPageConfig } from '../../api/pageConfig.js';
import { ShareDialog } from '../../glitterBundle/dialog/ShareDialog.js';
import { FirstBanner } from "../../public-components/banner/first-banner.js";
import { GlobalWidget } from '../../editor-components/global-widget/global-widget.js';
export class ToolSetting {
    static main(gvc) {
        const html = String.raw;
        const vm = {
            id: gvc.glitter.getUUID(),
            data: ToolSetting.tool_setting_list,
            loading: true,
            function: 'list',
            edit_view: '',
        };
        return [gvc.bindView(() => {
                return {
                    bind: vm.id,
                    view: () => {
                        if (vm.function === 'edit') {
                            return html `
                            <div class="px-2 pt-2">${vm.edit_view}</div>`;
                        }
                        return html `
                        ${(() => {
                            if (document.body.clientWidth < 800) {
                                return `<div class="w-100 d-flex align-items-center p-3 border-bottom">
                            <h5 class="offcanvas-title  " style="max-width: calc(100% - 50px);overflow: hidden;text-overflow: ellipsis;">統一元件設定</h5>
                            <div class="flex-fill"></div>
                            <div
                                class="fs-5 text-black"
                                style="cursor: pointer;"
                                onclick="${gvc.event(() => {
                                    gvc.glitter.closeDrawer();
                                })}"
                            >
                                <i class="fa-sharp fa-regular fa-circle-xmark" style=""></i>
                            </div>
                        </div>`;
                            }
                            else {
                                return ``;
                            }
                        })()}
                        ${gvc.bindView((() => {
                            const vid = gvc.glitter.getUUID();
                            return {
                                bind: vid,
                                view: () => {
                                    return vm.data.map((dd) => {
                                        let viewID = gvc.glitter.getUUID();
                                        return gvc.bindView({
                                            bind: viewID,
                                            view: () => {
                                                var _a;
                                                return html `
                                                            <div class="d-flex flex-column w-100 border-bottom">
                                                                <div class="hoverF2 w-100 h-100 px-3 d-flex align-items-center justify-content-between p-3 ${(_a = dd.class) !== null && _a !== void 0 ? _a : ''}"
                                                                     style="cursor: pointer;"
                                                                     onclick="${gvc.event(() => {
                                                    let temp = dd.toggle;
                                                    vm.data.map((d2) => {
                                                        d2.toggle = false;
                                                    });
                                                    dd.toggle = !temp;
                                                    gvc.notifyDataChange(vid);
                                                })}">
                                                                    ${BgWidget.title(dd.title, 'font-size: 16px;')}
                                                                    ${dd.toggle ? `<i class="fa-solid fa-chevron-down ms-2"></i>` : `<i class="fa-solid fa-chevron-right ms-2"></i>`}
                                                                </div>
                                                                <div class="px-3 mb-2 ${dd.toggle ? `` : `d-none`}"
                                                                     style="white-space: normal;t">
                                                                    ${dd.hint && dd.toggle ? BgWidget.grayNote(dd.hint) : ``}
                                                                </div>
                                                                ${gvc.bindView(() => {
                                                    const id = gvc.glitter.getUUID();
                                                    const cvm = {
                                                        loading: true,
                                                        html: ``,
                                                    };
                                                    function loadData() {
                                                        return __awaiter(this, void 0, void 0, function* () {
                                                            let module_list = (yield ApiPageConfig.getPageTemplate({
                                                                template_from: 'all',
                                                                page: '0',
                                                                limit: '3000',
                                                                type: 'module',
                                                                tag: dd.tag,
                                                            })).response.result.data;
                                                            const ci_tag = (() => {
                                                                switch (dd.tag) {
                                                                    case '標頭元件':
                                                                        return 'c_header';
                                                                    case '頁腳元件':
                                                                        return `footer`;
                                                                    case '商品卡片':
                                                                        return `product_widget`;
                                                                    case '廣告輪播':
                                                                        return 'advertise';
                                                                }
                                                            })();
                                                            let setting_view = '';
                                                            let widget = yield (() => __awaiter(this, void 0, void 0, function* () {
                                                                if (['標頭元件', '頁腳元件', '商品卡片', '廣告輪播'].includes(dd.tag)) {
                                                                    return (yield ApiPageConfig.getPage({
                                                                        appName: window.appName,
                                                                        type: 'template',
                                                                        tag: ci_tag,
                                                                    })).response.result[0];
                                                                }
                                                                else {
                                                                    return {};
                                                                }
                                                            }))();
                                                            const refer_widget = yield (() => __awaiter(this, void 0, void 0, function* () {
                                                                if (['標頭元件', '頁腳元件', '商品卡片', '廣告輪播'].includes(dd.tag)) {
                                                                    return (yield ApiPageConfig.getPage({
                                                                        appName: widget.config[0].data.refer_app,
                                                                        type: 'template',
                                                                        tag: widget.config[0].data.tag,
                                                                    })).response.result[0];
                                                                }
                                                                else {
                                                                    return {};
                                                                }
                                                            }))();
                                                            const find_showed_widget = gvc.glitter.share.findWidget((d1) => {
                                                                return (d1.data &&
                                                                    d1.data.tag ===
                                                                        ci_tag);
                                                            });
                                                            const widget_container = find_showed_widget.container || widget.config;
                                                            let widget_edited = find_showed_widget.widget || widget.config[0];
                                                            const htmlGenerate = new gvc.glitter.htmlGenerate(widget_container, [], {
                                                                editor_updated_callback: (oWidget) => {
                                                                    if (dd.tag === '廣告輪播') {
                                                                        FirstBanner.main({
                                                                            gvc: document.querySelector('.iframe_view').contentWindow.glitter.pageConfig[0].gvc,
                                                                            ed_widget: oWidget
                                                                        });
                                                                    }
                                                                }
                                                            }, true);
                                                            gvc.glitter.share.editorViewModel.selectItem = widget_edited;
                                                            try {
                                                                module_list = module_list.filter((dd) => {
                                                                    return dd.appName !== widget.config[0].data.refer_app || dd.tag !== widget.config[0].data.tag;
                                                                });
                                                            }
                                                            catch (e) {
                                                                module_list = [];
                                                            }
                                                            try {
                                                                setting_view += html `
                                                                                <div class="col-12 p-0 m-0">
                                                                                    <div
                                                                                            class="position-relative"
                                                                                            style="width: 100%;  padding: 18px 12px;border-radius: 7px; overflow: hidden; border: 1px #DDDDDD solid; flex-direction: column; justify-content: center; align-items: flex-start; gap: 32px; display: inline-flex"
                                                                                    >
                                                                                        <div style="align-self: stretch; justify-content: flex-start; align-items: center; gap: 10px; display: inline-flex">
                                                                                            <div class="rounded-2 shadow"
                                                                                                 style="background-position:center;background-repeat: no-repeat;background-size: cover;width:93px;height: 59px;background-image: url('${(() => {
                                                                    switch (dd.tag) {
                                                                        case '標頭元件':
                                                                            return `${gvc.glitter.root_path}/editor-components/global-widget/src/header.png`;
                                                                        case '頁腳元件':
                                                                            return `${gvc.glitter.root_path}/editor-components/global-widget/src/footer.jpg`;
                                                                        case '商品卡片':
                                                                            return `${gvc.glitter.root_path}/editor-components/global-widget/src/product.jpg`;
                                                                        case '廣告輪播':
                                                                            return `${gvc.glitter.root_path}/editor-components/global-widget/src/banner.jpg`;
                                                                    }
                                                                })()}');">

                                                                                            </div>
                                                                                            <div style="flex: 1 1 0; flex-direction: column; justify-content: center; align-items: flex-start; gap: 4px; display: inline-flex">
                                                                                                <div style="align-self: stretch; color: #393939; font-size: 15px;  font-weight: 400; word-wrap: break-word">
                                                                                                    ${refer_widget.template_config.name}
                                                                                                </div>
                                                                                            </div>

                                                                                            <div class=""
                                                                                                 style="cursor: pointer;color: #36B;font-size: 15px; "
                                                                                                 onclick="${gvc.event(() => {
                                                                    var _a, _b;
                                                                    if (dd.tag === '商品卡片') {
                                                                        gvc.glitter.share.product_edit_w = (_a = gvc.glitter.share.product_edit_w) !== null && _a !== void 0 ? _a : widget;
                                                                        widget = gvc.glitter.share.product_edit_w;
                                                                        widget_edited = widget.config[0];
                                                                        gvc.glitter.share.editorViewModel.saveArray[widget.id] = () => {
                                                                            return ApiPageConfig.setPage({
                                                                                id: widget.id,
                                                                                appName: widget.appName,
                                                                                tag: widget.tag,
                                                                                config: widget.config,
                                                                            });
                                                                        };
                                                                    }
                                                                    else if (dd.tag === '廣告輪播') {
                                                                        gvc.glitter.share.first_banner = (_b = gvc.glitter.share.first_banner) !== null && _b !== void 0 ? _b : widget;
                                                                        widget = gvc.glitter.share.first_banner;
                                                                        widget_edited = widget.config[0];
                                                                        gvc.glitter.share.editorViewModel.saveArray[widget.id] = () => {
                                                                            return ApiPageConfig.setPage({
                                                                                id: widget.id,
                                                                                appName: widget.appName,
                                                                                tag: widget.tag,
                                                                                config: widget.config,
                                                                            });
                                                                        };
                                                                    }
                                                                    vm.edit_view =
                                                                        html `` +
                                                                            htmlGenerate.editor(gvc, {
                                                                                return_: false,
                                                                                refreshAll: () => {
                                                                                },
                                                                                setting: [widget_edited],
                                                                                deleteEvent: () => {
                                                                                },
                                                                            });
                                                                    vm.function = 'edit';
                                                                    gvc.notifyDataChange(vm.id);
                                                                })}">編輯
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div class="w-100 mt-2 ${module_list.length ? `` : `d-none`}">
                                                                                        <div class="bt_border_editor"
                                                                                             data-bs-toggle="dropdown"
                                                                                             aria-haspopup="true"
                                                                                             aria-expanded="false"
onclick="${gvc.event(() => {
                                                                    GlobalWidget.open(gvc, (dd) => {
                                                                        const dialog = new ShareDialog(gvc.glitter);
                                                                        dialog.checkYesOrNot({
                                                                            text: '是否確認替換樣式?',
                                                                            callback: (response) => {
                                                                                if (response) {
                                                                                    dialog.dataLoading({ visible: true });
                                                                                    (window.glitterInitialHelper).getPageData({
                                                                                        tag: dd.tag,
                                                                                        appName: dd.appName
                                                                                    }, (d3) => {
                                                                                        widget.config[0] = {
                                                                                            id: gvc.glitter.getUUID(),
                                                                                            js: './official_view_component/official.js',
                                                                                            css: {
                                                                                                class: {},
                                                                                                style: {},
                                                                                            },
                                                                                            data: {
                                                                                                refer_app: dd.appName,
                                                                                                refer_form_data: d3.response.result[0].page_config.formData,
                                                                                                tag: dd.tag,
                                                                                                list: [],
                                                                                                carryData: {},
                                                                                            },
                                                                                            type: 'component',
                                                                                            class: 'w-100',
                                                                                            index: 0,
                                                                                            label: dd.name,
                                                                                            style: '',
                                                                                            bundle: {},
                                                                                            global: [],
                                                                                            toggle: false,
                                                                                            stylist: [],
                                                                                            dataType: 'static',
                                                                                            style_from: 'code',
                                                                                            classDataType: 'static',
                                                                                            preloadEvenet: {},
                                                                                            share: {},
                                                                                            "gCount": "single"
                                                                                        };
                                                                                        ApiPageConfig.setPage({
                                                                                            id: widget.id,
                                                                                            appName: widget.appName,
                                                                                            tag: widget.tag,
                                                                                            name: widget.name,
                                                                                            config: widget.config,
                                                                                            group: widget.group,
                                                                                            page_config: widget.page_config,
                                                                                            page_type: widget.page_type,
                                                                                            preview_image: widget.preview_image,
                                                                                            favorite: widget.favorite,
                                                                                        }).then((api) => {
                                                                                            dialog.dataLoading({ visible: false });
                                                                                            location.reload();
                                                                                        });
                                                                                    });
                                                                                }
                                                                            },
                                                                        });
                                                                    });
                                                                })}"
                                                                                        >變更樣式
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            `;
                                                            }
                                                            catch (e) {
                                                            }
                                                            return setting_view + `<div class="mb-2"></div>`;
                                                        });
                                                    }
                                                    return {
                                                        bind: id,
                                                        view: () => {
                                                            if (!dd.toggle) {
                                                                return ``;
                                                            }
                                                            else if (cvm.loading) {
                                                                loadData().then((dd) => {
                                                                    cvm.html = dd;
                                                                    cvm.loading = false;
                                                                    gvc.notifyDataChange(id);
                                                                });
                                                                return html `
                                                                                    <div class="d-flex w-100 align-items-center justify-content-center p-3">
                                                                                        <div class="spinner-border"></div>
                                                                                    </div>`;
                                                            }
                                                            else {
                                                                return cvm.html;
                                                            }
                                                        },
                                                        divCreate: {
                                                            class: `row m-0 px-2`,
                                                            style: 'cursor:pointer;',
                                                        },
                                                    };
                                                })}
                                                            </div>
                                                        `;
                                            }, divCreate: { class: ' d-flex align-items-center' }
                                        });
                                    }).join('');
                                },
                            };
                        })())}
                    `;
                    },
                    divCreate: {
                        class: `p-2 mx-n2 mt-n2`,
                    },
                };
            })].join('');
    }
}
ToolSetting.tool_setting_list = [
    {
        title: '標頭選單',
        tag: '標頭元件',
        hint: `全館 (首頁,隱形賣場,一頁式網頁) 的標頭將預設為以下樣式`,
        class: "guideDesign-2"
    },
    {
        title: '頁腳選單',
        tag: '頁腳元件',
        hint: `全館 (首頁,隱形賣場,一頁式網頁) 的頁腳將預設為以下樣式`,
    },
    {
        title: '商品卡片',
        tag: '商品卡片',
        hint: `全館 (首頁,隱形賣場,一頁式網頁) 的商品卡片將預設為以下樣式`,
    },
    {
        title: '首頁廣告',
        tag: '廣告輪播',
        hint: `用戶於首頁時會彈跳出來的輪播廣告`,
    },
];
