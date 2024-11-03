import {GVC} from '../../glitterBundle/GVController.js';
import {BgWidget} from '../../backend-manager/bg-widget.js';
import {ApiPageConfig} from '../../api/pageConfig.js';
import {ShareDialog} from '../../glitterBundle/dialog/ShareDialog.js';
import {NormalPageEditor} from "../../editor/normal-page-editor.js";

export class ToolSetting {
    public static main(gvc: GVC) {
        const html = String.raw;
        const vm: {
            id: string;
            data: any;
            loading: boolean;
            function: 'edit' | 'list';
            edit_view: string;
        } = {
            id: gvc.glitter.getUUID(),
            data: [
                {
                    title: '標頭樣式',
                    tag: '標頭元件',
                    hint: `全館 (首頁,隱形賣場,一頁式網頁) 的標頭將預設為以下樣式`,
                    class: "guideDesign-2"
                },
                {
                    title: '頁腳樣式',
                    tag: '頁腳元件',
                    hint: `全館 (首頁,隱形賣場,一頁式網頁) 的頁腳將預設為以下樣式`,
                },
                {
                    title: '商品卡片樣式',
                    tag: '商品卡片',
                    hint: `全館 (首頁,隱形賣場,一頁式網頁) 的商品卡片將預設為以下樣式`,
                },
            ],
            loading: true,
            function: 'list',
            edit_view: '',
        };

        return [gvc.bindView(() => {
            return {
                bind: vm.id,
                view: () => {
                    if (vm.function === 'edit') {
                        return html`
                            <div class="px-2 pt-2">${vm.edit_view}</div>`;
                    }
                    return html`
                        ${(() => {
                            if (document.body.clientWidth < 800) {
                                return `<div class="w-100 d-flex align-items-center p-3 border-bottom">
                            <h5 class="offcanvas-title  " style="max-width: calc(100% - 50px);overflow: hidden;text-overflow: ellipsis;">統一元件設定</h5>
                            <div class="flex-fill"></div>
                            <div
                                class="fs-5 text-black"
                                style="cursor: pointer;"
                                onclick="${gvc.event(() => {
                                    gvc.glitter.closeDrawer()
                                })}"
                            >
                                <i class="fa-sharp fa-regular fa-circle-xmark" style=""></i>
                            </div>
                        </div>`
                            } else {
                                return ``
                            }
                        })()}
                        ${gvc.bindView(
                                (() => {
                                    const vid = gvc.glitter.getUUID();
                                    return {
                                        bind: vid,
                                        view: () => {
                                            return vm.data.map((dd: any) => {
                                                let viewID = gvc.glitter.getUUID();
                                                return gvc.bindView({
                                                    bind: viewID,
                                                    view: () => {
                                                        return html`
                                                            <div class="d-flex flex-column w-100 border-bottom">
                                                                <div class="hoverF2 w-100 h-100 px-3 d-flex align-items-center justify-content-between p-3 ${dd.class ?? ''}"
                                                                     style="cursor: pointer;"
                                                                     onclick="${gvc.event(() => {
                                                                         let temp = dd.toggle;
                                                                         vm.data.map((d2: any) => {
                                                                             d2.toggle = false;
                                                                         });
                                                                         dd.toggle = !temp;
                                                                         gvc.notifyDataChange(vid);
                                                                     })}">
                                                                    ${BgWidget.title(dd.title, 'font-size: 16px;')}
                                                                    ${dd.toggle ? `<i class="fa-solid fa-chevron-down ms-2"></i>` : `<i class="fa-solid fa-chevron-right ms-2"></i>`}
                                                                </div>
                                                                <div class="px-3 my-2 ${dd.toggle ? `` : `d-none`}"
                                                                     style="white-space: normal;t">
                                                                    ${dd.hint && dd.toggle ? BgWidget.grayNote(dd.hint) : ``}
                                                                </div>
                                                                ${gvc.bindView(() => {
                                                                    const id = gvc.glitter.getUUID();
                                                                    const cvm = {
                                                                        loading: true,
                                                                        html: ``,
                                                                    };

                                                                    async function loadData() {
                                                                        let module_list = (
                                                                                await ApiPageConfig.getPageTemplate({
                                                                                    template_from: 'all',
                                                                                    page: '0',
                                                                                    limit: '3000',
                                                                                    type: 'module',
                                                                                    tag: dd.tag,
                                                                                })
                                                                        ).response.result.data;

                                                                        let setting_view = '';
                                                                        //參照元件
                                                                        const widget = await (async () => {
                                                                            if (dd.tag === '標頭元件') {
                                                                                return (
                                                                                        await ApiPageConfig.getPage({
                                                                                            appName: (window as any).appName,
                                                                                            type: 'template',
                                                                                            tag: 'c_header',
                                                                                        })
                                                                                ).response.result[0];
                                                                            } else if (dd.tag === '頁腳元件') {
                                                                                return (
                                                                                        await ApiPageConfig.getPage({
                                                                                            appName: (window as any).appName,
                                                                                            type: 'template',
                                                                                            tag: 'footer',
                                                                                        })
                                                                                ).response.result[0];
                                                                            } else if (dd.tag === '商品卡片') {
                                                                                return (
                                                                                        await ApiPageConfig.getPage({
                                                                                            appName: (window as any).appName,
                                                                                            type: 'template',
                                                                                            tag: 'product_widget',
                                                                                        })
                                                                                ).response.result[0];
                                                                            }
                                                                        })();
                                                                        //主元件
                                                                        const refer_widget = await (async () => {
                                                                            if (dd.tag === '標頭元件') {
                                                                                return (
                                                                                        await ApiPageConfig.getPage({
                                                                                            appName: widget.config[0].data.refer_app,
                                                                                            type: 'template',
                                                                                            tag: widget.config[0].data.tag,
                                                                                        })
                                                                                ).response.result[0];
                                                                            } else if (dd.tag === '頁腳元件') {
                                                                                return (
                                                                                        await ApiPageConfig.getPage({
                                                                                            appName: widget.config[0].data.refer_app,
                                                                                            type: 'template',
                                                                                            tag: widget.config[0].data.tag,
                                                                                        })
                                                                                ).response.result[0];
                                                                            } else if (dd.tag === '商品卡片') {
                                                                                try {
                                                                                    return (
                                                                                            await ApiPageConfig.getPage({
                                                                                                appName: widget.config[0].data.refer_app,
                                                                                                type: 'template',
                                                                                                tag: widget.config[0].data.tag,
                                                                                            })
                                                                                    ).response.result[0];
                                                                                } catch (e) {
                                                                                    return {};
                                                                                }
                                                                            } else {
                                                                                return {};
                                                                            }
                                                                        })();

                                                                        const find_showed_widget = gvc.glitter.share.findWidget((d1: any) => {
                                                                            return (
                                                                                    d1.data &&
                                                                                    d1.data.tag ===
                                                                                    (() => {
                                                                                        switch (dd.tag) {
                                                                                            case '標頭元件':
                                                                                                return 'c_header';
                                                                                            case '頁腳元件':
                                                                                                return 'footer';
                                                                                            case '商品卡片':
                                                                                                return `product_widget`;
                                                                                            default:
                                                                                                return gvc.glitter.getUUID();
                                                                                        }
                                                                                    })()
                                                                            );
                                                                        });

                                                                        const widget_container = find_showed_widget.container || widget.config;
                                                                        const widget_edited = find_showed_widget.widget || widget.config[0];
                                                                        const htmlGenerate = new gvc.glitter.htmlGenerate(widget_container, [], undefined, true);
                                                                        gvc.glitter.share.editorViewModel.selectItem = widget_edited;
                                                                        try {
                                                                            module_list = module_list.filter((dd: any) => {
                                                                                return dd.appName !== widget.config[0].data.refer_app || dd.tag !== widget.config[0].data.tag;
                                                                            });
                                                                        } catch (e) {
                                                                            module_list = [];
                                                                        }

                                                                        try {
                                                                            setting_view += html`
                                                                                <div class="p-2 col-6 "
                                                                                     style="">
                                                                                    <div class="w-100 p-2 rounded-3 guideDesign-3"
                                                                                         style="border: 1px solid #393939;background: #F7F7F7;">
                                                                                        <div class="card w-100 position-relative rounded hoverHidden bgf6 rounded-3"
                                                                                             style="padding-bottom: 58%;">
                                                                                            <div
                                                                                                    class="position-absolute w-100 h-100 d-flex align-items-center justify-content-center rounded-3"
                                                                                                    style="overflow: hidden;"
                                                                                            >
                                                                                                <img
                                                                                                        class="w-100 "
                                                                                                        src="${refer_widget.template_config.image[0] ??
                                                                                                        'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1713445383494-未命名(1080x1080像素).jpg'}"
                                                                                                />
                                                                                            </div>

                                                                                            <div
                                                                                                    class="position-absolute w-100 h-100  align-items-center justify-content-center rounded fs-6 flex-column"
                                                                                                    style="background: rgba(0,0,0,0.5);gap:5px;"
                                                                                            >
                                                                                                <button
                                                                                                        class="btn btn-sm btn-secondary"
                                                                                                        style="height: 28px;"
                                                                                                        onclick="${gvc.event(() => {
                                                                                                            if (dd.tag === '商品卡片') {
                                                                                                                gvc.glitter.share.edit_ittt = widget;
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
                                                                                                                    html`` +
                                                                                                                    htmlGenerate.editor(gvc, {
                                                                                                                        return_: false,
                                                                                                                        refreshAll: () => {
                                                                                                                            alert('ref');
                                                                                                                        },
                                                                                                                        setting: [widget_edited],
                                                                                                                        deleteEvent: () => {
                                                                                                                        },
                                                                                                                    });
                                                                                                            vm.function = 'edit';
                                                                                                            gvc.notifyDataChange(vm.id);
                                                                                                        })}"
                                                                                                >
                                                                                                    設定
                                                                                                </button>
                                                                                            </div>
                                                                                        </div>
                                                                                        <h3 class="my-auto tx_title text-center w-100 pt-2"
                                                                                            style="white-space: normal;font-size: 15px;font-weight: 400;">
                                                                                            <i class="fa-sharp fa-solid fa-circle-dot"></i>
                                                                                            ${refer_widget.template_config.name}
                                                                                        </h3>
                                                                                    </div>
                                                                                </div>`;
                                                                        } catch (e) {
                                                                        }

                                                                        return [setting_view]
                                                                                .concat(
                                                                                        module_list.map((dd: any, index: number) => {
                                                                                            return html`
                                                                                                <div
                                                                                                        class="p-2 col-6 "
                                                                                                        onclick="${gvc.event(() => {
                                                                                                            const dialog = new ShareDialog(gvc.glitter);
                                                                                                            dialog.checkYesOrNot({
                                                                                                                text: '是否確認替換樣式?',
                                                                                                                callback: (response) => {
                                                                                                                    if (response) {
                                                                                                                        dialog.dataLoading({visible: true});
                                                                                                                        ((window as any).glitterInitialHelper).getPageData({
                                                                                                                            tag: dd.tag,
                                                                                                                            appName: dd.appName
                                                                                                                        }, (d3: any) => {
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
                                                                                                                            if (['c_header', 'footer'].includes(widget.tag)) {
                                                                                                                                widget.config[0].arrayData = {
                                                                                                                                    "clickEvent": [{
                                                                                                                                        "clickEvent": {
                                                                                                                                            "src": "./official_event/event.js",
                                                                                                                                            "route": "code"
                                                                                                                                        },
                                                                                                                                        "codeVersion": "v2",
                                                                                                                                        "code": "//判斷不是APP在顯示\n    if ((!glitter.share.is_application) && (glitter.getUrlParameter('device') !== 'mobile')) {\n        return [subData]\n    } else {\n        return []\n    }"
                                                                                                                                    }]
                                                                                                                                }
                                                                                                                            }
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
                                                                                                                                dialog.dataLoading({visible: false});
                                                                                                                                location.reload();
                                                                                                                            });
                                                                                                                        })
                                                                                                                    }
                                                                                                                },
                                                                                                            });
                                                                                                        })}"
                                                                                                >
                                                                                                    <div class="card w-100 position-relative rounded hoverHidden bgf6 rounded-3"
                                                                                                         style="padding-bottom: 58%;">
                                                                                                        <div
                                                                                                                class="position-absolute w-100 h-100 d-flex align-items-center justify-content-center rounded-3"
                                                                                                                style="overflow: hidden;"
                                                                                                        >
                                                                                                            <img
                                                                                                                    class="w-100 "
                                                                                                                    src="${dd.template_config.image[0] ??
                                                                                                                    'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1713445383494-未命名(1080x1080像素).jpg'}"
                                                                                                            />
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <h3 class="my-auto tx_title text-center w-100 pt-2"
                                                                                                        style="white-space: nowrap;font-size: 15px;font-weight: 400;">
                                                                                                        <i class="fa-regular fa-circle me-2"></i>${dd.template_config.name}
                                                                                                    </h3>
                                                                                                </div>`;
                                                                                        })
                                                                                )
                                                                                .join('');
                                                                    }

                                                                    return {
                                                                        bind: id,
                                                                        view: () => {
                                                                            if (!dd.toggle) {
                                                                                return ``;
                                                                            } else if (cvm.loading) {
                                                                                loadData().then((dd) => {
                                                                                    cvm.html = dd;
                                                                                    cvm.loading = false;
                                                                                    gvc.notifyDataChange(id);
                                                                                });
                                                                                return html`
                                                                                    <div class="d-flex w-100 align-items-center justify-content-center p-3">
                                                                                        <div class="spinner-border"></div>
                                                                                    </div>`;
                                                                            } else {
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
                                                        `
                                                    }, divCreate: {class: ' d-flex align-items-center'}
                                                })
                                            }).join('')
                                        },
                                    };
                                })()
                        )}
                    `
                },
                divCreate: {
                    class: `p-2 mx-n2 mt-n2`,
                },
            };
        })].join('');
    }
}
