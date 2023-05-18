import { Swal } from "../modules/sweetAlert.js";
var ViewType;
(function (ViewType) {
    ViewType["mobile"] = "mobile";
    ViewType["desktop"] = "desktop";
})(ViewType || (ViewType = {}));
export class Main_editor {
    static left(gvc, viewModel, createID, gBundle) {
        const swal = new Swal(gvc);
        const glitter = gvc.glitter;
        return gvc.bindView(() => {
            let items = [];
            function addItems(dd, array, index2) {
                if (glitter.getCookieByName('lastSelect') === dd.id) {
                    viewModel.selectItem = dd;
                    viewModel.selectContainer = array;
                    viewModel.selectIndex = index2;
                }
                if (dd.type === 'container') {
                    return {
                        'text': dd.label, option: dd.data.setting.map((d4, index) => {
                            return addItems(d4, dd.data.setting, index);
                        }),
                        copy: () => {
                            viewModel.waitCopy = dd;
                            navigator.clipboard.writeText('glitter-copyEvent');
                            swal.toast({
                                icon: 'success',
                                title: "複製成功，選擇容器按下control+V即可貼上．"
                            });
                        },
                        click: () => {
                            if (viewModel.selectItem === dd) {
                                return;
                            }
                            glitter.setCookie('lastSelect', dd.id);
                            viewModel.selectItem = dd;
                            viewModel.selectContainer = dd.data.setting;
                            viewModel.selectIndex = 0;
                            gvc.notifyDataChange('showView');
                            gvc.notifyDataChange(['htmlGenerate', 'showView']);
                        },
                        minus: () => {
                            array.splice(index2, 1);
                            const index = ((viewModel.selectIndex - 1) > 0) ? viewModel.selectIndex - 1 : 0;
                            if (array[index]) {
                                glitter.setCookie('lastSelect', array[index].id);
                                viewModel.selectItem = array[index];
                                viewModel.selectIndex = index;
                                viewModel.selectContainer = array;
                            }
                            gvc.notifyDataChange(createID);
                        },
                        dataArray: array,
                        setting: dd.data.setting,
                        select: glitter.getCookieByName('lastSelect') === dd.id
                    };
                }
                else {
                    return {
                        'text': dd.label,
                        copy: () => {
                            viewModel.waitCopy = dd;
                            navigator.clipboard.writeText('glitter-copyEvent');
                            swal.toast({
                                icon: 'success',
                                title: "複製成功，選擇容器按下control+V即可貼上．"
                            });
                        },
                        click: () => {
                            if (viewModel.selectItem === dd) {
                                return;
                            }
                            viewModel.selectItem = dd;
                            viewModel.selectContainer = array;
                            viewModel.selectIndex = index2;
                            glitter.setCookie('lastSelect', dd.id);
                            gvc.notifyDataChange('showView');
                            gvc.notifyDataChange(['htmlGenerate', 'showView']);
                        },
                        minus: () => {
                            array.splice(index2, 1);
                            const index = ((viewModel.selectIndex - 1) > 0) ? viewModel.selectIndex - 1 : 0;
                            if (array[index]) {
                                glitter.setCookie('lastSelect', array[index].id);
                                viewModel.selectItem = array[index];
                                viewModel.selectIndex = index;
                                viewModel.selectContainer = array;
                            }
                            gvc.notifyDataChange(createID);
                        },
                        dataArray: array,
                        select: glitter.getCookieByName('lastSelect') === dd.id
                    };
                }
            }
            viewModel.data.config.map((d3, index) => {
                items.push(addItems(d3, viewModel.data.config, index));
            });
            items = [
                {
                    title: `排版設計 : ${viewModel.data.name}`,
                    option: items
                }
            ];
            const vid = glitter.getUUID();
            function clearSelect() {
                items.map((dd) => {
                    function clear(dd) {
                        dd.select = false;
                        if (dd.option) {
                            dd.option.map((d2) => {
                                clear(d2);
                            });
                        }
                    }
                    clear(dd);
                });
            }
            return {
                bind: vid,
                view: () => {
                    let html = '';
                    let dragm = {
                        start: 0,
                        end: 0,
                        div: ''
                    };
                    let indexCounter = 9999;
                    items.map((dd, index) => {
                        html += `<h3 class="fs-lg d-flex align-items-center">${dd.title}<button class="rounded-circle btn-warning  btn  ms-2 d-flex align-items-center justify-content-center p-0" style="height: 25px;width: 25px;"
onclick="${gvc.event(() => {
                            glitter.openDiaLog('dialog/caddDialog.js', 'caddDialog', {
                                callback: (data) => {
                                    viewModel.data.config.push(data);
                                    glitter.setCookie('lastSelect', data.id);
                                    gvc.notifyDataChange(createID);
                                },
                                appName: gBundle.appName
                            });
                        })}">
<i class="fa-sharp fa-solid fa-circle-plus " style="color: black;"></i>
</button>
</h3>
                                                    <ul class="list-group list-group-flush border-bottom pb-3 mb-4 mx-n4">
                                                        ${(() => {
                            function convertInner(d2, inner, parentCallback = () => {
                            }, dragOption) {
                                const hoverID = glitter.getUUID();
                                function checkOptionSelect(data) {
                                    if (data.select) {
                                        return true;
                                    }
                                    else if (data.option) {
                                        for (const a of data.option) {
                                            if (checkOptionSelect(a)) {
                                                data.select = true;
                                                return true;
                                            }
                                        }
                                    }
                                    return false;
                                }
                                let onMouselem = 'first';
                                if (d2.option) {
                                    const id = glitter.getUUID();
                                    const dragID2 = glitter.getUUID();
                                    return `<li class="list-group-item list-group-item-action border-0 py-2 px-4 ${checkOptionSelect(d2) ? `active` : ``} position-relative d-flex align-items-center"
                                                                    onclick="${gvc.event(() => {
                                        const needUpdate = d2.select;
                                        clearSelect();
                                        d2.select = true;
                                        $(`#${id}`).toggleClass('show');
                                        parentCallback();
                                        d2.click();
                                        gvc.notifyDataChange(['htmlGenerate', 'showView']);
                                        if (!needUpdate) {
                                            setTimeout(() => {
                                                gvc.notifyDataChange(vid);
                                            }, 250);
                                        }
                                    })}"
                                                                    style="cursor:pointer;z-index: ${indexCounter--} !important;"
                                                                     ondragover="${gvc.event((e, event) => {
                                        event.preventDefault();
                                    })}"
                                                            draggable="true"
                                                            ondragenter="${gvc.event((e, event) => {
                                        console.log('ondragenter-' + dragOption.index);
                                        if (dragm.div === dragOption.dragId) {
                                            dragm.end = dragOption.index;
                                        }
                                    })}"
                                                            ondragstart="${gvc.event(() => {
                                        dragm.start = dragOption.index;
                                        dragm.end = dragOption.index;
                                        dragm.div = dragOption.dragId;
                                    })}"
                                                            ondragend="${gvc.event(() => {
                                        dragOption.changeIndex(dragm.start, dragm.end);
                                    })}"
                                                            >
                                                                      ${d2.text}
                                                                      <button  class="rounded-circle btn-warning  btn  ms-2 d-flex align-items-center justify-content-center p-0" style="height: 25px;width: 25px;" onclick="${gvc.event((e, event) => {
                                        event.stopPropagation();
                                        glitter.openDiaLog('dialog/caddDialog.js', 'caddDialog', {
                                            callback: (data) => {
                                                d2.setting.push(data);
                                                glitter.setCookie('lastSelect', data.id);
                                                gvc.notifyDataChange(createID);
                                            },
                                            appName: gBundle.appName
                                        });
                                    })}">
