import { Swal } from '../../modules/sweetAlert.js';
import { EditorElem } from '../../glitterBundle/plugins/editor-elem.js';
import { PageEditor } from '../../editor/page-editor.js';
import { ShareDialog } from '../../glitterBundle/dialog/ShareDialog.js';
import { Storage } from '../../glitterBundle/helper/storage.js';
import { AddComponent } from '../../editor/add-component.js';
import { EditorConfig } from "../../editor-config.js";
import { ToolSetting } from "./tool-setting.js";
import { BgWidget } from "../../backend-manager/bg-widget.js";
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
                        return Main_editor.colorSetting(gvc);
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
                        console.log(`viewModel.selectItem-is->`, viewModel.selectItem);
                        return Main_editor.pageAndComponent({
                            gvc: gvc,
                            data: viewModel,
                        });
                    }
                    else if (Storage.select_function === 'user-editor') {
                        return [
                            html `
                                <div
                                        class="px-3   border-bottom pb-3 fw-bold mt-2 pt-2 "
                                        style="cursor: pointer;color:#393939;"
                                        onclick="${gvc.event(() => {
                                Storage.lastSelect = '';
                                glitter.share.editorViewModel.selectItem = undefined;
                                glitter.share.selectEditorItem();
                            })}"
                                >
                                    <span>${viewModel.data.name}</span>

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
                                                        toggle: (_a = dd.toggle) !== null && _a !== void 0 ? _a : false,
                                                    });
                                                }
                                                else {
                                                    list.push({
                                                        title: dd.label || '元件',
                                                        index: 0,
                                                        info: dd,
                                                        array: array,
                                                        toggle: (_b = dd.toggle) !== null && _b !== void 0 ? _b : false,
                                                    });
                                                }
                                            });
                                        }
                                        loop(pageConfig, list);
                                        function renderItems(list, og_array, root) {
                                            return gvc.bindView(() => {
                                                const id = gvc.glitter.getUUID();
                                                return {
                                                    bind: id,
                                                    view: () => {
                                                        let lastClick = gvc.glitter.ut.clock();
                                                        return (list
                                                            .map((dd, index) => {
                                                            var _a;
                                                            og_array[index].visible = (_a = og_array[index].visible) !== null && _a !== void 0 ? _a : true;
                                                            return html `
                                                                        <li>
                                                                            <div
                                                                                    class="w-100 fw-500 d-flex align-items-center  fs-6 hoverBtn h_item  rounded px-2 hoverF2 mb-1"
                                                                                    style="gap:5px;color:#393939;${dd.toggle && dd.type === 'container' ? `border-radius: 5px;background: #F2F2F2;` : ``}"
                                                                                    onclick="${gvc.event(() => {
                                                                if (lastClick.stop() > 0.1) {
                                                                    dd.info && (dd.info.toggle = !dd.info.toggle);
                                                                    gvc.notifyDataChange(id);
                                                                    dd.info.editorEvent();
                                                                }
                                                            })}"
                                                                            >
                                                                                ${dd.type === 'container'
                                                                ? `
                                                                          <div class="hoverBtn p-1 "
                                                                             onclick="${gvc.event((e, event) => {
                                                                    lastClick.zeroing();
                                                                    event.preventDefault();
                                                                    event.stopPropagation();
                                                                    dd.toggle = !dd.toggle;
                                                                    dd.info && (dd.info.toggle = !dd.info.toggle);
                                                                    gvc.notifyDataChange(id);
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
                                                                                <div
                                                                                        class="hoverBtn p-1 child"
                                                                                        onclick="${gvc.event((e, event) => {
                                                                lastClick.zeroing();
                                                                event.stopPropagation();
                                                                glitter.htmlGenerate.deleteWidget(og_array, og_array[index]);
                                                                setPageConfig();
                                                            })}"
                                                                                >
                                                                                    <i class="fa-regular fa-trash d-flex align-items-center justify-content-center "></i>
                                                                                </div>
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
                                                                        .show();
                                                                }
                                                                else {
                                                                    document.querySelector('#editerCenter iframe').contentWindow.glitter
                                                                        .$(`.editor_it_${og_array[index].id}`)
                                                                        .parent()
                                                                        .hide();
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
                                                                                <div class="hoverBtn p-1 dragItem child">
                                                                                    <i
                                                                                            class="fa-solid fa-grip-dots-vertical d-flex align-items-center justify-content-center  "
                                                                                            style="width:15px;height:15px;"
                                                                                            aria-hidden="true"
                                                                                    ></i>
                                                                                </div>
                                                                            </div>
                                                                            ${dd.type === 'container'
                                                                ? `<div class="ps-4  pb-2 ${dd.toggle ? `` : `d-none`}" style="margin-left:3px;">${renderItems(dd.child, dd.array, false)}</div>`
                                                                : ``}
                                                                        </li>
                                                                    `;
                                                        })
                                                            .join('') +
                                                            html `
                                                                <div
                                                                        class="w-100 fw-500 d-flex align-items-center  fs-6 hoverBtn h_item  rounded px-2 hoverF2 mb-1"
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
                                                                AddComponent.toggle(true);
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
                                                                            "carryData": {}
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
                                                                    Sortable.create(document.getElementById(id), {
                                                                        group: gvc.glitter.getUUID(),
                                                                        animation: 100,
                                                                        handle: '.dragItem',
                                                                        onChange: function (evt) {
                                                                            swapArr(og_array, startIndex, evt.newIndex);
                                                                            startIndex = evt.newIndex;
                                                                        },
                                                                        onEnd: (evt) => {
                                                                            setPageConfig();
                                                                            swapArr(og_array, startIndex, evt.newIndex);
                                                                            gvc.notifyDataChange('showView');
                                                                        },
                                                                        onStart: function (evt) {
                                                                            startIndex = evt.oldIndex;
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
                                            <div class="p-2">${renderItems(list, pageConfig, true)}</div>`;
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
                divCreate: { class: `swiper-slide h-100 position-relative` },
                onCreate: () => {
                    const htmlGenerate = new gvc.glitter.htmlGenerate(viewModel.data.config, [Storage.lastSelect], undefined, true);
                    window.editerData = htmlGenerate;
                    window.page_config = viewModel.data.page_config;
                },
            };
        });
    }
    static colorSetting(gvc) {
        var _a;
        const globalValue = gvc.glitter.share.editorViewModel.appConfig;
        globalValue.color_theme = (_a = globalValue.color_theme) !== null && _a !== void 0 ? _a : [];
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
                        <div class="" style="">
                            ${(() => {
                        if (vm.type === 'list') {
                            return html `
                                        <div class="px-3   border-bottom pb-3 fw-bold mt-2 pt-2"
                                             style="cursor: pointer;color:#393939;">
                                            <span>調色盤設定</span>
                                        </div>
                                        <div class="row ${(globalValue.color_theme.length === 0) ? `d-none` : ``}"
                                             style="margin:18px;">
                                            ${globalValue.color_theme.map((dd, index) => {
                                return `<div class="col-6 mb-3" style="cursor: pointer;" onclick="${gvc.event(() => {
                                    vm.type = 'detail';
                                    vm.data = globalValue.color_theme[index];
                                    vm.index = index;
                                    gvc.notifyDataChange(id);
                                })}">
                                                ${Main_editor.colorCard(globalValue.color_theme[index])}
                                                <div class="w-100 t_39_16 mt-2" style="text-align: center;">調色盤${index + 1}</div>
                                            </div>`;
                            }).join('')}
                                        </div>
                                        <div style="padding: 0px 24px 24px;${(globalValue.color_theme.length === 0) ? `margin-top:24px;` : ``}">
                                            <div class="bt_border_editor"
                                                 onclick="${gvc.event(() => {
                                vm.data = { id: gvc.glitter.getUUID() };
                                globalValue.color_theme.push(vm.data);
                                vm.name = ('調色盤' + globalValue.color_theme.length);
                                vm.type = 'detail';
                                vm.index = globalValue.color_theme.length - 1;
                                gvc.notifyDataChange(id);
                            })}">
                                                新增配色
                                            </div>
                                        </div>`;
                        }
                        else {
                            return Main_editor.color_detail({
                                gvc: gvc,
                                back: () => {
                                    vm.type = 'list';
                                    gvc.notifyDataChange(id);
                                },
                                name: `調色盤${vm.index + 1}`,
                                data: vm.data,
                                index: vm.index
                            });
                        }
                    })()}
                        </div>
                    `;
                },
                divCreate: {
                    class: `border-bottom`,
                },
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
                    if (`${vm.index}` === '0') {
                        document.querySelector('#editerCenter iframe').contentWindow.document.querySelector('body').style.background = gvc.glitter.share.globalValue[`theme_color.0.background`];
                    }
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
                        `<div style="padding: 18px 24px 24px;">${EditorConfig.color_setting_config.filter((dd) => {
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
                                    gvc.notifyDataChange(vId);
                                },
                                gvc: gvc,
                                def: vm.data[dd.key]
                            });
                        }).join('<div style="height: 15px;"></div>')}</div>`,
                        `<div style="padding: 0px 24px 24px;"> <div class="bt_border_editor"
                                                 onclick="${gvc.event(() => {
                            globalValue.color_theme = globalValue.color_theme.filter((dd) => {
                                return dd !== vm.data;
                            });
                            vm.back();
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
        return [
            html `
                <div
                        class="right_scroll"
                        style="overflow-y:auto;${Storage.select_function === 'user-editor' ? `height:calc(100vh - ${document.body.clientWidth < 800 ? 0 : 56}px)` : `height:calc(100vh - 150px);`}"
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
                        return ((Storage.select_function === 'user-editor'
                            ? html `
                                                    <div
                                                            class="px-3 mx-n2  border-bottom pb-3 fw-bold mt-n2 pt-3 hoverF2 d-flex align-items-center"
                                                            style="cursor: pointer;color:#393939;border-radius: 0px;gap:10px;"
                                                            onclick="${gvc.event(() => {
                                Storage.lastSelect = '';
                                glitter.share.editorViewModel.selectItem = undefined;
                                glitter.share.selectEditorItem();
                            })}"
                                                    >
                                                        <i class="fa-solid fa-chevron-left"></i>
                                                        <span style="max-width: calc(100% - 50px);text-overflow: ellipsis;white-space: nowrap;overflow: hidden;">${viewModel.selectItem.label}</span>
                                                        <div class="flex-fill"></div>
                                                    </div>
                                                `
                            : ``) +
                            htmlGenerate.editor(gvc, {
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
                    <div class="position-absolute w-100 bottom-0 d-flex align-items-center p-3 shadow justify-content-end border-top bg-white"
                         style="height: 60px;">
                        ${BgWidget.cancel(gvc.event(() => {
                const dialog = new ShareDialog(gvc.glitter);
                navigator.clipboard.writeText(JSON.stringify(viewModel.selectItem));
                dialog.successMessage({ text: '複製成功' });
            }), '複製元件')}
                        <div class="mx-2"></div>
                        ${BgWidget.cancel(gvc.event(() => {
                glitter.htmlGenerate.deleteWidget(glitter.share.editorViewModel.selectContainer, viewModel.selectItem);
            }), '刪除元件')}
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
    static center(viewModel, gvc) {
        return html `
            <div
                    class="${viewModel.type === ViewType.mobile && (Storage.select_function === 'page-editor' || Storage.select_function === 'user-editor')
            ? `d-flex align-items-center justify-content-center flex-column mx-auto`
            : `d-flex align-items-center justify-content-center flex-column`}"
                    style="${viewModel.type === ViewType.mobile && (Storage.select_function === 'page-editor' || Storage.select_function === 'user-editor')
            ? `width: 414px;height: calc(100vh - ${56 + EditorConfig.getPaddingTop(gvc)}px);`
            : `width: calc(100%);height: calc(100vh - ${56 + EditorConfig.getPaddingTop(gvc)}px);overflow:hidden;`}"
            >
                <div class="" style="width:100%;height: calc(100%);" id="editerCenter">
                    <iframe class="w-100 h-100  bg-white"
                            src="${gvc.glitter.root_path}${gvc.glitter.getUrlParameter('page')}?type=htmlEditor&appName=${gvc.glitter.getUrlParameter('appName')}"></iframe>
                </div>
            </div>`;
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
