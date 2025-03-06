var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Add_item_dia from "../glitterBundle/plugins/add_item_dia.js";
import { Swal } from "../modules/sweetAlert.js";
import { EditorElem } from "../glitterBundle/plugins/editor-elem.js";
import { ShareDialog } from "../glitterBundle/dialog/ShareDialog.js";
import { TriggerEvent } from "../glitterBundle/plugins/trigger-event.js";
import { ApiPageConfig } from "../api/pageConfig.js";
import { HtmlGenerate } from "../glitterBundle/module/html-generate.js";
import { FormWidget } from "../official_view_component/official/form.js";
import { Storage } from "../glitterBundle/helper/storage.js";
import { AddComponent } from "./add-component.js";
import { BaseApi } from "../glitterBundle/api/base.js";
import { NormalPageEditor } from "./normal-page-editor.js";
const html = String.raw;
export class PageEditor {
    constructor(gvc, vid, editorID = '') {
        this.gvc = gvc;
        this.vid = vid;
        this.editorID = editorID;
    }
    renderLineItem(array, child, original, option = {}) {
        const gvc = this.gvc;
        const glitter = gvc.glitter;
        const vid = this.vid;
        const viewModel = gvc.glitter.share.editorViewModel;
        const parId = gvc.glitter.getUUID();
        const swal = new Swal(gvc);
        return gvc.bindView(() => {
            gvc.glitter.addMtScript([{
                    src: `https://raw.githack.com/SortableJS/Sortable/master/Sortable.js`
                }], () => {
            }, () => {
            });
            return {
                bind: parId,
                view: () => {
                    try {
                        return array.map((dd, index) => {
                            dd.selectEditEvent = ((e) => {
                                if (!glitter.share.inspect) {
                                    return false;
                                }
                                viewModel.selectContainer = original;
                                viewModel.selectItem = dd;
                                Storage.lastSelect = dd.id;
                                localStorage.setItem('rightSelect', 'module');
                                gvc.notifyDataChange(['right_NAV', 'MainEditorLeft', vid]);
                                setTimeout(() => {
                                    viewModel.selectContainer.refresh();
                                    const leftItem = document.querySelectorAll('.selectLeftItem');
                                    leftItem[leftItem.length - 1].scrollIntoView({
                                        behavior: 'auto',
                                        block: 'center',
                                    });
                                }, 200);
                                console.log(`selectEditEvent-->`);
                                return true;
                            });
                            let toggle = gvc.event((e, event) => {
                                dd.toggle = !dd.toggle;
                                if ((() => {
                                    return dd.type === 'container' && checkChildSelect(dd.data.setting);
                                })() && !dd.toggle) {
                                    Storage.lastSelect = '';
                                    viewModel.selectItem = undefined;
                                }
                                if (!dd.toggle && option.selectEvent) {
                                    option.selectEvent(undefined);
                                }
                                gvc.notifyDataChange(parId);
                                event.preventDefault();
                                event.stopPropagation();
                            });
                            const checkChildSelect = (setting) => {
                                for (const b of setting) {
                                    if (b === viewModel.selectItem || (option.selectEv && option.selectEv(b))) {
                                        return true;
                                    }
                                    if (b.data && b.data.setting && (Array.isArray(b.data.setting) && checkChildSelect(b.data.setting))) {
                                        return true;
                                    }
                                }
                                return false;
                            };
                            let selectChild = (() => {
                                return dd.type === 'container' && checkChildSelect(dd.data.setting);
                            })();
                            if (selectChild) {
                                dd.toggle = true;
                            }
                            return html `
                                <li class="btn-group d-flex flex-column"
                                    style="margin-top:1px;margin-bottom:1px;">
                                    <div class="editor_item d-flex   px-2 my-0 hi me-n1 ${(viewModel.selectItem === dd) ? `selectLeftItem` : ``} ${(viewModel.selectItem === dd || selectChild || (option.selectEv && option.selectEv(dd))) ? `active` : ``}"
                                         style=""
                                         onclick="${gvc.event(() => {
                                if (dd.type === 'container' && option.justFolder) {
                                    eval(toggle);
                                    return;
                                }
                                if (option.selectEvent) {
                                    option.selectEvent(dd);
                                }
                                else if (dd.editorEvent) {
                                    dd.editorEvent();
                                }
                                else {
                                    document.querySelector('#editerCenter iframe').contentWindow.$('.editorItemActive').removeClass('editorItemActive');
                                    window.parent.glitter.share.editorViewModel.selectItem = dd;
                                    Storage.lastSelect = dd.id;
                                    window.parent.glitter.share.selectEditorItem();
                                }
                            })}">
                                        ${(dd.type === 'container') ? html `
                                            <div class="subBt ps-0 ms-n2" onclick="${toggle}">
                                                ${((dd.toggle) ? `<i class="fa-regular fa-angle-down hoverBtn " ></i>` : `
                                                                        <i class="fa-regular fa-angle-right hoverBtn " ></i>
                                                                        `)}
                                            </div>` : ``}
                                        ${dd.label}
                                        <div class="flex-fill"></div>
                                        ${(dd.type === 'container') ? html `
                                            <div class="btn-group me-0 subBt"
                                                 style=""
                                                 onclick="${gvc.event((e, event) => {
                                var _a;
                                dd.data.setting = (_a = dd.data.setting) !== null && _a !== void 0 ? _a : [];
                                viewModel.selectContainer = dd.data.setting;
                                event.stopPropagation();
                                event.preventDefault();
                            })}">
                                                ${(option.addComponentView) ? `
                                                                                    <div class="${(option.readonly) ? `d-none` : ``}"
                                     style="cursor:pointer;gap:5px;"
                                     data-bs-toggle="dropdown"
                                     aria-haspopup="true"
                                     aria-expanded="false">
                                    <i class="fa-regular fa-circle-plus d-flex align-items-center justify-content-center subBt "></i>
                                </div>
                                                                                  <div class="dropdown-menu mx-1 position-fixed pb-0 border "
                                     style="z-index:999999;"
                                     onclick="${gvc.event((e, event) => {
                                event.preventDefault();
                                event.stopPropagation();
                            })}">
                                    ${option.addComponentView(gvc, (response) => {
                                dd.data.setting.push(response);
                                dd.toggle = true;
                                gvc.notifyDataChange(parId);
                            })}
                                </div>
                                                                                ` : ` <div class="position-relative d-flex align-items-center justify-content-center w-100 h-100 ${(option.readonly) ? `d-none` : ``}" 
                                                                                   onclick="${gvc.event(() => {
                                AddComponent.toggle(true);
                            })}">
                                                                                    <i class="fa-regular fa-circle-plus d-flex align-items-center justify-content-center subBt "></i>
                                                                                    
                                                                                </div>`}

                                            </div>` : ``}
                                        ${(() => {
                                function resetID(dd) {
                                    dd.id = glitter.getUUID();
                                    if (dd.type === 'container') {
                                        dd.data.setting.map((d2) => {
                                            resetID(d2);
                                        });
                                    }
                                }
                                function addIt(ind) {
                                    const copy = JSON.parse(JSON.stringify(dd));
                                    copy.id = glitter.getUUID();
                                    viewModel.selectContainer = array;
                                    viewModel.selectItem = copy;
                                    original.splice(index + ind, 0, copy);
                                    dd.toggle = false;
                                    resetID(copy);
                                    option.refreshEvent && option.refreshEvent();
                                    Storage.lastSelect = copy.id;
                                    if (viewModel.selectContainer.refresh) {
                                        (viewModel.selectContainer.refresh) && (viewModel.selectContainer.refresh());
                                    }
                                    else {
                                        gvc.notifyDataChange([parId, vid, 'showView']);
                                    }
                                }
                                let interval = undefined;
                                return html `
                                                <div class="btn-group dropend subBt ${(option.readonly) ? `d-none` : ``}"
                                                     onmouseover="${gvc.event((e, event) => {
                                    clearInterval(interval);
                                    const box = $(e).get(0).getBoundingClientRect();
                                    $(e).children('.bt').dropdown('show');
                                    $(e).children('.dropdown-menu').css('position', `fixed`);
                                    $(e).children('.dropdown-menu').css('width', `191px`);
                                    $(e).children('.dropdown-menu').css('height', `139px`);
                                    $(e).children('.dropdown-menu').css('left', `${box.left + 50}px`);
                                    $(e).children('.dropdown-menu').css('left', `${0}px`);
                                })}" onmouseout="${gvc.event((e, event) => {
                                    interval = setTimeout(() => {
                                        $(e).children('.bt').dropdown('hide');
                                    }, 200);
                                })}">

                                                    <div type="button" class="bt" style="background:none;"
                                                         data-bs-toggle="dropdown" aria-haspopup="true"
                                                         data-placement="right"
                                                         aria-expanded="false">
                                                        <i class="fa-sharp fa-regular fa-scissors"></i>
                                                    </div>
                                                    <div class="dropdown-menu mx-1" data-placement="right"
                                                         onmouseover="${gvc.event((e, event) => {
                                    clearInterval(interval);
                                })}" onmouseout="${gvc.event((e, event) => {
                                    $(e).children('.bt').dropdown('hide');
                                })}">
                                                        <a class="dropdown-item" onclick="${gvc.event((e, event) => {
                                    addIt(0);
                                })}">向上複製</a>
                                                        <hr class="dropdown-divider">
                                                        <a class="dropdown-item" onclick="${gvc.event((e, event) => {
                                    $(e).parent().parent().children('.bt').dropdown('hide');
                                    viewModel.selectContainer = array;
                                    viewModel.waitCopy = dd;
                                    resetID(viewModel.waitCopy);
                                    glitter.share.copycomponent = JSON.stringify(viewModel.waitCopy);
                                    navigator.clipboard.writeText(JSON.stringify(viewModel.waitCopy));
                                    swal.toast({
                                        icon: 'success',
                                        title: "已複製至剪貼簿，選擇新增模塊來添加項目．"
                                    });
                                    event.stopPropagation();
                                })}">複製到剪貼簿</a>
                                                        <hr class="dropdown-divider">
                                                        <a class="dropdown-item" onclick="${gvc.event((e, event) => {
                                    $(e).parent().parent().children('.bt').dropdown('hide');
                                    addIt(1);
                                })}">向下複製</a>
                                                    </div>
                                                </div>`;
                            })()}
                                        ${(dd.type === 'container') ? html `
                                            <div class="subBt d-none"
                                                 onclick="${gvc.event((e, event) => {
                                viewModel.selectContainer = original.find((d2) => {
                                    return d2.id === dd.id;
                                }).data.setting;
                                glitter.share.pastEvent();
                                event.stopPropagation();
                                event.preventDefault();
                            })}">
                                                <i class="fa-duotone fa-paste d-flex align-items-center justify-content-center subBt"
                                                   style="width:15px;height:15px;"
                                                ></i>
                                            </div>
                                        ` : ``}
                                        <div class="subBt ${(option.readonly) ? `d-none` : ``}">
                                            <i class="fa-solid fa-grip-dots-vertical d-flex align-items-center justify-content-center  "
                                               style="width:15px;height:15px;"></i>
                                        </div>

                                    </div>
                                    ${(() => {
                                if (dd.type === 'container') {
                                    if (dd.data.setting.length === 0) {
                                        return ``;
                                    }
                                    else {
                                        checkChildSelect(dd.data.setting);
                                        return `<div class="${(dd.toggle || (checkChildSelect(dd.data.setting))) ? `` : `d-none`}" style="padding-left:5px;">${this.renderLineItem(dd.data.setting.map((dd, index) => {
                                            dd.index = index;
                                            return dd;
                                        }), true, dd.data.setting, option)}</div>`;
                                    }
                                }
                                else {
                                    return ``;
                                }
                            })()}
                                </li>
                            `;
                        }).join('');
                    }
                    catch (e) {
                        console.log(e);
                    }
                },
                divCreate: {
                    class: `d-flex flex-column ${(child) ? `` : ``} position-relative  position-relative ps-0 m-0`,
                    elem: 'ul',
                    style: 'overflow-x: hidden;',
                    option: [
                        { key: 'id', value: parId }
                    ]
                },
                onCreate: () => {
                    if (this.vid === 'MainEditorLeft') {
                        const leftItem = document.querySelectorAll('.selectLeftItem');
                        leftItem[leftItem.length - 1].scrollIntoView({
                            behavior: 'auto',
                            block: 'center',
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
                                    Sortable.create(document.getElementById(parId), {
                                        group: gvc.glitter.getUUID(),
                                        animation: 100,
                                        onChange: function (evt) {
                                        },
                                        onEnd: (evt) => {
                                            swapArr(original, startIndex, evt.newIndex);
                                            option.refreshEvent();
                                            if (viewModel.selectContainer && viewModel.selectContainer.refresh) {
                                                viewModel.selectContainer.refresh();
                                            }
                                            else {
                                                gvc.notifyDataChange('showView');
                                            }
                                        },
                                        onStart: function (evt) {
                                            startIndex = evt.oldIndex;
                                            console.log(`oldIndex--`, startIndex);
                                        }
                                    });
                                }
                                catch (e) {
                                }
                                clearInterval(interval);
                            }
                        }, 100);
                    }
                    else {
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
                                    Sortable.create(document.getElementById(parId), {
                                        group: gvc.glitter.getUUID(),
                                        animation: 100,
                                        onChange: function (evt) {
                                        },
                                        onEnd: (evt) => {
                                            swapArr(original, startIndex, evt.newIndex);
                                        },
                                        onStart: function (evt) {
                                            startIndex = evt.oldIndex;
                                            console.log(`oldIndex--`, startIndex);
                                        }
                                    });
                                }
                                catch (e) {
                                }
                                clearInterval(interval);
                            }
                        }, 100);
                    }
                }
            };
        });
    }
    static styleRenderEditor(obj) {
        const docID = obj.docID;
        const viewModel = obj.viewModel;
        const glitter = obj.gvc.glitter;
        const gvc = obj.gvc;
        const vid = obj.vid;
        return obj.gvc.bindView(() => {
            return {
                bind: docID,
                view: () => {
                    return html `
                        ${gvc.bindView(() => {
                        return {
                            bind: `htmlGenerate`,
                            view: () => {
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
                                return htmlGenerate.editor(gvc, {
                                    hideInfo: true,
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
                                    }
                                });
                            },
                            divCreate: {
                                class: `pt-2 px-n2`, style: ``
                            },
                            onCreate: () => {
                                setTimeout(() => {
                                    var _a;
                                    $('#jumpToNav').scrollTop((_a = parseInt(glitter.getCookieByName('jumpToNavScroll'), 10)) !== null && _a !== void 0 ? _a : 0);
                                }, 1000);
                            }
                        };
                    })}
                    `;
                },
                divCreate: () => {
                    return {
                        class: ` px-2 d-flex flex-column`, style: `overflow-x:hidden;`
                    };
                },
                onCreate: () => {
                }
            };
        });
    }
    static styleRenderSelector(obj) {
        const gvc = obj.gvc;
        const glitter = gvc.glitter;
        const vid = obj.vid;
        const viewModel = obj.viewModel;
        let pageConfig = (viewModel.data.config.filter((dd, index) => {
            dd.index = index;
            return dd.type === 'widget' && (dd.data.elem === 'style' || dd.data.elem === 'link');
        }));
        function setPageConfig() {
            viewModel.data.config = pageConfig.concat((viewModel.data.config.filter((dd, index) => {
                return !(dd.type === 'widget' && (dd.data.elem === 'style' || dd.data.elem === 'link'));
            })));
        }
        return gvc.bindView(() => {
            return {
                bind: vid,
                view: () => {
                    setPageConfig();
                    return [
                        html `
                            <div class="d-flex   px-2   hi fw-bold d-flex align-items-center border-bottom"
                                 style="font-size:14px;color:#da552f;">全站-STYLE
                                <div class="flex-fill"></div>
                                <li class="btn-group dropleft" onclick="${gvc.event(() => {
                            viewModel.selectContainer = viewModel.globalStyle;
                        })}">
                                    <div class="editor_item   px-2 ms-0 me-n1"
                                         style="cursor:pointer;gap:5px;"
                                         data-bs-toggle="dropdown"
                                         aria-haspopup="true"
                                         aria-expanded="false">
                                        <i class="fa-regular fa-circle-plus "></i>
                                    </div>
                                    <div class="dropdown-menu mx-1 position-fixed pb-0 border "
                                         style="z-index:999999;"
                                         onclick="${gvc.event((e, event) => {
                            event.preventDefault();
                            event.stopPropagation();
                        })}">
                                        ${Add_item_dia.add_style(gvc, (response) => {
                            viewModel.globalStyle.push(response);
                            gvc.notifyDataChange(vid);
                        })}
                                    </div>
                                </li>
                                <div class="editor_item   px-2 ms-0 me-n1" style="width:30px;position:relative;"
                                     onclick="${gvc.event((e, event) => {
                            setTimeout(() => {
                                $(e).children('.dropdown-menu').css('top', `${30}px`);
                            }, 100);
                        })}">

                                    <div type="button" class="bt" style="background:none;"
                                         onclick="${gvc.event(() => {
                            function readClipboardContent() {
                                return __awaiter(this, void 0, void 0, function* () {
                                    try {
                                        const json = yield navigator.clipboard.readText();
                                        viewModel.globalStyle.push(JSON.parse(json));
                                        gvc.notifyDataChange(obj.vid);
                                    }
                                    catch (error) {
                                        alert('請貼上JSON格式');
                                    }
                                });
                            }
                            readClipboardContent();
                        })}">
                                        <i class="fa-regular fa-paste"></i>
                                    </div>
                                </div>
                            </div>`,
                        (viewModel.globalStyle.length === 0) ? ` <div class="alert-info alert p-2 m-2" style="">尚未設定全站樣式</div>` :
                            EditorElem.arrayItem({
                                gvc: gvc,
                                title: '',
                                array: () => {
                                    return viewModel.globalStyle.map((dd, index) => {
                                        dd.index = index;
                                        return dd;
                                    }).map((dd) => {
                                        return {
                                            title: dd.label,
                                            innerHtml: () => {
                                                obj.selectBack(dd);
                                            }
                                        };
                                    });
                                },
                                customEditor: true,
                                originalArray: viewModel.globalStyle,
                                expand: {},
                                copyable: true,
                                refreshComponent: () => {
                                    gvc.notifyDataChange(vid);
                                }
                            }),
                        html `
                            <div class="d-flex   px-2   hi fw-bold d-flex align-items-center border-bottom border-top"
                                 style="color:#151515;font-size:14px;">頁面-STYLE
                                <div class="flex-fill"></div>
                                <li class="btn-group dropend" onclick="${gvc.event(() => {
                            viewModel.selectContainer = viewModel.data.config;
                        })}">
                                    <div class="editor_item  d-none px-2 me-0" style="cursor:pointer; "
                                         onclick="${gvc.event(() => {
                            viewModel.selectContainer = viewModel.data.config;
                            glitter.share.pastEvent();
                        })}"
                                    >
                                        <i class="fa-duotone fa-paste"></i>
                                    </div>
                                    <div class="editor_item   px-2 ms-0 me-n1"
                                         style="cursor:pointer;gap:5px;"
                                         data-bs-toggle="dropdown"
                                         aria-haspopup="true"
                                         aria-expanded="false">
                                        <i class="fa-regular fa-circle-plus"></i>
                                    </div>
                                    <div class="dropdown-menu mx-1 position-fixed pb-0 border "
                                         style="z-index:999999;"
                                         onclick="${gvc.event((e, event) => {
                            event.preventDefault();
                            event.stopPropagation();
                        })}">
                                        ${Add_item_dia.add_style(gvc, (data) => {
                            pageConfig.push(data);
                            gvc.notifyDataChange(vid);
                        })}
                                    </div>
                                </li>
                                <div class="editor_item   px-2 ms-0 me-n1" style="width:30px;position:relative;"
                                     onclick="${gvc.event((e, event) => {
                            setTimeout(() => {
                                $(e).children('.dropdown-menu').css('top', `${30}px`);
                            }, 100);
                        })}">

                                    <div type="button" class="bt" style="background:none;"
                                       onclick="${gvc.event(() => {
                            function readClipboardContent() {
                                return __awaiter(this, void 0, void 0, function* () {
                                    try {
                                        const json = yield navigator.clipboard.readText();
                                        pageConfig.push(JSON.parse(json));
                                        setPageConfig();
                                        gvc.notifyDataChange(vid);
                                    }
                                    catch (error) {
                                        alert('請貼上JSON格式');
                                    }
                                });
                            }
                            readClipboardContent();
                        })}">
                                        <i class="fa-regular fa-paste"></i>
                                    </div>
                                 
                                </div>
                            </div>`,
                        (pageConfig.length === 0) ? `
                        <div class="alert-info alert p-2 m-2 mt-3 fw-500 fs-base">尚未設定頁面樣式</div>
                        ` : EditorElem.arrayItem({
                            gvc: gvc,
                            title: '',
                            array: () => {
                                return pageConfig.map((dd, index) => {
                                    dd.index = index;
                                    return dd;
                                }).map((dd) => {
                                    return {
                                        title: dd.label,
                                        innerHtml: () => {
                                            obj.selectBack(dd);
                                        }
                                    };
                                });
                            },
                            customEditor: true,
                            originalArray: pageConfig,
                            expand: {},
                            copyable: true,
                            refreshComponent: () => {
                                gvc.notifyDataChange(vid);
                            }
                        }),
                    ].join('');
                },
                divCreate: {
                    style: 'min-height:300px;height:calc(100vh - 115px);overflow-y: auto;', class: ``
                }
            };
        });
    }
    static scriptRenderEditor(obj) {
        const docID = obj.docID;
        const viewModel = obj.viewModel;
        const glitter = obj.gvc.glitter;
        const gvc = obj.gvc;
        const vid = obj.vid;
        return obj.gvc.bindView(() => {
            return {
                bind: docID,
                view: () => {
                    return html `
                        ${gvc.bindView(() => {
                        return {
                            bind: `htmlGenerate`,
                            view: () => {
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
                                return htmlGenerate.editor(gvc, {
                                    hideInfo: true,
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
                                    }
                                });
                            },
                            divCreate: {
                                class: ``, style: ``
                            },
                            onCreate: () => {
                                setTimeout(() => {
                                    var _a;
                                    $('#jumpToNav').scrollTop((_a = parseInt(glitter.getCookieByName('jumpToNavScroll'), 10)) !== null && _a !== void 0 ? _a : 0);
                                }, 1000);
                            }
                        };
                    })}
                        <div class="flex-fill"></div>
                    `;
                },
                divCreate: () => {
                    return {
                        class: ` h-100 p-2 d-flex flex-column`, style: ``
                    };
                },
                onCreate: () => {
                }
            };
        });
    }
    static scriptRenderSelector(obj) {
        const gvc = obj.gvc;
        const glitter = gvc.glitter;
        const vid = obj.vid;
        const viewModel = obj.viewModel;
        let pageConfig = (viewModel.data.config.filter((dd, index) => {
            dd.index = index;
            return (dd.type === 'code') || dd.type === 'widget' && (dd.data.elem === 'script');
        }));
        function setPageConfig() {
            viewModel.data.config = pageConfig.concat((viewModel.data.config.filter((dd, index) => {
                return !((dd.type === 'code') || dd.type === 'widget' && (dd.data.elem === 'script'));
            })));
        }
        return gvc.bindView(() => {
            return {
                bind: vid,
                view: () => {
                    setPageConfig();
                    return [
                        html `
                            <div class="d-flex   px-2   hi fw-bold d-flex align-items-center border-bottom"
                                 style="font-size:14px;color:#da552f;">全局-事件
                                <div class="flex-fill"></div>
                                <li class="btn-group dropleft" onclick="${gvc.event(() => {
                            viewModel.selectContainer = viewModel.globalScript;
                        })}">
                                    <div class="editor_item   px-2 ms-0 me-n1"
                                         style="cursor:pointer;gap:5px;"
                                         data-bs-toggle="dropdown"
                                         aria-haspopup="true"
                                         aria-expanded="false">
                                        <i class="fa-regular fa-circle-plus "></i>
                                    </div>
                                    <div class="dropdown-menu mx-1 position-fixed pb-0 border "
                                         style="z-index:999999;"
                                         onclick="${gvc.event((e, event) => {
                            event.preventDefault();
                            event.stopPropagation();
                        })}">
                                        ${Add_item_dia.add_script(gvc, (response) => {
                            viewModel.globalScript.push(response);
                            gvc.notifyDataChange(vid);
                        })}
                                    </div>
                                </li>
                                <div class="editor_item   px-2 ms-0 me-n1" style="width:30px;position:relative;"
                                     onclick="${gvc.event((e, event) => {
                            setTimeout(() => {
                                $(e).children('.dropdown-menu').css('top', `${30}px`);
                            }, 100);
                        })}">

                                    <div type="button" class="bt" style="background:none;"
                                         onclick="${gvc.event(() => {
                            function readClipboardContent() {
                                return __awaiter(this, void 0, void 0, function* () {
                                    try {
                                        const json = yield navigator.clipboard.readText();
                                        viewModel.globalScript.push(JSON.parse(json));
                                        gvc.notifyDataChange(obj.vid);
                                    }
                                    catch (error) {
                                        alert('請貼上JSON格式');
                                    }
                                });
                            }
                            readClipboardContent();
                        })}">
                                        <i class="fa-regular fa-paste"></i>
                                    </div>
                                </div>
                            </div>`,
                        (viewModel.globalScript.length === 0) ? ` <div class="alert-info alert p-2 m-2">尚未設定全局事件</div>` :
                            EditorElem.arrayItem({
                                gvc: gvc,
                                title: '',
                                array: () => {
                                    return viewModel.globalScript.map((dd, index) => {
                                        dd.index = index;
                                        return dd;
                                    }).map((dd) => {
                                        return {
                                            title: dd.label,
                                            innerHtml: () => {
                                                obj.selectBack(dd);
                                            }
                                        };
                                    });
                                },
                                customEditor: true,
                                originalArray: viewModel.globalScript,
                                expand: {},
                                copyable: true,
                                refreshComponent: () => {
                                    gvc.notifyDataChange(vid);
                                }
                            }),
                        html `
                            <div class="d-flex   px-2   hi fw-bold d-flex align-items-center border-bottom border-top"
                                 style="color:#151515;font-size:14px;">頁面-事件
                                <div class="flex-fill"></div>
                                <li class="btn-group dropend" onclick="${gvc.event(() => {
                            viewModel.selectContainer = viewModel.data.config;
                        })}">
                                    <div class="editor_item  d-none px-2 me-0" style="cursor:pointer; "
                                         onclick="${gvc.event(() => {
                            viewModel.selectContainer = viewModel.data.config;
                            glitter.share.pastEvent();
                        })}"
                                    >
                                        <i class="fa-duotone fa-paste"></i>
                                    </div>
                                    <div class="editor_item   px-2 ms-0 me-n1"
                                         style="cursor:pointer;gap:5px;"
                                         data-bs-toggle="dropdown"
                                         aria-haspopup="true"
                                         aria-expanded="false">
                                        <i class="fa-regular fa-circle-plus"></i>
                                    </div>
                                    <div class="dropdown-menu mx-1 position-fixed pb-0 border "
                                         style="z-index:999999;"
                                         onclick="${gvc.event((e, event) => {
                            event.preventDefault();
                            event.stopPropagation();
                        })}">
                                        ${Add_item_dia.add_script(gvc, (data) => {
                            pageConfig.push(data);
                            gvc.notifyDataChange(vid);
                        })}
                                    </div>
                                </li>
                                <div class="editor_item   px-2 ms-0 me-n1" style="width:30px;position:relative;"
                                     onclick="${gvc.event((e, event) => {
                            setTimeout(() => {
                                $(e).children('.dropdown-menu').css('top', `${30}px`);
                            }, 100);
                        })}">

                                    <div type="button" class="bt" style="background:none;"
                                         onclick="${gvc.event(() => {
                            function readClipboardContent() {
                                return __awaiter(this, void 0, void 0, function* () {
                                    try {
                                        const json = yield navigator.clipboard.readText();
                                        pageConfig.push(JSON.parse(json));
                                        setPageConfig();
                                        gvc.notifyDataChange(vid);
                                    }
                                    catch (error) {
                                        alert('請貼上JSON格式');
                                    }
                                });
                            }
                            readClipboardContent();
                        })}">
                                        <i class="fa-regular fa-paste"></i>
                                    </div>
                                </div>
                            </div>`,
                        (pageConfig.length === 0) ? `
                        <div class="alert-info alert p-2 m-2 fs-base fw-500">尚未設定頁面事件</div>
                        ` : EditorElem.arrayItem({
                            gvc: gvc,
                            title: '',
                            array: () => {
                                return pageConfig.map((dd, index) => {
                                    dd.index = index;
                                    return dd;
                                }).map((dd) => {
                                    return {
                                        title: dd.label,
                                        innerHtml: () => {
                                            obj.selectBack(dd);
                                        }
                                    };
                                });
                            },
                            customEditor: true,
                            originalArray: pageConfig,
                            expand: {},
                            copyable: true,
                            refreshComponent: () => {
                                gvc.notifyDataChange(vid);
                            }
                        }),
                    ].join('');
                },
                divCreate: {
                    style: 'min-height:300px;height:calc(100vh - 115px);overflow-y: auto;'
                }
            };
        });
    }
    static eventRender(gvc) {
        const html = String.raw;
        const glitter = gvc.glitter;
        const viewModel = gvc.glitter.share.editorViewModel;
        const docID = glitter.getUUID();
        const vid = glitter.getUUID();
        return new Promise((resolve, reject) => {
            resolve({
                left: gvc.bindView(() => {
                    const id = vid;
                    return {
                        bind: id,
                        view: () => {
                            return EditorElem.arrayItem({
                                originalArray: viewModel.initialJS,
                                gvc: gvc,
                                title: '',
                                array: () => {
                                    return viewModel.initialJS.map((dd, index) => {
                                        return {
                                            title: `<span style="color: black;">${dd.name || `區塊:${index}`}</span>`,
                                            innerHtml: (() => {
                                                viewModel.selectItem = dd;
                                                gvc.notifyDataChange(docID);
                                            }),
                                            expand: dd,
                                            minus: gvc.event(() => {
                                                viewModel.initialJS.splice(index, 1);
                                                gvc.notifyDataChange(id);
                                            })
                                        };
                                    });
                                },
                                expand: undefined,
                                customEditor: true,
                                plus: {
                                    title: '觸發事件',
                                    event: gvc.event(() => {
                                        viewModel.initialJS.push({
                                            name: '',
                                            route: '',
                                            src: {
                                                official: '',
                                                open: true
                                            }
                                        });
                                        gvc.notifyDataChange(id);
                                    }),
                                },
                                refreshComponent: () => {
                                    viewModel.selectItem = viewModel.initialJS.find((dd) => {
                                        return dd === viewModel.selectItem;
                                    });
                                    gvc.notifyDataChange(id);
                                }
                            });
                        }
                    };
                }),
                right: gvc.bindView(() => {
                    return {
                        bind: docID,
                        view: () => {
                            const dd = viewModel.selectItem;
                            if (!dd) {
                                return html `

                                    <div class="d-flex ps-2 hi fw-bold d-flex align-items-center border-bottom border-top py-2 bgf6"
                                         style="color:#151515;font-size:16px;gap:0px;height:48px;">
                                        插件說明
                                    </div>

                                    <div class="d-flex flex-column w-100 align-items-center justify-content-center"
                                         style="height:calc(100% - 48px);">
                                        <div class="alert alert-info m-2 p-3"
                                             style="white-space: normal;word-break: break-all;">
                                            為您的元件添加各樣的觸發事件，包含連結跳轉/內容取得/資料儲存/頁面渲染/動畫事件/內容發布....等，都能透過事件來完成。
                                        </div>
                                    </div>
                                `;
                            }
                            return html `
                                <div class="d-flex ps-2 hi fw-bold d-flex align-items-center border-bottom border-top py-2 bgf6"
                                     style="color:#151515;font-size:16px;gap:0px;height:48px;">
                                    插件設定
                                </div>
                                <div class="px-2">
                                    ${[EditorElem.editeInput({
                                    gvc,
                                    title: '自定義模塊名稱',
                                    default: dd.name,
                                    placeHolder: '自定義模塊名稱',
                                    callback: (text) => {
                                        dd.name = text;
                                        gvc.notifyDataChange(vid);
                                    }
                                }), EditorElem.editeInput({
                                    gvc,
                                    title: '模塊路徑',
                                    default: dd.src.official,
                                    placeHolder: '模塊路徑',
                                    callback: (text) => {
                                        dd.src.official = text;
                                    }
                                })].join('')}
                                </div>
                            `;
                        },
                        divCreate: {
                            style: `width:300px;min-height:400px;height:400px;`
                        }
                    };
                })
            });
        });
    }
    static resourceInitial(gvc) {
        const html = String.raw;
        const glitter = gvc.glitter;
        const viewModel = gvc.glitter.share.editorViewModel;
        const docID = glitter.getUUID();
        const vid = glitter.getUUID();
        return new Promise((resolve, reject) => {
            resolve({
                left: gvc.bindView(() => {
                    const id = vid;
                    return {
                        bind: id,
                        view: () => {
                            return EditorElem.arrayItem({
                                originalArray: viewModel.initialList,
                                gvc: gvc,
                                title: '',
                                array: (() => {
                                    return viewModel.initialList.map((dd, index) => {
                                        return {
                                            title: `<span style="color:black;">${dd.name || `區塊:${index}`}</span>`,
                                            innerHtml: () => {
                                                viewModel.selectItem = dd;
                                                gvc.notifyDataChange(docID);
                                            },
                                            expand: dd,
                                            minus: gvc.event(() => {
                                                viewModel.initialList.splice(index, 1);
                                                gvc.notifyDataChange(id);
                                            })
                                        };
                                    });
                                }),
                                expand: undefined,
                                plus: {
                                    title: '添加代碼區塊',
                                    event: gvc.event(() => {
                                        viewModel.initialList.push({
                                            name: '代碼區塊',
                                            src: {
                                                official: '',
                                                staging: '',
                                                open: true
                                            }
                                        });
                                        gvc.notifyDataChange(id);
                                    }),
                                },
                                refreshComponent: () => {
                                    viewModel.selectItem = viewModel.initialList.find((dd) => {
                                        return dd === viewModel.selectItem;
                                    });
                                    gvc.notifyDataChange(id);
                                },
                                customEditor: true
                            });
                        }
                    };
                }),
                right: gvc.bindView(() => {
                    return {
                        bind: docID,
                        view: () => {
                            var _a;
                            const dd = viewModel.selectItem;
                            if (!dd) {
                                return html `
                                    <div class="d-flex ps-2 hi fw-bold d-flex align-items-center border-bottom border-top py-2 bgf6"
                                         style="color:#151515;font-size:16px;gap:0px;height:48px;">
                                        插件說明
                                    </div>
                                    <div class="d-flex flex-column w-100 align-items-center justify-content-center"
                                         style="height:calc(100% - 48px);">
                                        <div class="alert alert-info mx-2 p-3"
                                             style="white-space: normal;word-break: break-all;">
                                            資源初始代碼會在頁面載入之前執行，通常處理一些基本配置行為，例如設定插件路徑與後端API路徑...等，這些初始化代碼會按照順序執行。
                                        </div>
                                    </div>
                                `;
                            }
                            return html `
                                <div class="d-flex ps-2 hi fw-bold d-flex align-items-center border-bottom border-top py-2 bgf6"
                                     style="color:#151515;font-size:16px;gap:0px;height:48px;">
                                    事件設定
                                </div>
                                <div class="p-2"> ${EditorElem.select({
                                title: '類型',
                                gvc: gvc,
                                def: (_a = dd.type) !== null && _a !== void 0 ? _a : 'code',
                                callback: (text) => {
                                    dd.type = text;
                                    gvc.notifyDataChange(docID);
                                },
                                array: [{ title: "自定義", value: "code" }, {
                                        title: "程式碼路徑",
                                        value: "script"
                                    }, { title: "觸發事件", value: "event" }],
                            })}
                                    ${HtmlGenerate.editeInput({
                                gvc,
                                title: '自定義程式區塊名稱',
                                default: dd.name,
                                placeHolder: '自定義程式區塊名稱',
                                callback: (text) => {
                                    dd.name = text;
                                    gvc.notifyDataChange(vid);
                                }
                            })}
                                    ${(() => {
                                var _a, _b;
                                if (dd.type === 'script') {
                                    return EditorElem.uploadFile({
                                        gvc,
                                        title: '輸入或上傳路徑連結',
                                        def: (_a = dd.src.link) !== null && _a !== void 0 ? _a : "",
                                        callback: (text) => {
                                            dd.src.link = text;
                                            gvc.notifyDataChange(docID);
                                        }
                                    });
                                }
                                else if (dd.type === "event") {
                                    dd.src.event = (_b = dd.src.event) !== null && _b !== void 0 ? _b : {};
                                    return TriggerEvent.editer(gvc, {
                                        refreshComponent: () => {
                                            gvc.notifyDataChange(docID);
                                        }
                                    }, dd.src.event, {
                                        title: "觸發事件",
                                        hover: false,
                                        option: []
                                    });
                                }
                                else {
                                    return gvc.map([
                                        HtmlGenerate.editeText({
                                            gvc,
                                            title: '區塊代碼',
                                            default: dd.src.official,
                                            placeHolder: '請輸入代碼',
                                            callback: (text) => {
                                                dd.src.official = text;
                                            }
                                        })
                                    ]);
                                }
                            })()}
                                </div>`;
                        },
                        divCreate: {
                            style: `width:300px;height:600px;`
                        }
                    };
                })
            });
        });
    }
    static eventEditor(gvc, callback, from = 'official') {
        const html = String.raw;
        const glitter = gvc.glitter;
        const docID = glitter.getUUID();
        const vid = glitter.getUUID();
        let vm = {
            selectValue: ''
        };
        return new Promise((resolve, reject) => {
            resolve({
                left: gvc.bindView(() => {
                    let dataList = [];
                    glitter.share.globalJsList.map((key) => {
                        const value = glitter.share.clickEvent[TriggerEvent.getLink(key.src.official)];
                        const isOfficial = (key.src.official === './official_event/event.js');
                        if (from === 'official') {
                            if (isOfficial) {
                                const official = Object.keys(value).map((v2) => {
                                    const value2 = value[v2];
                                    return {
                                        label: value2.title.replace('官方事件 / ', ''),
                                        src: key.src.official,
                                        data: value2,
                                        key: v2,
                                    };
                                });
                                dataList.push({
                                    type: 'container',
                                    label: '內容輸入',
                                    dataList: official.filter((dd) => {
                                        return dd.label.split('/')[0].includes('輸入');
                                    })
                                });
                                dataList.push({
                                    type: 'container',
                                    label: '畫面相關',
                                    dataList: official.filter((dd) => {
                                        return dd.label.split('/')[0].includes('畫面');
                                    })
                                });
                                dataList.push({
                                    type: 'container',
                                    label: '表單相關',
                                    dataList: official.filter((dd) => {
                                        return dd.label.split('/')[0].includes('表單');
                                    })
                                });
                                dataList.push({
                                    type: 'container',
                                    label: '開發工具',
                                    dataList: official.filter((dd) => {
                                        return dd.label.split('/')[0].includes('開發工具');
                                    })
                                });
                                dataList.push({
                                    type: 'container',
                                    label: '推播通知',
                                    dataList: official.filter((dd) => {
                                        return dd.label.split('/')[0].includes('推播');
                                    })
                                });
                                dataList.push({
                                    type: 'container',
                                    label: '電子商務',
                                    dataList: official.filter((dd) => {
                                        return dd.label.split('/')[0].includes('電子商務');
                                    })
                                });
                                dataList.push({
                                    type: 'container',
                                    label: 'Blog / 網誌',
                                    dataList: official.filter((dd) => {
                                        return dd.label.split('/')[0].includes('Blog');
                                    })
                                });
                                dataList.push({
                                    type: 'container',
                                    label: '電子錢包',
                                    dataList: official.filter((dd) => {
                                        return dd.label.split('/')[0].includes('電子錢包');
                                    })
                                });
                                dataList.push({
                                    type: 'container',
                                    label: '用戶管理',
                                    dataList: official.filter((dd) => {
                                        return dd.label.split('/')[0].includes('用戶相關');
                                    })
                                });
                                dataList.push({
                                    type: 'container',
                                    label: '客服 / 聊天室',
                                    dataList: official.filter((dd) => {
                                        return dd.label.split('/')[0].includes('訊息相關');
                                    })
                                });
                                dataList.push({
                                    type: 'container',
                                    label: 'API請求',
                                    dataList: official.filter((dd) => {
                                        return dd.label.split('/')[0].includes('API');
                                    })
                                });
                                dataList.push({
                                    type: 'container',
                                    label: '手機裝置',
                                    dataList: official.filter((dd) => {
                                        return dd.label.split('/')[0].includes('手機裝置');
                                    })
                                });
                                if (window.memberType === 'noLimit') {
                                    dataList.push({
                                        type: 'container',
                                        label: 'GLITTER',
                                        dataList: official.filter((dd) => {
                                            return dd.label.split('/')[0].includes('GLITTER');
                                        })
                                    });
                                }
                            }
                        }
                        else {
                            if (!isOfficial) {
                                Object.keys(value).map((v2) => {
                                    const value2 = value[v2];
                                    dataList.push({
                                        label: value2.title.replace('官方事件 / ', ''),
                                        src: key.src.official,
                                        data: value2,
                                        key: v2,
                                    });
                                });
                            }
                        }
                    });
                    return {
                        bind: vid,
                        view: () => {
                            return EditorElem.folderLineItems({
                                gvc: gvc,
                                viewArray: dataList.map((dd) => {
                                    return dd;
                                }),
                                originalArray: dataList,
                                isOptionSelected: (dd) => {
                                    return dd === vm.selectValue;
                                },
                                onOptionSelected: (dd) => {
                                    vm.selectValue = dd;
                                    gvc.notifyDataChange(docID);
                                    gvc.notifyDataChange(vid);
                                }
                            });
                        },
                        divCreate: {}
                    };
                }),
                right: gvc.bindView(() => {
                    return {
                        bind: docID,
                        view: () => {
                            if (vm.selectValue) {
                                let addView = html `
                                    <button class="btn btn-primary-c" style="height: 40px;width: 100px;"
                                            onclick="${gvc.event(() => {
                                    callback(vm.selectValue);
                                })}">
                                        <i class="fa-light fa-circle-plus me-2"></i>插入事件
                                    </button>`;
                                if (!vm.selectValue.data.subContent) {
                                    return html `
                                        <div class="d-flex mx-n2 mt-n2 px-2 hi fw-bold d-flex align-items-center border-bottom border-top py-2 bgf6"
                                             style="color:#151515;font-size:16px;gap:0px;height:48px;">
                                            ${vm.selectValue.label}
                                        </div>
                                        <div class="d-flex flex-column w-100 align-items-center justify-content-center"
                                             style="height:calc(100% - 48px);">
                                            <lottie-player src="lottie/animation_ohno.json" class="mx-auto my-n4"
                                                           speed="1"
                                                           style="max-width: 100%;width: 250px;height:300px;" loop
                                                           autoplay></lottie-player>
                                            <h3 class=" text-center px-4" style="font-size:18px;">
                                                此開發者很偷懶，沒留下任何使用說明。
                                            </h3>
                                        </div>
                                        <div class="flex-fill"></div>
                                        <div class="w-100 d-flex border-top align-items-center mb-n2 pt-2 pb-2"
                                             style="height:50px;">
                                            <div class="flex-fill"></div>
                                            ${addView}
                                        </div>

                                    `;
                                }
                                else if (isValidHTML((vm.selectValue.data).subContent)) {
                                    return html `
                                        <div class="d-flex mx-n2 mt-n2 px-2 hi fw-bold d-flex align-items-center border-bottom border-top py-2 bgf6"
                                             style="color:#151515;font-size:16px;gap:0px;height:48px;">
                                            ${vm.selectValue.label}
                                        </div>
                                        <div class="flex-fill"></div>
                                        <div class="py-2" style="max-height:630px;overflow-y: auto;">
                                            ${vm.selectValue.data.subContent}
                                        </div>
                                        <div class="flex-fill"></div>
                                        <div class="w-100 d-flex border-top align-items-center mb-n2 pt-2 pb-2"
                                             style="height:50px;">
                                            <div class="flex-fill"></div>
                                            ${addView}
                                        </div>`;
                                }
                                else {
                                    return html `
                                        <div class="d-flex mx-n2 mt-n2 px-2 hi fw-bold d-flex align-items-center border-bottom border-top py-2 bgf6"
                                             style="color:#151515;font-size:16px;gap:0px;height:48px;">
                                            ${vm.selectValue.label}
                                        </div>
                                        <div class="flex-fill"></div>
                                        <div class="alert alert-info p-2"
                                             style="white-space: normal;word-break:break-all;">
                                            <strong>元件說明:</strong>
                                            ${vm.selectValue.data.subContent}
                                        </div>
                                        <div class="flex-fill"></div>
                                        <div class="w-100 d-flex border-top align-items-center mb-n2 pt-2 pb-2"
                                             style="height:50px;">
                                            <div class="flex-fill"></div>
                                            ${addView}
                                        </div>
                                    `;
                                }
                            }
                            else {
                                return html `
                                    <div class="d-flex mx-n2 mt-n2 px-2 hi fw-bold d-flex align-items-center border-bottom border-top py-2 bgf6"
                                         style="color:#151515;font-size:16px;gap:0px;height:48px;">
                                        說明描述
                                    </div>
                                    <div class="d-flex flex-column w-100 align-items-center justify-content-center"
                                         style="height:calc(100% - 48px);">
                                        <lottie-player src="lottie/animation_event.json" class="mx-auto my-n4" speed="1"
                                                       style="max-width: 100%;width: 250px;height:300px;" loop
                                                       autoplay></lottie-player>
                                        <h3 class=" text-center px-4" style="font-size:18px;">
                                            請於左側選擇事件添加，來賦予頁面功能。
                                        </h3>
                                    </div>
                                `;
                            }
                        },
                        divCreate: () => {
                            return {
                                class: `p-2 d-flex flex-column`, style: `width:350px;`
                            };
                        },
                        onCreate: () => {
                        }
                    };
                })
            });
        });
    }
    static seoRender(gvc) {
        const html = String.raw;
        const glitter = gvc.glitter;
        const viewModel = gvc.glitter.share.editorViewModel;
        const docID = glitter.getUUID();
        const vid = glitter.getUUID();
        viewModel.selectItem = viewModel.data;
        return new Promise((resolve, reject) => {
            resolve({
                left: gvc.bindView(() => {
                    return {
                        bind: vid,
                        view: () => {
                            let mapData = [];
                            viewModel.dataList.sort(function (a, b) {
                                var nameA = a.name.toUpperCase();
                                var nameB = b.name.toUpperCase();
                                if (nameA < nameB) {
                                    return -1;
                                }
                                if (nameA > nameB) {
                                    return 1;
                                }
                                return 0;
                            }).map((data, index) => {
                                data.group = data.group || '未分類';
                                const folder = data.group.split('/');
                                let nowFolder = mapData;
                                folder.map((d2) => {
                                    const selectFD = nowFolder.find((dd) => {
                                        return dd.label === d2;
                                    });
                                    if (!selectFD) {
                                        const fd = {
                                            type: 'container',
                                            label: d2,
                                            data: { setting: [] }
                                        };
                                        nowFolder.push(fd);
                                        nowFolder = fd.data.setting;
                                    }
                                    else {
                                        nowFolder = selectFD.data.setting;
                                    }
                                });
                                data.label = data.name;
                                nowFolder.push(data);
                            });
                            return new PageEditor(gvc, vid, docID).renderLineItem(mapData, false, mapData, {
                                copyType: 'directly',
                                readonly: true,
                                selectEvent: (dd) => {
                                    if (dd.type !== 'container') {
                                        viewModel.selectItem = dd;
                                        gvc.notifyDataChange(docID);
                                        gvc.notifyDataChange(vid);
                                    }
                                }
                            });
                        },
                        divCreate: {}
                    };
                }),
                right: PageEditor.pageEditorView({
                    gvc: gvc,
                    id: docID,
                    vid: vid,
                    viewModel: viewModel
                })
            });
        });
    }
    static pageEditorView(obj) {
        const gvc = obj.gvc;
        const viewModel = obj.viewModel;
        const docID = obj.id;
        const glitter = gvc.glitter;
        return obj.gvc.bindView(() => {
            return {
                bind: obj.id,
                view: () => {
                    const editData = obj.viewModel.selectItem;
                    return html `
                        <div class="mx-n2  mt-n2" style="">
                            <div class=" d-flex  px-2 hi fw-bold d-flex align-items-center border-bottom border-top py-2 bgf6"
                                 style="color:#151515;font-size:16px;gap:0px;">
                                SEO設定
                            </div>
                            ${gvc.bindView(() => {
                        const id = glitter.getUUID();
                        return {
                            bind: id,
                            view: () => {
                                var _a, _b, _c, _d, _e, _f, _g;
                                editData.page_config.seo = (_a = editData.page_config.seo) !== null && _a !== void 0 ? _a : {};
                                const seo = editData.page_config.seo;
                                seo.type = (_b = seo.type) !== null && _b !== void 0 ? _b : "def";
                                if (editData.tag === viewModel.homePage) {
                                    seo.type = 'custom';
                                }
                                return html `
                                            ${(editData.tag === viewModel.homePage) ? `` : EditorElem.h3('SEO參照')}
                                            <select class="mt-2 form-select form-control ${(editData.tag === viewModel.homePage) && 'd-none'}"
                                                    onchange="${gvc.event((e) => {
                                    seo.type = e.value;
                                    gvc.notifyDataChange(id);
                                })}">
                                                <option value="def" ${(seo.type === "def") ? `selected` : ``}>
                                                    依照首頁
                                                </option>
                                                <option value="custom"
                                                        ${(seo.type === "custom") ? `selected` : ``}>自定義
                                                </option>
                                            </select>
                                            ${(seo.type === "def") ? `` : gvc.map([uploadImage({
                                        gvc: gvc,
                                        title: `網頁logo`,
                                        def: (_c = seo.logo) !== null && _c !== void 0 ? _c : "",
                                        callback: (data) => {
                                            seo.logo = data;
                                        }
                                    }),
                                    uploadImage({
                                        gvc: gvc,
                                        title: `預覽圖片`,
                                        def: (_d = seo.image) !== null && _d !== void 0 ? _d : "",
                                        callback: (data) => {
                                            seo.image = data;
                                        }
                                    }),
                                    EditorElem.editeInput({
                                        gvc: gvc,
                                        title: "網頁標題",
                                        default: (_e = seo.title) !== null && _e !== void 0 ? _e : "",
                                        placeHolder: "請輸入網頁標題",
                                        callback: (text) => {
                                            seo.title = text;
                                        }
                                    }),
                                    EditorElem.editeText({
                                        gvc: gvc,
                                        title: "網頁描述",
                                        default: (_f = seo.content) !== null && _f !== void 0 ? _f : "",
                                        placeHolder: "請輸入網頁標題",
                                        callback: (text) => {
                                            seo.content = text;
                                        }
                                    }),
                                    EditorElem.editeText({
                                        gvc: gvc,
                                        title: "關鍵字設定",
                                        default: (_g = seo.keywords) !== null && _g !== void 0 ? _g : "",
                                        placeHolder: "關鍵字設定",
                                        callback: (text) => {
                                            seo.keywords = text;
                                        }
                                    })
                                ])}
                                        `;
                            },
                            divCreate: {
                                style: `padding-bottom:100px;`, class: `px-2`
                            }
                        };
                    })}
                        </div>
                    `;
                },
                divCreate: () => {
                    var _a, _b, _c, _d;
                    return {
                        class: `p-2 d-flex flex-column position-relative ${(_b = (_a = obj.style) === null || _a === void 0 ? void 0 : _a.class) !== null && _b !== void 0 ? _b : ""}`,
                        style: `max-height:calc(100vh - 100px);overflow-y:auto;overflow-x:hidden;width:100%;${(_d = (_c = obj.style) === null || _c === void 0 ? void 0 : _c.style) !== null && _d !== void 0 ? _d : ""}`
                    };
                },
                onCreate: () => {
                }
            };
        });
    }
    static formSetting(obj) {
        var _a, _b;
        const gvc = obj.gvc;
        const viewModel = obj.viewModel;
        const docID = obj.id;
        const glitter = gvc.glitter;
        obj.viewModel.page_config.formFormat = (_a = obj.viewModel.page_config.formFormat) !== null && _a !== void 0 ? _a : [];
        obj.viewModel.page_config.formData = (_b = obj.viewModel.page_config.formData) !== null && _b !== void 0 ? _b : {};
        const formFormat = obj.viewModel.page_config.formFormat;
        function userEditorView() {
            var _a;
            glitter.share.editorViewModel.saveArray = (_a = glitter.share.editorViewModel.saveArray) !== null && _a !== void 0 ? _a : {};
            const saasConfig = window.saasConfig;
            return gvc.bindView(() => {
                const id = glitter.getUUID();
                let selectTag = obj.viewModel.tag;
                return {
                    bind: id,
                    view: () => {
                        return [
                            gvc.bindView(() => {
                                const id = gvc.glitter.getUUID();
                                const vm = {
                                    loading: true,
                                    htmlText: ''
                                };
                                new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                                    function getPageData(tag, appName) {
                                        return new Promise((resolve, reject) => {
                                            BaseApi.create({
                                                "url": saasConfig.config.url + `/api/v1/template?appName=${appName}&tag=${encodeURIComponent(tag)}`,
                                                "type": "GET",
                                                "timeout": 0,
                                                "headers": {
                                                    "Content-Type": "application/json"
                                                }
                                            }).then((res) => {
                                                resolve(res.response.result[0]);
                                            });
                                        });
                                    }
                                    const pageData = yield getPageData(selectTag, saasConfig.config.appName);
                                    if (gvc.glitter.share.editorViewModel.data.tag === pageData.tag) {
                                        gvc.glitter.share.editorViewModel.data.page_config = pageData.page_config;
                                    }
                                    glitter.share.editorViewModel.saveArray[pageData.id] = (() => {
                                        return ApiPageConfig.setPage({
                                            id: pageData.id,
                                            appName: pageData.appName,
                                            tag: pageData.tag,
                                            page_config: pageData.page_config,
                                        });
                                    });
                                    let html = '';
                                    function appendHtml(pageData, initial) {
                                        var _a;
                                        if (!pageData) {
                                            return ``;
                                        }
                                        const page_config = pageData.page_config;
                                        page_config.formData = (_a = page_config.formData) !== null && _a !== void 0 ? _a : {};
                                        if (page_config.formFormat && page_config.formFormat.length !== 0) {
                                            const formView = gvc.bindView(() => {
                                                const id = gvc.glitter.getUUID();
                                                return {
                                                    bind: id,
                                                    view: () => {
                                                        return FormWidget.editorView({
                                                            gvc: gvc,
                                                            array: page_config.formFormat,
                                                            refresh: () => {
                                                                gvc.notifyDataChange(id);
                                                            },
                                                            formData: page_config.formData
                                                        });
                                                    }
                                                };
                                            });
                                            if (!initial) {
                                                html += gvc.bindView(() => {
                                                    const id = gvc.glitter.getUUID();
                                                    let toggle = false;
                                                    return {
                                                        bind: id,
                                                        view: () => {
                                                            return `<div class="mx-0 d-flex mt-2 border-top   mx-n3 px-3 hi fw-bold d-flex align-items-center  border-bottom  py-2 bgf6 "
                                                                 style="color:black;cursor: pointer;font-size:15px;" onclick="${gvc.event(() => {
                                                                toggle = !toggle;
                                                                gvc.notifyDataChange(id);
                                                            })}">
                                                                ${pageData.name}
                                                                <div class="flex-fill"></div>
                                                                ${toggle ? ` <i class="fa-solid fa-chevron-up d-flex align-items-center justify-content-center me-2"
                                   style="cursor:pointer;" aria-hidden="true"></i>` : ` <i class="fa-solid  fa-angle-down d-flex align-items-center justify-content-center me-2"
                                   style="cursor:pointer;" aria-hidden="true"></i>`}
                                                            </div>${(toggle) ? `<div class="pb-2">${formView}</div>` : ``}`;
                                                        }
                                                    };
                                                });
                                            }
                                            else {
                                                html += formView;
                                            }
                                        }
                                    }
                                    appendHtml(pageData, true);
                                    function loop(array) {
                                        var _a;
                                        return __awaiter(this, void 0, void 0, function* () {
                                            for (const dd of array) {
                                                if (dd.type === 'container') {
                                                    yield loop(dd.data.setting);
                                                }
                                                else if (dd.type === 'component') {
                                                    const pageData = yield getPageData(dd.data.tag, dd.data.refer_app || window.appName);
                                                    if (pageData) {
                                                        appendHtml(pageData, false);
                                                        yield loop((_a = pageData.config) !== null && _a !== void 0 ? _a : []);
                                                    }
                                                }
                                            }
                                        });
                                    }
                                    yield loop(pageData.config);
                                    if (!html) {
                                        resolve(`
                                                    <div class="d-flex align-items-center justify-content-center flex-column w-100"
                                                         style="width:100%;">
                                                        <lottie-player style="max-width: 100%;width: 200px;"
                                                                       src="https://assets10.lottiefiles.com/packages/lf20_rc6CDU.json"
                                                                       speed="1" loop="true"
                                                                       background="transparent"></lottie-player>
                                                        <h3 class="text-dark fs-6 mt-n3 px-2  "
                                                            style="line-height: 200%;text-align: center;">
                                                            此頁面無可編輯內容。</h3>
                                                    </div>`);
                                    }
                                    else {
                                        resolve(html);
                                    }
                                })).then((data) => {
                                    vm.htmlText = data;
                                    vm.loading = false;
                                    gvc.notifyDataChange(id);
                                });
                                return {
                                    bind: id,
                                    view: () => {
                                        if (vm.loading) {
                                            return `<div class="w-100 d-flex align-items-center justify-content-center p-3">
<div class="spinner-border" role="status">
  <span class="sr-only">Loading...</span>
</div>
</div>`;
                                        }
                                        else {
                                            return vm.htmlText;
                                        }
                                    }
                                };
                            })
                        ].join('');
                    },
                    divCreate: {
                        class: 'pb-2 mt-n2'
                    },
                    onCreate: () => {
                        $('.tooltip').remove();
                        $('[data-bs-toggle="tooltip"]').tooltip();
                    }
                };
            });
        }
        return gvc.bindView(() => {
            return {
                bind: docID,
                view: () => {
                    return html `
                        <div class="d-flex  px-2 hi fw-bold d-flex align-items-center border-bottom border-top  bgf6 d-none"
                             style="color:#151515;font-size:16px;gap:0px;height:48px;">
                            編輯頁面內容
                            <button class="btn ms-2 btn-primary-c ms-auto" style="height: 30px;width: 80px;"
                                    onclick="${gvc.event(() => {
                        EditorElem.openEditorDialog(gvc, (gvc) => {
                            return FormWidget.settingView({
                                gvc: gvc,
                                array: formFormat,
                                refresh: () => {
                                    gvc.recreateView();
                                },
                                title: ''
                            });
                        }, () => {
                            glitter.htmlGenerate.saveEvent(true);
                        }, 400);
                    })}">表單設置
                            </button>
                        </div>
                        <div class="p-2" style="height: calc(100vh - 110px);overflow-y:auto;overflow-x: hidden;">
                            ${userEditorView()}

                        </div>
                    `;
                }
            };
        });
    }
    static pageSelctor(gvc, callBack, option) {
        const html = String.raw;
        const glitter = gvc.glitter;
        const viewModel = gvc.glitter.share.editorViewModel;
        const docID = glitter.getUUID();
        const vid = glitter.getUUID();
        return new Promise((resolve, reject) => {
            resolve({
                left: gvc.bindView(() => {
                    return {
                        bind: vid,
                        view: () => {
                            let mapData = [];
                            viewModel.dataList.sort(function (a, b) {
                                var nameA = a.name.toUpperCase();
                                var nameB = b.name.toUpperCase();
                                if (nameA < nameB) {
                                    return -1;
                                }
                                if (nameA > nameB) {
                                    return 1;
                                }
                                return 0;
                            }).map((data, index) => {
                                if (data.tag === glitter.getUrlParameter('page')) {
                                    viewModel.selectItem = viewModel.data;
                                }
                                data.group = data.group || '未分類';
                                if ((option && option.filter) ? option.filter(data) : (data.group !== 'glitter-article')) {
                                    const folder = data.group.split('/');
                                    let nowFolder = mapData;
                                    folder.map((d2) => {
                                        const selectFD = nowFolder.find((dd) => {
                                            return dd.label === d2;
                                        });
                                        if (!selectFD) {
                                            const fd = {
                                                type: 'container',
                                                label: d2,
                                                data: { setting: [] }
                                            };
                                            nowFolder.push(fd);
                                            nowFolder = fd.data.setting;
                                        }
                                        else {
                                            nowFolder = selectFD.data.setting;
                                        }
                                    });
                                    data.label = data.name;
                                    nowFolder.push(data);
                                }
                            });
                            if (mapData.length === 0) {
                                return `  <div class="d-flex align-items-center justify-content-center flex-column">
                                    <lottie-player style="max-width: 100%;width: 200px;" src="https://assets10.lottiefiles.com/packages/lf20_rc6CDU.json" speed="1" loop="true" background="transparent"></lottie-player>
                                    <h3 class="text-dark fs-6 mt-n3 px-2  " style="line-height: 200%;text-align: center;">尚未添加任何頁面。</h3>
</div>`;
                            }
                            return new PageEditor(gvc, vid, docID).renderLineItem(mapData, false, mapData, {
                                copyType: 'directly',
                                readonly: true,
                                selectEvent: (dd) => {
                                    if (dd) {
                                        callBack(dd);
                                    }
                                },
                                justFolder: true,
                                selectEv: option && option.checkSelect
                            });
                        },
                        divCreate: {}
                    };
                }),
                right: gvc.bindView(() => {
                    let editData = viewModel.selectItem;
                    return {
                        bind: docID,
                        view: () => {
                            if (viewModel.selectItem.type !== 'container') {
                                editData = viewModel.selectItem;
                            }
                            return html `
                                <div class="mx-n2  mt-n2" style="">
                                    <div class="d-flex  px-2 hi fw-bold d-flex align-items-center border-bottom border-top  bgf6"
                                         style="color:#151515;font-size:16px;gap:0px;height:48px;">
                                        ${editData.name}
                                    </div>
                                    <div class=" pt-0 justify-content-start px-2" style="">
                                        ${[EditorElem.select({
                                    title: "設為首頁",
                                    gvc: gvc,
                                    def: (viewModel.homePage === editData.tag) ? `true` : `false`,
                                    array: [{ title: "是", value: 'true' }, { title: "否", value: 'false' }],
                                    callback: (text) => {
                                        if (text === 'true') {
                                            viewModel.homePage = editData.tag;
                                            editData.page_config.seo.type = 'custom';
                                        }
                                        else {
                                            viewModel.homePage = undefined;
                                        }
                                        gvc.notifyDataChange(docID);
                                    }
                                }),
                                EditorElem.editeInput({
                                    gvc: gvc,
                                    title: '頁面連結',
                                    placeHolder: `請輸入頁面標籤`,
                                    default: editData.tag,
                                    callback: (text) => {
                                        editData.tag = text;
                                    }
                                }),
                                EditorElem.editeInput({
                                    gvc: gvc,
                                    title: '頁面名稱',
                                    placeHolder: `請輸入頁面名稱`,
                                    default: editData.name,
                                    callback: (text) => {
                                        editData.name = text;
                                    }
                                }),
                                EditorElem.searchInput({
                                    title: "頁面分類",
                                    gvc: gvc,
                                    def: editData.group,
                                    array: (() => {
                                        let group = [];
                                        viewModel.dataList.map((dd) => {
                                            if (group.indexOf(dd.group) === -1) {
                                                group.push(dd.group);
                                            }
                                        });
                                        return group;
                                    })(),
                                    callback: (text) => {
                                        editData.group = text;
                                        gvc.notifyDataChange(docID);
                                    },
                                    placeHolder: "請輸入頁面分類"
                                }),
                                (() => {
                                    let deleteText = '';
                                    return html `
                                                    <div class="w-100 d-flex align-items-center justify-content-center mt-3"
                                                         style="">
                                                        <h3 style="font-size: 16px;width: 100px;white-space: nowrap;color:red;"
                                                            class="m-0 me-2 mb-2">刪除頁面</h3>
                                                        ${glitter.htmlGenerate.editeInput({
                                        gvc: gvc,
                                        title: '',
                                        placeHolder: `請輸入「我要刪除」。`,
                                        default: '',
                                        callback: (text) => {
                                            deleteText = text;
                                        }
                                    })}
                                                        <button class="btn btn-danger ms-2 mt-0 mb-2"
                                                                style="width:100px;" onclick="${gvc.event(() => {
                                        if (deleteText === '我要刪除') {
                                            const dialog = new ShareDialog(glitter);
                                            dialog.dataLoading({ visible: true });
                                            ApiPageConfig.deletePage({
                                                "id": editData.id,
                                                "appName": glitter.getUrlParameter('appName'),
                                            }).then((data) => {
                                                dialog.dataLoading({ visible: false });
                                                location.reload();
                                            });
                                        }
                                    })}">確認
                                                        </button>
                                                    </div>`;
                                })()].map((dd) => {
                                return `<div class="">${dd}</div>`;
                            }).join(``)}
                                    </div>
                                    <div class="mt-2 d-flex  px-2 hi fw-bold d-flex align-items-center border-bottom border-top py-2 bgf6"
                                         style="color:#151515;font-size:16px;gap:0px;">
                                        SEO設定
                                    </div>
                                    ${gvc.bindView(() => {
                                const id = glitter.getUUID();
                                return {
                                    bind: id,
                                    view: () => {
                                        var _a, _b, _c, _d, _e, _f, _g;
                                        editData.page_config.seo = (_a = editData.page_config.seo) !== null && _a !== void 0 ? _a : {};
                                        const seo = editData.page_config.seo;
                                        seo.type = (_b = seo.type) !== null && _b !== void 0 ? _b : "def";
                                        if (editData.tag === viewModel.homePage) {
                                            seo.type = 'custom';
                                        }
                                        return html `
                                                    ${(editData.tag === viewModel.homePage) ? `` : EditorElem.h3('SEO參照')}
                                                    <select class="mt-2 form-select form-control ${(editData.tag === viewModel.homePage) && 'd-none'}"
                                                            onchange="${gvc.event((e) => {
                                            seo.type = e.value;
                                            gvc.notifyDataChange(id);
                                        })}">
                                                        <option value="def" ${(seo.type === "def") ? `selected` : ``}>
                                                            依照首頁
                                                        </option>
                                                        <option value="custom"
                                                                ${(seo.type === "custom") ? `selected` : ``}>自定義
                                                        </option>
                                                    </select>
                                                    ${(seo.type === "def") ? `` : gvc.map([uploadImage({
                                                gvc: gvc,
                                                title: `網頁logo`,
                                                def: (_c = seo.logo) !== null && _c !== void 0 ? _c : "",
                                                callback: (data) => {
                                                    seo.logo = data;
                                                }
                                            }),
                                            uploadImage({
                                                gvc: gvc,
                                                title: `預覽圖片`,
                                                def: (_d = seo.image) !== null && _d !== void 0 ? _d : "",
                                                callback: (data) => {
                                                    seo.image = data;
                                                }
                                            }),
                                            glitter.htmlGenerate.editeInput({
                                                gvc: gvc,
                                                title: "網頁標題",
                                                default: (_e = seo.title) !== null && _e !== void 0 ? _e : "",
                                                placeHolder: "請輸入網頁標題",
                                                callback: (text) => {
                                                    seo.title = text;
                                                }
                                            }),
                                            glitter.htmlGenerate.editeText({
                                                gvc: gvc,
                                                title: "網頁描述",
                                                default: (_f = seo.content) !== null && _f !== void 0 ? _f : "",
                                                placeHolder: "請輸入網頁標題",
                                                callback: (text) => {
                                                    seo.content = text;
                                                }
                                            }),
                                            glitter.htmlGenerate.editeText({
                                                gvc: gvc,
                                                title: "關鍵字設定",
                                                default: (_g = seo.keywords) !== null && _g !== void 0 ? _g : "",
                                                placeHolder: "關鍵字設定",
                                                callback: (text) => {
                                                    seo.keywords = text;
                                                }
                                            })
                                        ])}
                                                `;
                                    },
                                    divCreate: {
                                        style: `padding-bottom:100px;`, class: `px-2`
                                    }
                                };
                            })}
                                </div>`;
                        },
                        divCreate: () => {
                            return {
                                class: ` h-100 p-2 d-flex flex-column`,
                                style: `width:400px;max-height:80vh;overflow-y:auto;overflow-x:hidden;`
                            };
                        },
                        onCreate: () => {
                        }
                    };
                })
            });
        });
    }
    static domainRender(gvc) {
        const html = String.raw;
        const glitter = gvc.glitter;
        const docID = glitter.getUUID();
        const vid = glitter.getUUID();
        const config = window.parent.config;
        const viewModel = (window.parent.glitter || window.glitter).share.editorViewModel;
        return new Promise((resolve, reject) => {
            resolve({
                left: gvc.bindView(() => {
                    return {
                        bind: vid,
                        view: () => {
                            return questionText(`網域設定步驟`, [
                                {
                                    title: '步驟一：購買網域', content: `前往第三方服務購買網域，例如:<br>
                             -<a class="fw-bold mt-2" href="https://domain.hinet.net/#/" target="_blank">中華電信HiNet</a><br>
                             -<a class="fw-bold" href="https://tw.godaddy.com/" target="_blank">GoDaddy</a><br>
                             -<a class="fw-bold" href="https://aws.amazon.com/tw/route53/" target="_blank">AWS Router 53</a><br>
                             `
                                },
                                {
                                    title: '步驟二：更改DNS', content: `
                             前往DNS設定，並將A標籤設置為34.81.28.192。
                             `
                                },
                                {
                                    title: '步驟三：填寫網域名稱', content: `
                             <div class="mb-2">請輸入您的網域名稱:</div>
${EditorElem.editeInput({
                                        gvc: gvc,
                                        title: "",
                                        default: viewModel.domain,
                                        placeHolder: `網域名稱`,
                                        callback: (text) => {
                                            viewModel.domain = text;
                                        }
                                    })}`
                                },
                                {
                                    title: '步驟四：部署網域', content: `
DNS設定至少需要10分鐘到72小時才會生效，如設定失敗可以稍加等待後再重新嘗試。
<button type="button" class="btn btn-primary-c  w-100 mt-2" style=""
onclick="${gvc.event(() => {
                                        const dialog = new ShareDialog(glitter);
                                        dialog.dataLoading({ text: '', visible: true });
                                        ApiPageConfig.setDomain({
                                            domain: viewModel.domain,
                                            app_name: config.appName,
                                            token: config.token
                                        }).then((response) => {
                                            dialog.dataLoading({ text: '', visible: false });
                                            if (response.result) {
                                                gvc.closeDialog();
                                                dialog.successMessage({ text: "設定成功" });
                                            }
                                            else {
                                                dialog.errorMessage({ text: "設定失敗，DNS設定可能尚未生效或者請確認網域所有權。" });
                                            }
                                        });
                                    })}"
>點我部署</button>`
                                }
                            ], true);
                        },
                        divCreate: { class: ` position-relative `, style: `width:600px;` }
                    };
                }),
                right: ``
            });
        });
    }
}
PageEditor.openDialog = {
    plugin_setting: (gvc) => {
        const viewModel = gvc.glitter.share.editorViewModel;
        viewModel.selectItem = undefined;
        gvc.glitter.innerDialog((gvc) => {
            let searchText = '';
            let searchInterval = 0;
            const id = gvc.glitter.getUUID();
            const vm = {
                select: "view"
            };
            return html `
                    <div class="bg-white rounded" style="max-height:90vh;">
                        <div class="d-flex w-100 border-bottom align-items-center" style="height:50px;">
                            <h3 style="font-size:15px;font-weight:500;" class="m-0 ps-3">
                                插件設定</h3>
                            <div class="flex-fill"></div>
                            <div class="hoverBtn p-2 me-2" style="color:black;font-size:20px;"
                                 onclick="${gvc.event(() => {
                gvc.closeDialog();
            })}"
                            ><i class="fa-sharp fa-regular fa-circle-xmark"></i>
                            </div>
                        </div>
                        <div class="d-flex " style="">
                            <div>
                                ${gvc.bindView(() => {
                return {
                    bind: id,
                    view: () => {
                        const contentVM = {
                            loading: true,
                            leftID: gvc.glitter.getUUID(),
                            rightID: gvc.glitter.getUUID(),
                            leftBar: '',
                            rightBar: ''
                        };
                        switch (vm.select) {
                            case "view":
                                break;
                            case "event":
                                PageEditor.eventRender(gvc).then((data) => {
                                    contentVM.loading = false;
                                    contentVM.leftBar = data.left;
                                    contentVM.rightBar = data.right;
                                    gvc.notifyDataChange([contentVM.leftID, contentVM.rightID]);
                                });
                                break;
                            default:
                                PageEditor.resourceInitial(gvc).then((data) => {
                                    contentVM.loading = false;
                                    contentVM.leftBar = data.left;
                                    contentVM.rightBar = data.right;
                                    gvc.notifyDataChange([contentVM.leftID, contentVM.rightID]);
                                });
                                break;
                        }
                        return html `
                                                <div class="d-flex">
                                                    <div style="width:300px;" class="border-end">
                                                        <div class="d-flex border-bottom ">
                                                            ${[
                            {
                                key: 'view',
                                label: "頁面模塊"
                            },
                            {
                                key: 'event',
                                label: "事件模塊"
                            },
                            {
                                key: 'router',
                                label: "資源初始化"
                            }
                        ].map((dd) => {
                            return `<div class="add_item_button ${(dd.key === vm.select) ? `add_item_button_active` : ``}" onclick="${gvc.event((e, event) => {
                                viewModel.selectItem = undefined;
                                vm.select = dd.key;
                                gvc.notifyDataChange(id);
                            })}">${dd.label}</div>`;
                        }).join('')}
                                                        </div>
                                                        ${gvc.bindView(() => {
                            return {
                                bind: contentVM.leftID,
                                view: () => {
                                    return contentVM.leftBar;
                                },
                                divCreate: {
                                    class: ``,
                                    style: `max-height:calc(90vh - 150px);overflow-y:auto;overflow-x:hidden;`
                                }
                            };
                        })}
                                                    </div>
                                                    ${gvc.bindView(() => {
                            return {
                                bind: contentVM.rightID,
                                view: () => {
                                    return contentVM.rightBar;
                                },
                                divCreate: {}
                            };
                        })}
                                                </div>`;
                    },
                    divCreate: {
                        style: `overflow-y:auto;`
                    },
                    onCreate: () => {
                    }
                };
            })}
                            </div>
                        </div>
                    </div>
                `;
        }, "EditItem");
    },
    event_config: (gvc, eventSelect) => {
        NormalPageEditor.toggle({
            visible: true,
            title: `添加事件`,
            view: (() => {
                const id = gvc.glitter.getUUID();
                const vm = {
                    select: "official"
                };
                return html `
                        <div class="d-flex " style="">
                            <div>
                                ${gvc.bindView(() => {
                    return {
                        bind: id,
                        view: () => {
                            const contentVM = {
                                loading: true,
                                leftID: gvc.glitter.getUUID(),
                                rightID: gvc.glitter.getUUID(),
                                leftBar: '',
                                rightBar: ''
                            };
                            switch (vm.select) {
                                case "official":
                                    PageEditor.eventEditor(gvc, eventSelect).then((data) => {
                                        contentVM.loading = false;
                                        contentVM.leftBar = data.left;
                                        contentVM.rightBar = data.right;
                                        gvc.notifyDataChange([contentVM.leftID, contentVM.rightID]);
                                    });
                                    break;
                                case "custom":
                                    PageEditor.eventEditor(gvc, eventSelect, 'custom').then((data) => {
                                        contentVM.loading = false;
                                        contentVM.leftBar = data.left;
                                        contentVM.rightBar = data.right;
                                        gvc.notifyDataChange([contentVM.leftID, contentVM.rightID]);
                                    });
                                    break;
                                default:
                                    break;
                            }
                            return html `
                                                <div class="d-flex">
                                                    <div style="width:300px;" class="border-end">
                                                        <div class="d-flex border-bottom ">
                                                            ${[
                                {
                                    key: 'official',
                                    label: "官方事件"
                                },
                                {
                                    key: 'custom',
                                    label: "客製插件"
                                }
                            ].map((dd) => {
                                return `<div class="add_item_button ${(dd.key === vm.select) ? `add_item_button_active` : ``}" onclick="${gvc.event((e, event) => {
                                    vm.select = dd.key;
                                    gvc.notifyDataChange(id);
                                })}">${dd.label}</div>`;
                            }).join('')}
                                                        </div>
                                                        ${gvc.bindView(() => {
                                return {
                                    bind: contentVM.leftID,
                                    view: () => {
                                        return contentVM.leftBar;
                                    },
                                    divCreate: {
                                        class: ``,
                                        style: `min-height:100vh;overflow-y:auto;`
                                    }
                                };
                            })}
                                                    </div>
                                                    ${gvc.bindView(() => {
                                return {
                                    bind: contentVM.rightID,
                                    view: () => {
                                        return contentVM.rightBar;
                                    },
                                    divCreate: {}
                                };
                            })}
                                                </div>`;
                        },
                        divCreate: {
                            style: `overflow-y:auto;`, class: `pb-3`
                        },
                        onCreate: () => {
                        }
                    };
                })}
                            </div>
                        </div>
                `;
            })(),
            width: 650
        });
    },
    event_trigger_list: (gvc, left, right, title) => {
        const viewModel = gvc.glitter.share.editorViewModel;
        viewModel.selectItem = undefined;
        NormalPageEditor.toggle({
            visible: true,
            title: title,
            view: (() => {
                const id = gvc.glitter.getUUID();
                return `<div class="d-flex" style="">${[
                    gvc.bindView(() => {
                        return {
                            bind: gvc.glitter.getUUID(),
                            view: () => {
                                return left;
                            },
                            divCreate: {
                                class: `border-end vh-100`,
                                style: `width:350px;`
                            }
                        };
                    }),
                    gvc.bindView(() => {
                        return {
                            bind: gvc.glitter.getUUID(),
                            view: () => {
                                return right;
                            },
                            divCreate: {
                                class: ``,
                                style: `width:400px;`
                            }
                        };
                    })
                ].join('')}</div>`;
            })(),
            width: 750
        });
    },
    seo_with_domain: (gvc) => {
        const viewModel = gvc.glitter.share.editorViewModel;
        viewModel.selectItem = undefined;
        gvc.glitter.innerDialog((gvc) => {
            let searchText = '';
            let searchInterval = 0;
            const id = gvc.glitter.getUUID();
            const vm = {
                select: "seo"
            };
            return html `
                    <div class="bg-white rounded" style="max-height:90vh;">
                        <div class="d-flex w-100 border-bottom align-items-center" style="height:50px;">
                            <h3 style="font-size:15px;font-weight:500;" class="m-0 ps-3">
                                網域配置</h3>
                            <div class="flex-fill"></div>
                            <div class="hoverBtn p-2 me-2" style="color:black;font-size:20px;"
                                 onclick="${gvc.event(() => {
                gvc.closeDialog();
            })}"
                            ><i class="fa-sharp fa-regular fa-circle-xmark"></i>
                            </div>
                        </div>
                        <div class="d-flex " style="">
                            <div>
                                ${gvc.bindView(() => {
                return {
                    bind: id,
                    view: () => {
                        const contentVM = {
                            loading: true,
                            leftID: gvc.glitter.getUUID(),
                            rightID: gvc.glitter.getUUID(),
                            leftBar: '',
                            rightBar: ''
                        };
                        PageEditor.domainRender(gvc).then((response) => {
                            contentVM.loading = false;
                            contentVM.leftBar = response.left;
                            contentVM.rightBar = response.right;
                            gvc.notifyDataChange([contentVM.leftID, contentVM.rightID]);
                        });
                        return html `
                                                <div class="d-flex">
                                                    <div style="min-width:300px;" class="border-end">
                                                        ${gvc.bindView(() => {
                            return {
                                bind: contentVM.leftID,
                                view: () => {
                                    return contentVM.leftBar;
                                },
                                divCreate: {
                                    class: `position-relative`,
                                    style: `max-height:calc(90vh - 150px);overflow-y:auto;overflow-x:hidden;`
                                }
                            };
                        })}
                                                    </div>
                                                    ${gvc.bindView(() => {
                            return {
                                bind: contentVM.rightID,
                                view: () => {
                                    return contentVM.rightBar;
                                },
                                divCreate: {
                                    class: `position-relative`
                                }
                            };
                        })}
                                                </div>`;
                    },
                    divCreate: {
                        style: `overflow-y:auto;`
                    },
                    onCreate: () => {
                    }
                };
            })}
                            </div>
                        </div>
                    </div>
                `;
        }, "EditItem");
    },
};
;
function isValidHTML(str) {
    const htmlRegex = /<[a-z][\s\S]*>/i;
    return htmlRegex.test(str);
}
function swapArr(arr, index1, index2) {
    const data = arr[index1];
    arr.splice(index1, 1);
    arr.splice(index2, 0, data);
}
function uploadImage(obj) {
    const glitter = window.glitter;
    const id = glitter.getUUID();
    return obj.gvc.bindView(() => {
        return {
            bind: id,
            view: () => {
                return `<h3 style="font-size: 15px;margin-bottom: 10px;" class="mt-2 fw-500">${obj.title}</h3>
                            <div class="d-flex align-items-center mb-3">
                                <input class="flex-fill form-control "  placeholder="請輸入圖片連結" value="${obj.def}" onchange="${obj.gvc.event((e) => {
                    obj.callback(e.value);
                    obj.def = e.value;
                    obj.gvc.notifyDataChange(id);
                })}">
                                <div class="" style="width: 1px;height: 25px;background-"></div>
                                <i class="fa-regular fa-upload text-dark ms-2" style="cursor: pointer;" onclick="${obj.gvc.event(() => {
                    glitter.ut.chooseMediaCallback({
                        single: true,
                        accept: 'json,image/*',
                        callback(data) {
                            const saasConfig = window.saasConfig;
                            const dialog = new ShareDialog(obj.gvc.glitter);
                            dialog.dataLoading({ visible: true });
                            const file = data[0].file;
                            saasConfig.api.uploadFile(file.name).then((data) => {
                                dialog.dataLoading({ visible: false });
                                const data1 = data.response;
                                dialog.dataLoading({ visible: true });
                                $.ajax({
                                    url: data1.url,
                                    type: 'put',
                                    data: file,
                                    headers: {
                                        "Content-Type": data1.type
                                    },
                                    processData: false,
                                    crossDomain: true,
                                    success: (data2) => {
                                        dialog.dataLoading({ visible: false });
                                        obj.callback(data1.fullUrl);
                                        obj.def = data1.fullUrl;
                                        obj.gvc.notifyDataChange(id);
                                    },
                                    error: (err) => {
                                        dialog.dataLoading({ visible: false });
                                        dialog.errorMessage({ text: "上傳失敗" });
                                    },
                                });
                            });
                        }
                    });
                })}"></i>
                            </div>
                            ${obj.def && `<img src="${obj.def}" style="max-width: 150px;">`}

`;
            },
            divCreate: {}
        };
    });
}
function questionText(title, data, show) {
    return `<div class="bg-secondary rounded-3 py-2 px-2 ">
          <h2 class="text-center my-3 mt-2" style="font-size:22px;">${title}</h2>
             <div class="accordion mx-2" id="${(show) || `faq`}">
                ${data.map((dd, index) => {
        return ` <div class="accordion-item border-0 rounded-3 shadow-sm mb-3">
                  <h3 class="accordion-header">
                    <button class="accordion-button shadow-none rounded-3 ${(index === 0 || show) ? '' : 'collapsed'}" type="button" data-bs-toggle="collapse" data-bs-target="#q-${index}" aria-expanded="false" aria-controls="q-1">${dd.title}</button>
                  </h3>
                  <div class="accordion-collapse collapse ${(index === 0 || show) ? 'show' : ''}" id="q-${index}" data-bs-parent="#faq" style="">
                    <div class="accordion-body fs-sm pt-0">
                     ${dd.content}
                    </div>
                  </div>
                </div>`;
    }).join('')}
              
              </div>
        </div>`;
}
function deepEqual(obj1, obj2) {
    if (obj1 === obj2) {
        return true;
    }
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
        return false;
    }
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) {
        console.log(`長度不同:${keys1.length}-${keys2.length}`);
        console.log(`keys1`, keys1);
        console.log(`keys2`, keys2);
        return false;
    }
    for (let key of keys1) {
        if (!deepEqual(obj1[key], obj2[key])) {
            console.log(`內容不同-${key}:${obj1[key]}-${obj2[key]}`);
            return false;
        }
    }
    return true;
}
