import Add_item_dia from "../editor/add_item_dia.js";
import { Swal } from "../modules/sweetAlert.js";
import { EditorElem } from "../glitterBundle/plugins/editor-elem.js";
import { ShareDialog } from "../glitterBundle/dialog/ShareDialog.js";
const html = String.raw;
export class PageEditor {
    constructor(gvc, vid, editorID = '') {
        this.gvc = gvc;
        this.vid = vid;
        this.editorID = editorID;
    }
    renderLineItem(array, child, original, option = {}) {
        const gvc = this.gvc;
        console.log(`gvc--`, gvc);
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
                function swapArr(arr, index1, index2) {
                    const data = arr[index1];
                    arr.splice(index1, 1);
                    arr.splice(index2, 0, data);
                }
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
                return 34 * index - 17;
            }), off);
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
                            gvc.notifyDataChange(parId);
                            event.preventDefault();
                            event.stopPropagation();
                        });
                        return html `
                                    <l1 class="btn-group "
                                        style="margin-top:1px;margin-bottom:1px;">
                                        <div class="editor_item d-flex   px-2 my-0 hi me-n1 ${(viewModel.selectItem === dd) ? `active` : ``}"
                                             style=""
                                             onclick="${gvc.event(() => {
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
                                                                                    <div class=""
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
                                                                                ` : ` <div class="d-flex align-items-center justify-content-center w-100 h-100"
                                                                                   onclick="${gvc.event(() => {
                            glitter.innerDialog((gvc) => {
                                viewModel.selectContainer = dd.data.setting;
                                return Add_item_dia.view(gvc);
                            }, 'Add_item_dia');
                        })}">
                                                                                    <i class="fa-regular fa-circle-plus d-flex align-items-center justify-content-center subBt"></i>
                                                                                </div>`}
                                                                               
                                                                            </l1>` : ``}
                                            <div class="subBt" onclick="${gvc.event((e, event) => {
                            viewModel.selectContainer = array;
                            viewModel.waitCopy = dd;
                            glitter.share.copycomponent = JSON.stringify(viewModel.waitCopy);
                            navigator.clipboard.writeText(JSON.stringify(viewModel.waitCopy));
                            swal.toast({
                                icon: 'success',
                                title: "已複製至剪貼簿，選擇新增模塊來添加項目．"
                            });
                            event.stopPropagation();
                        })}">
                                                <i class="fa-sharp fa-regular fa-scissors d-flex align-items-center justify-content-center subBt"
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

                                            <div class="subBt" onmousedown="${gvc.event((e, event) => {
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
                                dragModel.hover_item.push({
                                    elem: $(this),
                                    offsetTop: $(this).get(0).offsetTop
                                });
                            });
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
                                        function checkChildSelect(setting) {
                                            for (const b of setting) {
                                                if (b === viewModel.selectItem) {
                                                    return true;
                                                }
                                                if (b.data.setting && checkChildSelect(b.data.setting)) {
                                                    return true;
                                                }
                                            }
                                            return false;
                                        }
                                        checkChildSelect(dd.data.setting);
                                        return `<l1 class="${(dd.toggle || (checkChildSelect(dd.data.setting))) ? `` : `d-none`}" style="padding-left:20px;">${this.renderLineItem(dd.data.setting.map((dd, index) => {
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
                                }), false, viewModel.globalStyle),
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
                                }), false, viewModel.data.config),
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
                                    viewModel.globalStyle = viewModel.globalStyle.filter((dd) => { return dd !== viewModel.selectItem; });
                                    viewModel.data.config = viewModel.data.config.filter((dd) => { return dd !== viewModel.selectItem; });
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
                            <div class="d-flex flex-column w-100 align-items-center justify-content-center" style="height:calc(100% - 48px);">
                                <lottie-player src="lottie/animation_uiux.json"    class="mx-auto my-n4" speed="1"   style="max-width: 100%;width: 250px;height:300px;"  loop  autoplay></lottie-player>
                                <h3 class=" text-center px-4" style="font-size:18px;">透過設定CSS標籤和連結，來決定頁面的統一樣式。
                                <div class="alert alert-info mt-3 mx-n3 p-2 text-start" style="white-space: normal;font-size: 15px;font-weight: 500;">
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
                             style="font-size:14px;">共用參數管理
                            <div class="flex-fill"></div>
                            <l1 class="btn-group dropend" onclick="${gvc.event(() => {
                                    viewModel.selectContainer = viewModel.globalStyle;
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
                                }), false, viewModel.globalValue, { addComponentView: Add_item_dia.add_content_folder })
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
                                ${viewModel.selectItem.label}
                            </div>
                           ${gvc.bindView(() => {
                                    return {
                                        bind: `htmlGenerate`,
                                        view: () => {
                                            var _a, _b;
                                            return EditorElem.editeInput({
                                                gvc: gvc,
                                                title: `${((viewModel.selectItem.type === 'container') ? `分類` : `參數`)}名稱`,
                                                default: (_a = viewModel.selectItem.label) !== null && _a !== void 0 ? _a : "",
                                                placeHolder: `請輸入${((viewModel.selectItem.type === 'container') ? `分類` : `參數`)}名稱`,
                                                callback: (text) => {
                                                    viewModel.selectItem.label = text;
                                                    gvc.notifyDataChange([vid, docID]);
                                                }
                                            }) + ((viewModel.selectItem.type === 'container') ? `` : EditorElem.editeText({
                                                gvc: gvc,
                                                title: `參數內容`,
                                                default: (_b = viewModel.selectItem.data.value) !== null && _b !== void 0 ? _b : "",
                                                placeHolder: '請輸入參數內容',
                                                callback: (text) => {
                                                    viewModel.selectItem.data.value = text;
                                                }
                                            }));
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
                                            if (dd !== viewModel.selectItem) {
                                                data.push(dd);
                                            }
                                            else if (dd.type === 'container') {
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
                            <div class="d-flex flex-column w-100 align-items-center justify-content-center" style="height:calc(100% - 48px);">
                                <lottie-player src="lottie/animation_data.json"    class="mx-auto my-n4" speed="1"   style="max-width: 100%;width: 250px;height:300px;"  loop  autoplay></lottie-player>
                                <h3 class=" text-center px-4" style="font-size:18px;">透過設定共用參數，來決定頁面的統一內容。
                                <div class="alert alert-info mt-3 mx-n3 p-2 text-start" style="white-space: normal;font-size: 15px;font-weight: 500;">
                                    <p class="m-0">．使用  @{{value}}  來嵌入參數。</p>
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
                                html `<div class="d-flex   px-2   hi fw-bold d-flex align-items-center border-bottom"
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
                                }), false, viewModel.globalScript),
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
                                }), false, viewModel.data.config),
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
                                設計代碼編輯
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
                                    viewModel.globalStyle = viewModel.globalStyle.filter((dd) => { return dd !== viewModel.selectItem; });
                                    viewModel.data.config = viewModel.data.config.filter((dd) => { return dd !== viewModel.selectItem; });
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
                            <div class="d-flex flex-column w-100 align-items-center justify-content-center" style="height:calc(100% - 48px);">
                                <lottie-player src="lottie/animation_cp.json"    class="mx-auto my-n4" speed="1"   style="max-width: 100%;width: 250px;height:300px;"  loop  autoplay></lottie-player>
                                <h3 class=" text-center px-4" style="font-size:18px;">設定代碼區塊與資源連結，來決定頁面加載前後所需執行的項目。
                                    <div class="alert alert-info mt-3 mx-n3 p-2 text-start" style="white-space: normal;font-size: 15px;font-weight: 500;">
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
                new ShareDialog(gvc.glitter).checkYesOrNot({
                    text: '是否儲存更改內容?',
                    callback: (result) => {
                        if (result) {
                            gvc.glitter.htmlGenerate.saveEvent();
                        }
                        gvc.closeDialog();
                    }
                });
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
                                label: "STYLE"
                            },
                            {
                                key: 'script',
                                label: "SCRIPT"
                            },
                            {
                                key: 'value',
                                label: "VALUE"
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
        }, "EditItem");
    }
};
;