<i class="fa-sharp fa-solid fa-circle-plus " style="color:black;" ></i>
</button>
<div class="flex-fill"></div>
<i class="fa-regular fa-copy me-2  ${d2.select ? `` : `d-none`}" onclick="${gvc.event((e, event) => {
                                        d2.copy();
                                    })}"></i>
<i class="fa-regular fa-trash-can ${d2.select ? `` : `d-none`}" style="color:white;" onclick="${gvc.event((e, event) => {
                                        event.stopPropagation();
                                        d2.minus();
                                    })}"></i>

                                                                     </li>
                                                                <ul class="collapse multi-collapse ${checkOptionSelect(d2) ? `show` : ''} position-relative ps-2" style="margin-left: 0px;" id="${id}">
                                                                    ${gvc.map(d2.option.map((d4, index) => {
                                        return convertInner(d4, true, () => {
                                            d2.select = true;
                                            parentCallback();
                                        }, {
                                            dragId: dragID2,
                                            index: index,
                                            changeIndex: (n1, n2) => {
                                                swapArr(d4.dataArray, n1, n2);
                                                swapArr(d2.option, n1, n2);
                                                gvc.notifyDataChange(vid);
                                                gvc.notifyDataChange('showView');
                                                gvc.notifyDataChange(['htmlGenerate', 'showView']);
                                                ;
                                            }
                                        });
                                    }))}
