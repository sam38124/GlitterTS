import {GVC} from "../glitterBundle/GVController.js";
import {Swal} from "../modules/sweetAlert.js";
import {Lan} from "./language.js";

enum ViewType {
    mobile = "mobile",
    desktop = "desktop"
}

export class Main_editor {
    public static left(gvc: GVC, viewModel: any, createID: string, gBundle: any) {

        const swal = new Swal(gvc);
        const glitter = gvc.glitter
        return gvc.bindView(() => {
            let items: any[] = [];
            let styleItems: any[] = []
            let scriptItems: any[] = []
            let filterID: string[] = []
            let triggerItems: any[] = []

            function addItems(dd: any, array: any, index2: number) {
                if (filterID.indexOf(dd.id) !== -1) {
                    dd.id = glitter.getUUID()
                }
                filterID.push(dd.id)
                if (glitter.getCookieByName('lastSelect') === dd.id) {
                    viewModel.selectItem = dd;
                    viewModel.selectContainer = array
                    viewModel.selectIndex = index2
                }
                if (dd.type === 'container') {
                    const option = dd.data.setting.map((d4: any, index: number) => {
                        d4.index = index
                        return addItems(d4, dd.data.setting, index);
                    })
                    return {
                        'text': dd.label, option: option,
                        copy: () => {
                            viewModel.waitCopy = dd
                            navigator.clipboard.writeText('glitter-copyEvent' + JSON.stringify(viewModel.waitCopy));
                            swal.toast({
                                icon: 'success',
                                title: "複製成功，選擇容器按下control+V即可貼上．"
                            })
                        },
                        click: () => {
                            if (viewModel.selectItem === dd) {
                                return
                            }
                            glitter.setCookie('lastSelect', dd.id);
                            viewModel.selectItem = dd;
                            viewModel.selectContainer = dd.data.setting
                            viewModel.selectIndex = 0
                            gvc.notifyDataChange('showView');
                            gvc.notifyDataChange(['htmlGenerate', 'showView']);
                        },
                        minus: () => {
                            array.splice(index2, 1)
                            const index = ((viewModel.selectIndex - 1) > 0) ? viewModel.selectIndex - 1 : 0
                            if (array[index]) {
                                glitter.setCookie('lastSelect', array[index].id);
                                viewModel.selectItem = array[index];
                                viewModel.selectIndex = index
                                viewModel.selectContainer = array
                            }
                            gvc.notifyDataChange(createID)
                        },
                        dataArray: array,
                        changeIndex: (index: number) => {
                            dd.index = index
                        },
                        index: dd.index,
                        setting: dd.data.setting,
                        select: glitter.getCookieByName('lastSelect') === dd.id
                    };
                } else {
                    return {
                        'text': dd.label,
                        index: dd.index,
                        copy: () => {
                            viewModel.waitCopy = dd
                            navigator.clipboard.writeText('glitter-copyEvent' + JSON.stringify(viewModel.waitCopy));
                            swal.toast({
                                icon: 'success',
                                title: "複製成功，選擇容器按下control+V即可貼上．"
                            })
                        },
                        click: () => {
                            if (viewModel.selectItem === dd) {
                                return
                            }
                            viewModel.selectItem = dd;
                            viewModel.selectContainer = array
                            viewModel.selectIndex = index2
                            glitter.setCookie('lastSelect', dd.id);
                            gvc.notifyDataChange('showView');
                            gvc.notifyDataChange(['htmlGenerate', 'showView']);
                        },
                        minus: () => {
                            array.splice(index2, 1)
                            const index = ((viewModel.selectIndex - 1) > 0) ? viewModel.selectIndex - 1 : 0
                            if (array[index]) {
                                glitter.setCookie('lastSelect', array[index].id);
                                viewModel.selectItem = array[index];
                                viewModel.selectIndex = index
                                viewModel.selectContainer = array
                            }
                            gvc.notifyDataChange(createID)
                        },
                        dataArray: array,
                        changeIndex: (index: number) => {
                            dd.index = index
                        },
                        select: glitter.getCookieByName('lastSelect') === dd.id
                    };
                }
            }

            (viewModel.data! as any).config.map((d3: any, index: number) => {
                if (d3) {
                    d3.index = index
                    if (d3.data && ((d3.data.elem === 'style') || ((d3.data.elem === 'link') && (d3.data.attr.find((dd: any) => {
                        return dd.attr === 'rel' && dd.value === 'stylesheet'
                    }))))) {
                        styleItems.push(addItems(d3, (viewModel.data! as any).config, index))
                    } else if (d3.data && ((d3.data.elem === 'script'))) {
                        scriptItems.push(addItems(d3, (viewModel.data! as any).config, index));
                    } else if (d3.data && ((d3.type === 'code'))) {
                        triggerItems.push(addItems(d3, (viewModel.data! as any).config, index));
                    } else {
                        items.push(addItems(d3, (viewModel.data! as any).config, index));
                    }
                }
            });
            let selectType = glitter.getUrlParameter('selectEditTP') ?? "html"
            items = [
                {
                    title: ``,
                    option: [],
                    html: (() => {
                        return `<li class=" align-items-center list-group-item list-group-item-action border-0 py-2 px-4  position-relative d-flex text-dark shadow" style=""
><div class="d-flex align-items-center pt-2 text-gradient-primary justify-content-between w-100" style="">
${[
                            {
                                title: `style`, class: `fa-regular fa-pen-fancy-slash`, onclick: gvc.event(() => {
                                    glitter.setUrlParameter('selectEditTP', 'style')
                                    gvc.notifyDataChange(createID)
                                })
                            },
                            {
                                title: `script`, class: `fa-solid fa-code`, onclick: gvc.event(() => {
                                    glitter.setUrlParameter('selectEditTP', 'script')
                                    gvc.notifyDataChange(createID)
                                })
                            }
                            , {
                                title: `html`, class: `fa-regular fa-file-code`, onclick: gvc.event(() => {
                                    glitter.setUrlParameter('selectEditTP', 'html')
                                    gvc.notifyDataChange(createID)
                                })
                            }
                        ].map((dd: any) => {
                            if(selectType===dd.title){
                                return `<div class="rounded-circle p-2 " style="width:60px;height:60px;border: 2px dashed;
border-color:#D946EF;"><div class="d-flex flex-column align-items-center justify-content-center" onclick="${dd.onclick}">
<i class="${dd.class}"></i>
${dd.title}
</div></div>`
                            }else{
                                return `<div class="d-flex flex-column align-items-center justify-content-center" onclick="${dd.onclick}">
<i class="${dd.class}"></i>
${dd.title}
</div>`
                            }
                           
                        }).join('<div style="height:40px;width:1px;background:lightgrey;"></div>')}

</div>
</li>`
                    })()
                },
                {
                    title: `排版設計`,
                    option: styleItems,
                    html: (() => {
                        let toggle = glitter.getCookieByName('groupG-1') === "true"
                        return `<li class=" align-items-center list-group-item list-group-item-action border-0 py-2 px-4  position-relative d-flex text-dark" style="background:lightgrey;"
onclick="${gvc.event(() => {
                            glitter.setCookie('lastSelect', '');
                            viewModel.selectItem = undefined
                            viewModel.selectContainer = (viewModel.data! as any).config
                            gvc.notifyDataChange(createID)
                        })}"
>Style 設計樣式<button class="rounded-circle btn-warning  btn  ms-2 d-flex align-items-center justify-content-center p-0" style="height: 25px;width: 25px;" onclick="${gvc.event((e, event) => {
                            event.stopPropagation();
                            glitter.setCookie('groupG-1', 'true')
                            glitter.openDiaLog('dialog/cadd-style-Dialog.js', 'caddStyleDialog', {
                                callback: (data: any) => {
                                    (viewModel.data! as any).config.push(data);
                                    glitter.setCookie('lastSelect', data.id);
                                    gvc.notifyDataChange(createID)
                                },
                                appName: gBundle.appName
                            });
                        })}">
<i class="fa-sharp fa-solid fa-circle-plus " style="color: black;"></i></button>
<div class="flex-fill"></div>
<button class="btn btn-primary" style="width:50px;height:30px;" onclick="${gvc.event((e, event) => {
                            $(`.groupG-1`).toggleClass('d-none')
                            toggle = !toggle
                            glitter.setCookie('groupG-1', toggle)
                            event.stopPropagation()
                            if (toggle) {
                                $(e).html("收合")
                            } else {
                                $(e).html("展開")
                            }
                        })}">${(glitter.getCookieByName('groupG-1') !== "true") ? `展開` : `收合`}</button>
</li>`
                    })()
                },
                {
                    title: `Script標籤`,
                    option: scriptItems,
                    html: (() => {
                        let toggle = glitter.getCookieByName('groupG-2') === "true"
                        return `<li class="align-items-center list-group-item list-group-item-action border-0 py-2 px-4  position-relative d-flex text-dark" 
style="background:lightgrey;"
onclick="${gvc.event(() => {
                            glitter.setCookie('lastSelect', '');
                            viewModel.selectItem = undefined
                            viewModel.selectContainer = (viewModel.data! as any).config
                            gvc.notifyDataChange(createID)
                        })}"
>Script 資源<button class="rounded-circle btn-warning  btn  ms-2 d-flex align-items-center justify-content-center p-0" style="height: 25px;width: 25px;"
onclick="${gvc.event((e, event) => {
                            event.stopPropagation();
                            glitter.setCookie('groupG-2', 'true')
                            glitter.openDiaLog('dialog/cadd-script-Dialog.js', 'addScript', {
                                callback: (data: any) => {
                                    (viewModel.data! as any).config.push(data);
                                    glitter.setCookie('lastSelect', data.id);
                                    gvc.notifyDataChange(createID)
                                },
                                appName: gBundle.appName
                            });
                        })}">
<i class="fa-sharp fa-solid fa-circle-plus " style="color: black;"></i></button>
<div class="flex-fill"></div>
<button class="btn btn-primary" style="width:50px;height:30px;" onclick="${gvc.event((e, event) => {
                            $(`.groupG-2`).toggleClass('d-none')
                            toggle = !toggle
                            glitter.setCookie('groupG-2', toggle)
                            event.stopPropagation()
                            if (toggle) {
                                $(e).html("收合")
                            } else {
                                $(e).html("展開")
                            }
                        })}">${(glitter.getCookieByName('groupG-2') !== "true") ? `展開` : `收合`}</button>
</li>`
                    })()
                },
                {
                    title: `觸發事件`,
                    option: triggerItems,
                    html: (() => {
                        let toggle = glitter.getCookieByName('groupG-3') === "true"
                        return `<li class="align-items-center list-group-item list-group-item-action border-0 py-2 px-4  position-relative d-flex text-dark" 
style="background:lightgrey;"
onclick="${gvc.event(() => {
                            glitter.setCookie('lastSelect', '');
                            viewModel.selectItem = undefined
                            viewModel.selectContainer = (viewModel.data! as any).config
                            gvc.notifyDataChange(createID)
                        })}"
>觸發事件<button class="rounded-circle btn-warning  btn  ms-2 d-flex align-items-center justify-content-center p-0" style="height: 25px;width: 25px;"
onclick="${gvc.event((e, event) => {
                            glitter.setCookie('groupG-3', 'true')
                            event.stopPropagation();
                            const id = glitter.getUUID();
                            (viewModel.data! as any).config.push({
                                "id": id,
                                "data": {"triggerTime": "first", "clickEvent": {}},
                                "type": "code",
                                "label": "代碼區塊",
                                "js": "$style1/official.js",
                                "index": 2,
                                "css": {"style": {}, "class": {}},
                                "refreshAllParameter": {},
                                "refreshComponentParameter": {}
                            });
                            glitter.setCookie('lastSelect', id);
                            gvc.notifyDataChange(createID)
                        })}">
<i class="fa-sharp fa-solid fa-circle-plus " style="color: black;"></i></button>
<div class="flex-fill"></div>
<button class="btn btn-primary" style="width:50px;height:30px;" onclick="${gvc.event((e, event) => {
                            $(`.groupG-3`).toggleClass('d-none')
                            toggle = !toggle
                            glitter.setCookie('groupG-3', toggle)
                            event.stopPropagation()
                            if (toggle) {
                                $(e).html("收合")
                            } else {
                                $(e).html("展開")
                            }
                        })}">${(glitter.getCookieByName('groupG-3') !== "true") ? `展開` : `收合`}</button>
</li>`
                    })()
                },
                {
                    title: `HTML區塊`,
                    option: items,
                    html: `
<li class="align-items-center list-group-item list-group-item-action border-0 py-2 px-4  position-relative d-flex text-dark" 
style="
background:lightgrey;;
"
onclick="${gvc.event(() => {
                        glitter.setCookie('lastSelect', '');
                        viewModel.selectItem = undefined
                        viewModel.selectContainer = (viewModel.data! as any).config
                        gvc.notifyDataChange(createID)
                    })}"
>HTML區塊<button class="rounded-circle btn-warning  btn  ms-2 d-flex align-items-center justify-content-center p-0" style="height: 25px;width: 25px;"
onclick="${gvc.event((e, event) => {
                        glitter.openDiaLog('dialog/caddDialog.js', 'caddDialog', {
                            callback: (data: any) => {
                                (viewModel.data! as any).config.push(data);
                                glitter.setCookie('lastSelect', data.id);
                                gvc.notifyDataChange(createID)
                            },
                            appName: gBundle.appName
                        });
                    })}">
<i class="fa-sharp fa-solid fa-circle-plus " style="color: black;"></i></button></li>
`
                }
            ];
            items = items.filter((dd, index) => {
                dd.index=index
                if (selectType === 'style') {
                    return [0, 1].indexOf(index) !== -1
                } else if (selectType === 'script') {
                    return [0, 2, 3].indexOf(index) !== -1
                } else {
                    return [0, 4].indexOf(index) !== -1
                }
            })
            const vid = glitter.getUUID();

            function clearSelect() {
                items.map((dd) => {
                    function clear(dd: any) {
                        dd.select = false;
                        if (dd.option) {
                            dd.option.map((d2: any) => {
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
                    let dragm = {
                        start: 0,
                        end: 0,
                        div: ''
                    };
                    let indexCounter = 9999;
                    return items.map((dd, index) => {
                        return `<ul class="list-group list-group-flush border-bottom   mx-n4 m-0">
                                                    ${dd.html}
                                                        ${(() => {
                            function convertInner(d2: any, inner: boolean, parentCallback: () => void = () => {
                            }, dragOption: {
                                dragId: string,
                                changeIndex: (n1: number, n2: number) => void,
                                index: number
                            }) {
                                function checkOptionSelect(data: any) {
                                    if (data.select) {
                                        return true;
                                    } else if (data.option) {
                                        for (const a of data.option) {
                                            if (checkOptionSelect(a)) {
                                                data.select = true;
                                                return true;
                                            }
                                        }
                                    }
                                    return false;
                                }

                                if (d2.option) {
                                    const id = glitter.getUUID();
                                    const dragID2 = glitter.getUUID();
                                    const toggleID = glitter.getUUID()
                                    let act = checkOptionSelect(d2);

                                    const toggle = gvc.event((e, event) => {
                                        const needUpdate = d2.select;
                                        clearSelect();
                                        d2.select = true;
                                        act = !act;
                                        ($(`#${id}`) as any).slideToggle('slow');
                                        gvc.notifyDataChange(toggleID);
                                        parentCallback();
                                        d2.click();
                                        gvc.notifyDataChange(['htmlGenerate', 'showView']);
                                        if (!needUpdate) {
                                            setTimeout(() => {
                                                gvc.notifyDataChange(vid);
                                            }, 250);
                                        }
                                        event.stopPropagation()
                                    })

                                    return `<li class="ms-2 list-group-item list-group-item-action border-0 py-2 px-4 ${
                                        checkOptionSelect(d2) ? `active` : ``
                                    } position-relative d-flex align-items-center groupG-${dd.index} d-none"
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
                                                            onclick="${gvc.event((e, event) => {
                                        const needUpdate = d2.select;
                                        clearSelect();
                                        d2.select = true;
                                        gvc.notifyDataChange(toggleID);
                                        parentCallback();
                                        d2.click();
                                        gvc.notifyDataChange(['htmlGenerate', 'showView']);
                                        if (!needUpdate) {
                                            setTimeout(() => {
                                                gvc.notifyDataChange(vid);
                                            }, 250);
                                        }
                                        event.stopPropagation()
                                    })}"
                                                            >
                                                            ${gvc.bindView(() => {
                                        return {
                                            bind: toggleID,
                                            view: () => {
                                                return (act) ? `<i class="fa-solid fa-caret-up me-2" onclick="${toggle}"></i>` : `
                                                              <i class="fa-sharp fa-solid fa-caret-down me-2" onclick="${toggle}"></i>
                                                            `
                                            },
                                            divCreate: {}
                                        }
                                    })}
                                                          
                                                                      ${d2.text}
  <button  class="rounded-circle btn-warning  btn  ms-2 d-flex align-items-center justify-content-center p-0" style="height: 25px;width: 25px;" onclick="${gvc.event((e, event) => {
                                        event.stopPropagation();
                                        glitter.openDiaLog('dialog/caddDialog.js', 'caddDialog', {
                                            callback: (data: any) => {
                                                d2.setting.push(data);
                                                glitter.setCookie('lastSelect', data.id);
                                                gvc.notifyDataChange(createID)
                                            },
                                            appName: gBundle.appName
                                        });
                                    })}">
<i class="fa-sharp fa-solid fa-circle-plus " style="color:black;" ></i>
</button>
<div class="flex-fill"></div>
<i class="fa-regular fa-copy me-2  ${d2.select ? `` : `d-none`}" onclick="${gvc.event((e, event) => {
                                        d2.copy()
                                    })}"></i>
<i class="fa-regular fa-trash-can ${d2.select ? `` : `d-none`}" style="color:white;" onclick="${gvc.event((e, event) => {
                                        event.stopPropagation();
                                        d2.minus()
                                    })}"></i>

                                                                     </li>
                                                                <ul class="collapse multi-collapse ${checkOptionSelect(d2) ? `show` : ''} position-relative ps-2" style="margin-left: 0px;" id="${id}" >
                                                                    ${
                                        gvc.map(
                                            d2.option.map((d4: any, index: number) => {
                                                return convertInner(d4, true, () => {
                                                    d2.select = true;
                                                    parentCallback();
                                                }, {
                                                    dragId: dragID2,
                                                    index: d4.index,
                                                    changeIndex: (n1, n2) => {

                                                        swapArr(d4.dataArray, n1, n2);
                                                        swapArr(d2.option, n1, n2);
                                                        gvc.notifyDataChange(createID);
                                                        ;
                                                    }
                                                });
                                            })
                                        )
                                    }
</ul>
                                                                    `;
                                } else {
                                    return `<li class="ms-2 align-items-center list-group-item list-group-item-action border-0 py-2 px-4 ${
                                        d2.select ? `${(inner) ? `bg-warning` : `active`}` : ``
                                    } position-relative d-flex groupG-${dd.index} d-none"
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
                                        d2.copy()
                                    })}"></i>
<i class="fa-regular fa-trash-can ${d2.select ? `` : `d-none`}" onclick="${gvc.event((e, event) => {
                                        event.stopPropagation();
                                        d2.minus()
                                    })}"></i>
                                                                 </li>`;
                                }
                            }

                            const dragid = glitter.getUUID();
                            return gvc.map(
                                dd.option.map((d2: any, index: number) => {
                                    return convertInner(d2, false, () => {
                                    }, {
                                        dragId: dragid,
                                        index: d2.index,
                                        changeIndex: (n1, n2) => {
                                            swapArr(d2.dataArray, n1, n2);
                                            swapArr(dd.option, n1, n2);
                                            gvc.notifyDataChange(createID);
                                        }
                                    });
                                })
                            );
                        })()}
                                                    </ul>`
                    }).join(`
                    <ul class="my-0 bg-white  mx-n4 m-0" style="height:1px;"></ul>
                    `);
                },
                divCreate: {
                    class: `swiper-slide h-auto`,
                },
                onCreate: () => {
                    if (glitter.getCookieByName('groupG-1') === "true") {
                        $(`.groupG-1`).toggleClass('d-none');
                    }
                    if (glitter.getCookieByName('groupG-2') === "true") {
                        $(`.groupG-2`).toggleClass('d-none');
                    }
                    if (glitter.getCookieByName('groupG-3') === "true") {
                        $(`.groupG-3`).toggleClass('d-none');
                    }
                    $(`.groupG-4`).removeClass('d-none');
                }
            };
        })
    }

    public static right(gvc: GVC, viewModel: any, createID: string, gBundle: any) {
        const glitter = gvc.glitter
        return gvc.bindView(() => {
            let haveAdd = true;
            return {
                bind: `htmlGenerate`,
                view: () => {
                    let hoverList: string[] = [];
                    if (viewModel.selectItem !== undefined) {
                        hoverList.push((viewModel.selectItem as any).id);
                    }
                    const htmlGenerate = new glitter.htmlGenerate((viewModel.data! as any).config, hoverList, undefined, true);
                    (window as any).editerData = htmlGenerate;
                    (window as any).page_config = (viewModel.data! as any).page_config
                    const json = JSON.parse(JSON.stringify((viewModel.data! as any).config));
                    json.map((dd: any) => {
                        dd.refreshAllParameter = undefined;
                        dd.refreshComponentParameter = undefined;
                    });
                    if (!viewModel.selectItem) {
                        return `<div class="position-absolute w-100 top-50 d-flex align-items-center justify-content-center flex-column translate-middle-y">
<iframe src="https://embed.lottiefiles.com/animation/84663" class="w-100" style="width: 400px;height: 400px"></iframe>
<h3>請於左側選擇元件編輯</h3>
</div>`
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
                            } else {
                                return undefined;
                            }
                        })(),
                        deleteEvent: () => {
                            viewModel.selectItem = undefined
                            gvc.notifyDataChange(createID);
                        }
                    });
                },
                divCreate: {},
                onCreate: () => {
                    setTimeout(() => {
                        $('#jumpToNav').scrollTop(parseInt(glitter.getCookieByName('jumpToNavScroll'), 10) ?? 0)
                    }, 1000)
                }
            };
        })
    }

    public static center(viewModel: any, gvc: GVC) {
        if (viewModel.type === ViewType.mobile) {
            return `<div class="d-flex align-items-center justify-content-center flex-column mx-auto" style="width: 414px;height: calc(100vh - 20px);padding-top: 0px;">
                 <div class="bg-white" style="width:414px;height: calc(100% - 60px);">
                 <iframe class="w-100 h-100 rounded" src="index.html?type=htmlEditor&page=${gvc.glitter.getUrlParameter('page')}"></iframe>
                </div></div>`
        } else {
            return `<div class="d-flex align-items-center justify-content-center flex-column" style="width: calc(100% - 20px);margin-left:10px;height: calc(100vh - 20px);padding-top: 20px;">
                 <div class="bg-white" style="width:100%;height: calc(100% - 50px);">
                 <iframe class="w-100 h-100 rounded" src="index.html?type=htmlEditor&page=${gvc.glitter.getUrlParameter('page')}"></iframe>
                </div></div>`
        }
    }

    public static index = '0'
}

function swapArr(arr: any, index1: number, index2: number) {
    const data = arr[index1];
    arr.splice(index1, 1);
    arr.splice(index2, 0, data);
}