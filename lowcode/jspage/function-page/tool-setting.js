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
export class ToolSetting {
    static main(gvc) {
        const html = String.raw;
        const vm = {
            id: gvc.glitter.getUUID(),
            data: [
                {
                    title: '標頭樣式',
                    tag: '標頭元件'
                },
                {
                    title: '頁腳樣式',
                    tag: '頁腳樣式'
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
                        return vm.edit_view;
                    }
                    return BgWidget.container(html `
                            <div class="d-flex mx-n2 px-2 align-items-start flex-column">
                                ${BgWidget.title_16('元件樣式')}
                                <div class="flex-fill mt-2"></div>
                                ${BgWidget.hint_title('請選擇一個符合您需求的元件樣式')}
                            </div>
                            <div class="border-bottom  mx-n2 mt-3"></div>
                            ${vm.data.map((dd, index) => {
                        return BgWidget.container([
                            `<div class="bgf6 m-n2 p-2 border-top border-bottom">${BgWidget.title_16(dd.title)}</div>`,
                            gvc.bindView(() => {
                                const id = gvc.glitter.getUUID();
                                return {
                                    bind: id,
                                    view: () => __awaiter(this, void 0, void 0, function* () {
                                        var _a;
                                        let module_list = (yield ApiPageConfig.getPageTemplate({
                                            template_from: 'all',
                                            page: '0',
                                            limit: '3000',
                                            type: 'module',
                                            tag: dd.tag
                                        })).response.result.data;
                                        let setting_view = '';
                                        if (dd.tag === '標頭元件') {
                                            const widget = (yield ApiPageConfig.getPage({
                                                appName: window.appName,
                                                type: 'template',
                                                tag: 'c_header'
                                            })).response.result[0];
                                            console.log(`widget->標頭元件->`, widget);
                                            const refer_widget = (yield ApiPageConfig.getPage({
                                                appName: widget.config[0].data.refer_app,
                                                type: 'template',
                                                tag: widget.config[0].data.tag
                                            })).response.result[0];
                                            const find_showed_widget = (gvc.glitter.share.findWidget((dd) => {
                                                return dd.data && dd.data.tag === 'c_header';
                                            }));
                                            const widget_container = find_showed_widget.container || widget.config;
                                            const widget_edited = find_showed_widget.widget || widget.config[0];
                                            const htmlGenerate = new gvc.glitter.htmlGenerate(widget_container, [], undefined, true);
                                            gvc.glitter.share.editorViewModel.selectItem = widget_edited;
                                            module_list = module_list.filter((dd) => {
                                                return (dd.appName !== widget.config[0].data.refer_app) && (dd.tag !== widget.config[0].data.tag);
                                            });
                                            setting_view += html `
                                                                <div class="p-2 col-6 ">
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
                                                vm.edit_view = html `
                                                                                            <div class="pe-3   border-bottom pb-3 fw-bold mt-2 pt-3 mx-n2 d-flex align-items-center"
                                                                                                 style="cursor: pointer;color:#393939;">
                                                                                                <i class="fa-sharp fa-solid fa-angle-left d-flex align-items-center justify-content-center"
                                                                                                   style="cursor: pointer;width: 40px;height: 30px;"
                                                                                                   onclick="${gvc.event(() => {
                                                    vm.function = 'list';
                                                    gvc.notifyDataChange(vm.id);
                                                })}"></i>
                                                                                                <span>${refer_widget.template_config.name}</span>
                                                                                                <div class="flex-fill"></div>
                                                                                                ${BgWidget.darkButton('儲存變更', gvc.event(() => { }), { size: 'sm' })}
                                                                                            </div>
                                                                                        ` + htmlGenerate.editor(gvc, {
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
                                                                    <h3 class="my-auto tx_title text-center w-100 py-2"
                                                                        style="white-space: nowrap;font-size: 16px;font-weight: 500;">
                                                                        ${refer_widget.template_config.name}</h3>

                                                                </div>`;
                                        }
                                        return [setting_view].concat(module_list.map((dd, index) => {
                                            var _a;
                                            return `<div class="p-2 col-6 " ><div class="card w-100 position-relative rounded hoverHidden bgf6 rounded-3"
                                                                                 style="padding-bottom: 58%;">
                                                                                <div class="position-absolute w-100 h-100 d-flex align-items-center justify-content-center rounded-3"
                                                                                     style="overflow: hidden;">
                                                                                    <img class="w-100 "
                                                                                         src="${(_a = dd.template_config.image[0]) !== null && _a !== void 0 ? _a : 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1713445383494-未命名(1080x1080像素).jpg'}"></img>
                                                                                </div>

                                                                                <div class="position-absolute w-100 h-100  align-items-center justify-content-center rounded fs-6 flex-column"
                                                                                     style="background: rgba(0,0,0,0.5);gap:5px;">
                                                                                <button class="btn btn-sm btn-danger" style="height: 28px;">替換</button>
                                                                                </div>
                                                                            </div>
                                                                            <h3 class="my-auto tx_title text-center w-100 py-2" style="white-space: nowrap;font-size: 16px;font-weight: 500;">${dd.template_config.name}</h3>

</div>`;
                                        })).join('');
                                    }),
                                    divCreate: {
                                        class: `row m-0 mx-n2 mt-3`, style: 'cursor:pointer;'
                                    },
                                };
                            }),
                        ].join(``), undefined, 'margin-top:-20px;');
                    }).join('')}
                        `);
                },
                divCreate: {
                    class: `p-2 mt-n3`
                }
            };
        });
    }
}