</ul>
                                                                    `;
                                }
                                else {
                                    return `<li class="align-items-center list-group-item list-group-item-action border-0 py-2 px-4 ${d2.select ? `${(inner) ? `bg-warning` : `active`}` : ``} position-relative d-flex"
                                                                    onclick="${gvc.event(() => {
                                        clearSelect();
                                        d2.select = true;
                                        parentCallback();
                                        gvc.notifyDataChange(vid);
                                        d2.click();
                                    })}"
                                                                    style="z-index: ${indexCounter--} !important;cursor:pointer;${(inner && d2.select) ? `background-color: #FFDC6A !important;color:black !important;` : ``}"
                                                                    ondragover="${gvc.event((e, event) => {
                                        event.preventDefault();
                                    })}"
                                                                    draggable="true"
                                                                    ondragenter="${gvc.event((e, event) => {
                                        console.log('ondragenter-' + dragOption.index);
                                        if (dragm.div === dragOption.dragId) {
                                            dragm.end = dragOption.index;
                                        }
                                    })}"
                                                            ondragstart="${gvc.event(() => {
                                        dragm.start = dragOption.index;
                                        dragm.end = dragOption.index;
                                        dragm.div = dragOption.dragId;
                                    })}"
                                                            ondragend="${gvc.event(() => {
                                        dragOption.changeIndex(dragm.start, dragm.end);
                                    })}"
                                                                 >${d2.text}
                                                                 <div class="flex-fill"></div>
                                                                 <i class="fa-regular fa-copy me-2  ${d2.select ? `` : `d-none`}" onclick="${gvc.event((e, event) => {
                                        d2.copy();
                                    })}"></i>
<i class="fa-regular fa-trash-can ${d2.select ? `` : `d-none`}" onclick="${gvc.event((e, event) => {
                                        event.stopPropagation();
                                        d2.minus();
                                    })}"></i>
                                                                 </li>`;
                                }
                            }
                            const dragid = glitter.getUUID();
                            return gvc.map(dd.option.map((d2, index) => {
                                return convertInner(d2, false, () => {
                                }, {
                                    dragId: dragid,
                                    index: index,
                                    changeIndex: (n1, n2) => {
                                        swapArr(d2.dataArray, n1, n2);
                                        swapArr(dd.option, n1, n2);
                                        gvc.notifyDataChange(vid);
                                        gvc.notifyDataChange('showView');
                                        gvc.notifyDataChange(['htmlGenerate', 'showView']);
                                    }
                                });
                            }));
                        })()}
                                                    </ul>`;
                    });
                    return html;
                },
                divCreate: {
                    class: `swiper-slide h-auto`,
                },
                onCreate: () => {
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
                    const htmlGenerate = new glitter.htmlGenerate(viewModel.data.config, hoverList);
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
    static center(viewModel, gvc) {
        if (viewModel.type === ViewType.mobile) {
            return `<div class="d-flex align-items-center justify-content-center flex-column mx-auto" style="width: 414px;height: calc(100vh - 20px);padding-top: 0px;">
                 <div class="bg-white" style="width:414px;height: calc(100% - 60px);">
                 <iframe class="w-100 h-100 rounded" src="index.html?type=htmlEditor&page=${gvc.glitter.getUrlParameter('page')}"></iframe>
                </div></div>`;
        }
        else {
            return `<div class="d-flex align-items-center justify-content-center flex-column" style="width: calc(100% - 20px);margin-left:10px;height: calc(100vh - 20px);padding-top: 20px;">
                 <div class="bg-white" style="width:100%;height: calc(100% - 50px);">
                 <iframe class="w-100 h-100 rounded" src="index.html?type=htmlEditor&page=${gvc.glitter.getUrlParameter('page')}"></iframe>
                </div></div>`;
        }
    }
}
Main_editor.index = '0';
function swapArr(arr, index1, index2) {
    const data = arr[index1];
    arr.splice(index1, 1);
    arr.splice(index2, 0, data);
}
