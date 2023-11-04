import Add_item_dia from "../editor/add_item_dia.js";
import { Swal } from "../modules/sweetAlert.js";
import { EditorElem } from "../glitterBundle/plugins/editor-elem.js";
import { ShareDialog } from "../glitterBundle/dialog/ShareDialog.js";
import { TriggerEvent } from "../glitterBundle/plugins/trigger-event.js";
import { ApiPageConfig } from "../api/pageConfig.js";
import { HtmlGenerate } from "../glitterBundle/module/Html_generate.js";
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
        const dragModel = {
            draggableElement: '',
            dragOffsetY: 0,
            dragStart: 0,
            maxHeight: 0,
            editor_item: [],
            hover_item: [],
            currentIndex: 0,
            changeIndex: 0,
            firstIndex: 0
        };
        const mup_Linstener = function (event) {
            if (dragModel.draggableElement) {
                dragModel.currentIndex = (dragModel.currentIndex > array.length) ? array.length - 1 : dragModel.currentIndex;
                $('.select_container').toggleClass('select_container');
                document.getElementById(dragModel.draggableElement).remove();
                dragModel.draggableElement = '';
                swapArr(original, array[dragModel.firstIndex].index, array[(dragModel.currentIndex > 0) ? dragModel.currentIndex - 1 : 0].index);
                gvc.notifyDataChange([vid, 'htmlGenerate', 'showView']);
            }
            document.removeEventListener('mouseup', mup_Linstener);
            document.removeEventListener('mousemove', move_Linstener);
        };
        const move_Linstener = function (event) {
            if (!dragModel.draggableElement) {
                return;
            }
            let off = event.clientY - dragModel.dragStart + dragModel.dragOffsetY;
            if (off < 5) {
                off = 5;
            }
            else if (off > dragModel.maxHeight) {
                off = dragModel.maxHeight;
            }
            console.log(`offsetY`, off);
            function findClosestNumber(ar, target) {
                if (ar.length === 0)
                    return null;
                const arr = JSON.parse(JSON.stringify(ar));
                let index = 0;
                let closest = arr[0];
                arr.push(ar[ar.length - 1] + 34);
                let minDifference = Math.abs(target - closest);
                for (let i = 1; i < arr.length; i++) {
                    const difference = Math.abs(target - arr[i]);
                    if (difference < minDifference) {
                        closest = arr[i];
                        index = i;
                        minDifference = difference;
                    }
                }
                return index;
            }
            let closestNumber = findClosestNumber(dragModel.hover_item.map((dd, index) => {
                return (34 * index + 1) - 17;
            }), off);
            console.log(`closestNumber`, closestNumber);
            dragModel.changeIndex = closestNumber;
            dragModel.currentIndex = closestNumber;
            $('.editor_item.hv').remove();
            if (dragModel.currentIndex == array.length) {
                $('.select_container').append(`<div class="editor_item active hv"></div>`);
            }
            else if (dragModel.currentIndex == 1) {
                $('.select_container').prepend(`<div class="editor_item active hv"></div>`);
            }
            else {
                const parentElement = document.getElementsByClassName("select_container")[0];
                const referenceElement = dragModel.hover_item[dragModel.currentIndex].elem.get(0);
                const newElement = document.createElement("div", {});
                newElement.classList.add("editor_item");
                newElement.classList.add("active");
                newElement.classList.add("hv");
                newElement.textContent = "";
                parentElement.insertBefore(newElement, referenceElement);
            }
            $(`#${dragModel.draggableElement}`).css("position", "absolute");
            $(`#${dragModel.draggableElement}`).css("right", "0px");
            $(`#${dragModel.draggableElement}`).css("top", off + "px");
        };
        return gvc.bindView(() => {
            return {
                bind: parId,
                view: () => {
                    return array.map((dd, index) => {
                        dd.selectEditEvent = () => {
                            if (!glitter.share.inspect) {
                                return false;
                            }
                            viewModel.selectContainer = original;
                            viewModel.selectItem = dd;
                            glitter.setCookie('lastSelect', dd.id);
                            gvc.notifyDataChange([vid, this.editorID]);
                            return true;
                        };
                        let toggle = gvc.event((e, event) => {
                            dd.toggle = !dd.toggle;
                            if ((() => {
                                return dd.type === 'container' && checkChildSelect(dd.data.setting);
                            })() && !dd.toggle) {
                                viewModel.selectItem = undefined;
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
                                if (b.data && b.data.setting && checkChildSelect(b.data.setting)) {
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
                                    <l1 class="btn-group "
                                        style="margin-top:1px;margin-bottom:1px;">
                                        <div class="editor_item d-flex   px-2 my-0 hi me-n1 ${(viewModel.selectItem === dd || selectChild || (option.selectEv && option.selectEv(dd))) ? `active` : ``}"
                                             style=""
                                             onclick="${option.selectEvent || gvc.event(() => {
                            viewModel.selectContainer = original;
                            viewModel.selectItem = dd;
                            glitter.setCookie('lastSelect', dd.id);
                            gvc.notifyDataChange(['htmlGenerate', 'showView', vid, this.editorID]);
                        })}">
                                            ${(dd.type === 'container') ? html `
                                                <div class="subBt ps-0 ms-n2" onclick="${toggle}">
                                                    ${((dd.toggle) ? `<i class="fa-regular fa-angle-down hoverBtn " ></i>` : `
                                                                        <i class="fa-regular fa-angle-right hoverBtn " ></i>
                                                                        `)}
                                                </div>` : ``}
                                            ${dd.label}
                                            <div class="flex-fill"></div>
                                            ${(dd.type === 'container') ? ` <l1 class="btn-group me-0 subBt"
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
                                                                                ` : ` <div class="d-flex align-items-center justify-content-center w-100 h-100 ${(option.readonly) ? `d-none` : ``}" 
                                                                                   onclick="${gvc.event(() => {
                            glitter.innerDialog((gvc) => {
                                viewModel.selectContainer = dd.data.setting;
                                return Add_item_dia.view(gvc);
                            }, 'Add_item_dia');
                        })}">
                                                                                    <i class="fa-regular fa-circle-plus d-flex align-items-center justify-content-center subBt "></i>
                                                                                </div>`}
                                                                               
                                                                            </l1>` : ``}
                                            <div class="subBt ${(option.readonly) ? `d-none` : ``}"
                                                 onclick="${gvc.event((e, event) => {
                            if (option.copyType === 'directly') {
                                const copy = JSON.parse(JSON.stringify(dd));
                                copy.id = glitter.getUUID();
                                viewModel.selectContainer = array;
                                viewModel.selectItem = copy;
                                original.push(copy);
                                gvc.notifyDataChange([vid]);
                            }
                            else {
                                viewModel.selectContainer = array;
                                viewModel.waitCopy = dd;
                                glitter.share.copycomponent = JSON.stringify(viewModel.waitCopy);
                                navigator.clipboard.writeText(JSON.stringify(viewModel.waitCopy));
                                swal.toast({
                                    icon: 'success',
                                    title: "已複製至剪貼簿，選擇新增模塊來添加項目．"
                                });
                            }
                            event.stopPropagation();
                        })}">
                                                <i class="fa-sharp fa-regular fa-scissors d-flex align-items-center justify-content-center subBt "
                                                   style="width:15px;height:15px;"
                                                ></i>
                                            </div>
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

                                            <div class="subBt ${(option.readonly) ? `d-none` : ``}" onmousedown="${gvc.event((e, event) => {
                            dragModel.firstIndex = index;
                            dragModel.currentIndex = index;
                            dragModel.draggableElement = glitter.getUUID();
                            dragModel.dragStart = event.clientY;
                            dragModel.dragOffsetY = $(e).parent().parent().get(0).offsetTop;
                            dragModel.maxHeight = $(e).parent().parent().parent().height();
                            $(e).parent().addClass('d-none');
                            dragModel.hover_item = [];
                            $(e).parent().parent().append(`<div class="editor_item active  hv"></div>`);
                            $(e).parent().parent().parent().addClass('select_container');
                            $('.select_container').children().each(function (index) {
                                if ($(this).get(0).offsetTop > 0) {
                                    dragModel.hover_item.push({
                                        elem: $(this),
                                        offsetTop: $(this).get(0).offsetTop
                                    });
                                }
                            });
                            console.log(`hover_item`, dragModel.hover_item);
                            $(e).parent().parent().parent().append(html `
                                                            <l1 class="btn-group position-absolute  "
                                                                style="width:${$(e).parent().parent().width() - 50}px;right:15px;top:${dragModel.dragOffsetY}px;z-index:99999;border-radius:10px;background:white!important;"
                                                                id="${dragModel.draggableElement}">
                                                                <div class="editor_item d-flex   px-2 my-0"
                                                                     style="background:white!important;">
                                                                    ${dd.label}
                                                                    <div class="flex-fill"></div>
                                                                    <i class="d-none fa-solid fa-pencil d-flex align-items-center justify-content-center subBt"
                                                                       style="width:20px;height:20px;"></i>
                                                                    <i class="d-none fa-solid fa-grip-dots-vertical d-flex align-items-center justify-content-center subBt"
                                                                       style="width:20px;height:20px;"></i>
                                                                </div>
                                                            </l1>`);
                            document.addEventListener("mouseup", mup_Linstener);
                            document.addEventListener("mousemove", move_Linstener);
                        })}">
                                                <i class="fa-solid fa-grip-dots-vertical d-flex align-items-center justify-content-center  "
                                                   style="width:15px;height:15px;"></i>
                                            </div>

                                        </div>
                                    </l1>` +
                            (() => {
                                if (dd.type === 'container') {
                                    if (dd.data.setting.length === 0) {
                                        return ``;
                                    }
                                    else {
                                        checkChildSelect(dd.data.setting);
                                        return `<l1 class="${(dd.toggle || (checkChildSelect(dd.data.setting))) ? `` : `d-none`}" style="padding-left:5px;">${this.renderLineItem(dd.data.setting.map((dd, index) => {
                                            dd.index = index;
                                            return dd;
                                        }), true, dd.data.setting, option)}</l1>`;
                                    }
                                }
                                else {
                                    return ``;
                                }
                            })();
                    }).join('');
                },
                divCreate: {
                    class: `d-flex flex-column ${(child) ? `` : ``} position-relative border-bottom`,
                },
                onDestroy: () => {
                }
            };
        });
    }
    static styleRender(gvc) {
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
                            return [
                                html `
                                    <div class="d-flex   px-2   hi fw-bold d-flex align-items-center border-bottom"
                                         style="font-size:14px;color:#da552f;">全域-STYLE
                                        <div class="flex-fill"></div>
                                        <l1 class="btn-group dropend" onclick="${gvc.event(() => {
                                    viewModel.selectContainer = viewModel.globalStyle;
                                })}">
                                            <div class="editor_item   px-2 me-0 d-none" style="cursor:pointer; "
                                                 onclick="${gvc.event(() => {
                                    viewModel.selectContainer = viewModel.globalStyle;
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
                                        </l1>
                                    </div>`,
                                new PageEditor(gvc, vid, docID).renderLineItem(viewModel.globalStyle.map((dd, index) => {
                                    dd.index = index;
                                    return dd;
                                }), false, viewModel.globalStyle, {
                                    copyType: 'directly'
                                }),
                                html `
                                    <div class="d-flex   px-2   hi fw-bold d-flex align-items-center border-bottom"
                                         style="color:#151515;font-size:14px;">頁面-STYLE
                                        <div class="flex-fill"></div>
                                        <l1 class="btn-group dropend" onclick="${gvc.event(() => {
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
                                    viewModel.data.config.push(data);
                                    gvc.notifyDataChange(vid);
                                })}
                                            </div>
                                        </l1>
                                    </div>`,
                                new PageEditor(gvc, vid, docID).renderLineItem(viewModel.data.config.filter((dd, index) => {
                                    dd.index = index;
                                    return dd.type === 'widget' && (dd.data.elem === 'style' || dd.data.elem === 'link');
                                }), false, viewModel.data.config, {
                                    copyType: 'directly'
                                }),
                            ].join('');
                        },
                        divCreate: {}
                    };
                }),
                right: gvc.bindView(() => {
                    return {
                        bind: docID,
                        view: () => {
                            if (viewModel.selectItem) {
                                return html `
                                    <div class="d-flex mx-n2 mt-n2 px-2 hi fw-bold d-flex align-items-center border-bottom border-top py-2 bgf6"
                                         style="color:#151515;font-size:16px;gap:0px;height:48px;">
                                        代碼區塊編輯
                                    </div>
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
                                            class: `p-2`, style: `overflow-y:auto;max-height:calc(100vh - 270px);`
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
                                    <div class=" d-flex border-top align-items-center mb-n1 py-2 pt-2 mx-n2 pe-3 bgf6"
                                         style="height:50px;">
                                        <div class="flex-fill"></div>
                                        <button class="btn btn-outline-secondary-c " style="height: 40px;width: 100px;"
                                                onclick="${gvc.event(() => {
                                    viewModel.globalStyle = viewModel.globalStyle.filter((dd) => {
                                        return dd !== viewModel.selectItem;
                                    });
                                    viewModel.data.config = viewModel.data.config.filter((dd) => {
                                        return dd !== viewModel.selectItem;
                                    });
                                    viewModel.selectItem = undefined;
                                    gvc.notifyDataChange([vid, docID]);
                                })}">
                                            <i class="fa-light fa-circle-minus me-2"></i>移除設計
                                        </button>
                                    </div>
                                `;
                            }
                            else {
                                return html `
                                    <div class="d-flex mx-n2 mt-n2 px-2 hi fw-bold d-flex align-items-center border-bottom border-top py-2 bgf6"
                                         style="color:#151515;font-size:16px;gap:0px;height:48px;">
                                        說明描述
                                    </div>
                                    <div class="d-flex flex-column w-100 align-items-center justify-content-center"
                                         style="height:calc(100% - 48px);">
                                        <lottie-player src="lottie/animation_uiux.json" class="mx-auto my-n4" speed="1"
                                                       style="max-width: 100%;width: 250px;height:300px;" loop
                                                       autoplay></lottie-player>
                                        <h3 class=" text-center px-4" style="font-size:18px;">透過設定CSS標籤和連結，來決定頁面的統一樣式。
                                            <div class="alert alert-info mt-3 mx-n3 p-2 text-start"
                                                 style="white-space: normal;font-size: 15px;font-weight: 500;">
                                                <p class="m-0">．全域資源在所有頁面皆會加載。</p>
                                                <p class="pt-1 m-0">．頁面資源僅會於本當前頁面中進行加載。</p>
                                            </div>
                                        </h3>
                                    </div>
                                `;
                            }
                        },
                        divCreate: () => {
                            return {
                                class: ` h-100 p-2 d-flex flex-column`, style: `width:500px;`
                            };
                        },
                        onCreate: () => {
                        }
                    };
                })
            });
        });
    }
    static valueRender(gvc) {
        var _a;
        const html = String.raw;
        const glitter = gvc.glitter;
        const viewModel = gvc.glitter.share.editorViewModel;
        const docID = glitter.getUUID();
        const vid = glitter.getUUID();
        viewModel.globalValue = (_a = viewModel.globalValue) !== null && _a !== void 0 ? _a : [];
        return new Promise((resolve, reject) => {
            resolve({
                left: gvc.bindView(() => {
                    return {
                        bind: vid,
                        view: () => {
                            return [
                                html `
                                    <div class="d-flex   px-2   hi fw-bold d-flex align-items-center border-bottom"
                                         style="font-size:14px;">共用資源管理
                                        <div class="flex-fill"></div>
                                        <l1 class="btn-group dropend" onclick="${gvc.event(() => {
                                    viewModel.selectContainer = viewModel.globalValue;
                                })}">
                                            <div class="editor_item   px-2 me-0 d-none" style="cursor:pointer; "
                                                 onclick="${gvc.event(() => {
                                    viewModel.selectContainer = viewModel.globalValue;
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
                                                <i class="fa-regular fa-circle-plus "></i>
                                            </div>
                                            <div class="dropdown-menu mx-1 position-fixed pb-0 border "
                                                 style="z-index:999999;"
                                                 onclick="${gvc.event((e, event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                })}">
                                                ${Add_item_dia.add_content_folder(gvc, (response) => {
                                    viewModel.globalValue.push(response);
                                    gvc.notifyDataChange(vid);
                                })}
                                            </div>
                                        </l1>
                                    </div>`,
                                new PageEditor(gvc, vid, docID).renderLineItem(viewModel.globalValue.map((dd, index) => {
                                    dd.index = index;
                                    return dd;
                                }), false, viewModel.globalValue, {
                                    addComponentView: Add_item_dia.add_content_folder,
                                    copyType: 'directly'
                                })
                            ].join('');
                        },
                        divCreate: {
                            style: `min-height:400px;`
                        },
                        onCreate: () => {
                            gvc.notifyDataChange(docID);
                        }
                    };
                }),
                right: gvc.bindView(() => {
                    return {
                        bind: docID,
                        view: () => {
                            if (viewModel.selectItem) {
                                return html `
                                    <div class="d-flex mx-n2 mt-n2 px-2 hi fw-bold d-flex align-items-center border-bottom border-top py-2 bgf6"
                                         style="color:#151515;font-size:16px;gap:0px;height:48px;">
                                        ${viewModel.selectItem.label}
                                    </div>
                                    ${gvc.bindView(() => {
                                    return {
                                        bind: `htmlGenerate`,
                                        view: () => {
                                            var _a;
                                            return EditorElem.editeInput({
                                                gvc: gvc,
                                                title: `${((viewModel.selectItem.type === 'container') ? `分類` : `參數`)}名稱`,
                                                default: (_a = viewModel.selectItem.label) !== null && _a !== void 0 ? _a : "",
                                                placeHolder: `請輸入${((viewModel.selectItem.type === 'container') ? `分類` : `參數`)}名稱`,
                                                callback: (text) => {
                                                    viewModel.selectItem.label = text;
                                                    gvc.notifyDataChange([vid, docID]);
                                                }
                                            }) + ((viewModel.selectItem.type === 'container') ? `` : (() => {
                                                var _a, _b, _c, _d;
                                                viewModel.selectItem.data.tagType = (_a = viewModel.selectItem.data.tagType) !== null && _a !== void 0 ? _a : "value";
                                                const data = [EditorElem.editeInput({
                                                        gvc: gvc,
                                                        title: `標籤名稱`,
                                                        default: (_b = viewModel.selectItem.data.tag) !== null && _b !== void 0 ? _b : "",
                                                        placeHolder: `請輸入標籤名`,
                                                        callback: (text) => {
                                                            viewModel.selectItem.data.tag = text;
                                                            gvc.notifyDataChange([vid, docID]);
                                                        }
                                                    }), EditorElem.select({
                                                        title: "資料類型",
                                                        gvc: gvc,
                                                        def: viewModel.selectItem.data.tagType,
                                                        array: [
                                                            {
                                                                title: '參數',
                                                                value: `value`
                                                            },
                                                            {
                                                                title: 'STYLE設計',
                                                                value: `style`
                                                            },
                                                            {
                                                                title: '檔案路徑',
                                                                value: `file`
                                                            }
                                                        ],
                                                        callback: (text) => {
                                                            viewModel.selectItem.data.tagType = text;
                                                            gvc.notifyDataChange([vid, docID]);
                                                        }
                                                    })];
                                                if (viewModel.selectItem.data.tagType === 'value') {
                                                    data.push(EditorElem.editeText({
                                                        gvc: gvc,
                                                        title: ``,
                                                        default: (_c = viewModel.selectItem.data.value) !== null && _c !== void 0 ? _c : "",
                                                        placeHolder: '請輸入參數內容',
                                                        callback: (text) => {
                                                            viewModel.selectItem.data.value = text;
                                                        }
                                                    }));
                                                }
                                                else if (viewModel.selectItem.data.tagType === 'style') {
                                                    data.push(`<div class="mt-2"></div>`);
                                                    data.push(EditorElem.styleEditor({
                                                        gvc: gvc,
                                                        height: 300,
                                                        initial: viewModel.selectItem.data.value,
                                                        title: '',
                                                        callback: (data) => {
                                                            viewModel.selectItem.data.value = data;
                                                        }
                                                    }));
                                                }
                                                else if (viewModel.selectItem.data.tagType === 'file') {
                                                    data.push(`<div class="mt-2"></div>`);
                                                    data.push(EditorElem.uploadFile({
                                                        gvc: gvc,
                                                        title: ``,
                                                        def: (_d = viewModel.selectItem.data.value) !== null && _d !== void 0 ? _d : "",
                                                        callback: (text) => {
                                                            viewModel.selectItem.data.value = text;
                                                            gvc.notifyDataChange([vid, docID]);
                                                        }
                                                    }));
                                                }
                                                return data.join('');
                                            })());
                                        },
                                        divCreate: {
                                            class: `p-2`, style: `overflow-y:auto;max-height:calc(100vh - 270px);`
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
                                    <div class=" d-flex border-top align-items-center mb-n1 py-2 pt-2 mx-n2 pe-3 bgf6"
                                         style="height:50px;">
                                        <div class="flex-fill"></div>
                                        <button class="btn btn-outline-secondary-c " style="height: 40px;width: 100px;"
                                                onclick="${gvc.event(() => {
                                    function checkValue(check) {
                                        let data = [];
                                        check.map((dd) => {
                                            var _a;
                                            if (dd.id !== viewModel.selectItem.id) {
                                                data.push(dd);
                                            }
                                            if (dd.type === 'container') {
                                                dd.data.setting = checkValue((_a = dd.data.setting) !== null && _a !== void 0 ? _a : []);
                                            }
                                        });
                                        return data;
                                    }
                                    viewModel.globalValue = checkValue(viewModel.globalValue);
                                    viewModel.selectItem = undefined;
                                    gvc.notifyDataChange([vid, docID]);
                                })}">
                                            <i class="fa-light fa-circle-minus me-2"></i>移除參數
                                        </button>
                                    </div>
                                `;
                            }
                            else {
                                return html `
                                    <div class="d-flex mx-n2 mt-n2 px-2 hi fw-bold d-flex align-items-center border-bottom border-top py-2 bgf6"
                                         style="color:#151515;font-size:16px;gap:0px;height:48px;">
                                        說明描述
                                    </div>
                                    <div class="d-flex flex-column w-100 align-items-center justify-content-center"
                                         style="height:calc(100% - 48px);">
                                        <lottie-player src="lottie/animation_data.json" class="mx-auto my-n4" speed="1"
                                                       style="max-width: 100%;width: 250px;height:300px;" loop
                                                       autoplay></lottie-player>
                                        <h3 class=" text-center px-4" style="font-size:18px;">透過設定共用資源，來決定頁面的統一內容。
                                            <div class="alert alert-info mt-3 mx-n3 p-2 text-start"
                                                 style="white-space: normal;font-size: 15px;font-weight: 500;">
                                                <p class="m-0">．使用 @{{value}}，在HTML特徵值中嵌入參數。</p>
                                                <p class="m-0 mt-2">．使用
                                                    glitter.share.globalValue[value]，在代碼中取得參數。</p>
                                            </div>
                                        </h3>
                                    </div>
                                `;
                            }
                        },
                        divCreate: () => {
                            return {
                                class: ` h-100 p-2 d-flex flex-column`, style: `width:400px;`
                            };
                        },
                        onCreate: () => {
                        }
                    };
                })
            });
        });
    }
    static scriptRender(gvc) {
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
                            return [
                                html `
                                    <div class="d-flex   px-2   hi fw-bold d-flex align-items-center border-bottom"
                                         style="font-size:14px;color:#da552f;">全域-SCRIPT
                                        <div class="flex-fill"></div>
                                        <l1 class="btn-group dropend" onclick="${gvc.event(() => {
                                    viewModel.selectContainer = viewModel.globalScript;
                                })}">
                                            <div class="editor_item   px-2 me-0 d-none" style="cursor:pointer; "
                                                 onclick="${gvc.event(() => {
                                    viewModel.selectContainer = viewModel.globalScript;
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
                                                <i class="fa-regular fa-circle-plus "></i>
                                            </div>
                                            <div class="dropdown-menu mx-1 position-fixed pb-0 border "
                                                 style="z-index:999999;"
                                                 onclick="${gvc.event((e, event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                })}">
                                                ${Add_item_dia.add_script(gvc, (data) => {
                                    viewModel.globalScript.push(data);
                                    gvc.notifyDataChange(vid);
                                })}
                                            </div>
                                        </l1>
                                    </div>`,
                                new PageEditor(gvc, vid, docID).renderLineItem(viewModel.globalScript.map((dd, index) => {
                                    dd.index = index;
                                    return dd;
                                }), false, viewModel.globalScript, {
                                    copyType: 'directly'
                                }),
                                html `
                                    <div class="d-flex   px-2   hi fw-bold d-flex align-items-center border-bottom"
                                         style="color:#151515;font-size:14px;">頁面-SCRIPT
                                        <div class="flex-fill"></div>
                                        <l1 class="btn-group dropend" onclick="${gvc.event(() => {
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
                                    viewModel.data.config.push(data);
                                    gvc.notifyDataChange(vid);
                                })}
                                            </div>
                                        </l1>
                                    </div>`,
                                new PageEditor(gvc, vid, docID).renderLineItem(viewModel.data.config.filter((dd, index) => {
                                    dd.index = index;
                                    return (dd.type === 'code') || dd.type === 'widget' && (dd.data.elem === 'script');
                                }), false, viewModel.data.config, {
                                    copyType: 'directly'
                                }),
                            ].join('');
                        },
                        divCreate: {}
                    };
                }),
                right: gvc.bindView(() => {
                    return {
                        bind: docID,
                        view: () => {
                            if (viewModel.selectItem) {
                                return html `
                                    <div class="d-flex mx-n2 mt-n2 px-2 hi fw-bold d-flex align-items-center border-bottom border-top py-2 bgf6"
                                         style="color:#151515;font-size:16px;gap:0px;height:48px;">
                                        觸發事件編輯
                                    </div>
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
                                            class: `p-2`, style: `overflow-y:auto;max-height:calc(100vh - 270px);`
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
                                    <div class=" d-flex border-top align-items-center mb-n1 py-2 pt-2 mx-n2 pe-3 bgf6"
                                         style="height:50px;">
                                        <div class="flex-fill"></div>
                                        <button class="btn btn-outline-secondary-c " style="height: 40px;width: 100px;"
                                                onclick="${gvc.event(() => {
                                    viewModel.globalScript = viewModel.globalScript.filter((dd) => {
                                        return dd !== viewModel.selectItem;
                                    });
                                    viewModel.data.config = viewModel.data.config.filter((dd) => {
                                        return dd !== viewModel.selectItem;
                                    });
                                    viewModel.selectItem = undefined;
                                    gvc.notifyDataChange([vid, docID]);
                                })}">
                                            <i class="fa-light fa-circle-minus me-2"></i>移除事件
                                        </button>
                                    </div>
                                `;
                            }
                            else {
                                return html `
                                    <div class="d-flex mx-n2 mt-n2 px-2 hi fw-bold d-flex align-items-center border-bottom border-top py-2 bgf6"
                                         style="color:#151515;font-size:16px;gap:0px;height:48px;">
                                        說明描述
                                    </div>
                                    <div class="d-flex flex-column w-100 align-items-center justify-content-center"
                                         style="height:calc(100% - 48px);">
                                        <lottie-player src="lottie/animation_cp.json" class="mx-auto my-n4" speed="1"
                                                       style="max-width: 100%;width: 250px;height:300px;" loop
                                                       autoplay></lottie-player>
                                        <h3 class=" text-center px-4" style="font-size:18px;">
                                            設定代碼區塊與資源連結，來決定頁面加載前後所需執行的項目。
                                            <div class="alert alert-info mt-3 mx-n3 p-2 text-start"
                                                 style="white-space: normal;font-size: 15px;font-weight: 500;">
                                                <p class="m-0">．全域資源在所有頁面皆會加載。</p>
                                                <p class="pt-1 m-0">．頁面資源僅會於本當前頁面中進行加載。</p>
                                            </div>
                                        </h3>
                                    </div>
                                `;
                            }
                        },
                        divCreate: () => {
                            return {
                                class: ` h-100 p-2 d-flex flex-column`, style: `width:350px;`
                            };
                        },
                        onCreate: () => {
                        }
                    };
                })
            });
        });
    }
    static pluginViewRender(gvc) {
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
                            return `
${EditorElem.arrayItem({
                                originalArray: viewModel.pluginList,
                                gvc: gvc,
                                customEditor: true,
                                title: '',
                                array: () => {
                                    return viewModel.pluginList.map((dd, index) => {
                                        return {
                                            title: `<span style="color: black;">${dd.name || `區塊:${index}`}</span>`,
                                            innerHtml: (() => {
                                                viewModel.selectItem = dd;
                                                gvc.notifyDataChange(docID);
                                            })
                                        };
                                    });
                                },
                                expand: undefined,
                                plus: {
                                    title: '頁面模塊',
                                    event: gvc.event(() => {
                                        viewModel.pluginList.push({
                                            name: '',
                                            route: '',
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
                                    viewModel.selectItem = viewModel.pluginList.find((dd) => {
                                        return dd === viewModel.selectItem;
                                    });
                                    gvc.notifyDataChange(id);
                                    gvc.notifyDataChange(docID);
                                }
                            })}`;
                        },
                        divCreate: {}
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
                                        <div class="alert alert-info m-2 p-3" style="white-space: normal;word-break: break-all;">頁面模塊決定您能夠在網站上使用哪些設計模塊。您可以從官方或第三方資源中獲取連結，或自行開發插件上傳以供使用。</div>
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
                                        <div class="alert alert-info mx-2 p-3" style="white-space: normal;word-break: break-all;">資源初始代碼會在頁面載入之前執行，通常處理一些基本配置行為，例如設定插件路徑與後端API路徑...等，這些初始化代碼會按照順序執行。</div>
                                    </div>
                                `;
                            }
                            return html `
                                <div class="d-flex ps-2 hi fw-bold d-flex align-items-center border-bottom border-top py-2 bgf6"
                                     style="color:#151515;font-size:16px;gap:0px;height:48px;">
                                    事件設定
                                </div>
                                <div class="p-2">  ${EditorElem.select({
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
                            })()} </div>`;
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
                            return [
                                EditorElem.arrayItem({
                                    gvc: gvc,
                                    title: '',
                                    array: () => {
                                        return dataList.map((dd) => {
                                            return {
                                                title: dd.label,
                                                innerHtml: () => {
                                                    vm.selectValue = dd;
                                                    gvc.notifyDataChange(docID);
                                                },
                                                saveAble: false
                                            };
                                        });
                                    },
                                    originalArray: dataList,
                                    expand: {},
                                    draggable: false,
                                    minus: false,
                                    copyable: false,
                                    refreshComponent: () => {
                                    },
                                    customEditor: true
                                })
                            ].join('');
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
                                    gvc.closeDialog();
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
                                class: ` h-100 p-2 d-flex flex-column`, style: `width:350px;`
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
                            viewModel.dataList.map((data, index) => {
                                if (!mapData.find((dd) => {
                                    return dd.label === (data.group || '未分類');
                                })) {
                                    mapData.push({
                                        type: 'container',
                                        label: (data.group || '未分類'),
                                        data: { setting: [] }
                                    });
                                }
                                data.label = data.name;
                                mapData.find((dd) => {
                                    return dd.label === (data.group || '未分類');
                                }).data.setting.push(data);
                            });
                            return new PageEditor(gvc, vid, docID).renderLineItem(mapData, false, mapData, {
                                copyType: 'directly',
                                readonly: true
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
                                })
                            ].map((dd) => {
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
        const viewModel = gvc.glitter.share.editorViewModel;
        return new Promise((resolve, reject) => {
            resolve({
                left: gvc.bindView(() => {
                    return {
                        bind: vid,
                        view: () => {
                            return questionText(`網域上架步驟`, [
                                {
                                    title: '步驟一：購買網域', content: `前往第三方網站購買網域，例如:<br>
                             -<a class="fw-bold mt-2" href="https://domain.hinet.net/#/" target="_blank">中華電信HiNet</a><br>
                             -<a class="fw-bold" href="https://tw.godaddy.com/" target="_blank">GoDaddy</a><br>
                             -<a class="fw-bold" href="https://aws.amazon.com/tw/route53/" target="_blank">AWS Router 53</a><br>
                             `
                                },
                                {
                                    title: '步驟二：更改DNS', content: `
                             前往DNS設定，並將A標籤設置為3.36.55.11。
                             `
                                },
                                {
                                    title: '步驟三：填寫網域名稱', content: `
                             請輸入您的網域名稱:${EditorElem.editeInput({
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
                                    title: '步驟四：部署網域', content: `<button type="button" class="btn btn-primary-c  w-100" style=""
onclick="${gvc.event(() => {
                                        const dialog = new ShareDialog(glitter);
                                        dialog.dataLoading({ text: '', visible: true });
                                        ApiPageConfig.setDomain(viewModel.domain).then((response) => {
                                            dialog.dataLoading({ text: '', visible: false });
                                            if (response.result) {
                                                gvc.closeDialog();
                                                dialog.successMessage({ text: "設定成功!" });
                                            }
                                            else {
                                                dialog.errorMessage({ text: "設定失敗，請確認網域所有權。" });
                                            }
                                        });
                                    })}"
>點我部署</button>`
                                }
                            ]);
                        },
                        divCreate: { class: `p-2 position-relative mx-n2 my-n2`, style: `width:400px;` }
                    };
                }),
                right: gvc.bindView(() => {
                    return {
                        bind: docID,
                        view: () => {
                            return questionText(`網域上架步驟`, [
                                {
                                    title: '步驟一', content: `前往第三方網站購買網域，例如:<br>
                             -<a class="fw-bold mt-2" href="https://domain.hinet.net/#/" target="_blank">中華電信HiNet</a><br>
                             -<a class="fw-bold" href="https://tw.godaddy.com/" target="_blank">GoDaddy</a><br>
                             -<a class="fw-bold" href="https://aws.amazon.com/tw/route53/" target="_blank">AWS Router 53</a><br>
                             `
                                },
                                {
                                    title: '步驟二', content: `
                             前往DNS設定，並將A標籤設置為3.36.55.11。
                             `
                                },
                                {
                                    title: '步驟三', content: `
                             於左側填入您的網域名稱，例如:<br>
                             <span class="fw-bold">glitter-ai.com</span><br>
                             <span class="fw-bold">liondesign.com</span>
                             `
                                },
                                {
                                    title: '步驟四', content: `
                             儲存並等待部署。
                             `
                                }
                            ]);
                        },
                        divCreate: () => {
                            return {
                                class: `d-none h-100 p-2 d-flex flex-column mx-n2 my-n2`,
                                style: `max-height:80vh;overflow-y:auto;overflow-x:hidden;width:350px;`
                            };
                        },
                        onCreate: () => {
                        }
                    };
                })
            });
        });
    }
}
PageEditor.openDialog = {
    page_config: (gvc) => {
        const viewModel = gvc.glitter.share.editorViewModel;
        viewModel.selectItem = undefined;
        gvc.glitter.innerDialog((gvc) => {
            let searchText = '';
            let searchInterval = 0;
            const id = gvc.glitter.getUUID();
            const vm = {
                select: "style"
            };
            return html `
                    <div class="bg-white rounded" style="max-height:90vh;">
                        <div class="d-flex w-100 border-bottom align-items-center" style="height:50px;">
                            <h3 style="font-size:15px;font-weight:500;" class="m-0 ps-3">
                                設定頁面配置</h3>
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
                            case "script":
                                PageEditor.scriptRender(gvc).then((data) => {
                                    contentVM.loading = false;
                                    contentVM.leftBar = data.left;
                                    contentVM.rightBar = data.right;
                                    gvc.notifyDataChange([contentVM.leftID, contentVM.rightID]);
                                });
                                break;
                            case "style":
                                PageEditor.styleRender(gvc).then((response) => {
                                    contentVM.loading = false;
                                    contentVM.leftBar = response.left;
                                    contentVM.rightBar = response.right;
                                    gvc.notifyDataChange([contentVM.leftID, contentVM.rightID]);
                                });
                                break;
                            case "value":
                                PageEditor.valueRender(gvc).then((response) => {
                                    contentVM.loading = false;
                                    contentVM.leftBar = response.left;
                                    contentVM.rightBar = response.right;
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
                                key: 'style',
                                label: "頁面樣式"
                            },
                            {
                                key: 'script',
                                label: "觸發事件"
                            },
                            {
                                key: 'value',
                                label: "全局資源"
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
                                PageEditor.pluginViewRender(gvc).then((data) => {
                                    contentVM.loading = false;
                                    contentVM.leftBar = data.left;
                                    contentVM.rightBar = data.right;
                                    gvc.notifyDataChange([contentVM.leftID, contentVM.rightID]);
                                });
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
        gvc.glitter.innerDialog((gvc) => {
            let searchText = '';
            let searchInterval = 0;
            const id = gvc.glitter.getUUID();
            const vm = {
                select: "official"
            };
            return html `
                    <div class="bg-white rounded" style="max-height:90vh;">
                        <div class="d-flex w-100 border-bottom align-items-center" style="height:50px;">
                            <h3 style="font-size:15px;font-weight:500;" class="m-0 ps-3">
                                選擇觸發事件</h3>
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
                                    style: `max-height:calc(90vh - 150px);height:490px;overflow-y:auto;`
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
        }, "event_config");
    },
    event_trigger_list: (gvc, left, right) => {
        const viewModel = gvc.glitter.share.editorViewModel;
        viewModel.selectItem = undefined;
        gvc.glitter.innerDialog((gvc) => {
            let searchText = '';
            let searchInterval = 0;
            const id = gvc.glitter.getUUID();
            const vm = {
                select: "official"
            };
            return html `
                    <div class="bg-white rounded" style="max-height:90vh;">
                        <div class="d-flex w-100 border-bottom align-items-center" style="height:50px;">
                            <h3 style="font-size:15px;font-weight:500;" class="m-0 ps-3">
                                事件叢集設定</h3>
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
                        return html `
                                                <div class="d-flex">
                                                    <div style="width:350px;" class="border-end">
                                                        ${gvc.bindView(() => {
                            return {
                                bind: gvc.glitter.getUUID(),
                                view: () => {
                                    return left;
                                },
                                divCreate: {
                                    class: ``,
                                    style: `max-height:calc(90vh - 150px);height:490px;overflow-y:auto;`
                                }
                            };
                        })}
                                                    </div>
                                                    ${gvc.bindView(() => {
                            return {
                                bind: gvc.glitter.getUUID(),
                                view: () => {
                                    return right;
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
                                SEO與網域設定</h3>
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
                            case "seo":
                                PageEditor.seoRender(gvc).then((data) => {
                                    contentVM.loading = false;
                                    contentVM.leftBar = data.left;
                                    contentVM.rightBar = data.right;
                                    gvc.notifyDataChange([contentVM.leftID, contentVM.rightID]);
                                });
                                break;
                            case "domain":
                                PageEditor.domainRender(gvc).then((response) => {
                                    contentVM.loading = false;
                                    contentVM.leftBar = response.left;
                                    contentVM.rightBar = response.right;
                                    gvc.notifyDataChange([contentVM.leftID, contentVM.rightID]);
                                });
                                break;
                            default:
                                break;
                        }
                        return html `
                                                <div class="d-flex">
                                                    <div style="min-width:300px;" class="border-end">
                                                        <div class="d-flex border-bottom ">
                                                            ${[
                            {
                                key: 'seo',
                                label: "SEO / 關鍵字"
                            },
                            {
                                key: 'domain',
                                label: "DOMAIN / 網域"
                            },
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
function questionText(title, data) {
    return `<div class="bg-secondary rounded-3 py-2 px-2 ">
          <h2 class="text-center my-3 mt-2" style="font-size:22px;">${title}</h2>
             <div class="accordion mx-2" id="faq">
                ${data.map((dd, index) => {
        return ` <div class="accordion-item border-0 rounded-3 shadow-sm mb-3">
                  <h3 class="accordion-header">
                    <button class="accordion-button shadow-none rounded-3 ${(index === 0) ? '' : 'collapsed'}" type="button" data-bs-toggle="collapse" data-bs-target="#q-${index}" aria-expanded="false" aria-controls="q-1">${dd.title}</button>
                  </h3>
                  <div class="accordion-collapse collapse ${(index === 0) ? 'show' : ''}" id="q-${index}" data-bs-parent="#faq" style="">
                    <div class="accordion-body fs-sm pt-0">
                     ${dd.content}
                    </div>
                  </div>
                </div>`;
    }).join('')}
              
              </div>
        </div>`;
}
