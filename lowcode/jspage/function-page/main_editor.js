var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Swal } from '../../modules/sweetAlert.js';
import { EditorElem } from '../../glitterBundle/plugins/editor-elem.js';
import { PageEditor } from '../../editor/page-editor.js';
import { ShareDialog } from '../../glitterBundle/dialog/ShareDialog.js';
import { Storage } from '../../glitterBundle/helper/storage.js';
import { AddComponent } from '../../editor/add-component.js';
import { EditorConfig } from "../../editor-config.js";
import { ToolSetting } from "./tool-setting.js";
import { BgWidget } from "../../backend-manager/bg-widget.js";
import { CustomStyle } from "../../glitterBundle/html-component/custom-style.js";
var ViewType;
(function (ViewType) {
    ViewType["mobile"] = "mobile";
    ViewType["desktop"] = "desktop";
    ViewType["col3"] = "col3";
    ViewType["fullScreen"] = "fullScreen";
})(ViewType || (ViewType = {}));
const html = String.raw;
export class Main_editor {
    static left(gvc, viewModel, createID, gBundle) {
        const swal = new Swal(gvc);
        const glitter = gvc.glitter;
        const color_pick = gvc.glitter.getUUID();
        return gvc.bindView(() => {
            const vid = glitter.getUUID();
            return {
                bind: vid,
                view: () => {
                    const viewModel = glitter.share.editorViewModel;
                    function checkSelect(array) {
                        array.map((dd) => {
                            if (dd.id === Storage.lastSelect) {
                                viewModel.selectContainer = array;
                                viewModel.selectItem = dd;
                            }
                            else if (Array.isArray(dd.data.setting)) {
                                checkSelect(dd.data.setting);
                            }
                        });
                    }
                    checkSelect(viewModel.data.config);
                    if (Storage.view_type === ViewType.col3 || Storage.view_type === ViewType.mobile) {
                        gvc.notifyDataChange('right_NAV');
                    }
                    if (Storage.page_setting_item === 'color') {
                        return [Main_editor.globalSetting(gvc)].join('');
                    }
                    if (Storage.page_setting_item === 'widget') {
                        return ToolSetting.main(gvc);
                    }
                    if (viewModel.selectItem &&
                        viewModel.selectItem.type &&
                        ((Storage.view_type !== ViewType.col3 && Storage.view_type !== ViewType.mobile) || Storage.select_function === 'user-editor') &&
                        viewModel.selectItem.type !== 'code' &&
                        (viewModel.selectItem.type !== 'widget' ||
                            (viewModel.selectItem.data.elem !== 'style' && viewModel.selectItem.data.elem !== 'link' && viewModel.selectItem.data.elem !== 'script'))) {
                        return Main_editor.pageAndComponent({
                            gvc: gvc,
                            data: viewModel,
                        });
                    }
                    else if (Storage.select_function === 'user-editor') {
                        return [
                            html `
                                <div
                                        class="px-3   border-bottom pb-3 fw-bold mt-2 pt-2 d-flex align-items-center"
                                        style="cursor: pointer;color:#393939;"
                                >
                                    <span>${viewModel.data.name}</span>
                                    <div class="flex-fill"></div>
                                    <div id="" class="rounded-3 border p-1" style="" data-bs-toggle="tooltip"
                                         data-bs-placement="top"
                                         data-bs-custom-class="custom-tooltip"
                                         data-bs-title="全站預設背景色">
                                        ${EditorElem.colorBtn({
                                gvc: gvc,
                                def: glitter.share.editorViewModel.appConfig._background || (glitter.share.editorViewModel.appConfig.color_theme[0] && glitter.share.editorViewModel.appConfig.color_theme[0].background) || '#FFFFFF',
                                style: `width:24px;height:24px;`,
                                callback: (text) => {
                                    glitter.share.editorViewModel.appConfig._background = text;
                                    document.querySelector('#editerCenter iframe').contentWindow.document.querySelector('body').style.background = text;
                                }
                            })}
                                    </div>
                                </div>
                            `,
                            `    ${(() => {
                                return [
                                    (() => {
                                        let pageConfig = viewModel.data.config.filter((dd, index) => {
                                            return dd.type !== 'code' && (dd.type !== 'widget' || (dd.data.elem !== 'style' && dd.data.elem !== 'link' && dd.data.elem !== 'script'));
                                        });
                                        function setPageConfig() {
                                            const containerConfig = glitter.share.editorViewModel.data.config.container_config;
                                            viewModel.data.config = pageConfig.concat(viewModel.data.config.filter((dd, index) => {
                                                return !(dd.type !== 'code' && (dd.type !== 'widget' || (dd.data.elem !== 'style' && dd.data.elem !== 'link' && dd.data.elem !== 'script')));
                                            }));
                                            try {
                                                viewModel.dataList.find((dd) => {
                                                    return dd.tag === viewModel.data.tag;
                                                }).config = viewModel.data.config;
                                                pageConfig = viewModel.data.config;
                                            }
                                            catch (e) {
                                            }
                                            viewModel.data.config.container_config = containerConfig;
                                            gvc.notifyDataChange(vid);
                                        }
                                        const list = [];
                                        let no_toggle = true;
                                        function loop(array, list) {
                                            array.map((dd) => {
                                                var _a, _b;
                                                if (dd.type === 'container') {
                                                    let child = [];
                                                    loop(dd.data.setting, child);
                                                    list.push({
                                                        type: 'container',
                                                        title: dd.label || '容器',
                                                        child: child,
                                                        info: dd,
                                                        array: dd.data.setting,
                                                        toggle: (_a = (dd.toggle && no_toggle)) !== null && _a !== void 0 ? _a : false,
                                                    });
                                                    if (dd.toggle) {
                                                        no_toggle = false;
                                                    }
                                                }
                                                else {
                                                    list.push({
                                                        title: dd.label || '元件',
                                                        index: 0,
                                                        info: dd,
                                                        array: array,
                                                        toggle: (_b = (dd.toggle && no_toggle)) !== null && _b !== void 0 ? _b : false,
                                                    });
                                                    if (dd.toggle) {
                                                        no_toggle = false;
                                                    }
                                                }
                                            });
                                        }
                                        loop(pageConfig, list);
                                        function renderItems(list, og_array, root) {
                                            const toggle_view = {
                                                close_last_toggle: () => {
                                                }
                                            };
                                            return gvc.bindView(() => {
                                                const id = gvc.glitter.getUUID();
                                                return {
                                                    bind: id,
                                                    view: () => {
                                                        let lastClick = gvc.glitter.ut.clock();
                                                        return (list
                                                            .map((dd, index) => {
                                                            var _a;
                                                            const toggle_id = glitter.getUUID();
                                                            if (dd.toggle) {
                                                                const time_out = 200;
                                                                toggle_view.close_last_toggle = () => {
                                                                    dd.toggle = false;
                                                                    dd.info && (dd.info.toggle = false);
                                                                };
                                                                setTimeout(() => {
                                                                    $('.' + toggle_id).animate({ height: 38 * (dd.child.length + 1) + 'px' }, time_out);
                                                                    setTimeout(() => {
                                                                        $('.' + toggle_id).css('height', 'auto');
                                                                    }, time_out + 10);
                                                                }, 10);
                                                            }
                                                            og_array[index].visible = (_a = og_array[index].visible) !== null && _a !== void 0 ? _a : true;
                                                            return html `
                                                                        <li>
                                                                            <div
                                                                                    class="w-100 fw-500 d-flex align-items-center  fs-6 hoverBtn h_item  rounded px-2 hoverF2 mb-1 it-${dd.info.id} ${dd.toggle && dd.type === 'container' ? `active_F2F2F2` : ``}"
                                                                                    style="gap:5px;color:#393939;${dd.toggle && dd.type === 'container' ? `border-radius: 5px;` : ``}"
                                                                                    onclick="${gvc.event(() => {
                                                                if (lastClick.stop() > 0.1) {
                                                                    dd.info && (dd.info.toggle = !dd.info.toggle);
                                                                    gvc.notifyDataChange(id);
                                                                    dd.info.editorEvent();
                                                                }
                                                            })}"
                                                                                    onmouseover="${gvc.event(() => {
                                                                if (glitter.share.left_block_hover) {
                                                                    return;
                                                                }
                                                                dd.info && dd.info.editor_bridge && dd.info.editor_bridge.scrollWithHover();
                                                            })}"
                                                                                    onmouseout="${gvc.event(() => {
                                                                if (glitter.share.left_block_hover) {
                                                                    return;
                                                                }
                                                                dd.info && dd.info.editor_bridge && dd.info.editor_bridge.cancelHover();
                                                            })}"
                                                                            >
                                                                                ${dd.type === 'container'
                                                                ? `
                                                                          <div class="hoverBtn p-1 "
                                                                             onclick="${gvc.event((e, event) => {
                                                                    lastClick.zeroing();
                                                                    if (!dd.toggle) {
                                                                        toggle_view.close_last_toggle();
                                                                    }
                                                                    setTimeout(() => {
                                                                        dd.toggle = !dd.toggle;
                                                                        dd.info && (dd.info.toggle = dd.toggle);
                                                                        gvc.notifyDataChange(id);
                                                                    });
                                                                    event.preventDefault();
                                                                    event.stopPropagation();
                                                                })}">
                                                                               ${!dd.toggle
                                                                    ? `
                                            <i class="fa-regular fa-angle-right hoverBtn " aria-hidden="true"></i>
                                            `
                                                                    : `<i class="fa-regular fa-angle-down hoverBtn " aria-hidden="true"></i>`}
                                                                        </div>
                                                                        `
                                                                : ``}
                                                                                ${dd.icon ? `<img src="${dd.icon}" style="width:18px;height:18px;">` : ``}
                                                                                <span>${dd.title}</span>
                                                                                <div class="flex-fill"></div>
                                                                                ${(dd.info.deletable !== 'false') ? ` <div
                                                                                        class="hoverBtn p-1 child"
                                                                                        onclick="${gvc.event((e, event) => {
                                                                lastClick.zeroing();
                                                                event.stopPropagation();
                                                                glitter.htmlGenerate.deleteWidget(og_array, og_array[index], () => {
                                                                    setPageConfig();
                                                                });
                                                            })}"
                                                                                >
                                                                                    <i class="fa-regular fa-trash d-flex align-items-center justify-content-center "></i>
                                                                                </div>` : ``}
                                                                                <div
                                                                                        class="hoverBtn p-1 ${og_array[index].visible ? `child` : ``}"
                                                                                        onclick="${gvc.event((e, event) => {
                                                                lastClick.zeroing();
                                                                event.stopPropagation();
                                                                og_array[index].visible = !og_array[index].visible;
                                                                setPageConfig();
                                                                if (og_array[index].visible) {
                                                                    document.querySelector('#editerCenter iframe').contentWindow.glitter
                                                                        .$(`.editor_it_${og_array[index].id}`)
                                                                        .parent()
                                                                        .removeClass('hide-elem');
                                                                }
                                                                else {
                                                                    document.querySelector('#editerCenter iframe').contentWindow.glitter
                                                                        .$(`.editor_it_${og_array[index].id}`)
                                                                        .parent()
                                                                        .addClass('hide-elem');
                                                                }
                                                            })}"
                                                                                >
                                                                                    <i
                                                                                            class="${og_array[index].visible
                                                                ? `fa-regular fa-eye`
                                                                : `fa-solid fa-eye-slash`} d-flex align-items-center justify-content-center "
                                                                                            style="width:15px;height:15px;"
                                                                                            aria-hidden="true"
                                                                                    ></i>
                                                                                </div>
                                                                                <div class="hoverBtn p-1 dragItem child"
                                                                                     onmousedown="${gvc.event(() => {
                                                                if ((Storage.view_type !== 'mobile')) {
                                                                    const frame = document.querySelector('.iframe_view');
                                                                    frame.original_height = frame.style.height;
                                                                    frame.style.height = `${document.body.clientHeight * 2}px`;
                                                                    $('#editerCenter').addClass('scale_iframe');
                                                                }
                                                            })}" onmouseup="${gvc.event(() => {
                                                                if ((Storage.view_type !== 'mobile')) {
                                                                    const frame = document.querySelector('.iframe_view');
                                                                    frame.style.height = frame.original_height;
                                                                    $('#editerCenter').removeClass('scale_iframe');
                                                                }
                                                            })}">
                                                                                    <i
                                                                                            class="fa-solid fa-grip-dots-vertical d-flex align-items-center justify-content-center  "
                                                                                            style="width:15px;height:15px;"
                                                                                            aria-hidden="true"
                                                                                    ></i>
                                                                                </div>
                                                                            </div>
                                                                            ${dd.type === 'container'
                                                                ? `<div class="ps-4  pb-2 ${dd.toggle ? `` : `d-none`} ${toggle_id}" style="margin-left:3px;height:0px;overflow: hidden;">${renderItems(dd.child, dd.array, false)}</div>`
                                                                : ``}
                                                                        </li>
                                                                    `;
                                                        })
                                                            .join('') +
                                                            html `
                                                                <div
                                                                        class="w-100 fw-500 d-flex align-items-center  fs-6 hoverBtn h_item  rounded px-2 hoverF2 mb-1 addNewComponent"
                                                                        style="color:#36B;gap:10px;"
                                                                        onclick="${gvc.event(() => {
                                                                function setSelectContainer() {
                                                                    if (root) {
                                                                        glitter.share.editorViewModel.selectContainer = glitter.share.editorViewModel.data.config;
                                                                    }
                                                                    else {
                                                                        glitter.share.editorViewModel.selectContainer = og_array;
                                                                    }
                                                                }
                                                                setSelectContainer();
                                                                AddComponent.addWidget = (gvc, cf) => {
                                                                    glitter.share.addComponent(cf);
                                                                };
                                                                AddComponent.addEvent = (gvc, tdata) => {
                                                                    glitter.share.addComponent({
                                                                        "id": gvc.glitter.getUUID(),
                                                                        "js": "./official_view_component/official.js",
                                                                        "css": {
                                                                            "class": {},
                                                                            "style": {}
                                                                        },
                                                                        "data": {
                                                                            'refer_app': tdata.copyApp,
                                                                            "tag": tdata.copy,
                                                                            "list": [],
                                                                            "carryData": {},
                                                                            _style_refer_global: {
                                                                                index: `0`
                                                                            }
                                                                        },
                                                                        "type": "component",
                                                                        "class": "",
                                                                        "index": 0,
                                                                        "label": tdata.title,
                                                                        "style": "",
                                                                        "bundle": {},
                                                                        "global": [],
                                                                        "toggle": false,
                                                                        "stylist": [],
                                                                        "dataType": "static",
                                                                        "style_from": "code",
                                                                        "classDataType": "static",
                                                                        "preloadEvenet": {},
                                                                        "share": {}
                                                                    });
                                                                };
                                                                AddComponent.toggle(true);
                                                            })}"
                                                                >
                                                                    <i class="fa-solid fa-plus"></i>新增區段
                                                                </div>
                                                            `);
                                                    },
                                                    divCreate: {
                                                        elem: 'ul',
                                                        class: `m-0 `,
                                                        option: [
                                                            {
                                                                key: 'id',
                                                                value: id,
                                                            },
                                                        ],
                                                    },
                                                    onCreate: () => {
                                                        gvc.glitter.addMtScript([
                                                            {
                                                                src: `https://raw.githack.com/SortableJS/Sortable/master/Sortable.js`,
                                                            },
                                                        ], () => {
                                                        }, () => {
                                                        });
                                                        const interval = setInterval(() => {
                                                            if (window.Sortable) {
                                                                try {
                                                                    gvc.addStyle(`ul {
  list-style: none;
  padding: 0;
}`);
                                                                    function swapArr(arr, index1, index2) {
                                                                        const data = arr[index1];
                                                                        arr.splice(index1, 1);
                                                                        arr.splice(index2, 0, data);
                                                                    }
                                                                    let startIndex = 0;
                                                                    let interVal = 0;
                                                                    function swapElements(element, target) {
                                                                        const container = element.parentNode;
                                                                        if (container.children.length !== target) {
                                                                            console.log(`index==>${Array.from(container.children).indexOf(element)}length===>${container.children.length}===target===>${target}`);
                                                                            if (!(Array.from(container.children).indexOf(element) > target)) {
                                                                                target++;
                                                                            }
                                                                            container.insertBefore(element, container.children[target]);
                                                                        }
                                                                        else {
                                                                            container.appendChild(element);
                                                                        }
                                                                    }
                                                                    Sortable.create(document.getElementById(id), {
                                                                        group: gvc.glitter.getUUID(),
                                                                        animation: 100,
                                                                        handle: '.dragItem',
                                                                        onChange: function (evt2) {
                                                                            clearInterval(interval);
                                                                            const newIndex = evt2.newIndex;
                                                                            interVal = setTimeout(() => {
                                                                                swapElements(og_array[startIndex].editor_bridge.element().parentNode, newIndex);
                                                                                swapArr(og_array, startIndex, newIndex);
                                                                                startIndex = newIndex;
                                                                                setTimeout(() => {
                                                                                    const dd = og_array[newIndex];
                                                                                    dd && dd.editor_bridge && dd.editor_bridge.scrollWithHover();
                                                                                });
                                                                            }, 200);
                                                                        },
                                                                        onEnd: (evt2) => {
                                                                            const newIndex = evt2.newIndex;
                                                                            clearInterval(interval);
                                                                            swapElements(og_array[startIndex].editor_bridge.element().parentNode, newIndex);
                                                                            swapArr(og_array, startIndex, newIndex);
                                                                            setPageConfig();
                                                                            const dd = og_array[newIndex];
                                                                            dd.info && dd.info.editor_bridge && dd.info.editor_bridge.cancelHover();
                                                                            glitter.share.left_block_hover = false;
                                                                            if ((Storage.view_type !== 'mobile')) {
                                                                                const frame = document.querySelector('.iframe_view');
                                                                                frame.style.height = frame.original_height;
                                                                                $('#editerCenter').removeClass('scale_iframe');
                                                                            }
                                                                            setTimeout(() => {
                                                                                const dd = og_array[newIndex];
                                                                                dd && dd.editor_bridge && dd.editor_bridge.scrollWithHover();
                                                                            }, 300);
                                                                        },
                                                                        onStart: function (evt) {
                                                                            startIndex = evt.oldIndex;
                                                                            glitter.share.left_block_hover = true;
                                                                            (Storage.view_type !== 'mobile') && $('#editerCenter').addClass('scale_iframe');
                                                                        },
                                                                    });
                                                                }
                                                                catch (e) {
                                                                }
                                                                clearInterval(interval);
                                                            }
                                                        }, 100);
                                                    },
                                                };
                                            });
                                        }
                                        return html `
                                            <div class="p-2 root-left-container">
                                                ${renderItems(list, pageConfig, true)}
                                            </div>`;
                                    })(),
                                ].join('');
                            })()}`,
                        ].join('');
                    }
                    else {
                        return html `
                            <li class="w-100 align-items-center  d-flex editor_item_title  start-0 bg-white z-index-9"
                                style="z-index: 999;" onclick="${gvc.event(() => {
                        })}">
                                <span style="font-size:14px;">${viewModel.data.name}-區段</span>
                                <div
                                        class="hoverBtn d-flex align-items-center justify-content-center   border ms-auto me-2"
                                        style="height:36px;width:36px;border-radius:10px;cursor:pointer;color:#151515;"
                                        onclick="${gvc.event(() => {
                            glitter.share.editorViewModel.selectContainer = glitter.share.editorViewModel.data.config;
                            AddComponent.toggle(true);
                        })}"
                                >
                                    <i class="fa-regular fa-circle-plus"></i>
                                </div>
                            </li>

                            ${(() => {
                            return gvc.map([
                                (() => {
                                    let pageConfig = viewModel.data.config.filter((dd, index) => {
                                        return dd.type !== 'code' && (dd.type !== 'widget' || (dd.data.elem !== 'style' && dd.data.elem !== 'link' && dd.data.elem !== 'script'));
                                    });
                                    function setPageConfig() {
                                        viewModel.data.config = pageConfig.concat(viewModel.data.config.filter((dd, index) => {
                                            return !(dd.type !== 'code' && (dd.type !== 'widget' || (dd.data.elem !== 'style' && dd.data.elem !== 'link' && dd.data.elem !== 'script')));
                                        }));
                                        try {
                                            viewModel.dataList.find((dd) => {
                                                return dd.tag === viewModel.data.tag;
                                            }).config = viewModel.data.config;
                                            pageConfig = viewModel.data.config;
                                        }
                                        catch (e) {
                                        }
                                        gvc.notifyDataChange(vid);
                                    }
                                    return new PageEditor(gvc, 'MainEditorLeft', 'MainEditorRight').renderLineItem(pageConfig, false, pageConfig, {
                                        selectEv: (dd) => {
                                            return dd.id === Storage.lastSelect;
                                        },
                                        refreshEvent: () => {
                                            setPageConfig();
                                        },
                                    });
                                })(),
                            ]);
                        })()}
                        `;
                    }
                },
                divCreate: {
                    class: `swiper-slide h-100 position-relative design-guide-1`,
                    style: `${(glitter.share.top_inset) ? `padding-top:${glitter.share.top_inset}px !important;padding-bottom:${glitter.share.bottom_inset}px !important;` : ``}`
                },
                onCreate: () => {
                    $('.tooltip').remove();
                    $('[data-bs-toggle="tooltip"]').tooltip();
                },
            };
        });
    }
    static globalSetting(gvc) {
        var _a, _b;
        const globalValue = gvc.glitter.share.editorViewModel.appConfig;
        globalValue.color_theme = (_a = globalValue.color_theme) !== null && _a !== void 0 ? _a : [];
        globalValue.container_theme = (_b = globalValue.container_theme) !== null && _b !== void 0 ? _b : [];
        const vm = {
            type: 'list',
            data: {},
            name: '配色1',
            index: 0,
        };
        return gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    return html `
                        <div class="guide-user-editor-11" style="">
                            ${(() => {
                        if (vm.type === 'list') {
                            return [(() => {
                                    if (document.body.clientWidth < 800) {
                                        return `<div class="w-100 d-flex align-items-center p-3 border-bottom">
                            <h5 class="offcanvas-title  " style="max-width: calc(100% - 50px);overflow: hidden;text-overflow: ellipsis;">全站樣式設定</h5>
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
                                })(), Main_editor.color_list(vm, gvc, id, globalValue),
                                Main_editor.fonts_list(vm, gvc, id, globalValue)
                            ].join('');
                        }
                        else if (vm.type === 'color_detail') {
                            return Main_editor.color_detail({
                                gvc: gvc,
                                back: () => {
                                    vm.type = 'list';
                                    gvc.notifyDataChange(id);
                                },
                                name: `配色${vm.index + 1}`,
                                data: vm.data,
                                index: vm.index
                            });
                        }
                        else if (vm.type === 'container_detail') {
                            return CustomStyle.globalContainerDetail({
                                gvc: gvc,
                                back: () => {
                                    vm.type = 'list';
                                    gvc.notifyDataChange(id);
                                },
                                name: `容器${vm.index + 1}`,
                                data: vm.data,
                                index: vm.index
                            });
                        }
                        else {
                            return ``;
                        }
                    })()}
                        </div>
                    `;
                },
                divCreate: {
                    class: ``,
                },
            };
        });
    }
    static color_list(vm, gvc, id, globalValue) {
        return gvc.bindView(() => {
            const vm_c = {
                toggle: false,
                id: gvc.glitter.getUUID()
            };
            return {
                bind: vm_c.id,
                view: () => {
                    const array = [`<div class="hoverF2 d-flex align-items-center p-3"
                 onclick="${gvc.event(() => {
                            vm_c.toggle = !vm_c.toggle;
                            gvc.notifyDataChange(vm_c.id);
                        })}">
<span class="fw-500 "
      style="max-width: calc(100% - 50px);text-overflow: ellipsis;white-space: nowrap;overflow: hidden;">配色樣式</span>
                <div class="flex-fill"></div>
                ${vm_c.toggle ? ` <i class="fa-solid fa-chevron-down"></i>` : ` <i class="fa-solid fa-chevron-right"></i>`}
            </div>`];
                    if (vm_c.toggle) {
                        array.push(`<div class="row ${(globalValue.color_theme.length === 0) ? `d-none` : ``}"
                                             style="margin:18px;">
                                            ${globalValue.color_theme.map((dd, index) => {
                            return `<div class="col-6 mb-3 ${(index == 0) ? `globalGuide-4` : ``}" style="cursor: pointer;" onclick="${gvc.event(() => {
                                vm.type = 'color_detail';
                                vm.data = globalValue.color_theme[index];
                                vm.index = index;
                                gvc.notifyDataChange(id);
                            })}">
                                                ${Main_editor.colorCard(globalValue.color_theme[index])}
                                                <div class="w-100 t_39_16 mt-2" style="text-align: center;">配色${index + 1}</div>
                                            </div>`;
                        }).join('')}
                                        </div>`);
                        array.push(`<div style="padding: 0px 24px 24px;${(globalValue.color_theme.length === 0) ? `margin-top:24px;` : ``}">
                                            <div class="bt_border_editor"
                                                 onclick="${gvc.event(() => {
                            vm.data = { id: gvc.glitter.getUUID() };
                            globalValue.color_theme.push(vm.data);
                            vm.name = ('配色' + globalValue.color_theme.length);
                            vm.type = 'color_detail';
                            vm.index = globalValue.color_theme.length - 1;
                            gvc.notifyDataChange(id);
                        })}">
                                                新增配色
                                            </div>
                                        </div>`);
                    }
                    return array.join('');
                },
                divCreate: {
                    class: `  border-bottom    w-100 globalGuideColorSetting`
                }
            };
        });
    }
    static fonts_list(vm, gvc, id, globalValue) {
        return gvc.bindView(() => {
            return {
                bind: gvc.glitter.getUUID(),
                view: () => {
                    return new Promise((resolve, reject) => {
                        gvc.glitter.getModule(`${gvc.glitter.root_path}/setting/fonts-config.js`, (FontsConfig) => {
                            resolve(FontsConfig.fontsSettingView(gvc, globalValue));
                        });
                    });
                },
                divCreate: {
                    class: `w-100`
                }
            };
        });
    }
    static color_detail_custom(vm) {
        const gvc = vm.gvc;
        return `<div style="">${EditorConfig.color_setting_config.filter((dd) => {
            return (!vm.filter) || vm.filter(dd.key);
        }).map((dd) => {
            vm.data[dd.key] = vm.data[dd.key] || '#FFFFFF';
            return EditorElem.colorSelect({
                title: dd.title,
                callback: (text) => {
                    vm.data[dd.key] = text;
                    gvc.glitter.share.globalValue[`theme_color.${vm.index}.${dd.key}`] = text;
                    const lastScrollY = document.querySelector('#editerCenter iframe').contentWindow.scrollY;
                    document.querySelector('#editerCenter  iframe').contentWindow.glitter.share.globalValue = gvc.glitter.share.globalValue;
                    const element = document.querySelector('#editerCenter iframe').contentWindow.glitter.elementCallback;
                    Object.keys(element).map((dd) => {
                        try {
                            element[dd].updateAttribute();
                        }
                        catch (e) {
                        }
                    });
                    vm.back();
                },
                gvc: gvc,
                def: vm.data[dd.key]
            });
        }).join('<div style="height: 15px;"></div>')}</div>`;
    }
    static color_detail(vm) {
        var _a;
        const gvc = vm.gvc;
        const globalValue = gvc.glitter.share.editorViewModel.appConfig;
        globalValue.color_theme = (_a = globalValue.color_theme) !== null && _a !== void 0 ? _a : [];
        return gvc.bindView(() => {
            const vId = gvc.glitter.getUUID();
            return {
                bind: vId,
                view: () => {
                    return [
                        `<div class="px-3   border-bottom pb-3 fw-bold mt-2 pt-2" style="cursor: pointer;color:#393939;" onclick="${vm.gvc.event(() => {
                            vm.back();
                        })}">
                            <i class="fa-solid fa-angle-left"></i>
                            <span>${vm.name} 編輯</span>
                        </div>
                        <div class="border-bottom w-100" style="padding: 24px;width: 100%; justify-content: flex-start; align-items: center; gap: 10px; display: inline-flex">
  <div style="width: 93px;">
  ${Main_editor.colorCard(vm.data)}
</div>
  <div style="flex: 1 1 0; flex-direction: column; justify-content: center; align-items: flex-start; gap: 4px; display: inline-flex">
    <div style="align-self: stretch; color: #393939; font-size: 16px;  font-weight: 400; word-wrap: break-word">${vm.name}</div>
  </div>
</div>
                                    `,
                        `<div class="globalGuide-5" style="padding: 18px 24px 24px;">${EditorConfig.color_setting_config.filter((dd) => {
                            return (!vm.filter) || vm.filter(dd.key);
                        }).map((dd) => {
                            vm.data[dd.key] = vm.data[dd.key] || '#FFFFFF';
                            return EditorElem.colorSelect({
                                title: dd.title,
                                callback: (text) => {
                                    vm.data[dd.key] = text;
                                    gvc.glitter.share.globalValue[`theme_color.${vm.index}.${dd.key}`] = text;
                                    const lastScrollY = document.querySelector('#editerCenter iframe').contentWindow.scrollY;
                                    document.querySelector('#editerCenter  iframe').contentWindow.glitter.share.globalValue = gvc.glitter.share.globalValue;
                                    const element = document.querySelector('#editerCenter iframe').contentWindow.glitter.elementCallback;
                                    Object.keys(element).map((dd) => {
                                        try {
                                            element[dd].updateAttribute();
                                        }
                                        catch (e) {
                                        }
                                    });
                                    if (`${vm.index}` === '0') {
                                        document.querySelector('#editerCenter iframe').contentWindow.document.querySelector('body').style.background = gvc.glitter.share.globalValue[`theme_color.0.background`];
                                    }
                                    for (const b of document.querySelector('#editerCenter  iframe').contentWindow.document.querySelectorAll('._builder_color_refresh')) {
                                        b.recreateView();
                                    }
                                    gvc.notifyDataChange(vId);
                                },
                                gvc: gvc,
                                def: vm.data[dd.key]
                            });
                        }).join('<div style="height: 15px;"></div>')}</div>`,
                        `<div style="padding: 0px 24px 24px;"> <div class="bt_border_editor"
                                                 onclick="${gvc.event(() => {
                            const dialog = new ShareDialog(gvc.glitter);
                            dialog.checkYesOrNot({
                                text: '是否確認刪除配色?',
                                callback: (response) => {
                                    if (response) {
                                        globalValue.color_theme = globalValue.color_theme.filter((dd) => {
                                            return dd !== vm.data;
                                        });
                                        vm.back();
                                    }
                                }
                            });
                        })}" >
                                                刪除配色
                                            </div></div>`
                    ].join('');
                }
            };
        });
    }
    static colorCard(cf) {
        cf = (cf || {});
        return `<div style="width:100%;padding: 11px 18px;background: ${cf.background || 'white'}; border-radius: 7px; overflow: hidden; border: 1px #DDDDDD solid; justify-content: center; align-items: center; display: flex">
    <div style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: center; gap: 2px; display: inline-flex">
      <div style="font-size: 16px;  font-weight: 400; word-wrap: break-word">
      <span style="color:${cf.title || '#554233'};">A</span>
      <span style="color:${cf.content || '#554233'};">a</span>
      </div>
      <div style=" justify-content: flex-start; align-items: flex-start; gap: 4px; display: inline-flex">
        <div style="width: 26px; height: 13px; position: relative; background: ${cf['solid-button-bg'] || '#554233'}; border-radius: 7px;"></div>
        <div style="width: 26px;height: 13px; position: relative;  border-radius: 7px; border: 1px solid ${cf['border-button-bg'] || '#554233'};"></div>
      </div>
    </div>
  </div>`;
    }
    static right(gvc, viewModel, createID, gBundle) {
        const glitter = gvc.glitter;
        return gvc.bindView(() => {
            let haveAdd = true;
            return {
                bind: `htmlGenerate`,
                view: () => {
                    let hoverList = [];
                    if (viewModel.selectItem !== undefined) {
                        hoverList.push(viewModel.selectItem.id);
                    }
                    if (!viewModel.selectItem) {
                        return `<div class="position-absolute w-100 top-50 d-flex align-items-center justify-content-center flex-column translate-middle-y">
<iframe src="https://embed.lottiefiles.com/animation/84663" class="w-100" style="width: 400px;height: 400px"></iframe>
<h3>請於左側選擇元件編輯</h3>
</div>`;
                    }
                    const htmlGenerate = new glitter.htmlGenerate(viewModel.data.config, hoverList, undefined, true);
                    window.editerData = htmlGenerate;
                    window.page_config = viewModel.data.page_config;
                    const json = JSON.parse(JSON.stringify(viewModel.data.config));
                    json.map((dd) => {
                        dd.refreshAllParameter = undefined;
                        dd.refreshComponentParameter = undefined;
                    });
                    return htmlGenerate.editor(gvc, {
                        return_: false,
                        refreshAll: () => {
                            if (viewModel.selectItem) {
                                gvc.notifyDataChange(['showView']);
                            }
                        },
                        setting: (() => {
                            if (viewModel.selectItem) {
                                return [viewModel.selectItem];
                            }
                            else {
                                return undefined;
                            }
                        })(),
                        deleteEvent: () => {
                            viewModel.selectItem = undefined;
                            gvc.notifyDataChange(createID);
                        },
                    });
                },
                divCreate: {},
                onCreate: () => {
                    setTimeout(() => {
                        var _a;
                        $('#jumpToNav').scrollTop((_a = parseInt(glitter.getCookieByName('jumpToNavScroll'), 10)) !== null && _a !== void 0 ? _a : 0);
                    }, 1000);
                },
            };
        });
    }
    static editorContent(option) {
        const glitter = option.gvc.glitter;
        const viewModel = option.viewModel;
        const gvc = option.gvc;
        function checkSelect(array) {
            array.map((dd) => {
                if (dd.id === Storage.lastSelect) {
                    viewModel.selectContainer = array;
                    viewModel.selectItem = dd;
                }
                else if (Array.isArray(dd.data.setting)) {
                    checkSelect(dd.data.setting);
                }
            });
        }
        const container_cf = glitter.share.findWidgetIndex(viewModel.selectItem.id).container_cf;
        return [
            html `
                <div
                        class="right_scroll"
                        style="overflow-x:hidden;overflow-y:auto;${Storage.select_function === 'user-editor' ? `height:calc(100vh ${document.body.clientWidth < 800 ? `- ${0 + parseInt(glitter.share.top_inset, 10)}` : `- 56`}px)` : `height:calc(100vh - 150px);`}"
                        onscroll="${gvc.event(() => {
                if (document.querySelector('.right_scroll').scrollTop > 0) {
                    glitter.share.lastRightScrollTop = document.querySelector('.right_scroll').scrollTop;
                }
            })}"
                >
                    ${gvc.bindView(() => {
                return {
                    bind: `htmlGenerate`,
                    view: () => {
                        gvc.notifyDataChange('editFooter');
                        checkSelect(viewModel.data.config);
                        if ((viewModel.selectItem === undefined || viewModel.selectItem.js === undefined) && Storage.select_function !== 'user-editor') {
                            return `<div class="position-absolute w-100 top-50 d-flex align-items-center justify-content-center flex-column translate-middle-y">
<img class="border" src="https://liondesign-prd.s3.amazonaws.com/file/252530754/1692927479829-Screenshot 2023-08-25 at 9.36.15 AM.png"  >
<lottie-player src="https://lottie.host/23df5e29-6a51-428a-b112-ff6901c4650e/yxNS0Bw8mk.json" class="position-relative" background="transparent" speed="1" style="margin-top:-70px;" loop  autoplay direction="1" mode="normal"></lottie-player>
<div style="font-size:16px;margin-top:-10px;width:calc(100% - 20px);word-break:break-all !important;display:inline-block;white-space:normal;" class="p-2 text-center alert alert-secondary" >
請直接點擊頁面元件，或於左側頁面區段來選擇元件進行編輯。</div>
</div>`;
                        }
                        let hoverList = [];
                        if (viewModel.selectItem !== undefined) {
                            hoverList.push(viewModel.selectItem.id);
                        }
                        const htmlGenerate = new glitter.htmlGenerate(viewModel.data.config, hoverList, undefined, true);
                        window.editerData = htmlGenerate;
                        window.page_config = viewModel.data.page_config;
                        const json = JSON.parse(JSON.stringify(viewModel.data.config));
                        json.map((dd) => {
                            dd.refreshAllParameter = undefined;
                            dd.refreshComponentParameter = undefined;
                        });
                        return (htmlGenerate.editor(gvc, {
                            return_: false,
                            refreshAll: () => {
                                if (viewModel.selectItem) {
                                    gvc.notifyDataChange(['showView']);
                                }
                            },
                            setting: (() => {
                                if (viewModel.selectItem) {
                                    return [viewModel.selectItem];
                                }
                                else {
                                    return undefined;
                                }
                            })(),
                            deleteEvent: () => {
                            },
                        }));
                    },
                    divCreate: {
                        class: `p-2`,
                    },
                    onCreate: () => {
                    },
                };
            })}
                    <div style="height: 60px;"></div>
                    <div class="${(document.body.clientWidth < 800) ? `position-fixed` : `position-absolute`} w-100 bottom-0 d-flex align-items-center p-3 shadow justify-content-end border-top bg-white "
                         style="height: 60px;${(document.body.clientWidth < 800) ? `padding-bottom:${parseInt(glitter.share.bottom_inset, 10)}px !important;` : ``}">
                        ${(() => {
                const view = [];
                if ((viewModel.selectItem.deletable !== 'false')) {
                    setTimeout(() => {
                        $('.tooltip').remove();
                        $('[data-bs-toggle="tooltip"]').tooltip();
                    }, 100);
                    view.push(`<button class="btn btn-snow" type="button" style="width:30px;" data-bs-toggle="tooltip" data-bs-placement="top"
                                                data-bs-custom-class="custom-tooltip"
                                                data-bs-title="返回列表" onclick="${gvc.event(() => {
                        Storage.lastSelect = '';
                        gvc.glitter.share.editorViewModel.selectItem = undefined;
                        gvc.glitter.share.selectEditorItem();
                    })}">
                <span class="tx_700"><i class="fa-solid fa-list" aria-hidden="true"></i></span>
            </button>`);
                    if (container_cf) {
                        view.push(BgWidget.cancel(gvc.event(() => {
                            glitter.htmlGenerate.selectWidget({
                                widget: container_cf,
                                widgetComponentID: container_cf.id,
                                gvc: document.querySelector('.iframe_view').contentWindow.glitter.pageConfig[0].gvc,
                                scroll_to_hover: true,
                                glitter: glitter,
                            });
                        }), '上一層'));
                    }
                    view.push(BgWidget.cancel(gvc.event(() => {
                        const dialog = new ShareDialog(gvc.glitter);
                        navigator.clipboard.writeText(JSON.stringify(viewModel.selectItem));
                        dialog.successMessage({ text: '複製成功，滑動至要插入的區塊，並點擊貼上。' });
                    }), '複製'));
                    view.push(BgWidget.cancel(gvc.event(() => {
                        glitter.closeDrawer();
                        glitter.htmlGenerate.deleteWidget(glitter.share.editorViewModel.selectContainer, viewModel.selectItem, () => {
                        });
                    }), '刪除'));
                }
                return view.join('<div class="mx-1"></div>');
            })()}
                    </div>
                </div>
            `,
            gvc.bindView(() => {
                return {
                    bind: 'editFooter',
                    view: () => {
                        if (viewModel.selectItem === undefined || viewModel.selectItem.js === undefined) {
                            return ``;
                        }
                        return html `
                            <div
                                    class="w-100  position-absolute bottom-0 border-top d-flex align-items-center ps-3 ${Storage.select_function === 'user-editor' ? `d-none` : ``}"
                                    style="height:50px;background:#f6f6f6;font-size:14px;"
                            >
                                <div
                                        class="hoverBtn fw-bold"
                                        style="color:#8e1f0b;cursor:pointer;"
                                        onclick="${gvc.event(() => {
                            checkSelect(viewModel.data.config);
                            try {
                                const dialog = new ShareDialog(gvc.glitter);
                                function deleteBlock() {
                                    for (let a = 0; a < viewModel.selectContainer.length; a++) {
                                        if (viewModel.selectContainer[a] == viewModel.selectItem) {
                                            viewModel.selectContainer.splice(a, 1);
                                        }
                                    }
                                    if (document.querySelector('#editerCenter iframe').contentWindow.document.querySelector(`.editor_it_${viewModel.selectItem.id}`)) {
                                        document.querySelector('#editerCenter iframe').contentWindow.glitter.$(`.editor_it_${viewModel.selectItem.id}`).parent().remove();
                                    }
                                    viewModel.selectItem = undefined;
                                    gvc.notifyDataChange(['right_NAV', 'MainEditorLeft']);
                                }
                                deleteBlock();
                            }
                            catch (e) {
                                alert(e);
                            }
                        })}"
                                >
                                    <i class="fa-solid fa-trash-can me-2"></i>移除區塊
                                </div>
                            </div>`;
                    },
                };
            }),
        ].join('');
    }
    static center(gvc) {
        if (gvc.glitter.getUrlParameter('function') === 'page-editor') {
            return Main_editor.developerEditor(gvc);
        }
        else {
            return Main_editor.userEditor(gvc);
        }
    }
    static userEditor(gvc) {
        gvc.glitter.share.resetCenterFrame = (scale) => {
            const container_width = (() => {
                if (Storage.view_type === ViewType.mobile) {
                    return (document.body.clientWidth > 800) ? 414 : document.body.clientWidth;
                }
                else {
                    return (document.body.clientWidth < 800) ? document.body.clientWidth : document.body.clientWidth - 365;
                }
            })() * (scale || 1);
            const tool_box = (() => {
                if (document.body.clientWidth < 800) {
                    return 40;
                }
                else {
                    return 0;
                }
            })();
            const container_height = (() => {
                if (gvc.glitter.share.top_inset) {
                    return document.body.clientHeight - 56 - (parseInt(gvc.glitter.share.top_inset, 10) + 10);
                }
                else {
                    return document.body.clientHeight - 56;
                }
            })() - tool_box;
            const frame_width = (() => {
                if (Storage.view_type === ViewType.mobile) {
                    return (container_width < 800) ? container_width : 414;
                }
                else {
                    return (container_width > 1300) ? container_width : 1300;
                }
            })();
            const frame_height = container_height * (frame_width / container_width);
            const frame = document.querySelector('.iframe_view');
            frame.style.width = `${frame_width}px`;
            frame.style.height = `${frame_height}px`;
            frame.style.transform = `scale(${(container_width / frame_width).toFixed(2)})`;
            if (document.body.clientWidth > 800 && Storage.view_type === ViewType.mobile) {
                frame.style.left = `25%`;
            }
            else {
                frame.style.left = `0`;
            }
            if (gvc.glitter.share.top_inset) {
                frame.style.top = `${parseInt(gvc.glitter.share.top_inset, 10) + tool_box + 10}px`;
            }
            else {
                frame.style.top = `${tool_box}px`;
            }
        };
        return gvc.bindView(() => {
            return {
                bind: 'iframe_center',
                view: () => {
                    if (EditorConfig.backend_page() === 'backend-manger') {
                        return html `
                            <div class="position-relative"
                                 style="width:100%;height: 100%;padding-top:${parseInt(gvc.glitter.share.top_inset, 10)}px;"
                                 id="editerCenter">
                            </div>`;
                    }
                    else {
                        setTimeout(() => {
                            gvc.glitter.share.resetCenterFrame();
                        }, 50);
                        return html `
                            <div class="position-relative w-100 h-100"
                                 style="${(parseInt(gvc.glitter.share.top_inset, 10)) ? `padding-top:${parseInt(gvc.glitter.share.top_inset, 10) + 10}px;` : ``}"
                                 id="editerCenter">
                                ${(document.body.clientWidth < 800) ? gvc.bindView(() => {
                            let last_selected = '';
                            return {
                                bind: `item-editor-select`,
                                view: () => {
                                    if (gvc.glitter.share.editorViewModel.selectItem) {
                                        function addWidgetEvent(direction, component) {
                                            const cf = gvc.glitter.share.editorViewModel.selectItem;
                                            let glitter = window.glitter;
                                            while (!glitter.share.editorViewModel) {
                                                glitter = window.parent.glitter;
                                            }
                                            if (component) {
                                                component = JSON.parse(JSON.stringify(component));
                                                component.id = gvc.glitter.getUUID();
                                                glitter.share.addWithIndex({
                                                    data: component,
                                                    index: cf.id,
                                                    direction: direction,
                                                });
                                            }
                                            else {
                                                glitter.getModule(new URL('../.././editor/add-component.js', import.meta.url).href, (AddComponent) => {
                                                    AddComponent.toggle(true);
                                                    AddComponent.addWidget = (gvc, tdata) => {
                                                        glitter.share.addWithIndex({
                                                            data: tdata,
                                                            index: cf.id,
                                                            direction: direction,
                                                        });
                                                    };
                                                    AddComponent.addEvent = (gvc, tdata) => {
                                                        glitter.share.addWithIndex({
                                                            data: {
                                                                id: gvc.glitter.getUUID(),
                                                                js: './official_view_component/official.js',
                                                                css: {
                                                                    class: {},
                                                                    style: {},
                                                                },
                                                                data: {
                                                                    refer_app: tdata.copyApp,
                                                                    tag: tdata.copy,
                                                                    list: [],
                                                                    carryData: {},
                                                                    _style_refer_global: {
                                                                        index: `0`,
                                                                    },
                                                                },
                                                                type: 'component',
                                                                class: 'w-100',
                                                                index: 0,
                                                                label: tdata.title,
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
                                                            },
                                                            index: cf.id,
                                                            direction: direction,
                                                        });
                                                    };
                                                });
                                            }
                                        }
                                        function readAndPasteClipboardContent(index) {
                                            return __awaiter(this, void 0, void 0, function* () {
                                                const dialog = new ShareDialog(gvc.glitter);
                                                try {
                                                    const json = JSON.parse(yield navigator.clipboard.readText());
                                                    if (!json.id) {
                                                        dialog.errorMessage({ text: '請選擇要複製的元件，並按下複製元件後再執行貼上。' });
                                                    }
                                                    else {
                                                        addWidgetEvent(index, json);
                                                    }
                                                }
                                                catch (error) {
                                                    dialog.errorMessage({ text: '請選擇要複製的元件，並按下複製元件。' });
                                                }
                                            });
                                        }
                                        if (gvc.glitter.share.editorViewModel.selectItem.id === last_selected) {
                                            setTimeout(() => {
                                                gvc.glitter.openDrawer();
                                            }, 50);
                                        }
                                        else {
                                            setTimeout(() => {
                                                last_selected = gvc.glitter.share.editorViewModel.selectItem.id;
                                            }, 50);
                                        }
                                        return html `
                                                    <div class="border-bottom  d-flex align-items-center px-2 shadow"
                                                         style="height:40px;gap:7px;background: linear-gradient(143deg, #FFB400 -22.7%, #FF6C02 114.57%);color:white;">
                                                        <div class="fw-500 fs-6"
                                                             style="text-overflow: ellipsis;overflow: hidden !important;">
                                                            ${gvc.glitter.share.editorViewModel.selectItem.label}
                                                        </div>
                                                        <div class="flex-fill"></div>
                                                        <div class="rounded-1 border bg-white p-1 px-2 fw-500"
                                                             style="font-size: 14px;color:black;"
                                                             onclick="${gvc.event(() => {
                                            gvc.glitter.openDrawer();
                                        })}">編輯
                                                        </div>
                                                        <div class="rounded-1 border bg-white p-1 px-2 fw-500 ${(gvc.glitter.share.editorViewModel.selectItem.deletable === 'false') ? `d-none` : ``}"
                                                             style="font-size: 14px;color:black;"
                                                             onclick="${gvc.event(() => {
                                            const dialog = new ShareDialog(gvc.glitter);
                                            navigator.clipboard.writeText(JSON.stringify(gvc.glitter.share.editorViewModel.selectItem));
                                            dialog.successMessage({ text: '複製成功，滑動至要插入的區塊，並點擊貼上。' });
                                        })}">複製
                                                        </div>
                                                        <div class="btn-group dropdown">
                                                            <div class="rounded-1 border bg-white p-1 px-2 fw-500"
                                                                 style="font-size: 14px;color:black;"
                                                                 data-bs-toggle="dropdown" aria-haspopup="true"
                                                                 aria-expanded="false">貼上
                                                            </div>
                                                            <div class="dropdown-menu my-1">
                                                                <a class="dropdown-item" onclick="${gvc.event(() => {
                                            gvc.glitter.htmlGenerate.block_timer = new Date().getTime();
                                            readAndPasteClipboardContent(-1);
                                        })}">向上貼上元件</a>
                                                                <a class="dropdown-item" onclick="${gvc.event(() => {
                                            gvc.glitter.htmlGenerate.block_timer = new Date().getTime();
                                            readAndPasteClipboardContent(1);
                                        })}">向下貼上元件</a>
                                                            </div>
                                                        </div>
                                                        <div class="btn-group dropdown">
                                                            <div class="rounded-1 border bg-white p-1 px-2 fw-500"
                                                                 style="font-size: 14px;color:black;"
                                                                 data-bs-toggle="dropdown" aria-haspopup="true"
                                                                 aria-expanded="false">新增
                                                            </div>
                                                            <div class="dropdown-menu my-1">
                                                                <a class="dropdown-item" onclick="${gvc.event(() => {
                                            addWidgetEvent(-1);
                                        })}">向上添加元件</a>
                                                                <a class="dropdown-item" onclick="${gvc.event(() => {
                                            addWidgetEvent(1);
                                        })}">向下添加元件</a>
                                                            </div>
                                                        </div>
                                                    </div>`;
                                    }
                                    else {
                                        return `<div class="border-bottom  d-flex align-items-center px-2 shadow" style="height:40px;gap:10px;background: linear-gradient(143deg, #FFB400 -22.7%, #FF6C02 114.57%);color:white;">
                                    <div class="flex-fill"></div>
                                     <div class="fw-500 fs-6" style="text-overflow: ellipsis;overflow: hidden !important;">點擊區段來編輯內容</div>
                                     <div class="flex-fill"></div>
                                 </div>`;
                                    }
                                },
                                divCreate: {}
                            };
                        }) : ``}
                                <iframe class="bg-white iframe_view"
                                        style="transform-origin: top left; /* 從左上角縮放 */
  position: absolute;
  top: 0;
  left: 0;"
                                        sandbox="allow-same-origin allow-scripts"
                                        src="${gvc.glitter.root_path}${gvc.glitter.getUrlParameter('page')}?type=htmlEditor&appName=${gvc.glitter.getUrlParameter('appName')}&device=${gvc.glitter.getUrlParameter('device')}"></iframe>
                            </div>`;
                    }
                },
                divCreate: () => {
                    return {
                        class: (Storage.select_function === 'page-editor' || Storage.select_function === 'user-editor')
                            ? `d-flex align-items-center justify-content-center flex-column mx-auto` : `d-flex align-items-center justify-content-center flex-column `,
                        style: (Storage.select_function === 'page-editor' || Storage.select_function === 'user-editor')
                            ? ``
                            : `width: calc(${(document.body.clientWidth < 800) ? `${document.body.clientWidth}px` : `100%`});height: ${window.innerHeight - EditorConfig.getPaddingTop(gvc) - 56}px;overflow:hidden;`
                    };
                }
            };
        });
    }
    static developerEditor(gvc) {
        return gvc.bindView(() => {
            return {
                bind: 'iframe_center',
                view: () => {
                    if (EditorConfig.backend_page() === 'backend-manger') {
                        return html `
                            <div class="position-relative"
                                 style="width:100%;height: 100%;padding-top:${parseInt(gvc.glitter.share.top_inset, 10)}px;"
                                 id="editerCenter">
                            </div>`;
                    }
                    else {
                        return html `
                            <div class="position-relative"
                                 style="width:100%;height: calc(100%);${(parseInt(gvc.glitter.share.top_inset, 10)) ? `padding-top:${parseInt(gvc.glitter.share.top_inset, 10)}px;` : ``}"
                                 id="editerCenter">
                                <iframe class="w-100 h-100  bg-white iframe_view"
                                        sandbox="allow-same-origin allow-scripts"
                                        src="${gvc.glitter.root_path}${gvc.glitter.getUrlParameter('page')}?type=htmlEditor&appName=${gvc.glitter.getUrlParameter('appName')}&device=${gvc.glitter.getUrlParameter('device')}"></iframe>
                            </div>`;
                    }
                },
                divCreate: () => {
                    return {
                        class: Storage.view_type === ViewType.mobile && (Storage.select_function === 'page-editor' || Storage.select_function === 'user-editor')
                            ? `d-flex align-items-center justify-content-center flex-column mx-auto` : `d-flex align-items-center justify-content-center flex-column`,
                        style: Storage.view_type === ViewType.mobile && (Storage.select_function === 'page-editor' || Storage.select_function === 'user-editor')
                            ? `width: calc(${(document.body.clientWidth < 800) ? `${document.body.clientWidth}px` : `414px`});height: ${window.innerHeight - EditorConfig.getPaddingTop(gvc) - 56}px;` : `width: calc(${(document.body.clientWidth < 800) ? `${document.body.clientWidth}px` : `100%`});height: ${window.innerHeight - EditorConfig.getPaddingTop(gvc) - 56}px;overflow:hidden;`
                    };
                }
            };
        });
    }
    static pageAndComponent(option) {
        const data = option.data;
        const gvc = option.gvc;
        const glitter = gvc.glitter;
        return gvc.bindView(() => {
            const id = 'right_NAV';
            return {
                bind: id,
                view: () => {
                    return gvc.bindView(() => {
                        const vm = {
                            pageID: gvc.glitter.getUUID(),
                            get select() {
                                return localStorage.getItem('uasi') || 'layout';
                            },
                            set select(v) {
                                localStorage.setItem('uasi', v);
                            },
                            selectItem: undefined,
                        };
                        return {
                            bind: vm.pageID,
                            view: () => {
                                if (localStorage.getItem('rightSelect') === 'module') {
                                    localStorage.setItem('rightSelect', 'page');
                                    vm.select = 'codeBlock';
                                    gvc.notifyDataChange(vm.pageID);
                                }
                                let array = [];
                                if (!vm.selectItem) {
                                    array.push(html `
                                        <div class="d-flex bg-white w-100 border-bottom ${Storage.select_function === 'user-editor' ? `d-none` : ``}">
                                            <div class="w-100" style="">
                                                <div style=""
                                                     class="d-flex align-items-center justify-content-around  w-100 p-2 ">
                                                    ${(() => {
                                        const items = [
                                            {
                                                title: '頁面內容',
                                                value: 'layout',
                                                icon: 'fa-regular fa-memo',
                                            },
                                            {
                                                title: '區段編輯',
                                                value: 'codeBlock',
                                                icon: 'fa-regular fa-brackets-curly',
                                            },
                                            {
                                                title: '表單編輯',
                                                value: 'user_editor',
                                                icon: 'fa-regular fa-pen-to-square',
                                            },
                                        ].filter((dd) => {
                                            if (dd.value === 'basic' && Storage.select_page_type === 'module') {
                                                return false;
                                            }
                                            if (Storage.editor_mode === 'user') {
                                                return ['layout', 'basic', 'codeBlock'].find((d2) => {
                                                    return dd.value === d2;
                                                });
                                            }
                                            else {
                                                return true;
                                            }
                                        });
                                        if (!items.find((dd) => {
                                            return dd.value === vm.select;
                                        })) {
                                            vm.select = items[0].value;
                                        }
                                        return items
                                            .map((dd) => {
                                            return html `
                                                                        <div
                                                                                class=" d-flex align-items-center justify-content-center ${dd.value === vm.select ? `border` : ``} rounded-3"
                                                                                style="height:36px;width:36px;cursor:pointer;
${dd.value === vm.select ? `background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);background:-webkit-linear-gradient(135deg, #667eea 0%, #764ba2 100%);color:white;` : `color:#151515;`}
"
                                                                                onclick="${gvc.event(() => {
                                                vm.select = dd.value;
                                                gvc.notifyDataChange(vm.pageID);
                                            })}"
                                                                                data-bs-toggle="tooltip"
                                                                                data-bs-placement="top"
                                                                                data-bs-custom-class="custom-tooltip"
                                                                                data-bs-title="${dd.title}"
                                                                        >
                                                                            <i class="${dd.icon}"
                                                                               aria-hidden="true"></i>
                                                                        </div>`;
                                        })
                                            .join(``);
                                    })()}
                                                </div>
                                            </div>
                                        </div>`);
                                    (vm.select === 'codeBlock' || vm.select === 'user_editor') &&
                                        array.push(Main_editor.editorContent({
                                            gvc: gvc,
                                            viewModel: data,
                                        }));
                                    vm.select === 'layout' &&
                                        array.push(PageEditor.formSetting({
                                            gvc: gvc,
                                            id: glitter.getUUID(),
                                            vid: '',
                                            viewModel: gvc.glitter.share.editorViewModel.data,
                                        }));
                                    vm.select === 'basic' &&
                                        array.push(PageEditor.pageEditorView({
                                            gvc: gvc,
                                            id: glitter.getUUID(),
                                            vid: '',
                                            viewModel: {
                                                get selectItem() {
                                                    return gvc.glitter.share.editorViewModel.data;
                                                },
                                                get dataList() {
                                                    return gvc.glitter.share.editorViewModel.dataList;
                                                },
                                            },
                                        }));
                                    vm.select === 'style' &&
                                        array.push(PageEditor.styleRenderSelector({
                                            gvc: gvc,
                                            vid: gvc.glitter.getUUID(),
                                            viewModel: {
                                                selectContainer: glitter.share.editorViewModel.data.config,
                                                globalStyle: glitter.share.editorViewModel.globalStyle,
                                                data: glitter.share.editorViewModel.data,
                                            },
                                            docID: '',
                                            selectBack: (dd) => {
                                                EditorElem.openEditorDialog(gvc, (gvc) => {
                                                    return PageEditor.styleRenderEditor({
                                                        gvc: gvc,
                                                        vid: gvc.glitter.getUUID(),
                                                        viewModel: {
                                                            selectItem: dd,
                                                            get globalStyle() {
                                                                return glitter.share.editorViewModel.globalStyle;
                                                            },
                                                            set globalStyle(v) {
                                                                glitter.share.editorViewModel.globalStyle = v;
                                                            },
                                                            data: glitter.share.editorViewModel.data,
                                                        },
                                                        docID: '',
                                                        editFinish: () => {
                                                            vm.selectItem = undefined;
                                                            gvc.notifyDataChange(vm.pageID);
                                                        },
                                                    });
                                                }, () => {
                                                    gvc.notifyDataChange(vm.pageID);
                                                }, 450, '編輯STYLE樣式');
                                            },
                                        }));
                                    vm.select === 'script' &&
                                        array.push(PageEditor.scriptRenderSelector({
                                            gvc: gvc,
                                            vid: gvc.glitter.getUUID(),
                                            viewModel: {
                                                selectContainer: glitter.share.editorViewModel.data.config,
                                                globalScript: glitter.share.editorViewModel.globalScript,
                                                data: glitter.share.editorViewModel.data,
                                            },
                                            docID: '',
                                            selectBack: (dd) => {
                                                EditorElem.openEditorDialog(gvc, (gvc) => {
                                                    return PageEditor.scriptRenderEditor({
                                                        gvc: gvc,
                                                        vid: gvc.glitter.getUUID(),
                                                        viewModel: {
                                                            selectItem: dd,
                                                            get globalScript() {
                                                                return glitter.share.editorViewModel.globalScript;
                                                            },
                                                            set globalScript(v) {
                                                                glitter.share.editorViewModel.globalScript = v;
                                                            },
                                                            data: glitter.share.editorViewModel.data,
                                                        },
                                                        docID: '',
                                                        editFinish: () => {
                                                            vm.selectItem = undefined;
                                                            gvc.notifyDataChange(vm.pageID);
                                                        },
                                                    });
                                                }, () => {
                                                    gvc.notifyDataChange(vm.pageID);
                                                }, 450, '編輯SCRIPT與觸發事件');
                                            },
                                        }));
                                    vm.select === 'code' &&
                                        array.push((() => {
                                            const json = JSON.parse(JSON.stringify(glitter.share.editorViewModel.data.config));
                                            json.map((dd) => {
                                                dd.refreshAllParameter = undefined;
                                                dd.refreshComponentParameter = undefined;
                                            });
                                            let value = JSON.stringify(json, null, '\t');
                                            return gvc.bindView(() => {
                                                const id = glitter.getUUID();
                                                return {
                                                    bind: id,
                                                    view: () => {
                                                        return html `
                                                            <div class="alert alert-danger flex-fill m-0 p-2 "
                                                                 style="white-space: normal;word-break:break-all;">
                                                                此頁面的配置檔包含所有設計模組和觸發事件的代碼配置項目。<br/>建議由熟悉程式開發的工程師進行編輯。
                                                            </div>
                                                            ${EditorElem.customCodeEditor({
                                                            gvc: gvc,
                                                            height: window.innerHeight - 350,
                                                            initial: value,
                                                            title: 'JSON配置參數',
                                                            callback: (data) => {
                                                                value = data;
                                                            },
                                                            language: 'json',
                                                        })}
                                                            <div class="d-flex w-100 mb-2 mt-2 justify-content-end"
                                                                 style="gap:10px;">
                                                                <button
                                                                        class="btn btn-outline-secondary-c "
                                                                        style="flex:1;height:40px; width:calc(50% - 10px);"
                                                                        onclick="${gvc.event(() => {
                                                            navigator.clipboard.writeText(JSON.stringify(json, null, '\t'));
                                                        })}"
                                                                >
                                                                    <i class="fa-regular fa-copy me-2"></i>複製到剪貼簿
                                                                </button>
                                                                <button
                                                                        class="btn btn-primary-c "
                                                                        style="flex:1; height:40px; width:calc(50% - 10px);"
                                                                        onclick="${gvc.event(() => {
                                                            const dialog = new ShareDialog(gvc.glitter);
                                                            try {
                                                                glitter.share.editorViewModel.data.config = JSON.parse(value);
                                                                glitter.closeDiaLog();
                                                                glitter.htmlGenerate.saveEvent();
                                                            }
                                                            catch (e) {
                                                                dialog.errorMessage({ text: '代碼輸入錯誤' });
                                                                console.log(`${e}${e.stack}${e.line}`);
                                                            }
                                                        })}"
                                                                >
                                                                    <i class="fa-regular fa-floppy-disk me-2"></i>儲存
                                                                </button>
                                                            </div>
                                                        `;
                                                    },
                                                    divCreate: {
                                                        class: `p-2`,
                                                    },
                                                };
                                            });
                                        })());
                                }
                                return array.join('');
                            },
                            divCreate: {
                                style: `overflow-x:hidden;`,
                            },
                            onCreate: () => {
                                $('.tooltip').remove();
                                $('[data-bs-toggle="tooltip"]').tooltip();
                            },
                        };
                    });
                },
                divCreate: option.divCreate || {
                    class: `w-100`,
                    style: `height:calc(100vh - ${(document.body.clientWidth < 800) ? 0 : 56}px);overflow-y:auto;`,
                },
            };
        });
    }
}
function swapArr(arr, index1, index2) {
    const data = arr[index1];
    arr.splice(index1, 1);
    arr.splice(index2, 0, data);
}
