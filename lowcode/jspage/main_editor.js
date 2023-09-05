import { Swal } from "../modules/sweetAlert.js";
import Add_item_dia from "../editor/add_item_dia.js";
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
            glitter.debugMode = true;
            const vid = glitter.getUUID();
            return {
                bind: vid,
                view: () => {
                    function checkSelect(array) {
                        array.map((dd) => {
                            if (dd.id === glitter.getCookieByName('lastSelect')) {
                                viewModel.selectContainer = array;
                                viewModel.selectItem = dd;
                            }
                            else if (Array.isArray(dd.data.setting)) {
                                checkSelect(dd.data.setting);
                            }
                        });
                    }
                    checkSelect(viewModel.data.config);
                    if ((glitter.getCookieByName("ViewType") === ViewType.col3)) {
                        gvc.notifyDataChange('right_NAV');
                    }
                    if (viewModel.selectItem && (glitter.getCookieByName("ViewType") !== ViewType.col3)) {
                        return Main_editor.editorContent(gvc, viewModel, vid);
                    }
                    else {
                        return html `
                            <li class="align-items-center position-relative d-flex editor_item_title"
                                onclick="${gvc.event(() => {
                        })}"
                            >${viewModel.data.name}
                            </li>
                            ${(() => {
                            function render(array, child, original) {
                                const parId = gvc.glitter.getUUID();
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
                                                    gvc.notifyDataChange(vid);
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
                                                    gvc.notifyDataChange(['htmlGenerate', 'showView', vid]);
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
                                                                                <div class="d-flex align-items-center justify-content-center w-100 h-100"
                                                                                   onclick="${gvc.event(() => {
                                                    glitter.innerDialog((gvc) => {
                                                        viewModel.selectContainer = dd.data.setting;
                                                        return Add_item_dia.view(gvc);
                                                    }, 'Add_item_dia');
                                                })}">
                                                                                    <i class="fa-regular fa-circle-plus d-flex align-items-center justify-content-center subBt"></i>
                                                                                </div>
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
                                                                return `<l1 class="${(dd.toggle || (checkChildSelect(dd.data.setting))) ? `` : `d-none`}" style="padding-left:20px;">${render(dd.data.setting.map((dd, index) => {
                                                                    dd.index = index;
                                                                    return dd;
                                                                }), true, dd.data.setting)}</l1>`;
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
                            return gvc.map([
                                html `
                                        <div class="d-flex ms-2  px-2   hi fw-bold d-flex align-items-center border-bottom"
                                             style="color:#da552f;font-size:14px;">全域-STYLE
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
                                                    ${Add_item_dia.add_style(gvc)}
                                                </div>
                                            </l1>
                                        </div>`,
                                render(viewModel.globalStyle.map((dd, index) => {
                                    dd.index = index;
                                    return dd;
                                }), false, viewModel.globalStyle),
                                html `
                                        <div class="d-flex ms-2  px-2   hi fw-bold d-flex align-items-center border-bottom "
                                             style="color:#da552f;font-size:14px;">全域-SCRIPT
                                            <div class="flex-fill"></div>
                                            <l1 class="btn-group dropend" onclick="${gvc.event(() => {
                                    viewModel.selectContainer = viewModel.globalScript;
                                })}">
                                                <div class="editor_item  d-none px-2 me-0" style="cursor:pointer; "
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
                                                    <i class="fa-regular fa-circle-plus"></i>
                                                </div>
                                                <div class="dropdown-menu mx-1 position-fixed pb-0 border "
                                                     style="z-index:999999;"
                                                     onclick="${gvc.event((e, event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                })}">
                                                    ${Add_item_dia.add_script(gvc)}
                                                </div>
                                            </l1>
                                        </div>`,
                                render(viewModel.globalScript.map((dd, index) => {
                                    dd.index = index;
                                    return dd;
                                }), false, viewModel.globalScript),
                                html `
                                        <div class="d-flex ms-2  px-2   hi fw-bold d-flex align-items-center border-bottom"
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
                                                    ${Add_item_dia.add_style(gvc)}
                                                </div>
                                            </l1>
                                        </div>`,
                                render(viewModel.data.config.filter((dd, index) => {
                                    dd.index = index;
                                    return dd.type === 'widget' && (dd.data.elem === 'style' || dd.data.elem === 'link');
                                }), false, viewModel.data.config),
                                html `
                                        <div class="d-flex ms-2  px-2   hi fw-bold d-flex align-items-center border-bottom"
                                             style="color:#151515;font-size:14px;">頁面-SCRIPT
                                            <div class="flex-fill"></div>
                                            <l1 class="btn-group dropend" onclick="${gvc.event(() => {
                                    viewModel.selectContainer = viewModel.data.config;
                                })}">
                                                <div class="editor_item d-none  px-2 me-0" style="cursor:pointer; "
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
                                                    ${Add_item_dia.add_script(gvc)}
                                                </div>
                                            </l1>
                                        </div>`,
                                render(viewModel.data.config.filter((dd, index) => {
                                    dd.index = index;
                                    return (dd.type === 'code') || dd.type === 'widget' && (dd.data.elem === 'script');
                                }), false, viewModel.data.config),
                                html `
                                        <div class="d-flex ms-2  px-2   hi fw-bold d-flex align-items-center border-bottom"
                                             style="color:#151515;font-size:14px;gap:0px;">頁面-區段
                                            <div class="flex-fill"></div>
                                            <l1 class="btn-group dropend me-0" onclick="${gvc.event(() => {
                                    viewModel.selectContainer = viewModel.data.config;
                                })}">
                                                <div class="editor_item d-none  px-2 me-0" style="cursor:pointer; "
                                                     onclick="${gvc.event(() => {
                                    viewModel.selectContainer = viewModel.data.config;
                                    glitter.share.pastEvent();
                                })}">
                                                    <i class="fa-duotone fa-paste"></i>
                                                </div>
                                                <div class="editor_item   px-2 ms-0 me-n1"
                                                     style="cursor:pointer;gap:5px;" onclick="${gvc.event(() => {
                                    viewModel.selectContainer = viewModel.data.config;
                                    gvc.glitter.innerDialog((gvc) => {
                                        return Add_item_dia.view(gvc);
                                    }, 'Add_Item');
                                })}">
                                                    <i class="fa-regular fa-circle-plus"></i>
                                                </div>
                                            </l1>
                                        </div>`,
                                render(viewModel.data.config.filter((dd, index) => {
                                    dd.index = index;
                                    return (dd.type !== 'code') && (dd.type !== 'widget' || (dd.data.elem !== 'style' && dd.data.elem !== 'link' && dd.data.elem !== 'script'));
                                }), false, viewModel.data.config)
                            ]);
                        })()}
                        `;
                    }
                },
                divCreate: { class: `swiper-slide h-100 ` },
                onCreate: () => {
                    function check() {
                        if (!viewModel.data) {
                            setTimeout(() => {
                                check();
                            }, 1000);
                        }
                        else {
                            const htmlGenerate = new gvc.glitter.htmlGenerate(viewModel.data.config, [], undefined, true);
                            window.editerData = htmlGenerate;
                            window.page_config = viewModel.data.page_config;
                            gvc.notifyDataChange('showView');
                        }
                    }
                    check();
                }
            };
        });
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
                    const htmlGenerate = new glitter.htmlGenerate(viewModel.data.config, hoverList, undefined, true);
                    window.editerData = htmlGenerate;
                    window.page_config = viewModel.data.page_config;
                    const json = JSON.parse(JSON.stringify(viewModel.data.config));
                    json.map((dd) => {
                        dd.refreshAllParameter = undefined;
                        dd.refreshComponentParameter = undefined;
                    });
                    if (!viewModel.selectItem) {
                        return `<div class="position-absolute w-100 top-50 d-flex align-items-center justify-content-center flex-column translate-middle-y">
<iframe src="https://embed.lottiefiles.com/animation/84663" class="w-100" style="width: 400px;height: 400px"></iframe>
<h3>請於左側選擇元件編輯</h3>
</div>`;
                    }
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
                        }
                    });
                },
                divCreate: {},
                onCreate: () => {
                    setTimeout(() => {
                        var _a;
                        $('#jumpToNav').scrollTop((_a = parseInt(glitter.getCookieByName('jumpToNavScroll'), 10)) !== null && _a !== void 0 ? _a : 0);
                    }, 1000);
                }
            };
        });
    }
    static editorContent(gvc, viewModel, vid) {
        const glitter = gvc.glitter;
        if (viewModel.selectItem === undefined) {
            return `<div class="position-absolute w-100 top-50 d-flex align-items-center justify-content-center flex-column translate-middle-y">
<img class="border" src="https://liondesign-prd.s3.amazonaws.com/file/252530754/1692927479829-Screenshot 2023-08-25 at 9.36.15 AM.png"  >
<lottie-player src="https://lottie.host/23df5e29-6a51-428a-b112-ff6901c4650e/yxNS0Bw8mk.json" class="position-relative" background="transparent" speed="1" style="margin-top:-70px;" loop  autoplay direction="1" mode="normal"></lottie-player>
<div style="font-size:16px;margin-top:-10px;width:calc(100% - 20px);word-break:break-all !important;display:inline-block;white-space:normal;" class="p-2 text-center alert alert-secondary" >
請直接點擊頁面元件，或於左側頁面區段來選擇元件進行編輯。</div>
</div>`;
        }
        return [html `
            <div class="h-100 " style="overflow-y:auto;">
                <div class="w-100 d-flex align-items-center px-3 border-bottom ${(vid) ? `` : `d-none`}"
                     style="height:49px;color:#151515;">
                    <i class="fa-regular fa-chevron-left me-2 hoverBtn" style="cursor:pointer;"
                       onclick="${gvc.event(() => {
                glitter.setCookie('lastSelect', '');
                viewModel.selectItem = undefined;
                gvc.notifyDataChange(vid);
            })}"></i>
                    <span class="fw-bold" style="font-size:15px;">${viewModel.selectItem.label}</span>
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
                        class: `p-2`
                    },
                    onCreate: () => {
                        setTimeout(() => {
                            var _a;
                            $('#jumpToNav').scrollTop((_a = parseInt(glitter.getCookieByName('jumpToNavScroll'), 10)) !== null && _a !== void 0 ? _a : 0);
                        }, 1000);
                    }
                };
            })}
                <div class="w-100" style="height:50px;"></div>
            </div>
        `,
            html `
                <div class="w-100  position-absolute bottom-0 border-top d-flex align-items-center ps-3"
                     style="height:50px;background:#f6f6f6;font-size:14px;">
                    <div class="hoverBtn fw-bold" style="color:#8e1f0b;cursor:pointer;"
                         onclick="${gvc.event(() => {
                for (let a = 0; a < viewModel.selectContainer.length; a++) {
                    if (viewModel.selectContainer[a] == viewModel.selectItem) {
                        viewModel.selectContainer.splice(a, 1);
                    }
                }
                viewModel.selectItem = undefined;
                gvc.notifyDataChange(['HtmlEditorContainer']);
            })}">
                        <i class="fa-solid fa-trash-can me-2"></i>移除區塊
                    </div>
                </div>`].join('');
    }
    static center(viewModel, gvc) {
        return html `
            <div class="${(viewModel.type === ViewType.mobile) ? `d-flex align-items-center justify-content-center flex-column mx-auto` : `d-flex align-items-center justify-content-center flex-column`}"
                 style="${(viewModel.type === ViewType.mobile) ? `width: 414px;height: calc(100vh - 50px);padding-top: 20px;` : `width: calc(100% - 20px);margin-left:10px;height: calc(100vh - 50px);padding-top: 20px;"`}">
                <div class="bg-white" style="width:100%;height: calc(100%);">
                    <iframe class="w-100 h-100 rounded"
                            src="index.html?type=htmlEditor&page=${gvc.glitter.getUrlParameter('page')}"></iframe>
                </div>
            </div>`;
    }
}
Main_editor.index = '0';
function swapArr(arr, index1, index2) {
    const data = arr[index1];
    arr.splice(index1, 1);
    arr.splice(index2, 0, data);
}
