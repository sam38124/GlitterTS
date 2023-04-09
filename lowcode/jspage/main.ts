import {init} from '../glitterBundle/GVController.js';
import {Editor} from './editor.js';
import {ApiPageConfig} from '../api/pageConfig.js';
import {Swal} from '../modules/sweetAlert.js';
import {Lan} from './language.js';
import {HtmlGenerate} from '../glitterBundle/module/Html_generate.js';
import {config} from "../config.js";

init((gvc, glitter, gBundle) => {
    let mode = glitter.getCookieByName('EditMode') ?? 'gui';
    gvc.addStyle(`
    .swal2-title {
    color:black!important;
    }
    `);

    function swapArr(arr: any, index1: number, index2: number) {
        const data = arr[index1];
        arr.splice(index1, 1);
        arr.splice(index2, 0, data);
    }

    let loading = true;
    const api = new ApiPageConfig();
    const viewModel: {
        dataList: any
        data: any
        loading: boolean,
        selectItem: any,
        initialJS: { name: string, src: { official: string, open: boolean }, route: string }[],
        pluginList: { name: string, src: { staging: string, official: string, open: boolean }, route: string }[],
        initialStyle:{ name: string, src: {src:string}, route: string }[],
        initialCode: any,
        initialList:any,
        homePage:string
    } = {
        dataList: undefined,
        data: undefined,
        loading: true,
        selectItem: undefined,
        initialStyle:[],
        pluginList: [],
        initialJS: [],
        initialCode: '',
        initialList:[],
        homePage:''
    };
    const swal = new Swal(gvc);
    const doc = new Editor(gvc, viewModel);
    const createID = glitter.getUUID();

    async function lod() {
        swal.loading('加載中...');
        const waitGetData = [
            (async () => {
                return await new Promise(async (resolve) => {
                    const data = await ApiPageConfig.getPage(gBundle.appName)
                    if (data.result) {
                        data.response.result.map((dd: any) => {
                            dd.page_config = dd.page_config ?? {}
                            if (glitter.getUrlParameter('page') == undefined) {
                                glitter.setUrlParameter('page', dd.tag)
                            }
                            if (dd.tag === glitter.getUrlParameter('page')) {
                                viewModel.data = dd;
                            }
                            return dd;
                        });

                        viewModel.data = viewModel.data ?? data.response.result[0];
                        viewModel.dataList = data.response.result;
                        if (!data) {
                            resolve(false);
                        } else {
                            resolve(true);
                        }
                    }
                })
            }),
            (async () => {
                return await new Promise(async (resolve) => {
                    const data = await ApiPageConfig.getPlugin(gBundle.appName)
                    if (data.result) {
                        viewModel.initialList=data.response.data.initialList;
                        viewModel.initialJS = data.response.data.eventPlugin;
                        viewModel.pluginList = data.response.data.pagePlugin;
                        viewModel.initialStyle=data.response.data.initialStyle;
                        viewModel.initialCode = data.response.data.initialCode ?? "";
                        viewModel.homePage=data.response.data.homePage ?? ""
                        async function load() {
                            for (const a of viewModel.initialJS) {
                                await new Promise((resolve) => {
                                    glitter.addMtScript([{
                                        src: glitter.htmlGenerate.resourceHook(a.src.official) + `?resource=${a.src.official}`,
                                        type: 'module'
                                    }], () => {
                                        resolve(true);
                                    }, () => {
                                        resolve(true);
                                    });
                                })
                            }
                            resolve(true);
                        }

                        await load()

                    } else {
                        resolve(false);
                    }
                }).then((data) => {
                    return data;
                });
            })
        ];
        for (const a of waitGetData) {
            if (!await a()) {
                await lod();

                return;
            }
        }
        swal.close();
        viewModel.loading = false;
        gvc.notifyDataChange(createID);
    }


    glitter.htmlGenerate.saveEvent = () => {

        glitter.setCookie("jumpToNavScroll", $(`#jumpToNav`).scrollTop())
        swal.loading('更新中...');

        async function saveEvent() {
            const waitSave = [
                (async () => {
                    let haveID: string[] = [];

                    function getID(set: any) {
                        set.map((dd: any) => {
                            if (haveID.indexOf(dd.id) !== -1) {
                                dd.id = glitter.getUUID();
                            }
                            haveID.push(dd.id);
                            if (dd.type === 'container') {
                                dd.data.setting = dd.data.setting ?? [];
                                getID(dd.data.setting);
                            }
                        });
                    }
                    getID((viewModel.data as any).config);
                    return new Promise(async resolve => {
                        const api = await ApiPageConfig.setPage({
                            id:viewModel.data.id,
                            appName: gBundle.appName,
                            tag: (viewModel.data as any).tag,
                            name: (viewModel.data as any).name,
                            config: (viewModel.data as any).config,
                            group:(viewModel.data as any).group,
                            page_config: viewModel.data.page_config
                        })
                        resolve(api.result)
                    });
                }),
                (async () => {
                    return new Promise(async resolve => {
                        const api = await ApiPageConfig.setPlugin(gBundle.appName, {
                            pagePlugin: viewModel.pluginList,
                            eventPlugin: viewModel.initialJS,
                            initialStyle:viewModel.initialStyle,
                            initialCode: viewModel.initialCode,
                            homePage:viewModel.homePage,
                            initialList:viewModel.initialList
                        })
                        resolve(api.result)
                    });

                })
            ];
            for (const a of waitSave) {
                if (!await a()) {
                    return;
                }
            }
            swal.nextStep(`更新成功`, () => {
            });
            gvc.notifyDataChange(createID);
        }

        saveEvent().then(r => {
        });
    };
    lod()


    return {
        onCreateView: () => {
            return gvc.bindView({
                bind: createID,
                view: () => {
                    if (viewModel.loading) {
                        return ``;
                    } else {
                        try {
                            return doc.create(`<div
                            class="offcanvas-body swiper scrollbar-hover overflow-hidden w-100 p-4"
                            data-swiper-options='{
                                "direction": "vertical",
                                "slidesPerView": "auto",
                                "freeMode": true,
                                "scrollbar": {
                                "el": ".swiper-scrollbar"
                                },
                                "mousewheel": true
                            }'
                        >
                            <div class="swiper-wrapper">
                                ${gvc.bindView(() => {
                                    let items: any[] = [];

                                    function addItems(dd: any, array: any) {
                                        if (glitter.getCookieByName('lastSelect') === dd.id) {
                                            viewModel.selectItem = dd;
                                        }
                                        if (dd.type === 'container') {
                                            return {
                                                'text': dd.label, option: dd.data.setting.map((d4: any) => {
                                                    return addItems(d4, dd.data.setting);
                                                }),
                                                click: () => {
                                                    glitter.setCookie('lastSelect', dd.id);
                                                    viewModel.selectItem = dd;
                                                    gvc.notifyDataChange(['htmlGenerate', 'showView']);
                                                    gvc.notifyDataChange('showView');
                                                },
                                                dataArray: array,
                                                setting: dd.data.setting,
                                                select: glitter.getCookieByName('lastSelect') === dd.id
                                            };
                                        } else {
                                            return {
                                                'text': dd.label,
                                                click: () => {
                                                    viewModel.selectItem = dd;
                                                    glitter.setCookie('lastSelect', dd.id);
                                                    gvc.notifyDataChange(['htmlGenerate', 'showView']);
                                                    gvc.notifyDataChange('showView');
                                                },
                                                dataArray: array,
                                                select: glitter.getCookieByName('lastSelect') === dd.id
                                            };
                                        }
                                    }

                                    (viewModel.data! as any).config.map((d3: any) => {
                                        items.push(addItems(d3, (viewModel.data! as any).config));
                                    });
                                    items = [
                                        {
                                            title: '首頁',
                                            option: items
                                        }
                                    ];
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
                                            let html = '';
                                            let dragm = {
                                                start: 0,
                                                end: 0,
                                                div: ''
                                            };
                                            let indexCounter = 9999;
                                            items.map((dd, index) => {
                                                html += `<h3 class="fs-lg">${dd.title}<button class=" btn-warning   ms-3 " style="height: 30px;width: 30px;"
onclick="${gvc.event(() => {
                                                    glitter.openDiaLog('dialog/caddDialog.js', 'caddDialog', {
                                                        callback: (data: any) => {
                                                            (viewModel.data! as any).config.push(data);
                                                            glitter.setCookie('lastSelect', data.id);
                                                            gvc.notifyDataChange(createID)
                                                        },
                                                        appName: gBundle.appName
                                                    });
                                                })}">
<i class="fa-sharp fa-solid fa-circle-plus " style="color: black;"></i>
</button></h3>
                                                    <ul class="list-group list-group-flush border-bottom pb-3 mb-4 mx-n4">
                                                        ${(() => {
                                                    function convertInner(d2: any, inner: boolean, parentCallback: () => void = () => {
                                                    }, dragOption: {
                                                        dragId: string,
                                                        changeIndex: (n1: number, n2: number) => void,
                                                        index: number
                                                    }) {
                                                        const hoverID = glitter.getUUID();

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

                                                        let onMouselem = 'first';
                                                        if (d2.option) {
                                                            const id = glitter.getUUID();
                                                            const dragID2 = glitter.getUUID();
                                                            return `<li
                                                                    class="list-group-item list-group-item-action border-0 py-2 px-4 ${
                                                                checkOptionSelect(d2) ? `active` : ``
                                                            } position-relative"
                                                                    onclick="${gvc.event(() => {
                                                                const needUpdate = d2.select;
                                                                clearSelect();
                                                                d2.select = true;
                                                                ($(`#${id}`) as any).collapse('toggle');
                                                                parentCallback();
                                                                d2.click();
                                                                gvc.notifyDataChange(['htmlGenerate', 'showView']);
                                                                ;
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
                                                                      <button class=" btn-warning round  ms-3 " style="height: 30px;color:black;width: 30px;" onclick="${gvc.event(() => {
                                                                glitter.openDiaLog('jsPage/lowcode/dialog/caddDialog.js', 'caddDialog', {
                                                                    callback: (data: any) => {
                                                                        console.log(d2);
                                                                        d2.setting.push(data);
                                                                        glitter.setCookie('lastSelect', data.id);
                                                                        gvc.notifyDataChange(createID)
                                                                    }
                                                                });
                                                            })}">
<i class="fa-sharp fa-solid fa-circle-plus " ></i>
</button>
                                                                     </li>
                                                                <ul class="collapse multi-collapse ${checkOptionSelect(d2) ? `show` : ''} position-relative" style="margin-left: 0px;" id="${id}">
                                                                    ${
                                                                gvc.map(
                                                                    d2.option.map((d4: any, index: number) => {
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
                                                                    })
                                                                )
                                                            }
</ul>
                                                                    `;
                                                        } else {

                                                            return `<li class=" list-group-item list-group-item-action border-0 py-2 px-4 ${
                                                                d2.select ? `${(inner) ? `bg-warning` : `active`}` : ``
                                                            } position-relative"
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
                                                                 </li>`;
                                                        }
                                                    }

                                                    const dragid = glitter.getUUID();
                                                    return gvc.map(
                                                        dd.option.map((d2: any, index: number) => {
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
                                                        })
                                                    );
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
                                })}
                            </div>
                            <div class="swiper-scrollbar end-0"></div>
                        </div>`,
                                gvc.bindView(() => {
                                    let haveAdd = true;
                                    return {
                                        bind: `htmlGenerate`,
                                        view: () => {
                                            let hoverList: string[] = [];
                                            if (viewModel.selectItem !== undefined) {
                                                hoverList.push((viewModel.selectItem as any).id);
                                            }
                                            const htmlGenerate = new glitter.htmlGenerate((viewModel.data! as any).config, hoverList);
                                            (window as any).editerData = htmlGenerate;
                                            (window as any).page_config = (viewModel.data! as any).page_config
                                            const json = JSON.parse(JSON.stringify((viewModel.data! as any).config));
                                            json.map((dd: any) => {
                                                dd.refreshAllParameter = undefined;
                                                dd.refreshComponentParameter = undefined;
                                            });
                                            glitter.setCookie('EditMode', mode);
                                            if(!viewModel.selectItem){
                                                return  `<div class="position-absolute w-100 top-50 d-flex align-items-center justify-content-center flex-column translate-middle-y">
<iframe src="https://embed.lottiefiles.com/animation/84663" class="w-100" style="width: 400px;height: 400px"></iframe>
<h3>請於左側選擇元件編輯</h3>
</div>`
                                            }
                                            return `<div class="d-none w-100 d-flex border-bottom pb-2 mb-2 align-items-center justify-content-center">
                          <div class="btn-group dropdown d-none" style=width:150px;">
  <button type="button" class="btn btn-outline-secondary rounded" onclick="${gvc.event(() => {
                                                $('#selectMd').toggleClass('show')
                                            })}">
${(() => {
                                                switch (mode) {
                                                    case 'gui':
                                                        return Lan.getLan(3);
                                                    case 'plugin':
                                                        return Lan.getLan(4);
                                                    case 'initial':
                                                        return Lan.getLan(5);
                                                    case 'initialCode':
                                                        return Lan.getLan(6);
                                                    case 'defaultStyle':
                                                        return Lan.getLan(7);
                                                }
                                            })()}
  </button>
 <div class="dropdown-menu d-none" id="selectMd" style="margin-top: 50px;">
 <a  class="dropdown-item" onclick="${gvc.event(() => {
                                                mode = 'gui';
                                                gvc.notifyDataChange(['htmlGenerate', 'showView']);
                                            })}">${Lan.getLan(3)}</a>
 <a  class="dropdown-item" onclick="${gvc.event(() => {
                                                mode = 'defaultStyle';
                                                gvc.notifyDataChange(['htmlGenerate', 'showView']);
                                            })}">${Lan.getLan(7)}</a>
 <a class="dropdown-item" onclick="${gvc.event(() => {
                                                mode = 'plugin';
                                                gvc.notifyDataChange(['htmlGenerate', 'showView']);
                                                ;
                                            })}">${Lan.getLan(4)}</a>
 <a class="dropdown-item" onclick="${gvc.event(() => {
                                                mode = 'initial';
                                                gvc.notifyDataChange(['htmlGenerate', 'showView']);
                                            })}">${Lan.getLan(5)}</a>
 <a class="dropdown-item" onclick="${gvc.event(() => {
                                                mode = 'initialCode';
                                                gvc.notifyDataChange(['htmlGenerate', 'showView']);
                                            })}">${Lan.getLan(6)}</a>
 </div>
</div>

                       <div class="flex-fill"></div>
                       ${(() => {
                                                switch (mode) {
                                                    case 'gui':
                                                        return `<div style="cursor: pointer;" class="border p-1 rounded" onclick="${gvc.event(() => {
                                                            mode = 'code';
                                                            gvc.notifyDataChange(['htmlGenerate', 'showView']);
                                                            ;
                                                        })}"> <span class="text-white fw-bold">GUI</span>
                       <i class="fa-solid fa-arrows-repeat ms-2 text-white"></i></div>`;
                                                    case `code`:
                                                        return `<div style="cursor: pointer;" class="border p-1 rounded" onclick="${gvc.event(() => {
                                                            mode = 'gui';
                                                            gvc.notifyDataChange(['htmlGenerate', 'showView']);
                                                            ;
                                                        })}">
                         <span class="text-white fw-bold">Code</span>
                       <i class="fa-solid fa-arrows-repeat ms-2 text-white"></i>
</div>`;
                                                    case `plugin`:
                                                        return `
                                                <div style="cursor: pointer;" class="border p-1 rounded" onclick="${gvc.event(() => {
                                                            glitter.setCookie('pluginPath', (glitter.getCookieByName('pluginPath') == 'staging') ? `official` : 'staging');
                                                            gvc.notifyDataChange(['htmlGenerate', 'showView']);
                                                        })}"></div>
                                                `;
                                                    case `initialCode`:
                                                    case `initial`:
                                                    case `defaultStyle`:
                                                        return ``;
                                                }
                                            })()}
</div>
   ${(() => {
                                                if (!haveAdd && mode !== 'plugin') {
                                                    return `<div class="d-flex align-items-center justify-content-center">
<div class="spinner-border text-dark" role="status">
  <span class="visually-hidden">Loading...</span>
</div>
</div>`;
                                                }
                                                switch (mode) {
                                                    case 'gui':
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
                                                                viewModel.selectItem=undefined
                                                                gvc.notifyDataChange(createID);
                                                            }
                                                        });
                                                }
                                            })()}
`;
                                        },
                                        divCreate: {},
                                        onCreate: () => {
                                            setTimeout(() => {
                                                $('#jumpToNav').scrollTop(parseInt(glitter.getCookieByName('jumpToNavScroll'), 10) ?? 0)
                                            }, 1000)
                                        }
                                    };
                                })
                            );
                        } catch (e) {
                            console.log(e)
                            return ``
                        }

                    }
                },
                divCreate: {},
                onCreate: () => {
                    $("#jumpToNav").scroll(function () {
                        glitter.setCookie("jumpToNavScroll", $(`#jumpToNav`).scrollTop())
                    });
                }
            });
        },
        onCreate: () => {

        },
    };
});


