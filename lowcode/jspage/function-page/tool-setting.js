var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BgWidget } from "../../backend-manager/bg-widget.js";
import { ApiPageConfig } from "../../api/pageConfig.js";
import { ShareDialog } from "../../glitterBundle/dialog/ShareDialog.js";
export class ToolSetting {
    static main(gvc) {
        const html = String.raw;
        const vm = {
            id: gvc.glitter.getUUID(),
            data: [
                {
                    title: '標頭樣式',
                    tag: '標頭元件',
                    hint: `全館 (首頁,隱形賣場,一頁式網頁) 的標頭將預設為以下樣式`
                },
                {
                    title: '頁腳樣式',
                    tag: '頁腳元件',
                    hint: `全館 (首頁,隱形賣場,一頁式網頁) 的頁腳將預設為以下樣式`
                },
                {
                    title: '商品卡片樣式',
                    tag: '商品卡片'
                }
            ],
            loading: true,
            function: 'list',
            edit_view: ''
        };
        return gvc.bindView(() => {
            return {
                bind: vm.id,
                view: () => {
                    if (vm.function === 'edit') {
                        return `<div class="px-2">${vm.edit_view}</div>`;
                    }
                    return BgWidget.container(html `
                            <div class="d-flex  px-3 align-items-start flex-column">
                                ${BgWidget.title_16('設計元件')}
                            </div>
                            <div class="border-bottom  mx-n2 mt-3"></div>
                            ${vm.data.map((dd, index) => {
                        return gvc.bindView(() => {
                            const cId = gvc.glitter.getUUID();
                            return {
                                bind: cId,
                                view: () => {
                                    return BgWidget.container([
                                        `<div class="px-3 d-flex align-items-center" style="cursor: pointer;" onclick="${gvc.event(() => {
                                            dd.toggle = !dd.toggle;
                                            gvc.notifyDataChange(cId);
                                        })}">${BgWidget.title_16(dd.title)}
${(dd.toggle) ? `<i class="fa-solid fa-angle-down ms-2"></i>` : `<i class="fa-solid fa-angle-right ms-2"></i>`}

</div>`,
                                        `<div class="px-3 my-2 ${dd.toggle ? `` : `d-none`}">
${dd.hint && dd.toggle ? BgWidget.hint_title(dd.hint) : ``}
</div>`,
                                        gvc.bindView(() => {
                                            const id = gvc.glitter.getUUID();
                                            const cvm = {
                                                loading: true,
                                                html: ``
                                            };
                                            function loadData() {
                                                var _a;
                                                return __awaiter(this, void 0, void 0, function* () {
                                                    let module_list = (yield ApiPageConfig.getPageTemplate({
                                                        template_from: 'all',
                                                        page: '0',
                                                        limit: '3000',
                                                        type: 'module',
                                                        tag: dd.tag
                                                    })).response.result.data;
                                                    let setting_view = '';
                                                    const widget = yield (() => __awaiter(this, void 0, void 0, function* () {
                                                        if (dd.tag === '標頭元件') {
                                                            return (yield ApiPageConfig.getPage({
                                                                appName: window.appName,
                                                                type: 'template',
                                                                tag: 'c_header'
                                                            })).response.result[0];
                                                        }
                                                        else if (dd.tag === '頁腳元件') {
                                                            return (yield ApiPageConfig.getPage({
                                                                appName: window.appName,
                                                                type: 'template',
                                                                tag: 'footer'
                                                            })).response.result[0];
                                                        }
                                                        else {
                                                            return {};
                                                        }
                                                    }))();
                                                    const refer_widget = yield (() => __awaiter(this, void 0, void 0, function* () {
                                                        if (dd.tag === '標頭元件') {
                                                            return (yield ApiPageConfig.getPage({
                                                                appName: widget.config[0].data.refer_app,
                                                                type: 'template',
                                                                tag: widget.config[0].data.tag
                                                            })).response.result[0];
                                                        }
                                                        else if (dd.tag === '頁腳元件') {
                                                            return (yield ApiPageConfig.getPage({
                                                                appName: widget.config[0].data.refer_app,
                                                                type: 'template',
                                                                tag: widget.config[0].data.tag
                                                            })).response.result[0];
                                                        }
                                                        else {
                                                            return {};
                                                        }
                                                    }))();
                                                    const find_showed_widget = (gvc.glitter.share.findWidget((d1) => {
                                                        return d1.data && d1.data.tag === (() => {
                                                            switch (dd.tag) {
                                                                case '標頭元件':
                                                                    return 'c_header';
                                                                case '頁腳元件':
                                                                    return 'footer';
                                                                default:
                                                                    return gvc.glitter.getUUID();
                                                            }
                                                        })();
                                                    }));
                                                    const widget_container = find_showed_widget.container || widget.config;
                                                    const widget_edited = find_showed_widget.widget || widget.config[0];
                                                    const htmlGenerate = new gvc.glitter.htmlGenerate(widget_container, [], undefined, true);
                                                    gvc.glitter.share.editorViewModel.selectItem = widget_edited;
                                                    module_list = module_list.filter((dd) => {
                                                        return (dd.appName !== widget.config[0].data.refer_app) || (dd.tag !== widget.config[0].data.tag);
                                                    });
                                                    console.log(`find_showed_widget.widget->`, find_showed_widget.widget);
                                                    setting_view += html `
                                                                <div class="p-2 col-6 " style="">
                                                                    <div class="w-100 p-2 rounded-3"
                                                                         style="border: 1px solid #393939;background: #F7F7F7;">
                                                                        <div class="card w-100 position-relative rounded hoverHidden bgf6 rounded-3"
                                                                             style="padding-bottom: 58%;">
                                                                            <div class="position-absolute w-100 h-100 d-flex align-items-center justify-content-center rounded-3"
                                                                                 style="overflow: hidden;">
                                                                                <img class="w-100 "
                                                                                     src="${(_a = refer_widget.template_config.image[0]) !== null && _a !== void 0 ? _a : 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1713445383494-未命名(1080x1080像素).jpg'}"></img>
                                                                            </div>

                                                                            <div class="position-absolute w-100 h-100  align-items-center justify-content-center rounded fs-6 flex-column"
                                                                                 style="background: rgba(0,0,0,0.5);gap:5px;">
                                                                                <button class="btn btn-sm btn-secondary"
                                                                                        style="height: 28px;"
                                                                                        onclick="${gvc.event(() => {
                                                        vm.edit_view = html `` + htmlGenerate.editor(gvc, {
                                                            return_: false,
                                                            refreshAll: () => {
                                                                alert('ref');
                                                            },
                                                            setting: [widget_edited],
                                                            deleteEvent: () => {
                                                            }
                                                        });
                                                        vm.function = 'edit';
                                                        gvc.notifyDataChange(vm.id);
                                                    })}">設定
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                        <h3 class="my-auto tx_title text-center w-100 pt-2"
                                                                            style="white-space: nowrap;font-size: 15px;font-weight: 400;">
                                                                            <i class="fa-sharp fa-solid fa-circle-dot"></i> ${refer_widget.template_config.name}</h3>
                                                                    </div>
                                                                </div>`;
                                                    return [setting_view].concat(module_list.map((dd, index) => {
                                                        var _a;
                                                        return `<div class="p-2 col-6 " onclick="${gvc.event(() => {
                                                            const dialog = new ShareDialog(gvc.glitter);
                                                            dialog.checkYesOrNot({
                                                                text: '是否確認替換樣式?',
                                                                callback: (response) => {
                                                                    if (response) {
                                                                        dialog.dataLoading({ visible: true });
                                                                        widget.config[0] = {
                                                                            id: gvc.glitter.getUUID(),
                                                                            js: './official_view_component/official.js',
                                                                            css: {
                                                                                class: {},
                                                                                style: {},
                                                                            },
                                                                            data: {
                                                                                refer_app: dd.appName,
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
                                                                    }
                                                                }
                                                            });
                                                        })}"><div class="card w-100 position-relative rounded hoverHidden bgf6 rounded-3"
                                                                                 style="padding-bottom: 58%;">
                                                                                <div class="position-absolute w-100 h-100 d-flex align-items-center justify-content-center rounded-3"
                                                                                     style="overflow: hidden;">
                                                                                    <img class="w-100 "
                                                                                         src="${(_a = dd.template_config.image[0]) !== null && _a !== void 0 ? _a : 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1713445383494-未命名(1080x1080像素).jpg'}"></img>
                                                                                </div>
                                                                            </div>
                                                                            <h3 class="my-auto tx_title text-center w-100 pt-2" style="white-space: nowrap;font-size: 15px;font-weight: 400;">
<i class="fa-regular fa-circle me-2"></i>${dd.template_config.name}</h3>

</div>`;
                                                    })).join('');
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
                                                        return `<div class="d-flex w-100 align-items-center justify-content-center p-3"><div class="spinner-border"></div></div>`;
                                                    }
                                                    else {
                                                        return cvm.html;
                                                    }
                                                },
                                                divCreate: {
                                                    class: `row m-0 px-2`, style: 'cursor:pointer;'
                                                },
                                            };
                                        })
                                    ].join(``), undefined, 'border-bottom:1px solid #DDD;');
                                },
                                divCreate: {
                                    class: `-1`
                                }
                            };
                        });
                    }).join('')}
                        `);
                },
                divCreate: {
                    class: `p-2 mt-n3 mx-n2`
                }
            };
        });
    }
}
